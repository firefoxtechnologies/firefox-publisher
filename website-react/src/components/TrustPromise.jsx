import { Link } from "react-router-dom";
import { Reveal } from "./ui.jsx";
import { SITE } from "../data/site.js";
import "../styles/trust.css";

// Replaces the placeholder testimonials. Every point here restates something the site already
// promises elsewhere (written scope, ISBN in the author's name, no guaranteed results, free consultation).
const POINTS = [
  { title: "A written scope before you pay", text: "Every project starts with a written scope: what is included, the fee and a real timeline. You approve it before any work begins.", icon: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" },
  { title: "Your ISBN, in your name", text: "ISBNs we arrange are registered under your name, so your book stays yours on every retailer.", icon: "M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z" },
  { title: "Honest about results", text: "We never promise sales or bestseller status. Results vary, and we tell you what to realistically expect.", icon: "M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6zM9 12l2 2 4-4" },
  { title: "Real people, real answers", text: "Talk to our team before you commit. A free consultation costs nothing, and you can reach us by email or phone.", icon: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" },
];

export default function TrustPromise() {
  return (
    <section className="section trust" id="trust" aria-labelledby="trust-title">
      <div className="wrap">
        <Reveal className="section__head section__head--center">
          <p className="eyebrow">Publish with confidence</p>
          <h2 id="trust-title">How we protect your project</h2>
          <p>Trusting a team with your book is a big step. Here is what we put in writing before you spend a cent.</p>
        </Reveal>
        <ul className="trust__grid">
          {POINTS.map((p, i) => (
            <Reveal as="li" key={p.title} className="trust__card" delay={i * 80}>
              <span className="trust__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={p.icon} /></svg></span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </ul>
        <div className="trust__cta">
          <p>Not ready to commit? Start with no risk.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/free-book-cover-maker">Design a cover free</Link>
            <a className="btn btn--secondary" href="#contact" data-plan="Ask for terms and a sample scope">Ask for our terms and a sample scope</a>
            <a className="trust__link" href={SITE.phoneHref}>or call {SITE.phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
