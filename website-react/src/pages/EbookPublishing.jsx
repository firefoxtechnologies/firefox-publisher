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
  { badge: "Guidance", title: "Ebook Publishing Assistance", description: "Let\u2019s get you published! Not sure what comes after writing? We\u2019ll help you understand the publishing process, prepare your files, and work through the steps required for your chosen publishing platform. Less confusion. More progress!", image: "/assets/services/book-publishing.jpg", alt: "A finished book ready to be published" },
  { badge: "Formatting", title: "Ebook Formatting", description: "Make those pages publication-ready! Your manuscript needs to look right on digital screens, too. We help prepare your ebook with clean formatting, organized chapters, and readable text so your content is ready for the next stage of publishing.", image: "/assets/stages/designed.jpg", alt: "An open book with a cleanly laid-out photo spread" },
  { badge: "Cover & interior", title: "Ebook Cover & Interior Preparation", description: "Dress your book for success! A great book deserves a great presentation. We can help prepare your cover and interior files according to your project\u2019s needs and the specifications of your chosen platform. Already have a design? Great! Need one? Let\u2019s discuss your options.", image: "/assets/services/cover-interior-design.jpg", alt: "Colourful book covers laid out side by side" },
  { badge: "Platforms", title: "Publishing Platform Setup Assistance", description: "Let\u2019s figure it out! Different publishing platforms have different rules. We\u2019ll help you understand the requirements for your chosen platform and guide you through the relevant setup and submission steps, according to the agreed service.", image: "/assets/journey/launch.jpg", alt: "Planning a book launch on a laptop" },
  { badge: "Upload", title: "Final File & Upload Support", description: "Almost there! File formats, metadata, book descriptions\u2026 there\u2019s a lot to think about before publishing. We\u2019ll help you prepare the required materials and, where included in your package, assist with the upload or submission process.", image: "/assets/stages/launch.jpg", alt: "A display of newly published books" },
];

const STEPS = [
  { title: "Tell Us About Your Book", description: "Share your manuscript, genre, book title, and publishing goals. Already have a cover and formatted files? Even better!", image: { url: "/assets/journey/discovery.jpg", alt: "Two people talking through a book project" } },
  { title: "Let\u2019s Make a Publishing Plan", description: "We\u2019ll discuss your chosen platform, identify the materials you need, and explain the steps involved in preparing your ebook.", image: { url: "/assets/services/book-publishing.jpg", alt: "A publishing plan on a desk" } },
  { title: "Get Your Ebook Ready", description: "We\u2019ll help prepare your manuscript, formatting, cover files, and other publishing materials according to the services you\u2019ve selected.", image: { url: "/assets/journey/design-production.jpg", alt: "Preparing book files for publishing" } },
  { title: "Let\u2019s Handle the Details", description: "We\u2019ll work through the agreed publishing tasks and help you understand any platform-specific requirements that need your attention.", image: { url: "/assets/journey/editorial.jpg", alt: "Checking the details of a manuscript" } },
  { title: "Hello, Published Author!", description: "Once your ebook has been submitted and accepted by the publishing platform, readers can discover your work according to that platform\u2019s review process, release settings, and availability.", image: { url: "/assets/journey/growth.jpg", alt: "A small plant growing on a pile of books" } },
].map((s) => ({ ...s, image: { ...s.image, width: 900, height: 900 } }));

const SLIDE_COLORS = [
  { bgColor: "#fff1e1", textColor: "#12294a" },
  { bgColor: "#eaf3fd", textColor: "#12294a" },
  { bgColor: "#ffe3c2", textColor: "#12294a" },
  { bgColor: "#dbe9f8", textColor: "#12294a" },
  { bgColor: "#12294a", textColor: "#ffffff", gridColor: "rgba(255,255,255,.1)" },
];
const SLIDES = STEPS.map((st, i) => ({ title: st.title, description: st.description, image: st.image.url, alt: st.image.alt, ...SLIDE_COLORS[i] }));

const WHY_CATEGORIES = ["First-timers", "Organized", "Tailored", "Your control", "Full support"];
const WHY_IMAGES = [
  ["your-ideas", "A notebook, pencil and coffee on a writer's desk"],
  ["process", "A notebook page with a checklist of steps"],
  ["your-voice", "A reader absorbed in a book"],
  ["no-skills", "A hand writing in a notebook"],
  ["help", "Two people reviewing a document together"],
];
const WHY = [
  ["Guidance for First-Time Authors", "Never published an ebook before? No worries. We\u2019ll help you understand the steps and what you need to prepare."],
  ["A More Organized Process", "From your manuscript to your publishing files, we\u2019ll help you keep the important details in order."],
  ["Support That Fits Your Book", "A novel, a business guide, and a children\u2019s ebook don\u2019t always have the same requirements. We\u2019ll discuss the needs of your project."],
  ["Your Book, Your Decisions", "You remain in control of your work and publishing choices, including your book details, pricing decisions, and publishing preferences."],
  ["Help Beyond the Manuscript", "Depending on your selected services, we can also discuss editing, cover design, interior formatting, and other preparation needs."],
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
  ["First-time authors", "Finally ready to turn your writing dream into a published ebook?"],
  ["Fiction writers", "Your romance, mystery, fantasy, or thriller is ready for readers."],
  ["Nonfiction authors", "Have knowledge worth sharing? Let\u2019s help prepare your ebook for publication."],
  ["Business owners and professionals", "Turn your expertise into an ebook that supports your professional goals."],
  ["Self-publishing authors", "Want more help managing the steps between manuscript and publication?"],
  ["Authors with existing books", "Looking to prepare a new ebook edition or update your publishing files? Let\u2019s discuss your project."],
];

const FAQ = [
  ["What are ebook publishing services?", "Ebook publishing services help authors prepare and submit digital books for publication. Depending on the package, this can include formatting, cover preparation, metadata, platform guidance, and upload assistance."],
  ["Can you publish my ebook if I\u2019ve never published before?", "Absolutely! We\u2019ll discuss your goals, explain the steps, and help you understand what\u2019s needed to get started."],
  ["Do I need a finished manuscript?", "A completed manuscript is usually the best starting point for ebook publishing. If yours still needs writing or editing, ask us about those services first."],
  ["Can you help me publish on Amazon Kindle?", "We can discuss preparing your ebook for Amazon Kindle Direct Publishing (KDP) and assisting with the relevant publishing steps, depending on your selected service and the access available."],
  ["Will my ebook be available worldwide?", "Availability depends on your chosen platform, distribution settings, rights, and other publishing requirements. We\u2019ll help you understand the options available for your project."],
  ["Will my ebook start making money immediately?", "Publishing doesn\u2019t guarantee sales or earnings. Your results depend on factors such as your book, pricing, audience, discoverability, and marketing efforts."],
  ["Do I keep the rights to my book?", "Your rights depend on the agreements you sign and the choices you make with your publishing platform. Review the relevant terms carefully and make sure you understand them before proceeding."],
  ["How much do ebook publishing services cost?", "Pricing depends on your manuscript\u2019s condition, the platform, and the support you need. Contact us with your book details for a tailored quote."],
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
  { text: "Your Book Is Ready. Let\u2019s Get It Out ", accent: false },
  { text: "Into the World!", accent: true },
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

export default function EbookPublishing() {
  usePageMeta(
    "Ebook Publishing Services | Firefox Publisher",
    "Ebook publishing help: formatting, cover and interior preparation, platform setup and upload support, so your finished manuscript can reach readers."
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="bw-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ServiceSchema name="Ebook Publishing Services" path="ebook-publishing" description="Ebook publishing help: formatting, cover and interior preparation, platform setup and upload support, so your finished manuscript can reach readers." />

      {/* Hero */}
      <section className="bw-hero3" aria-labelledby="bw-hero-title">
        <div className="bw-hero3__inner">
          <div className="bw-hero3__text">
            <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / Ebook Publishing</p>
            <p className="bw-hero3__pill">Ebook Publishing Services</p>
            <TypedTitle />
            <p className="lead">From &ldquo;I&rsquo;ve written a book!&rdquo; to &ldquo;It&rsquo;s published!&rdquo; Let&rsquo;s make it happen. &#128218;</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/#contact">Let&rsquo;s publish my ebook!</Link>
              <Link className="btn btn--secondary" to="#bw-process">See how it works</Link>
            </div>
            <p className="bw-hero__note">Your story deserves to be read. Let&rsquo;s help it find its way to readers!</p>
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
            <h2>You&rsquo;ve Dreamed It, Written It, Edited It!</h2>
            <p>You&rsquo;ve dreamed it, written it, edited it, and maybe even given it a beautiful cover. Now comes the exciting part: getting your ebook ready for readers!</p>
            <p>But publishing can feel like a maze of file formats, platform requirements, and technical details. Where do you upload your book? Which format do you need? And what happens next?</p>
            <p><strong>That&rsquo;s where Firefox Publisher comes in!</strong> Our ebook publishing services help you prepare your book for its next big adventure. We&rsquo;ll help you navigate the publishing process so you can focus on what you do best: being the author!</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">Your story deserves to be read. Let&rsquo;s help it find its way to readers!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s publish my ebook!</Link>
          </Reveal>
        </div>
      </section>

      {/* Types of design */}
      <section className="section section--ice">
        <div className="wrap">
          <Head eyebrow="Our publishing services" title="You&rsquo;ve Written the Book. Now Let&rsquo;s Make It Official!">
            <p>Publishing your ebook doesn&rsquo;t have to be a headache. Whether you&rsquo;re a first-time author or a seasoned storyteller, we&rsquo;re here to help turn your finished manuscript into a publication-ready ebook.</p>
          </Head>
          <Reveal className="bw-gallery"><ImageGallery items={TYPES} /></Reveal>
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Explore our ebook publishing services</Link></p>
        </div>
      </section>

      {/* Process */}
      <section id="bw-process" aria-labelledby="bw-process-title">
        <ScrollingFeatureShowcase
          slides={SLIDES}
          ctaText="Start my publishing journey"
          ctaHref="/#contact"
          as={Link}
          hrefProp="to"
          ctaClassName="btn btn--primary"
          className="bw-story"
          perSlide={0.6}
          header={
            <div className="section__head section__head--center bw-head">
              <p className="eyebrow">How it works</p>
              <h2 id="bw-process-title">From Manuscript to Published Ebook!</h2>
              <p>Every author deserves to enjoy the moment their book goes live. Let&rsquo;s make the journey feel a little less complicated.</p>
            </div>
          }
        />
      </section>

      {/* Why us */}
      <section className="section" id="bw-why">
        <div className="wrap">
          <Head eyebrow="Why Firefox Publisher?" title="Why Choose Firefox Publisher?">
            <p>Because publishing your book should feel exciting, not like filling out an endless pile of confusing forms!</p>
          </Head>
          <AppleCardCarousel cards={WHY_CARDS} label="Why Firefox Publisher" />
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s get my book published!</Link></p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="section section--ice">
        <div className="wrap bw-who">
          <Reveal className="bw-who__intro">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2>Who Can We Help Publish?</h2>
            <p>If you&rsquo;ve got a book ready to share, we&rsquo;d love to help you explore your options!</p>
            <p className="bw-who__see">Your book has made it this far. Let&rsquo;s help it take the next step!</p>
            <Link className="btn btn--primary" to="/#contact">Tell us about my book</Link>
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
        title={<>Ebook Publishing vs. Book Writing: <em>what&rsquo;s the difference?</em></>}
        description={
          <>
            <p>Think of writing a book as creating the cake, and publishing as getting it ready to serve!</p>
            <p><strong>Book writing</strong> is where your ideas become chapters, stories, and a complete manuscript.</p>
            <p><strong>Ebook publishing</strong> is the process of preparing that manuscript, meeting your chosen platform&rsquo;s requirements, submitting the book, and making it available to readers once approved.</p>
            <p>Already written your book? You&rsquo;re in the right place! Still need help with writing, editing, or design? We can discuss those services with you, too.</p>
          </>
        }
        buttonText="Find the help I need"
        buttonLink="/#contact"
        as={Link}
        hrefProp="to"
        buttonClassName="btn btn--primary"
        imageUrl1="/assets/covers/the-last-lighthouse.svg"
        imageUrl2="/assets/covers/salt-and-ember.svg"
        imageAlt1="Cover of The Last Lighthouse, a sample book"
        imageAlt2="Cover of Salt and Ember, a sample book"
      />

      {/* FAQ */}
      <section className="section" id="bw-faq">
        <div className="wrap bw-faq">
          <Head eyebrow="FAQ" title="A Few Questions Before You Publish" />
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
          <h2>Your Story Is Ready for Its Big Debut!</h2>
          <p>You&rsquo;ve put your ideas into words. You&rsquo;ve worked through the chapters. Now it&rsquo;s time to take the next step!</p>
          <p>Let Firefox Publisher help you navigate the ebook publishing process, prepare your files, and work toward sharing your book with the world. No more putting it off until &ldquo;someday.&rdquo; Your publishing journey can start right here. Ready to become a published author? Let&rsquo;s do this!</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s publish my ebook!</Link>
            <Link className="btn btn--ghost" to="/#contact">Have questions first? Talk to our team</Link>
          </div>
          <p className="bw-final__tag">Firefox Publisher &mdash; Your Story. Your Book. Your Next Big Chapter.</p>
        </div>
      </section>
    </div>
  );
}
