import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { INTERESTS, SITE } from "../data/site.js";
import { DIAL_CODES, RULES } from "./Tools.jsx";
import { sendContact } from "../lib/sendContact.js";

// Every link or button that points at #contact opens this pop-up instead of jumping
// down the page. A package button can pass its name in data-plan to pre-fill the message.
// Front-end only, like the inline form: the message is handed to the visitor's email app.
const CSS = `
.cp-back { position: fixed; inset: 0; z-index: 2000; display: grid; place-items: center; padding: 20px; background: rgba(8,20,40,.62); backdrop-filter: blur(4px); overflow-y: auto; animation: cp-fade .2s ease; }
.cp { position: relative; width: min(920px, 100%); display: grid; grid-template-columns: 1fr 1fr; background: #fff; border-radius: 7px; box-shadow: 0 40px 90px -30px rgba(0,0,0,.65); animation: cp-pop .28s cubic-bezier(.2,.8,.2,1); margin: auto; }
@keyframes cp-fade { from { opacity: 0 } }
@keyframes cp-pop { from { opacity: 0; transform: translateY(14px) scale(.98) } }
.cp__side { position: relative; border-radius: 7px 0 0 7px; overflow: hidden; color: #fff; display: flex; flex-direction: column; background: #0b1c35; }
.cp__side { justify-content: flex-end; min-height: 510px; background: #0b1c35; }
.cp__side img { position: absolute; top: 0; left: 0; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; -webkit-mask-image: linear-gradient(#000 78%, transparent); mask-image: linear-gradient(#000 78%, transparent); }
/* the photo fades into blue behind the text, so the book cover above stays clear */
.cp__side::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(29,95,168,0) 0, rgba(29,95,168,0) 60%, rgba(22,70,130,.9) 72%, #0b1c35 100%); }
.cp__txt { position: relative; z-index: 1; padding: 20px 26px 26px; }
.cp__side h3 { margin: 0 0 12px; font: 600 1.2rem/1.25 var(--font-sans); color: #fff; }
.cp__side ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.cp__side li { display: flex; gap: 10px; align-items: center; font-size: .88rem; color: #fff; }
.cp__side li svg { flex: none; color: #f28c28; }
.cp__main { padding: 38px 36px 32px; }
.cp__main h2 { margin: 0 0 20px; font: 400 1.5rem/1.25 var(--font-sans); color: #12294a; }
.cp__main h2 strong { font-weight: 800; }
.cp__x { z-index: 5; position: absolute; top: -12px; right: -12px; width: 34px; height: 34px; border-radius: 50%; border: 0; display: grid; place-items: center; cursor: pointer; background: #f28c28; color: #12294a; box-shadow: 0 8px 18px -6px rgba(0,0,0,.5); transition: transform .2s; }
.cp__x:hover { transform: rotate(90deg); }
.cp__x:focus-visible, .cp__send:focus-visible { outline: 3px solid #fff; outline-offset: 2px; box-shadow: 0 0 0 5px #1d5fa8; }
.cp__form { display: grid; gap: 12px; }
.cp .cp__f { position: relative; display: block; margin: 0; padding: 0; }
.cp__f > svg { position: absolute; left: 13px; top: 15px; z-index: 1; color: #7b8ca6; pointer-events: none; }
.cp .cp__f input, .cp .cp__f select, .cp .cp__f textarea { display: block; width: 100%; height: 48px; margin: 0; box-sizing: border-box; font: 500 .95rem/1.2 var(--font-sans); color: #12294a; padding: 0 14px 0 40px; border: 1.5px solid #d6e3f2; border-radius: 7px; background-color: #fbfdff; box-shadow: none; }
.cp .cp__f select { -webkit-appearance: none; appearance: none; padding-right: 36px; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%237b8ca6' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 13px center; }
.cp .cp__f textarea { height: auto; min-height: 90px; padding: 13px 14px 13px 40px; resize: vertical; }
.cp .cp__f input:focus, .cp .cp__f select:focus, .cp .cp__f textarea:focus { outline: none; border-color: #1d5fa8; box-shadow: 0 0 0 4px rgba(242,140,40,.35); background-color: #fff; }
.cp .cp__f [aria-invalid="true"] { border-color: #c0392b; }
.cp__phone { display: grid; grid-template-columns: 138px 1fr; gap: 8px; }
.cp .cp__phone select { padding: 0 32px 0 12px; }
.cp__phone .cp__f > svg { display: none; }
.cp .cp__phone .cp__f:last-child input { padding-left: 14px; }
.cp__err { display: block; min-height: 0; font-size: .8rem; color: #c0392b; margin-top: 4px; }
.cp__send { margin-top: 4px; border: 0; cursor: pointer; padding: 15px 22px; border-radius: 7px; background: #f28c28; color: #12294a; font: 800 .95rem var(--font-sans); letter-spacing: .06em; text-transform: uppercase; box-shadow: 0 14px 26px -12px rgba(242,140,40,.9); transition: transform .2s, box-shadow .2s; }
.cp__send:hover { transform: translateY(-2px); }
.cp__send:disabled { opacity: .7; cursor: progress; transform: none; }
.cp__status { margin: 0; font-size: .85rem; color: #3e5272; min-height: 1.2em; }
.cp__note { margin: 0; font-size: .75rem; color: #5b6d8a; }
@media (max-width: 760px) {
  .cp { grid-template-columns: 1fr; }
  .cp__side { border-radius: 7px 7px 0 0; min-height: 0; }
  .cp__side img { position: static; aspect-ratio: 4 / 3; object-position: center 40%; }
  .cp__side::after { background: linear-gradient(180deg, transparent 20%, rgba(22,70,130,.9) 55%, #0b1c35 100%); }
  .cp__txt { margin-top: -90px; }
  .cp__main { padding: 26px 22px; }
  .cp__x { top: 10px; right: 10px; }
}
@media (prefers-reduced-motion: reduce) { .cp-back, .cp { animation: none; } .cp__x:hover, .cp__send:hover { transform: none; } }
`;

const ICON = (d) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const ICONS = {
  name: ICON(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>),
  email: ICON(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>),
  phone: ICON(<><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>),
  topic: ICON(<><path d="M4 5h16v11H8l-4 4z" /></>),
  msg: ICON(<><path d="M5 4h14v16H5zM9 9h6M9 13h6" /></>),
};
const POINTS = ["Free, no-obligation consultation", "A reply within one working day", "Honest advice on scope and cost", "Writing, design, print and marketing"];
const EMPTY = { name: "", email: "", dial: DIAL_CODES[0], phone: "", interest: INTERESTS[0], message: "" };

export default function ContactPopup() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [trap, setTrap] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dialog = useRef(null);
  const opener = useRef(null);

  // Capture phase so this runs before the router turns the click into a page jump.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || !/#contact$/.test(a.getAttribute("href"))) return;
      e.preventDefault();
      e.stopPropagation();
      opener.current = a;
      const plan = a.dataset.plan;
      setValues((v) => (plan && !v.message.trim() ? { ...v, message: "I am interested in the " + plan + "." } : v));
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const close = () => {
    setOpen(false);
    opener.current?.focus?.();
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector("input")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      const f = [...dialog.current.querySelectorAll("button, input, select, textarea, a[href]")].filter((x) => !x.disabled);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open]);

  if (!open) return <style>{CSS}</style>;

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const invalid = (k) => (submitted && errors[k] ? "true" : undefined);

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const next = {};
    Object.keys(RULES).forEach((k) => { const m = RULES[k](values[k]); if (m) next[k] = m; });
    setErrors(next);
    setSubmitted(true);
    const first = Object.keys(next)[0];
    if (first) {
      setStatus("Please fix the highlighted fields.");
      dialog.current.querySelector("[name=" + first + "]")?.focus();
      return;
    }
    setSending(true);
    setStatus("Sending your message\u2026");
    const r = await sendContact({ ...values, website: trap });
    setSending(false);
    if (!r.ok) {
      setStatus(r.error);
    } else if (r.via === "api") {
      const name = values.name;
      setValues(EMPTY);
      setErrors({});
      setSubmitted(false);
      setStatus("");
      setOpen(false);
      navigate("/thank-you", { state: { name } });
    } else {
      setStatus("We couldn't send it automatically, so your email app should open with the message ready. If it doesn't, email us at " + SITE.email + ".");
    }
  };

  const err = (k) => <span className="cp__err" id={"cp-" + k + "-err"} role={errors[k] ? "alert" : undefined}>{submitted ? errors[k] : ""}</span>;

  return (
    <>
      <style>{CSS}</style>
      <div className="cp-back" onMouseDown={(e) => e.target === e.currentTarget && close()}>
        <div className="cp" role="dialog" aria-modal="true" aria-labelledby="cp-title" ref={dialog}>
          <button className="cp__x" type="button" aria-label="Close" onClick={close}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
          <aside className="cp__side">
            <img src="/assets/popup-book.webp" alt="Hands holding a hardcover novel, Love, Eventually by Clara Wren" />
            <div className="cp__txt">
            <h3>Let&rsquo;s start your book.</h3>
            <ul>
              {POINTS.map((p) => (
                <li key={p}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                  {p}
                </li>
              ))}
            </ul>
            </div>
          </aside>
          <div className="cp__main">
            <h2 id="cp-title">Tell us about <strong>your book.</strong></h2>
            <form className="cp__form" noValidate onSubmit={submit}>
              <div>
                <label className="cp__f">{ICONS.name}<input name="name" type="text" autoComplete="name" placeholder="Your name" aria-label="Name" aria-invalid={invalid("name")} value={values.name} onChange={set("name")} /></label>
                {err("name")}
              </div>
              <div>
                <label className="cp__f">{ICONS.email}<input name="email" type="email" autoComplete="email" placeholder="Email" aria-label="Email" aria-invalid={invalid("email")} value={values.email} onChange={set("email")} /></label>
                {err("email")}
              </div>
              <div>
                <div className="cp__phone">
                  <label className="cp__f"><select aria-label="Country code" value={values.dial} onChange={set("dial")}>{DIAL_CODES.map((c) => <option key={c}>{c}</option>)}</select></label>
                  <label className="cp__f"><input name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="Phone number" aria-label="Phone number" aria-invalid={invalid("phone")} value={values.phone} onChange={set("phone")} /></label>
                </div>
                {err("phone")}
              </div>
              <label className="cp__f">{ICONS.topic}<select name="interest" aria-label="What do you need?" value={values.interest} onChange={set("interest")}>{INTERESTS.map((o) => <option key={o}>{o}</option>)}</select></label>
              <div>
                <label className="cp__f">{ICONS.msg}<textarea name="message" placeholder="Tell us about your book and what you need" aria-label="Your message" aria-invalid={invalid("message")} value={values.message} onChange={set("message")} /></label>
                {err("message")}
              </div>
              <div className="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label></div>
              <button className="cp__send" type="submit" disabled={sending}>{sending ? "Sending\u2026" : "Start my book"}</button>
              <p className="cp__status" role="status">{status}</p>
              <p className="cp__note">We will only use your details to reply about your project.</p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
