"use client";

// Scroll-driven feature story. A tall track holds one full-screen sticky panel; as
// the page scrolls through it the active slide changes: the text swaps on the left,
// the pictures slide up the frame on the right, and the whole panel eases to that
// slide's colours.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes are replaced by a scoped, .iss- prefixed stylesheet.
//  - It follows the page's own scroll instead of nesting a second scroll container,
//    so it behaves like the rest of the page (mouse, keys, touch, anchors).
//  - Slides, button and colours are props; `as` / `hrefProp` allow a router link;
//    the slide pagination bars are labelled buttons.
//  - Reduced motion turns the transitions off.
import * as React from "react";

export interface StorySlide {
  title: string;
  description: string;
  image: string;
  /** Alt text for the picture. */
  alt?: string;
  /** Panel background for this slide. */
  bgColor: string;
  /** Text colour for this slide. */
  textColor: string;
  /** Grid line colour behind the picture. Defaults to the text colour at low opacity. */
  gridColor?: string;
}

export interface ScrollingFeatureShowcaseProps {
  slides: StorySlide[];
  ctaText?: string;
  ctaHref?: string;
  /** Element for the button, e.g. a router Link. @default "a" */
  as?: React.ElementType;
  /** Prop carrying the URL on `as`: "href" for <a>, "to" for router Links. @default "href" */
  hrefProp?: string;
  /** Classes for the button so it matches the host's buttons. */
  ctaClassName?: string;
  /** Content shown at the top of the pinned panel, above both columns (e.g. a section heading). */
  header?: React.ReactNode;
  /** Scroll distance per slide, in viewport heights. @default 0.8 */
  perSlide?: number;
  className?: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const ISS_CSS = `
.iss { position: relative; width: 100%; }
.iss__panel { position: sticky; top: 0; height: 100vh; width: 100%; display: flex; flex-direction: column; align-items: stretch; justify-content: flex-start; padding-top: 84px; box-sizing: border-box;
  background-color: var(--iss-bg); color: var(--iss-fg); transition: background-color .7s ease, color .7s ease; }
.iss__head { width: 100%; max-width: 760px; margin: 0 auto; padding: 8px 24px 20px; text-align: center; }
.iss__grid { display: grid; grid-template-columns: 1fr; width: 100%; max-width: 1240px; flex: 1 1 auto; min-height: 0; margin: 0 auto; }
.iss__left { position: relative; display: flex; flex-direction: column; justify-content: center; padding: 24px clamp(20px, 5vw, 64px) 40px; }
.iss__bars { position: absolute; top: 28px; left: clamp(20px, 5vw, 64px); display: flex; gap: 8px; }
.iss__bar { height: 4px; width: 24px; padding: 0; border: 0; border-radius: 7px; cursor: pointer; background: currentColor; opacity: .2; transition: width .5s ease, opacity .5s ease; }
.iss__bar[aria-current="true"] { width: 48px; opacity: .85; }
.iss__bar:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
.iss__stage { display: grid; width: 100%; }
.iss__slide { grid-area: 1 / 1; opacity: 0; transform: translateY(40px); transition: opacity .7s ease, transform .7s ease; pointer-events: none; }
.iss__slide[data-on="true"] { opacity: 1; transform: none; pointer-events: auto; }
.iss__count { display: block; margin-bottom: 16px; font-size: .9rem; font-weight: 800; letter-spacing: .16em; color: var(--iss-accent, #d4720f); }
.iss__title { margin: 0; font-size: clamp(2.2rem, 4.6vw, 3.9rem); font-weight: 800; line-height: 1.05; letter-spacing: -.035em; }
.iss__desc { margin: 22px 0 0; max-width: 30rem; font-size: clamp(1.02rem, 1.4vw, 1.2rem); line-height: 1.65; opacity: .85; }
.iss__cta { margin-top: 36px; }
.iss__right { display: none; align-items: center; justify-content: center; padding: 24px; border-left: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  background-image: linear-gradient(to right, var(--iss-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--iss-grid) 1px, transparent 1px); background-size: 3.5rem 3.5rem; }
.iss__frame { position: relative; width: min(60%, 400px); height: min(54vh, 480px); border-radius: 7px; overflow: hidden; box-shadow: 0 34px 60px -28px rgba(18,41,74,.55); border: 4px solid color-mix(in srgb, currentColor 8%, transparent); }
.iss__strip { position: absolute; inset: 0; transition: transform .7s ease-in-out; }
.iss__pic { width: 100%; height: 100%; }
.iss__pic img { display: block; width: 100%; height: 100%; object-fit: cover; }
@media (min-width: 900px) { .iss__grid { grid-template-columns: 1fr 1fr; } .iss__right { display: flex; } }
@media (prefers-reduced-motion: reduce) { .iss__panel, .iss__slide, .iss__strip, .iss__bar { transition: none; } }
`;

export function ScrollingFeatureShowcase({
  slides,
  ctaText,
  ctaHref,
  as,
  hrefProp = "href",
  ctaClassName = "",
  header,
  perSlide = 0.8,
  className,
}: ScrollingFeatureShowcaseProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  const count = slides.length;

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const scrollable = r.height - window.innerHeight;
      if (scrollable <= 0) return;
      const p = clamp(-r.top / scrollable, 0, 0.9999);
      setActive(Math.floor(p * count));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count]);

  const goTo = (index: number) => {
    const el = rootRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: top + (scrollable / count) * index + 4, behavior: reduce ? "auto" : "smooth" });
  };

  const slide = slides[active];
  const Cta = (as ?? "a") as React.ElementType;
  const ctaProps = ctaHref ? { [hrefProp]: ctaHref } : {};

  return (
    <div
      ref={rootRef}
      className={"iss" + (className ? " " + className : "")}
      style={{ height: `${count * perSlide * 100 + 100}vh` }}
    >
      <style>{ISS_CSS}</style>
      <div
        className="iss__panel"
        style={
          {
            "--iss-bg": slide.bgColor,
            "--iss-fg": slide.textColor,
            "--iss-grid": slide.gridColor ?? "color-mix(in srgb, " + slide.textColor + " 12%, transparent)",
          } as React.CSSProperties
        }
      >
        {header ? <div className="iss__head">{header}</div> : null}
        <div className="iss__grid">
          <div className="iss__left">
            <div className="iss__bars" role="group" aria-label="Steps">
              {slides.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  className="iss__bar"
                  aria-current={i === active}
                  aria-label={`Go to step ${i + 1}: ${s.title}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>

            <div className="iss__stage" aria-live="polite">
              {slides.map((s, i) => (
                <div key={s.title} className="iss__slide" data-on={i === active} aria-hidden={i !== active}>
                  <span className="iss__count">{String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
                  <h3 className="iss__title">{s.title}</h3>
                  <p className="iss__desc">{s.description}</p>
                </div>
              ))}
            </div>

            {ctaText ? (
              <div className="iss__cta">
                <Cta className={ctaClassName} {...ctaProps}>{ctaText}</Cta>
              </div>
            ) : null}
          </div>

          <div className="iss__right" aria-hidden="true">
            <div className="iss__frame">
              <div className="iss__strip" style={{ transform: `translateY(-${active * 100}%)` }}>
                {slides.map((s) => (
                  <div key={s.title} className="iss__pic">
                    <img src={s.image} alt={s.alt ?? ""} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrollingFeatureShowcase;
