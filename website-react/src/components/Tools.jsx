import { useState } from "react";
import { INTERESTS, READINESS, READINESS_MSGS } from "../data/site.js";
import { Reveal } from "./ui.jsx";

const plural = (n) => n + (n === 1 ? " week" : " weeks");

// Illustrative schedule from manuscript length (k = thousands of words).
// Editorial grows with length (about one week per 15k words, two at the least);
// production grows more slowly; discovery gets a second week for very long books.
export function estimateWeeks(k) {
  const rows = [
    ["Discovery", k > 120 ? 2 : 1],
    ["Editorial", Math.max(2, Math.ceil(k / 15))],
    ["Design & production", 2 + Math.ceil(k / 50)],
    ["Launch prep", 2],
  ];
  const total = rows.reduce((sum, r) => sum + r[1], 0);
  return { rows, total };
}

export function Estimator() {
  const [k, setK] = useState(60);
  const { rows, total } = estimateWeeks(k);
  const months = (total / 4.345).toFixed(1);
  return (
    <Reveal className="estimator">
      <div className="est__field">
        <label htmlFor="words">Manuscript length: <strong id="words-out">{(k * 1000).toLocaleString()} words</strong></label>
        <input type="range" id="words" min="10" max="200" step="5" value={k} onChange={(e) => setK(Number(e.target.value))} />
        <div className="est__ends" aria-hidden="true"><span>10,000</span><span>200,000</span></div>
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

const RULES = {
  name: (v) => (v.trim() ? "" : "Please enter your name."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address, like name@example.com."),
  message: (v) => (v.trim().length >= 10 ? "" : "Please tell us a little about your project (at least 10 characters)."),
};

// Front-end only: wire to a backend or form service before launch.
export function ContactForm({ plan }) {
  const [values, setValues] = useState({ name: "", email: "", interest: INTERESTS[0], message: "" });
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
    setStatus(
      Object.keys(next).length
        ? "Please fix the highlighted fields."
        : "Thank you. The form is not connected to email yet, so this message was not sent."
    );
  };

  const field = (k, label, input) => (
    <div className="field">
      <label htmlFor={k}>{label}</label>
      {input}
      <span className="err" id={k + "-err"}>{errors[k] || ""}</span>
    </div>
  );
  const invalid = (k) => (submitted ? String(Boolean(errors[k])) : undefined);

  return (
    <Reveal as="form" className="form" id="contact-form" noValidate onSubmit={submit}>
      <div className="row2">
        {field("name", "Name", <input id="name" name="name" type="text" autoComplete="name" required value={values.name} onChange={set("name")} aria-invalid={invalid("name")} />)}
        {field("email", "Email", <input id="email" name="email" type="email" autoComplete="email" required value={values.email} onChange={set("email")} aria-invalid={invalid("email")} />)}
      </div>
      <div className="field">
        <label htmlFor="interest">I am interested in</label>
        <select id="interest" name="interest" value={values.interest} onChange={set("interest")}>
          {INTERESTS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      {field("message", "Your message", <textarea id="message" name="message" required value={values.message} onChange={set("message")} aria-invalid={invalid("message")} />)}
      <button className="btn btn--primary" type="submit">Send message</button>
      <p className="form__status" id="form-status" role="status">{status}</p>
    </Reveal>
  );
}
