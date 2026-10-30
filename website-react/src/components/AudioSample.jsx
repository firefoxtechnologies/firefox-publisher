import { useRef, useState } from "react";
import { Reveal, stagger } from "./ui.jsx";
import { audioUrl, coverUrl, durationText } from "../data/audiobooks.js";

const SPEEDS = [1, 1.25, 1.5, 2];
const save = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, String(v)); } catch { /* storage can be blocked */ } };
const load = (k) => { try { return Number(localStorage.getItem(k)) || 0; } catch { return 0; } };

// One audiobook sample: cover, native audio controls (keyboard and screen-reader friendly),
// skip and speed buttons, a remembered listening position and lock-screen controls.
export default function AudioSample({ book, index }) {
  const ref = useRef(null);
  const lastSaved = useRef(0);
  const posKey = "fp-audio-" + book.slug;
  const [speed, setSpeed] = useState(() => load("fp-audio-speed") || 1);

  const pauseOthers = () => document.querySelectorAll(".as__audio").forEach((el) => { if (el !== ref.current) el.pause(); });

  const onPlay = () => {
    pauseOthers();
    const a = ref.current;
    a.playbackRate = speed;
    if ("mediaSession" in navigator && window.MediaMetadata) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: book.title,
        artist: book.by,
        album: "Firefox Publisher audiobook samples",
        artwork: [{ src: coverUrl(book), sizes: `${book.w}x${book.h}`, type: "image/jpeg" }],
      });
      navigator.mediaSession.setActionHandler("seekbackward", () => skip(-15));
      navigator.mediaSession.setActionHandler("seekforward", () => skip(30));
    }
  };

  const skip = (s) => { const a = ref.current; if (a) a.currentTime = Math.max(0, Math.min(a.duration || Infinity, a.currentTime + s)); };

  const onLoaded = () => {
    const t = load(posKey);
    const a = ref.current;
    if (t > 5 && t < a.duration - 5) a.currentTime = t;
  };

  const onTime = () => {
    const t = ref.current.currentTime;
    if (Math.abs(t - lastSaved.current) > 5) { lastSaved.current = t; save(posKey, Math.floor(t)); }
  };

  const changeSpeed = (e) => {
    const v = Number(e.target.value);
    setSpeed(v);
    save("fp-audio-speed", v);
    ref.current.playbackRate = v;
  };

  return (
    <Reveal className="as" id={"audio-" + book.slug} delay={stagger(index)}>
      <figure className="as__cover">
        <img src={coverUrl(book)} alt={`Audiobook cover of ${book.title} by ${book.by}`} width={book.w} height={book.h} loading="lazy" decoding="async" />
      </figure>
      <div className="as__body">
        <p className="eyebrow">{book.label} &middot; {durationText(book.seconds)} sample</p>
        <h3>{book.title}</h3>
        <p className="as__by">{book.by}</p>
        <audio
          ref={ref}
          className="as__audio"
          controls
          preload="none"
          src={audioUrl(book)}
          aria-label={`Listen to the introduction of ${book.title} by ${book.by}`}
          onPlay={onPlay}
          onLoadedMetadata={onLoaded}
          onTimeUpdate={onTime}
          onEnded={() => save(posKey, null)}
        />
        <div className="as__tools">
          <button type="button" className="as__btn" onClick={() => skip(-15)} aria-label="Back 15 seconds">&minus;15s</button>
          <button type="button" className="as__btn" onClick={() => skip(30)} aria-label="Forward 30 seconds">+30s</button>
          <label className="as__speed">Speed
            <select value={speed} onChange={changeSpeed} aria-label={`Playback speed for ${book.title}`}>
              {SPEEDS.map((s) => <option key={s} value={s}>{s}x</option>)}
            </select>
          </label>
        </div>
      </div>
    </Reveal>
  );
}
