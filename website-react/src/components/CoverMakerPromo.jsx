import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "./ui.jsx";
import { COVERS, FIELD_DEFAULTS, drawCover } from "../lib/coverTemplates.js";
import "../styles/cover-promo.css";

// Home-page banner for the free cover maker: five live-drawn covers fanned out, a pitch and two buttons.
const PICKS = ["noir-0", "realm-0", "bloom-0", "neon-0", "stack-0"].map((id) => COVERS.find((c) => c.id === id));

function Mini({ cover, i }) {
  const ref = useRef(null);
  useEffect(() => {
    // Draw once the fonts are available so the titles render in their real typefaces.
    let off = false;
    const paint = () => !off && ref.current && drawCover(ref.current, 260, 390, cover.tpl, { ...cover.palette, ...FIELD_DEFAULTS, font: cover.tpl.font });
    paint();
    document.fonts?.ready.then(paint);
    return () => { off = true; };
  }, [cover]);
  return <canvas ref={ref} className={"cmp-book cmp-book--" + i} width="260" height="390" aria-hidden="true" />;
}

export default function CoverMakerPromo() {
  return (
    <section className="section cmp" id="cover-maker" aria-labelledby="cmp-title">
      <div className="wrap cmp__in">
        <Reveal className="cmp__text">
          <p className="eyebrow">Free tool</p>
          <h2 id="cmp-title">Design your own book cover, <span>free</span></h2>
          <p>Pick from 860+ original designs, change the title, colours and fonts, add your own artwork, and download PNG, JPG, WebP or a print PDF. No sign-up, no watermark.</p>
          <ul className="cmp__list">
            <li>8 genres: thriller, fantasy, romance, sci-fi and more</li>
            <li>Editable text, colours, fonts and sizes</li>
            <li>Premium designs and vector SVG files available</li>
          </ul>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/free-book-cover-maker">Open the cover maker</Link>
            <Link className="btn btn--secondary" to="/free-book-cover-maker#gallery">Browse designs</Link>
          </div>
        </Reveal>
        <Reveal className="cmp__art" delay={120}>
          {PICKS.map((c, i) => <Mini key={c.id} cover={c} i={i} />)}
        </Reveal>
      </div>
    </section>
  );
}
