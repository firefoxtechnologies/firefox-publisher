import { useRef } from "react";
import { Link } from "react-router-dom";
import { useInView } from "../hooks.js";

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
