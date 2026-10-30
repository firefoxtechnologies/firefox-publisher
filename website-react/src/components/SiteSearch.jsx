import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { searchSite, SEARCH_INDEX } from "../data/searchIndex.js";
import "../styles/site-search.css";

const SUGGESTED = ["Audiobooks", "Packages and prices", "Free Book Cover Maker", "Book Editing", "Contact us"];

// Header search: a button that opens a search box over the page. Results come from a small
// built-in index of the site, so there is no server and nothing to wait for.
export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const btnRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { pathname, hash, key } = useLocation();
  const id = useId();

  const results = q.trim()
    ? searchSite(q)
    : SUGGESTED.map((t) => SEARCH_INDEX.find((i) => i.title === t)).filter(Boolean);

  const close = () => { setOpen(false); setQ(""); setActive(0); btnRef.current?.focus(); };

  useEffect(() => { setOpen(false); }, [pathname, hash, key]);

  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const go = (item) => { setOpen(false); setQ(""); setActive(0); navigate(item.to); };

  const onInputKey = (e) => {
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]); }
  };

  return (
    <>
      <button ref={btnRef} type="button" className="ss-btn" aria-label="Search the website" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
        <span className="ss-btn__txt">Search</span>
      </button>
      {open && createPortal(
        <div className="ss-back" onMouseDown={(e) => e.target === e.currentTarget && close()}>
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
              <button type="button" className="ss__x" onClick={close} aria-label="Close search">Esc</button>
            </div>
            <p className="ss__hint" aria-live="polite">
              {q.trim() ? (results.length ? `${results.length} result${results.length === 1 ? "" : "s"}` : "No results") : "Popular searches"}
            </p>
            <ul className="ss__list" id={id + "-list"} role="listbox">
              {results.map((r, i) => (
                <li key={r.to + r.title} id={id + "-" + i} role="option" aria-selected={i === active} className={i === active ? "is-on" : undefined} onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
                  <span className="ss__kind">{r.kind}</span>
                  <span className="ss__main"><strong>{r.title}</strong><small>{r.text}</small></span>
                </li>
              ))}
            </ul>
            {q.trim() && !results.length && (
              <p className="ss__empty">Nothing matched &ldquo;{q}&rdquo;. Try &ldquo;audiobook&rdquo;, &ldquo;cover design&rdquo; or &ldquo;price&rdquo;, or <a href="/#contact" onClick={(e) => { e.preventDefault(); go({ to: "/#contact" }); }}>ask us directly</a>.</p>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
