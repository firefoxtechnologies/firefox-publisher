import { Link } from "react-router-dom";
import { CtaBand } from "../components/ui.jsx";
import { usePageMeta } from "../hooks.js";
import { PageSchema } from "../components/Schema.jsx";
import { PORTFOLIO_BOOKS, PORTFOLIO_PROJECTS } from "../data/portfolioBooks.js";
import BookCarousel from "../components/ui/feature-carousel";

// Every book mockup on the site, projects first.
const HERO_IMAGES = [...PORTFOLIO_PROJECTS, ...PORTFOLIO_BOOKS].map((b) => ({ src: b.src, alt: b.title }));

export default function Portfolio() {
  usePageMeta("Book Design Portfolio | Firefox Publisher", "Sample book cover, interior and branding projects from Firefox Publisher: the objective, the work completed and what was delivered.");
  return (
    <>
      <section className="page-hero portfolio-hero">
        <div className="wrap">
          <p className="crumbs"><Link to="/">Home</Link> / Portfolio</p>
          <h1>Portfolio</h1>
          <p className="lead">Sample projects that show how we work: the objective, what we designed and what was delivered. These are concept designs; ask us about client work we can share with permission.</p>
        </div>
        <BookCarousel images={HERO_IMAGES} aria-label="Sample book designs" />
      </section>
      <section className="section portfolio-sec portfolio-sec--first">
        <div className="wrap">
          <h2 className="sr-only">Projects</h2>
          <div className="grid grid--3" id="projects">
            {PORTFOLIO_PROJECTS.map((p) => (
              <article className="work" key={p.title}>
                <img src={p.src} alt={`${p.title} book mockup`} width="1254" height="1254" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
                <div className="work__body">
                  <h3>{p.title}</h3>
                  <p className="work__desc">{p.description}</p>
                  <dl>
                    <dt>Objective</dt><dd>{p.objective}</dd>
                    <dt>Work completed</dt><dd>{p.work}</dd>
                    <dt>Deliverables</dt><dd>{p.deliverables}</dd>
                  </dl>
                </div>
              </article>
            ))}
            {PORTFOLIO_BOOKS.slice(0, 8).map((b) => (
              <article className="work" key={b.src}>
                <img src={b.src} alt={`${b.title} book cover, ${b.genre}`} width="1254" height="1254" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
                <div className="work__body">
                  <h3>{b.title}</h3>
                  <p className="work__desc">{b.description}</p>
                  <dl>
                    <dt>Objective</dt><dd>Give a {b.genre.toLowerCase()} title a cover that signals its genre and stands out on the shelf.</dd>
                    <dt>Work completed</dt><dd>Cover concept and design, title typography and spine layout.</dd>
                    <dt>Deliverables</dt><dd>Print-ready cover with spine and an ebook cover.</dd>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
