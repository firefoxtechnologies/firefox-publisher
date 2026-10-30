import { Link } from "react-router-dom";
import { CtaBand, Reveal } from "../components/ui.jsx";
import { PageSchema } from "../components/Schema.jsx";
import { usePageMeta } from "../hooks.js";
import { PACKAGES, SERVICES, SITE } from "../data/site.js";

const AREAS = ["Hoboken", "Jersey City", "Weehawken", "Union City", "Newark", "New York City", "Brooklyn", "Queens", "Long Island", "Westchester", "Philadelphia", "Washington, DC"];

const FAQ = [
  ["How much does it cost to self-publish a book in New Jersey or New York?", `Our publishing packages run from ${PACKAGES[0].price} (Starter) to ${PACKAGES[PACKAGES.length - 1].price} (Signature). What you pay depends on how much editing, cover and interior design, formats and distribution you need. We confirm the scope and price for your book before work starts.`],
  ["Do you only work with authors in Hoboken?", "No. Firefox Publisher is based in Hoboken, New Jersey, and works online with authors in New Jersey, New York City and across the United States. You can send your manuscript, review proofs and approve files from anywhere."],
  ["Can you publish my book on Amazon KDP?", "Yes. Our packages include publishing on Amazon KDP, and your ISBN is registered under your name. Higher packages add distribution to Barnes & Noble, Apple Books, Kobo and Google Books."],
  ["Do you print physical books?", "We prepare print-ready paperback and hardcover files to your printer's specifications. We do not print the physical copies ourselves."],
  ["Do you offer ghostwriting and memoir writing?", "Yes. Our book writing service covers fiction, nonfiction, ghostwriting, memoir and children's books, and we can edit the finished manuscript too."],
  ["Can I design a book cover for free first?", "Yes. Our free book cover maker has hundreds of genre templates you can edit and download. If you want a custom cover, our designers can create one for you."],
];

export default function BookPublishingNJNY() {
  usePageMeta(
    "Book Publishing Services NJ & New York | Firefox Publisher",
    "Hoboken, NJ book publishing company for authors in New Jersey, New York City and across the USA: editing, cover design, ghostwriting and Amazon KDP publishing."
  );
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageSchema name="Book Publishing Services in New Jersey and New York" path="book-publishing-new-jersey-new-york" description="Book publishing, editing, cover design, ghostwriting and Amazon KDP publishing for authors in Hoboken, New Jersey, New York City and across the USA." />
      <section className="page-hero">
        <div className="wrap">
          <p className="crumbs"><Link to="/">Home</Link> / Book Publishing in NJ &amp; New York</p>
          <h1>Book Publishing Services in Hoboken, New Jersey &amp; New York</h1>
          <p className="lead">A Hoboken-based publishing partner for authors in New Jersey and New York City, and in every state across the USA: ghostwriting, editing, book cover design, ebook formatting and Amazon KDP publishing in one place.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Get a free consultation</Link>
            <Link className="btn btn--secondary" to="/portfolio">See our book covers</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Local to the Hudson waterfront</p>
            <h2>Self-publishing support, from idea to launch</h2>
            <p>Self-publishing is the fastest way to get a book into readers&rsquo; hands, but the work behind a good book is real: a clean edit, a cover that matches your genre, an interior that reads well in print and on a Kindle, the right ISBN and metadata, and a launch plan. Firefox Publisher handles each step, so you keep your rights and your voice.</p>
            <p>We are at {`333 Washington St #233, Hoboken, NJ 07030`}, and we work with first-time and returning authors across the New York metro area and all 50 states. Call <a href={SITE.phoneHref}>{SITE.phone}</a> or email <a href={"mailto:" + SITE.email}>{SITE.email}</a>.</p>
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
          <p>Clear starting prices, so you can plan your budget before you talk to us.</p>
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
          <h2>Authors we work with, near and far</h2>
          <p>{AREAS.join(", ")} and every other state. Everything is done online, with calls and email whenever you need them. See our <Link to="/book-publishing-services-usa">nationwide publishing services</Link>.</p>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap bw-faq">
          <h2>Questions about publishing a book in NJ and New York</h2>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <Reveal as="details" className="faq__item" key={q} name="local-faq">
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
