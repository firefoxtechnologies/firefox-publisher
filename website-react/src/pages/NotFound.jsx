import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks.js";

export default function NotFound() {
  usePageMeta("Page not found | Firefox Publisher", undefined, { noindex: true });
  return (
    <section className="page-hero">
      <div className="wrap">
        <h1>Page not found</h1>
        <p className="lead">That page does not exist. Head back home or browse our services.</p>
        <div className="hero__cta">
          <Link className="btn btn--primary" to="/">Back to home</Link>
          <Link className="btn btn--secondary" to="/#services">See services</Link>
        </div>
      </div>
    </section>
  );
}
