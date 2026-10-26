import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BOOK_STAGES, INTERESTS, SITE } from "../data/site.js";
import { Reveal } from "./ui.jsx";
import { sendContact } from "../lib/sendContact.js";

const plural = (n) => n + (n === 1 ? " week" : " weeks");

// Illustrative schedule from manuscript length (k = thousands of words, 10 to 2,000).
// Every length fits within 3 months: the longest manuscript (2,000,000 words) is the
// ceiling at 13 weeks, and shorter ones scale down from there (7 weeks at 10k words).
// Length is scaled logarithmically, so ordinary book lengths still show a clear difference.
const MIN_K = 10;
const MAX_K = 2000;
export function estimateWeeks(k) {
  const t = Math.min(1, Math.max(0, Math.log(k / MIN_K) / Math.log(MAX_K / MIN_K)));
  const rows = [
    ["Discovery", 1],
    ["Editorial", Math.min(6, Math.ceil(2 + 4 * t))],
    ["Design & production", Math.min(4, Math.ceil(2 + 2 * t))],
    ["Launch prep", 2],
  ];
  const total = rows.reduce((sum, r) => sum + r[1], 0);
  return { rows, total };
}

// The slider runs 0 to 100 and maps onto 10k to 2M words on a curve, rounded to tidy steps.
export const kFromSlider = (pos) => {
  const raw = MIN_K * Math.pow(MAX_K / MIN_K, pos / 100);
  const step = raw < 100 ? 5 : raw < 500 ? 25 : 100;
  return Math.min(MAX_K, Math.max(MIN_K, Math.round(raw / step) * step));
};
export const sliderFromK = (k) => Math.round((Math.log(k / MIN_K) / Math.log(MAX_K / MIN_K)) * 100);
export const DEFAULT_POS = sliderFromK(60);

// How many of the four phases (Discovery, Editorial, Design & production, Launch prep)
// a book at each stage in BOOK_STAGES has already been through.
const PHASES_DONE = [0, 0, 1, 2, 3, 3];

// Weeks still ahead for a manuscript of k thousand words that is at stage index `stageIdx`.
export function remainingFrom(k, stageIdx) {
  const { rows } = estimateWeeks(k);
  const done = PHASES_DONE[stageIdx] ?? 0;
  const left = rows.slice(done);
  return { rows, done, total: left.reduce((sum, r) => sum + r[1], 0) };
}

const inMonths = (weeks) => (weeks / 4.345).toFixed(1);

// Shared with the "Where is your book now?" picker: both read and write the same stage
// and manuscript length, so choosing a stage up there re-cuts the schedule down here.
export function Estimator({ pos, onPos, stage, onStage }) {
  const [ownPos, setOwnPos] = useState(DEFAULT_POS);
  const [ownStage, setOwnStage] = useState(0);
  const p = pos ?? ownPos, setP = onPos ?? setOwnPos;
  const st = stage ?? ownStage, setSt = onStage ?? setOwnStage;
  const k = kFromSlider(p);
  const { rows, done, total } = remainingFrom(k, st);
  return (
    <Reveal className="estimator">
      <div className="est__field">
        <span className="est__lab" id="est-stage-lab">Where is your book now?</span>
        <div className="est__stages" role="group" aria-labelledby="est-stage-lab">
          {BOOK_STAGES.map((b, i) => (
            <button key={b.id} type="button" aria-pressed={i === st} className={"est__chip" + (i === st ? " is-on" : "")} onClick={() => setSt(i)}>{b.label}</button>
          ))}
        </div>
      </div>

      <div className="est__field">
        <label htmlFor="words">Manuscript length: <strong id="words-out">{(k * 1000).toLocaleString()} words</strong></label>
        <input type="range" id="words" min="0" max="100" step="1" value={p} onChange={(e) => setP(Number(e.target.value))} aria-valuetext={`${(k * 1000).toLocaleString()} words`} />
        <div className="est__ends" aria-hidden="true"><span>10,000</span><span>2,000,000</span></div>
      </div>

      <div className="est__result" aria-live="polite">
        <p className="est__headline"><strong>{total} {total === 1 ? "week" : "weeks"}</strong> <span>to go from &ldquo;{BOOK_STAGES[st].label}&rdquo; (approx. {inMonths(total)} months)</span></p>
        <dl className="est" id="est-out">
          {rows.map(([name, n], i) => (
            <div key={name} className={i < done ? "is-done" : undefined}><dt>{name}</dt><dd>{i < done ? "Done" : plural(n)}</dd></div>
          ))}
        </dl>
      </div>

      <p className="est__note">
        Assumes standard editing rounds and one cover revision cycle, and a finished draft. This is an illustration; we confirm a real timeline in your written scope.
      </p>
    </Reveal>
  );
}

export const DIAL_CODES = ["+1 US/CA", "+44 UK", "+91 IN", "+971 UAE", "+61 AU", "+92 PK", "+49 DE", "+86 CN"];

export const RULES = {
  name: (v) => (v.trim() ? "" : "Please enter your name."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address, like name@example.com."),
  phone: (v) => {
    if (!v.trim()) return "Please enter your phone number.";
    const digits = v.replace(/\D/g, "").length;
    return /^[+()\d\s.-]+$/.test(v.trim()) && digits >= 7 && digits <= 15 ? "" : "Please enter a valid phone number, like +1 201 555 0123.";
  },
  message: (v) => (v.trim().length >= 10 ? "" : "Please tell us a little about your project (at least 10 characters)."),
};

// Front-end only: wire to a backend or form service before launch.
export function ContactForm({ plan }) {
  const [values, setValues] = useState({ name: "", email: "", dial: DIAL_CODES[0], phone: "", interest: INTERESTS[0], message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [lastPlan, setLastPlan] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [trap, setTrap] = useState("");

  // A package button pre-fills the message, but never overwrites what the visitor typed.
  if (plan && plan !== lastPlan) {
    setLastPlan(plan);
    if (!values.message.trim()) setValues((v) => ({ ...v, message: "I am interested in the " + plan.name + "." }));
  }

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const next = {};
    Object.keys(RULES).forEach((k) => {
      const msg = RULES[k](values[k]);
      if (msg) next[k] = msg;
    });
    setErrors(next);
    setSubmitted(true);
    const first = Object.keys(next)[0];
    if (first) {
      setStatus("Please fix the highlighted fields.");
      document.getElementById(first)?.focus();
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
      setValues({ name: "", email: "", dial: DIAL_CODES[0], phone: "", interest: INTERESTS[0], message: "" });
      setErrors({});
      setSubmitted(false);
      setStatus("");
      navigate("/thank-you", { state: { name } });
    } else {
      setStatus("We couldn't send it automatically, so your email app should open with the message ready. If it doesn't, email us at " + SITE.email + ".");
    }
  };

  const field = (k, label, input) => (
    <div className="field">
      <label htmlFor={k}>
        {label}
        <span className="req" aria-hidden="true"> *</span>
      </label>
      {input}
      <span className="err" id={k + "-err"} role={errors[k] ? "alert" : undefined}>{errors[k] || ""}</span>
    </div>
  );
  const invalid = (k) => (submitted ? String(Boolean(errors[k])) : undefined);

  return (
    <Reveal className="cx__shell">
    <form className="form" id="contact-form" noValidate onSubmit={submit}>
      <h3 className="cx__ftitle">Contact us</h3>
      <div className="row2">
        {field("name", "Name", <input id="name" name="name" type="text" aria-required="true" autoComplete="name" required placeholder="Your full name" value={values.name} onChange={set("name")} aria-invalid={invalid("name")} />)}
        {field("email", "Email", <input id="email" name="email" type="email" aria-required="true" autoComplete="email" required placeholder="name@example.com" value={values.email} onChange={set("email")} aria-invalid={invalid("email")} />)}
      </div>
      <div className="row2">
        {field("phone", "Phone number", (
          <div className="phone" data-invalid={invalid("phone")}>
            <select aria-label="Country code" value={values.dial} onChange={set("dial")}>
              {DIAL_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" required aria-required="true" placeholder="555 0123" value={values.phone} onChange={set("phone")} aria-invalid={invalid("phone")} />
          </div>
        ))}
        <div className="field">
          <label htmlFor="interest">Subject</label>
          <select id="interest" name="interest" value={values.interest} onChange={set("interest")}>
            {INTERESTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      {field("message", "Your message", <textarea id="message" name="message" aria-required="true" required placeholder="Tell us about your book and what you need help with" value={values.message} onChange={set("message")} aria-invalid={invalid("message")} />)}
      <p className="form__req"><span className="req" aria-hidden="true">*</span> Required fields</p>
      <div className="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label></div>
      <button className="btn btn--primary" type="submit" disabled={sending}>
        {sending ? "Sending\u2026" : "Send message"}
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </button>
      <p className="form__status" id="form-status" role="status">{status}</p>
      <p className="cx__privacy">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
        <span>By sending this message you agree to be contacted about your project. We respect your data and will never share your information without your consent.</span>
      </p>
    </form>
    </Reveal>
  );
}
