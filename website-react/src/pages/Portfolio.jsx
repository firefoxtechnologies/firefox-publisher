import { Link } from "react-router-dom";
import { CtaBand } from "../components/ui.jsx";
import { usePageMeta } from "../hooks.js";
import { PORTFOLIO_BOOKS, PORTFOLIO_PROJECTS } from "../data/portfolioBooks.js";
import { HERO_BOOKS } from "../data/site.js";
import BookCarousel from "../components/ui/feature-carousel";

// Every cover and book mockup on the site, interleaved so neighbours differ in style.
const SETS = [
  HERO_BOOKS.map((b) => ({ src: `/assets/covers/${b.file}.svg`, alt: b.label })),
  PORTFOLIO_BOOKS.map((b) => ({ src: b.src, alt: b.title })),
  PORTFOLIO_PROJECTS.map((b) => ({ src: b.src, alt: b.title })),
];
const HERO_IMAGES = [];
for (let i = 0; HERO_IMAGES.length < SETS.reduce((n, a) => n + a.length, 0); i++) SETS.forEach((a) => a[i] && HERO_IMAGES.push(a[i]));

export default function Portfolio() {
  usePageMeta("Portfolio | Firefox Publisher", "Selected projects showing the objective, the work completed and what was delivered.");
  return (
    <>
      <section className="page-hero portfolio-hero">
        <div className="wrap">
          <p className="crumbs"><Link to="/">Home</Link> / Portfolio</p>
          <h1>Portfolio</h1>
          <p className="lead">Each project shows the objective, the work we completed and what was delivered. The work leads; our branding stays secondary.</p>
        </div>
        <BookCarousel images={HERO_IMAGES} aria-label="Books we have designed" />
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
                  <dl>
                    <dt>Objective</dt><dd>{p.objective}</dd>
                    <dt>Work completed</dt><dd>{p.work}</dd>
                    <dt>Deliverables</dt><dd>{p.deliverables}</dd>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section portfolio-sec">
        <div className="wrap">
          <h2>Book covers</h2>
          <div className="grid grid--3" id="book-covers">
            {PORTFOLIO_BOOKS.map((b) => (
              <figure className="work" key={b.src}>
                <img src={b.src} alt={`${b.title} book cover, ${b.genre}`} width="600" height="900" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
                <figcaption className="work__body"><p className="tag">{b.genre}</p><h3>{b.title}</h3></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
