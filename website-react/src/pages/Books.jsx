import { useState } from "react";
import { Link } from "react-router-dom";
import { CtaBand, Reveal } from "../components/ui.jsx";
import { BOOKS, CLASSICS, GENRES } from "../data/catalog.js";
import { usePageMeta } from "../hooks.js";
import { PageSchema } from "../components/Schema.jsx";

export default function Books() {
  usePageMeta("Book Cover Samples & Classics | Firefox Publisher", "Browse sample book covers and public-domain classics Firefox Publisher can design, format and publish across fantasy, thriller, romance and more.");
  const [genre, setGenre] = useState("all");
  const chips = ["all", ...GENRES];
  return (
    <>
      <PageSchema type="CollectionPage" name="Book Cover Samples & Classics" path="books" description="Sample book covers and public-domain classics Firefox Publisher can design, format and publish." />
      <section className="page-hero">
        <div className="wrap">
          <p className="crumbs"><Link to="/">Home</Link> / Books</p>
          <h1>Books</h1>
          <p className="lead">A shelf of sample titles showing the kind of covers, formats and finish we produce. Your book would sit here next.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Publish your book</Link>
            <Link className="btn btn--secondary" to="/#packages">See packages</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="sr-only">Sample books</h2>
          <div className="filters" role="group" aria-label="Filter books by genre">
            {chips.map((g) => (
              <button key={g} type="button" className={"chip" + (genre === g ? " active" : "")} aria-pressed={genre === g} onClick={() => setGenre(g)}>
                {g === "all" ? "All" : g}
              </button>
            ))}
          </div>
          <div className="grid grid--4" id="books">
            {BOOKS.map((b) => (
              <Reveal as="article" className="product" key={b.file} hidden={genre !== "all" && b.genre !== genre}>
                <div className="product__stage">
                  <img className="product__cover" src={`/assets/covers/${b.file}.svg`} alt={`Cover of ${b.title} by ${b.by}`} width="600" height="900" loading="lazy" decoding="async" />
                </div>
                <div className="product__body">
                  <p className="tag">{b.genre}</p>
                  <h3>{b.title}</h3>
                  <p className="by">by {b.by}</p>
                  <p className="fmt">{b.fmt}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="note">These are original sample covers with invented titles and authors, shown for layout only. Replace them with books Firefox Publisher has published, and only with the author's permission.</p>
          <div className="section__head classics-head">
            <p className="eyebrow">Public-domain classics</p>
            <h2>Classics we can format and publish</h2>
            <p>These timeless books are free of copyright in the United States, so anyone can publish new editions. We can design, format and distribute yours. Covers and texts are from Standard Ebooks, which dedicates its work to the public domain under CC0.</p>
          </div>
          <div className="grid grid--3 classics-grid">
            {CLASSICS.map((c) => (
              <Reveal as="article" className="product classic" key={c.file}>
                <a className="product__stage" href={"https://standardebooks.org/ebooks/" + c.slug} target="_blank" rel="noopener" aria-label={`${c.title} by ${c.by} on Standard Ebooks (opens in a new tab)`}>
                  <img className="classic__cover" src={`/assets/classics/${c.file}.jpg`} alt={`Cover of ${c.title} by ${c.by}`} width="300" height="450" loading="lazy" />
                </a>
                <div className="product__body">
                  <p className="tag">{c.tag}</p>
                  <h3>{c.title}</h3>
                  <p className="by">by {c.by}</p>
                  <p className="fmt">Public domain classic</p>
                  <span className="sample-tag sample-tag--pd">Public domain</span>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="note">Source: <a href="https://standardebooks.org/" target="_blank" rel="noopener">Standard Ebooks</a> (CC0 1.0). Texts and artwork are believed to be in the U.S. public domain and may still be copyrighted in other countries, so check local law before publishing outside the United States. These titles are not Firefox Publisher originals.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
