import { Link } from "react-router-dom";
import { ScrollingFeatureShowcase } from "../components/ui/interactive-scrolling-story-component";
import { ImageGallery } from "../components/ui/image-gallery";
import { AppleCardCarousel } from "../components/ui/carousel-08";
import { AnimatedList } from "../components/ui/animated-list";
import { Reveal, stagger } from "../components/ui.jsx";
import { useEffect, useState } from "react";
import ServiceSchema from "../components/Schema.jsx";
import { usePageMeta, prefersReducedMotion } from "../hooks.js";

const TYPES = [
  { badge: "Launch", title: "Ebook Launch Marketing", description: "Make some noise! Launching your ebook? Let\u2019s make it an occasion. We help plan promotional activities that introduce your ebook to potential readers and build excitement around its release.", image: "/assets/journey/launch.jpg", alt: "Planning a book launch on a laptop" },
  { badge: "Social", title: "Social Media Marketing", description: "Scroll-stopping starts here. Your next reader could be scrolling right now! We help create engaging social media content that showcases your ebook, highlights what makes it special, and encourages people to learn more.", image: "/assets/services/book-marketing.jpg", alt: "Promoting a book on social media" },
  { badge: "Brand", title: "Author Branding", description: "Make your name memorable. Readers don\u2019t just connect with stories. They connect with the people behind them, too. Build a recognizable author presence that reflects your writing style, personality, and work.", image: "/assets/services/author-branding.jpg", alt: "An author at their desk building a personal brand" },
  { badge: "Content", title: "Ebook Promotional Content", description: "Give them a reason to click. From intriguing book teasers to compelling promotional copy, we help turn your ebook\u2019s best features into content that catches attention and sparks curiosity.", image: "/assets/stages/launch.jpg", alt: "A display of new books with eye-catching promotion" },
  { badge: "Strategy", title: "Marketing Strategy", description: "Less guesswork, more direction. Not sure where to start? We help shape a marketing plan around your ebook, intended audience, goals, and available promotional channels.", image: "/assets/journey/discovery.jpg", alt: "Two people planning a marketing strategy together" },
];

const STEPS = [
  { title: "Tell Us About Your Ebook", description: "Share your ebook, genre, target readers, and what you hope to achieve.", image: { url: "/assets/journey/discovery.jpg", alt: "Two people talking through a book project" } },
  { title: "We Build Your Marketing Plan", description: "We identify suitable promotional approaches and content ideas based on your ebook and goals.", image: { url: "/assets/services/book-marketing.jpg", alt: "A marketing plan taking shape" } },
  { title: "Let\u2019s Get Creative", description: "We help develop engaging promotional content and campaigns to introduce your ebook to potential readers.", image: { url: "/assets/journey/design-production.jpg", alt: "Creating promotional content" } },
  { title: "Put Your Ebook Out There", description: "Launch your promotional activities, review how they perform, and use the results to guide your next steps.", image: { url: "/assets/journey/growth.jpg", alt: "A small plant growing on a pile of books" } },
].map((s) => ({ ...s, image: { ...s.image, width: 900, height: 900 } }));

const SLIDE_COLORS = [
  { bgColor: "#fff1e1", textColor: "#12294a" },
  { bgColor: "#eaf3fd", textColor: "#12294a" },
  { bgColor: "#ffe3c2", textColor: "#12294a" },
  { bgColor: "#12294a", textColor: "#ffffff", gridColor: "rgba(255,255,255,.1)" },
];
const SLIDES = STEPS.map((st, i) => ({ title: st.title, description: st.description, image: st.image.url, alt: st.image.alt, ...SLIDE_COLORS[i] }));

const WHY_CATEGORIES = ["Stand out", "Your readers", "Your brand", "Less stress", "Discovery"];
const WHY_IMAGES = [
  ["your-ideas", "A notebook, pencil and coffee on a writer's desk"],
  ["your-voice", "A reader absorbed in a book"],
  ["no-skills", "A hand writing in a notebook"],
  ["process", "A notebook page with a checklist of steps"],
  ["help", "Two people reviewing a document together"],
];
const WHY = [
  ["Stand Out in a Crowded Digital World", "Give your ebook a stronger introduction with promotional content designed to catch the attention of your intended audience."],
  ["Find Your Kind of Readers", "Reach toward the people most likely to be interested in your genre, subject, or story."],
  ["Build Your Author Identity", "Create a more consistent presence that helps readers recognize your name and discover your work."],
  ["Make Promotion Less Overwhelming", "From deciding what to post to planning a launch, get support with the marketing tasks that can feel like a book of their own."],
  ["Turn Curiosity Into Discovery", "Give potential readers reasons to explore your ebook, visit its sales page, and consider adding it to their reading list."],
];
const WHY_CARDS = WHY.map(([title, description], i) => ({
  id: String(i + 1),
  category: WHY_CATEGORIES[i],
  title,
  description,
  src: `/assets/why/${WHY_IMAGES[i][0]}.jpg`,
  alt: WHY_IMAGES[i][1],
}));

const WHO = [
  ["First-Time Authors", "Give your debut ebook a thoughtful introduction to the world."],
  ["Independent Authors", "Build awareness for your latest release without trying to do everything alone."],
  ["Established Writers", "Keep your author presence active and promote your growing collection."],
  ["Business Professionals", "Help more people discover your digital guides, educational ebooks, or industry publications."],
  ["Experts and Educators", "Promote your knowledge and make your digital resources easier for interested audiences to discover."],
];

const FAQ = [
  ["What is ebook marketing?", "Ebook marketing involves promoting your digital book to potential readers through activities such as social media content, launch campaigns, author branding, and other suitable promotional channels."],
  ["Can you help market an ebook before it launches?", "Absolutely! Pre-launch promotion can help introduce your ebook, build anticipation, and prepare your audience for release day."],
  ["Can you market an ebook that\u2019s already published?", "Yes! Your ebook doesn\u2019t need to be brand-new to deserve attention. We can help develop promotional ideas for an existing release."],
  ["Do you guarantee ebook sales?", "No marketing service can guarantee a specific number of sales. Results depend on factors such as your ebook, audience, pricing, competition, and campaign execution. Our focus is on building a thoughtful promotional strategy and improving your ebook\u2019s visibility."],
  ["Do I need a social media presence to get started?", "Not necessarily. We can discuss your existing platforms, author presence, and goals to determine an appropriate approach for your ebook."],
  ["Can you help promote different ebook genres?", "Yes! We can tailor the marketing approach to your ebook\u2019s subject, genre, intended readers, and promotional goals."],
];

function Head({ eyebrow, title, children }) {
  return (
    <Reveal className="section__head section__head--center">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </Reveal>
  );
}

const TITLE_PARTS = [
  { text: "Your Ebook Is Out There. Let\u2019s Get People ", accent: false },
  { text: "Talking About It!", accent: true },
];
const TITLE_TOTAL = TITLE_PARTS.reduce((n, p) => n + p.text.length, 0);

// Types the hero headline letter by letter. Every letter is always in the layout
// (untyped ones just have no opacity), so nothing shifts while it types.
function TypedTitle() {
  const [typed, setTyped] = useState(() => (prefersReducedMotion() ? TITLE_TOTAL : 0));
  const [caret, setCaret] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let n = 0;
    let timer;
    const tick = () => {
      n += 1;
      setTyped(n);
      if (n >= TITLE_TOTAL) {
        timer = setTimeout(() => setCaret(false), 3200);
        return;
      }
      timer = setTimeout(tick, 70);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, []);

  let idx = 0;
  const nodes = [];
  TITLE_PARTS.forEach((part, pi) => {
    part.text.split(/( )/).forEach((word, wi) => {
      if (word === "") return;
      if (word === " ") {
        idx += 1;
        nodes.push(" ");
        return;
      }
      nodes.push(
        <span className="bw-tw__word" key={`${pi}-${wi}`}>
          {[...word].map((ch) => {
            const i = idx++;
            return (
              <span
                key={i}
                className={"tw__c" + (part.accent ? " bw-tw__accent" : "")}
                data-on={i < typed}
                data-caret={(caret && i === typed - 1) || (caret && typed === 0 && i === 0 && "start") || undefined}
              >
                {ch}
              </span>
            );
          })}
        </span>
      );
    });
  });

  return (
    <h1 id="bw-hero-title" aria-label={TITLE_PARTS.map((p) => p.text).join("")}>
      <span aria-hidden="true">{nodes}</span>
    </h1>
  );
}

export default function BookMarketing() {
  usePageMeta(
    "Book Marketing Services | Firefox Publisher",
    "Ebook launch marketing, social media content, author branding, promotional copy and strategy to help the right readers discover your ebook."
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="bw-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ServiceSchema name="Book Marketing Services" path="book-marketing" description="Ebook launch marketing, social media content, author branding, promotional copy and strategy to help the right readers discover your ebook." />

      {/* Hero */}
      <section className="bw-hero3" aria-labelledby="bw-hero-title">
        <div className="bw-hero3__inner">
          <div className="bw-hero3__text">
            <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / Book Marketing</p>
            <p className="bw-hero3__pill">Book marketing services</p>
            <TypedTitle />
            <p className="lead">You&rsquo;ve written the story. You&rsquo;ve poured your heart into every page. Now comes the exciting part: getting it in front of the right readers!</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/#contact">Let&rsquo;s market my ebook!</Link>
              <Link className="btn btn--secondary" to="#bw-process">See how it works</Link>
            </div>
            <p className="bw-hero__note">Your ebook has a story to tell. Let&rsquo;s help the world discover it!</p>
          </div>
          <div className="bw-hero3__art">
            <img src="/assets/services/book-marketing.jpg" alt="Promoting a book to readers online" width="900" height="900" />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section" id="bw-intro">
        <div className="wrap bw-intro">
          <Reveal className="bw-intro__text">
            <p className="eyebrow">Book marketing services</p>
            <h2>Your Ebook Deserves Its Own Spotlight!</h2>
            <p>Even the most amazing ebook deserves more than a quiet launch and a link sitting somewhere on the internet.</p>
            <p><strong>At Firefox Publisher, we help authors put their ebooks in the spotlight</strong> with creative book marketing strategies designed to build awareness, attract potential readers, and give their stories a chance to shine.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">Your ebook has a story to tell. Let&rsquo;s help the world discover it!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s market my ebook!</Link>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section section--ice">
        <div className="wrap">
          <Head eyebrow="How we help" title="Here&rsquo;s How We Help Your Ebook Get Noticed">
            <p>A great ebook deserves more than a &ldquo;just published!&rdquo; post and a little wishful thinking. It needs a plan to help the right readers find it. From building buzz around your launch to creating engaging promotional content, we help give your ebook the attention it deserves.</p>
          </Head>
          <Reveal className="bw-gallery"><ImageGallery items={TYPES} /></Reveal>
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s put my ebook in the spotlight!</Link></p>
        </div>
      </section>

      {/* Process */}
      <section id="bw-process" aria-labelledby="bw-process-title">
        <ScrollingFeatureShowcase
          slides={SLIDES}
          ctaText="Let's market my ebook!"
          ctaHref="/#contact"
          as={Link}
          hrefProp="to"
          ctaClassName="btn btn--primary"
          className="bw-story"
          perSlide={0.6}
          header={
            <div className="section__head section__head--center bw-head">
              <p className="eyebrow">How it works</p>
              <h2 id="bw-process-title">From &ldquo;I Published an Ebook!&rdquo; to &ldquo;Have You Read This Yet?&rdquo;</h2>
              <p>Marketing your ebook doesn&rsquo;t have to feel like shouting into the internet void. Let&rsquo;s give your promotion some direction!</p>
            </div>
          }
        />
      </section>

      {/* Why us */}
      <section className="section" id="bw-why">
        <div className="wrap">
          <Head eyebrow="Why Firefox Publisher?" title="Why Should Your Ebook Have All the Fun Without a Marketing Plan?">
            <p>A clear plan. Creative promotion. More opportunities to connect with readers.</p>
          </Head>
          <AppleCardCarousel cards={WHY_CARDS} label="Why Firefox Publisher" />
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s market my ebook!</Link></p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="section section--ice">
        <div className="wrap bw-who">
          <Reveal className="bw-who__intro">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2>Is Your Ebook Ready for Its Marketing Debut?</h2>
            <p>Whether you&rsquo;re a first-time author or a seasoned storyteller, there&rsquo;s always room to help more readers discover your work.</p>
            <p className="bw-who__see">Whatever you&rsquo;ve written, let&rsquo;s help the right people find it.</p>
            <Link className="btn btn--primary" to="/#contact">Tell us about my ebook</Link>
          </Reveal>
          <Reveal className="bw-who__feed" delay={80}>
            <AnimatedList label="Who our book marketing services are for" delay={1500}>
              {WHO.map(([t, p], i) => (
                <figure className="bw-who__card" key={t}>
                  <span className={"bw-who__icon bw-who__icon--" + (i % 3)}>{t.charAt(0)}</span>
                  <figcaption>
                    <strong>{t}</strong>
                    <span>{p}</span>
                  </figcaption>
                </figure>
              ))}
            </AnimatedList>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="bw-faq">
        <div className="wrap bw-faq">
          <Head eyebrow="FAQ" title="Got Questions? We've Got Answers!" />
          <div className="faq">
            {FAQ.map(([q, a], i) => (
              <Reveal as="details" className="faq__item" key={q} delay={stagger(i)} name="bw-faq">
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

      {/* Final CTA */}
      <section className="section band bw-final">
        <div className="wrap bw-final__in">
          <h2>Your Ebook Is Written. Now Let&rsquo;s Get It Noticed!</h2>
          <p>Your next reader could be discovering a new favorite book right now. Let&rsquo;s give them a chance to discover yours!</p>
          <p>At Firefox Publisher, we help bring your ebook into the spotlight with creative marketing support that gives your story, knowledge, and ideas more opportunities to reach readers.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s market my ebook!</Link>
            <Link className="btn btn--ghost" to="/#contact">Have questions? Talk to our team</Link>
          </div>
          <p className="bw-final__tag">Your ebook. Your audience. Your next big opportunity.</p>
        </div>
      </section>
    </div>
  );
}
