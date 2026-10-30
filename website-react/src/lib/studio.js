import { FONTS, drawCover, drawBack, wrapDims } from "./coverTemplates.js";

// Engine for the cover studio: a layer model (text, images, shapes), drawing, hit-testing and
// the geometry for moving, resizing and rotating. Everything is in "design units" = pixels of
// the final cover (for example 1800 x 2700), so the same design renders at any zoom or export size.

// Fonts the studio offers, grouped so customers can browse by mood. All are free Google Fonts.
// `css` is the Google Fonts family string. Each family is requested on demand, the first time it
// is shown or used, so the studio never downloads the whole catalogue up front. The first eight
// are the template fonts, which the cover maker page already loads.
export const FONT_CATS = ["Serif", "Sans", "Bold display", "Script", "Handwriting", "Fantasy & horror", "Sci-fi & tech"];
const F = (cat, name, weight = 400, css) => ({ cat, name, weight, css: css === undefined ? name.replace(/ /g, "+") : css });
const W = (name, spec) => name.replace(/ /g, "+") + ":wght@" + spec;

export const FONT_LIST = [
  // template fonts (already loaded by the page)
  F("Serif", "Playfair Display", 800, ""), F("Serif", "Cinzel", 700, ""), F("Bold display", "Bebas Neue", 400, ""), F("Script", "Great Vibes", 400, ""),
  F("Serif", "Cormorant Garamond", 700, ""), F("Sans", "Oswald", 600, ""), F("Sans", "Montserrat", 800, ""), F("Bold display", "Fredoka", 600, ""),
  // serif
  F("Serif", "Lora", 700, W("Lora", "400;700")), F("Serif", "Libre Baskerville", 700, W("Libre Baskerville", "400;700")),
  F("Serif", "Merriweather", 700, W("Merriweather", "400;700")), F("Serif", "Crimson Text", 700, W("Crimson Text", "400;700")),
  F("Serif", "EB Garamond", 700, W("EB Garamond", "400;700")), F("Serif", "DM Serif Display"), F("Serif", "Bodoni Moda", 700, W("Bodoni Moda", "400;700")),
  F("Serif", "Spectral", 700, W("Spectral", "400;700")), F("Serif", "Rozha One"), F("Serif", "Old Standard TT", 700, W("Old Standard TT", "400;700")),
  F("Serif", "Cardo", 700, W("Cardo", "400;700")), F("Serif", "Fraunces", 700, W("Fraunces", "400;700")), F("Serif", "Yeseva One"), F("Serif", "Gloock"),
  F("Serif", "Abril Fatface"), F("Serif", "Cinzel Decorative", 700, W("Cinzel Decorative", "400;700")),
  // sans
  F("Sans", "Poppins", 700, W("Poppins", "400;700")), F("Sans", "Raleway", 800, W("Raleway", "400;800")), F("Sans", "Inter", 700, W("Inter", "400;700")),
  F("Sans", "Work Sans", 700, W("Work Sans", "400;700")), F("Sans", "Nunito", 800, W("Nunito", "400;800")), F("Sans", "Josefin Sans", 700, W("Josefin Sans", "400;700")),
  F("Sans", "Quicksand", 700, W("Quicksand", "400;700")), F("Sans", "Lato", 700, W("Lato", "400;700")), F("Sans", "Open Sans", 700, W("Open Sans", "400;700")),
  F("Sans", "Barlow", 700, W("Barlow", "400;700")), F("Sans", "Rubik", 700, W("Rubik", "400;700")), F("Sans", "DM Sans", 700, W("DM Sans", "400;700")),
  // bold display
  F("Bold display", "Anton"), F("Bold display", "Archivo Black"), F("Bold display", "Alfa Slab One"), F("Bold display", "Bangers"),
  F("Bold display", "Black Ops One"), F("Bold display", "Russo One"), F("Bold display", "Staatliches"), F("Bold display", "Fjalla One"),
  F("Bold display", "Righteous"), F("Bold display", "Monoton"), F("Bold display", "Lilita One"), F("Bold display", "Titan One"),
  F("Bold display", "Bungee"), F("Bold display", "Teko", 600, W("Teko", "400;600")), F("Bold display", "Big Shoulders Display", 800, W("Big Shoulders Display", "400;800")),
  // script
  F("Script", "Dancing Script", 700, W("Dancing Script", "400;700")), F("Script", "Pacifico"), F("Script", "Lobster"), F("Script", "Satisfy"),
  F("Script", "Sacramento"), F("Script", "Allura"), F("Script", "Alex Brush"), F("Script", "Parisienne"), F("Script", "Tangerine", 700, W("Tangerine", "400;700")),
  F("Script", "Yellowtail"), F("Script", "Kaushan Script"), F("Script", "Cookie"), F("Script", "Playball"), F("Script", "Italianno"), F("Script", "Marck Script"),
  // handwriting and typewriter
  F("Handwriting", "Caveat", 700, W("Caveat", "400;700")), F("Handwriting", "Permanent Marker"), F("Handwriting", "Special Elite"),
  F("Handwriting", "Amatic SC", 700, W("Amatic SC", "400;700")), F("Handwriting", "Shadows Into Light"), F("Handwriting", "Indie Flower"),
  F("Handwriting", "Gloria Hallelujah"), F("Handwriting", "Rock Salt"), F("Handwriting", "Patrick Hand"), F("Handwriting", "Architects Daughter"),
  F("Handwriting", "Covered By Your Grace"), F("Handwriting", "Courier Prime", 700, W("Courier Prime", "400;700")),
  // fantasy and horror
  F("Fantasy & horror", "Creepster"), F("Fantasy & horror", "Nosifer"), F("Fantasy & horror", "Eater"), F("Fantasy & horror", "Metal Mania"),
  F("Fantasy & horror", "MedievalSharp"), F("Fantasy & horror", "Uncial Antiqua"), F("Fantasy & horror", "Almendra", 700, W("Almendra", "400;700")),
  F("Fantasy & horror", "Pirata One"), F("Fantasy & horror", "UnifrakturCook", 700, W("UnifrakturCook", "700")), F("Fantasy & horror", "New Rocker"),
  F("Fantasy & horror", "Grenze Gotisch", 700, W("Grenze Gotisch", "400;700")),
  // sci-fi and tech
  F("Sci-fi & tech", "Orbitron", 700, W("Orbitron", "400;700")), F("Sci-fi & tech", "Audiowide"), F("Sci-fi & tech", "Michroma"),
  F("Sci-fi & tech", "Exo 2", 700, W("Exo 2", "400;700")), F("Sci-fi & tech", "Rajdhani", 700, W("Rajdhani", "400;700")), F("Sci-fi & tech", "Aldrich"),
  F("Sci-fi & tech", "Syncopate", 700, W("Syncopate", "400;700")), F("Sci-fi & tech", "Press Start 2P"), F("Sci-fi & tech", "VT323"),
  F("Sci-fi & tech", "Space Mono", 700, W("Space Mono", "400;700")),
];

// Adds the Google Fonts stylesheet for one family, once, and resolves when the font is ready to draw.
// One stylesheet per family means a single unavailable font can never break the others.
const requested = new Set();
export function loadFamily(name, weight) {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  const f = FONT_LIST.find((x) => x.name === name);
  if (f?.css && !requested.has(name)) {
    requested.add(name);
    const id = "studio-font-" + name.replace(/\s+/g, "-");
    if (!document.getElementById(id)) {
      document.head.appendChild(Object.assign(document.createElement("link"), { id, rel: "stylesheet", href: `https://fonts.googleapis.com/css2?family=${f.css}&display=swap` }));
    }
  }
  return document.fonts.load(`${weight || f?.weight || 400} 40px "${name}"`).catch(() => null);
}

let counter = 0;
export const uid = () => "L" + ++counter + Math.random().toString(36).slice(2, 6);

/* ---------- text layout ---------- */
let mctx = null;
const measureCtx = () => (mctx ||= document.createElement("canvas").getContext("2d"));

export function setFont(ctx, l, size = l.size) {
  ctx.font = `${l.italic ? "italic " : ""}${l.weight} ${size}px "${l.font}", serif`;
  ctx.letterSpacing = `${l.track * size}px`;
}

export function layoutText(l) {
  const ctx = measureCtx();
  setFont(ctx, l);
  const raw = l.upper ? l.text.toUpperCase() : l.text;
  const lines = [];
  raw.split("\n").forEach((par) => {
    const words = par.split(/\s+/).filter(Boolean);
    if (!words.length) { lines.push(""); return; }
    let cur = "";
    for (const w of words) {
      const t = cur ? cur + " " + w : w;
      if (ctx.measureText(t).width > l.w && cur) { lines.push(cur); cur = w; } else cur = t;
    }
    lines.push(cur);
  });
  const lineH = l.size * l.lh;
  return { lines, lineH, h: Math.max(1, lines.length) * lineH };
}

export const boxOf = (l) => ({ w: l.w, h: l.type === "text" ? layoutText(l).h : l.h });
export const centerOf = (l) => { const b = boxOf(l); return { x: l.x + b.w / 2, y: l.y + b.h / 2, w: b.w, h: b.h }; };

/* ---------- drawing ---------- */
function roundRectPath(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function shapePath(ctx, l, w, h) {
  const x = -w / 2, y = -h / 2;
  switch (l.kind) {
    case "circle": case "ring": ctx.beginPath(); ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2); break;
    case "triangle": ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); break;
    case "star": {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 0.42 : 1;
        const px = Math.cos(a) * r * (w / 2), py = Math.sin(a) * r * (h / 2);
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath(); break;
    }
    case "heart":
      ctx.beginPath();
      ctx.moveTo(0, y + h * 0.3);
      ctx.bezierCurveTo(0, y, x, y, x, y + h * 0.32);
      ctx.bezierCurveTo(x, y + h * 0.62, 0, y + h * 0.8, 0, y + h);
      ctx.bezierCurveTo(0, y + h * 0.8, x + w, y + h * 0.62, x + w, y + h * 0.32);
      ctx.bezierCurveTo(x + w, y, 0, y, 0, y + h * 0.3);
      ctx.closePath(); break;
    case "round": roundRectPath(ctx, x, y, w, h, l.radius * Math.min(w, h) / 2); break;
    default: ctx.beginPath(); ctx.rect(x, y, w, h);
  }
}

function drawShape(ctx, l) {
  const { w, h } = l;
  if (l.kind === "line") {
    ctx.strokeStyle = l.stroke; ctx.lineWidth = l.sw; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.stroke();
    return;
  }
  if (l.kind === "fade") {
    const top = l.dir === "up";
    // Fades to the same colour at zero alpha, so it looks clean on any background.
    const c = hexToRgb(l.fill);
    const clear = `rgba(${c.r},${c.g},${c.b},0)`;
    const g2 = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    g2.addColorStop(0, top ? l.fill : clear); g2.addColorStop(1, top ? clear : l.fill);
    ctx.fillStyle = g2; ctx.fillRect(-w / 2, -h / 2, w, h);
    return;
  }
  const outlineOnly = l.kind === "frame" || l.kind === "ring";
  shapePath(ctx, l, w, h);
  if (!outlineOnly && l.fill && l.fill !== "none") { ctx.fillStyle = l.fill; ctx.fill(); }
  if (l.sw > 0 && l.stroke && l.stroke !== "none") {
    ctx.strokeStyle = l.stroke; ctx.lineWidth = l.sw; ctx.lineJoin = "round";
    if (l.kind === "frame") { ctx.beginPath(); ctx.rect(-w / 2 + l.sw / 2, -h / 2 + l.sw / 2, w - l.sw, h - l.sw); }
    ctx.stroke();
  }
}

function drawText(ctx, l) {
  const { lines, lineH, h } = layoutText(l);
  setFont(ctx, l);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = l.align;
  const x = l.align === "left" ? -l.w / 2 : l.align === "right" ? l.w / 2 : (l.track * l.size) / 2;
  let y = -h / 2 + l.size * 0.85;
  lines.forEach((line) => {
    if (l.stroke) {
      ctx.lineJoin = "round"; ctx.lineWidth = l.stroke.w * l.size; ctx.strokeStyle = l.stroke.color;
      ctx.strokeText(line, x, y);
    }
    if (l.shadow) { ctx.shadowColor = l.shadow.color; ctx.shadowBlur = l.shadow.blur * l.size; ctx.shadowOffsetY = l.shadow.y * l.size; }
    ctx.fillStyle = l.color;
    ctx.fillText(line, x, y);
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    y += lineH;
  });
  ctx.letterSpacing = "0px";
}

function drawImageLayer(ctx, l, img) {
  if (!img) return;
  if (l.radius > 0) { roundRectPath(ctx, -l.w / 2, -l.h / 2, l.w, l.h, (l.radius * Math.min(l.w, l.h)) / 2); ctx.clip(); }
  ctx.scale(l.flipX ? -1 : 1, l.flipY ? -1 : 1);
  ctx.drawImage(img, -l.w / 2, -l.h / 2, l.w, l.h);
}

// Draws the layers bottom to top. `skipId` leaves one layer out (the one being typed into).
export function drawLayers(ctx, layers, imgs, scale = 1, skipId = null) {
  for (const l of layers) {
    if (l.hidden || l.id === skipId) continue;
    const c = centerOf(l);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(c.x, c.y);
    ctx.rotate((l.rot * Math.PI) / 180);
    ctx.globalAlpha = l.opacity;
    if (l.type === "text") drawText(ctx, l);
    else if (l.type === "image") drawImageLayer(ctx, l, imgs.get(l.imgId));
    else drawShape(ctx, l);
    ctx.restore();
  }
}

/* ---------- geometry ---------- */
const rad = (d) => (d * Math.PI) / 180;
export const rotatePoint = (x, y, deg) => { const a = rad(deg), c = Math.cos(a), s = Math.sin(a); return { x: x * c - y * s, y: x * s + y * c }; };

export function hitTest(layers, px, py) {
  for (let i = layers.length - 1; i >= 0; i--) {
    const l = layers[i];
    if (l.hidden || l.locked) continue;
    const c = centerOf(l);
    const p = rotatePoint(px - c.x, py - c.y, -l.rot);
    const padY = l.type === "shape" && l.kind === "line" ? 14 : 0;
    if (Math.abs(p.x) <= c.w / 2 && Math.abs(p.y) <= c.h / 2 + padY) return l.id;
  }
  return null;
}

// Axis-aligned bounds of a rotated layer.
export function aabb(l) {
  const c = centerOf(l), a = rad(l.rot), cs = Math.abs(Math.cos(a)), sn = Math.abs(Math.sin(a));
  const w = c.w * cs + c.h * sn, h = c.w * sn + c.h * cs;
  return { cx: c.x, cy: c.y, w, h };
}

// Snaps a moved layer to the page edges, margins, centre and to other layers. Returns the
// nudge to apply and the guide lines to show.
export function snapMove(layer, others, W, H, threshold) {
  const b = aabb(layer);
  const xs = [W / 2, 0, W, W * 0.06, W * 0.94], ys = [H / 2, 0, H, H * 0.04, H * 0.96];
  others.forEach((o) => {
    const ob = aabb(o);
    xs.push(ob.cx, ob.cx - ob.w / 2, ob.cx + ob.w / 2);
    ys.push(ob.cy, ob.cy - ob.h / 2, ob.cy + ob.h / 2);
  });
  const best = (own, targets) => {
    let d = null, at = null;
    for (const t of targets) for (const o of own) { const diff = t - o; if (Math.abs(diff) <= threshold && (d === null || Math.abs(diff) < Math.abs(d))) { d = diff; at = t; } }
    return { d, at };
  };
  const bx = best([b.cx, b.cx - b.w / 2, b.cx + b.w / 2], xs);
  const by = best([b.cy, b.cy - b.h / 2, b.cy + b.h / 2], ys);
  const guides = [];
  if (bx.d !== null) guides.push({ axis: "v", pos: bx.at });
  if (by.d !== null) guides.push({ axis: "h", pos: by.at });
  return { dx: bx.d || 0, dy: by.d || 0, guides };
}

export const HANDLES = { nw: [-1, -1], n: [0, -1], ne: [1, -1], e: [1, 0], se: [1, 1], s: [0, 1], sw: [-1, 1], w: [-1, 0] };

// Resize a layer by dragging a handle. `p` is the pointer in design units. The opposite side or
// corner stays put, even when the layer is rotated.
export function resizeLayer(orig, handle, p, { keepAspect } = {}) {
  const [dx, dy] = HANDLES[handle];
  const c = centerOf(orig);
  const local = rotatePoint(p.x - c.x, p.y - c.y, -orig.rot);
  const anchor = { x: -dx * (c.w / 2), y: -dy * (c.h / 2) };
  const MIN = 24;
  let nw = dx ? Math.max(MIN, (local.x - anchor.x) * dx) : c.w;
  let nh = dy ? Math.max(MIN, (local.y - anchor.y) * dy) : c.h;
  const corner = dx && dy;
  let scale = 1;
  if (orig.type === "text") {
    if (corner) { scale = Math.max(nw / c.w, nh / c.h); nw = c.w * scale; nh = c.h * scale; }
    else if (dy) { nh = c.h; }
  } else if (corner && keepAspect) {
    scale = Math.max(nw / c.w, nh / c.h); nw = c.w * scale; nh = c.h * scale;
  }
  const lc = { x: anchor.x + dx * (nw / 2), y: anchor.y + dy * (nh / 2) };
  const wc = rotatePoint(lc.x, lc.y, orig.rot);
  const cx = c.x + wc.x, cy = c.y + wc.y;
  const next = { ...orig, w: nw, x: cx - nw / 2 };
  if (orig.type === "text") {
    if (corner) next.size = orig.size * scale;
    next.y = cy - nh / 2;
  } else { next.h = nh; next.y = cy - nh / 2; }
  return next;
}

/* ---------- creating layers ---------- */
const base = (type, name, over) => ({ id: uid(), type, name, x: 0, y: 0, w: 100, h: 100, rot: 0, opacity: 1, locked: false, hidden: false, ...over });

export function makeText(kind, W, H, bg) {
  const presets = {
    heading: { text: "Add a heading", size: W * 0.085, weight: 800, lh: 1.05, track: 0, font: bg.font },
    sub: { text: "Add a subheading", size: W * 0.045, weight: 600, lh: 1.15, track: 0.02, font: bg.font },
    body: { text: "Add a little body text here", size: W * 0.03, weight: 500, lh: 1.35, track: 0, font: "Montserrat" },
  };
  const p = presets[kind] || presets.body;
  const w = W * 0.8;
  const l = base("text", kind === "heading" ? "Heading" : kind === "sub" ? "Subheading" : "Text", {
    ...p, italic: false, color: bg.text, align: "center", upper: false, shadow: null, stroke: null, w, x: (W - w) / 2, y: H * 0.42,
  });
  return l;
}

export function makeShape(kind, W, H, bg) {
  const s = W * 0.3;
  const names = { rect: "Rectangle", round: "Rounded box", circle: "Circle", triangle: "Triangle", star: "Star", heart: "Heart", line: "Line", frame: "Frame", ring: "Ring", fade: "Fade" };
  const common = { kind, fill: bg.accent, stroke: bg.accent, sw: 0, radius: 0.35, dir: "down" };
  let over = { w: s, h: s, x: (W - s) / 2, y: (H - s) / 2 };
  if (kind === "line") over = { w: W * 0.5, h: 14, x: W * 0.25, y: H / 2, sw: W * 0.008, fill: "none" };
  else if (kind === "frame") over = { w: W * 0.86, h: H * 0.88, x: W * 0.07, y: H * 0.06, sw: W * 0.012, fill: "none" };
  else if (kind === "ring") over = { sw: W * 0.012, fill: "none" };
  else if (kind === "fade") over = { w: W, h: H * 0.4, x: 0, y: H * 0.6, fill: "#000000" };
  else if (kind === "rect" || kind === "round") over = { ...over, w: W * 0.6, h: W * 0.2, x: W * 0.2 };
  return base("shape", names[kind] || "Shape", { ...common, ...over });
}

export function makeImage(imgId, iw, ih, W, H) {
  const w = Math.min(W * 0.62, iw), h = (w * ih) / iw;
  return base("image", "Image", { imgId, iw, ih, w, h, x: (W - w) / 2, y: (H - h) / 2, flipX: false, flipY: false, radius: 0 });
}

export function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  const n = m ? parseInt(m[1], 16) : 0;
  return { r: n >> 16, g: (n >> 8) & 255, b: n & 255 };
}

/* ---------- turning a template's own title, author and tagline into layers ---------- */
// The template is drawn once while every fillText call is recorded. The recorded lines are
// grouped by field, which gives each text layer the exact font, size, colour and position the
// template used, so the customer starts from the real design and can move anything.
export const FRONT_TEXT = [["title", "Title"], ["subtitle", "Subtitle"], ["author", "Author"], ["tagline", "Tagline"]];
export const BACK_TEXT = [["blurb", "Description"], ["bio", "About the author"], ["website", "Website"], ["tagline", "Tagline"]];

export function seedLayers(tpl, state, fields, W, H, side = "front") {
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  const rec = [];
  const orig = ctx.fillText.bind(ctx);
  ctx.fillText = (t, x, y, mw) => {
    rec.push({ t: String(t), x, y, font: ctx.font, fill: ctx.fillStyle, align: ctx.textAlign, ls: parseFloat(ctx.letterSpacing) || 0, sc: ctx.shadowColor, sb: ctx.shadowBlur, so: ctx.shadowOffsetY, w: ctx.measureText(String(t)).width });
    orig(t, x, y, mw);
  };
  (side === "back" ? drawBack : drawCover)(c, W, H, tpl, { ...state, ...fields }, null, 0);

  const keys = side === "back" ? BACK_TEXT : FRONT_TEXT;
  const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  const groups = new Map(keys.map(([k]) => [k, []]));
  rec.forEach((r) => {
    const rt = norm(r.t);
    if (rt.length < 2) return;
    let hit = null;
    for (const [k] of keys) {
      const f = norm(fields[k]);
      if (f && (f.includes(rt) || rt.includes(f)) && (!hit || f.length > norm(fields[hit]).length)) hit = k;
    }
    if (hit) groups.get(hit).push(r);
  });

  const layers = [];
  keys.forEach(([k, name]) => {
    const rs = groups.get(k);
    if (!rs.length || !fields[k]) return;
    const seen = new Set();
    const uniq = rs.filter((r) => { const key = r.t + "|" + Math.round(r.y); if (seen.has(key)) return false; seen.add(key); return true; }).sort((a, b) => a.y - b.y);
    const f = uniq[0];
    const size = parseFloat(/([\d.]+)px/.exec(f.font)?.[1]) || W * 0.05;
    const weight = /(?:^|\s)(\d{3})\s/.exec(f.font)?.[1] || (/bold/.test(f.font) ? 700 : 400);
    const family = (/px\s+(.*)$/.exec(f.font)?.[1] || "serif").split(",")[0].replace(/["']/g, "").trim();
    let left = Infinity, right = -Infinity;
    uniq.forEach((r) => {
      const l = r.align === "left" ? r.x : r.align === "right" ? r.x - r.w : r.x - r.w / 2;
      left = Math.min(left, l); right = Math.max(right, l + r.w);
    });
    const pad = size * 0.12;
    const lineH = uniq.length > 1 ? (uniq[uniq.length - 1].y - uniq[0].y) / (uniq.length - 1) : size * 1.08;
    const w = right - left + pad * 2;
    const hasShadow = f.sc && f.sc !== "transparent" && f.sc !== "rgba(0, 0, 0, 0)" && f.sb > 0;
    const shown = uniq.map((r) => r.t).join(" ");
    layers.push({
      ...base("text", name, {
        text: String(fields[k]), font: family, weight: Number(weight), italic: /italic/.test(f.font),
        size, color: typeof f.fill === "string" ? f.fill : state.text, align: f.align === "start" ? "left" : f.align,
        lh: Math.max(0.7, lineH / size), track: f.ls / size,
        upper: shown === shown.toUpperCase() && String(fields[k]) !== String(fields[k]).toUpperCase(),
        shadow: hasShadow ? { color: f.sc, blur: f.sb / size, y: f.so / size } : null, stroke: null,
        w, x: left - pad, y: uniq[0].y - size * 0.85,
      }),
    });
  });
  return layers;
}

/* ---------- full print wrap: back + spine + front with bleed ---------- */
// Front and back are finished panels (art plus layers). Each is placed at its trim position and a
// stretched copy fills the bleed, which is trimmed off when printed. The spine is drawn like the
// quick editor draws it, with the title and author from the front layers.
export function composeWrap(size, pages, bg, frontC, backC, title, author) {
  const d = wrapDims(size, pages);
  const c = document.createElement("canvas");
  c.width = d.w; c.height = d.h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = bg.c1; ctx.fillRect(0, 0, d.w, d.h);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, d.pw, d.ph); ctx.clip();
  ctx.drawImage(backC, 0, 0, d.pw, d.ph); ctx.drawImage(backC, d.bleed, d.bleed); ctx.restore();
  const x1 = d.pw + d.spine;
  ctx.save(); ctx.beginPath(); ctx.rect(x1, 0, d.pw, d.ph); ctx.clip();
  ctx.drawImage(frontC, x1, 0, d.pw, d.ph); ctx.drawImage(frontC, x1, d.bleed); ctx.restore();
  const x0 = d.pw;
  ctx.fillStyle = bg.c2; ctx.fillRect(x0, 0, d.spine, d.h);
  ctx.fillStyle = bg.accent; ctx.fillRect(x0, 0, d.spine, d.h * 0.012); ctx.fillRect(x0, d.h * 0.988, d.spine, d.h * 0.012);
  if (d.spineIn >= 0.18) {
    ctx.save(); ctx.translate(x0 + d.spine / 2, d.h / 2); ctx.rotate(Math.PI / 2);
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.letterSpacing = "0px";
    const ts = Math.min(d.spine * 0.5, d.h * 0.05);
    ctx.fillStyle = bg.text; ctx.font = `700 ${ts}px "${bg.font}", serif`; ctx.fillText(String(title || "").slice(0, 40), -d.h * 0.1, 0);
    ctx.fillStyle = bg.accent; ctx.font = `700 ${ts * 0.7}px "Montserrat", sans-serif`; ctx.fillText(String(author || "").toUpperCase().slice(0, 30), d.h * 0.32, 0);
    ctx.restore();
  }
  return { canvas: c, dims: d };
}
