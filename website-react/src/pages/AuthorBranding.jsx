import { Link } from "react-router-dom";
import { ScrollingFeatureShowcase } from "../components/ui/interactive-scrolling-story-component";
import { ImageGallery } from "../components/ui/image-gallery";
import { AppleCardCarousel } from "../components/ui/carousel-08";
import { AnimatedList } from "../components/ui/animated-list";
import { Reveal, stagger } from "../components/ui.jsx";
import { useEffect, useState } from "react";
import { usePageMeta, prefersReducedMotion } from "../hooks.js";

const TYPES = [
  { badge: "Logo", title: "Author Logo Design", description: "Put your name on the map. Your name deserves a signature look! We create author logos that reflect your personality, writing style, and the kind of stories you want to be known for.", image: "/assets/services/author-branding.jpg", alt: "An author\u2019s desk with a personal brand mark" },
  { badge: "Identity", title: "Author Brand Identity", description: "Make your name memorable. Romantic storyteller? Fantasy-world builder? Business expert? Let\u2019s create a visual identity that feels like you and helps keep your author presence consistent across your digital platforms.", image: "/assets/services/cover-interior-design.jpg", alt: "Book covers sharing one consistent visual style" },
  { badge: "Kits", title: "Author Branding Kits", description: "Your creative toolkit. Bring your visual identity together with coordinated branding elements you can use across your author website, social media profiles, ebook promotions, and other digital touchpoints.", image: "/assets/journey/design-production.jpg", alt: "A designer assembling coordinated brand assets" },
  { badge: "Illustration", title: "Ebook Illustrations", description: "Let your imagination take shape. Some ideas deserve to be seen, not just read! We help bring your ebook to life with illustrations that complement your content, enhance the reading experience, and give your ideas a visual voice.", image: "/assets/illustrations/open-book-digital.svg", alt: "An illustration of an open digital book" },
  { badge: "Characters", title: "Character Illustrations", description: "Meet the faces of your story. Give your characters a look readers can picture and remember. Character illustrations can add personality and visual appeal to suitable fiction, children\u2019s ebooks, and other illustrated digital publications.", image: "/assets/writing/childrens.jpg", alt: "Two children looking at an illustrated storybook" },
  { badge: "Artwork", title: "Custom Ebook Artwork", description: "Because every story has its own world. From imaginative scenes to educational visuals, we help create artwork that fits your ebook\u2019s subject, mood, and style.", image: "/assets/illustrations/reader-on-cushion.svg", alt: "An illustration of a reader on a cushion with a book" },
];

const STEPS = [
  { title: "Tell Us Your Story", description: "Share your ebook, your author personality, your creative ideas, and the look you\u2019re hoping to achieve.", image: { url: "/assets/journey/discovery.jpg", alt: "Two people sharing ideas for a book" } },
  { title: "Find Your Creative Style", description: "We explore visual directions that fit your writing, audience, genre, and goals.", image: { url: "/assets/services/author-branding.jpg", alt: "Exploring visual directions for an author brand" } },
  { title: "Let\u2019s Make It Visual", description: "We develop your agreed branding elements and illustrations, with opportunities to review and request adjustments within your project scope.", image: { url: "/assets/journey/design-production.jpg", alt: "A designer creating branding and illustrations" } },
  { title: "Show the World Your Style", description: "Receive your final agreed assets, ready to use across your author platforms and ebook projects.", image: { url: "/assets/journey/growth.jpg", alt: "A small plant growing on a pile of books" } },
].map((s) => ({ ...s, image: { ...s.image, width: 900, height: 900 } }));

const SLIDE_COLORS = [
  { bgColor: "#fff1e1", textColor: "#12294a" },
  { bgColor: "#eaf3fd", textColor: "#12294a" },
  { bgColor: "#ffe3c2", textColor: "#12294a" },
  { bgColor: "#12294a", textColor: "#ffffff", gridColor: "rgba(255,255,255,.1)" },
];
const SLIDES = STEPS.map((st, i) => ({ title: st.title, description: st.description, image: st.image.url, alt: st.image.alt, ...SLIDE_COLORS[i] }));

const WHY_CATEGORIES = ["Memorable", "Engaging", "Consistent", "Imagination", "Complete"];
const WHY_IMAGES = [
  ["your-ideas", "A notebook, pencil and coffee on a writer's desk"],
  ["your-voice", "A reader absorbed in a book"],
  ["process", "A notebook page with a checklist of steps"],
  ["no-skills", "A hand writing in a notebook"],
  ["help", "Two people reviewing a document together"],
];
const WHY = [
  ["Build a Brand Readers Remember", "Create a recognizable author identity that helps your name stand out across your digital presence."],
  ["Make Your Ebook More Engaging", "Thoughtful illustrations can help explain ideas, add personality, and create a richer visual experience for readers."],
  ["Keep Your Look Consistent", "Give your author profiles, promotional graphics, and other digital materials a coordinated appearance."],
  ["Bring Big Ideas to Life", "Turn the characters, concepts, and scenes in your imagination into visuals that readers can see and connect with."],
  ["Make Your Creative Work Feel Complete", "Pair your writing with branding and artwork that complement its personality, subject, and intended audience."],
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
  ["First-Time Authors", "Build your author identity from the very beginning."],
  ["Fiction Writers", "Develop character art and illustrations that complement your fictional worlds."],
  ["Children\u2019s Ebook Authors", "Make stories more visually engaging with age-appropriate illustrations."],
  ["Nonfiction Authors", "Add useful, relevant visuals to guides, educational ebooks, and informative content."],
  ["Established Authors", "Refresh your existing brand and create a more consistent visual presence."],
  ["Digital Creators and Experts", "Develop an author-style identity for ebooks, guides, and digital resources."],
];

const FAQ = [
  ["What is author branding?", "Author branding is the visual identity and overall presentation associated with you as a writer. It can include your logo, brand style, colors, typography, and coordinated digital assets."],
  ["What types of illustrations can you create for ebooks?", "Depending on your project, illustrations may include characters, story scenes, educational visuals, and custom artwork that complements your ebook\u2019s content."],
  ["Can you create branding for a first-time author?", "Absolutely! You don\u2019t need an established audience or an existing logo to get started. We can help develop a visual identity that suits your author goals."],
  ["Can you illustrate my existing ebook?", "Yes! If you already have a completed ebook, we can discuss the content and determine what types of illustrations would fit your project."],
  ["Can I use my author branding on social media?", "Yes! Your agreed branding assets can be prepared for suitable digital uses, such as author profiles, promotional graphics, and ebook marketing materials."],
  ["Can I request a specific illustration style?", "You can share your preferred style, references, and creative direction before the project begins. We\u2019ll discuss the approach that best fits your ebook and its intended audience."],
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
  { text: "Your Stories Have a Style. Let\u2019s Give Them ", accent: false },
  { text: "a Face!", accent: true },
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

export default function AuthorBranding() {
  usePageMeta(
    "Author Branding & Illustration Services | Firefox Publisher",
    "Author logos, brand identity and branding kits, plus ebook illustrations, character art and custom artwork that give your stories a recognizable style."
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
            <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#services">Services</Link> / Author Branding &amp; Illustration</p>
            <p className="bw-hero3__pill">Author branding &amp; illustration</p>
            <TypedTitle />
            <p className="lead">You&rsquo;re more than the words you write. You&rsquo;re the imagination behind the story, the voice behind the pages, and the name readers can come to love.</p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/#contact">Let&rsquo;s build my author brand!</Link>
              <Link className="btn btn--secondary" to="#bw-process">See how it works</Link>
            </div>
            <p className="bw-hero__note">Your words tell the story. Your style makes it unforgettable!</p>
          </div>
          <div className="bw-hero3__art">
            <img src="/assets/services/author-branding.jpg" alt="An author building a personal brand" width="900" height="900" />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section" id="bw-intro">
        <div className="wrap bw-intro">
          <Reveal className="bw-intro__text">
            <p className="eyebrow">Author branding &amp; illustration</p>
            <h2>Give Your Author Identity a Little Main-Character Energy!</h2>
            <p>So why should your author brand look like everyone else&rsquo;s?</p>
            <p><strong>At Firefox Publisher, we help authors build a recognizable identity</strong> and bring their ebook ideas to life through creative branding and eye-catching illustrations. Whether you&rsquo;re building your author presence or adding visuals to your latest ebook, we&rsquo;re here to help make your work stand out.</p>
          </Reveal>
          <Reveal className="bw-intro__quote" delay={80}>
            <p className="quote">Your words tell the story. Your style makes it unforgettable!</p>
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s build my author brand!</Link>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section section--ice">
        <div className="wrap">
          <Head eyebrow="How we help" title="Here&rsquo;s How We Bring Your Author Brand to Life">
            <p>Your ebook might be the star, but your author brand deserves a spotlight, too! A consistent, memorable identity helps readers recognize your work and gives your books a personality of their own.</p>
          </Head>
          <Reveal className="bw-gallery"><ImageGallery items={TYPES} /></Reveal>
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s bring my ideas to life!</Link></p>
        </div>
      </section>

      {/* Process */}
      <section id="bw-process" aria-labelledby="bw-process-title">
        <ScrollingFeatureShowcase
          slides={SLIDES}
          ctaText="Let's build my author brand!"
          ctaHref="/#contact"
          as={Link}
          hrefProp="to"
          ctaClassName="btn btn--primary"
          className="bw-story"
          perSlide={0.6}
          header={
            <div className="section__head section__head--center bw-head">
              <p className="eyebrow">How it works</p>
              <h2 id="bw-process-title">From &ldquo;That&rsquo;s My Book&rdquo; to &ldquo;That&rsquo;s So Me!&rdquo;</h2>
              <p>Building your author identity and creating illustrations shouldn&rsquo;t feel like solving a creative puzzle alone. Let&rsquo;s make the process simple!</p>
            </div>
          }
        />
      </section>

      {/* Why us */}
      <section className="section" id="bw-why">
        <div className="wrap">
          <Head eyebrow="Why Firefox Publisher?" title="Why Should Your Words Get All the Attention?">
            <p>Your vision leads the way. We help bring it to life!</p>
          </Head>
          <AppleCardCarousel cards={WHY_CARDS} label="Why Firefox Publisher" />
          <p className="center bw-cta"><Link className="btn btn--primary" to="/#contact">Let&rsquo;s create something that feels like me!</Link></p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="section section--ice">
        <div className="wrap bw-who">
          <Reveal className="bw-who__intro">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2>Is It Time to Give Your Author Identity a Glow-Up?</h2>
            <p>Whether you&rsquo;re starting from scratch or refreshing your existing look, we&rsquo;ve got creative possibilities for you!</p>
            <p className="bw-who__see">Whatever you write, let&rsquo;s find the look that feels like you.</p>
            <Link className="btn btn--primary" to="/#contact">Tell us about my ebook</Link>
          </Reveal>
          <Reveal className="bw-who__feed" delay={80}>
            <AnimatedList label="Who our author branding and illustration services are for" delay={1500}>
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
          <h2>Your Imagination Deserves a Visual Identity!</h2>
          <p>You&rsquo;ve got the ideas. You&rsquo;ve got the stories. Now let&rsquo;s give them a look readers can recognize and visuals they can connect with.</p>
          <p>At Firefox Publisher, we help authors build memorable brands and bring their ebook ideas to life through creative illustration services.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Let&rsquo;s create something that feels like me!</Link>
            <Link className="btn btn--ghost" to="/#contact">Have questions? Talk to our team</Link>
          </div>
          <p className="bw-final__tag">Your name. Your imagination. Your signature style.</p>
        </div>
      </section>
    </div>
  );
}
