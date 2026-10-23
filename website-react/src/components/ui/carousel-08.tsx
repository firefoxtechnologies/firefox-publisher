"use client";

// Apple-style strip of tall photo cards you can drag or step through. Each card
// has a small category, a title, optional text and sits on a darkened photo.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes, lucide and the shadcn Button / Carousel wrappers are replaced
//    by a scoped, .c8- prefixed stylesheet, an inline arrow and `embla-carousel-react`
//    used directly.
//  - Cards are passed in as data, with an optional description; the decorative
//    arrow button is dropped because the cards do not link anywhere.
//  - The strip bleeds off the right edge of the screen while its left edge lines up
//    with the page content column.
//  - Prev/next buttons are labelled; arrow keys scroll the strip.
import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";

export interface CarouselCard {
  id: string;
  category: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  src: string;
  alt?: string;
}

export interface AppleCardCarouselProps {
  cards: CarouselCard[];
  /** Accessible name for the carousel. */
  label?: string;
  className?: string;
}

const C8_CSS = `
.c8 { --c8-gutter: max(24px, calc((100vw - 1160px) / 2)); width: 100vw; position: relative; left: 50%; margin-left: -50vw; padding-block: 12px 0; }
.c8__viewport { margin-left: var(--c8-gutter); overflow: hidden; overflow: clip; overflow-clip-margin: 0; padding: 16px 0 28px; clip-path: inset(-100px 0 -100px calc(-1 * var(--c8-gutter))); }
.c8__viewport { overflow: visible; }
.c8__track { display: flex; gap: 24px; }
.c8__card { position: relative; flex: none; width: min(78vw, 340px); height: min(110vw, 500px); display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; border-radius: 7px; padding: 28px; color: #fff; user-select: none;
  background: var(--navy, #12294a); border: 1px solid rgba(18,41,74,.1); box-shadow: 0 24px 44px -28px rgba(18,41,74,.6); transition: transform .3s ease, box-shadow .3s ease; }
.c8__card:hover { transform: scale(1.02); box-shadow: 0 34px 56px -30px rgba(18,41,74,.7); }
.c8__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.c8__shade { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, rgba(8,22,43,.92) 0%, rgba(8,22,43,.6) 38%, rgba(8,22,43,.05) 70%); }
.c8__top { position: absolute; top: 24px; left: 28px; right: 28px; }
.c8__cat { display: inline-block; padding: 4px 12px; border-radius: 7px; font-size: .85rem; font-weight: 700; color: #fff; background: rgba(255,255,255,.16); backdrop-filter: blur(6px); }
.c8__body { position: relative; display: flex; flex-direction: column; gap: 10px; }
.c8__title { margin: 0; font-size: clamp(1.4rem, 2.2vw, 1.75rem); font-weight: 800; letter-spacing: -.02em; line-height: 1.15; color: #fff; }
.c8__desc { margin: 0; font-size: 1rem; line-height: 1.55; color: rgba(255,255,255,.88); }
.c8__nav { display: flex; justify-content: flex-end; gap: 10px; padding-right: var(--c8-gutter); }
.c8__btn { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 7px; cursor: pointer; color: var(--navy, #12294a); background: #fff; border: 1px solid var(--line, #d6e3f2); box-shadow: 0 8px 16px -10px rgba(18,41,74,.5); transition: transform .2s ease, opacity .2s ease; }
.c8__btn:hover:not(:disabled) { transform: translateY(-2px); }
.c8__btn:disabled { opacity: .4; cursor: default; }
.c8__btn:focus-visible { outline: 2px solid var(--deep, #1d5fa8); outline-offset: 3px; }
.c8__btn svg { width: 18px; height: 18px; }
@media (prefers-reduced-motion: reduce) { .c8__card, .c8__btn { transition: none; } }
`;

export function AppleCardCarousel({ cards, label = "Highlights", className }: AppleCardCarouselProps) {
  const [viewportRef, api] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: false });
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);

  React.useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    api.on("scroll", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
      api.off("scroll", update);
    };
  }, [api]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") api?.scrollPrev();
    else if (event.key === "ArrowRight") api?.scrollNext();
    else return;
    event.preventDefault();
  };

  return (
    <div
      className={"c8" + (className ? " " + className : "")}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <style>{C8_CSS}</style>
      <div className="c8__viewport" ref={viewportRef}>
        <div className="c8__track">
          {cards.map((card, i) => (
            <article
              key={card.id}
              className="c8__card"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${cards.length}`}
            >
              <img className="c8__img" src={card.src} alt={card.alt ?? ""} loading="lazy" draggable={false} />
              <div className="c8__shade" aria-hidden="true" />
              <div className="c8__top"><span className="c8__cat">{card.category}</span></div>
              <div className="c8__body">
                <h3 className="c8__title">{card.title}</h3>
                {card.description ? <p className="c8__desc">{card.description}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="c8__nav">
        <button type="button" className="c8__btn" aria-label="Previous" onClick={() => api?.scrollPrev()} disabled={!canPrev}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" className="c8__btn" aria-label="Next" onClick={() => api?.scrollNext()} disabled={!canNext}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}

export default AppleCardCarousel;
