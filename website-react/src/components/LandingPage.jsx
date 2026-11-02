import { Link } from "react-router-dom";
import { CtaBand, Reveal } from "./ui.jsx";
import { PageSchema } from "./Schema.jsx";
import { usePageMeta } from "../hooks.js";

// One layout for the search-focused landing pages (KDP help, cover design, ghostwriting, children's books).
// Each page supplies its own words; the markup, structured data (Service-style page, breadcrumbs, FAQ)
// and styles are shared with the rest of the site.
export default function LandingPage({ meta, schemaName, path, crumb, h1, lead, intro, sections, steps, related, faq, ctaLabel = "Get a free consultation" }) {
  usePageMeta(meta.title, meta.description);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageSchema name={schemaName} path={path} description={meta.description} />
      <section className="page-hero">
        <div className="wrap">
          <p className="crumbs"><Link to="/">Home</Link> / {crumb}</p>
          <h1>{h1}</h1>
          <p className="lead">{lead}</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">{ctaLabel}</Link>
            <Link className="btn btn--secondary" to="/portfolio">See our work</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal>
            {intro.map((t) => <p key={t}>{t}</p>)}
          </Reveal>
        </div>
      </section>

      {sections.map((s, i) => (
        <section key={s.title} className={"section" + (i % 2 === 0 ? " section--ice" : "")}>
          <div className="wrap">
            <h2>{s.title}</h2>
            {s.text && <p>{s.text}</p>}
            <div className="grid grid--3">
              {s.items.map(([t, d]) => (
                <Reveal as="article" className="work" key={t}>
                  <div className="work__body">
                    <h3>{t}</h3>
                    <p className="work__desc">{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="wrap">
          <h2>How it works</h2>
          <ol>
            {steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <p>
            Related: {related.map(([to, label], i) => <span key={to}>{i > 0 && ", "}<Link to={to}>{label}</Link></span>)}.
          </p>
        </div>
      </section>

      <section className="section section--ice" id="faq">
        <div className="wrap bw-faq">
          <h2>Questions authors ask</h2>
          <div className="faq">
            {faq.map(([q, a]) => (
              <Reveal as="details" className="faq__item" key={q} name="landing-faq">
                <summary>
                  <span>{q}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                </summary>
                <p>{a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
