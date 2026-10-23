import { useEffect, useRef, useState } from "react";
import { STAGES } from "../data/site.js";
import { Ticks } from "./ui.jsx";

// Tabbed publishing journey. On wide screens it is also driven by scroll:
// the .pin wrapper is taller than its content, so scrolling through it steps the tabs.
export default function Journey() {
  const [idx, setIdx] = useState(0);
  const pin = useRef(null);
  const pinIn = useRef(null);
  const tabs = useRef([]);

  useEffect(() => {
    const onScroll = () => {
      const p = pin.current, pi = pinIn.current;
      if (!p || !pi || p.offsetHeight <= pi.offsetHeight + 100) return;
      const r = p.getBoundingClientRect();
      const span = p.offsetHeight - pi.offsetHeight;
      const prog = Math.min(0.999, Math.max(0, (110 - r.top) / span));
      setIdx(Math.floor(prog * STAGES.length));
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const onKeyDown = (e, i) => {
    const n = STAGES.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : null;
    if (next === null) return;
    setIdx(next);
    tabs.current[next]?.focus({ preventScroll: true });
  };

  return (
    <div className="pin" ref={pin}>
      <div className="pin__in" ref={pinIn}>
        <div className="journey">
          <div className="tabs" role="tablist" aria-label="Publishing stages">
            {STAGES.map((s, i) => (
              <button
                key={s.label}
                ref={(el) => (tabs.current[i] = el)}
                type="button"
                role="tab"
                id={"t" + (i + 1)}
                aria-selected={i === idx}
                aria-controls={"p" + (i + 1)}
                tabIndex={i === idx ? 0 : -1}
                onClick={() => setIdx(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span> {s.label}
              </button>
            ))}
          </div>
          <div className="progress" aria-hidden="true">
            <i id="progress-bar" style={{ width: ((idx + 1) / STAGES.length) * 100 + "%" }} />
          </div>
          <p className="progress__label" id="progress-label">Step {idx + 1} of {STAGES.length}</p>
          {STAGES.map((s, i) => (
            <div key={s.label} className="panel" role="tabpanel" id={"p" + (i + 1)} aria-labelledby={"t" + (i + 1)} hidden={i !== idx}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <Ticks items={s.items} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
