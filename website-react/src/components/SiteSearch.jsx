import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/site-search.css";

// The search box itself is a separate download (SearchDialog.jsx). Only this button and the keyboard
// shortcuts ("/" and Ctrl+K) are in the first page load.
const SearchDialog = lazy(() => import("./SearchDialog.jsx"));

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const { pathname, hash, key } = useLocation();

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

  const close = () => { setOpen(false); btnRef.current?.focus(); };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="ss-btn"
        aria-label="Search the website"
        aria-haspopup="dialog"
        aria-expanded={open}
        onMouseEnter={() => import("./SearchDialog.jsx")}
        onFocus={() => import("./SearchDialog.jsx")}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
        <span className="ss-btn__txt">Search</span>
      </button>
      {open && <Suspense fallback={null}><SearchDialog onClose={close} /></Suspense>}
    </>
  );
}
