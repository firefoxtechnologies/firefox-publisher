"use client";

// Stacked, draggable card carousel. Drag (or use the arrows / ← →) and the deck
// fans out around the front card; every card is driven by one shared motion
// value, `scrollProgress`.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes, `cn` and the shadcn Badge are replaced by a scoped,
//    .c7- prefixed stylesheet. Type inherits the site's own font stack.
//  - Slides are passed in as props instead of being hard-coded.
//  - Added prev/next buttons, keyboard support and carousel semantics.
import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "motion/react";

export interface Slide {
  image: string;
  title: string;
  description: string;
  badge: string;
  /** Alt text for the image. Defaults to the title. */
  alt?: string;
}

export interface CarouselStackedProps {
  slides: Slide[];
  /** Accessible name for the carousel. */
  label?: string;
  className?: string;
}

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

const getCarouselConfig = (width: number): CarouselConfig => {
  if (width < 640) {
    return {
      distanceDivisor: 120,
      velocityDivisor: 500,
      sensitivity: 180,
      xMultiplier: 90,
      yMultiplier: 20,
      rotationMultiplier: 8,
      scaleReduction: 0.06,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 160,
      velocityDivisor: 650,
      sensitivity: 220,
      xMultiplier: 130,
      yMultiplier: 30,
      rotationMultiplier: 10,
      scaleReduction: 0.09,
    };
  }
  return {
    distanceDivisor: 200,
    velocityDivisor: 800,
    sensitivity: 250,
    xMultiplier: 170,
    yMultiplier: 40,
    rotationMultiplier: 12,
    scaleReduction: 0.12,
  };
};

const C7_CSS = `
.c7-root { position: relative; z-index: 0; isolation: isolate; width: 100%; padding: 8px 0 0; overflow: hidden; user-select: none; font-family: inherit; }
.c7-stage { position: relative; width: 100%; max-width: 80rem; height: 20rem; margin: 0 auto; display: flex; align-items: center; justify-content: center; outline: none; }
.c7-stage:focus-visible { outline: 2px solid var(--deep, #1d5fa8); outline-offset: 4px; border-radius: 7px; }
.c7-drag { position: absolute; inset: 0; z-index: 50; cursor: grab; }
.c7-drag:active { cursor: grabbing; }
.c7-card {
  position: absolute; width: 11rem; height: 14rem; border-radius: 7px; overflow: hidden; pointer-events: none;
  background: var(--navy, #12294a); box-shadow: 0 24px 50px -22px rgba(18,41,74,.55);
}
.c7-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.c7-dim { position: absolute; inset: 0; background: var(--navy, #12294a); pointer-events: none; }
.c7-badge {
  position: absolute; top: 12px; right: 12px; padding: 3px 10px; border-radius: 7px; font-size: .68rem; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase; color: var(--navy, #12294a); background: var(--grad-orange, #f28c28); box-shadow: 0 6px 14px -6px rgba(242,140,40,.8);
}
.c7-nav { display: flex; justify-content: center; gap: 12px; margin-top: 18px; }
.c7-nav button {
  width: 46px; height: 46px; border-radius: 7px; display: grid; place-items: center; cursor: pointer; color: var(--navy, #12294a);
  background: #fff; border: 1px solid var(--line, #d6e3f2); box-shadow: 0 10px 20px -12px rgba(18,41,74,.5); transition: transform .2s ease, background .2s ease;
}
.c7-nav button:hover { transform: translateY(-2px); background: var(--ice, #eaf3fd); }
.c7-nav button:focus-visible { outline: 2px solid var(--deep, #1d5fa8); outline-offset: 3px; }
.c7-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (min-width: 640px) {
  .c7-stage { height: 28rem; }
  .c7-card { width: 14rem; height: 20rem; }
        .c7-badge { top: 18px; right: 18px; padding: 4px 12px; }
}
@media (min-width: 1024px) {
  .c7-stage { height: 32rem; }
  .c7-card { width: 16rem; height: 24rem; }
      .c7-badge { top: 22px; right: 22px; }
}
`;

export default function CarouselStacked({
  slides,
  label = "Featured books",
  className,
}: CarouselStackedProps) {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const [active, setActive] = React.useState(0);

  const total = slides.length;

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(
    () =>
      scrollProgress.on("change", (p) => {
        const near = ((Math.round(p) % total) + total) % total;
        setActive((prev) => (prev === near ? prev : near));
      }),
    [scrollProgress, total],
  );

  const config = React.useMemo(
    () => getCarouselConfig(windowWidth),
    [windowWidth],
  );

  const settle = (target: number) =>
    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      mass: 1,
    });

  const step = (by: number) => settle(Math.round(scrollProgress.get()) + by);

  const handleDragStart = () => {
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const distanceShift = -info.offset.x / config.distanceDivisor;
    const velocityShift = -info.velocity.x / config.velocityDivisor;

    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-3, Math.min(3, totalShift));

    settle(Math.round(startProgress.current) + totalShift);
  };

  return (
    <div
      className={"c7-root" + (className ? " " + className : "")}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <style>{C7_CSS}</style>
      <div
        className="c7-stage"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          else if (event.key === "ArrowLeft") step(-1);
          else return;
          event.preventDefault();
        }}
      >
        {/* Transparent drag surface */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragStart={handleDragStart}
          onDrag={(_, info) => {
            scrollProgress.set(
              scrollProgress.get() - info.delta.x / config.sensitivity,
            );
          }}
          onDragEnd={handleDragEnd}
          className="c7-drag"
        />

        {slides.map((slide, i) => (
          <Card
            key={slide.title}
            slide={slide}
            index={i}
            total={total}
            progress={scrollProgress}
            config={config}
          />
        ))}
      </div>

      <div className="c7-nav">
        <button type="button" aria-label="Previous book" onClick={() => step(-1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" aria-label="Next book" onClick={() => step(1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
      <p className="c7-sr" aria-live="polite">
        {slides[active]?.title}. {slides[active]?.description}
      </p>
    </div>
  );
}

interface CardProps {
  slide: Slide;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
}

const Card = ({ slide, index, total, progress, config }: CardProps) => {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return o * config.rotationMultiplier;
  });
  const y = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return absO * config.yMultiplier;
  });
  const scale = useTransform(
    offset,
    (o) => 1 - Math.abs(o) * config.scaleReduction,
  );
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (o) =>
    Math.round(100 - Math.abs(o) * 10),
  );
  const dim = useTransform(offset, [-2, -0.5, 0, 0.5, 2], [0.5, 0.2, 0, 0.2, 0.5]);

  return (
    <motion.div
      style={{ x, rotate, y, scale, opacity, zIndex }}
      className="c7-card"
    >
      <img src={slide.image} alt={slide.alt ?? slide.title} draggable={false} />
      <motion.div style={{ opacity: dim }} className="c7-dim" />
      <span className="c7-badge">{slide.badge}</span>
    </motion.div>
  );
};
