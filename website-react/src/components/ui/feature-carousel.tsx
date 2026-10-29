import * as React from "react";

interface BookCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: { src: string; alt: string }[];
}

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
  </svg>
);

/* Centre-stage carousel: the current book faces you, its neighbours sit
 * either side, turned and softened. Advances every 4s unless the visitor
 * hovers it or prefers reduced motion. */
export const BookCarousel = React.forwardRef<HTMLDivElement, BookCarouselProps>(
  ({ images, className, ...props }, ref) => {
    const [current, setCurrent] = React.useState(Math.floor(images.length / 2));
    const [paused, setPaused] = React.useState(false);

    const next = React.useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);
    const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);

    React.useEffect(() => {
      if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const timer = setInterval(next, 4000);
      return () => clearInterval(timer);
    }, [next, paused]);

    return (
      <div
        ref={ref}
        className={"fc" + (className ? " " + className : "")}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        {...props}
      >
        <div className="fc__stage">
          {images.map((image, index) => {
            const total = images.length;
            let pos = (index - current + total) % total;
            if (pos > Math.floor(total / 2)) pos -= total;
            const center = pos === 0;
            const adjacent = Math.abs(pos) === 1;
            return (
              <div
                key={image.src}
                className="fc__item"
                aria-hidden={!center}
                style={{
                  transform: `translateX(${pos * 45}%) scale(${center ? 1 : adjacent ? 0.85 : 0.7}) rotateY(${pos * -10}deg)`,
                  zIndex: center ? 10 : adjacent ? 5 : 1,
                  opacity: center ? 1 : adjacent ? 0.4 : 0,
                  filter: center ? "none" : "blur(4px)",
                  visibility: Math.abs(pos) > 1 ? "hidden" : "visible",
                }}
              >
                <img src={image.src} alt={image.alt} draggable={false} loading={Math.abs(pos) <= 1 ? "eager" : "lazy"} decoding="async" />
              </div>
            );
          })}
        </div>
        <button type="button" className="fc__btn fc__btn--prev" onClick={prev} aria-label="Previous book">
          <Arrow dir="left" />
        </button>
        <button type="button" className="fc__btn fc__btn--next" onClick={next} aria-label="Next book">
          <Arrow dir="right" />
        </button>
      </div>
    );
  },
);

BookCarousel.displayName = "BookCarousel";
export default BookCarousel;
