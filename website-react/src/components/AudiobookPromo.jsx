import { Link } from "react-router-dom";
import { Reveal } from "./ui.jsx";
import { AUDIOBOOKS, coverUrl } from "../data/audiobooks.js";
import "../styles/audio-sample.css";

// Home-page strip that sends visitors to the audiobook samples page.
export default function AudiobookPromo() {
  return (
    <section className="section ap" id="audiobooks" aria-labelledby="ap-title">
      <div className="wrap">
        <Reveal className="ap__text">
          <p className="eyebrow">Listen</p>
          <h2 id="ap-title">Hear our audiobooks</h2>
          <p>Press play on samples from five audiobooks, from Frankenstein to The Time Machine. Then turn your own book into audio.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/audiobooks">Listen to the samples</Link>
            <Link className="btn btn--secondary" to="/audiobook-production">Audiobook production</Link>
          </div>
        </Reveal>
        <Reveal className="ap__covers" delay={100}>
          {AUDIOBOOKS.map((b) => (
            <Link key={b.slug} to={`/audiobooks#audio-${b.slug}`} aria-label={`Listen to ${b.title} by ${b.by}`}>
              <img src={coverUrl(b)} alt="" width={b.w} height={b.h} loading="lazy" decoding="async" />
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
