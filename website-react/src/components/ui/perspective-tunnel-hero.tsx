"use client";

// Hero where a drift of cards flies out of a 3D corridor toward the viewer.
// The wheel (or a vertical swipe) drives one 0-1 progress value; every card is
// a window on that value, staggered so they arrive one after another. The mouse
// pans the camera slightly.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes are replaced by a scoped, .ptr- prefixed stylesheet; the
//    cards' text overlay is dropped (the covers carry their own titles).
//  - Centre copy and buttons are passed in as children; the demo images and
//    copy are removed. Imports come from `motion/react`.
//  - The wheel only drives the tunnel while it can still move and the hero is at
//    the top of the page, so the page keeps scrolling past it; touch swipes get
//    the same treatment.
//  - The tunnel starts partly open so the hero is never empty, and the copy
//    stays fully visible the whole way, with the covers passing behind it.
import * as React from "react";
import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "motion/react";

export interface TunnelImage {
  src: string;
  alt: string;
}

export interface PerspectiveTunnelHeroProps {
  images: TunnelImage[];
  /** Shown in the middle of the corridor. */
  children?: React.ReactNode;
  /** Small hint at the bottom that fades after the first scroll. */
  hint?: string;
  /** Where the tunnel starts, 0-1. @default 0.12 */
  initial?: number;
  className?: string;
}

interface TunnelCardData {
  image: TunnelImage;
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
}

const buildCards = (images: TunnelImage[]): TunnelCardData[] =>
  images.map((image, i) => {
    const goldenAngle = i * 137.5 * (Math.PI / 180);
    return {
      image,
      angleCos: Math.cos(goldenAngle),
      angleSin: Math.sin(goldenAngle),
      radiusFactorX: 0.28 + (i % 3) * 0.08,
      radiusFactorY: 0.26 + (i % 2) * 0.09,
      rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
      index: i,
    };
  });

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
  width: number;
  height: number;
  isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  React.useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(120, Math.min(170, stage.width * 0.34))
    : Math.max(170, Math.min(250, stage.width * 0.16));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 45;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currZ, px, py]: number[]) => {
      const offsetX = baseX - px * panStrength;
      const offsetY = baseY - py * panStrength;
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
    },
  );

  return (
    <motion.div
      style={{ width: cardWidth, transform, opacity, zIndex: card.index + 1 }}
      className="ptr-card"
    >
      <img src={card.image.src} alt="" draggable={false} />
    </motion.div>
  );
}

const PTR_CSS = `
.ptr { position: relative; z-index: 0; isolation: isolate; width: 100%; height: 100svh; min-height: 640px; overflow: hidden; display: flex; align-items: center; justify-content: center; color: #fff; user-select: none; }
.ptr__grid { position: absolute; inset: 0; pointer-events: none; opacity: .5;
  background-image: radial-gradient(rgba(255,255,255,.22) 1px, transparent 1px); background-size: 28px 28px;
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 55%, transparent 100%); mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 55%, transparent 100%); }
.ptr__glow { position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(circle at 50% 50%, rgba(242,140,40,.2) 0%, transparent 62%), radial-gradient(circle at 85% 10%, rgba(29,95,168,.35) 0%, transparent 55%); }
.ptr__scrim { position: absolute; inset: 0; z-index: 10; pointer-events: none;
  background: radial-gradient(ellipse 55% 52% at 50% 52%, rgba(8,22,43,.66) 0%, rgba(8,22,43,.42) 45%, rgba(8,22,43,0) 78%); }
.ptr__ring { position: absolute; border-radius: 50%; pointer-events: none; }
.ptr__ring--a { width: 48vmin; height: 48vmin; border: 1px solid rgba(242,140,40,.22); }
.ptr__ring--b { width: 76vmin; height: 76vmin; border: 1px dashed rgba(255,255,255,.14); }
.ptr__stage { position: absolute; inset: 0; z-index: 1; pointer-events: none; transform-style: preserve-3d; }
.ptr-card { position: absolute; left: 50%; top: 50%; aspect-ratio: 2 / 3; will-change: transform; pointer-events: none; }
.ptr-card img { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 7px; box-shadow: 0 30px 60px -20px rgba(0,0,0,.75); outline: 1px solid rgba(255,255,255,.18); outline-offset: -1px; }
.ptr__copy { position: relative; z-index: 30; display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 46rem; padding: 0 24px; }
.ptr__hint {
  position: absolute; bottom: 28px; z-index: 20; display: flex; flex-direction: column; align-items: center; gap: 8px; pointer-events: none;
  font-size: .72rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: rgba(234,243,253,.7);
}
.ptr__hint i { display: block; width: 1px; height: 26px; background: linear-gradient(to bottom, #f28c28, transparent); }
@media (prefers-reduced-motion: reduce) { .ptr-card { will-change: auto; } }
`;

export default function PerspectiveTunnelHero({
  images,
  children,
  hint = "Scroll to explore",
  initial = 0.12,
  className,
}: PerspectiveTunnelHeroProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const cards = React.useMemo(() => buildCards(images), [images]);

  const [stage, setStage] = React.useState<StageDimensions>({
    width: 1440,
    height: 900,
    isMobile: false,
  });

  React.useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      const width = el?.clientWidth || window.innerWidth;
      const height = el?.clientHeight || window.innerHeight;
      setStage({ width, height, isMobile: window.innerWidth < 768 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const rawProgress = useMotionValue(initial);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });
  // With reduced motion the tunnel does not glide; it jumps to where it is put.
  const progress = reduce ? rawProgress : smoothProgress;

  // The wheel and swipes drive the tunnel only while it can still move in that
  // direction and the hero is at the top of the page, so scrolling carries on
  // into the rest of the site at either end.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const atTop = () => el.getBoundingClientRect().top >= -2;
    const move = (delta: number, event: Event) => {
      if (!atTop()) return;
      const current = rawProgress.get();
      const next = Math.min(1, Math.max(0, current + delta));
      if (next === current) return;
      event.preventDefault();
      rawProgress.set(next);
    };

    const onWheel = (e: WheelEvent) => move(e.deltaY * 0.0008, e);

    let lastY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (y === undefined || lastY === null) return;
      const delta = (lastY - y) * 0.003;
      lastY = y;
      move(delta, e);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [rawProgress]);

  const pointer = useCameraParallax(!reduce);

  // The copy stays put and readable; the covers fly past behind it.
  const copyScale = useTransform(progress, [0, 1], [1, 1.06]);
  const hintOpacity = useTransform(progress, [initial, initial + 0.12], [1, 0]);

  return (
    <div
      ref={containerRef}
      className={"ptr" + (className ? " " + className : "")}
      style={{
        // Only the card stage is 3D. The root must stay flat, otherwise cards that
        // have flown toward the viewer sort in front of the copy whatever its z-index.
        perspective: stage.isMobile ? "900px" : "1200px",
      }}
    >
      <style>{PTR_CSS}</style>
      <div className="ptr__grid" aria-hidden="true" />
      <div className="ptr__glow" aria-hidden="true" />
      <div className="ptr__ring ptr__ring--a" aria-hidden="true" />
      <div className="ptr__ring ptr__ring--b" aria-hidden="true" />

      <motion.div
        style={{ scale: copyScale }}
        className="ptr__copy"
      >
        {children}
      </motion.div>

      {hint ? (
        <motion.div style={{ opacity: hintOpacity }} className="ptr__hint" aria-hidden="true">
          <span>{hint}</span>
          <i />
        </motion.div>
      ) : null}

      <div className="ptr__stage" aria-hidden="true">
        {cards.map((card) => (
          <TunnelCard
            key={card.image.src}
            card={card}
            progress={progress}
            pointer={pointer}
            total={cards.length}
            stage={stage}
          />
        ))}
      </div>

      {/* A soft dark pool behind the copy, above the covers, so text stays legible as they pass. */}
      <div className="ptr__scrim" aria-hidden="true" />
    </div>
  );
}
