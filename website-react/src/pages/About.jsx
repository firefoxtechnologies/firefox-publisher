import { Link } from "react-router-dom";
import { ImageGallery } from "../components/ui/image-gallery";
import { AppleCardCarousel } from "../components/ui/carousel-08";
import { AnimatedList } from "../components/ui/animated-list";
import { Reveal, stagger } from "../components/ui.jsx";
import { useEffect, useState } from "react";
import { usePageMeta, prefersReducedMotion } from "../hooks.js";
import { PageSchema } from "../components/Schema.jsx";

const SERVICES = [
  { badge: "Writing", title: "Writing & Editing", description: "Have a brilliant idea but need help turning it into a polished manuscript? We support authors with writing, ghostwriting, and editing services to help refine their work.", image: "/assets/services/book-writing.jpg", alt: "A writer typing a manuscript on a laptop" },
  { badge: "Formatting", title: "Formatting & Print-Ready Files", description: "From clean ebook layouts to professionally prepared files for printing, we help make sure your content is presented with care and attention to detail.", image: "/assets/stages/designed.jpg", alt: "An open book with a cleanly laid-out photo spread" },
  { badge: "Branding", title: "Author Branding & Illustrations", description: "Your name deserves recognition, and your ideas deserve personality. We help create author branding and illustrations that give your work a distinctive visual identity.", image: "/assets/services/author-branding.jpg", alt: "An author at their desk building a personal brand" },
  { badge: "Audio", title: "Audiobook Production", description: "Some readers prefer to listen. We help transform written content into an audio experience, giving your words another way to reach an audience.", image: "/assets/services/audiobook-production.jpg", alt: "Studio headphones and a microphone" },
  { badge: "Marketing", title: "Book Marketing & Video Trailers", description: "Publishing is only part of the journey. We help create promotional content, marketing strategies, and book video trailers that introduce your work to potential readers.", image: "/assets/services/book-marketing.jpg", alt: "Promoting a book to readers online" },
];

const WHY_CATEGORIES = ["Creative", "Every stage", "Your vision", "Details", "Passion"];
const WHY_IMAGES = [
  ["your-ideas", "A notebook, pencil and coffee on a writer's desk"],
  ["process", "A notebook page with a checklist of steps"],
  ["your-voice", "A reader absorbed in a book"],
  ["no-skills", "A hand writing in a notebook"],
  ["help", "Two people reviewing a document together"],
];
const WHY = [
  ["Creative Thinking, Meet Practical Support", "We bring creativity and attention to detail together to help turn your ideas into professional, reader-ready work."],
  ["Support for Different Stages", "From manuscript development to promotion, you can explore services that fit the stage your project is in."],
  ["Your Vision Comes First", "Your story, goals, audience, and creative direction help shape the way we approach your project."],
  ["Details Matter Here", "Formatting, visual consistency, audio quality, and promotional presentation all contribute to how your work is experienced. We take these details seriously."],
  ["We\u2019re Excited About What You\u2019re Creating", "Every project begins with an idea. We love helping authors explore what\u2019s possible and work toward bringing that idea to life."],
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
  ["First-Time Authors", "Ready to turn an idea into their first ebook."],
  ["Independent Writers", "Looking for creative support throughout the publishing journey."],
  ["Established Authors", "Preparing their next release or refreshing their existing work."],
  ["Experts & Educators", "Sharing their knowledge through digital books and guides."],
  ["Business Professionals", "Turning their experience and expertise into valuable written content."],
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
  { text: "Big Ideas. Brilliant Stories. Let\u2019s ", accent: false },
  { text: "Bring Them to Life!", accent: true },
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

export default function About() {
  usePageMeta(
    "About Firefox Publisher | Firefox Publisher",
    "Firefox Publisher is a creative partner for ebook authors: manuscript support, formatting, branding, audiobooks and marketing under one roof."
  );

  return (
    <div className="bw-page">
      {/* Hero */}
      <section className="bw-hero3" aria-labelledby="bw-hero-title">
        <div className="bw-hero3__inner">
          <div className="bw-hero3__text">
            <p className="crumbs"><Link to="/">Home</Link> / About</p>
            <p className="bw-hero3__pill">About Firefox Publisher</p>
            <TypedTitle />
            <p className="lead">Every great book begins with an idea. Maybe it&rsquo;s a story that won&rsquo;t leave your mind, knowledge you&rsquo;re excited to share, or a dream you&rsquo;ve been waiting to put into words.</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/#contact">Let&rsquo;s bring your book to life!</Link>
              <Link className="btn btn--secondary" to="#about-services">What we do</Link>
            </div>
            <p className="bw-hero__note">Your ideas deserve more than a place in your drafts folder.</p>
          </div>
          <div className="bw-hero3__art">
            <img src="/assets/hero-ebook-mockup.png" alt="A tablet showing a digital book floating above a printed edition" width="1370" height="1027" />
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="section" id="bw-intro">
        <div className="wrap bw-intro">
          <Reveal className="bw-intro__text">
            <p className="eyebrow">Welcome</p>
            <h2>Turning an Idea Into a Book People Remember</h2>
            <p>But turning that idea into a book people can discover, enjoy, and remember? That&rsquo;s where things get exciting!</p>
            <p><strong>Welcome to Firefox Publisher: your creative partner for bringing ebook ideas to life.</strong> We help authors move from manuscript to market with creative publishing support, professional presentation, and promotional services designed to give their work the attention it deserves.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">Your ideas deserve their moment in the spotlight!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s bring your book to life!</Link>
          </Reveal>
        </div>
      </section>

      {/* The story behind every story */}
      <section className="section section--ice">
        <div className="wrap bw-intro">
          <Reveal className="bw-intro__text">
            <p className="eyebrow">Our approach</p>
            <h2>We&rsquo;re Here for the Story Behind Every Story</h2>
            <p>Writing a book is a big deal. You&rsquo;ve got ideas to develop, pages to polish, decisions to make, and a whole world of possibilities ahead. We believe the journey should feel exciting, not overwhelming.</p>
            <p>At Firefox Publisher, we help authors navigate different stages of their ebook journey, from shaping and refining their manuscripts to preparing professional files and creating engaging ways to promote their work.</p>
            <p>Whether you&rsquo;re publishing your very first ebook or adding another title to your collection, we&rsquo;re here to help you take the next step with confidence.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">You bring the ideas. Let&rsquo;s work on making them shine!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s get started!</Link>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section" id="about-services">
        <div className="wrap">
          <Head eyebrow="What we do" title="More Than Words on a Page">
            <p>A great ebook is about more than what&rsquo;s written inside. It&rsquo;s also about how it looks, sounds, feels, and reaches its audience. That&rsquo;s why our services cover different parts of the author journey.</p>
          </Head>
          <Reveal className="bw-gallery"><ImageGallery items={SERVICES} /></Reveal>
          <p className="center bw-cta">One creative partner. Multiple ways to bring your ebook vision to life.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="section section--ice">
        <div className="wrap bw-intro">
          <Reveal className="bw-intro__text">
            <p className="eyebrow">Our mission</p>
            <h2>Help Great Ideas Go Further</h2>
            <p>We believe every author deserves the opportunity to present their work professionally and share it with the people who may love it.</p>
            <p>Our mission is to make the ebook journey easier to navigate by bringing creative services together under one roof, helping authors focus on their ideas while we support the work that brings those ideas closer to the world.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">A book isn&rsquo;t just a collection of pages. It&rsquo;s someone&rsquo;s imagination, experience, knowledge, or dream made real. And that&rsquo;s worth celebrating!</p>
          </Reveal>
        </div>
      </section>

      {/* Who we work with */}
      <section className="section">
        <div className="wrap bw-who">
          <Reveal className="bw-who__intro">
            <p className="eyebrow">Who we work with</p>
            <h2>Who We Love Working With</h2>
            <p>Every author has a different story, and we&rsquo;re here for all kinds of creative journeys.</p>
            <p className="bw-who__see">Whatever you&rsquo;re writing, wherever you are in your journey, there&rsquo;s room to make your next step a little easier.</p>
            <Link className="btn btn--primary" to="/#contact">Tell us about my book</Link>
          </Reveal>
          <Reveal className="bw-who__feed" delay={80}>
            <AnimatedList label="The authors we love working with" delay={1500}>
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

      {/* Why us */}
      <section className="section section--ice" id="bw-why">
        <div className="wrap">
          <Head eyebrow="Why choose us" title="Why Firefox Publisher?" />
          <AppleCardCarousel cards={WHY_CARDS} label="Why Firefox Publisher" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="section band bw-final">
        <div className="wrap bw-final__in">
          <h2>Your Story Starts With You. The Next Step Starts Here.</h2>
          <p>Maybe you&rsquo;re working on your first manuscript. Maybe your ebook is ready for its big debut. Or maybe you&rsquo;re looking for fresh ways to help more people discover work you&rsquo;ve already published.</p>
          <p>Wherever you are, Firefox Publisher is ready to explore the possibilities with you. Let&rsquo;s turn that idea into something worth sharing.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s get started!</Link>
          </div>
          <p className="bw-final__tag"><em>Firefox Publisher provides creative ebook-related services, including manuscript support, formatting and print-ready file preparation, author branding, illustration, audiobook production, and promotional services. Service availability and project scope are confirmed individually.</em></p>
        </div>
      </section>
    </div>
  );
}
