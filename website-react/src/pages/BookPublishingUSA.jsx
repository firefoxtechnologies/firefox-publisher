import { Link } from "react-router-dom";
import { CtaBand, Reveal } from "../components/ui.jsx";
import { PageSchema } from "../components/Schema.jsx";
import { usePageMeta } from "../hooks.js";
import { PACKAGES, SERVICES, SITE } from "../data/site.js";

const REGIONS = [
  ["Northeast", "New York, New Jersey, Pennsylvania, Massachusetts, Connecticut, Maine, Vermont, New Hampshire, Rhode Island"],
  ["Southeast", "Florida, Georgia, North Carolina, South Carolina, Virginia, Tennessee, Alabama, Louisiana, Kentucky"],
  ["Midwest", "Illinois, Ohio, Michigan, Minnesota, Wisconsin, Indiana, Missouri, Iowa, Kansas"],
  ["Southwest", "Texas, Arizona, New Mexico, Oklahoma, Nevada"],
  ["West", "California, Washington, Oregon, Colorado, Utah, Idaho, Montana, Alaska, Hawaii"],
];

const FAQ = [
  ["Do you work with authors in every state?", "Yes. Firefox Publisher works online with authors in all 50 states. You send your manuscript, review proofs and approve files by email, video call or phone, so your location does not matter."],
  ["How much does it cost to self-publish a book in the USA?", `Our publishing packages run from ${PACKAGES[0].price} (Starter) to ${PACKAGES[PACKAGES.length - 1].price} (Signature). The price depends on the editing, cover and interior design, formats and distribution your book needs. We confirm the scope and price before work starts.`],
  ["Can you publish my book on Amazon KDP and other stores?", "Yes. Our packages include publishing on Amazon KDP, with your ISBN registered under your name. Higher packages add distribution to Barnes & Noble, Apple Books, Kobo and Google Books."],
  ["Do you offer ghostwriting, editing and cover design?", "Yes. We offer ghostwriting and book writing, developmental editing, copyediting and proofreading, book cover design, ebook formatting, audiobooks, book marketing and book trailers."],
  ["Do you print physical books?", "We prepare print-ready paperback and hardcover files to your printer's specifications. We do not print the physical copies ourselves."],
  ["Where is Firefox Publisher based?", "We are based at 333 Washington St #233, Hoboken, New Jersey 07030, and serve authors across the United States."],
];

export default function BookPublishingUSA() {
  usePageMeta(
    "Book Publishing Services USA | Firefox Publisher",
    "Self-publishing and book publishing for authors in all 50 states: ghostwriting, editing, cover design, ebook formatting and Amazon KDP. Based in Hoboken, NJ."
  );
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageSchema name="Book Publishing Services in the USA" path="book-publishing-services-usa" description="Self-publishing and book publishing services for authors in all 50 states: ghostwriting, editing, cover design, ebook formatting and Amazon KDP publishing." />
      <section className="page-hero">
        <div className="wrap">
          <p className="crumbs"><Link to="/">Home</Link> / Book Publishing Services USA</p>
          <h1>Book Publishing &amp; Self-Publishing Services Across the USA</h1>
          <p className="lead">One publishing partner for authors in all 50 states: ghostwriting, book editing, book cover design, ebook formatting and Amazon KDP publishing, handled online from our Hoboken, New Jersey studio.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Get a free consultation</Link>
            <Link className="btn btn--secondary" to="/portfolio">See our book covers</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Nationwide, fully online</p>
            <h2>Self-publishing support, wherever you write</h2>
            <p>Whether you are in a big city or a small town, you get the same team and the same process: a clean edit, a cover that fits your genre, an interior that reads well in print and on a Kindle, the right ISBN and metadata, and a launch plan. You keep your voice, and your ISBN is registered under your name.</p>
            <p>Call <a href={SITE.phoneHref}>{SITE.phone}</a> or email <a href={"mailto:" + SITE.email}>{SITE.email}</a>. Prefer something closer to home? See our page for <Link to="/book-publishing-new-jersey-new-york">book publishing in New Jersey and New York</Link>.</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--ice">
        <div className="wrap">
          <h2>Our book publishing services</h2>
          <div className="grid grid--3">
            {SERVICES.map((s) => (
              <Reveal as="article" className="work" key={s.to}>
                <div className="work__body">
                  <h3><Link to={s.to}>{s.title}</Link></h3>
                  <p className="work__desc">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Publishing packages and prices</h2>
          <p>Clear starting prices for authors anywhere in the country.</p>
          <div className="grid grid--3">
            {PACKAGES.map((p) => (
              <Reveal as="article" className="work" key={p.name}>
                <div className="work__body">
                  <h3>{p.name}</h3>
                  <p className="work__desc"><strong>{p.price}</strong>. {p.forWho}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="center"><Link className="btn btn--primary" to="/#packages">Compare the packages</Link></p>
        </div>
      </section>

      <section className="section section--ice">
        <div className="wrap">
          <h2>Authors we serve in every region</h2>
          <p>We work with authors in all 50 states, including:</p>
          <dl>
            {REGIONS.map(([r, s]) => (
              <div key={r}><dt>{r}</dt><dd>{s}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap bw-faq">
          <h2>Questions about publishing a book in the USA</h2>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <Reveal as="details" className="faq__item" key={q} name="usa-faq">
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
