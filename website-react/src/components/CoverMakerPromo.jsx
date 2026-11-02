import { Suspense, lazy, useRef } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "./ui.jsx";
import { useNear } from "../hooks.js";
import "../styles/cover-promo.css";

// Home-page banner for the free cover maker: five live-drawn covers fanned out, a pitch and two buttons.
// The covers (and the template library behind them) load only when the banner is about to be seen.
const PromoBooks = lazy(() => import("./PromoBooks.jsx"));

export default function CoverMakerPromo() {
  const ref = useRef(null);
  const near = useNear(ref);
  return (
    <section ref={ref} className="section cmp" id="cover-maker" aria-labelledby="cmp-title">
      <div className="wrap cmp__in">
        <Reveal className="cmp__text">
          <p className="eyebrow">Free tool</p>
          <h2 id="cmp-title">Design your own book cover, <span>free</span></h2>
          <p>Pick from 700+ original designs, change the title, colours and fonts, add your own artwork, and download PNG, JPG, WebP or a print PDF. No sign-up, no watermark.</p>
          <ul className="cmp__list">
            <li>8 genres: thriller, fantasy, romance, sci-fi and more</li>
            <li>Front, back cover and spine for paperbacks</li>
            <li>Premium designs and vector SVG files available</li>
          </ul>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/free-book-cover-maker">Open the cover maker</Link>
            <Link className="btn btn--secondary" to="/free-book-cover-maker#gallery">Browse designs</Link>
          </div>
        </Reveal>
        <Reveal className="cmp__art" delay={120}>
          {near && <Suspense fallback={null}><PromoBooks /></Suspense>}
        </Reveal>
      </div>
    </section>
  );
}
