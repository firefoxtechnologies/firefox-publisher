import { Link } from "react-router-dom";
import { CtaBand } from "../components/ui.jsx";
import { PageSchema } from "../components/Schema.jsx";
import AudioSample from "../components/AudioSample.jsx";
import { usePageMeta } from "../hooks.js";
import { AUDIOBOOKS, audioUrl, coverUrl, isoDuration } from "../data/audiobooks.js";
import "../styles/audio-sample.css";

const ORIGIN = "https://firefoxpublisher.com";

export default function Audiobooks() {
  usePageMeta(
    "Audiobook Samples to Listen to Online | Firefox Publisher",
    "Listen to audiobook samples from Firefox Publisher: Frankenstein, The Time Machine, The Gods of Mars, The Idiot and the Bhagavad Gita. Press play now."
  );
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Audiobook samples from Firefox Publisher",
    itemListElement: AUDIOBOOKS.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "AudioObject",
        name: `${b.title} by ${b.by}: audiobook sample`,
        description: `Listen to the introduction of ${b.title} by ${b.by}.`,
        contentUrl: ORIGIN + audioUrl(b),
        thumbnailUrl: ORIGIN + coverUrl(b),
        encodingFormat: "audio/mpeg",
        duration: isoDuration(b.seconds),
        inLanguage: "en",
        url: `${ORIGIN}/audiobooks#audio-${b.slug}`,
      },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <PageSchema type="CollectionPage" name="Audiobook Samples" path="audiobooks" description="Listen to audiobook samples from Firefox Publisher, an audiobook production service for authors across the USA." />
      <section className="page-hero">
        <div className="wrap">
          <p className="crumbs"><Link to="/">Home</Link> / Audiobooks</p>
          <h1>Audiobook Samples: Press Play and Listen</h1>
          <p className="lead">Hear the audiobooks we&rsquo;ve worked on. Pick a title, press play, speed it up or skip ahead. Want your own book to sound this good? We handle narration, recording, editing and the final files.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/#contact">Start my audiobook</Link>
            <Link className="btn btn--secondary" to="/audiobook-production">How audiobook production works</Link>
          </div>
        </div>
      </section>

      <section className="section section--ice" id="audio-sample">
        <div className="wrap">
          <h2 className="sr-only">Audiobook samples</h2>
          <nav className="as__jump" aria-label="Audiobook samples">
            {AUDIOBOOKS.map((b) => <a key={b.slug} href={"#audio-" + b.slug}>{b.title}</a>)}
          </nav>
          {AUDIOBOOKS.map((b, i) => <AudioSample key={b.slug} book={b} index={i} />)}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
