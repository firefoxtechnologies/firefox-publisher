import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PerspectiveTunnelHero from "./ui/perspective-tunnel-hero";
import { HERO_BOOKS } from "../data/site.js";
import { prefersReducedMotion } from "../hooks.js";

const IMAGES = HERO_BOOKS.map((b) => ({ src: `/assets/covers/${b.file}.svg`, alt: b.label }));

const LINE1 = "Your Story.";
const LINE2 = "Our Craft.";
const TOTAL = LINE1.length + LINE2.length;

// Same stops as the orange gradient the second line used before, sampled per letter
// so each typed character keeps its place in the gradient.
const STOPS = [[0, [242, 140, 40]], [0.6, [255, 197, 138]], [1, [255, 255, 255]]];
function gradientAt(t) {
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i];
    const [t0, c0] = STOPS[i - 1];
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0);
      return `rgb(${c0.map((v, j) => Math.round(v + (c1[j] - v) * k)).join(",")})`;
    }
  }
  return "#fff";
}

// Types the headline letter by letter. Every letter is always in the layout (the
// untyped ones just have no opacity), so nothing shifts while it types.
function TypedHeadline() {
  const [typed, setTyped] = useState(() => (prefersReducedMotion() ? TOTAL : 0));
  const [caret, setCaret] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let n = 0;
    let timer;
    const tick = () => {
      n += 1;
      setTyped(n);
      if (n >= TOTAL) {
        timer = setTimeout(() => setCaret(false), 3200);
        return;
      }
      // a short beat after the first line, a touch slower on the second
      const delay = n === LINE1.length ? 450 : n > LINE1.length ? 85 : 75;
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  const chars = (text, offset, colorOf) =>
    [...text].map((ch, i) => {
      const idx = offset + i;
      const on = idx < typed;
      const isCaret = caret && idx === typed - 1;
      return (
        <span
          key={idx}
          className="tw__c"
          data-on={on}
          data-caret={isCaret || (caret && typed === 0 && idx === 0 && "start") || undefined}
          style={colorOf ? { color: colorOf(i, text.length) } : undefined}
        >
          {ch === " " ? " " : ch}
        </span>
      );
    });

  return (
    <h1 className="tw" aria-label={`${LINE1} ${LINE2}`}>
      <span className="tw__line" aria-hidden="true">{chars(LINE1, 0)}</span>
      <br aria-hidden="true" />
      <span className="tw__line" aria-hidden="true">{chars(LINE2, LINE1.length, (i, n) => gradientAt(i / (n - 1)))}</span>
    </h1>
  );
}

// Home hero: the sample covers fly out of a 3D corridor as you scroll the wheel.
export default function Hero() {
  return (
    <section id="top" aria-label="Firefox Publishers">
      <PerspectiveTunnelHero images={IMAGES} className="hero--dark tunnel-hero" hint="Scroll to explore">
        <p className="eyebrow">Firefox Publishers</p>
        <TypedHeadline />
        <p className="lead">Publishing and creative services that help authors present their work professionally and build their brands.</p>
        <div className="hero__cta">
          <Link className="btn btn--light" to="/#contact">Start your publishing journey</Link>
          <Link className="btn btn--ghost" to="/portfolio">View our work</Link>
        </div>
      </PerspectiveTunnelHero>
    </section>
  );
}
