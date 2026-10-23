import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import Journey from "../components/Journey.jsx";
import { ContactForm, Estimator, Readiness } from "../components/Tools.jsx";
import { Count, Reveal, Ticks, stagger } from "../components/ui.jsx";
import { ParentLink } from "../components/Layout.jsx";
import { PACKAGES, SERVICES, SHELF, SITE, STATS } from "../data/site.js";
import { prefersReducedMotion, useRafScroll, usePageMeta } from "../hooks.js";

function Icon({ s }) {
  return (
    <div className="icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {s.rect && <rect {...s.rect} />}
        {s.circle && <circle {...s.circle} />}
        <path d={s.d} />
      </svg>
    </div>
  );
}

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
            <div key={s.label}><dt>{s.label}</dt><dd><Count end={s.end} prefix={s.prefix} /></dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <Head eyebrow="What we do" title="Helping authors publish and reach readers">
          <p>From first draft to finished, promoted book, one team can support every stage. Choose a single service or combine them.</p>
        </Head>
        <div className="grid grid--3">
          {SERVICES.map((s, i) => (
            <Reveal as="article" className="card" key={s.title} delay={stagger(i)}>
              <Icon s={s} />
              <h3><Link className="stretch" to={s.to}>{s.title}</Link></h3>
              <p>{s.text}</p>
              <span className="more">View more</span>
            </Reveal>
          ))}
        </div>
        <p className="note center">Confirm the final service list before launch; only list what Firefox Publishers actually offers.</p>
      </div>
    </section>
  );
}

// Cover shelf: each book drifts vertically against the scroll for a light parallax.
function Showcase() {
  const books = useRef([]);
  useRafScroll(() => {
    if (prefersReducedMotion()) return;
    books.current.forEach((b, i) => {
      if (!b) return;
      const r = b.getBoundingClientRect();
      const off = (r.top + r.height / 2 - innerHeight / 2) * (i % 2 ? -0.06 : 0.06);
      b.style.setProperty("--py", Math.max(-40, Math.min(40, off)).toFixed(1) + "px");
    });
  });
  return (
    <Reveal className="showcase">
      {SHELF.map((b, i) => (
        <Link key={b.file} ref={(el) => (books.current[i] = el)} className="shelf-book" to="/books" aria-label={b.title + ", see all books"}>
          <img src={`/assets/covers/${b.file}.svg`} alt={"Cover of " + b.title} width="300" height="450" loading="lazy" />
        </Link>
      ))}
    </Reveal>
  );
}

function Work() {
  return (
    <section className="section section--ice" id="work">
      <div className="wrap">
        <Head eyebrow="Featured work" title="A collection of stories, beautifully presented">
          <p>A selection of projects showing the objective, the work completed and what was delivered.</p>
        </Head>
        <Showcase />
        <p className="center">
          <Link className="btn btn--primary" to="/books">Browse all books</Link>{" "}
          <Link className="btn btn--secondary" to="/portfolio">See the portfolio</Link>
        </p>
        <p className="note center">Sample covers with invented titles, shown for layout. Replace them with real projects, with permission.</p>
      </div>
    </section>
  );
}

function Packages({ onPlan }) {
  return (
    <section className="section" id="packages">
      <div className="wrap">
        <Head eyebrow="Packages & pricing" title="Start with a package, or build your own">
          <p>Five packages, from a focused digital launch to our fullest publishing service. Every project is scoped in writing first.</p>
        </Head>
        <div className="grid plans plans--5">
          {PACKAGES.map((p, i) => (
            <Reveal as="article" className={"plan" + (p.featured ? " plan--featured" : "")} key={p.name} delay={stagger(i)}>
              {p.featured && <span className="badge">Most popular</span>}
              <h3>{p.name}</h3>
              <p className="price">{p.price}</p>
              <p className="plan__for">{p.forWho}</p>
              <Ticks items={p.items} />
              <Link
                className={"btn " + (p.featured ? "btn--primary" : "btn--secondary")}
                to="/#contact"
                onClick={() => onPlan({ name: p.name })}
              >
                Start {p.short} package
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="note center">Fees apply and results vary. We do not guarantee sales or bestseller status. Prices are starting points; your written scope confirms the final price.</p>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section band" id="process">
      <div className="wrap">
        <Head eyebrow="Your journey to publication" title="A clear, collaborative path from idea to impact">
          <p>Explore each stage, see what is included, and estimate a realistic timeline for your manuscript.</p>
        </Head>
        <p className="pin-hint center">Keep scrolling to move through the stages.</p>
        <Journey />
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
        <div className="grid grid--2 gets">
          <Reveal>
            <h3>Done-with-you services</h3>
            <Ticks items={["Editorial roadmap with annotated feedback", "Cover concepts with revision rounds", "Print and e-book files, proofs and distribution set-up", "Launch playbook with outreach templates"]} />
          </Reveal>
          <Reveal>
            <h3>Tools &amp; support</h3>
            <Ticks items={["Milestone tracker with dates, files and approvals", "Retail metadata checklist and pricing guide", "Brand toolkit: typography, colours, social assets", "Post-launch growth plan"]} />
          </Reveal>
        </div>
        <Reveal as="p" className="quote quote--center">Your story deserves thoughtful craft, clear communication, and a professional path to its audience.</Reveal>
        <p className="note center">Verified testimonials will appear here once we have permission to publish them.</p>
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

function Contact({ plan }) {
  return (
    <section className="section" id="contact">
      <div className="wrap split">
        <Reveal>
          <p className="eyebrow">Ready to begin?</p>
          <h2>Tell us about your story</h2>
          <p style={{ marginTop: 16, color: "var(--slate)" }}>Share a few details and we will reply with the next step. No obligation.</p>
          <Ticks style={{ marginTop: 24 }} items={["A plain-language scope and timeline", "Clear deliverables before you commit", "A reply from a real person"]} />
          <address className="contact-card">
            <strong>Firefox Publishers</strong><br />333 Washington St #233<br />Hoboken, New Jersey 07030, USA<br />
            <a href={SITE.phoneHref}>{SITE.phone}</a><br />
            <a href={"mailto:" + SITE.email}>{SITE.email}</a>
          </address>
          <p style={{ marginTop: 16, fontSize: ".9rem", color: "var(--slate)" }}>Firefox Publishers is a child company of <ParentLink />.</p>
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
      <About />
      <ToolsSection />
      <Contact plan={plan} />
    </>
  );
}
