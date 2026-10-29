import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks.js";
import { COVERS, GENRES, SIZES, FONTS, FIELD_DEFAULTS, drawCover, coverToSVG } from "../lib/coverTemplates.js";
import { jpegToPdf } from "../lib/pdf.js";
import { PAYMENT_LINK, PRICES, isUnlocked } from "../data/premium.js";
import { CoverMakerSchema } from "../components/Schema.jsx";
import "../styles/cover-maker.css";

const TOTAL = COVERS.length;
const PAGE = 48;

const STEPS = [
  ["Browse the gallery", `Search ${TOTAL}+ designs or filter by genre (thriller, fantasy, romance, sci-fi, literary, horror, non-fiction or kids) and by free or premium.`],
  ["Click to customise", "Type your title, subtitle, author name and tagline. Text resizes automatically to stay readable."],
  ["Make it yours", "Adjust colours and fonts, choose a paperback or ebook size, or upload your own artwork as the background."],
  ["Download", "Save PNG, JPG, WebP or a print PDF. Premium designs and editable SVG vector files are paid downloads."],
];

const FAQS = [
  ["Is the book cover maker really free?", "Yes. The free designs can be edited and downloaded as PNG, JPG, WebP or PDF with no sign-up and no watermark. Premium designs and SVG vector files are paid."],
  ["How many cover designs are there?", `The gallery has ${TOTAL}+ original designs across 8 genres. Every design is drawn by us, so you can use your finished cover commercially.`],
  ["What size is the cover I download?", "Choose 6 x 9 in paperback (1800 x 2700 px), 5.5 x 8.5 in paperback (1650 x 2550 px) or ebook (1600 x 2560 px). The files are high resolution for online stores."],
  ["Can I use the cover for Amazon KDP and other stores?", "The front cover works for ebooks and as the front panel of a paperback. A full print wrap also needs a spine and back cover, which our design team can prepare for you."],
  ["Can I upload my own image?", "Yes. Upload a photo or illustration you own or are licensed to use and it becomes the cover background. Images stay in your browser and are never uploaded to our servers."],
  ["What are the premium downloads?", "Premium covers are extra designs, and the SVG vector files open in Illustrator, Inkscape, Figma or Affinity so a designer can edit every shape and line of text."],
  ["Do you design custom book covers?", "Yes. Firefox Publisher designs custom, genre-researched ebook and print covers, with interiors, branding and marketing if you want them."],
];

const slug = (t) => (t || "book-cover").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "book-cover";

// The nine cover fonts are only needed here, so they load on this page instead of site-wide.
const COVER_FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Cinzel:wght@600;700&family=Bebas+Neue&family=Great+Vibes&family=Cormorant+Garamond:wght@700&family=Oswald:wght@500;600&family=Fredoka:wght@500;600&display=swap";
function loadFonts() {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  let link = document.getElementById("cover-fonts");
  if (!link) {
    link = Object.assign(document.createElement("link"), { id: "cover-fonts", rel: "stylesheet", href: COVER_FONTS });
    document.head.appendChild(link);
  }
  const sheet = link.sheet ? Promise.resolve() : new Promise((r) => { link.addEventListener("load", r); link.addEventListener("error", r); });
  return sheet.then(() => Promise.all(Object.entries(FONTS).map(([f, { weight }]) => document.fonts.load(`${weight} 40px "${f}"`).catch(() => null))));
}

// Diagonal "PREVIEW" mark over the on-screen preview of a locked premium design.
function watermark(canvas) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  ctx.save();
  ctx.translate(w / 2, h / 2); ctx.rotate(-0.5);
  ctx.font = `800 ${w * 0.16}px Montserrat, sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,.22)"; ctx.fillText("PREVIEW", 0, 0);
  ctx.font = `600 ${w * 0.045}px Montserrat, sans-serif`;
  ctx.fillText("PREMIUM DESIGN", 0, w * 0.13);
  ctx.restore();
}

function UnlockDialog({ onClose, what }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="cm-modal" role="presentation" onClick={onClose}>
      <div className="cm-modal__box" role="dialog" aria-modal="true" aria-labelledby="cm-unlock-h" onClick={(e) => e.stopPropagation()}>
        <h2 id="cm-unlock-h">Unlock premium downloads</h2>
        <p>{what} is part of the premium kit:</p>
        <ul>
          <li>{COVERS.filter((c) => c.premium).length} premium cover designs{PRICES.premiumCover && ` (${PRICES.premiumCover})`}</li>
          <li>Editable SVG vector files for every design{PRICES.vectorFiles && ` (${PRICES.vectorFiles})`}</li>
          <li>Print-ready PNG, JPG, WebP and PDF at full resolution, no watermark</li>
        </ul>
        <div className="cm-modal__cta">
          {PAYMENT_LINK ? (
            <a className="btn btn--primary" href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer">Pay securely</a>
          ) : (
            <>
              <p className="cm-note">Online payment is opening soon. Tell us what you need and we will send you the files.</p>
              <a className="btn btn--primary" href="#contact" data-plan="Premium book cover or vector files" onClick={onClose}>Request premium files</a>
            </>
          )}
          <button type="button" className="btn btn--secondary" onClick={onClose}>Keep designing</button>
        </div>
      </div>
    </div>
  );
}

// Draws its thumbnail only once it scrolls near the viewport, so hundreds of cards stay cheap.
function Card({ cover, active, onPick, ready, sample, index }) {
  const wrap = useRef(null);
  const cv = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return setSeen(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (seen && cv.current) drawCover(cv.current, 200, 300, cover.tpl, { ...cover.palette, ...sample, font: cover.tpl.font });
  }, [seen, ready, cover, sample]);
  return (
    <button ref={wrap} type="button" style={{ "--i": index }} className={"cm-card" + (active ? " is-active" : "")} onClick={onPick} aria-label={`${cover.name}, ${cover.genre}, ${cover.premium ? "premium" : "free"}. Customise this cover`}>
      <canvas ref={cv} width="200" height="300" aria-hidden="true" />
      <span className={"cm-tag " + (cover.premium ? "cm-tag--pro" : "cm-tag--free")}>{cover.premium ? "Premium" : "Free"}</span>
      <span className="cm-card__go">Customise</span>
      <span className="cm-card__name">{cover.name}</span>
      <span className="cm-card__genre">{cover.genre}</span>
    </button>
  );
}

export default function FreeBookCoverMaker() {
  usePageMeta(
    "Free Book Cover Maker Online | Firefox Publisher",
    `Design a book cover free online. Browse ${TOTAL}+ genre templates, edit text and colours, add your image and download PNG, JPG or PDF. Premium SVG files.`
  );

  const [coverId, setCoverId] = useState(COVERS[0].id);
  const cover = useMemo(() => COVERS.find((c) => c.id === coverId), [coverId]);
  const tpl = cover.tpl;
  const [genre, setGenre] = useState("All");
  const [tier, setTier] = useState("all");
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(PAGE);
  const [fields, setFields] = useState(FIELD_DEFAULTS);
  const [colors, setColors] = useState({ ...cover.palette });
  const [font, setFont] = useState(tpl.font);
  const [sizeId, setSizeId] = useState(SIZES[0].id);
  const [img, setImg] = useState(null);
  const [dim, setDim] = useState(0.45);
  const [ready, setReady] = useState(false);
  const [unlock, setUnlock] = useState(null);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const editorRef = useRef(null);
  const unlocked = isUnlocked();
  const locked = cover.premium && !unlocked;

  useEffect(() => { loadFonts().then(() => setReady(true)); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COVERS.filter((c) =>
      (genre === "All" || c.genre === genre) &&
      (tier === "all" || (tier === "premium") === c.premium) &&
      (!q || q.split(/\s+/).every((w) => c.search.includes(w))));
  }, [genre, tier, query]);
  useEffect(() => setCount(PAGE), [genre, tier, query]);

  const counts = useMemo(() => {
    const m = { All: COVERS.length };
    COVERS.forEach((c) => { m[c.genre] = (m[c.genre] || 0) + 1; });
    return m;
  }, []);

  const pick = (c, scroll) => {
    setCoverId(c.id); setColors({ ...c.palette }); setFont(c.tpl.font);
    if (scroll) editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const step = (d) => {
    const list = filtered.length ? filtered : COVERS;
    const i = list.findIndex((c) => c.id === coverId);
    pick(list[(i + d + list.length) % list.length]);
  };
  const shuffle = () => { const list = filtered.length ? filtered : COVERS; pick(list[Math.floor(Math.random() * list.length)]); };

  const state = useMemo(() => ({ ...fields, ...colors, font }), [fields, colors, font]);
  const size = SIZES.find((s) => s.id === sizeId);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const id = requestAnimationFrame(() => {
      drawCover(c, 720, Math.round((720 * size.h) / size.w), tpl, state, img, dim);
      if (locked) watermark(c);
    });
    return () => cancelAnimationFrame(id);
  }, [tpl, state, img, dim, size, ready, locked]);

  // Replay the preview "pop" only when the design itself changes, not on every keystroke.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.classList.remove("is-new"); void c.offsetWidth; c.classList.add("is-new");
  }, [coverId]);

  const setField = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));
  const setColor = (k) => (e) => setColors((c) => ({ ...c, [k]: e.target.value }));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => { setImg(im); URL.revokeObjectURL(url); };
    im.src = url;
  };

  const save = (blob, ext) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${slug(fields.title)}-cover.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const render = () => { const c = document.createElement("canvas"); drawCover(c, size.w, size.h, tpl, state, img, dim); return c; };
  const toBlob = (c, type, q) => new Promise((res) => c.toBlob(res, type, q));

  const download = async (kind) => {
    if (kind === "svg") {
      if (!unlocked) return setUnlock("Vector (SVG) download");
      return save(new Blob([coverToSVG(size.w, size.h, tpl, state, img, dim)], { type: "image/svg+xml" }), "svg");
    }
    if (locked) return setUnlock(cover.name);
    const c = render();
    if (kind === "png") save(await toBlob(c, "image/png"), "png");
    if (kind === "jpg") save(await toBlob(c, "image/jpeg", 0.95), "jpg");
    if (kind === "webp") save(await toBlob(c, "image/webp", 0.95), "webp");
    if (kind === "pdf") {
      const jpeg = new Uint8Array(await (await toBlob(c, "image/jpeg", 0.95)).arrayBuffer());
      save(jpegToPdf(jpeg, size.w, size.h, size.pt[0], size.pt[1]), "pdf");
    }
  };

  const shown = filtered.slice(0, count);
  const sample = FIELD_DEFAULTS;

  return (
    <>
      <section className="page-hero cm-hero">
        <span className="cm-float cm-float--a" aria-hidden="true" />
        <span className="cm-float cm-float--b" aria-hidden="true" />
        <div className="wrap">
          <span className="eyebrow">Free cover maker</span>
          <h1>Design your own book cover. <span className="cm-accent">Free.</span></h1>
          <p className="lead">Choose from {TOTAL}+ original designs, change the words, colours and fonts, add your own artwork and download a high-resolution cover. No sign-up and no watermark.</p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#gallery">Browse {TOTAL}+ designs</a>
            <a className="btn btn--secondary" href="#editor" onClick={(e) => { e.preventDefault(); editorRef.current?.scrollIntoView({ behavior: "smooth" }); }}>Start designing</a>
          </div>
        </div>
      </section>

      <section className="cm-gallery" id="gallery">
        <div className="wrap">
          <div className="cm-toolbar">
            <h2>Browse designs <span>({filtered.length})</span></h2>
            <label className="cm-search">
              <span className="sr-only">Search designs</span>
              <input type="search" placeholder="Search by genre, style or colour, e.g. fantasy blue" value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
          </div>
          <div className="cm-filters">
            <div className="cm-chips" role="group" aria-label="Filter by genre">
              {GENRES.filter((g) => g !== "Premium").map((g) => (
                <button key={g} type="button" className={"cm-chip" + (g === genre ? " is-active" : "")} onClick={() => setGenre(g)}>{g} <small>{counts[g] || 0}</small></button>
              ))}
            </div>
            <div className="cm-seg" role="group" aria-label="Free or premium">
              {[["all", "All"], ["free", "Free"], ["premium", "Premium"]].map(([v, l]) => (
                <button key={v} type="button" className={tier === v ? "is-active" : ""} onClick={() => setTier(v)}>{l}</button>
              ))}
            </div>
          </div>

          {shown.length ? (
            <div className="cm-cards">
              {shown.map((c, i) => <Card key={c.id} index={i % PAGE} cover={c} sample={sample} ready={ready} active={c.id === coverId} onPick={() => pick(c, true)} />)}
            </div>
          ) : (
            <p className="cm-empty">No designs match. Try a different word or <button type="button" className="cm-link" onClick={() => { setQuery(""); setGenre("All"); setTier("all"); }}>clear the filters</button>.</p>
          )}
          {count < filtered.length && (
            <div className="cm-more">
              <button type="button" className="btn btn--secondary" onClick={() => setCount((n) => n + PAGE)}>Show more ({filtered.length - count} left)</button>
            </div>
          )}
        </div>
      </section>

      <section className="cm-studio" id="editor" ref={editorRef}>
        <div className="wrap cm-grid">
          <div className="cm-preview">
            <div className="cm-preview__stage">
              <canvas ref={canvasRef} className="cm-canvas" role="img" aria-label={`Preview of your book cover: ${fields.title} by ${fields.author}`} />
            </div>
            <div className="cm-nav">
              <button type="button" className="cm-chip" onClick={() => step(-1)} aria-label="Previous design">&larr; Prev</button>
              <button type="button" className="cm-chip" onClick={shuffle}>Shuffle</button>
              <button type="button" className="cm-chip" onClick={() => step(1)} aria-label="Next design">Next &rarr;</button>
            </div>
            <p className="cm-now"><strong>{cover.name}</strong> <span className={"cm-tag cm-tag--inline " + (cover.premium ? "cm-tag--pro" : "cm-tag--free")}>{cover.premium ? "Premium" : "Free"}</span></p>
            <div className="cm-dl" role="group" aria-label="Download">
              <button type="button" className="btn btn--primary" onClick={() => download("png")}>{locked ? "Unlock to download" : "PNG"}</button>
              <button type="button" className="btn btn--secondary" onClick={() => download("jpg")}>JPG</button>
              <button type="button" className="btn btn--secondary" onClick={() => download("webp")}>WebP</button>
              <button type="button" className="btn btn--secondary" onClick={() => download("pdf")}>Print PDF</button>
              <button type="button" className="btn btn--secondary cm-vector" onClick={() => download("svg")}>{unlocked ? "Download SVG vector" : "Vector SVG · Premium"}</button>
            </div>
            <p className="cm-note">{size.w} x {size.h} px. Your work stays in your browser; nothing is uploaded.</p>
          </div>

          <div className="cm-panel">
            <h2 className="cm-h">Your words</h2>
            <div className="cm-fields">
              <label>Title<input value={fields.title} onChange={setField("title")} maxLength={80} /></label>
              <label>Subtitle<input value={fields.subtitle} onChange={setField("subtitle")} maxLength={90} /></label>
              <label>Author name<input value={fields.author} onChange={setField("author")} maxLength={50} /></label>
              <label>Tagline<input value={fields.tagline} onChange={setField("tagline")} maxLength={90} /></label>
            </div>

            <h2 className="cm-h">Style</h2>
            <div className="cm-colors">
              {[["c1", "Background"], ["c2", "Shade"], ["accent", "Accent"], ["text", "Text"]].map(([k, l]) => (
                <label key={k}><input type="color" value={colors[k]} onChange={setColor(k)} />{l}</label>
              ))}
            </div>
            <button type="button" className="cm-link" onClick={() => setColors({ ...cover.palette })}>Reset colours</button>
            <div className="cm-fields cm-fields--2">
              <label>Title font
                <select value={font} onChange={(e) => setFont(e.target.value)}>
                  {Object.keys(FONTS).map((f) => <option key={f}>{f}</option>)}
                </select>
              </label>
              <label>Cover size
                <select value={sizeId} onChange={(e) => setSizeId(e.target.value)}>
                  {SIZES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </label>
            </div>

            <h2 className="cm-h">Your artwork <span>(optional)</span></h2>
            <div className="cm-upload">
              <input ref={fileRef} type="file" accept="image/*" onChange={onFile} hidden />
              <button type="button" className="btn btn--secondary" onClick={() => fileRef.current?.click()}>{img ? "Replace image" : "Upload an image"}</button>
              {img && <button type="button" className="cm-link" onClick={() => { setImg(null); if (fileRef.current) fileRef.current.value = ""; }}>Remove</button>}
            </div>
            {img && (
              <label className="cm-range">Darken image for readability
                <input type="range" min="0" max="0.85" step="0.05" value={dim} onChange={(e) => setDim(+e.target.value)} />
              </label>
            )}
            <p className="cm-note">Only use images you own or have a licence to use.</p>
          </div>
        </div>
      </section>

      {unlock && <UnlockDialog what={unlock} onClose={() => setUnlock(null)} />}

      <section className="section cm-info">
        <div className="wrap">
          <h2>How to make a book cover online</h2>
          <ol className="cm-steps">
            {STEPS.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
          </ol>
          <h2>Book cover maker FAQ</h2>
          <div className="cm-faq">
            {FAQS.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </div>
      </section>
      <CoverMakerSchema faqs={FAQS} />

      <section className="section cm-cta">
        <div className="wrap cm-cta__in">
          <div>
            <h2>Want a cover that sells, not just a cover?</h2>
            <p>Our designers create fully custom, genre-researched covers, with a print-ready wrap, ebook and audiobook versions. Send us your book and we will take it from here.</p>
          </div>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/ebook-design">Custom cover design</Link>
            <Link className="btn btn--secondary" to="/portfolio">See our work</Link>
          </div>
        </div>
      </section>
    </>
  );
}
