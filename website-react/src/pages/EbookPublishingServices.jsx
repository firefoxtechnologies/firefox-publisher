import { Link } from "react-router-dom";
import { SplitHero } from "../components/ui/hero-section";
import { ScrollingFeatureShowcase } from "../components/ui/interactive-scrolling-story-component";
import { ImageGallery } from "../components/ui/image-gallery";
import { AppleCardCarousel } from "../components/ui/carousel-08";
import { AnimatedList } from "../components/ui/animated-list";
import { Reveal, stagger } from "../components/ui.jsx";
import { useEffect, useState } from "react";
import ServiceSchema from "../components/Schema.jsx";
import { usePageMeta, prefersReducedMotion } from "../hooks.js";

const TYPES = [
  { badge: "Formatting", title: "Ebook Formatting", description: "Make every page look good! Nobody wants to read a book with messy spacing or confusing chapter layouts. We help format your ebook with clean text, organized chapters, and a reader-friendly layout that works with your chosen publishing platform.", image: "/assets/stages/designed.jpg", alt: "An open book with a cleanly laid-out photo spread" },
  { badge: "Cover", title: "Ebook Cover Design", description: "Make that first impression count! Your cover is often the first thing readers notice. Let\u2019s give them a reason to take a closer look. We help create attractive ebook covers that match your book\u2019s genre, style, and personality.", image: "/assets/services/cover-interior-design.jpg", alt: "Colourful book covers laid out side by side" },
  { badge: "Publishing", title: "Ebook Publishing Assistance", description: "Let\u2019s get you out there! Ready to share your book with the world? We\u2019ll help you understand the publishing process and prepare the materials needed for your chosen platform. From getting your files ready to working through the relevant publishing steps, we\u2019ll help make the journey feel less confusing.", image: "/assets/services/book-publishing.jpg", alt: "A finished book ready to be published" },
  { badge: "Metadata", title: "Book Description & Metadata", description: "Help readers find your book! Your ebook needs more than a great story. It also needs a description that sparks curiosity and details that help readers understand what it\u2019s about. We can help prepare engaging book descriptions and relevant publishing information, including titles, author details, and appropriate categories or keywords.", image: "/assets/journey/launch.jpg", alt: "Planning a book listing on a laptop" },
  { badge: "Files", title: "Ebook File Preparation", description: "Ready, set, publish! Different platforms have different requirements. We\u2019ll help prepare your ebook files in the appropriate formats for your selected publishing destination, based on the agreed project scope.", image: "/assets/journey/design-production.jpg", alt: "Preparing ebook files for publishing" },
];

const STEPS = [
  { title: "Tell Us About Your Book", description: "Share your manuscript, book title, genre, and publishing goals. Have a finished ebook already? Great! We\u2019ll start from where you are.", image: { url: "/assets/journey/discovery.jpg", alt: "Two people talking through a book project" } },
  { title: "Let\u2019s Get Everything Ready", description: "We\u2019ll discuss what your ebook needs, from formatting and cover design to descriptions and publishing details.", image: { url: "/assets/services/cover-interior-design.jpg", alt: "Book covers and layouts being planned" } },
  { title: "Time to Polish the Details", description: "We\u2019ll help prepare your ebook files and publishing materials according to your selected services.", image: { url: "/assets/journey/editorial.jpg", alt: "Checking the details of a manuscript" } },
  { title: "Let\u2019s Get It Submitted", description: "We\u2019ll guide you through the agreed publishing steps for your chosen platform, including upload assistance where available.", image: { url: "/assets/services/book-publishing.jpg", alt: "A book being prepared for submission" } },
  { title: "Hello, Published Author!", description: "Once your ebook is approved and released by the publishing platform, readers can discover your work according to the platform\u2019s availability and distribution settings.", image: { url: "/assets/journey/growth.jpg", alt: "A small plant growing on a pile of books" } },
].map((s) => ({ ...s, image: { ...s.image, width: 900, height: 900 } }));

const SLIDE_COLORS = [
  { bgColor: "#fff1e1", textColor: "#12294a" },
  { bgColor: "#eaf3fd", textColor: "#12294a" },
  { bgColor: "#ffe3c2", textColor: "#12294a" },
  { bgColor: "#dbe9f8", textColor: "#12294a" },
  { bgColor: "#12294a", textColor: "#ffffff", gridColor: "rgba(255,255,255,.1)" },
];
const SLIDES = STEPS.map((st, i) => ({ title: st.title, description: st.description, image: st.image.url, alt: st.image.alt, ...SLIDE_COLORS[i] }));

const WHY_CATEGORIES = ["Friendly", "Professional", "Your story", "Details", "Your journey"];
const WHY_IMAGES = [
  ["help", "Two people reviewing a document together"],
  ["process", "A notebook page with a checklist of steps"],
  ["your-voice", "A reader absorbed in a book"],
  ["no-skills", "A hand writing in a notebook"],
  ["your-ideas", "A notebook, pencil and coffee on a writer's desk"],
];
const WHY = [
  ["Simple, Friendly Guidance", "New to ebook publishing? No worries. We\u2019ll help you understand the process without drowning you in technical jargon."],
  ["A Professional Presentation", "From clean formatting to an eye-catching cover, we\u2019ll help your ebook look polished and ready for its digital debut."],
  ["Your Story Stays Yours", "Your ideas, your voice, your book. We\u2019ll work with your vision and publishing goals."],
  ["Help With the Important Details", "Formatting, book descriptions, metadata, and platform requirements all play a part in getting your ebook ready."],
  ["Support for Your Author Journey", "Whether this is your first ebook or your next big release, we\u2019ll help you identify the steps needed to move forward."],
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
  ["First-time authors", "Turn your writing dream into a digital publication."],
  ["Fiction writers", "Get your romance, fantasy, mystery, or thriller ready for readers."],
  ["Nonfiction authors", "Share your knowledge, ideas, and experiences through an ebook."],
  ["Business owners", "Turn your expertise into a digital book for your audience."],
  ["Self-publishing authors", "Get help preparing and submitting your next release."],
  ["Existing authors", "Update your ebook files or prepare a new digital edition."],
];

const FAQ = [
  ["Can you publish my ebook if I\u2019m a first-time author?", "Absolutely! We\u2019ll help you understand the steps involved and identify what your ebook needs before submission."],
  ["Do I need a finished manuscript?", "A completed manuscript is usually the best starting point. If your book still needs writing or editing, ask us about those services."],
  ["Can you help me publish on Amazon Kindle?", "We can discuss preparing your ebook for Amazon Kindle Direct Publishing (KDP) and the level of publishing assistance available for your project."],
  ["Do you provide ebook cover design and formatting?", "Yes, these can be discussed as part of your ebook preparation needs, depending on the services you select."],
  ["Will my ebook be available worldwide?", "That depends on your chosen platform, distribution settings, rights, and eligibility requirements. We\u2019ll help you understand the available options."],
  ["Can you guarantee ebook sales?", "No publishing service can guarantee sales. Your results depend on factors such as your content, audience, pricing, discoverability, and marketing."],
  ["How much do ebook publishing services cost?", "Pricing depends on the services you need and the condition of your manuscript. Contact us with your project details for a tailored quote."],
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
  { text: "Your Ebook Deserves to ", accent: false },
  { text: "Go Places!", accent: true },
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

export default function EbookPublishingServices() {
  usePageMeta(
    "Ebook Publishing Services & Support | Firefox Publisher",
    "Ebook formatting, cover design, book descriptions, metadata and file preparation, plus guidance through your chosen publishing platform."
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="bw-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ServiceSchema name="Ebook Publishing Services & Support" path="ebook-publishing-services" description="Ebook formatting, cover design, book descriptions, metadata and file preparation, plus guidance through your chosen publishing platform." />

      {/* Hero */}
      <section className="bw-hero3" aria-labelledby="bw-hero-title">
        <div className="bw-hero3__inner">
          <div className="bw-hero3__text">
            <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / Ebook Publishing Services</p>
            <p className="bw-hero3__pill">Your digital debut</p>
            <TypedTitle />
            <p className="lead">From your screen to readers&rsquo; screens. Let&rsquo;s make it happen! &#128218;&#10024;</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/#contact">Let&rsquo;s publish my ebook!</Link>
              <Link className="btn btn--secondary" to="#bw-process">See how it works</Link>
            </div>
            <p className="bw-hero__note">Your ideas deserve more than a folder on your laptop.</p>
          </div>
          <div className="bw-hero3__art">
            <img src="/assets/services/book-publishing.jpg" alt="A finished book ready to be published" width="900" height="900" />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section" id="bw-intro">
        <div className="wrap bw-intro">
          <Reveal className="bw-intro__text">
            <p className="eyebrow">Ebook publishing services</p>
            <h2>Now Comes the Exciting Part!</h2>
            <p>You&rsquo;ve got the idea. You&rsquo;ve written the chapters. Maybe you&rsquo;ve even designed a beautiful cover. Now comes the exciting part: getting your ebook ready for the world!</p>
            <p>But wait&hellip; file formats, layouts, publishing platforms, book descriptions? Suddenly, publishing feels like a whole new story.</p>
            <p><strong>That&rsquo;s where Firefox Publisher comes in!</strong> We help authors prepare their ebooks for digital publication, making the process easier to understand and helping you take the next step toward sharing your work with readers.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">Your story is ready for an adventure. Let&rsquo;s get it published!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s publish my ebook!</Link>
          </Reveal>
        </div>
      </section>

      {/* Types of design */}
      <section className="section section--ice">
        <div className="wrap">
          <Head eyebrow="Our publishing services" title="From Your Manuscript to a Published Ebook!">
            <p>Publishing an ebook involves more than clicking an upload button. Let&rsquo;s get all the important details ready!</p>
          </Head>
          <Reveal className="bw-gallery"><ImageGallery items={TYPES} /></Reveal>
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Explore our ebook publishing services</Link></p>
        </div>
      </section>

      {/* Process */}
      <section id="bw-process" aria-labelledby="bw-process-title">
        <ScrollingFeatureShowcase
          slides={SLIDES}
          ctaText="Start my ebook publishing journey"
          ctaHref="/#contact"
          as={Link}
          hrefProp="to"
          ctaClassName="btn btn--primary"
          className="bw-story"
          perSlide={0.6}
          header={
            <div className="section__head section__head--center bw-head">
              <p className="eyebrow">How it works</p>
              <h2 id="bw-process-title">Publishing Your Ebook Doesn&rsquo;t Have to Be Complicated!</h2>
              <p>We&rsquo;ll help you break the process into simple, manageable steps.</p>
            </div>
          }
        />
      </section>

      {/* Why us */}
      <section className="section" id="bw-why">
        <div className="wrap">
          <Head eyebrow="Why Firefox Publisher?" title="Why Choose Firefox Publisher?">
            <p>Because your first ebook launch should be exciting&mdash;not a headache!</p>
          </Head>
          <AppleCardCarousel cards={WHY_CARDS} label="Why Firefox Publisher" />
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s get my ebook ready!</Link></p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="section section--ice">
        <div className="wrap bw-who">
          <Reveal className="bw-who__intro">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2>Who&rsquo;s Ready to Publish an Ebook?</h2>
            <p>Maybe it&rsquo;s your first book. Maybe it&rsquo;s a business guide. Maybe you&rsquo;ve been sitting on a brilliant story for years. Whatever your reason, we&rsquo;re here to help!</p>
            <p className="bw-who__see">Got a manuscript? We&rsquo;ve got a starting point!</p>
            <Link className="btn btn--primary" to="/#contact">Tell us about my ebook</Link>
          </Reveal>
          <Reveal className="bw-who__feed" delay={80}>
            <AnimatedList label="Who our ebook publishing services are for" delay={1500}>
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

      {/* Cover vs interior */}
      <SplitHero
        className="story-cta bw-start"
        title={<>What Exactly Is <em>Ebook Publishing?</em></>}
        description={
          <>
            <p>Think of ebook publishing as getting your book ready for its grand digital debut!</p>
            <p>It involves preparing your manuscript, checking its formatting, creating a cover, adding the right book details, and submitting the finished files to a digital publishing platform.</p>
            <p>Once the platform approves and releases your ebook, readers can access it through the available digital channels.</p>
            <strong>And the best part? Your book can be read on compatible e-readers, phones, tablets, and computers.</strong>
          </>
        }
        buttonText="Help me publish my book"
        buttonLink="/#contact"
        as={Link}
        hrefProp="to"
        buttonClassName="btn btn--primary"
        imageUrl1="/assets/covers/light-between-worlds.svg"
        imageUrl2="/assets/covers/paper-kingdoms.svg"
        imageAlt1="Cover of Light Between Worlds, a sample book"
        imageAlt2="Cover of Paper Kingdoms, a sample book"
      />

      {/* FAQ */}
      <section className="section" id="bw-faq">
        <div className="wrap bw-faq">
          <Head eyebrow="FAQ" title="A Few Questions Before You Begin" />
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
          <h2>Your Story Is Ready. Let&rsquo;s Share It With the World!</h2>
          <p>That manuscript you&rsquo;ve worked so hard on deserves its moment.</p>
          <p>Whether you need help with ebook formatting, cover design, publishing details, or submission preparation, Firefox Publisher is here to help you take the next step. Less confusion. More confidence. One exciting step closer to becoming a published author. Ready to make your ebook official? Let&rsquo;s do this!</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s publish my ebook!</Link>
            <Link className="btn btn--ghost" to="/#contact">Have questions first? Talk to our team</Link>
          </div>
          <p className="bw-final__tag">Firefox Publisher &mdash; Your Story. Your Book. Your Digital Debut.</p>
        </div>
      </section>
    </div>
  );
}
