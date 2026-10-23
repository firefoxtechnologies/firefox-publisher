import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DUST, HERO_BOOKS } from "../data/site.js";
import { prefersReducedMotion } from "../hooks.js";

// Cinematic hero: mouse parallax (eased), scroll parallax via --sy, floating books.
export default function Hero() {
  const hero = useRef(null);

  useEffect(() => {
    const el = hero.current;
    if (!el || prefersReducedMotion()) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;

    const onScroll = () => el.style.setProperty("--sy", scrollY);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--mx", cx.toFixed(3));
      el.style.setProperty("--my", cy.toFixed(3));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      removeEventListener("scroll", onScroll);
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero hero--dark cine" id="top" ref={hero}>
      <div className="cine__bg" aria-hidden="true">
        <div className="rays" />
        <div className="glow g1" />
        <div className="glow g2" />
        <div className="dust">
          {DUST.map(([x, y, s, dl]) => (
            <span key={x + "-" + y} style={{ "--x": x + "%", "--y": y + "%", "--s": s + "px", "--dl": "-" + dl + "s" }} />
          ))}
        </div>
        <div className="field">
          {HERO_BOOKS.map((b) => (
            <div key={b.layer} className={"layer " + b.layer} style={{ "--d": b.d }}>
              <div
                className="book has-img"
                style={{
                  "--rx": b.rx, "--ry": b.ry, "--delay": b.delay, "--dur": b.dur,
                  "--sp": b.color, "--bg": b.color, "--img": `url(/assets/covers/${b.file}.svg)`,
                }}
              >
                <span className="back" /><span className="spine" /><span className="edge" />
                <span className="front" role="img" aria-label={b.label} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass gl1" aria-hidden="true">
        <small>Manuscript received</small>
        <div className="bar"><i style={{ width: "72%" }} /></div>
        <span>Editing in progress</span>
      </div>
      <div className="glass gl2" aria-hidden="true">
        <small>Reader preview</small>
        <strong>Chapter One</strong>
        <div className="lines"><i /><i /><i /><i style={{ width: "60%" }} /></div>
      </div>

      <div className="wrap cine__content">
        <p className="eyebrow">Firefox Publishers</p>
        <h1>Your Story.<br /><span>Our Craft.</span></h1>
        <p className="lead">Publishing and creative services that help authors present their work professionally and build their brands.</p>
        <div className="hero__cta">
          <Link className="btn btn--light" to="/#contact">Start your publishing journey</Link>
          <Link className="btn btn--ghost" to="/portfolio">View our work</Link>
        </div>
      </div>
    </section>
  );
}
