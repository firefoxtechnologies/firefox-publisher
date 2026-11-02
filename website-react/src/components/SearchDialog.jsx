import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { searchItems, snippetFor } from "../lib/search.js";

const SUGGESTED = ["Audiobooks", "Packages and prices", "Free Book Cover Maker", "Book Editing", "Contact us"];

let indexPromise;
const loadIndex = () =>
  (indexPromise ||= fetch("/search-index.json")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error("search index"))))
    .catch((e) => { indexPromise = null; throw e; }));

// The search box. The index (every page's title, headings, FAQs and text) is a JSON file written at
// build time from the rendered pages, and is fetched the first time this opens.
export default function SearchDialog({ onClose }) {
  const [items, setItems] = useState(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const id = useId();

  useEffect(() => {
    let live = true;
    loadIndex().then((d) => live && setItems(d), () => live && setFailed(true));
    return () => { live = false; };
  }, []);

  const results = !items ? [] : q.trim() ? searchItems(items, q) : SUGGESTED.map((t) => items.find((i) => i.title === t)).filter(Boolean);

  useEffect(() => {
    // Focus now, and once more shortly after: the chat widget can grab focus when it loads on first interaction.
    inputRef.current?.focus();
    const t = setTimeout(() => { if (document.activeElement !== inputRef.current) inputRef.current?.focus(); }, 150);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { clearTimeout(t); document.body.style.overflow = prev; };
  }, []);

  const go = (item) => { onClose(); navigate(item.to); };

  const onInputKey = (e) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]); }
  };

  // Keep the highlighted result in view while using the arrow keys.
  useEffect(() => { document.getElementById(id + "-" + active)?.scrollIntoView({ block: "nearest" }); }, [active, id]);

  return createPortal(
    <div className="ss-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ss" role="dialog" aria-modal="true" aria-label="Search the website">
        <div className="ss__field">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls={id + "-list"}
            aria-activedescendant={results[active] ? id + "-" + active : undefined}
            aria-autocomplete="list"
            placeholder="Search services, audiobooks, prices..."
            autoComplete="off"
            spellCheck="false"
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onKeyDown={onInputKey}
          />
          <button type="button" className="ss__x" onClick={onClose} aria-label="Close search">Esc</button>
        </div>
        <p className="ss__hint" aria-live="polite">
          {failed ? "Search could not load" : !items ? "Loading" : q.trim() ? (results.length ? `${results.length} result${results.length === 1 ? "" : "s"}` : "No results") : "Popular searches"}
        </p>
        <ul className="ss__list" id={id + "-list"} role="listbox">
          {results.map((r, i) => (
            <li key={r.to + r.title} id={id + "-" + i} role="option" aria-selected={i === active} className={i === active ? "is-on" : undefined} onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
              <span className="ss__kind">{r.kind}</span>
              <span className="ss__main"><strong>{r.title}</strong><small>{q.trim() ? snippetFor(r, q) : r.text}</small></span>
            </li>
          ))}
        </ul>
        {failed && <p className="ss__empty">The search list could not be loaded. Check your connection, or browse the menu.</p>}
        {items && q.trim() && !results.length && (
          <p className="ss__empty">Nothing matched &ldquo;{q}&rdquo;. Try &ldquo;audiobook&rdquo;, &ldquo;cover design&rdquo; or &ldquo;price&rdquo;, or <a href="/#contact" onClick={(e) => { e.preventDefault(); go({ to: "/#contact" }); }}>ask us directly</a>.</p>
        )}
      </div>
    </div>,
    document.body
  );
}
