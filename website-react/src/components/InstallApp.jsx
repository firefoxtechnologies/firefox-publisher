import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cardDue, cardSnooze, promptInstall, useInstall } from "../lib/install.js";
import "../styles/install.css";

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
);

function HelpDialog({ info, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  let title = "Install the Firefox Publisher app";
  let steps;
  if (info.iphone && !info.iphoneSafari) {
    steps = ["Open firefoxpublisher.com in Safari. Other iPhone browsers cannot add apps to the home screen.", "Tap the Share button.", "Choose Add to Home Screen, then tap Add."];
  } else if (info.iphone) {
    steps = ["Tap the Share button at the bottom of Safari (the square with an arrow).", "Scroll down and choose Add to Home Screen.", "Tap Add. The app appears on your home screen."];
  } else if (info.safariMac) {
    steps = ["In the Safari menu bar choose File.", "Choose Add to Dock.", "Tap Add. The app opens in its own window."];
  } else if (info.firefoxDesktop) {
    title = "Install works in Chrome and Edge";
    steps = ["Firefox on a computer cannot install web apps.", "Open firefoxpublisher.com in Chrome or Edge.", "Click the install icon at the right end of the address bar, or choose Install app from the browser menu."];
  } else {
    steps = ["Open the browser menu (the three dots).", "Choose Install app or Add to Home screen.", "Confirm. The app opens in its own window and stays available offline."];
  }
  return createPortal(
    <div className="ia-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ia-dialog" role="dialog" aria-modal="true" aria-labelledby="ia-title">
        <h2 id="ia-title">{title}</h2>
        <ol>{steps.map((s) => <li key={s}>{s}</li>)}</ol>
        <button ref={ref} type="button" className="btn btn--primary" onClick={onClose}>Got it</button>
      </div>
    </div>,
    document.body
  );
}

// "Install app" button. Chrome/Edge: one tap. iPhone Safari and other browsers: step-by-step help.
// Hidden once the site is running as an installed app.
export function InstallButton({ variant = "header" }) {
  const info = useInstall();
  const [help, setHelp] = useState(false);
  if (info.hidden) return null;
  const click = async () => {
    if (info.canPrompt) await promptInstall();
    else setHelp(true);
  };
  return (
    <>
      <button type="button" className={"ia-btn ia-btn--" + variant} onClick={click}>
        <DownloadIcon />
        <span>Install app</span>
      </button>
      {help && <HelpDialog info={info} onClose={() => setHelp(false)} />}
    </>
  );
}

// A small card for phones, shown at most once a month.
export function InstallCard() {
  const info = useInstall();
  const [show, setShow] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    if (info.hidden || !info.phone || !cardDue()) return;
    // Wait until the person has had time to look around, and the page has finished loading.
    const t = setTimeout(() => setShow(true), 12000);
    return () => clearTimeout(t);
  }, [info.hidden, info.phone]);

  if (!show || info.hidden) return null;
  const close = () => { cardSnooze(); setShow(false); };
  const install = async () => {
    if (info.canPrompt) { await promptInstall(); close(); } else setHelp(true);
  };
  return (
    <>
      <aside className="ia-card" aria-label="Install the app">
        <img src="/icon-192.png" alt="" width="44" height="44" />
        <div className="ia-card__txt"><strong>Get the app</strong><span>Open Firefox Publisher from your home screen.</span></div>
        <div className="ia-card__act">
          <button type="button" className="ia-card__go" onClick={install}>Install</button>
          <button type="button" className="ia-card__no" onClick={close} aria-label="Not now, hide this for a month">Not now</button>
        </div>
      </aside>
      {help && <HelpDialog info={info} onClose={() => { setHelp(false); close(); }} />}
    </>
  );
}
