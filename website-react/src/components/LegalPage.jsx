import { Link } from "react-router-dom";
import { PageSchema } from "./Schema.jsx";
import { usePageMeta } from "../hooks.js";
import { SITE } from "../data/site.js";
import "../styles/legal.css";

export const LEGAL_UPDATED = "October 30, 2026";

// Shared layout for the Privacy Policy and Terms of Service. `sections` is [heading, [paragraph or list, ...]].
export default function LegalPage({ title, metaTitle, description, path, intro, sections }) {
  usePageMeta(metaTitle, description);
  return (
    <>
      <PageSchema name={title} path={path} description={description} />
      <section className="page-hero">
        <div className="wrap">
          <p className="crumbs"><Link to="/">Home</Link> / {title}</p>
          <h1>{title}</h1>
          <p className="lead">{intro}</p>
          <p className="legal__date">Last updated: {LEGAL_UPDATED}</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap legal">
          {sections.map(([h, body]) => (
            <section key={h} className="legal__sec">
              <h2>{h}</h2>
              {body.map((b, i) => Array.isArray(b)
                ? <ul key={i}>{b.map((li) => <li key={li}>{li}</li>)}</ul>
                : <p key={i}>{b}</p>)}
            </section>
          ))}
          <section className="legal__sec">
            <h2>Contact us</h2>
            <p>Questions about this page? Email <a href={"mailto:" + SITE.email}>{SITE.email}</a> or call <a href={SITE.phoneHref}>{SITE.phone}</a>. Firefox Publisher, 333 Washington St #233, Hoboken, NJ 07030, USA.</p>
          </section>
        </div>
      </section>
    </>
  );
}
