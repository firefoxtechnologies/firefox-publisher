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
  { badge: "Fiction", title: "Fiction Writing", description: "Got a love story, a fantasy world, or a mystery that keeps everyone guessing? Let's turn your imagination into a story readers won't want to put down.", image: "/assets/writing/fiction.jpg", alt: "A person reading a novel in bed" },
  { badge: "Nonfiction", title: "Nonfiction Book Writing", description: "Have knowledge worth sharing? Let's turn your experience, ideas and expertise into a book people can learn from.", image: "/assets/writing/nonfiction.jpg", alt: "A stack of nonfiction books" },
  { badge: "Ghostwriting", title: "Ghostwriting", description: "You bring the ideas. We'll help with the words. Share your thoughts, notes or voice recordings, and let's work together to turn them into a book.", image: "/assets/writing/ghostwriting.jpg", alt: "A typewriter with a blank page" },
  { badge: "Memoir", title: "Memoir & Biography Writing", description: "Your life has a story. From unforgettable adventures to lessons learned the hard way, let's put those memories into words worth keeping.", image: "/assets/writing/memoir.jpg", alt: "Old photographs spread on a table" },
  { badge: "Children's", title: "Children's Book Writing", description: "Big adventures for little imaginations! We help bring fun characters, exciting adventures and meaningful lessons to life through children's stories.", image: "/assets/writing/childrens.jpg", alt: "Two children looking at an illustrated storybook" },
  { badge: "Editing", title: "Book Editing", description: "Already written a book? High five! Let's polish those pages, smooth out the rough spots, and get your manuscript looking its best.", image: "/assets/writing/editing.jpg", alt: "A hand marking up a manuscript with a red pen" },
];

const STEPS = [
  { title: "Spill the Ideas", description: "Tell us everything! The story in your head, the message you want to share, or the book you've been dreaming about. Messy notes are welcome.", image: { url: "/assets/journey/discovery.jpg", alt: "Two people sketching out a book idea together" } },
  { title: "Make a Game Plan", description: "We'll help organize your ideas, plan your chapters, and figure out the best way to bring your book together.", image: { url: "/assets/services/web-design-seo.jpg", alt: "Hands planning chapters with notes beside a laptop" } },
  { title: "Let's Get Writing", description: "Time to turn those ideas into actual pages! We'll work on your manuscript while keeping your vision and voice at the heart of the project.", image: { url: "/assets/services/book-writing.jpg", alt: "A writer typing a manuscript on a laptop" } },
  { title: "Polish, Perfect, Repeat", description: "Review your draft, share your thoughts, and help us fine-tune the details until the manuscript feels right for you.", image: { url: "/assets/journey/editorial.jpg", alt: "A hand marking up a manuscript with a red pen" } },
  { title: "Hello, Future Author!", description: "Your manuscript is taking shape, and you're one step closer to your author dreams. Ready to explore the next stage? Let's talk about what comes after writing.", image: { url: "/assets/journey/growth.jpg", alt: "A small plant growing on a pile of books" } },
].map((s) => ({ ...s, image: { ...s.image, width: 900, height: 900 } }));

const SLIDE_COLORS = [
  { bgColor: "#fff1e1", textColor: "#12294a" },
  { bgColor: "#eaf3fd", textColor: "#12294a" },
  { bgColor: "#ffe3c2", textColor: "#12294a" },
  { bgColor: "#dbe9f8", textColor: "#12294a" },
  { bgColor: "#12294a", textColor: "#ffffff", gridColor: "rgba(255,255,255,.1)" },
];
const SLIDES = STEPS.map((st, i) => ({ title: st.title, description: st.description, image: st.image.url, alt: st.image.alt, ...SLIDE_COLORS[i] }));

const WHY_CATEGORIES = ["Your vision", "Simple start", "Your voice", "Clear steps", "Support"];
const WHY_IMAGES = [
  ["your-ideas", "A notebook, pencil and coffee on a writer's desk"],
  ["no-skills", "A hand writing in a notebook"],
  ["your-voice", "A reader absorbed in a book"],
  ["process", "A notebook page with a checklist of steps"],
  ["help", "Two people reviewing a document together"],
];
const WHY = [
  ["Your Ideas, Your Way", "It's your book, your vision, and your voice. We're here to help bring it all together."],
  ["No Fancy Writing Skills Needed", "You don't need to be a professional writer to get started. That's what we're here for!"],
  ["Words That Sound Like You", "Your book should feel personal, natural, and true to your ideas. No boring, cookie-cutter writing here."],
  ["A Process You Can Follow", "We'll break the journey into manageable steps so you know what comes next."],
  ["Help When You Need It", "Starting from scratch or stuck halfway through? We'll help you find a way forward."],
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
  ["The Dreamer", "You've had a book idea for years. Let's finally do something about it!"],
  ["The Business Owner", "You've learned a thing or two. Now it's time to share your knowledge."],
  ["The Storyteller", "Your imagination is overflowing with characters, plots, and plot twists."],
  ["The Life Experienced", "You've lived a story worth telling, and you're ready to share it."],
  ["The Almost-Author", "You've already started writing but could use a little help crossing the finish line."],
];

const FAQ = [
  ["Can you write my book if I only have an idea?", "Absolutely! You don't need a complete manuscript or a perfect plan. Just tell us what you're thinking, and we'll help you figure out the next steps."],
  ["Do I need to be a good writer?", "Nope! You need an idea, a story, or something worth sharing. We'll help you with the writing."],
  ["What if I've already started my book?", "Great! We can discuss your existing manuscript and the kind of help you need, whether it's developing chapters or polishing your writing."],
  ["What types of books can you write?", "We work with different types of projects, including fiction, nonfiction, children's books, memoirs, and biographies. Tell us what you have in mind!"],
  ["Can you write my book for me?", "Yes, our ghostwriting services can help turn your ideas into a complete manuscript. We'll discuss your vision, requirements, and the writing process before getting started."],
  ["How long will it take to write my book?", "Every book is different. The timeline depends on its length, complexity, research needs, and how quickly we can review drafts together."],
  ["Can you help after the book is written?", "We can discuss editing, manuscript preparation, and available publishing-related services to help you decide on your next step."],
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
  { text: "Got a Story? Let\u2019s Turn It Into ", accent: false },
  { text: "a Book!", accent: true },
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

export default function BookWriting() {
  usePageMeta(
    "Book Writing Services & Ghostwriting | Firefox Publisher",
    "Turn your idea into a book: fiction, nonfiction, ghostwriting, memoir and children's books, plus editing. Hoboken, NJ writers serving authors across the USA."
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="bw-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ServiceSchema name="Book Writing Services" path="book-writing" description="Turn your idea into a book. Fiction, nonfiction, ghostwriting, memoir, children's books and editing, with a simple process and help whenever you need it." />

      {/* Hero */}
      <section className="bw-hero3" aria-labelledby="bw-hero-title">
        <div className="bw-hero3__inner">
          <div className="bw-hero3__text">
            <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / Book Writing</p>
            <p className="bw-hero3__pill">Ebook Writing &amp; Ghostwriting Services</p>
            <TypedTitle />
            <p className="lead">Big ideas. Brilliant stories. We turn them into a finished book, step by step, without the homework.</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/#contact">Let&rsquo;s write your book!</Link>
              <Link className="btn btn--secondary" to="#bw-process">See how it works</Link>
            </div>
            <p className="bw-hero__note">Not sure where to start? No worries. We&rsquo;ll figure it out together.</p>
          </div>
          <div className="bw-hero3__art">
            <img src="/assets/services/book-writing.jpg" alt="A writer typing a manuscript on a laptop" width="900" height="900" />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section" id="bw-intro">
        <div className="wrap bw-intro">
          <Reveal className="bw-intro__text">
            <p className="eyebrow">Book writing services</p>
            <h2>Turn Your Ideas Into a Beautifully Written Book</h2>
            <p>You&rsquo;ve got a story to tell, an idea to share, or a book you&rsquo;ve been dreaming about for years. There&rsquo;s just one tiny problem&hellip; where do you start?</p>
            <p><strong>That&rsquo;s where Firefox Publisher comes in!</strong></p>
            <p>We help turn your ideas into beautifully written books, without making the writing process feel like homework. Whether you&rsquo;re dreaming of a thrilling novel, a business book, or a story for little readers, we&rsquo;re here to help you put it all into words.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">Your idea deserves more than a spot in your notes app. Let&rsquo;s make it a book!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s write your book!</Link>
          </Reveal>
        </div>
      </section>

      {/* Types of writing */}
      <section className="section section--ice">
        <div className="wrap">
          <Head eyebrow="What we write" title="You've Got the Idea. We've Got the Words!">
            <p>Every book starts somewhere. A random thought, a wild imagination, or that little voice saying, &ldquo;I should write a book someday!&rdquo; Well, someday can start today.</p>
          </Head>
          <Reveal className="bw-gallery"><ImageGallery items={TYPES} /></Reveal>
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Find your perfect writing service</Link></p>
        </div>
      </section>

      {/* Process: heading and the scroll story share one pinned section */}
      <section id="bw-process" aria-labelledby="bw-process-title">
        <ScrollingFeatureShowcase
          slides={SLIDES}
          ctaText="Start my book journey"
          ctaHref="/#contact"
          as={Link}
          hrefProp="to"
          ctaClassName="btn btn--primary"
          className="bw-story"
          perSlide={0.6}
          header={
            <div className="section__head section__head--center bw-head">
              <p className="eyebrow">How it works</p>
              <h2 id="bw-process-title">From &ldquo;I Have an Idea&rdquo; to &ldquo;I Wrote a Book!&rdquo;</h2>
              <p>Writing a book might sound like a huge task. But hey, every big adventure starts with one small step. Here&rsquo;s how we&rsquo;ll make yours happen.</p>
            </div>
          }
        />
      </section>

      {/* Why us */}
      <section className="section" id="bw-why">
        <div className="wrap">
          <Head eyebrow="Why Firefox Publisher?" title="Writing a book should feel exciting">
            <p>Because writing a book should feel exciting, not like wrestling with a thousand blank pages.</p>
          </Head>
          <AppleCardCarousel cards={WHY_CARDS} label="Why Firefox Publisher" />
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s make something amazing</Link></p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section band bw-final">
        <div className="wrap bw-final__in">
          <h2>Ready to Make Your Book Dreams a Reality?</h2>
          <p>That story you&rsquo;ve been thinking about? Those ideas you&rsquo;ve been saving for later? Let&rsquo;s give them a few chapters, a little personality, and a chance to be read!</p>
          <p>Whether you&rsquo;re starting with a blank page or a nearly finished manuscript, Firefox Publisher is ready to help you take the next step. Your future readers are out there. Let&rsquo;s give them something to read!</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s write that book!</Link>
            <Link className="btn btn--ghost" to="/#contact">Talk to our team</Link>
          </div>
          <p className="bw-final__tag">Firefox Publisher &mdash; Your Ideas. Our Words. Your Book.</p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="section section--ice">
        <div className="wrap bw-who">
          <Reveal className="bw-who__intro">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2>Who Said You Can&rsquo;t Be an Author?</h2>
            <p>Spoiler alert: you don&rsquo;t need to be a famous writer to write a book! Our book writing services are for:</p>
            <p className="bw-who__see">See yourself here? We thought you might!</p>
            <Link className="btn btn--primary" to="/#contact">Tell us your book idea</Link>
          </Reveal>
          <Reveal className="bw-who__feed" delay={80}>
            <AnimatedList label="Who our book writing services are for" delay={1500}>
              {WHO.map(([t, p], i) => (
                <figure className="bw-who__card" key={t}>
                  <span className={"bw-who__icon bw-who__icon--" + (i % 3)}>{t.replace("The ", "").charAt(0)}</span>
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

      {/* Start imperfectly */}
      <SplitHero
        className="story-cta bw-start"
        title={<>Your Book Doesn&rsquo;t Need to Start Perfectly. <em>It just needs to start.</em></>}
        description={
          <>
            <p>Maybe you&rsquo;ve written three chapters. Maybe you&rsquo;ve got a folder full of notes. Or maybe your entire book exists in your head while you&rsquo;re trying to fall asleep.</p>
            <p>We&rsquo;ve seen enough blank pages to know that every great book begins somewhere. At Firefox Publisher, we&rsquo;ll help you turn those scattered thoughts into a story with structure, purpose, and personality.</p>
            <strong>You bring the spark. Let&rsquo;s build the story.</strong>
          </>
        }
        buttonText="Let's build the story"
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
          <Head eyebrow="FAQ" title="Frequently Asked Questions" />
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
    </div>
  );
}
