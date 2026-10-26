import { Link, useLocation } from "react-router-dom";
import { Reveal } from "../components/ui.jsx";
import { usePageMeta } from "../hooks.js";

const NEXT = [
  ["We read your message", "A real person on the team reads what you wrote and the details you shared about your book."],
  ["We reply by email", "You will hear from us at the address you gave. Replies come from contactus@firefoxpublisher.com, so it is worth checking spam the first time."],
  ["We plan the next step", "We confirm what you need and agree the scope in writing before any work begins."],
];

export default function ThankYou() {
  usePageMeta("Thank you | Firefox Publisher", "Your message has been sent to Firefox Publisher.", { noindex: true });
  // The form passes the name in router state, so nothing personal ever appears in the address bar.
  const { state } = useLocation();
  const first = typeof state?.name === "string" ? state.name.trim().split(/\s+/)[0] : "";

  return (
    <div className="bw-page ty">
      <section className="ty__hero" aria-labelledby="ty-title">
        <div className="wrap ty__in">
          <span className="ty__tick" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
          </span>
          <p className="bw-hero3__pill">Message sent</p>
          <h1 id="ty-title">Thank you{first ? `, ${first}` : ""}! <span className="ty__accent">We&rsquo;ve got your message.</span></h1>
          <p className="lead">Your details are with the Firefox Publisher team. We are excited to hear about your book.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/">Back to the home page</Link>
            <Link className="btn btn--secondary" to="/#services">Explore our services</Link>
          </div>
        </div>
      </section>

      <section className="section section--ice">
        <div className="wrap">
          <Reveal className="section__head section__head--center">
            <p className="eyebrow">What happens next</p>
            <h2>Here&rsquo;s what to expect</h2>
          </Reveal>
          <ol className="ty__steps">
            {NEXT.map(([t, d], i) => (
              <Reveal as="li" className="ty__step" key={t} delay={i * 80}>
                <span className="ty__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </ol>
          <p className="center ty__more">
            While you wait: <Link to="/portfolio">see our work</Link>, <Link to="/books">browse sample books</Link> or <Link to="/about">read about us</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
