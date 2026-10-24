import { useState } from "react";
import { INTERESTS, READINESS, READINESS_MSGS, SITE } from "../data/site.js";
import { Reveal } from "./ui.jsx";

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
const kFromSlider = (pos) => {
  const raw = MIN_K * Math.pow(MAX_K / MIN_K, pos / 100);
  const step = raw < 100 ? 5 : raw < 500 ? 25 : 100;
  return Math.min(MAX_K, Math.max(MIN_K, Math.round(raw / step) * step));
};
const sliderFromK = (k) => Math.round((Math.log(k / MIN_K) / Math.log(MAX_K / MIN_K)) * 100);

export function Estimator() {
  const [pos, setPos] = useState(() => sliderFromK(60));
  const k = kFromSlider(pos);
  const { rows, total } = estimateWeeks(k);
  const months = (total / 4.345).toFixed(1);
  return (
    <Reveal className="estimator">
      <div className="est__field">
        <label htmlFor="words">Manuscript length: <strong id="words-out">{(k * 1000).toLocaleString()} words</strong></label>
        <input type="range" id="words" min="0" max="100" step="1" value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-valuetext={`${(k * 1000).toLocaleString()} words`} />
        <div className="est__ends" aria-hidden="true"><span>10,000</span><span>2,000,000</span></div>
      </div>

      <div className="est__result" aria-live="polite">
        <p className="est__headline"><strong>{total} {total === 1 ? "week" : "weeks"}</strong> <span>(approx. {months} months)</span></p>
        <dl className="est" id="est-out">
          {rows.map(([name, n]) => (
            <div key={name}><dt>{name}</dt><dd>{plural(n)}</dd></div>
          ))}
        </dl>
      </div>

      <p className="est__note">
        Assumes standard editing rounds and one cover revision cycle. This is an illustration; we confirm a real timeline in your written scope.
      </p>
    </Reveal>
  );
}

export function Readiness() {
  const [checked, setChecked] = useState(() => READINESS.map(() => false));
  const n = checked.filter(Boolean).length;
  return (
    <Reveal className="form" id="readiness" role="group" aria-labelledby="rd-title">
      <h3 id="rd-title">Publishing readiness checker</h3>
      <p style={{ color: "var(--slate)", fontSize: ".95rem" }}>Tick what is true for your manuscript today.</p>
      {READINESS.map((label, i) => (
        <label className="chk" key={label}>
          <input
            type="checkbox"
            checked={checked[i]}
            onChange={(e) => setChecked((c) => c.map((v, j) => (j === i ? e.target.checked : v)))}
          />{" "}
          {label}
        </label>
      ))}
      <p className="form__status" id="rd-out" role="status">
        {n === 0 ? "Score: 0 of 6" : `Score: ${n} of 6. ${READINESS_MSGS[n]}`}
      </p>
    </Reveal>
  );
}

const DIAL_CODES = ["+1 US/CA", "+44 UK", "+91 IN", "+971 UAE", "+61 AU", "+92 PK", "+49 DE", "+86 CN"];

const RULES = {
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

  // A package button pre-fills the message, but never overwrites what the visitor typed.
  if (plan && plan !== lastPlan) {
    setLastPlan(plan);
    if (!values.message.trim()) setValues((v) => ({ ...v, message: "I am interested in the " + plan.name + "." }));
  }

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
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
    // No mail service is connected yet, so hand the message to the visitor's email app.
    const body = [
      "Name: " + values.name.trim(),
      "Email: " + values.email.trim(),
      "Phone: " + values.dial.split(" ")[0] + " " + values.phone.trim(),
      "",
      values.message.trim(),
    ].join("\n");
    window.location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent(values.interest) + "&body=" + encodeURIComponent(body);
    setStatus("Your email app should open with your message ready to send. If it doesn't, email us at " + SITE.email + ".");
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
      <button className="btn btn--primary" type="submit">
        Send message
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
