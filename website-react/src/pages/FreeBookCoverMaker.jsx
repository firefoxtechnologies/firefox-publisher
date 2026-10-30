import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePageMeta, useRafScroll } from "../hooks.js";
import { COVERS, GENRES, SIZES, FONTS, FRAMES, TEXTURES, LIGHTING, FIELD_DEFAULTS, drawCover, coverToSVG, drawBack, backToSVG, drawWrap, wrapDims, watermark, logoReady } from "../lib/coverTemplates.js";
import { jpegToPdf } from "../lib/pdf.js";
import { PAYMENT_LINK, PRICES, isUnlocked } from "../data/premium.js";
import { CoverMakerSchema } from "../components/Schema.jsx";
import "../styles/cover-maker.css";

const TOTAL = COVERS.length;
const PAGE = 48;

const STEPS = [
  ["Browse the gallery", `Search ${TOTAL}+ designs or filter by genre (thriller, fantasy, romance, sci-fi, literary, horror, non-fiction or kids) and by free or premium.`],
  ["Click to customise", "Type your title, subtitle, author name and tagline. Text resizes automatically to stay readable."],
  ["Design the back too", "Write your book description and author bio on the back cover, set the page count for the spine, and upload your own artwork if you like."],
  ["Download", "Save PNG, JPG, WebP or a print PDF, for the front, the back or the full wrap with spine. Premium designs and editable SVG vector files are paid downloads."],
];

const FAQS = [
  ["Is the book cover maker really free?", "Yes. The free designs can be edited and downloaded as PNG, JPG, WebP or PDF with no sign-up and no watermark. Premium designs and SVG vector files are paid."],
  ["How many cover designs are there?", `The gallery has ${TOTAL}+ original designs across 8 genres. Every design is drawn by us, so you can use your finished cover commercially.`],
  ["What size is the cover I download?", "Choose 6 x 9 in paperback (1800 x 2700 px), 5.5 x 8.5 in paperback (1650 x 2550 px) or ebook (1600 x 2560 px). The files are high resolution for online stores."],
  ["Can I design the back cover and spine?", "Yes. Every design has a matching back cover with space for your book description, author bio, website and an ISBN barcode box. For paperbacks, enter your page count and the Full wrap view adds the spine with your title and name, ready for a print-on-demand printer."],
  ["Can I use the cover for Amazon KDP and other stores?", "Yes. Download the front cover for ebooks, or the Full wrap (back, spine and front with 0.125 in bleed) as a PDF for paperbacks. Check your printer's template for the exact spine width, and our design team can prepare a final print-ready file for you."],
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
    if (seen && cv.current) {
      drawCover(cv.current, 200, 300, cover.tpl, { ...cover.palette, ...sample, font: cover.font, ...cover.deco });
      if (cover.premium && !isUnlocked()) watermark(cv.current);
    }
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

const STORE = "fp-cover-maker-v2";
const loadSaved = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } };
const isIOS = () => typeof navigator !== "undefined" && (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
const VIEWS = [["front", "Front cover"], ["back", "Back cover"], ["wrap", "Full wrap"]];

function Downloads({ onDownload, locked, unlocked, view, canWrap, busy }) {
  const btn = (kind, label, hint) => (
    <button type="button" className={"btn " + (kind === "png" ? "btn--primary" : "btn--secondary")} onClick={() => onDownload(kind)} disabled={busy}>
      <strong>{label}</strong><small>{hint}</small>
    </button>
  );
  return (
    <div className="cm-dl" role="group" aria-label="Download your cover">
      {btn("png", locked ? "Unlock to download" : "PNG", "Best quality")}
      {btn("jpg", "JPG", "Smaller file")}
      {btn("pdf", "PDF", "For printing")}
      {btn("webp", "WebP", "Web and apps")}
      <button type="button" className="btn btn--secondary cm-vector" onClick={() => onDownload("svg")} disabled={busy}>
        <strong>{unlocked ? "SVG vector" : "SVG vector · Premium"}</strong>
        <small>{view === "wrap" && canWrap ? "Front or back only" : "Editable in Illustrator, Figma"}</small>
      </button>
    </div>
  );
}

export default function FreeBookCoverMaker() {
  usePageMeta(
    "Free Book Cover Maker Online | Firefox Publisher",
    `Design a book cover free online. Browse ${TOTAL}+ genre templates, edit text and colours, add your image and download PNG, JPG or PDF. Premium SVG files.`
  );

  const saved = useMemo(() => (typeof window === "undefined" ? {} : loadSaved()), []);
  const [coverId, setCoverId] = useState(() => (COVERS.some((c) => c.id === saved.coverId) ? saved.coverId : COVERS[0].id));
  const cover = useMemo(() => COVERS.find((c) => c.id === coverId), [coverId]);
  const tpl = cover.tpl;
  const [genre, setGenre] = useState("All");
  const [tier, setTier] = useState("all");
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(PAGE);
  const [fields, setFields] = useState({ ...FIELD_DEFAULTS, ...(saved.fields || {}) });
  const [colors, setColors] = useState({ ...cover.palette });
  const [font, setFont] = useState(cover.font);
  const [deco, setDeco] = useState({ ...cover.deco });
  const [sizeId, setSizeId] = useState(SIZES.some((s) => s.id === saved.sizeId) ? saved.sizeId : SIZES[0].id);
  const [pages, setPages] = useState(saved.pages || 200);
  const [view, setView] = useState("front");
  const [img, setImg] = useState(null);
  const [dim, setDim] = useState(0.45);
  const [ready, setReady] = useState(false);
  const [unlock, setUnlock] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [mini, setMini] = useState(false);
  const canvasRef = useRef(null);
  const miniRef = useRef(null);
  const stageRef = useRef(null);
  const fileRef = useRef(null);
  const editorRef = useRef(null);
  const unlocked = isUnlocked();
  const locked = cover.premium && !unlocked;
  const size = SIZES.find((s) => s.id === sizeId);
  const canWrap = !!size.print;
  const activeView = view === "wrap" && !canWrap ? "front" : view;

  useEffect(() => { Promise.all([loadFonts(), logoReady]).then(() => setReady(true)); }, []);

  // Keep the customer's work if they refresh or come back later.
  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify({ coverId, fields, sizeId, pages })); } catch { /* private mode */ }
  }, [coverId, fields, sizeId, pages]);

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
    setCoverId(c.id); setColors({ ...c.palette }); setFont(c.font); setDeco({ ...c.deco }); setView("front");
    if (scroll) editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const step = (d) => {
    const list = filtered.length ? filtered : COVERS;
    const i = list.findIndex((c) => c.id === coverId);
    pick(list[(i + d + list.length) % list.length]);
  };
  const shuffle = () => { const list = filtered.length ? filtered : COVERS; pick(list[Math.floor(Math.random() * list.length)]); };

  const state = useMemo(() => ({ ...fields, ...colors, font, ...deco }), [fields, colors, font, deco]);

  // Wrap geometry: the preview uses a scaled-down copy of the real print size.
  const wrapPreview = useMemo(() => wrapDims({ ...size, w: Math.round(size.w * 0.3), h: Math.round(size.h * 0.3) }, pages), [size, pages]);
  const wrapReal = useMemo(() => wrapDims(size, pages), [size, pages]);
  const wrapMini = useMemo(() => wrapDims({ ...size, w: Math.round(size.w * 0.12), h: Math.round(size.h * 0.12) }, pages), [size, pages]);

  // On phones the preview scrolls out of sight while editing, so a small copy follows the customer down the form.
  useRafScroll(() => {
    const st = stageRef.current?.getBoundingClientRect(), ed = editorRef.current?.getBoundingClientRect();
    if (!st || !ed) return;
    const show = innerWidth <= 900 && st.bottom < 40 && ed.bottom > 260;
    setMini((m) => (m === show ? m : show));
  });

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const id = requestAnimationFrame(() => {
      const pw = 720, ph = Math.round((720 * size.h) / size.w);
      if (activeView === "wrap") drawWrap(c, wrapPreview, tpl, state, img, dim);
      else if (activeView === "back") drawBack(c, pw, ph, tpl, state, img, dim);
      else drawCover(c, pw, ph, tpl, state, img, dim);
      if (locked) watermark(c);
      const m = miniRef.current;
      if (m && mini) {
        const mw = 200, mh = Math.round((200 * size.h) / size.w);
        if (activeView === "wrap") drawWrap(m, wrapMini, tpl, state, img, dim);
        else if (activeView === "back") drawBack(m, mw, mh, tpl, state, img, dim);
        else drawCover(m, mw, mh, tpl, state, img, dim);
        if (locked) watermark(m);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [tpl, state, img, dim, size, ready, locked, activeView, wrapPreview, wrapMini, mini]);

  // Replay the preview "pop" only when the design or the side being viewed changes.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.classList.remove("is-new"); void c.offsetWidth; c.classList.add("is-new");
  }, [coverId, activeView]);

  const setField = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));
  const setColor = (k) => (e) => setColors((c) => ({ ...c, [k]: e.target.value }));
  const frontFocus = () => setView((v) => (v === "back" ? "front" : v));
  const backField = (k) => ({ value: fields[k], onChange: setField(k), onFocus: () => setView((v) => (v === "wrap" ? v : "back")) });

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => { setImg(im); URL.revokeObjectURL(url); };
    im.src = url;
  };

  // Android and desktop browsers download directly; iPhones open the share sheet so the file can be saved to Photos or Files.
  const save = async (blob, ext) => {
    const name = `${slug(fields.title)}-${activeView}.${ext}`;
    if (isIOS() && navigator.canShare) {
      const file = new File([blob], name, { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: name }); setStatus(`Shared ${name}. Choose Save Image or Save to Files.`); return; }
        catch (e) { if (e.name === "AbortError") { setStatus("Download cancelled."); return; } }
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    setStatus(`Downloaded ${name}. Check your Downloads folder.`);
  };

  const render = () => {
    const c = document.createElement("canvas");
    if (activeView === "wrap") drawWrap(c, wrapReal, tpl, state, img, dim);
    else if (activeView === "back") drawBack(c, size.w, size.h, tpl, state, img, dim);
    else drawCover(c, size.w, size.h, tpl, state, img, dim);
    return c;
  };
  const toBlob = (c, type, q) => new Promise((res) => c.toBlob(res, type, q));

  const download = async (kind) => {
    if (kind === "svg") {
      if (!unlocked) return setUnlock("Vector (SVG) download");
      if (activeView === "wrap") return setStatus("SVG files are made for one side at a time. Switch to Front cover or Back cover, then download the SVG.");
      const svg = activeView === "back" ? backToSVG(size.w, size.h, tpl, state, img, dim) : coverToSVG(size.w, size.h, tpl, state, img, dim);
      return save(new Blob([svg], { type: "image/svg+xml" }), "svg");
    }
    if (locked) return setUnlock(cover.name);
    setBusy(true); setStatus("Preparing your file...");
    try {
      await new Promise((r) => setTimeout(r, 30));
      const c = render();
      if (kind === "png") await save(await toBlob(c, "image/png"), "png");
      if (kind === "jpg") await save(await toBlob(c, "image/jpeg", 0.95), "jpg");
      if (kind === "webp") await save(await toBlob(c, "image/webp", 0.95), "webp");
      if (kind === "pdf") {
        const jpeg = new Uint8Array(await (await toBlob(c, "image/jpeg", 0.95)).arrayBuffer());
        const pt = activeView === "wrap" ? [(c.width * 72) / wrapReal.inch, (c.height * 72) / wrapReal.inch] : size.pt;
        await save(jpegToPdf(jpeg, c.width, c.height, pt[0], pt[1]), "pdf");
      }
    } catch {
      setStatus("Sorry, that file could not be made. Please try again or choose a smaller size.");
    } finally { setBusy(false); }
  };

  const shown = filtered.slice(0, count);
  const sample = FIELD_DEFAULTS;
  const dlProps = { onDownload: download, locked, unlocked, view: activeView, canWrap, busy };
  const dims = activeView === "wrap" ? `${wrapReal.w} x ${wrapReal.h} px (${(wrapReal.w / wrapReal.inch).toFixed(2)} x ${(wrapReal.h / wrapReal.inch).toFixed(2)} in)` : `${size.w} x ${size.h} px`;
  const sideName = activeView === "wrap" ? "full wrap" : activeView + " cover";

  return (
    <>
      <section className="page-hero cm-hero">
        <span className="cm-float cm-float--a" aria-hidden="true" />
        <span className="cm-float cm-float--b" aria-hidden="true" />
        <div className="wrap">
          <span className="eyebrow">Free cover maker</span>
          <h1>Design your own book cover. <span className="cm-accent">Free.</span></h1>
          <p className="lead">Choose from {TOTAL}+ original designs, edit the words and colours, design the back cover too, and download a high-resolution cover. No sign-up and no watermark.</p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#gallery">Browse {TOTAL}+ designs</a>
            <a className="btn btn--secondary" href="#editor" onClick={(e) => { e.preventDefault(); editorRef.current?.scrollIntoView({ behavior: "smooth" }); }}>Start designing</a>
          </div>
        </div>
      </section>

      <section className="cm-gallery" id="gallery">
        <div className="wrap">
          <ol className="cm-flow" aria-label="How it works">
            <li className="is-on"><span>1</span> Pick a design</li>
            <li><span>2</span> Edit front and back</li>
            <li><span>3</span> Download</li>
          </ol>
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
        <div className={"wrap cm-grid" + (activeView === "wrap" ? " is-wrap" : "")}>
          <div className="cm-preview">
            <div className="cm-views" role="tablist" aria-label="Which side to edit">
              {VIEWS.map(([v, l]) => (
                <button key={v} type="button" role="tab" aria-selected={activeView === v} className={activeView === v ? "is-active" : ""} disabled={v === "wrap" && !canWrap} title={v === "wrap" && !canWrap ? "Full wrap is for paperback sizes" : ""} onClick={() => setView(v)}>{l}</button>
              ))}
            </div>
            <div className="cm-preview__stage" ref={stageRef}>
              <canvas ref={canvasRef} className="cm-canvas" role="img" aria-label={`Preview of your ${sideName}: ${fields.title} by ${fields.author}`} />
            </div>
            <div className="cm-nav">
              <button type="button" className="cm-chip" onClick={() => step(-1)} aria-label="Previous design">&larr; Prev</button>
              <button type="button" className="cm-chip" onClick={shuffle}>Shuffle</button>
              <button type="button" className="cm-chip" onClick={() => step(1)} aria-label="Next design">Next &rarr;</button>
            </div>
            <p className="cm-now"><strong>{cover.name}</strong> <span className={"cm-tag cm-tag--inline " + (cover.premium ? "cm-tag--pro" : "cm-tag--free")}>{cover.premium ? "Premium" : "Free"}</span></p>
            <h3 className="cm-dl-h">Download {sideName}</h3>
            <Downloads {...dlProps} />
            <p className="cm-note" role="status" aria-live="polite">{status || `${dims}. Your work stays in your browser and is saved automatically.`}</p>
          </div>

          <div className="cm-panel">
            <ol className="cm-flow cm-flow--small" aria-label="Steps">
              <li><span>1</span> Design picked</li>
              <li className="is-on"><span>2</span> Edit your text</li>
              <li><span>3</span> Download</li>
            </ol>
            <h2 className="cm-h">Front cover text</h2>
            <div className="cm-fields">
              <label>Title<input value={fields.title} onChange={setField("title")} onFocus={frontFocus} maxLength={80} /></label>
              <label>Subtitle<input value={fields.subtitle} onChange={setField("subtitle")} onFocus={frontFocus} maxLength={90} /></label>
              <label>Author name<input value={fields.author} onChange={setField("author")} onFocus={frontFocus} maxLength={50} /></label>
              <label>Tagline<input value={fields.tagline} onChange={setField("tagline")} maxLength={90} /></label>
            </div>

            <h2 className="cm-h">Back cover text <span>(tap a box to see the back)</span></h2>
            <div className="cm-fields">
              <label>Book description<textarea rows={5} maxLength={700} {...backField("blurb")} /></label>
              <label>About the author<textarea rows={3} maxLength={260} {...backField("bio")} /></label>
              <label>Website<input maxLength={60} {...backField("website")} /></label>
            </div>
            <p className="cm-note">The white box on the back is where your ISBN barcode goes. Amazon KDP adds one free, and printers can place yours there.</p>

            <h2 className="cm-h">Size and spine</h2>
            <div className="cm-fields cm-fields--2">
              <label>Cover size
                <select value={sizeId} onChange={(e) => setSizeId(e.target.value)}>
                  {SIZES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </label>
              <label>Number of pages
                <input type="number" min="24" max="800" value={pages} onChange={(e) => setPages(Math.min(800, Math.max(24, Number(e.target.value) || 24)))} disabled={!canWrap} />
              </label>
            </div>
            <p className="cm-note">{canWrap ? `Spine width: ${wrapReal.spineIn.toFixed(2)} in (white paper). ${wrapReal.spineIn < 0.18 ? "Too thin for spine text, so the spine stays plain." : "Your title and name appear on the spine in the Full wrap view."}` : "Ebook covers have a front only. Choose a paperback size to design the spine and full wrap."}</p>

            <h2 className="cm-h">Style</h2>
            <div className="cm-colors">
              {[["c1", "Background"], ["c2", "Shade"], ["accent", "Accent"], ["text", "Text"]].map(([k, l]) => (
                <label key={k}><input type="color" value={colors[k]} onChange={setColor(k)} />{l}</label>
              ))}
            </div>
            <button type="button" className="cm-link" onClick={() => { setColors({ ...cover.palette }); setFont(cover.font); setDeco({ ...cover.deco }); }}>Reset design</button>
            <div className="cm-fields cm-fields--2">
              <label>Title font
                <select value={font} onChange={(e) => setFont(e.target.value)}>
                  {Object.keys(FONTS).map((f) => <option key={f}>{f}</option>)}
                </select>
              </label>
              <label>Frame
                <select value={deco.frame} onChange={(e) => setDeco((d) => ({ ...d, frame: +e.target.value }))}>
                  {FRAMES.map((f, i) => <option key={f} value={i}>{f}</option>)}
                </select>
              </label>
              <label>Texture
                <select value={deco.tex} onChange={(e) => setDeco((d) => ({ ...d, tex: +e.target.value }))}>
                  {TEXTURES.map((f, i) => <option key={f} value={i}>{f}</option>)}
                </select>
              </label>
              <label>Lighting
                <select value={deco.vig} onChange={(e) => setDeco((d) => ({ ...d, vig: +e.target.value }))}>
                  {LIGHTING.map((f, i) => <option key={f} value={i}>{f}</option>)}
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

            <div className="cm-done">
              <h2 className="cm-h">Happy with it? Download</h2>
              <div className="cm-views cm-views--inline" role="group" aria-label="Which side to download">
                {VIEWS.map(([v, l]) => (
                  <button key={v} type="button" className={activeView === v ? "is-active" : ""} disabled={v === "wrap" && !canWrap} onClick={() => setView(v)}>{l}</button>
                ))}
              </div>
              <Downloads {...dlProps} />
              <details className="cm-help">
                <summary>Which file should I choose?</summary>
                <ul>
                  <li><strong>PNG</strong>: best quality, good for ebook stores and sharing.</li>
                  <li><strong>JPG</strong>: smaller file, accepted by Amazon KDP and most stores.</li>
                  <li><strong>PDF</strong>: send to a printer. Use the Full wrap view for a print-ready cover with spine.</li>
                  <li><strong>WebP</strong>: tiny files for websites and apps.</li>
                  <li><strong>SVG</strong>: editable vector file for a designer (premium).</li>
                </ul>
                <p>On iPhone, tap Download, then Save Image or Save to Files. On Android the file goes to your Downloads folder.</p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {mini && (
        <button type="button" className={"cm-mini" + (activeView === "wrap" ? " cm-mini--wide" : "")} onClick={() => stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} aria-label="Back to the full preview">
          <canvas ref={miniRef} aria-hidden="true" />
          <span>{activeView === "wrap" ? "Wrap" : activeView === "back" ? "Back" : "Front"}</span>
        </button>
      )}

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
