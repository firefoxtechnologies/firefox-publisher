import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { prefersReducedMotion } from "../hooks.js";
import Hero from "../components/Hero.jsx";
import { ContactForm, DEFAULT_POS, Estimator } from "../components/Tools.jsx";
import ToolsShowcase from "../components/ToolsShowcase.jsx";
import { Reveal, Ticks, stagger } from "../components/ui.jsx";
import CountUp from "../components/ui/count-up";
import GradientCard from "../components/ui/gradient-card";
import { Compare2 } from "../components/ui/compare-2";
import { ParentLink } from "../components/Layout.jsx";
import WorksWheel from "../components/ui/works-wheel";
import CoverMakerPromo from "../components/CoverMakerPromo.jsx";
import TrustPromise from "../components/TrustPromise.jsx";
import CarouselStacked from "../components/ui/carousel-07";
import Pricing from "../components/ui/pricing-7";
import CallToAction from "../components/ui/cta-3";
import ScrollRevealContent from "../components/ui/scroll-reveal-content-a";
import { BOOKS } from "../data/catalog.js";
import { PACKAGES, SERVICES, SITE, STAGES, STATS } from "../data/site.js";
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
    <section className="stats-wrap" aria-label="Firefox Publisher at a glance">
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

// Phones: the services as swipeable cards (the wheel above is hidden at this width).
function ServiceSlider() {
  const track = useRef(null);
  const [idx, setIdx] = useState(0);
  const go = (to) => {
    const t = track.current;
    const cards = t?.children;
    if (!cards?.length) return;
    const i = Math.max(0, Math.min(cards.length - 1, to));
    t.scrollTo({ left: cards[i].offsetLeft - (t.clientWidth - cards[i].clientWidth) / 2, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };
  const onScroll = () => {
    const t = track.current;
    const mid = t.scrollLeft + t.clientWidth / 2;
    let best = 0, dist = Infinity;
    [...t.children].forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    setIdx(best);
  };
  return (
    <div className="svc__slider" role="group" aria-roledescription="carousel" aria-label="What we do">
      <ul className="svc__track" ref={track} onScroll={onScroll} tabIndex={0} aria-label="Services, swipe sideways">
        {SERVICES.map((sv, i) => (
          <li className="svc__card" key={sv.title} aria-label={`${i + 1} of ${SERVICES.length}`}>
            <img src={sv.image} alt={`${sv.title} service`} loading="lazy" width="900" height="900" />
            <div className="svc__cardbody">
              <p className="svc__count">{String(i + 1).padStart(2, "0")} / {SERVICES.length}</p>
              <h3>{sv.title}</h3>
              <p>{sv.text}</p>
              <Link className="btn btn--primary" to={sv.to}>View more</Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="svc__ctrl">
        <button type="button" aria-label="Previous service" onClick={() => go(idx - 1)} disabled={idx === 0}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <span className="svc__pos" aria-live="polite">{idx + 1} / {SERVICES.length}</span>
        <button type="button" aria-label="Next service" onClick={() => go(idx + 1)} disabled={idx === SERVICES.length - 1}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
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
      <ServiceSlider />
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
        <Head eyebrow="Sample work" title="A collection of stories, beautifully presented">
          <p>Sample designs showing the objective, the work completed and what was delivered. Ask us about client projects we can share with permission.</p>
        </Head>
        <CarouselStacked slides={FEATURED} label="Featured books" bleed />
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
            <Link className="btn btn--primary" to="/#contact" data-plan={tier.name} onClick={() => onPlan({ name: tier.name })}>
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

function Timeline({ pos, onPos, stage, onStage }) {
  return (
    <section className="section section--ice" id="estimator">
      <div className="wrap">
        <Head eyebrow="Timeline estimator" title="How long will your book take?">
          <p>Slide to your manuscript length for a rough, illustrative schedule. We confirm a real timeline in your written scope.</p>
        </Head>
        <Estimator pos={pos} onPos={onPos} stage={stage} onStage={onStage} />
      </div>
    </section>
  );
}

// "Our approach" cards: brand-coloured gradients, one decorative illustration each.
const APPROACH = [
  { badgeText: "Editorial", badgeColor: "#f28c28", title: "Editorial integrity", description: "Objective feedback, clear edits and milestone check-ins so your voice gets sharper, not lost.", imageUrl: "/assets/illustrations/author-desk.svg", gradient: "linear-gradient(135deg, #fff1e1 0%, #ffd7ab 100%)" },
  { badgeText: "Design", badgeColor: "#1d5fa8", title: "Design that works", description: "Covers and layouts suited to your audience that meet retailer standards.", imageUrl: "/assets/illustrations/open-book-digital.svg", gradient: "linear-gradient(135deg, #eaf3fd 0%, #c6dcf4 100%)" },
  { badgeText: "Strategy", badgeColor: "#12294a", title: "Long-term thinking", description: "Launch is day one. We plan for your backlist, your readers and your next title.", imageUrl: "/assets/illustrations/ereader-stack.svg", gradient: "linear-gradient(135deg, #e6ecf5 0%, #bccbe0 100%)" },
];

function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <Head eyebrow="Our approach" title="A capable publishing partner">
          <p>Our mission is to help authors and creators present, publish and promote their work with professional care.</p>
          <p className="parent-line">Firefox Publisher is the publishing arm and a child company of <strong><ParentLink /></strong>, the digital agency behind our web, search and brand work.</p>
        </Head>
        <div className="grid grid--3 about__grid">
          {APPROACH.map((c, i) => (
            <Reveal key={c.title} delay={stagger(i)} className="about__item">
              <GradientCard {...c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const SUPPORT_COLUMNS = [
  {
    title: "Done-with-you services",
    groups: [
      { heading: "Editorial", items: ["Editorial roadmap with annotated feedback"] },
      { heading: "Design", items: ["Cover concepts with revision rounds"] },
      { heading: "Production", items: ["Print and e-book files, proofs and distribution set-up"] },
      { heading: "Launch", items: ["Launch playbook with outreach templates"] },
    ],
  },
  {
    title: "Tools & support",
    groups: [
      { heading: "Tracking", items: ["Milestone tracker with dates, files and approvals"] },
      { heading: "Retail", items: ["Retail metadata checklist and pricing guide"] },
      { heading: "Brand", items: ["Brand toolkit: typography, colours, social assets"] },
      { heading: "Growth", items: ["Post-launch growth plan"] },
    ],
  },
];

function Support() {
  return (
    <section className="section support" id="support">
      <div className="wrap">
        <Head eyebrow="What you get" title="Support from first draft to launch">
          <p>Hands-on services and practical tools that keep your project clear, on schedule and ready for readers.</p>
        </Head>
      </div>
      <div className="wrap">
        <Reveal className="support__compare">
          <Compare2 columns={SUPPORT_COLUMNS} />
        </Reveal>
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

function ToolsSection({ stage, onStage, pos }) {
  return (
    <section className="section section--ice" id="tools">
      <div className="wrap">
        <Reveal className="section__head section__head--center">
          <p className="eyebrow">Tools &amp; resources</p>
          <h2>Check where you are, then take the next step</h2>
        </Reveal>
        <Reveal><ToolsShowcase active={stage} onActive={onStage} pos={pos} /></Reveal>
      </div>
    </section>
  );
}

const CONTACT_CARDS = [
  { label: "Email us", value: SITE.email, href: "mailto:" + SITE.email, icon: "M4 6h16v12H4zM4 7l8 6 8-6" },
  { label: "Call us", value: SITE.phone, href: SITE.phoneHref, icon: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" },
  { label: "Our headquarters", value: "333 Washington St #233, Hoboken, NJ 07030", href: "https://www.google.com/maps/search/?api=1&query=333+Washington+St+%23233+Hoboken+NJ+07030", icon: "M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", external: true },
];

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
          <p className="cx__parent">Firefox Publisher is a child company of <ParentLink />.</p>
        </Reveal>
        <ContactForm plan={plan} />
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta(
    "Firefox Publisher | Ebook Publishing & Design, USA",
    "Ebook publishing services for authors: writing, editing, cover and interior design, audiobooks, marketing and trailers. Self-publish with KDP. Hoboken, NJ based, serving all 50 states."
  );
  const [plan, setPlan] = useState(null);
  // The estimator and the stage picker share these two values.
  const [stage, setStage] = useState(0);
  const [pos, setPos] = useState(DEFAULT_POS);
  return (
    <>
      <Hero />
      <CoverMakerPromo />
      <Stats />
      <Services />
      <Work />
      <Packages onPlan={setPlan} />
      <Process />
      <Timeline pos={pos} onPos={setPos} stage={stage} onStage={setStage} />
      <About />
      <Support />
      <StoryCta />
      <ToolsSection stage={stage} onStage={setStage} pos={pos} />
      <TrustPromise />
      <Contact plan={plan} />
    </>
  );
}
