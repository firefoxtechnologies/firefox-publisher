import { useSyncExternalStore } from "react";
import { isNativeApp } from "./api.js";

// Install state for the "Install app" buttons. Chrome and Edge (Android and desktop) send a
// `beforeinstallprompt` event that allows a one-tap install; Safari on iPhone has no such event,
// so people are shown the Share > Add to Home Screen steps instead.
let deferred = null;
let installed = false;
const listeners = new Set();
let snapshot = {};

const standalone = () =>
  typeof window !== "undefined" &&
  (matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: window-controls-overlay)").matches || navigator.standalone === true);

const ua = () => (typeof navigator === "undefined" ? "" : navigator.userAgent);
const isIPhone = () => /iP(hone|ad|od)/.test(ua()) || (typeof navigator !== "undefined" && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

function compute() {
  const iphone = isIPhone();
  const next = {
    // Already running as an app, or installed from this browser earlier: hide every install button.
    hidden: installed || isNativeApp() || standalone(),
    canPrompt: !!deferred,
    iphone,
    // iPhone browsers other than Safari cannot add to the home screen.
    iphoneSafari: iphone && /Safari/.test(ua()) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua()),
    firefoxDesktop: !iphone && /Firefox\//.test(ua()) && !/Android/.test(ua()),
    safariMac: !iphone && /Safari\//.test(ua()) && !/Chrome|Chromium|Edg|OPR/.test(ua()) && /Macintosh/.test(ua()),
    phone: typeof matchMedia === "function" && matchMedia("(max-width: 760px)").matches,
  };
  const same = Object.keys(next).every((k) => snapshot[k] === next[k]);
  if (!same) snapshot = next;
}

const emit = () => { compute(); listeners.forEach((l) => l()); };

if (typeof window !== "undefined") {
  try { installed = localStorage.getItem("fp-installed") === "1" && standalone(); } catch { /* storage blocked */ }
  addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; emit(); });
  addEventListener("appinstalled", () => {
    installed = true;
    deferred = null;
    try { localStorage.setItem("fp-installed", "1"); } catch { /* storage blocked */ }
    emit();
  });
  matchMedia("(display-mode: standalone)").addEventListener?.("change", emit);
  compute();
}

const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
const getSnapshot = () => snapshot;
const serverSnapshot = { hidden: true };

export const useInstall = () => useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);

// One-tap install where the browser allows it. Returns "accepted", "dismissed" or "unavailable".
export async function promptInstall() {
  if (!deferred) return "unavailable";
  const e = deferred;
  deferred = null;
  emit();
  e.prompt();
  const { outcome } = await e.userChoice;
  return outcome;
}

// The phone install card is shown at most once a month.
const KEY = "fp-install-card";
const MONTH = 30 * 24 * 60 * 60 * 1000;
export function cardDue() {
  try { return Date.now() - Number(localStorage.getItem(KEY) || 0) > MONTH; } catch { return true; }
}
export function cardSnooze() {
  try { localStorage.setItem(KEY, String(Date.now())); } catch { /* storage blocked */ }
}
