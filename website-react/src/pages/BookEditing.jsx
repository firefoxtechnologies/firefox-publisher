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
  { badge: "Big picture", title: "Developmental Editing", description: "Let\u2019s fix the big picture! Is your story going in the right direction? Do your chapters flow well? Are your ideas easy to follow? We\u2019ll look at the bigger picture and help you make your story stronger, clearer, and more enjoyable.", image: "/assets/journey/discovery.jpg", alt: "Two people talking through the structure of a book" },
  { badge: "Sentences", title: "Line Editing", description: "Make every sentence shine! Sometimes a sentence just doesn\u2019t sound right, and that\u2019s okay. We\u2019ll smooth out awkward wording, improve sentence flow, and make your writing sound natural while keeping your unique style.", image: "/assets/writing/editing.jpg", alt: "A hand marking up a manuscript with a red pen" },
  { badge: "Mistakes", title: "Copyediting", description: "Goodbye, little mistakes! Missed a comma? Mixed up a word? Spotted three different spellings of the same name? We\u2019ll help catch grammar, spelling, punctuation, and consistency mistakes so your book reads more smoothly.", image: "/assets/services/book-editing.jpg", alt: "An editor checking a printed manuscript" },
  { badge: "Final check", title: "Proofreading", description: "One last check! Your book is almost ready to go. We\u2019ll look for leftover typos, punctuation mistakes, and small errors before your manuscript moves to the next stage.", image: "/assets/stages/edited.jpg", alt: "A final proofread of a manuscript with a red pen" },
];

const STEPS = [
  { title: "Send Us Your Book", description: "Share your manuscript, tell us what you\u2019ve written, and let us know what you\u2019d like to improve.", image: { url: "/assets/stages/draft.jpg", alt: "A finished draft on the desk next to a laptop" } },
  { title: "Let\u2019s Make a Plan", description: "We\u2019ll discuss your book and help you choose the editing service that fits your needs.", image: { url: "/assets/journey/discovery.jpg", alt: "Two people planning a project together" } },
  { title: "Time to Polish!", description: "We\u2019ll get to work on your manuscript, focusing on the improvements included in your chosen service.", image: { url: "/assets/services/book-editing.jpg", alt: "An editor polishing a manuscript" } },
  { title: "Take a Look", description: "Review the edits, share your feedback, and let us know if anything needs another look within the agreed project scope.", image: { url: "/assets/journey/editorial.jpg", alt: "A hand marking up a manuscript with a red pen" } },
  { title: "Ready for the Next Chapter!", description: "Your edited manuscript is ready for your next step toward publishing. Cue the happy dance! \u{1F483}", image: { url: "/assets/journey/design-production.jpg", alt: "A finished book ready for design and production" } },
].map((s) => ({ ...s, image: { ...s.image, width: 900, height: 900 } }));

const SLIDE_COLORS = [
  { bgColor: "#fff1e1", textColor: "#12294a" },
  { bgColor: "#eaf3fd", textColor: "#12294a" },
  { bgColor: "#ffe3c2", textColor: "#12294a" },
  { bgColor: "#dbe9f8", textColor: "#12294a" },
  { bgColor: "#12294a", textColor: "#ffffff", gridColor: "rgba(255,255,255,.1)" },
];
const SLIDES = STEPS.map((st, i) => ({ title: st.title, description: st.description, image: st.image.url, alt: st.image.alt, ...SLIDE_COLORS[i] }));

const WHY_CATEGORIES = ["Your voice", "Clearer words", "Right fit", "Clear process", "Confidence"];
const WHY_IMAGES = [
  ["your-ideas", "A notebook, pencil and coffee on a writer's desk"],
  ["no-skills", "A hand writing in a notebook"],
  ["your-voice", "A reader absorbed in a book"],
  ["process", "A notebook page with a checklist of steps"],
  ["help", "Two people reviewing a document together"],
];
const WHY = [
  ["Your Story Stays Yours", "We improve your writing without losing the personality that makes it special."],
  ["More Than Fixing Typos", "From smoother sentences to clearer chapters, we help make your words easier to understand."],
  ["Editing That Fits Your Book", "Writing a fantasy adventure? A business guide? A personal story? We\u2019ll discuss the right approach for your manuscript."],
  ["No Confusing Process", "We\u2019ll explain what your book needs, what we\u2019ll work on, and what happens next."],
  ["A Little Help Goes a Long Way", "Whether it\u2019s your first book or your tenth, we\u2019re here to help you feel more confident about your manuscript."],
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
  ["First-time authors", "Your first book is a big deal. Let\u2019s help you feel confident about it."],
  ["Story lovers", "Make your characters, chapters, and plot easier to follow."],
  ["Business owners", "Turn your knowledge into a clear, professional book."],
  ["Ebook creators", "Polish your manuscript before sharing it with readers."],
  ["Almost-finished authors", "You\u2019ve done most of the work. Let\u2019s take care of those final details!"],
];

const FAQ = [
  ["Do I really need my book edited?", "If you want your book to be clear, polished, and easy to read, editing is a great step before publishing."],
  ["Can you edit my ebook?", "Absolutely! We can help polish your ebook manuscript before you move on to formatting and publishing."],
  ["What if my book isn\u2019t finished yet?", "No problem. Tell us how much you\u2019ve written and what kind of help you\u2019re looking for. We\u2019ll discuss the options available for your project."],
  ["Will you change my writing style?", "Our goal is to improve your writing while keeping your voice and ideas intact."],
  ["How much does book editing cost?", "It depends on your book\u2019s length and the type of editing you need. Get in touch with your project details for a quote."],
  ["How long will editing take?", "Every book is different. We\u2019ll discuss an estimated timeline after learning more about your manuscript."],
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
  { text: "Finished Your Book? Let\u2019s ", accent: false },
  { text: "Make It Shine!", accent: true },
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

export default function BookEditing() {
  usePageMeta(
    "Book Editing Services | Firefox Publisher",
    "Developmental editing, line editing, copyediting and proofreading that polish your manuscript and keep your voice. Send us your book and we will plan the right edit."
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
            <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / Book Editing</p>
            <p className="bw-hero3__pill">Your story, polished</p>
            <TypedTitle />
            <p className="lead">Your story is written. Now let&rsquo;s give it that extra sparkle! &#10024;</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/#contact">Let&rsquo;s polish my book!</Link>
              <Link className="btn btn--secondary" to="#bw-process">See how it works</Link>
            </div>
            <p className="bw-hero__note">Not sure what your book needs? Don&rsquo;t worry. We&rsquo;ve got you!</p>
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
            <p className="eyebrow">Book editing services</p>
            <h2>You&rsquo;ve Finally Reached The End!</h2>
            <p>You&rsquo;ve spent hours writing, rewriting, and bringing your ideas to life. You&rsquo;ve finally reached The End! And honestly? That&rsquo;s a big deal. &#127881;</p>
            <p>But before your book meets the world, let&rsquo;s make sure every page is ready to impress.</p>
            <p><strong>At Firefox Publisher, we help polish your book</strong> by fixing mistakes, improving sentences, and making your writing easier and more enjoyable to read.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">You bring the story. We&rsquo;ll help make every word count!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s polish my book!</Link>
          </Reveal>
        </div>
      </section>

      {/* Types of editing */}
      <section className="section section--ice">
        <div className="wrap">
          <Head eyebrow="Our editing services" title="Your Book Deserves a Little Editing Magic!">
            <p>Every book needs a final touch. Whether it&rsquo;s fixing tiny mistakes or giving your story a makeover, we&rsquo;ve got an editing service for you.</p>
          </Head>
          <Reveal className="bw-gallery"><ImageGallery items={TYPES} /></Reveal>
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Find my perfect editing service</Link></p>
        </div>
      </section>

      {/* Process */}
      <section id="bw-process" aria-labelledby="bw-process-title">
        <ScrollingFeatureShowcase
          slides={SLIDES}
          ctaText="Get my book edited"
          ctaHref="/#contact"
          as={Link}
          hrefProp="to"
          ctaClassName="btn btn--primary"
          className="bw-story"
          perSlide={0.6}
          header={
            <div className="section__head section__head--center bw-head">
              <p className="eyebrow">How it works</p>
              <h2 id="bw-process-title">From &ldquo;It&rsquo;s Finished!&rdquo; to &ldquo;It&rsquo;s Ready!&rdquo;</h2>
              <p>Getting your book edited doesn&rsquo;t have to be complicated. Here&rsquo;s how easy we make it.</p>
            </div>
          }
        />
      </section>

      {/* Why us */}
      <section className="section" id="bw-why">
        <div className="wrap">
          <Head eyebrow="Why Firefox Publisher?" title="Because your book deserves more than a quick spell-check!" />
          <AppleCardCarousel cards={WHY_CARDS} label="Why Firefox Publisher" />
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s work on my book!</Link></p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="section section--ice">
        <div className="wrap bw-who">
          <Reveal className="bw-who__intro">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2>Who Needs a Book Editor?</h2>
            <p>If you&rsquo;ve written a book, this one&rsquo;s for you!</p>
            <p className="bw-who__see">Basically, if you&rsquo;ve got pages, we&rsquo;ve got ways to help.</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s polish those pages!</Link>
          </Reveal>
          <Reveal className="bw-who__feed" delay={80}>
            <AnimatedList label="Who our book editing services are for" delay={1500}>
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

      {/* Editing or proofreading */}
      <SplitHero
        className="story-cta bw-start"
        title={<>Editing or Proofreading? <em>What&rsquo;s the difference?</em></>}
        description={
          <>
            <p>Think of editing as giving your book a makeover and proofreading as its final mirror check.</p>
            <p><strong>Editing</strong> improves your writing. It can help make sentences clearer, ideas stronger, and chapters easier to follow.</p>
            <p><strong>Proofreading</strong> catches those last little mistakes, like typos, spelling slips, and punctuation errors.</p>
            <strong>Not sure which one you need? Just ask us! We&rsquo;ll help you figure it out.</strong>
          </>
        }
        buttonText="Help me choose"
        buttonLink="/#contact"
        as={Link}
        hrefProp="to"
        buttonClassName="btn btn--primary"
        imageUrl1="/assets/covers/the-last-lighthouse.svg"
        imageUrl2="/assets/covers/midnight-orchard.svg"
        imageAlt1="Cover of The Last Lighthouse, a sample book"
        imageAlt2="Cover of Midnight Orchard, a sample book"
      />

      {/* FAQ */}
      <section className="section" id="bw-faq">
        <div className="wrap bw-faq">
          <Head eyebrow="FAQ" title="A Few Questions Before We Get Started" />
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
          <h2>Your Book Is Almost There. Let&rsquo;s Finish Strong!</h2>
          <p>You&rsquo;ve created the story. You&rsquo;ve put in the hours. You&rsquo;ve made it to the final page. Now let&rsquo;s give your words the attention they deserve!</p>
          <p>From fixing little mistakes to smoothing out entire chapters, Firefox Publisher is here to help you get your manuscript ready for its next big adventure. Ready to give your book some love? Let&rsquo;s do this!</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s make my book shine!</Link>
            <Link className="btn btn--ghost" to="/#contact">Have questions? Talk to our team</Link>
          </div>
          <p className="bw-final__tag">Firefox Publisher &mdash; Your Story, Polished to Shine.</p>
        </div>
      </section>
    </div>
  );
}
