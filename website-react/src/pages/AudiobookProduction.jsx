import { Link } from "react-router-dom";
import { ScrollingFeatureShowcase } from "../components/ui/interactive-scrolling-story-component";
import { ImageGallery } from "../components/ui/image-gallery";
import { AppleCardCarousel } from "../components/ui/carousel-08";
import { AnimatedList } from "../components/ui/animated-list";
import { Reveal, stagger } from "../components/ui.jsx";
import { useEffect, useState } from "react";
import ServiceSchema from "../components/Schema.jsx";
import AudioSample from "../components/AudioSample.jsx";
import { AUDIOBOOKS, audioUrl, coverUrl, isoDuration } from "../data/audiobooks.js";
import "../styles/audio-sample.css";
import { usePageMeta, prefersReducedMotion } from "../hooks.js";

const TYPES = [
  { badge: "Narration", title: "Audiobook Narration", description: "Let your story speak! Every story has a voice. We help bring yours to life through narration that suits your content, tone, and intended audience, making your words engaging to listen to.", image: "/assets/services/audiobook-production.jpg", alt: "Studio headphones and a microphone ready for narration" },
  { badge: "Voice", title: "Voice Selection", description: "Find the perfect match. Warm and comforting? Clear and professional? Full of character? We help identify a suitable narration style for your ebook so the listening experience feels right for your content.", image: "/assets/illustrations/audiobook-headphones.svg", alt: "An illustration of headphones resting on a book" },
  { badge: "Recording", title: "Audio Recording", description: "Every word matters. Great audio starts with careful recording. We help turn your written content into spoken audio, with attention to clarity, consistency, and an enjoyable listening experience.", image: "/assets/journey/design-production.jpg", alt: "A production desk during a recording session" },
  { badge: "Editing", title: "Audio Editing", description: "Goodbye, unwanted pauses! Fumbling words and distracting background noise can take listeners out of the moment. Audio editing helps create a smoother, cleaner listening experience.", image: "/assets/journey/editorial.jpg", alt: "Careful editing and review of a production" },
  { badge: "Enhancement", title: "Audio Enhancement", description: "Give every word room to shine. Consistent volume and clear sound help make an audiobook easier to enjoy. We help refine audio quality according to your project\u2019s production requirements.", image: "/assets/services/video-trailers.jpg", alt: "A producer refining sound quality at a desk" },
  { badge: "Delivery", title: "Final Audiobook Files", description: "Ready for listening! Receive your completed audio files in the agreed format, prepared for your intended distribution platform or publishing workflow.", image: "/assets/illustrations/ereader-stack.svg", alt: "An illustration of an e-reader stacked on books" },
];

const STEPS = [
  { title: "Bring Us Your Ebook", description: "Share your manuscript and tell us about your audience, preferred narration style, and audiobook goals.", image: { url: "/assets/journey/discovery.jpg", alt: "Two people talking through an audiobook project" } },
  { title: "Find Your Sound", description: "We discuss the voice, tone, and production approach that best suit your content.", image: { url: "/assets/services/audiobook-production.jpg", alt: "Headphones and a microphone for choosing a narration style" } },
  { title: "Let the Recording Begin", description: "Your written content moves into the audio production process, including the agreed narration, recording, editing, and sound refinement.", image: { url: "/assets/journey/design-production.jpg", alt: "A recording session in progress" } },
  { title: "Get Ready to Press Play", description: "Receive your completed audiobook files in the agreed format, ready for your next publishing step.", image: { url: "/assets/journey/growth.jpg", alt: "A small plant growing on a pile of books" } },
].map((s) => ({ ...s, image: { ...s.image, width: 900, height: 900 } }));

const SLIDE_COLORS = [
  { bgColor: "#fff1e1", textColor: "#12294a" },
  { bgColor: "#eaf3fd", textColor: "#12294a" },
  { bgColor: "#ffe3c2", textColor: "#12294a" },
  { bgColor: "#12294a", textColor: "#ffffff", gridColor: "rgba(255,255,255,.1)" },
];
const SLIDES = STEPS.map((st, i) => ({ title: st.title, description: st.description, image: st.image.url, alt: st.image.alt, ...SLIDE_COLORS[i] }));

const WHY_CATEGORIES = ["Listeners", "Depth", "Portable", "Smooth", "Formats"];
const WHY_IMAGES = [
  ["your-voice", "A reader absorbed in a book"],
  ["your-ideas", "A notebook, pencil and coffee on a writer's desk"],
  ["no-skills", "A hand writing in a notebook"],
  ["process", "A notebook page with a checklist of steps"],
  ["help", "Two people reviewing a document together"],
];
const WHY = [
  ["Reach Listeners Who Love to Listen", "Make your content accessible to audiences who prefer audio while commuting, exercising, relaxing, or going about their day."],
  ["Give Your Story a New Dimension", "A suitable narration style can add warmth, personality, and emotion to your written content."],
  ["Make Your Knowledge Easier to Take Along", "For educational ebooks, guides, and nonfiction content, audio can offer another convenient way for audiences to engage with your ideas."],
  ["Enjoy a Smoother Listening Experience", "Careful editing and audio refinement help make your audiobook clearer, more consistent, and more enjoyable to follow."],
  ["Give Your Content Another Format", "An audiobook can complement your written ebook, giving your audience another way to experience the same content."],
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
  ["Fiction Authors", "Let listeners immerse themselves in your characters, stories, and imaginative worlds."],
  ["Nonfiction Writers", "Turn your knowledge, insights, and practical advice into audio content."],
  ["Self-Published Authors", "Explore another format for your existing ebook."],
  ["Educators and Trainers", "Make suitable learning materials available in an audio format."],
  ["Business Professionals", "Turn digital guides and informational content into convenient listening experiences."],
  ["First-Time Authors", "Take the next step toward creating your first audiobook."],
];

const FAQ = [
  ["Can I hear an audiobook sample before I hire you?", "Yes. Press play on any of the audiobook samples on this page to hear the narration, pacing and sound quality. Then tell us about your book and we will discuss narration, recording and editing for it."],
  ["What is audiobook production?", "Audiobook production is the process of transforming written content into audio, which can include narration, recording, editing, sound refinement, and preparing the final audio files."],
  ["Can you turn my existing ebook into an audiobook?", "Yes! If you already have a completed ebook or manuscript, we can discuss converting its content into an audiobook."],
  ["Can I choose the narration style?", "You can share your preferences for tone, delivery, and voice style. We\u2019ll discuss suitable options for your content and project requirements."],
  ["Do you provide human or AI narration?", "Available narration options can depend on the project and production arrangements. We can discuss the approach that best suits your content and goals before production begins."],
  ["What audio format will I receive?", "The final format will depend on your agreed requirements and intended distribution platform. We can discuss the specifications before production starts."],
  ["Can I publish my audiobook online?", "The completed files can be prepared for your intended publishing workflow. Platform-specific technical requirements and distribution arrangements should be confirmed before production."],
  ["Can you guarantee my audiobook will be accepted by every platform?", "Different platforms have different technical and content requirements, so universal acceptance cannot be guaranteed. We can work toward the specifications you provide for your intended platform."],
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
  { text: "Your Words Have a Voice. Let\u2019s Help the World ", accent: false },
  { text: "Hear Them!", accent: true },
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

export default function AudiobookProduction() {
  usePageMeta(
    "Audiobook Production Services & Samples | Firefox Publisher",
    "Listen to audiobook samples, then turn your book into audio: narration, recording, editing and final files. Hoboken, NJ team serving authors across the USA."
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="bw-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ServiceSchema name="Audiobook Production Services" path="audiobook-production" description="Turn your ebook into an audiobook: narration, voice selection, recording, editing, audio enhancement and final files prepared for your chosen platform." />

      {/* Hero */}
      <section className="bw-hero3" aria-labelledby="bw-hero-title">
        <div className="bw-hero3__inner">
          <div className="bw-hero3__text">
            <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / Audiobook Production</p>
            <p className="bw-hero3__pill">Audiobook Production Services</p>
            <TypedTitle />
            <p className="lead">Some people love reading with their eyes. Others would rather press play, put on their headphones, and let a story take them somewhere new.</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/#contact">Let&rsquo;s turn my ebook into audio!</Link>
              <Link className="btn btn--secondary" to="/audiobooks">Listen to samples</Link>
            </div>
            <p className="bw-hero__note">Your story is written. Its next chapter could be heard!</p>
          </div>
          <div className="bw-hero3__art">
            <img src="/assets/services/audiobook-production.jpg" alt="Studio headphones and a microphone for narration" width="900" height="900" />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section" id="bw-intro">
        <div className="wrap bw-intro">
          <Reveal className="bw-intro__text">
            <p className="eyebrow">Audiobook production services</p>
            <h2>From Page-Turner to Play-Button Favorite!</h2>
            <p>Why limit your ebook to the page when it could become an experience people can listen to?</p>
            <p><strong>At Firefox Publisher, we help transform written content into engaging audiobooks,</strong> giving your stories, ideas, and knowledge a voice of their own. From narration to polished audio files, we help bring your words to life in a whole new way.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">Your story is written. Its next chapter could be heard!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s turn my ebook into audio!</Link>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section section--ice">
        <div className="wrap">
          <Head eyebrow="How we help" title="Here&rsquo;s How We Bring Your Words to Life">
            <p>Your words deserve to be heard, too! Whether you&rsquo;ve written a captivating story, an inspiring guide, or a knowledge-packed ebook, audiobook production can help you connect with readers who prefer listening.</p>
          </Head>
          <Reveal className="bw-gallery"><ImageGallery items={TYPES} /></Reveal>
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s give my words a voice!</Link></p>
        </div>
      </section>

      {/* Process */}
      <section id="bw-process" aria-labelledby="bw-process-title">
        <ScrollingFeatureShowcase
          slides={SLIDES}
          ctaText="Let's give my words a voice!"
          ctaHref="/#contact"
          as={Link}
          hrefProp="to"
          ctaClassName="btn btn--primary"
          className="bw-story"
          perSlide={0.6}
          header={
            <div className="section__head section__head--center bw-head">
              <p className="eyebrow">How it works</p>
              <h2 id="bw-process-title">From Written Words to &ldquo;Just One More Chapter!&rdquo;</h2>
              <p>Turning an ebook into an audiobook should feel exciting, not overwhelming. Let&rsquo;s make the process simple.</p>
            </div>
          }
        />
      </section>

      {/* Why us */}
      <section className="section" id="bw-why">
        <div className="wrap">
          <Head eyebrow="Why Firefox Publisher?" title="Why Let Your Ebook Stay Silent?">
            <p>Your words. A fresh listening experience. A whole new way to connect with your audience.</p>
          </Head>
          <AppleCardCarousel cards={WHY_CARDS} label="Why Firefox Publisher" />
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s produce my audiobook!</Link></p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="section section--ice">
        <div className="wrap bw-who">
          <Reveal className="bw-who__intro">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2>Is Your Ebook Ready for Its Audio Debut?</h2>
            <p>Whether you&rsquo;re a storyteller, educator, or expert with something valuable to share, your words could find a new audience through audio.</p>
            <p className="bw-who__see">Whatever your ebook is about, let&rsquo;s explore how it could sound.</p>
            <Link className="btn btn--primary" to="/#contact">Tell us about my ebook</Link>
          </Reveal>
          <Reveal className="bw-who__feed" delay={80}>
            <AnimatedList label="Who our audiobook production services are for" delay={1500}>
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

      {/* Sample teaser */}
      <section className="section section--ice" id="audio-sample">
        <div className="wrap">
          <Head eyebrow="Listen" title="Hear the Audiobooks We&rsquo;ve Worked On" />
          <div className="as-strip">
            {AUDIOBOOKS.map((b) => (
              <Link key={b.slug} to={`/audiobooks#audio-${b.slug}`} aria-label={`Listen to ${b.title} by ${b.by}`}>
                <img src={coverUrl(b)} alt="" width={b.w} height={b.h} loading="lazy" decoding="async" />
              </Link>
            ))}
          </div>
          <p className="center bw-cta"><Link className="btn btn--primary" to="/audiobooks">Listen to the audiobook samples</Link></p>
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
          <h2>Your Story Has a Voice. Let&rsquo;s Find It!</h2>
          <p>You&rsquo;ve written something worth sharing. Now imagine someone listening to your words on their morning walk, during a long drive, or while winding down at the end of the day.</p>
          <p>At Firefox Publisher, we help transform written ebooks into engaging audio experiences, so your content has another way to reach people.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s produce my audiobook!</Link>
            <Link className="btn btn--ghost" to="/#contact">Have questions? Talk to our team</Link>
          </div>
          <p className="bw-final__tag">Your words deserve to be heard. Let&rsquo;s press play!</p>
        </div>
      </section>
    </div>
  );
}
