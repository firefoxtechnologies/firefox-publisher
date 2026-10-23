"use client";

// Scroll-driven stepper. A tall track holds a sticky, viewport-high panel: as
// the page scrolls through the track, each point's rail fills in turn and the
// picture beside it changes to match.
//
// Local changes to the original (this project has no Tailwind, shadcn or Next):
//  - Tailwind classes and `cn` are replaced by a scoped, .sr- prefixed
//    stylesheet; next/image is a plain <img>.
//  - Takes any number of items instead of exactly three, and each item can
//    carry a short bullet list that opens while it is the current point.
//  - Progress is measured from the top of the track to its end, so the first
//    point starts filling as soon as the panel sticks.
//  - Respects prefers-reduced-motion (no fade or rail transitions).
import * as React from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

export interface ItemContent {
  title: string;
  description: string;
  /** Short list shown under the description while this is the current point. */
  bullets?: string[];
  image: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
}

export interface ScrollRevealProps extends React.ComponentProps<"div"> {
  items: ItemContent[];
  /** Scroll distance given to each point, in viewport heights. @default 0.75 */
  perItem?: number;
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const SR_CSS = `
.sr-root { position: relative; z-index: 0; isolation: isolate; width: 100%; }
.sr-sticky {
  position: sticky; top: 0; height: 100vh; display: flex; align-items: flex-start; padding-top: 96px; box-sizing: border-box;
}
.sr-grid { display: grid; grid-template-columns: 1fr; gap: 64px; width: 100%; align-items: center; }
.sr-points { display: flex; flex-direction: column; gap: 6px; }
.sr-point { display: flex; gap: 20px; }
.sr-rail { position: relative; flex: none; width: 28px; display: flex; justify-content: center; }
.sr-rail::before { content: ""; position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,.2); border-radius: 2px; }
.sr-fill { position: absolute; top: 0; width: 2px; border-radius: 2px; background: var(--grad-orange, #f28c28); }
.sr-body { padding: 2px 0 20px; opacity: .55; transition: opacity .3s ease; }
.sr-point[data-on="true"] .sr-body { opacity: 1; }
.sr-num { display: block; margin-bottom: 6px; font-size: .8rem; font-weight: 700; letter-spacing: .14em; color: var(--glacier, #f28c28); }
.sr-title { margin: 0; font-size: clamp(1.25rem, 2vw, 1.7rem); font-weight: 700; letter-spacing: -.02em; line-height: 1.2; color: #fff; }
.sr-desc { margin: 0; max-width: 46ch; font-size: 1rem; line-height: 1.6; color: #c9d6e8; }
.sr-more { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .4s ease; }
.sr-point[data-current="true"] .sr-more { grid-template-rows: 1fr; }
.sr-more > div { overflow: hidden; }
.sr-more .sr-desc { margin-top: 8px; }
.sr-more .ticks { margin: 12px 0 0; }
.sr-more .ticks li { color: #eaf3fd; font-size: .95rem; }
.sr-media { display: none; position: relative; height: min(64vh, 540px); }
.sr-media img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 7px; opacity: 0;
  transition: opacity .45s ease; box-shadow: 0 30px 60px -30px rgba(18,41,74,.55);
}
.sr-media img[data-on="true"] { opacity: 1; }
.sr-step { position: absolute; left: 18px; bottom: 18px; padding: 6px 14px; border-radius: 7px; font-size: .78rem; font-weight: 700; letter-spacing: .08em; color: #fff; background: var(--grad-orange, #f28c28); z-index: 2; }
@media (min-width: 960px) {
  .sr-grid { grid-template-columns: 1.05fr 1fr; gap: 72px; }
  .sr-media { display: block; }
}
@media (prefers-reduced-motion: reduce) {
  .sr-body, .sr-more, .sr-media img { transition: none; }
}
`;

export default function ScrollRevealContent({
  items,
  perItem = 0.75,
  className,
  style,
  ...props
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const count = items.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setProgress(clamp(p, 0, 1)),
  );

  const current = clamp(Math.floor(progress * count), 0, count - 1);

  return (
    <div
      ref={ref}
      className={"sr-root" + (className ? " " + className : "")}
      style={{ height: `${100 + count * perItem * 100}vh`, ...style }}
      {...props}
    >
      <style>{SR_CSS}</style>
      <div className="sr-sticky">
        <div className="sr-grid">
          <div className="sr-points">
            {items.map((item, i) => {
              const start = i / count;
              const end = (i + 1) / count;
              const fill = clamp((progress - start) / (end - start), 0, 1);
              return (
                <div
                  key={item.title}
                  className="sr-point"
                  data-on={fill > 0}
                  data-current={i === current}
                >
                  <div className="sr-rail" aria-hidden="true">
                    <div className="sr-fill" style={{ height: `${fill * 100}%` }} />
                  </div>
                  <div className="sr-body">
                    <span className="sr-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="sr-title">{item.title}</h3>
                    <div className="sr-more">
                      <div>
                        <p className="sr-desc">{item.description}</p>
                        {item.bullets?.length ? (
                          <ul className="ticks">
                            {item.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sr-media" aria-hidden="false">
            {items.map((item, i) => (
              <img
                key={item.image.url + i}
                src={item.image.url}
                width={item.image.width}
                height={item.image.height}
                alt={i === current ? item.image.alt : ""}
                data-on={i <= current && i === current}
                loading="lazy"
              />
            ))}
            <span className="sr-step">
              Step {current + 1} of {count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
