import { Link } from "react-router-dom";
import { CtaBand, Reveal, stagger } from "../components/ui.jsx";
import { SERVICE_PAGES } from "../data/catalog.js";
import { usePageMeta } from "../hooks.js";

const STEPS = [
  ["Discover.", "We learn about your story and goals."],
  ["Plan.", "You receive a clear scope, timeline and deliverables."],
  ["Create.", "We produce the work and share progress."],
  ["Launch.", "We help you present and promote the result."],
];

export default function ServicePage({ service: s }) {
  usePageMeta(`${s.name} | Firefox Publishers`, s.short);
  const others = SERVICE_PAGES.filter((o) => o.path !== s.path);
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / {s.name}</p>
          <h1>{s.name}</h1>
          <p className="lead">{s.intro}</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Start a project</Link>
            <Link className="btn btn--secondary" to={s.heroSecondary.to}>{s.heroSecondary.label}</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="section__head">
            <p className="eyebrow">What is included</p>
            <h2>Deliverables</h2>
            <p>Final scope and deliverables are confirmed in a written plan before work begins.</p>
          </Reveal>
          <div className="grid grid--3">
            {s.items.map(([t, p], i) => (
              <Reveal as="article" className="card" key={t} delay={stagger(i)}><h3>{t}</h3><p>{p}</p></Reveal>
            ))}
          </div>
          <p className="note">Draft service details. Replace with the final offer before launch.</p>
        </div>
      </section>

      <section className="section section--ice">
        <div className="wrap split">
          <Reveal><p className="eyebrow">Who it is for</p><p className="quote">{s.who}</p></Reveal>
          <Reveal>
            <h2>How it works</h2>
            <ol className="mini">
              {STEPS.map(([b, t]) => <li key={b}><strong>{b}</strong> {t}</li>)}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="section__head"><p className="eyebrow">Explore more</p><h2>Other services</h2></Reveal>
          <div className="grid grid--3">
            {others.map((o) => (
              <Link className="card" to={"/" + o.path} key={o.path}><h3>{o.name}</h3><p>{o.short}</p></Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
