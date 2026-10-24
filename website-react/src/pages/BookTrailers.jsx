import { Link } from "react-router-dom";
import { ScrollingFeatureShowcase } from "../components/ui/interactive-scrolling-story-component";
import { ImageGallery } from "../components/ui/image-gallery";
import { AppleCardCarousel } from "../components/ui/carousel-08";
import { AnimatedList } from "../components/ui/animated-list";
import { Reveal, stagger } from "../components/ui.jsx";
import { useEffect, useState } from "react";
import { usePageMeta, prefersReducedMotion } from "../hooks.js";

const TYPES = [
  { badge: "Trailer", title: "Custom Book Trailer", description: "Lights, camera, book! Give your ebook its own moment in the spotlight. We create promotional videos that introduce your book, highlight its appeal, and invite viewers to discover what\u2019s inside.", image: "/assets/services/video-trailers.jpg", alt: "A video editor cutting a trailer on a desktop" },
  { badge: "Visuals", title: "Eye-Catching Visuals", description: "Make them stop scrolling. First impressions happen fast! We combine suitable imagery, typography, and visual elements to create a trailer that catches attention and reflects the personality of your ebook.", image: "/assets/journey/design-production.jpg", alt: "Designing the look of a promotional video" },
  { badge: "Motion", title: "Animated Text & Motion Graphics", description: "Let your words move! Your book title, key phrases, and intriguing lines deserve more than a static screen. We use motion and text animation to make your message more dynamic and memorable.", image: "/assets/stages/designed.jpg", alt: "A cleanly laid-out book spread, ready for animated text" },
  { badge: "Sound", title: "Music & Sound Design", description: "Set the mood. Suspenseful? Heartwarming? Inspirational? The right audio can help establish the atmosphere of your trailer and complement your ebook\u2019s theme.", image: "/assets/services/audiobook-production.jpg", alt: "Headphones and a microphone for sound design" },
  { badge: "Highlights", title: "Story Highlights", description: "Tease, don\u2019t tell! Give viewers a glimpse of what makes your ebook special without revealing everything. We help select key ideas, themes, or story elements that build interest while keeping the best parts waiting inside.", image: "/assets/journey/editorial.jpg", alt: "Choosing the key moments to feature in a trailer" },
  { badge: "Social", title: "Social Media-Ready Videos", description: "Made to be shared. Give your ebook a promotional asset you can use across suitable digital channels. We can discuss video dimensions and formats based on where you plan to share it.", image: "/assets/journey/launch.jpg", alt: "Planning where to share a book trailer online" },
];

const STEPS = [
  { title: "Tell Us About Your Ebook", description: "Share your ebook, its genre or subject, target audience, and what makes it worth discovering.", image: { url: "/assets/journey/discovery.jpg", alt: "Two people talking through a book project" } },
  { title: "Find the Right Vibe", description: "We explore the creative direction, visual style, tone, and mood that suit your book.", image: { url: "/assets/services/video-trailers.jpg", alt: "Exploring the look and mood of a trailer" } },
  { title: "Lights, Camera, Creation!", description: "We bring the agreed concept together using visuals, animated text, music, and other suitable elements.", image: { url: "/assets/journey/design-production.jpg", alt: "A trailer being put together" } },
  { title: "Ready for Its Close-Up", description: "Review your trailer, request adjustments within the agreed scope, and receive the final video in the agreed format.", image: { url: "/assets/journey/growth.jpg", alt: "A small plant growing on a pile of books" } },
].map((s) => ({ ...s, image: { ...s.image, width: 900, height: 900 } }));

const SLIDE_COLORS = [
  { bgColor: "#fff1e1", textColor: "#12294a" },
  { bgColor: "#eaf3fd", textColor: "#12294a" },
  { bgColor: "#ffe3c2", textColor: "#12294a" },
  { bgColor: "#12294a", textColor: "#ffffff", gridColor: "rgba(255,255,255,.1)" },
];
const SLIDES = STEPS.map((st, i) => ({ title: st.title, description: st.description, image: st.image.url, alt: st.image.alt, ...SLIDE_COLORS[i] }));

const WHY_CATEGORIES = ["Attention", "Personality", "Sneak peek", "Promotion", "Clicks"];
const WHY_IMAGES = [
  ["your-ideas", "A notebook, pencil and coffee on a writer's desk"],
  ["your-voice", "A reader absorbed in a book"],
  ["no-skills", "A hand writing in a notebook"],
  ["process", "A notebook page with a checklist of steps"],
  ["help", "Two people reviewing a document together"],
];
const WHY = [
  ["Catch Attention in a Busy Feed", "Use video to introduce your ebook in a format that can stand out among everyday posts and promotions."],
  ["Make Your Book\u2019s Personality Shine", "A mysterious novel, a heartfelt romance, and a practical business guide shouldn\u2019t all look the same. Your trailer can reflect what makes your ebook unique."],
  ["Give Readers a Sneak Peek", "Highlight the premise, key themes, or benefits of your ebook without giving away the whole experience."],
  ["Create More Ways to Promote Your Ebook", "Use your trailer alongside your ebook cover, author branding, launch announcements, and other promotional content."],
  ["Turn Curiosity Into Clicks", "A compelling trailer and a clear call to action can encourage viewers to explore your ebook, visit its sales page, or learn more about your work."],
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
  ["Fiction Authors", "Tease the mystery, romance, adventure, or drama waiting inside your story."],
  ["Nonfiction Writers", "Turn your ideas, insights, and practical advice into an engaging visual introduction."],
  ["First-Time Authors", "Give your debut ebook a promotional video that introduces it to potential readers."],
  ["Established Authors", "Add a fresh promotional asset to your next release or existing collection."],
  ["Business Professionals", "Showcase your digital guides, educational ebooks, or industry insights."],
  ["Self-Published Authors", "Create another way to introduce your ebook to audiences online."],
];

const FAQ = [
  ["What is a book video trailer?", "A book video trailer is a short promotional video that introduces a book through visuals, text, music, animation, and selected highlights. It\u2019s designed to spark interest and encourage viewers to learn more."],
  ["Can you create a trailer for my ebook?", "Absolutely! We can develop a trailer concept based on your ebook\u2019s genre, subject, target audience, and promotional goals."],
  ["Do I need to provide images or footage?", "You can share your ebook cover, preferred visuals, branding assets, and any references you have. The creative approach and asset requirements can be discussed before production."],
  ["Can you create trailers for fiction and nonfiction ebooks?", "Yes! A fiction trailer might focus on atmosphere and story intrigue, while a nonfiction trailer could highlight key ideas, benefits, and the problems the ebook helps address."],
  ["Can I use my trailer on social media?", "Your trailer can be prepared for your intended digital channels. We can discuss the appropriate aspect ratio, dimensions, and file format for your planned use."],
  ["Will a book trailer guarantee more sales?", "No video can guarantee sales. Results depend on factors such as your ebook, audience, distribution, promotional strategy, and call to action. A trailer is a promotional asset designed to help attract interest."],
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
  { text: "Your Ebook Deserves a Trailer. Let\u2019s ", accent: false },
  { text: "Make Some Noise!", accent: true },
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

export default function BookTrailers() {
  usePageMeta(
    "Book Video Trailer Services | Firefox Publisher",
    "Custom book trailers with eye-catching visuals, animated text, music and social-ready formats that spark curiosity and give readers a reason to look closer."
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
            <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / Book Video Trailers</p>
            <p className="bw-hero3__pill">Book video trailer services</p>
            <TypedTitle />
            <p className="lead">Your ebook has a story. Now it needs a little screen time!</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/#contact">Let&rsquo;s create my book trailer!</Link>
              <Link className="btn btn--secondary" to="#bw-process">See how it works</Link>
            </div>
            <p className="bw-hero__note">Your ebook is the story. Let&rsquo;s create the preview that gets people hooked!</p>
          </div>
          <div className="bw-hero3__art">
            <img src="/assets/services/video-trailers.jpg" alt="A video editor cutting a book trailer" width="900" height="900" />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section" id="bw-intro">
        <div className="wrap bw-intro">
          <Reveal className="bw-intro__text">
            <p className="eyebrow">Book video trailer services</p>
            <h2>Less Scrolling. More &ldquo;I Need to Read This!&rdquo;</h2>
            <p>Imagine your book brought to life through eye-catching visuals, captivating text, music, and motion that make people stop scrolling and start wondering, &ldquo;Wait&hellip; what is this book about?&rdquo;</p>
            <p><strong>At Firefox Publisher, we help turn your ebook into an engaging video trailer</strong> designed to spark curiosity, showcase what makes your book special, and give potential readers a reason to take a closer look.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">Your ebook is the story. Let&rsquo;s create the preview that gets people hooked!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s create my book trailer!</Link>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section section--ice">
        <div className="wrap">
          <Head eyebrow="How we help" title="Here&rsquo;s How We Bring Your Ebook to the Screen">
            <p>A great book trailer doesn&rsquo;t give everything away. It gives people just enough to want more! Whether your ebook is packed with mystery, romance, adventure, knowledge, or inspiration, we help turn its key themes and personality into a promotional video that makes people curious.</p>
          </Head>
          <Reveal className="bw-gallery"><ImageGallery items={TYPES} /></Reveal>
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s put my ebook on screen!</Link></p>
        </div>
      </section>

      {/* Process */}
      <section id="bw-process" aria-labelledby="bw-process-title">
        <ScrollingFeatureShowcase
          slides={SLIDES}
          ctaText="Let's create my book trailer!"
          ctaHref="/#contact"
          as={Link}
          hrefProp="to"
          ctaClassName="btn btn--primary"
          className="bw-story"
          perSlide={0.6}
          header={
            <div className="section__head section__head--center bw-head">
              <p className="eyebrow">How it works</p>
              <h2 id="bw-process-title">From &ldquo;Just Published&rdquo; to &ldquo;Have You Seen This Trailer?&rdquo;</h2>
              <p>Promoting your ebook doesn&rsquo;t have to mean posting the cover and hoping for the best. Let&rsquo;s give your book something worth watching!</p>
            </div>
          }
        />
      </section>

      {/* Why us */}
      <section className="section" id="bw-why">
        <div className="wrap">
          <Head eyebrow="Why Firefox Publisher?" title="Why Should Movie Stars Have All the Trailers?">
            <p>One ebook. One exciting visual introduction. More ways to get people curious.</p>
          </Head>
          <AppleCardCarousel cards={WHY_CARDS} label="Why Firefox Publisher" />
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s make my ebook trailer!</Link></p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="section section--ice">
        <div className="wrap bw-who">
          <Reveal className="bw-who__intro">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2>Is Your Ebook Ready for the Big Screen?</h2>
            <p>Your ebook doesn&rsquo;t need a Hollywood budget to deserve a little cinematic magic!</p>
            <p className="bw-who__see">Whatever you&rsquo;ve written, let&rsquo;s give people a reason to press play.</p>
            <Link className="btn btn--primary" to="/#contact">Tell us about my ebook</Link>
          </Reveal>
          <Reveal className="bw-who__feed" delay={80}>
            <AnimatedList label="Who our book video trailer services are for" delay={1500}>
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
          <h2>Your Ebook Has a Story. Let&rsquo;s Give It a Trailer!</h2>
          <p>You&rsquo;ve created something worth sharing. Now let&rsquo;s give potential readers a glimpse that makes them curious to discover more.</p>
          <p>At Firefox Publisher, we turn ebook ideas into engaging promotional videos that help your book stand out, show off its personality, and make its first impression count.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s make my ebook trailer!</Link>
            <Link className="btn btn--ghost" to="/#contact">Have questions? Talk to our team</Link>
          </div>
          <p className="bw-final__tag">Your book. Your story. Your moment in the spotlight.</p>
        </div>
      </section>
    </div>
  );
}
