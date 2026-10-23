import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import { ContactForm, Estimator, Readiness } from "../components/Tools.jsx";
import { Reveal, Ticks, stagger } from "../components/ui.jsx";
import CountUp from "../components/ui/count-up";
import { ParentLink } from "../components/Layout.jsx";
import WorksWheel from "../components/ui/works-wheel";
import CarouselStacked from "../components/ui/carousel-07";
import Pricing from "../components/ui/pricing-7";
import CallToAction from "../components/ui/cta-3";
import ScrollRevealContent from "../components/ui/scroll-reveal-content-a";
import { BOOKS } from "../data/catalog.js";
import { PACKAGES, SERVICES, SITE, STAGES, STATS, TESTIMONIALS } from "../data/site.js";
import { usePageMeta } from "../hooks.js";

function Head({ eyebrow, title, children }) {
  return (
    <Reveal className="section__head section__head--center">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </Reveal>
  );
}

function Stats() {
  return (
    <section className="stats-wrap" aria-label="Firefox Publishers at a glance">
      <div className="wrap">
        <dl className="stats">
          {STATS.map((s) => (
            <div key={s.label}><dt>{s.label}</dt><dd><CountUp to={s.end} prefix={s.prefix} digitEffect="slide" duration={2} /></dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// "What we do": the twelve services on a turnable wheel. The canvas is decorative
// and keyboard-operable; the panel and link list beneath it carry the text and
// the links to each service page.
function Services() {
  const [active, setActive] = useState(0);
  const items = useMemo(() => SERVICES.map((s) => ({ image: s.image, title: s.title, href: s.to })), []);
  const current = SERVICES[active];
  return (
    <section className="section svc" id="services">
      <div className="wrap">
        <Head eyebrow="What we do" title="Helping authors publish and reach readers">
          <p>From first draft to finished, promoted book, one team can support every stage. Choose a single service or combine them.</p>
        </Head>
      </div>
      <div className="svc__stage">
        <WorksWheel
          items={items}
          label="What we do"
          action="View more"
          as={Link}
          hrefProp="to"
          onActiveChange={setActive}
          renderCaption={(it, i) => (
            <>
              <p className="svc__count">{String(i + 1).padStart(2, "0")} / {SERVICES.length}</p>
              <h3 className="ww-title">{it.title}</h3>
              <p className="svc__desc">{SERVICES[i].text}</p>
              <Link className="btn btn--primary svc__more" to={SERVICES[i].to}>View more</Link>
            </>
          )}
        />
      </div>
      <div className="wrap svc__panel">
        <div className="svc__now" aria-live="polite">
          <p className="svc__count">{String(active + 1).padStart(2, "0")} / {SERVICES.length}</p>
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          <Link className="btn btn--primary" to={current.to}>View more</Link>
        </div>
      </div>
      <p className="note center svc__note">Confirm the final service list before launch; only list what Firefox Publishers actually offers.</p>
    </section>
  );
}

// Featured books for the stacked carousel, taken from the sample catalogue.
const FEATURED_FILES = ["the-last-lighthouse", "paper-kingdoms", "midnight-orchard", "evenings-like-this", "the-quiet-flame", "northern-atlas", "salt-and-ember"];
const FEATURED = FEATURED_FILES.map((f) => BOOKS.find((b) => b.file === f)).map((b) => ({
  image: `/assets/covers/${b.file}.svg`,
  alt: `Cover of ${b.title} by ${b.by}`,
  title: b.title,
  badge: b.genre,
  description: `by ${b.by} \u00b7 ${b.fmt}`,
}));

function Work() {
  return (
    <section className="section section--ice" id="work">
      <div className="wrap">
        <Head eyebrow="Featured work" title="A collection of stories, beautifully presented">
          <p>A selection of projects showing the objective, the work completed and what was delivered.</p>
        </Head>
        <CarouselStacked slides={FEATURED} label="Featured books" />
        <p className="center work__cta">
          <Link className="btn btn--primary" to="/books">Browse all books</Link>{" "}
          <Link className="btn btn--secondary" to="/portfolio">See the portfolio</Link>
        </p>
        <p className="note center">Sample covers with invented titles, shown for layout. Replace them with real projects, with permission.</p>
      </div>
    </section>
  );
}

const TIERS = PACKAGES.map((p) => ({
  value: p.short.toLowerCase(),
  label: p.short,
  name: p.name,
  price: p.price,
  priceNote: "Starting price. Your written scope confirms the final fee.",
  description: p.forWho,
  features: p.items,
  badge: p.featured ? "Most popular" : undefined,
}));

function Packages({ onPlan }) {
  return (
    <section className="section" id="packages">
      <div className="wrap">
        <Head eyebrow="Packages & pricing" title="Start with a package, or build your own">
          <p>Five packages, from a focused digital launch to our fullest publishing service. Every project is scoped in writing first.</p>
        </Head>
        <Pricing
          tiers={TIERS}
          defaultValue="starter"
          renderCta={(tier) => (
            <Link className="btn btn--primary" to="/#contact" onClick={() => onPlan({ name: tier.name })}>
              Start {tier.label} package
            </Link>
          )}
          footer={
            <>
              Not sure which package is right? <Link className="p7-link" to="/#contact">Talk to our team</Link>
            </>
          }
        />
        <p className="note center">Fees apply and results vary. We do not guarantee sales or bestseller status. Prices are starting points; your written scope confirms the final price.</p>
      </div>
    </section>
  );
}

// The five publishing stages for the scroll-driven journey. Photos are from Pexels
// and live in public/assets/journey/, one per stage.
const JOURNEY_IMAGES = [
  ["discovery", "Two colleagues planning a project together over a tablet and notebook"],
  ["editorial", "A hand marking up a printed manuscript with a red pen"],
  ["design-production", "A hand holding open the illustrated interior page of a book"],
  ["launch", "A bookshop with display tables of new releases and a reader browsing"],
  ["growth", "A small plant growing on top of a pile of books"],
];
const JOURNEY = STAGES.map((st, i) => ({
  title: st.title,
  description: st.text,
  bullets: st.items,
  image: { url: `/assets/journey/${JOURNEY_IMAGES[i][0]}.jpg`, width: 900, height: 900, alt: JOURNEY_IMAGES[i][1] },
}));

function Process() {
  return (
    <section className="section band" id="process">
      <div className="wrap">
        <Head eyebrow="Your journey to publication" title="A clear, collaborative path from idea to impact">
          <p>Explore each stage, see what is included, and estimate a realistic timeline for your manuscript.</p>
        </Head>
        <ScrollRevealContent items={JOURNEY} />
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="section section--ice" id="estimator">
      <div className="wrap">
        <Head eyebrow="Timeline estimator" title="How long will your book take?">
          <p>Slide to your manuscript length for a rough, illustrative schedule. We confirm a real timeline in your written scope.</p>
        </Head>
        <Estimator />
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <Head eyebrow="Our approach" title="A capable publishing partner">
          <p>Our mission is to help authors and creators present, publish and promote their work with professional care.</p>
          <p className="parent-line">Firefox Publishers is the publishing arm and a child company of <strong><ParentLink /></strong>, the digital agency behind our web, search and brand work.</p>
        </Head>
        <div className="grid grid--3">
          {[
            ["Editorial integrity", "Objective feedback, clear edits and milestone check-ins so your voice gets sharper, not lost."],
            ["Design that works", "Covers and layouts suited to your audience that meet retailer standards."],
            ["Long-term thinking", "Launch is day one. We plan for your backlist, your readers and your next title."],
          ].map(([t, p], i) => (
            <Reveal as="article" className="card" key={t} delay={stagger(i)}><h3>{t}</h3><p>{p}</p></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Support() {
  return (
    <section className="section section--ice" id="support">
      <div className="wrap">
        <Head eyebrow="What you get" title="Support from first draft to launch">
          <p>Hands-on services and practical tools that keep your project clear, on schedule and ready for readers.</p>
        </Head>
        <div className="grid grid--2 gets support__grid">
          <Reveal className="support__card">
            <h3>Done-with-you services</h3>
            <Ticks items={["Editorial roadmap with annotated feedback", "Cover concepts with revision rounds", "Print and e-book files, proofs and distribution set-up", "Launch playbook with outreach templates"]} />
          </Reveal>
          <Reveal className="support__card" delay={70}>
            <h3>Tools &amp; support</h3>
            <Ticks items={["Milestone tracker with dates, files and approvals", "Retail metadata checklist and pricing guide", "Brand toolkit: typography, colours, social assets", "Post-launch growth plan"]} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StoryCta() {
  return (
    <section className="section story-cta" aria-label="Start your project">
      <div className="wrap">
        <Reveal>
          <CallToAction
            heading="Your story deserves thoughtful craft, clear communication, and a professional path to its audience."
            text="Tell us about your project and we will reply with the next step. No obligation."
          >
            <Link className="btn btn--ghost" to="/portfolio">View our work</Link>
            <Link className="btn btn--primary" to="/#contact">Start a project</Link>
          </CallToAction>
        </Reveal>
      </div>
    </section>
  );
}

function ToolsSection() {
  return (
    <section className="section section--ice" id="tools">
      <div className="wrap">
        <Reveal className="section__head section__head--center">
          <p className="eyebrow">Tools &amp; resources</p>
          <h2>Check where you are, then take the next step</h2>
        </Reveal>
        <div className="split">
          <Readiness />
          <Reveal className="tiles">
            <Link className="tile" to="/#contact"><strong>Submit your manuscript</strong><span>Tell us about your project and we will explain the next step.</span></Link>
            <Link className="tile" to="/#contact"><strong>Author resources</strong><span>Templates and guides are coming soon. Ask us what is available now.</span></Link>
            <Link className="tile" to="/#estimator"><strong>Timeline estimator</strong><span>See a rough schedule for your manuscript length.</span></Link>
            <Link className="tile" to="/#services"><strong>Our services</strong><span>Editing, design, publishing, marketing and production.</span></Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const CONTACT_CARDS = [
  { label: "Email us", value: SITE.email, href: "mailto:" + SITE.email, icon: "M4 6h16v12H4zM4 7l8 6 8-6" },
  { label: "Call us", value: SITE.phone, href: SITE.phoneHref, icon: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" },
  { label: "Our headquarters", value: "333 Washington St #233, Hoboken, NJ 07030", href: "https://www.google.com/maps/search/?api=1&query=333+Washington+St+%23233+Hoboken+NJ+07030", icon: "M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", external: true },
];

const STAR = "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z";

function TestimonialCard({ t }) {
  return (
    <figure className="tm__card">
      <div className="tm__stars" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => <svg key={i} viewBox="0 0 24 24"><path d={STAR} /></svg>)}
      </div>
      <blockquote className="tm__quote">&ldquo;{t.quote}&rdquo;</blockquote>
      <figcaption className="tm__who">
        <span className="tm__avatar" aria-hidden="true">{t.name.charAt(0)}</span>
        <span className="tm__id"><strong>{t.name}</strong></span>
      </figcaption>
    </figure>
  );
}

// One scrolling row. The set is rendered twice and the track slides by half its width,
// so the loop is seamless. The copy is hidden from assistive tech.
function TestimonialRow({ items, reverse }) {
  return (
    <div className={"tm__row" + (reverse ? " tm__row--rev" : "")}>
      <div className="tm__track">
        {items.map((t) => <TestimonialCard key={t.quote} t={t} />)}
        <div className="tm__dup" aria-hidden="true">
          {items.map((t) => <TestimonialCard key={t.quote} t={t} />)}
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const half = Math.ceil(TESTIMONIALS.length / 2);
  return (
    <section className="section tm" id="testimonials">
      <div className="wrap">
        <Head eyebrow="Testimonials" title="What authors say about working with us">
          <p>Feedback from authors on the editing, design and support they received.</p>
        </Head>
      </div>
      <div className="tm__rows">
        <TestimonialRow items={TESTIMONIALS.slice(0, half)} />
        <TestimonialRow items={TESTIMONIALS.slice(half)} reverse />
      </div>
    </section>
  );
}

function Contact({ plan }) {
  return (
    <section className="section cx" id="contact">
      <div className="wrap cx__grid">
        <Reveal className="cx__intro">
          <p className="eyebrow">Ready to begin?</p>
          <h2 className="cx__title">Tell us about your story</h2>
          <p className="cx__sub">Share a few details and we will reply with the next step. No obligation.</p>
          <ul className="cx__cards">
            {CONTACT_CARDS.map((c) => (
              <li key={c.label}>
                <a className="cx__card" href={c.href} {...(c.external ? { target: "_blank", rel: "noopener" } : {})}>
                  <span className="cx__ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={c.icon} /></svg>
                  </span>
                  <span className="cx__txt"><small>{c.label}</small><strong>{c.value}</strong></span>
                </a>
              </li>
            ))}
          </ul>
          <p className="cx__parent">Firefox Publishers is a child company of <ParentLink />.</p>
        </Reveal>
        <ContactForm plan={plan} />
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta(
    "Firefox Publishers | Your Story. Our Craft.",
    "Publishing and creative services that help authors present their work professionally and build their brands."
  );
  const [plan, setPlan] = useState(null);
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Work />
      <Packages onPlan={setPlan} />
      <Process />
      <Timeline />
      <About />
      <Support />
      <StoryCta />
      <ToolsSection />
      <Testimonials />
      <Contact plan={plan} />
    </>
  );
}
