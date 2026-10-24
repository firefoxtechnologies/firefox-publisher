import { useState } from "react";
import { Link } from "react-router-dom";
import { BOOK_STAGES } from "../data/site.js";

// Where is your book now? Left: the six stages. Right: what that stage means,
// what usually comes next and how we can help.
const ICONS = [
  "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  "M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1zM14 7l3 3",
  "M6 3h8l4 4v14H6zM14 3v4h4M9 13l2 2 4-4",
  "M12 3l2.2 5.3L20 9l-4.3 3.8L17 18.5 12 15.6 7 18.5l1.3-5.7L4 9l5.8-.7z",
  "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM9 7h6M9 11h6",
  "M5 15c-1 3-1 5-1 5s2 0 5-1M9 15l-1-4 6-6c3-3 6-2 6-2s1 3-2 6l-6 6-4-1M14 10a1 1 0 1 0 0 .01",
];
const ART = [
  ["/assets/stages/idea.jpg", "A writer thinking over a new book idea"],
  ["/assets/stages/writing.jpg", "Hands typing a manuscript on a laptop"],
  ["/assets/stages/draft.jpg", "A finished draft on the desk next to a laptop"],
  ["/assets/stages/edited.jpg", "A hand marking up a manuscript with a red pen"],
  ["/assets/stages/designed.jpg", "A hand holding open a book with a cleanly laid-out photo spread"],
  ["/assets/stages/launch.jpg", "A bookstore table with a display of new books"],
];

export default function ToolsShowcase() {
  const [active, setActive] = useState(0);
  const stage = BOOK_STAGES[active];
  const [src, alt] = ART[active];

  const onKey = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowDown" ? 1 : -1) + BOOK_STAGES.length) % BOOK_STAGES.length;
    setActive(next);
    document.getElementById("tp-tab-" + BOOK_STAGES[next].id)?.focus();
  };

  return (
    <div className="tp" id="readiness">
      <div className="tp__main">
        <div className="tp__list" role="tablist" aria-orientation="vertical" aria-label="Where is your book now?" onKeyDown={onKey}>
          {BOOK_STAGES.map((st, i) => (
            <button
              key={st.id}
              id={"tp-tab-" + st.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls="tp-panel"
              tabIndex={i === active ? 0 : -1}
              className={"tp__item" + (i === active ? " is-active" : "")}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
            >
              <span className="tp__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS[i]} /></svg>
              </span>
              <span className="tp__txt"><strong>{st.label}</strong><span>{st.short}</span></span>
            </button>
          ))}
        </div>

        <div className="tp__preview" id="tp-panel" role="tabpanel" aria-labelledby={"tp-tab-" + stage.id} key={stage.id}>
          <div className="tp__art"><img src={src} alt={alt} loading="lazy" /></div>
          <p className="tp__tag">You are here</p>
          <h3>{stage.label}</h3>
          <p className="tp__sum">{stage.summary}</p>
          <p className="tp__tag">What usually comes next</p>
          <ol className="tp__next">
            {stage.next.map((t) => <li key={t}>{t}</li>)}
          </ol>
          <div className="tp__actions">
            {stage.help.map(([name, to]) => <Link className="tp__chip2" key={name} to={to}>{name}</Link>)}
            <Link className="btn btn--primary tp__cta" to="/#contact">{stage.cta}</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
