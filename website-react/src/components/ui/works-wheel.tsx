"use client";

// A portfolio index built as a wheel you turn.
//
// At rest the work sits in a ring around a title, each card tangent to the
// circle. The first notch of scroll blows the ring open into a vertical drum:
// the card at the front lies flat and full size, the ones above and below
// rotate away into hard perspective and run off the top and bottom of the
// frame. Keep turning and the drum carries the next piece round to the front.
//
// The whole thing is one number - `turn` - read by a single rAF pass that writes
// transforms straight to the DOM. 0 is the ring, 1 is the drum with item 0 at
// the front, and every whole number after that is one more item turned past.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes and `cn` are replaced by a scoped, .ww- prefixed
//    stylesheet driven by CSS variables (--ww-fg, --ww-muted, --ww-font-*).
//  - `as` / `hrefProp` let the host render cards as router links.
//  - `renderCaption` replaces the plain title beside the front card, so it can
//    carry a heading, body text and a button.
//  - A drag no longer fires the card's link, and touch uses touch-action: pan-y
//    so a swipe over the wheel still scrolls the page.
import * as React from "react";

export interface WorksWheelItem {
  /** Project name. Shown beside the front card and in the index. */
  title: string;
  /** Cover art. Any src an <img> takes. */
  image: string;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default undefined */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default undefined */
  action?: string;
  /** Element used for linked cards, e.g. a router Link. @default "a" */
  as?: React.ElementType;
  /** Prop that carries the URL on `as`: "href" for <a>, "to" for router Links. @default "href" */
  hrefProp?: string;
  /** Replaces the title beside the front card. */
  renderCaption?: (item: WorksWheelItem, index: number) => React.ReactNode;
  /** Called with the index of the front card as it changes. */
  onActiveChange?: (index: number) => void;
  /** Extra classes on the root surface. @default undefined */
  className?: string;
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.38; // front card height, of the stage
const CARD_MAX_W = 0.34; // ... but never wider than this much of the stage
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
/* The drum alone hangs the work on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius; nothing else
   makes the difference between a stack of cards and a wheel seen side on. */
const BOW = 1.82;
const TITLE = 0.17; // ring label
/** Items either side of the front still worth drawing. Past this a card is
    edge-on, and further round it would stack up on the vanishing point. */
const CULL = 1.6;

/** How much of a wheel-notch or a dragged pixel counts as one item. */
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
/** Quiet time after the last wheel event before the wheel settles on an item. */
const SETTLE = 140;
/** Fraction of the remaining distance closed each frame. 1 = no smoothing. */
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** How far left the arc has carried something that has turned `drumDeg` off the
    front. Zero at the front, so the piece being read stays centred. */
const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

/** Both states in one chain: the ring terms fall away as `m` reaches the drum,
    and the drum terms are still zero while the ring is up. The bow is applied
    first, in the wheel's own plane, so it slides the card sideways rather than
    turning with it - and perspective still shrinks it with distance. */
function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

const WW_CSS = `
.ww-root {
  position: relative; z-index: 0; isolation: isolate; width: 100%; height: 100%; min-height: 24rem; overflow: hidden; user-select: none;
  color: var(--ww-fg, #fff); font-family: var(--ww-font-sans, system-ui, sans-serif);
}
.ww-stage { position: absolute; inset: 0; cursor: grab; touch-action: pan-y; outline: none; }
.ww-stage:active { cursor: grabbing; }
.ww-stage:focus-visible { outline: 2px solid currentColor; outline-offset: -4px; }
.ww-wheel { position: absolute; top: 50%; left: 50%; transform-style: preserve-3d; }
.ww-card { position: absolute; display: block; backface-visibility: hidden; color: inherit; text-decoration: none; }
.ww-face {
  position: relative; display: block; width: 100%; height: 100%; overflow: hidden; border-radius: 7px;
  background: rgba(255,255,255,.08); box-shadow: 0 18px 40px -18px rgba(0,0,0,.65);
}
.ww-face img { display: block; width: 100%; height: 100%; object-fit: cover; }
.ww-action {
  position: absolute; right: 12px; bottom: 12px; display: flex; align-items: center; gap: 4px; pointer-events: none;
  padding: 5px 11px; border-radius: 7px; font-size: .72rem; font-weight: 600; color: var(--ww-bg, #12294a);
  background: rgba(255,255,255,.88); backdrop-filter: blur(6px); opacity: 0; transform: translateY(4px);
  transition: opacity .2s ease, transform .2s ease;
}
.ww-card:hover .ww-action, .ww-card:focus-visible .ww-action { opacity: 1; transform: none; }
.ww-action svg { width: 10px; height: 10px; }
.ww-label {
  position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; text-align: center;
  font-family: var(--ww-font-title, inherit); font-weight: 700; letter-spacing: -.02em; line-height: 1.1; padding: 0 20%;
}
.ww-caption { position: absolute; top: 50%; left: 5%; transform: translateY(-50%); width: 26%; opacity: 0; pointer-events: none; }
.ww-caption > * { pointer-events: inherit; }
.ww-title { font-family: var(--ww-font-title, inherit); font-weight: 700; font-size: clamp(1.8rem, 3.1vw, 2.9rem); line-height: 1.12; letter-spacing: -.02em; }
.ww-index { position: absolute; top: 7.5%; right: 2.5%; margin: 0; padding: 0; list-style: none; text-align: right; line-height: 1.75; color: var(--ww-muted, rgba(255,255,255,.65)); font-size: clamp(.72rem, .9vw, .85rem); max-width: 22%; }
.ww-index button { background: none; border: 0; padding: 0; font: inherit; color: inherit; cursor: pointer; text-align: right; transition: color .2s ease; }
.ww-index button:hover { color: var(--ww-fg, #fff); }
.ww-index button:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; }
.ww-index button[aria-current="true"] { color: var(--ww-accent, #f28c28); font-weight: 600; }
@media (max-width: 640px) { .ww-index, .ww-caption { display: none; } }
`;

export function WorksWheel({
  items,
  label = "Works",
  action = "View",
  as,
  hrefProp = "href",
  renderCaption,
  onActiveChange,
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);

  // The wheel's position, and where it is heading. Only `active` is state -
  // everything else is written to the DOM, so turning the wheel is not a render.
  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);

  const notify = React.useRef(onActiveChange);
  notify.current = onActiveChange;
  React.useEffect(() => {
    notify.current?.(active);
  }, [active]);

  // Read after mount, not during render: the server has no matchMedia, and
  // branching on it inline is a hydration mismatch. Reduced motion drops the
  // easing, so the wheel lands where it is put instead of gliding there.
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    // Shrink the ring's cards until the circle reads as a closed loop rather
    // than beads on a wire, however many pieces the wheel is given.
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: Math.max(cardH * TITLE, 30),
    };
  }, [stage, count]);

  // One pass per frame: ease toward the target, then write every transform.
  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      // The drum is pulled back so its front face lands on the picture plane.
      // That set-back has to arrive with the drum, or the ring would sit at the
      // far side of the perspective and render at half its size.
      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          // Culled by distance, not by angle: at a full turn the far side comes
          // back round to face us, and everything past the neighbours lands on
          // the vanishing point in a heap.
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(m);
        // Only reachable once it is visible, so a hidden button cannot be hit.
        titleRef.current.style.pointerEvents = m > 0.7 ? "auto" : "none";
      }
      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1);
    },
    [last],
  );

  const settling = React.useRef(0);

  // Native listener, because the wheel has to be cancellable - and it only
  // cancels while it still has somewhere to go, so the page scrolls on at
  // either end instead of trapping the reader.
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      const next = target.current + event.deltaY / WHEEL_UNITS;
      if (next > 0 && next < last + 1) event.preventDefault();
      to(next);
      // A wheel gesture arrives as a burst of events with no end of its own, so
      // the rest position is whatever notch it happened to stop on. Left there
      // the drum sits between two cards - nothing at the front, and the pair
      // either side of the gap both turned half away. Settle onto an item.
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);

  const drag = React.useRef<number | null>(null);
  const dragTravel = React.useRef(0);

  const Link = as ?? "a";

  return (
    <section
      aria-label={label}
      className={"ww-root" + (className ? " " + className : "")}
      {...props}
    >
      <style>{WW_CSS}</style>
      <div
        ref={stageRef}
        className="ww-stage"
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          drag.current = event.clientY;
          dragTravel.current = 0;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return;
          dragTravel.current += Math.abs(drag.current - event.clientY);
          to(target.current + (drag.current - event.clientY) / DRAG_UNITS);
          drag.current = event.clientY;
        }}
        onPointerUp={() => {
          // Land on an item rather than between two.
          drag.current = null;
          if (target.current > 1) to(Math.round(target.current));
        }}
        // A drag that ends over a card must not also follow its link.
        onClickCapture={(event) => {
          if (dragTravel.current > 6) {
            event.preventDefault();
            event.stopPropagation();
            dragTravel.current = 0;
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
          else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
          else return;
          event.preventDefault();
        }}
      >
        <div ref={wheelRef} className="ww-wheel">
          {items.map((item, i) => {
            const Tag = (item.href ? Link : "div") as React.ElementType;
            const linkProps = item.href ? { [hrefProp]: item.href } : {};
            return (
              <Tag
                key={item.title}
                id={`works-wheel-${i}`}
                role="option"
                aria-selected={i === active}
                {...linkProps}
                ref={(node: HTMLElement | null) => {
                  cardRefs.current[i] = node;
                }}
                className="ww-card"
                draggable={false}
                tabIndex={-1}
                style={{
                  width: metrics.cardW,
                  height: metrics.cardH,
                  marginLeft: -metrics.cardW / 2,
                  marginTop: -metrics.cardH / 2,
                }}
              >
                <span className="ww-face">
                  <img src={item.image} alt={item.title} draggable={false} />
                  {action && item.href ? (
                    <span className="ww-action">
                      <svg viewBox="0 0 12 12" aria-hidden="true">
                        <path
                          d="M3 9 9 3M4 3h5v5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {action}
                    </span>
                  ) : null}
                </span>
              </Tag>
            );
          })}
        </div>
      </div>

      {/* Ring title and front-card caption trade places across the transition. */}
      <div
        ref={labelRef}
        className="ww-label"
        style={{ fontSize: metrics.title }}
        aria-hidden="true"
      >
        {label}
      </div>
      <div ref={titleRef} className="ww-caption">
        {items[active] ? (
          renderCaption ? (
            renderCaption(items[active], active)
          ) : (
            <div className="ww-title">{items[active].title}</div>
          )
        ) : null}
      </div>

      <ol className="ww-index">
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => to(i + 1)}
              aria-current={i === active ? "true" : undefined}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default WorksWheel;
