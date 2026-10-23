import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { prefersReducedMotion, useInView } from "../hooks.js";

// Fades its element in once it scrolls into view. `as` picks the tag.
export function Reveal({ as: Tag = "div", className = "", delay, style, children, ...rest }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  return (
    <Tag
      ref={ref}
      className={"reveal" + (seen ? " in" : "") + (className ? " " + className : "")}
      style={delay ? { transitionDelay: delay + "ms", ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Staggered delay used for card grids: cycles through six steps of 70ms.
export const stagger = (i) => (i % 6) * 70;

// Number that counts up when it scrolls into view.
export function Count({ end, prefix = "" }) {
  const ref = useRef(null);
  const [val, setVal] = useState(end);
  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    setVal(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([en], o) => {
        if (!en.isIntersecting) return;
        o.disconnect();
        const t0 = performance.now();
        const step = (t) => {
          const k = Math.min(1, (t - t0) / 1400);
          setVal(Math.round(end * (1 - Math.pow(1 - k, 3))));
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end]);
  return <span ref={ref}>{prefix + val}</span>;
}

export function CtaBand() {
  return (
    <section className="section band">
      <div className="wrap cta">
        <div>
          <h2>Ready to talk about your story?</h2>
          <p>Tell us about your project and we will reply with the next step.</p>
        </div>
        <Link className="btn btn--primary" to="/#contact">Start a project</Link>
      </div>
    </section>
  );
}

export function Ticks({ items, style }) {
  return (
    <ul className="ticks" style={style}>
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}
