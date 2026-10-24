import { Link } from "react-router-dom";
import { SplitHero } from "../components/ui/hero-section";
import { ScrollingFeatureShowcase } from "../components/ui/interactive-scrolling-story-component";
import { ImageGallery } from "../components/ui/image-gallery";
import { AppleCardCarousel } from "../components/ui/carousel-08";
import { AnimatedList } from "../components/ui/animated-list";
import { Reveal, stagger } from "../components/ui.jsx";
import { useEffect, useState } from "react";
import { usePageMeta, prefersReducedMotion } from "../hooks.js";

const TYPES = [
  { badge: "Cover", title: "Ebook Cover Design", description: "Make them look twice! Your cover is the first thing readers see, so let\u2019s make it count. We create eye-catching ebook covers that match your book\u2019s personality, genre, and message. Bold and dramatic? Clean and professional? Magical and whimsical? We\u2019ll help bring your vision to life.", image: "/assets/services/cover-interior-design.jpg", alt: "Colourful book covers laid out side by side" },
  { badge: "Interior", title: "Ebook Interior Design", description: "Give your words a beautiful home! Nobody wants to read a book that feels like a giant wall of text. We design clean, attractive ebook interiors with readable typography, thoughtful spacing, and well-organized chapters, for a smoother, more enjoyable reading experience.", image: "/assets/stages/designed.jpg", alt: "An open book with a cleanly laid-out photo spread" },
  { badge: "Details", title: "Chapter & Page Styling", description: "Little details, big difference! Chapter headings, page layouts, section breaks, and text styling might seem like small things, but they can make a big difference. We\u2019ll help give your ebook a consistent look so everything feels polished and easy to follow.", image: "/assets/journey/design-production.jpg", alt: "A designer laying out book pages" },
  { badge: "Visuals", title: "Images & Visual Elements", description: "Let\u2019s add some personality! Some books need more than words. Depending on your project, we can help incorporate illustrations, images, graphics, and other visual elements to complement your content.", image: "/assets/stages/launch.jpg", alt: "A display of finished books with attractive covers" },
];

const STEPS = [
  { title: "Tell Us About Your Book", description: "Share your manuscript, book title, genre, and ideas for the design. Have a mood board or a cover you love? Show us!", image: { url: "/assets/journey/discovery.jpg", alt: "Two people sharing ideas for a book" } },
  { title: "Let\u2019s Find Your Style", description: "We\u2019ll discuss the look and feel that suits your book, your audience, and your vision.", image: { url: "/assets/services/cover-interior-design.jpg", alt: "Book covers in a range of styles" } },
  { title: "Time to Get Creative!", description: "We\u2019ll work on your ebook cover, interior layout, or both, depending on the services you\u2019ve chosen.", image: { url: "/assets/journey/design-production.jpg", alt: "A designer working on a book layout" } },
  { title: "Review the Design", description: "Take a look, share your feedback, and let us know what you\u2019d like adjusted within the agreed project scope.", image: { url: "/assets/journey/editorial.jpg", alt: "Reviewing pages and giving feedback" } },
  { title: "Ready for the Spotlight!", description: "Once approved, your design files will be prepared in the agreed formats, ready for the next step in your ebook publishing journey.", image: { url: "/assets/stages/launch.jpg", alt: "A display of newly published books" } },
].map((s) => ({ ...s, image: { ...s.image, width: 900, height: 900 } }));

const SLIDE_COLORS = [
  { bgColor: "#fff1e1", textColor: "#12294a" },
  { bgColor: "#eaf3fd", textColor: "#12294a" },
  { bgColor: "#ffe3c2", textColor: "#12294a" },
  { bgColor: "#dbe9f8", textColor: "#12294a" },
  { bgColor: "#12294a", textColor: "#ffffff", gridColor: "rgba(255,255,255,.1)" },
];
const SLIDES = STEPS.map((st, i) => ({ title: st.title, description: st.description, image: st.image.url, alt: st.image.alt, ...SLIDE_COLORS[i] }));

const WHY_CATEGORIES = ["Your story", "Eye-catching", "Readable", "Your style", "Cohesive"];
const WHY_IMAGES = [
  ["your-ideas", "A notebook, pencil and coffee on a writer's desk"],
  ["no-skills", "A hand writing in a notebook"],
  ["your-voice", "A reader absorbed in a book"],
  ["process", "A notebook page with a checklist of steps"],
  ["help", "Two people reviewing a document together"],
];
const WHY = [
  ["Designs That Fit Your Story", "A thriller shouldn\u2019t look like a cookbook, right? We tailor the design direction to your book\u2019s genre, audience, and personality."],
  ["Covers That Catch the Eye", "We focus on strong visuals, clear titles, and thoughtful layouts to help your ebook stand out."],
  ["Pages Readers Enjoy", "Clean typography, comfortable spacing, and organized content help make your ebook easier to read."],
  ["Your Ideas Matter", "Have a specific style in mind? We\u2019ll work with your preferences to bring your vision into the design process."],
  ["Everything Feels Connected", "When you choose both cover and interior design, we can create a consistent visual style that makes your ebook feel complete."],
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
  ["First-time authors", "Make your very first ebook look ready for the world."],
  ["Fiction writers", "Give your romance, thriller, fantasy, or mystery the right visual vibe."],
  ["Business owners", "Turn your expertise into a professional-looking ebook."],
  ["Coaches and educators", "Make your guides and learning materials clear, attractive, and easy to follow."],
  ["Self-publishing authors", "Give your manuscript a polished look before publishing."],
  ["Authors with an old design", "Ready for a fresh new look? Let\u2019s give your ebook a makeover!"],
];

const FAQ = [
  ["Can you design just my ebook cover?", "Absolutely! If your manuscript is already formatted, we can focus on creating a cover that fits your book and its audience."],
  ["Can you design the cover and interior together?", "Yes! You can request both services for a consistent look from the cover to the final page."],
  ["What if I don\u2019t have a design idea?", "No worries! Tell us about your book and its audience. We\u2019ll discuss creative directions that suit your project."],
  ["Can you redesign my existing ebook cover?", "Yes, we can discuss refreshing your existing cover with a new look that better fits your book."],
  ["Do you design interiors for all types of ebooks?", "We can work with a range of ebook types, including fiction, nonfiction, business guides, educational materials, and memoirs. The best layout depends on your content."],
  ["Will my ebook be ready for publishing?", "We\u2019ll prepare the files in the formats agreed for your project. Since publishing platforms have different requirements, tell us where you plan to publish so we can discuss the appropriate specifications."],
  ["How much does ebook design cost?", "Pricing depends on the type of design, manuscript length, complexity, and any additional visual elements. Contact us for a quote tailored to your book."],
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
  { text: "Your Book Deserves a Cover That Says, ", accent: false },
  { text: "\u201cPick Me!\u201d", accent: true },
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

export default function EbookDesign() {
  usePageMeta(
    "Ebook Cover & Interior Design | Firefox Publisher",
    "Eye-catching ebook covers and clean, readable interiors that suit your genre. Cover design, interior layout, chapter styling and visual elements, prepared in the formats you need."
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="bw-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bw-hero3" aria-labelledby="bw-hero-title">
        <div className="bw-hero3__inner">
          <div className="bw-hero3__text">
            <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / Ebook Cover &amp; Interior Design</p>
            <p className="bw-hero3__pill">Dress your ebook for success</p>
            <TypedTitle />
            <p className="lead">Don&rsquo;t judge a book by its cover? Well, readers often do! &#128521;</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/#contact">Let&rsquo;s design my ebook!</Link>
              <Link className="btn btn--secondary" to="#bw-process">See how it works</Link>
            </div>
            <p className="bw-hero__note">Great stories deserve great designs. Let&rsquo;s make yours stand out!</p>
          </div>
          <div className="bw-hero3__art">
            <img src="/assets/services/cover-interior-design.jpg" alt="Colourful book covers and interior layouts" width="900" height="900" />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section" id="bw-intro">
        <div className="wrap bw-intro">
          <Reveal className="bw-intro__text">
            <p className="eyebrow">Ebook cover &amp; interior design</p>
            <h2>Now It&rsquo;s Time to Dress Your Ebook for Success!</h2>
            <p>You&rsquo;ve got the story. You&rsquo;ve polished the words. Now it&rsquo;s time to dress your ebook for success!</p>
            <p><strong>At Firefox Publisher, we turn your manuscript into an ebook that looks just as good as it reads.</strong> From eye-catching ebook covers to beautifully designed pages, we&rsquo;ll help your book make a great first impression.</p>
            <p>Whether you&rsquo;re writing a romance, a business guide, a fantasy adventure, or a children&rsquo;s story, let&rsquo;s give your ebook a look readers will love.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">Great stories deserve great designs. Let&rsquo;s make yours stand out!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s design my ebook!</Link>
          </Reveal>
        </div>
      </section>

      {/* Types of design */}
      <section className="section section--ice">
        <div className="wrap">
          <Head eyebrow="Our design services" title="From Plain Pages to “Wow, That Looks Good!”">
            <p>Your ebook doesn&rsquo;t just need words. It needs a look that fits your story!</p>
          </Head>
          <Reveal className="bw-gallery"><ImageGallery items={TYPES} /></Reveal>
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Find my ebook design service</Link></p>
        </div>
      </section>

      {/* Process */}
      <section id="bw-process" aria-labelledby="bw-process-title">
        <ScrollingFeatureShowcase
          slides={SLIDES}
          ctaText="Let's bring my ebook to life!"
          ctaHref="/#contact"
          as={Link}
          hrefProp="to"
          ctaClassName="btn btn--primary"
          className="bw-story"
          perSlide={0.6}
          header={
            <div className="section__head section__head--center bw-head">
              <p className="eyebrow">How it works</p>
              <h2 id="bw-process-title">Your Book Has a Story. Let&rsquo;s Give It a Look!</h2>
              <p>Getting your ebook designed shouldn&rsquo;t feel like solving a puzzle. Here&rsquo;s how we&rsquo;ll bring your vision to life.</p>
            </div>
          }
        />
      </section>

      {/* Why us */}
      <section className="section" id="bw-why">
        <div className="wrap">
          <Head eyebrow="Why Firefox Publisher?" title="Why Choose Firefox Publisher for Ebook Design?">
            <p>Because your book deserves to look as good as the effort you put into it!</p>
          </Head>
          <AppleCardCarousel cards={WHY_CARDS} label="Why Firefox Publisher" />
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s design something amazing!</Link></p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="section section--ice">
        <div className="wrap bw-who">
          <Reveal className="bw-who__intro">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2>Who Needs Ebook Cover &amp; Interior Design?</h2>
            <p>If you&rsquo;ve got an ebook, we&rsquo;ve got design ideas!</p>
            <p className="bw-who__see">Your words tell the story. Your design helps set the scene.</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s talk about my ebook</Link>
          </Reveal>
          <Reveal className="bw-who__feed" delay={80}>
            <AnimatedList label="Who our ebook design services are for" delay={1500}>
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
        title={<>Ebook Cover vs. Interior Design: <em>what do you need?</em></>}
        description={
          <>
            <p>Think of your ebook like a little house.</p>
            <p><strong>Cover design is the front door.</strong> It&rsquo;s what catches people&rsquo;s attention and gives them a first impression of what&rsquo;s inside.</p>
            <p><strong>Interior design is everything inside.</strong> It&rsquo;s the layout, typography, chapter headings, spacing, and visual details that make reading comfortable.</p>
            <p>One catches the eye. The other keeps the reading experience smooth. And when both work together? Your ebook feels like a complete package!</p>
            <strong>Not sure what your book needs? We can help you choose.</strong>
          </>
        }
        buttonText="Help me choose"
        buttonLink="/#contact"
        as={Link}
        hrefProp="to"
        buttonClassName="btn btn--primary"
        imageUrl1="/assets/covers/written-in-amber.svg"
        imageUrl2="/assets/covers/the-quiet-flame.svg"
        imageAlt1="Cover of Written in Amber, a sample book"
        imageAlt2="Cover of The Quiet Flame, a sample book"
      />

      {/* FAQ */}
      <section className="section" id="bw-faq">
        <div className="wrap bw-faq">
          <Head eyebrow="FAQ" title="A Few Questions Before We Start" />
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
          <h2>Your Ebook Is Ready for Its Glow-Up!</h2>
          <p>You&rsquo;ve put your ideas into words. Now let&rsquo;s give them a look worth remembering!</p>
          <p>Whether you need a stunning cover, a beautifully organized interior, or a complete design makeover, Firefox Publisher is here to help your ebook look polished, professional, and ready for its next chapter. Let&rsquo;s turn those pages into something special!</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s design my ebook!</Link>
            <Link className="btn btn--ghost" to="/#contact">Have questions? Talk to our team</Link>
          </div>
          <p className="bw-final__tag">Firefox Publisher &mdash; Great Stories Deserve Great Design.</p>
        </div>
      </section>
    </div>
  );
}
