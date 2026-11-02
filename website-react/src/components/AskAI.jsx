import { Suspense, lazy, useState } from "react";
import "../styles/ask-ai.css";

// Only the round "Ask AI" button is in the first download. The chat panel loads when it is opened.
const AskPanel = lazy(() => import("./AskPanel.jsx"));

export default function AskAI() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <button
          type="button"
          className="ai-fab"
          aria-haspopup="dialog"
          onMouseEnter={() => import("./AskPanel.jsx")}
          onFocus={() => import("./AskPanel.jsx")}
          onClick={() => setOpen(true)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zm7 11l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13z" /></svg>
          <span>Ask AI</span>
        </button>
      )}
      {open && <Suspense fallback={null}><AskPanel onClose={() => setOpen(false)} /></Suspense>}
    </>
  );
}
