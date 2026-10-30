import { useEffect, useMemo, useRef, useState } from "react";
import { COVERS, GENRES, FRAMES, TEXTURES, LIGHTING, drawCover, watermark } from "../lib/coverTemplates.js";
import { jpegToPdf } from "../lib/pdf.js";
import {
  FONT_LIST, HANDLES, aabb, centerOf, drawLayers, hitTest, loadStudioFonts,
  makeImage, makeShape, makeText, resizeLayer, seedLayers, snapMove, uid,
} from "../lib/studio.js";
import "../styles/cover-studio.css";

const ico = {
  undo: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  redo: "m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3",
  design: "M4 4h16v16H4zM4 10h16M10 10v10",
  text: "M5 6V4h14v2M12 4v16M9 20h6",
  shapes: "M3 3h8v8H3zM17 7a4 4 0 1 0 0 .01M12 21l5-9 5 9z",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  layers: "m12 3 9 5-9 5-9-5zM3 13l9 5 9-5",
  dup: "M8 8h11v11H8zM5 16V5h11",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  unlock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 7-2.6",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeOff: "M3 3l18 18M10 6.2A9 9 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.7M6.6 7.6A17 17 0 0 0 2 12s4 7 10 7a9 9 0 0 0 4-.9",
  up: "m6 15 6-6 6 6", down: "m6 9 6 6 6-6",
  front: "M12 4v12M7 9l5-5 5 5M5 20h14", back: "M12 20V8M7 15l5 5 5-5M5 4h14",
  download: "M12 4v12M7 11l5 5 5-5M4 20h16",
  close: "M6 6l12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14", minus: "M5 12h14",
  left: "M4 6h16M4 10h10M4 14h16M4 18h10", center: "M4 6h16M7 10h10M4 14h16M7 18h10", right: "M4 6h16M10 10h10M4 14h16M10 18h10",
  rotate: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
};
const Ico = ({ d, size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

const SHAPES = [
  ["rect", "Rectangle"], ["round", "Rounded"], ["circle", "Circle"], ["triangle", "Triangle"], ["star", "Star"],
  ["heart", "Heart"], ["line", "Line"], ["frame", "Frame"], ["ring", "Ring"], ["fade", "Fade"],
];
const SHAPE_ICON = {
  rect: <rect x="4" y="6" width="16" height="12" />, round: <rect x="4" y="6" width="16" height="12" rx="5" />, circle: <circle cx="12" cy="12" r="8" />,
  triangle: <path d="M12 4 21 20H3z" />, star: <path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z" />,
  heart: <path d="M12 20S4 15 4 9.5A4 4 0 0 1 12 8a4 4 0 0 1 8 1.5C20 15 12 20 12 20z" />, line: <path d="M4 12h16" />,
  frame: <rect x="4" y="4" width="16" height="16" fill="none" />, ring: <circle cx="12" cy="12" r="8" fill="none" />, fade: <path d="M4 4h16v16H4z" fill="url(#stfade)" stroke="none" />,
};
const SWATCHES = ["#ffffff", "#000000", "#f28c28", "#1d5fa8", "#e63946", "#2a9d8f", "#ffd166", "#7b2cbf"];
const slug = (t) => (t || "book-cover").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "book-cover";
const isIOS = () => typeof navigator !== "undefined" && (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

let hexCtx = null;
function toHex(v) {
  hexCtx ||= document.createElement("canvas").getContext("2d");
  hexCtx.fillStyle = "#000000";
  try { hexCtx.fillStyle = v; } catch { /* keep default */ }
  const r = hexCtx.fillStyle;
  return /^#[0-9a-f]{6}$/i.test(r) ? r : "#000000";
}

function Range({ label, value, min, max, step = 1, onChange, unit = "" }) {
  return (
    <label className="stf">
      <span>{label}<b>{Math.round(value * 100) / 100}{unit}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function ColorField({ label, value, onChange, swatches = SWATCHES }) {
  return (
    <div className="stf">
      <span>{label}</span>
      <div className="stc">
        <input type="color" value={toHex(value)} onChange={(e) => onChange(e.target.value)} aria-label={label} />
        <div className="sts">
          {swatches.map((c) => <button key={c} type="button" style={{ background: c }} onClick={() => onChange(c)} aria-label={`${label} ${c}`} />)}
        </div>
      </div>
    </div>
  );
}

const Tgl = ({ on, onClick, children, label }) => (
  <button type="button" className={"stt" + (on ? " is-on" : "")} aria-pressed={on} aria-label={label} onClick={onClick}>{children}</button>
);

// Draws a small, lazy preview of a template (without text, since text lives in layers).
function Thumb({ cv, active, onPick }) {
  const ref = useRef(null), wrap = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return setSeen(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (seen && ref.current) drawCover(ref.current, 120, 180, cv.tpl, { ...cv.palette, font: cv.font, ...cv.deco, title: "", subtitle: "", author: "", tagline: "" });
  }, [seen, cv]);
  return (
    <button ref={wrap} type="button" className={"sttpl" + (active ? " is-on" : "")} onClick={onPick} aria-label={`Use the ${cv.name} design`} title={cv.name}>
      <canvas ref={ref} width="120" height="180" aria-hidden="true" />
      {cv.premium && <i>Premium</i>}
    </button>
  );
}

export default function CoverStudio({ cover, size, fields, colors, font, deco, img, dim, unlocked, onClose, onLocked, onQuick }) {
  const W = size.w, H = size.h;
  const imgs = useRef(new Map());
  const [initial] = useState(() => {
    if (img) imgs.current.set("bg", img);
    const bg = { c1: colors.c1, c2: colors.c2, accent: colors.accent, text: colors.text, font, deco: { ...deco }, dim, imgId: img ? "bg" : null, coverId: cover.id };
    return { bg, layers: seedLayers(cover.tpl, { ...colors, font, ...deco }, fields, W, H) };
  });
  const [design, setDesign] = useState(initial);
  const [sel, setSel] = useState(null);
  const [editing, setEditing] = useState(null);
  const [tool, setTool] = useState("design");
  const [zoom, setZoom] = useState(1);
  const [guides, setGuides] = useState([]);
  const [box, setBox] = useState({ w: 800, h: 600 });
  const [tick, setTick] = useState(0);
  const [genre, setGenre] = useState("All");
  const [uploads, setUploads] = useState([]);
  const [menu, setMenu] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [sheet, setSheet] = useState(true);

  const root = useRef(null), stage = useRef(null), canvas = useRef(null), baseCv = useRef(null), baseKey = useRef(""), wm = useRef({ key: "", cv: null });
  const drag = useRef(null);
  const live = useRef({});
  const hist = useRef({ stack: [], i: -1 });
  const [, bump] = useState(0);

  const curCover = useMemo(() => COVERS.find((c) => c.id === design.bg.coverId) || cover, [design.bg.coverId, cover]);
  const locked = curCover.premium && !unlocked;
  const layers = design.layers;
  const selLayer = layers.find((l) => l.id === sel) || null;

  /* ----- history (undo / redo) ----- */
  useEffect(() => { hist.current = { stack: [JSON.stringify(initial)], i: 0 }; }, [initial]);
  useEffect(() => {
    const t = setTimeout(() => {
      const h = hist.current, s = JSON.stringify(design);
      if (h.stack[h.i] === s) return;
      h.stack = h.stack.slice(0, h.i + 1).concat(s).slice(-80);
      h.i = h.stack.length - 1;
      bump((n) => n + 1);
    }, 350);
    return () => clearTimeout(t);
  }, [design]);
  const canUndo = hist.current.i > 0, canRedo = hist.current.i < hist.current.stack.length - 1;
  const go = (d) => {
    const h = hist.current, ni = h.i + d;
    if (ni < 0 || ni >= h.stack.length) return;
    h.i = ni; setDesign(JSON.parse(h.stack[ni])); setEditing(null); bump((n) => n + 1);
  };
  const undo = () => { const h = hist.current; const s = JSON.stringify(design); if (h.stack[h.i] !== s) { setDesign(JSON.parse(h.stack[h.i])); return; } go(-1); };
  const redo = () => go(1);
  const dirty = hist.current.i > 0 || JSON.stringify(design) !== hist.current.stack[0];

  /* ----- fonts ----- */
  useEffect(() => { loadStudioFonts().then(() => setTick((t) => t + 1)); }, []);
  const ensureFont = (name, weight) => document.fonts?.load(`${weight || 400} 40px "${name}"`).then(() => setTick((t) => t + 1)).catch(() => {});

  /* ----- layer helpers ----- */
  const upd = (id, p) => setDesign((d) => ({ ...d, layers: d.layers.map((l) => (l.id === id ? { ...l, ...(typeof p === "function" ? p(l) : p) } : l)) }));
  const setBg = (p) => setDesign((d) => ({ ...d, bg: { ...d.bg, ...p } }));
  const add = (l) => { setDesign((d) => ({ ...d, layers: [...d.layers, l] })); setSel(l.id); setEditing(null); setSheet(true); };
  const remove = (id) => { setDesign((d) => ({ ...d, layers: d.layers.filter((l) => l.id !== id) })); setSel(null); setEditing(null); };
  const duplicate = (id) => {
    const l = layers.find((x) => x.id === id); if (!l) return;
    const n = { ...JSON.parse(JSON.stringify(l)), id: uid(), x: l.x + W * 0.03, y: l.y + W * 0.03, name: l.name.replace(/ copy$/, "") + " copy", locked: false };
    setDesign((d) => { const i = d.layers.findIndex((x) => x.id === id); const ls = d.layers.slice(); ls.splice(i + 1, 0, n); return { ...d, layers: ls }; });
    setSel(n.id);
  };
  const reorder = (id, how) => setDesign((d) => {
    const ls = d.layers.slice(), i = ls.findIndex((l) => l.id === id); if (i < 0) return d;
    const [it] = ls.splice(i, 1);
    const ni = how === "front" ? ls.length : how === "back" ? 0 : how === "up" ? Math.min(ls.length, i + 1) : Math.max(0, i - 1);
    ls.splice(ni, 0, it);
    return { ...d, layers: ls };
  });
  const alignPage = (id, how) => {
    const l = layers.find((x) => x.id === id); if (!l) return;
    const a = aabb(l);
    const dx = (v) => v - a.cx, dy = (v) => v - a.cy;
    const p = { left: { x: l.x + dx(a.w / 2) }, center: { x: l.x + dx(W / 2) }, right: { x: l.x + dx(W - a.w / 2) }, top: { y: l.y + dy(a.h / 2) }, middle: { y: l.y + dy(H / 2) }, bottom: { y: l.y + dy(H - a.h / 2) } }[how];
    upd(id, p);
  };

  /* ----- images ----- */
  const addImageFile = (file, asBg = false) => {
    if (!file || !/^image\//.test(file.type)) return;
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      const id = uid();
      imgs.current.set(id, im);
      if (asBg) { imgs.current.set("bg", im); setBg({ imgId: "bg" }); bump((n) => n + 1); setTick((t) => t + 1); }
      else { setUploads((u) => [...u, { id, src: url, w: im.naturalWidth, h: im.naturalHeight }]); add(makeImage(id, im.naturalWidth, im.naturalHeight, W, H)); }
    };
    im.src = url;
  };
  useEffect(() => () => uploads.forEach((u) => URL.revokeObjectURL(u.src)), []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ----- sizing ----- */
  useEffect(() => {
    const el = stage.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const fit = Math.min((box.w - 40) / W, (box.h - 40) / H);
  const k = Math.max(0.04, fit * zoom);
  const cssW = W * k, cssH = H * k;
  const dpr = Math.min(2, (typeof devicePixelRatio === "number" && devicePixelRatio) || 1);
  const bw = Math.max(2, Math.round(cssW * dpr)), bh = Math.max(2, Math.round(cssH * dpr));
  const scale = bw / W;

  /* ----- drawing ----- */
  const paintState = (bg) => ({ title: "", subtitle: "", author: "", tagline: "", c1: bg.c1, c2: bg.c2, accent: bg.accent, text: bg.text, font: bg.font, ...bg.deco });
  const bgImg = design.bg.imgId ? imgs.current.get(design.bg.imgId) : null;
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const c = canvas.current; if (!c) return;
      const ctx = c.getContext("2d");
      const key = JSON.stringify([design.bg, bw, bh, tick, !!bgImg]);
      baseCv.current ||= document.createElement("canvas");
      if (baseKey.current !== key) { drawCover(baseCv.current, bw, bh, curCover.tpl, paintState(design.bg), bgImg, design.bg.dim); baseKey.current = key; }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, bw, bh);
      ctx.drawImage(baseCv.current, 0, 0);
      drawLayers(ctx, design.layers, imgs.current, scale, editing);
      if (locked) {
        const wk = `${bw}x${bh}`;
        if (wm.current.key !== wk) { const w = document.createElement("canvas"); w.width = bw; w.height = bh; watermark(w); wm.current = { key: wk, cv: w }; }
        ctx.drawImage(wm.current.cv, 0, 0);
      }
    });
    return () => cancelAnimationFrame(id);
  }); // runs after every render on purpose: it is cheap and keeps the canvas in step with the design

  /* ----- pointer interactions ----- */
  live.current = { design, k, W, H, sel };
  const toDesign = (e) => { const r = canvas.current.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }; };

  const begin = (d) => {
    drag.current = d;
    const onMove = (e) => {
      const dd = drag.current; if (!dd) return;
      const p = toDesign(e);
      const { k: kk, design: des } = live.current;
      if (dd.mode === "move") {
        const nx = dd.orig.x + (p.x - dd.start.x), ny = dd.orig.y + (p.y - dd.start.y);
        const sn = e.altKey ? { dx: 0, dy: 0, guides: [] } : snapMove({ ...dd.orig, x: nx, y: ny }, des.layers.filter((l) => l.id !== dd.id && !l.hidden), W, H, 7 / kk);
        setGuides(sn.guides);
        upd(dd.id, { x: nx + sn.dx, y: ny + sn.dy });
      } else if (dd.mode === "resize") {
        const next = resizeLayer(dd.orig, dd.handle, p, { keepAspect: dd.orig.type === "image" || e.shiftKey });
        upd(dd.id, { x: next.x, y: next.y, w: next.w, ...(next.h !== undefined && dd.orig.type !== "text" ? { h: next.h } : {}), ...(dd.orig.type === "text" ? { size: next.size } : {}) });
      } else if (dd.mode === "rotate") {
        const c = centerOf(dd.orig);
        let a = (Math.atan2(p.y - c.y, p.x - c.x) * 180) / Math.PI + 90;
        a = ((a + 540) % 360) - 180;
        const snap = Math.round(a / 15) * 15;
        if (e.shiftKey || Math.abs(a - snap) < 4) a = snap;
        upd(dd.id, { rot: Math.round(a * 10) / 10 });
      }
    };
    const onUp = () => { drag.current = null; setGuides([]); window.removeEventListener("pointermove", onMove); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    window.addEventListener("pointercancel", onUp, { once: true });
  };

  const onCanvasDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const p = toDesign(e);
    const id = hitTest(layers, p.x, p.y);
    if (editing && editing !== id) setEditing(null);
    setSel(id);
    if (!id) return;
    setSheet(true);
    e.preventDefault();
    begin({ mode: "move", id, start: p, orig: layers.find((l) => l.id === id) });
  };
  const onCanvasDouble = (e) => {
    const p = toDesign(e);
    const id = hitTest(layers, p.x, p.y);
    const l = layers.find((x) => x.id === id);
    if (l?.type === "text") { setSel(id); setEditing(id); }
  };
  const onHandle = (e, handle) => { e.stopPropagation(); e.preventDefault(); begin({ mode: "resize", id: sel, handle, start: toDesign(e), orig: selLayer }); };
  const onRotate = (e) => { e.stopPropagation(); e.preventDefault(); begin({ mode: "rotate", id: sel, start: toDesign(e), orig: selLayer }); };

  /* ----- keyboard ----- */
  const requestClose = () => {
    if (dirty && !window.confirm("Close the studio? Your edits will be lost unless you download them first.")) return;
    onClose();
  };
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t.matches?.("input,textarea,select,[contenteditable]")) { if (e.key === "Escape" && t.tagName === "TEXTAREA") { setEditing(null); root.current?.focus(); } return; }
      const mod = e.ctrlKey || e.metaKey, key = e.key.toLowerCase();
      const { sel: s, k: kk } = live.current;
      if (mod && key === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (mod && key === "y") { e.preventDefault(); redo(); }
      else if (mod && key === "d") { e.preventDefault(); if (s) duplicate(s); }
      else if ((e.key === "Delete" || e.key === "Backspace") && s) { e.preventDefault(); remove(s); }
      else if (e.key.startsWith("Arrow") && s) {
        e.preventDefault();
        const step = (e.shiftKey ? 10 : 1) / kk;
        upd(s, (l) => ({ x: l.x + (e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0), y: l.y + (e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0) }));
      } else if (e.key === "Enter" && s && live.current.design.layers.find((l) => l.id === s)?.type === "text") { e.preventDefault(); setEditing(s); }
      else if (e.key === "Escape") { if (s) setSel(null); else requestClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  useEffect(() => {
    root.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // The live-chat bubble would sit on top of the editor, so tuck it away while the studio is open.
    try { window.Tawk_API?.hideWidget?.(); } catch { /* chat not loaded */ }
    return () => {
      document.body.style.overflow = prev;
      try { window.Tawk_API?.showWidget?.(); } catch { /* chat not loaded */ }
    };
  }, []);

  /* ----- export ----- */
  const toBlob = (c, type, q) => new Promise((res) => c.toBlob(res, type, q));
  const save = async (blob, ext) => {
    const title = layers.find((l) => l.type === "text" && /title/i.test(l.name))?.text || "book-cover";
    const name = `${slug(title)}-studio.${ext}`;
    if (isIOS() && navigator.canShare) {
      const file = new File([blob], name, { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: name }); setStatus(`Shared ${name}.`); return; } catch (e) { if (e.name === "AbortError") return; }
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    setStatus(`Downloaded ${name}.`);
  };
  const download = async (kind) => {
    setMenu(false);
    if (locked) return onLocked(curCover.name);
    setBusy(true); setStatus("Preparing your file...");
    try {
      await new Promise((r) => setTimeout(r, 30));
      const c = document.createElement("canvas");
      drawCover(c, W, H, curCover.tpl, paintState(design.bg), bgImg, design.bg.dim);
      drawLayers(c.getContext("2d"), design.layers, imgs.current, 1);
      if (kind === "png") await save(await toBlob(c, "image/png"), "png");
      if (kind === "jpg") await save(await toBlob(c, "image/jpeg", 0.95), "jpg");
      if (kind === "webp") await save(await toBlob(c, "image/webp", 0.95), "webp");
      if (kind === "pdf") {
        const jpeg = new Uint8Array(await (await toBlob(c, "image/jpeg", 0.95)).arrayBuffer());
        await save(jpegToPdf(jpeg, c.width, c.height, size.pt[0], size.pt[1]), "pdf");
      }
    } catch { setStatus("Sorry, that file could not be made. Please try again."); }
    finally { setBusy(false); }
  };

  /* ----- template swap ----- */
  // A new template brings its own title, subtitle, author and tagline styling. Those four text
  // layers are rebuilt from the new template (keeping the words the customer typed), so the text
  // always suits the new art. Shapes, images and extra text they added are left untouched.
  const TEMPLATE_TEXT = ["Title", "Subtitle", "Author", "Tagline"];
  const currentWords = () => {
    const words = { ...fields };
    [["Title", "title"], ["Subtitle", "subtitle"], ["Author", "author"], ["Tagline", "tagline"]].forEach(([name, key]) => {
      const l = layers.find((x) => x.type === "text" && x.name === name);
      if (l) words[key] = l.text;
    });
    return words;
  };
  const applyTemplate = (cv) => {
    const words = currentWords();
    const nb = { c1: cv.palette.c1, c2: cv.palette.c2, accent: cv.palette.accent, text: cv.palette.text, font: cv.font, ...cv.deco };
    ensureFont(cv.font, FONT_LIST.find((f) => f.name === cv.font)?.weight);
    const fresh = seedLayers(cv.tpl, nb, words, W, H);
    setDesign((d) => ({
      ...d,
      bg: { ...d.bg, coverId: cv.id, c1: cv.palette.c1, c2: cv.palette.c2, accent: cv.palette.accent, text: cv.palette.text, font: cv.font, deco: { ...cv.deco } },
      layers: [...fresh, ...d.layers.filter((l) => !(l.type === "text" && TEMPLATE_TEXT.includes(l.name)))],
    }));
    setSel(null);
  };
  const resetLayout = () => {
    const bg = design.bg;
    const fresh = seedLayers(curCover.tpl, { c1: bg.c1, c2: bg.c2, accent: bg.accent, text: bg.text, font: bg.font, ...bg.deco }, currentWords(), W, H);
    setDesign((d) => ({ ...d, layers: [...fresh, ...d.layers.filter((l) => !(l.type === "text" && TEMPLATE_TEXT.includes(l.name)))] }));
    setSel(null);
  };
  const shown = useMemo(() => COVERS.filter((c) => genre === "All" || c.genre === genre).slice(0, 60), [genre]);

  /* ----- overlay geometry ----- */
  const sc = selLayer ? centerOf(selLayer) : null;
  const handleSet = !selLayer ? [] : selLayer.type === "image" ? ["nw", "ne", "se", "sw"] : selLayer.type === "text" ? ["nw", "ne", "se", "sw", "e", "w"] : selLayer.kind === "line" ? ["e", "w"] : Object.keys(HANDLES);
  const editL = layers.find((l) => l.id === editing);
  const cursor = { nw: "nwse-resize", se: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize", n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize" };
  const f2 = W / 600;

  /* ----- panels ----- */
  const designPanel = (
    <>
      <h3>Templates</h3>
      <div className="stchips" role="group" aria-label="Filter templates by genre">
        {GENRES.filter((g) => g !== "Premium").map((g) => <button key={g} type="button" className={genre === g ? "is-on" : ""} onClick={() => setGenre(g)}>{g}</button>)}
      </div>
      <div className="sttpls">{shown.map((cv) => <Thumb key={cv.id} cv={cv} active={cv.id === design.bg.coverId} onPick={() => applyTemplate(cv)} />)}</div>
      <p className="stnote">Swapping a template keeps your words and anything you added, and restyles the title, subtitle and author to suit the new art.</p>
      <button type="button" className="stbtn" onClick={resetLayout}>Reset title and author layout</button>
      <h3>Colours</h3>
      <ColorField label="Background 1" value={design.bg.c1} onChange={(v) => setBg({ c1: v })} swatches={[design.bg.c1, design.bg.c2, ...SWATCHES.slice(0, 6)]} />
      <ColorField label="Background 2" value={design.bg.c2} onChange={(v) => setBg({ c2: v })} swatches={[design.bg.c1, design.bg.c2, ...SWATCHES.slice(0, 6)]} />
      <ColorField label="Accent" value={design.bg.accent} onChange={(v) => setBg({ accent: v })} />
      <h3>Background photo</h3>
      <label className="stbtn stbtn--file">Upload a photo<input type="file" accept="image/*" onChange={(e) => { addImageFile(e.target.files?.[0], true); e.target.value = ""; }} /></label>
      {design.bg.imgId && (<>
        <Range label="Darken" value={design.bg.dim} min={0} max={0.9} step={0.05} onChange={(v) => setBg({ dim: v })} />
        <button type="button" className="stbtn" onClick={() => setBg({ imgId: null })}>Remove photo</button>
      </>)}
      <h3>Finish</h3>
      <label className="stf"><span>Frame</span>
        <select value={design.bg.deco.frame || 0} onChange={(e) => setBg({ deco: { ...design.bg.deco, frame: +e.target.value } })}>{FRAMES.map((f, i) => <option key={f} value={i}>{f}</option>)}</select></label>
      <label className="stf"><span>Texture</span>
        <select value={design.bg.deco.tex || 0} onChange={(e) => setBg({ deco: { ...design.bg.deco, tex: +e.target.value } })}>{TEXTURES.map((f, i) => <option key={f} value={i}>{f}</option>)}</select></label>
      <label className="stf"><span>Lighting</span>
        <select value={design.bg.deco.vig || 0} onChange={(e) => setBg({ deco: { ...design.bg.deco, vig: +e.target.value } })}>{LIGHTING.map((f, i) => <option key={f} value={i}>{f}</option>)}</select></label>
    </>
  );

  const textPanel = (
    <>
      <h3>Add text</h3>
      <button type="button" className="stadd stadd--h" onClick={() => add(makeText("heading", W, H, design.bg))}>Add a heading</button>
      <button type="button" className="stadd stadd--s" onClick={() => add(makeText("sub", W, H, design.bg))}>Add a subheading</button>
      <button type="button" className="stadd stadd--b" onClick={() => add(makeText("body", W, H, design.bg))}>Add a little body text</button>
      <p className="stnote">Double-click any text on the cover to type. Select it to change the font, size, colour and effects.</p>
    </>
  );

  const elementsPanel = (
    <>
      <svg width="0" height="0" aria-hidden="true"><defs><linearGradient id="stfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#12294a" stopOpacity="0" /><stop offset="1" stopColor="#12294a" /></linearGradient></defs></svg>
      <h3>Shapes and lines</h3>
      <div className="stshapes">
        {SHAPES.map(([kind, label]) => (
          <button key={kind} type="button" onClick={() => add(makeShape(kind, W, H, design.bg))} aria-label={`Add ${label}`} title={label}>
            <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor" stroke="currentColor" strokeWidth={kind === "line" || kind === "frame" || kind === "ring" ? 2 : 0}>{SHAPE_ICON[kind]}</svg>
            <small>{label}</small>
          </button>
        ))}
      </div>
      <p className="stnote">Use Fade to darken the top or bottom of a cover so text is easier to read.</p>
    </>
  );

  const uploadsPanel = (
    <>
      <h3>Your images</h3>
      <label className="stbtn stbtn--file stbtn--p">Upload an image<input type="file" accept="image/*" onChange={(e) => { addImageFile(e.target.files?.[0]); e.target.value = ""; }} /></label>
      <p className="stnote">Images stay in your browser. They are never uploaded to our servers. Only use images you own or are licensed to use.</p>
      <div className="stups">
        {uploads.map((u) => <button key={u.id} type="button" onClick={() => add(makeImage(u.id, u.w, u.h, W, H))} aria-label="Add this image again"><img src={u.src} alt="" /></button>)}
      </div>
    </>
  );

  const label = (l) => (l.type === "text" ? l.text.replace(/\s+/g, " ").slice(0, 26) || "Empty text" : l.name);
  const layersPanel = (
    <>
      <h3>Layers</h3>
      {!layers.length && <p className="stnote">Nothing here yet. Add text, shapes or images.</p>}
      <ul className="stlayers">
        {[...layers].reverse().map((l) => (
          <li key={l.id} className={l.id === sel ? "is-on" : ""}>
            <button type="button" className="stlayers__main" onClick={() => { setSel(l.id); setSheet(true); }}>
              <span className="stlayers__k">{l.type === "text" ? "T" : l.type === "image" ? "Img" : "Sh"}</span>
              <span className={l.hidden ? "is-off" : ""}>{label(l)}</span>
            </button>
            <button type="button" aria-label={l.hidden ? "Show layer" : "Hide layer"} onClick={() => upd(l.id, { hidden: !l.hidden })}><Ico d={l.hidden ? ico.eyeOff : ico.eye} size={16} /></button>
            <button type="button" aria-label={l.locked ? "Unlock layer" : "Lock layer"} onClick={() => upd(l.id, { locked: !l.locked })}><Ico d={l.locked ? ico.lock : ico.unlock} size={16} /></button>
            <button type="button" aria-label="Move layer up" onClick={() => reorder(l.id, "up")}><Ico d={ico.up} size={16} /></button>
            <button type="button" aria-label="Move layer down" onClick={() => reorder(l.id, "down")}><Ico d={ico.down} size={16} /></button>
          </li>
        ))}
      </ul>
    </>
  );

  const tools = [["design", "Design", ico.design, designPanel], ["text", "Text", ico.text, textPanel], ["elements", "Elements", ico.shapes, elementsPanel], ["uploads", "Uploads", ico.upload, uploadsPanel], ["layers", "Layers", ico.layers, layersPanel]];
  const toolPanel = tools.find((t) => t[0] === tool)[3];

  const L = selLayer;
  const shadowOn = !!L?.shadow, strokeOn = !!L?.stroke;
  const props = L && (
    <>
      <div className="stqa" role="toolbar" aria-label="Layer actions">
        <button type="button" onClick={() => duplicate(L.id)} title="Duplicate (Ctrl+D)" aria-label="Duplicate"><Ico d={ico.dup} /></button>
        <button type="button" onClick={() => upd(L.id, { locked: !L.locked })} title={L.locked ? "Unlock" : "Lock"} aria-label={L.locked ? "Unlock" : "Lock"}><Ico d={L.locked ? ico.lock : ico.unlock} /></button>
        <button type="button" onClick={() => reorder(L.id, "front")} title="Bring to front" aria-label="Bring to front"><Ico d={ico.front} /></button>
        <button type="button" onClick={() => reorder(L.id, "back")} title="Send to back" aria-label="Send to back"><Ico d={ico.back} /></button>
        <button type="button" onClick={() => remove(L.id)} title="Delete (Del)" aria-label="Delete"><Ico d={ico.trash} /></button>
      </div>
      <h3>{L.type === "text" ? "Text" : L.type === "image" ? "Image" : L.name}</h3>
      {L.type === "text" && (<>
        <div className="stfonts" role="listbox" aria-label="Font">
          {FONT_LIST.map((f) => (
            <button key={f.name} type="button" role="option" aria-selected={f.name === L.font} className={f.name === L.font ? "is-on" : ""} style={{ fontFamily: `"${f.name}", serif` }}
              onClick={() => { upd(L.id, { font: f.name, weight: f.weight }); ensureFont(f.name, f.weight); }}>{f.name}</button>
          ))}
        </div>
        <label className="stf"><span>Size<b>{Math.round(L.size / f2)}</b></span>
          <div className="stsize">
            <button type="button" aria-label="Smaller" onClick={() => upd(L.id, { size: L.size * 0.92 })}><Ico d={ico.minus} size={16} /></button>
            <input type="number" min="4" max="400" value={Math.round(L.size / f2)} onChange={(e) => { const v = Number(e.target.value); if (v > 0) upd(L.id, { size: v * f2 }); }} />
            <button type="button" aria-label="Larger" onClick={() => upd(L.id, { size: L.size * 1.08 })}><Ico d={ico.plus} size={16} /></button>
          </div></label>
        <div className="strow">
          <Tgl on={L.weight >= 700} label="Bold" onClick={() => upd(L.id, { weight: L.weight >= 700 ? 400 : 800 })}><b>B</b></Tgl>
          <Tgl on={L.italic} label="Italic" onClick={() => upd(L.id, { italic: !L.italic })}><i>I</i></Tgl>
          <Tgl on={L.upper} label="Uppercase" onClick={() => upd(L.id, { upper: !L.upper })}>AA</Tgl>
          <span className="strow__gap" />
          {["left", "center", "right"].map((a) => <Tgl key={a} on={L.align === a} label={`Align ${a}`} onClick={() => upd(L.id, { align: a })}><Ico d={ico[a]} size={16} /></Tgl>)}
        </div>
        <ColorField label="Text colour" value={L.color} onChange={(v) => upd(L.id, { color: v })} swatches={[design.bg.text, design.bg.accent, ...SWATCHES]} />
        <Range label="Letter spacing" value={L.track} min={-0.05} max={0.5} step={0.01} onChange={(v) => upd(L.id, { track: v })} />
        <Range label="Line spacing" value={L.lh} min={0.7} max={2} step={0.05} onChange={(v) => upd(L.id, { lh: v })} />
        <div className="strow"><Tgl on={shadowOn} label="Shadow" onClick={() => upd(L.id, { shadow: shadowOn ? null : { color: "#000000", blur: 0.25, y: 0.06 } })}>Shadow</Tgl>
          <Tgl on={strokeOn} label="Outline" onClick={() => upd(L.id, { stroke: strokeOn ? null : { color: design.bg.accent, w: 0.06 } })}>Outline</Tgl></div>
        {shadowOn && (<>
          <ColorField label="Shadow colour" value={L.shadow.color} onChange={(v) => upd(L.id, { shadow: { ...L.shadow, color: v } })} />
          <Range label="Shadow softness" value={L.shadow.blur} min={0} max={1} step={0.05} onChange={(v) => upd(L.id, { shadow: { ...L.shadow, blur: v } })} />
        </>)}
        {strokeOn && (<>
          <ColorField label="Outline colour" value={L.stroke.color} onChange={(v) => upd(L.id, { stroke: { ...L.stroke, color: v } })} />
          <Range label="Outline width" value={L.stroke.w} min={0.01} max={0.2} step={0.01} onChange={(v) => upd(L.id, { stroke: { ...L.stroke, w: v } })} />
        </>)}
        <button type="button" className="stbtn" onClick={() => setEditing(L.id)}>Edit the words</button>
      </>)}
      {L.type === "shape" && (<>
        {L.kind !== "line" && L.kind !== "frame" && L.kind !== "ring" && <ColorField label={L.kind === "fade" ? "Fade colour" : "Fill"} value={L.fill} onChange={(v) => upd(L.id, { fill: v })} swatches={[design.bg.accent, design.bg.c1, ...SWATCHES]} />}
        {L.kind !== "fade" && <ColorField label={L.kind === "line" || L.kind === "frame" || L.kind === "ring" ? "Colour" : "Outline"} value={L.stroke} onChange={(v) => upd(L.id, { stroke: v })} swatches={[design.bg.accent, design.bg.text, ...SWATCHES]} />}
        {L.kind !== "fade" && <Range label={L.kind === "line" ? "Thickness" : "Outline width"} value={L.sw} min={0} max={W * 0.05} step={1} onChange={(v) => upd(L.id, { sw: v, ...(L.kind === "line" ? { h: Math.max(14, v) } : {}) })} />}
        {L.kind === "round" && <Range label="Roundness" value={L.radius} min={0} max={1} step={0.05} onChange={(v) => upd(L.id, { radius: v })} />}
        {L.kind === "fade" && (<div className="strow"><Tgl on={L.dir !== "up"} label="Fade from the bottom" onClick={() => upd(L.id, { dir: "down" })}>From bottom</Tgl><Tgl on={L.dir === "up"} label="Fade from the top" onClick={() => upd(L.id, { dir: "up" })}>From top</Tgl></div>)}
      </>)}
      {L.type === "image" && (<>
        <div className="strow"><Tgl on={L.flipX} label="Flip horizontally" onClick={() => upd(L.id, { flipX: !L.flipX })}>Flip left/right</Tgl><Tgl on={L.flipY} label="Flip vertically" onClick={() => upd(L.id, { flipY: !L.flipY })}>Flip up/down</Tgl></div>
        <Range label="Rounded corners" value={L.radius} min={0} max={1} step={0.05} onChange={(v) => upd(L.id, { radius: v })} />
        <button type="button" className="stbtn" onClick={() => { imgs.current.set("bg", imgs.current.get(L.imgId)); setBg({ imgId: "bg" }); remove(L.id); setTick((t) => t + 1); }}>Use as background</button>
      </>)}
      <Range label="Opacity" value={L.opacity} min={0.05} max={1} step={0.05} onChange={(v) => upd(L.id, { opacity: v })} />
      <Range label="Rotation" value={L.rot} min={-180} max={180} step={1} unit="°" onChange={(v) => upd(L.id, { rot: v })} />
      <h3>Position</h3>
      <div className="strow stalign">
        {[["left", "Left"], ["center", "Centre"], ["right", "Right"], ["top", "Top"], ["middle", "Middle"], ["bottom", "Bottom"]].map(([h, t]) => <button key={h} type="button" onClick={() => alignPage(L.id, h)}>{t}</button>)}
      </div>
    </>
  );

  const help = (
    <>
      <h3>Edit your cover</h3>
      <ul className="sthelp">
        <li><b>Click</b> anything on the cover to select it, then <b>drag</b> to move.</li>
        <li><b>Double-click</b> text to type. Drag a corner to resize, the round handle to rotate.</li>
        <li><b>Arrow keys</b> nudge. <b>Shift</b> nudges faster and snaps rotation. <b>Alt</b> turns off snapping.</li>
        <li><b>Ctrl+Z</b> undo, <b>Ctrl+Shift+Z</b> redo, <b>Ctrl+D</b> duplicate, <b>Delete</b> removes.</li>
      </ul>
      <p className="stnote">This studio edits the front cover. Use the quick form on the page for the back cover, spine and full wrap.</p>
      <button type="button" className="stbtn" onClick={() => { onQuick(); }}>Back to the quick form</button>
    </>
  );

  return (
    <div className={"st" + (L ? " st--sel" : "") + (sheet ? "" : " st--noSheet")} role="dialog" aria-modal="true" aria-label="Cover studio" ref={root} tabIndex={-1}>
      <header className="st__top">
        <button type="button" className="st__x" onClick={requestClose} aria-label="Close the studio"><Ico d={ico.close} /></button>
        <strong className="st__name">Cover studio<small>{curCover.name}</small></strong>
        <span className="st__sp" />
        <button type="button" className="st__ib" onClick={undo} disabled={!canUndo && JSON.stringify(design) === hist.current.stack[hist.current.i]} aria-label="Undo"><Ico d={ico.undo} /></button>
        <button type="button" className="st__ib" onClick={redo} disabled={!canRedo} aria-label="Redo"><Ico d={ico.redo} /></button>
        <div className="st__zoom" role="group" aria-label="Zoom">
          <button type="button" onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)))} aria-label="Zoom out"><Ico d={ico.minus} size={16} /></button>
          <button type="button" onClick={() => setZoom(1)} aria-label="Fit to screen">{Math.round(zoom * 100)}%</button>
          <button type="button" onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))} aria-label="Zoom in"><Ico d={ico.plus} size={16} /></button>
        </div>
        <div className="st__dl">
          <button type="button" className="st__dlbtn" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-haspopup="menu" disabled={busy}><Ico d={ico.download} size={18} /> {locked ? "Unlock & download" : "Download"}</button>
          {menu && (
            <div className="st__menu" role="menu">
              {[["png", "PNG", "Best quality"], ["jpg", "JPG", "Smaller file"], ["pdf", "PDF", "For printing"], ["webp", "WebP", "Web and apps"]].map(([kk, t, h]) => (
                <button key={kk} type="button" role="menuitem" onClick={() => download(kk)}><strong>{t}</strong><small>{h}</small></button>
              ))}
              <p>{size.w} x {size.h} px, front cover</p>
            </div>
          )}
        </div>
      </header>

      <nav className="st__rail" aria-label="Studio tools">
        {tools.map(([id, name, d]) => (
          <button key={id} type="button" className={tool === id ? "is-on" : ""} aria-pressed={tool === id} onClick={() => { if (tool === id) setSheet((v) => !v); else { setTool(id); setSheet(true); } setSel(null); }}>
            <Ico d={d} /><span>{name}</span>
          </button>
        ))}
      </nav>

      <aside className="st__panel" aria-label={tools.find((t) => t[0] === tool)[1]}>{toolPanel}</aside>

      <main className="st__stage" ref={stage} onPointerDown={(e) => { if (e.target === e.currentTarget || e.target.classList.contains("st__pad")) { setSel(null); setEditing(null); } }}>
        <div className="st__pad" style={{ minWidth: cssW + 40, minHeight: cssH + 40 }}>
          <div className="st__board" style={{ width: cssW, height: cssH }}>
            <canvas ref={canvas} width={bw} height={bh} style={{ width: cssW, height: cssH }} onPointerDown={onCanvasDown} onDoubleClick={onCanvasDouble} aria-label="Cover preview. Click an item to edit it." />
            <div className="st__over">
              {guides.map((g, i) => <i key={i} className={"st__guide st__guide--" + g.axis} style={g.axis === "v" ? { left: g.pos * k } : { top: g.pos * k }} />)}
              {L && sc && !editing && (
                <div className={"st__sel" + (L.locked ? " is-locked" : "")} style={{ left: sc.x * k, top: sc.y * k, width: sc.w * k, height: sc.h * k, transform: `translate(-50%,-50%) rotate(${L.rot}deg)` }}>
                  {!L.locked && (<>
                    {handleSet.map((h) => <span key={h} className={"st__h st__h--" + h} style={{ cursor: cursor[h] }} onPointerDown={(e) => onHandle(e, h)} />)}
                    <span className="st__rot" onPointerDown={onRotate} title="Rotate" aria-hidden="true"><Ico d={ico.rotate} size={14} /></span>
                  </>)}
                </div>
              )}
              {editL && (() => {
                const c = centerOf(editL);
                return (
                  <textarea
                    className="st__edit" autoFocus value={editL.text}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => upd(editL.id, { text: e.target.value })}
                    onBlur={() => setEditing(null)}
                    style={{ left: c.x * k, top: c.y * k, width: c.w * k, height: Math.max(c.h, editL.size * editL.lh) * k, transform: `translate(-50%,-50%) rotate(${editL.rot}deg)`, font: `${editL.italic ? "italic " : ""}${editL.weight} ${editL.size * k}px/${editL.lh} "${editL.font}", serif`, color: editL.color, textAlign: editL.align, letterSpacing: `${editL.track * editL.size * k}px`, textTransform: editL.upper ? "uppercase" : "none" }}
                    aria-label="Edit text"
                  />
                );
              })()}
            </div>
          </div>
        </div>
        {status && <p className="st__status" role="status">{status}</p>}
        {locked && <p className="st__lock">Premium design: the preview has a watermark. Download to unlock.</p>}
      </main>

      <aside className="st__props" aria-label="Properties">
        {L ? props : help}
        {L && <button type="button" className="st__sheetx" onClick={() => setSel(null)}>Done</button>}
      </aside>
    </div>
  );
}
