import { Link } from "react-router-dom";
import { ScrollingFeatureShowcase } from "../components/ui/interactive-scrolling-story-component";
import { ImageGallery } from "../components/ui/image-gallery";
import { AppleCardCarousel } from "../components/ui/carousel-08";
import { AnimatedList } from "../components/ui/animated-list";
import { Reveal, stagger } from "../components/ui.jsx";
import { useEffect, useState } from "react";
import { usePageMeta, prefersReducedMotion } from "../hooks.js";

const TYPES = [
  { badge: "Structure", title: "Book Formatting", description: "Give your words some structure. No awkward spacing. No messy pages. Just a clean, consistent layout that lets your words shine and your readers enjoy the journey.", image: "/assets/stages/designed.jpg", alt: "An open book with a cleanly laid-out photo spread" },
  { badge: "Layout", title: "Interior Layout Design", description: "Every page has a part to play. Chapter headings, page numbers, text alignment, and spacing: we bring all the little details together to create a polished reading experience.", image: "/assets/journey/design-production.jpg", alt: "A designer laying out book pages" },
  { badge: "Files", title: "Print-Ready File Preparation", description: "Ready, set, print! We prepare your files according to your selected printer\u2019s specifications, helping you move toward printing with greater confidence.", image: "/assets/services/book-printing.jpg", alt: "Printed book pages coming off the press" },
  { badge: "Page setup", title: "Margins, Bleed & Page Setup", description: "The little details that make a big difference. Page dimensions and print settings matter! We help prepare your layout with the required margins, bleed, and sizing based on your printing requirements.", image: "/assets/services/cover-interior-design.jpg", alt: "Book covers and pages laid out at different sizes" },
  { badge: "Final PDF", title: "Final PDF Preparation", description: "Your manuscript\u2019s big moment. Get a professionally prepared print-ready PDF to submit to your chosen printing provider. Your manuscript is one step closer to becoming a book you can hold in your hands!", image: "/assets/stages/launch.jpg", alt: "A table of finished printed books" },
];

const STEPS = [
  { title: "You Bring the Words", description: "Send us your manuscript and tell us about your book, preferred size, and printing requirements.", image: { url: "/assets/stages/draft.jpg", alt: "A finished manuscript on the desk next to a laptop" } },
  { title: "We Give It a Professional Polish", description: "We work on the formatting, interior layout, and file setup to get your manuscript looking its best.", image: { url: "/assets/journey/design-production.jpg", alt: "A designer working on a book layout" } },
  { title: "You Take a Look", description: "Review the formatted files and share any adjustments covered by your project.", image: { url: "/assets/journey/editorial.jpg", alt: "Reviewing formatted pages and giving feedback" } },
  { title: "You\u2019re Ready for the Next Chapter", description: "Receive your final print-ready files and send them to your chosen printing company.", image: { url: "/assets/services/book-printing.jpg", alt: "Printed books ready to ship" } },
].map((s) => ({ ...s, image: { ...s.image, width: 900, height: 900 } }));

const SLIDE_COLORS = [
  { bgColor: "#fff1e1", textColor: "#12294a" },
  { bgColor: "#eaf3fd", textColor: "#12294a" },
  { bgColor: "#ffe3c2", textColor: "#12294a" },
  { bgColor: "#12294a", textColor: "#ffffff", gridColor: "rgba(255,255,255,.1)" },
];
const SLIDES = STEPS.map((st, i) => ({ title: st.title, description: st.description, image: st.image.url, alt: st.image.alt, ...SLIDE_COLORS[i] }));

const WHY_CATEGORIES = ["Polished", "Details", "Less hassle", "Your vision"];
const WHY_IMAGES = [
  ["your-ideas", "A notebook, pencil and coffee on a writer's desk"],
  ["process", "A notebook page with a checklist of steps"],
  ["no-skills", "A hand writing in a notebook"],
  ["your-voice", "A reader absorbed in a book"],
];
const WHY = [
  ["A Look That Means Business", "Give your manuscript a clean, professional appearance that feels as good as the words inside it."],
  ["The Details? We\u2019ve Got Them Covered.", "From page numbering to margins, we help handle the formatting details that can make preparing files for print feel complicated."],
  ["More Writing. Less Formatting Frustration.", "You\u2019ve already put in the hard work of writing. Let us help with the layout so you can focus on what\u2019s next."],
  ["Your Book, Your Vision", "Your manuscript is unique, and your formatting should suit its content, style, and intended print format."],
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
  ["First-Time Authors", "You\u2019ve written your first book. Let\u2019s help you prepare it for print!"],
  ["Independent Authors", "Give your next release a polished, professional layout."],
  ["Business Owners", "Get manuals, guides, and business publications ready for printing."],
  ["Educators & Researchers", "Prepare educational material, research publications, and other written resources for print."],
  ["Experienced Writers", "Give your next manuscript the same professional attention as your last."],
];

const FAQ = [
  ["Do you actually print physical books?", "We prepare professionally formatted, print-ready files. You can submit the final files to your chosen printing company for physical printing."],
  ["What will I receive?", "You\u2019ll receive the agreed deliverables, such as a print-ready PDF prepared according to your project\u2019s requirements."],
  ["Can you format a manuscript I\u2019ve already written?", "Absolutely! If your manuscript is ready, we can help organize its layout and prepare the files for print."],
  ["Can you prepare files for my preferred book size?", "Yes, we can work with your intended dimensions and the specifications supplied by your printing provider."],
  ["What if I don\u2019t know my printer\u2019s requirements?", "No worries! We can help identify the information needed to prepare your files. Having your printer\u2019s specifications is useful because requirements can vary."],
  ["Is this service suitable for first-time authors?", "Of course! You don\u2019t need to know every technical detail. Tell us about your book, and we\u2019ll help you understand the file-preparation process."],
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
  { text: "Your Words Are Ready. Let\u2019s Get Them ", accent: false },
  { text: "Print-Ready!", accent: true },
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

export default function BookPrinting() {
  usePageMeta(
    "Book Printing Services | Firefox Publisher",
    "Professional book formatting, interior layout and print-ready PDF preparation, set up to your printer's specifications and ready to send to your chosen printing company."
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
            <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / Book Printing</p>
            <p className="bw-hero3__pill">Book printing services</p>
            <TypedTitle />
            <p className="lead">You&rsquo;ve dreamed it. You&rsquo;ve written it. Now, let&rsquo;s get it ready for the printing press!</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/#contact">Let&rsquo;s get my book print-ready!</Link>
              <Link className="btn btn--secondary" to="#bw-process">See how it works</Link>
            </div>
            <p className="bw-hero__note">Your story is written. Let&rsquo;s make it look the part!</p>
          </div>
          <div className="bw-hero3__art">
            <img src="/assets/hero-ebook-mockup.png" alt="A tablet showing a digital book floating above a printed edition" width="1370" height="1027" />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section" id="bw-intro">
        <div className="wrap bw-intro">
          <Reveal className="bw-intro__text">
            <p className="eyebrow">Print-ready file preparation</p>
            <h2>Your Manuscript Deserves More Than a Document Full of Words</h2>
            <p>It deserves a polished layout, beautifully arranged pages, and print-ready files that are prepared for the next big step.</p>
            <p><strong>At Firefox Publisher, we help transform your manuscript</strong> into professionally formatted files that are ready to send to your chosen printing company.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">Your story is written. Let&rsquo;s make it look the part!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s get my book print-ready!</Link>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section section--ice">
        <div className="wrap">
          <Head eyebrow="How we help" title="Your Manuscript Called. It Wants a Makeover!">
            <p>Great writing deserves a great presentation. We take care of the formatting details so your manuscript can go from &ldquo;just finished writing&rdquo; to &ldquo;ready for print.&rdquo;</p>
          </Head>
          <Reveal className="bw-gallery"><ImageGallery items={TYPES} /></Reveal>
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s make my manuscript print-ready!</Link></p>
        </div>
      </section>

      {/* Process */}
      <section id="bw-process" aria-labelledby="bw-process-title">
        <ScrollingFeatureShowcase
          slides={SLIDES}
          ctaText="Let's get my book print-ready!"
          ctaHref="/#contact"
          as={Link}
          hrefProp="to"
          ctaClassName="btn btn--primary"
          className="bw-story"
          perSlide={0.6}
          header={
            <div className="section__head section__head--center bw-head">
              <p className="eyebrow">How it works</p>
              <h2 id="bw-process-title">From &ldquo;I Wrote a Book!&rdquo; to &ldquo;It&rsquo;s Ready for Print!&rdquo;</h2>
              <p>Getting your files ready shouldn&rsquo;t feel like writing another book. Let&rsquo;s keep things simple.</p>
            </div>
          }
        />
      </section>

      {/* Why us */}
      <section className="section" id="bw-why">
        <div className="wrap">
          <Head eyebrow="Why Firefox Publisher?" title="Why Let Your Manuscript Go It Alone?">
            <p>Because your story deserves a little extra love!</p>
          </Head>
          <AppleCardCarousel cards={WHY_CARDS} label="Why Firefox Publisher" />
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s get my book print-ready!</Link></p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="section section--ice">
        <div className="wrap bw-who">
          <Reveal className="bw-who__intro">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2>Is Your Manuscript Ready for Its Close-Up?</h2>
            <p>Our book printing preparation services can help:</p>
            <p className="bw-who__see">Whatever you&rsquo;ve written, we&rsquo;re here to help get it ready for the next step.</p>
            <Link className="btn btn--primary" to="/#contact">Tell us about my book</Link>
          </Reveal>
          <Reveal className="bw-who__feed" delay={80}>
            <AnimatedList label="Who our book printing preparation services are for" delay={1500}>
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
          <h2>Your Story Deserves More Than a Word Document!</h2>
          <p>You&rsquo;ve done the writing. You&rsquo;ve built the story. Now let&rsquo;s give those pages the professional finish they deserve.</p>
          <p>Let Firefox Publisher help prepare your manuscript for the printing press, one beautifully formatted page at a time.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s get my book print-ready!</Link>
            <Link className="btn btn--ghost" to="/#contact">Have questions? Talk to our team</Link>
          </div>
          <p className="bw-final__tag">Firefox Publisher &mdash; Your words. Your vision. A book ready for its next chapter.</p>
          <p className="bw-final__tag"><em>Firefox Publisher provides print-ready file preparation, not physical book printing. Final files should meet the requirements of your selected printing provider.</em></p>
        </div>
      </section>
    </div>
  );
}
