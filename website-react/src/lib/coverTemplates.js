import { createSVGContext } from "./svgContext.js";
import { EXTRA } from "./extraTemplates.js";
import { KEEP } from "../data/coverKeep.js";
import { DARK, LIGHT } from "../data/palettes.js";

// Original, code-drawn book cover templates. Everything is drawn on a canvas in
// relative units (u = 1% of cover width) so one design renders at any size.

export const FONTS = {
  "Playfair Display": { weight: 800 },
  Cinzel: { weight: 700 },
  "Bebas Neue": { weight: 400 },
  "Great Vibes": { weight: 400 },
  "Cormorant Garamond": { weight: 700 },
  Oswald: { weight: 600 },
  Montserrat: { weight: 800 },
  Fredoka: { weight: 600 },
};

export const SIZES = [
  { id: "kdp", label: "Paperback 6 x 9 in", w: 1800, h: 2700, pt: [432, 648], print: true },
  { id: "ebook", label: "Ebook 1600 x 2560 px", w: 1600, h: 2560, pt: [400, 640] },
  { id: "small", label: "Paperback 5.5 x 8.5 in", w: 1650, h: 2550, pt: [396, 612], print: true },
];

export const GENRES = ["All", "Premium","Thriller", "Fantasy", "Romance", "Sci-Fi", "Literary", "Horror", "Non-fiction", "Kids"];

/* ---------- helpers ---------- */
function wrap(ctx, text, maxW) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

// Draws wrapped text, shrinking until it fits maxLines. Returns the bottom y.
export function block(ctx, text, o) {
  if (!text) return o.y;
  const { x, y, maxW, font, weight = 700, color, align = "center", maxLines = 4, lh = 1.08, track = 0, upper = false, maxH = Infinity } = o;
  let size = o.size;
  const min = o.min ?? size * 0.3;
  const t = upper ? text.toUpperCase() : text;
  let lines;
  for (;;) {
    ctx.font = `${weight} ${size}px "${font}", serif`;
    ctx.letterSpacing = `${track * size}px`;
    lines = wrap(ctx, t, maxW);
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    if ((lines.length <= maxLines && widest <= maxW && lines.length * size * lh <= maxH) || size <= min) break;
    size -= size * 0.04;
  }
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  const ax = align === "left" ? x - maxW / 2 : align === "right" ? x + maxW / 2 : x;
  let cy = y + size * 0.85;
  if (o.shadow) { ctx.shadowColor = o.shadow; ctx.shadowBlur = size * 0.25; ctx.shadowOffsetY = size * 0.05; }
  lines.forEach((l) => { ctx.fillText(l, ax + (align === "center" ? (track * size) / 2 : 0), cy); cy += size * lh; });
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.letterSpacing = "0px";
  return cy - size * lh + size * 0.2;
}

export function linear(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([p, c]) => g.addColorStop(p, c));
  return g;
}
export function alpha(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}
function rule(ctx, x, y, w, color, lw) {
  ctx.strokeStyle = color; ctx.lineWidth = lw;
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.stroke();
}
function mountains(ctx, W, H, baseY, color, peaks, seed) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, baseY);
  for (let i = 0; i <= peaks; i++) {
    const x = (W / peaks) * i;
    const r = Math.sin(seed + i * 12.9898) * 43758.5453; // deterministic jitter
    const up = (r - Math.floor(r)) * H * 0.1;
    ctx.lineTo(x - W / peaks / 2, baseY - up - H * 0.04);
    ctx.lineTo(x, baseY + (i % 2 ? H * 0.015 : 0));
  }
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
}

/* ---------- templates ----------
   bg: shapes + colours, fg: frames + text. `s` is the editable state
   (title, subtitle, author, tagline, c1, c2, accent, text, font). */
const BASE = [
  {
    id: "noir", name: "Noir Beam", genre: "Thriller", font: "Bebas Neue",
    palette: { c1: "#0b0d12", c2: "#262c3a", accent: "#e63946", text: "#f4f4f6" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c2], [1, s.c1]]); ctx.fillRect(0, 0, W, H);
      const g = ctx.createLinearGradient(W * 0.2, 0, W * 0.8, H * 0.7);
      g.addColorStop(0, alpha("#ffffff", 0.22)); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(W * 0.38, 0); ctx.lineTo(W * 0.62, 0); ctx.lineTo(W * 1.05, H * 0.5); ctx.lineTo(W * -0.05, H * 0.5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#000"; ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.ellipse(W / 2, H * 0.47, W * 0.08, H * 0.02, 0, 0, 7); ctx.fill();
      ctx.fillRect(W * 0.465, H * 0.31, W * 0.07, H * 0.16); ctx.beginPath(); ctx.arc(W / 2, H * 0.3, W * 0.045, 0, 7); ctx.fill();
      ctx.globalAlpha = 1;
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      block(ctx, s.author, { x: W / 2, y: H * 0.06, maxW: W * 0.8, size: 5.2 * u, font: s.font, weight: 400, color: s.text, track: 0.28, upper: true, maxLines: 1 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.58, maxH: H * 0.22, maxW: W * 0.88, size: 21 * u, font: s.font, weight: 400, color: s.text, upper: true, lh: 0.95, maxLines: 3, shadow: "rgba(0,0,0,.6)" });
      rule(ctx, W / 2, y + 2 * u, 14 * u, s.accent, 0.8 * u);
      block(ctx, s.subtitle || s.tagline, { x: W / 2, y: y + 4.5 * u, maxW: W * 0.78, size: 3.4 * u, font: "Montserrat", weight: 500, color: alpha(s.text, 0.8), track: 0.2, upper: true, maxLines: 2 });
    },
  },
  {
    id: "realm", name: "Moonlit Realm", genre: "Fantasy", font: "Cinzel",
    palette: { c1: "#0a1a3a", c2: "#c9853a", accent: "#f2c46b", text: "#fff3dc" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c1], [0.62, "#1e3a6e"], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 70; i++) { const r = Math.sin(i * 91.7) * 1e4, q = Math.sin(i * 17.3) * 1e4; ctx.fillStyle = alpha("#ffffff", 0.3 + (r - Math.floor(r)) * 0.6); ctx.beginPath(); ctx.arc((r - Math.floor(r)) * W, (q - Math.floor(q)) * H * 0.55, W * 0.0025 + (q - Math.floor(q)) * W * 0.003, 0, 7); ctx.fill(); }
      const mg = ctx.createRadialGradient(W / 2, H * 0.4, W * 0.04, W / 2, H * 0.4, W * 0.4);
      mg.addColorStop(0, alpha(s.accent, 0.5)); mg.addColorStop(1, alpha(s.accent, 0));
      ctx.fillStyle = mg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = s.text; ctx.beginPath(); ctx.arc(W / 2, H * 0.4, W * 0.17, 0, 7); ctx.fill();
      mountains(ctx, W, H, H * 0.74, alpha(s.c1, 0.55), 5, 3);
      mountains(ctx, W, H, H * 0.82, alpha(s.c1, 0.8), 6, 7);
      mountains(ctx, W, H, H * 0.92, s.c1, 4, 11);
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      block(ctx, s.tagline, { x: W / 2, y: H * 0.055, maxW: W * 0.7, size: 2.8 * u, font: "Cinzel", weight: 600, color: s.accent, track: 0.3, upper: true, maxLines: 2 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.1, maxH: H * 0.2, maxW: W * 0.82, size: 12 * u, font: s.font, weight: 700, color: s.text, upper: true, lh: 1.05, maxLines: 3, track: 0.04, shadow: "rgba(0,0,0,.5)" });
      block(ctx, s.subtitle, { x: W / 2, y: y + 1.5 * u, maxW: W * 0.7, size: 3 * u, font: "Cormorant Garamond", weight: 700, color: alpha(s.text, 0.9), track: 0.12, upper: true, maxLines: 2 });
      block(ctx, s.author, { x: W / 2, y: H * 0.925, maxW: W * 0.8, size: 5.6 * u, font: s.font, weight: 700, color: s.text, track: 0.18, upper: true, maxLines: 1 });
      ctx.strokeStyle = alpha(s.accent, 0.8); ctx.lineWidth = 0.5 * u; ctx.strokeRect(3 * u, 3 * u, W - 6 * u, H - 6 * u);
    },
  },
  {
    id: "bloom", name: "Blush Script", genre: "Romance", font: "Great Vibes",
    palette: { c1: "#fde4e1", c2: "#f7b3b8", accent: "#c2466a", text: "#4a1830" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, W, H, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      [[0.15, 0.2, 0.34, 0.5], [0.9, 0.35, 0.3, 0.4], [0.5, 0.78, 0.45, 0.35], [0.05, 0.9, 0.25, 0.3]].forEach(([x, y, r, a]) => {
        const g = ctx.createRadialGradient(W * x, H * y, 0, W * x, H * y, W * r);
        g.addColorStop(0, alpha(s.accent, a * 0.7)); g.addColorStop(1, alpha(s.accent, 0));
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
      ctx.strokeStyle = alpha(s.accent, 0.55); ctx.lineWidth = W * 0.004;
      ctx.beginPath(); ctx.arc(W / 2, H * 0.46, W * 0.36, 0, 7); ctx.stroke();
      ctx.lineWidth = W * 0.0018; ctx.beginPath(); ctx.arc(W / 2, H * 0.46, W * 0.4, 0, 7); ctx.stroke();
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      block(ctx, s.tagline, { x: W / 2, y: H * 0.28, maxW: W * 0.55, size: 2.7 * u, font: "Montserrat", weight: 500, color: s.accent, track: 0.3, upper: true, maxLines: 2 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.36, maxH: H * 0.3, maxW: W * 0.66, size: 17 * u, font: s.font, weight: 400, color: s.text, lh: 0.95, maxLines: 3 });
      block(ctx, s.subtitle, { x: W / 2, y: y + 1 * u, maxW: W * 0.6, size: 3 * u, font: "Cormorant Garamond", weight: 700, color: s.text, track: 0.1, upper: true, maxLines: 2 });
      block(ctx, s.author, { x: W / 2, y: H * 0.88, maxW: W * 0.8, size: 5 * u, font: "Cormorant Garamond", weight: 700, color: s.text, track: 0.3, upper: true, maxLines: 1 });
    },
  },
  {
    id: "orbit", name: "Orbit", genre: "Sci-Fi", font: "Oswald",
    palette: { c1: "#050816", c2: "#1b2a6b", accent: "#4de1ff", text: "#eaf6ff" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 110; i++) { const r = Math.sin(i * 12.3) * 1e4, q = Math.sin(i * 7.7) * 1e4; ctx.fillStyle = alpha("#ffffff", 0.2 + (r - Math.floor(r)) * 0.7); ctx.fillRect((r - Math.floor(r)) * W, (q - Math.floor(q)) * H, W * 0.004, W * 0.004); }
      const cx = W / 2, cy = H * 0.45;
      const pg = ctx.createRadialGradient(cx - W * 0.07, cy - W * 0.07, W * 0.02, cx, cy, W * 0.2);
      pg.addColorStop(0, s.accent); pg.addColorStop(1, s.c2);
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(cx, cy, W * 0.2, 0, 7); ctx.fill();
      ctx.strokeStyle = alpha(s.accent, 0.8); ctx.lineWidth = W * 0.006;
      [0.38, 0.46, 0.56].forEach((r, i) => { ctx.globalAlpha = 1 - i * 0.25; ctx.beginPath(); ctx.ellipse(cx, cy, W * r, W * r * 0.28, -0.35, 0, 7); ctx.stroke(); });
      ctx.globalAlpha = 1;
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      block(ctx, s.author, { x: W / 2, y: H * 0.055, maxW: W * 0.8, size: 4.4 * u, font: s.font, weight: 500, color: s.accent, track: 0.35, upper: true, maxLines: 1 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.68, maxH: H * 0.17, maxW: W * 0.86, size: 14 * u, font: s.font, weight: 600, color: s.text, upper: true, lh: 1, maxLines: 3, track: 0.06 });
      block(ctx, s.subtitle || s.tagline, { x: W / 2, y: y + 2 * u, maxW: W * 0.76, size: 3 * u, font: "Montserrat", weight: 500, color: alpha(s.text, 0.75), track: 0.25, upper: true, maxLines: 2 });
    },
  },
  {
    id: "frame", name: "Quiet Frame", genre: "Literary", font: "Playfair Display",
    palette: { c1: "#f3ecdf", c2: "#e4d8c3", accent: "#8a3b2a", text: "#1f2a38" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, W, H, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = alpha(s.accent, 0.9); ctx.beginPath(); ctx.arc(W / 2, H * 0.34, W * 0.13, 0, 7); ctx.fill();
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      ctx.strokeStyle = s.text; ctx.lineWidth = 0.7 * u; ctx.strokeRect(6 * u, 6 * u, W - 12 * u, H - 12 * u);
      ctx.lineWidth = 0.25 * u; ctx.strokeRect(8 * u, 8 * u, W - 16 * u, H - 16 * u);
      block(ctx, s.tagline, { x: W / 2, y: H * 0.13, maxW: W * 0.6, size: 2.6 * u, font: "Montserrat", weight: 500, color: s.accent, track: 0.3, upper: true, maxLines: 2 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.5, maxH: H * 0.26, maxW: W * 0.7, size: 11 * u, font: s.font, weight: 800, color: s.text, lh: 1.08, maxLines: 4 });
      rule(ctx, W / 2, y + 3 * u, 10 * u, s.accent, 0.5 * u);
      block(ctx, s.subtitle, { x: W / 2, y: y + 5.5 * u, maxW: W * 0.62, size: 3.2 * u, font: "Cormorant Garamond", weight: 700, color: s.text, lh: 1.2, maxLines: 3 });
      block(ctx, s.author, { x: W / 2, y: H * 0.88, maxW: W * 0.7, size: 4.6 * u, font: "Playfair Display", weight: 700, color: s.text, track: 0.2, upper: true, maxLines: 1 });
    },
  },
  {
    id: "eclipse", name: "Red Eclipse", genre: "Horror", font: "Cinzel",
    palette: { c1: "#050505", c2: "#1a0a0c", accent: "#d11a2a", text: "#f0e6e2" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c2], [1, s.c1]]); ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H * 0.4;
      const g = ctx.createRadialGradient(cx, cy, W * 0.12, cx, cy, W * 0.55);
      g.addColorStop(0, alpha(s.accent, 0.55)); g.addColorStop(1, alpha(s.accent, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = s.accent; ctx.beginPath(); ctx.arc(cx, cy, W * 0.22, 0, 7); ctx.fill();
      ctx.fillStyle = s.c1; ctx.beginPath(); ctx.arc(cx + W * 0.04, cy - W * 0.015, W * 0.205, 0, 7); ctx.fill();
      ctx.fillStyle = "#000";
      for (let i = 0; i < 9; i++) { const x = (W / 8) * i, h = H * (0.1 + 0.07 * ((i * 5) % 4)); ctx.fillRect(x - W * 0.012, H - h, W * 0.024, h); ctx.beginPath(); ctx.moveTo(x - W * 0.04, H - h); ctx.lineTo(x, H - h - H * 0.06); ctx.lineTo(x + W * 0.04, H - h); ctx.fill(); }
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      block(ctx, s.tagline, { x: W / 2, y: H * 0.06, maxW: W * 0.8, size: 2.8 * u, font: "Cinzel", weight: 600, color: alpha(s.text, 0.8), track: 0.35, upper: true, maxLines: 2 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.6, maxH: H * 0.2, maxW: W * 0.86, size: 13 * u, font: s.font, weight: 700, color: s.text, upper: true, lh: 1.02, maxLines: 3, track: 0.05, shadow: alpha(s.accent, 0.8) });
      block(ctx, s.subtitle, { x: W / 2, y: y + 1 * u, maxW: W * 0.7, size: 2.8 * u, font: "Montserrat", weight: 500, color: alpha(s.text, 0.75), track: 0.25, upper: true, maxLines: 2 });
      block(ctx, s.author, { x: W / 2, y: H * 0.915, maxW: W * 0.8, size: 5 * u, font: s.font, weight: 700, color: s.text, track: 0.3, upper: true, maxLines: 1 });
    },
  },
  {
    id: "stack", name: "Big Type", genre: "Thriller", font: "Bebas Neue",
    palette: { c1: "#111111", c2: "#1d1d1d", accent: "#ffd23f", text: "#ffffff" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = s.accent; ctx.fillRect(0, H * 0.78, W, H * 0.22);
      ctx.fillStyle = s.c2; ctx.fillRect(0, 0, W * 0.07, H);
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      block(ctx, s.tagline, { x: W * 0.55, y: H * 0.06, maxW: W * 0.78, size: 3 * u, font: "Montserrat", weight: 800, color: s.accent, track: 0.2, upper: true, align: "left", maxLines: 2 });
      block(ctx, s.title, { x: W * 0.55, y: H * 0.13, maxH: H * 0.55, maxW: W * 0.78, size: 30 * u, font: s.font, weight: 400, color: s.text, upper: true, lh: 0.86, maxLines: 4, align: "left", min: 9 * u });
      block(ctx, s.subtitle, { x: W * 0.55, y: H * 0.7, maxW: W * 0.78, size: 3.4 * u, font: "Montserrat", weight: 500, color: alpha(s.text, 0.8), align: "left", maxLines: 2 });
      block(ctx, s.author, { x: W * 0.55, y: H * 0.835, maxW: W * 0.78, size: 8 * u, font: s.font, weight: 400, color: s.c1, track: 0.1, upper: true, align: "left", maxLines: 1 });
    },
  },
  {
    id: "mist", name: "Misty Window", genre: "Thriller", font: "Playfair Display",
    palette: { c1: "#0f2a2e", c2: "#3c6a6e", accent: "#f3d9a4", text: "#f4efe6" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c2], [1, s.c1]]); ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 6; i++) { const y = H * (0.25 + i * 0.12); const g = ctx.createLinearGradient(0, y - H * 0.08, 0, y + H * 0.08); g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, `rgba(255,255,255,${0.1 - i * 0.01})`); g.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = g; ctx.fillRect(0, y - H * 0.08, W, H * 0.16); }
      ctx.fillStyle = alpha(s.accent, 0.95); ctx.fillRect(W * 0.38, H * 0.58, W * 0.24, H * 0.2);
      ctx.fillStyle = s.c1; ctx.fillRect(W * 0.395, H * 0.595, W * 0.09, H * 0.075); ctx.fillRect(W * 0.515, H * 0.595, W * 0.09, H * 0.075); ctx.fillRect(W * 0.395, H * 0.685, W * 0.09, H * 0.075); ctx.fillRect(W * 0.515, H * 0.685, W * 0.09, H * 0.075);
      ctx.fillStyle = "#000"; ctx.fillRect(0, H * 0.8, W, H * 0.2);
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.09, maxH: H * 0.3, maxW: W * 0.82, size: 12 * u, font: s.font, weight: 800, color: s.text, lh: 1.05, maxLines: 3, shadow: "rgba(0,0,0,.4)" });
      block(ctx, s.subtitle || s.tagline, { x: W / 2, y: y + 1.5 * u, maxW: W * 0.7, size: 3 * u, font: "Montserrat", weight: 500, color: alpha(s.text, 0.85), track: 0.2, upper: true, maxLines: 2 });
      block(ctx, s.author, { x: W / 2, y: H * 0.86, maxW: W * 0.8, size: 5.4 * u, font: s.font, weight: 700, color: s.accent, track: 0.22, upper: true, maxLines: 1 });
    },
  },
  {
    id: "spark", name: "Bright Idea", genre: "Non-fiction", font: "Montserrat",
    palette: { c1: "#ffffff", c2: "#ffe9d2", accent: "#f28c28", text: "#12294a" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = s.accent; ctx.fillRect(0, 0, W, H * 0.64);
      ctx.fillStyle = s.c2; ctx.beginPath(); ctx.arc(W * 0.92, H * 0.64, W * 0.34, Math.PI, 0); ctx.fill();
      ctx.fillStyle = s.text; ctx.beginPath(); ctx.arc(W * 0.08, H * 0.64, W * 0.16, Math.PI, 0); ctx.fill();
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      block(ctx, s.tagline, { x: W / 2, y: H * 0.07, maxW: W * 0.8, size: 3 * u, font: "Montserrat", weight: 800, color: s.text, track: 0.2, upper: true, align: "left", maxLines: 2 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.15, maxH: H * 0.36, maxW: W * 0.8, size: 15 * u, font: s.font, weight: 800, color: "#ffffff", lh: 1, maxLines: 4, align: "left", upper: true, track: -0.02 });
      block(ctx, s.subtitle, { x: W / 2, y: y + 2 * u, maxW: W * 0.8, size: 3.6 * u, font: "Montserrat", weight: 500, color: s.text, align: "left", maxLines: 3, lh: 1.25 });
      block(ctx, s.author, { x: W / 2, y: H * 0.85, maxW: W * 0.8, size: 6 * u, font: "Montserrat", weight: 800, color: s.text, track: 0.12, upper: true, align: "left", maxLines: 1 });
    },
  },
  {
    id: "waves", name: "Paper Waves", genre: "Literary", font: "Cormorant Garamond",
    palette: { c1: "#f6efe3", c2: "#2f6f73", accent: "#e0a458", text: "#1c2b33" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      [[0.62, s.accent, 0.9], [0.7, "#4f9a9c", 0.9], [0.8, s.c2, 1]].forEach(([p, c, a], k) => {
        ctx.globalAlpha = a; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += W / 40) ctx.lineTo(x, H * p + Math.sin(x / W * 6.28 * 1.5 + k * 1.6) * H * 0.03);
        ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      });
      ctx.globalAlpha = 1;
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      block(ctx, s.tagline, { x: W / 2, y: H * 0.08, maxW: W * 0.7, size: 2.8 * u, font: "Montserrat", weight: 500, color: s.c2, track: 0.3, upper: true, maxLines: 2 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.15, maxH: H * 0.3, maxW: W * 0.78, size: 14 * u, font: s.font, weight: 700, color: s.text, lh: 0.98, maxLines: 4 });
      block(ctx, s.subtitle, { x: W / 2, y: y + 2 * u, maxW: W * 0.7, size: 3.6 * u, font: "Cormorant Garamond", weight: 700, color: s.text, lh: 1.2, maxLines: 3 });
      block(ctx, s.author, { x: W / 2, y: H * 0.9, maxW: W * 0.8, size: 5 * u, font: s.font, weight: 700, color: s.c1, track: 0.3, upper: true, maxLines: 1 });
    },
  },
  {
    id: "meadow", name: "Sunny Hills", genre: "Kids", font: "Fredoka",
    palette: { c1: "#8fd3f4", c2: "#ffe27a", accent: "#ff6b6b", text: "#1d3557" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c1], [0.7, "#d4f1fb"], [1, "#ffffff"]]); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = s.c2; ctx.beginPath(); ctx.arc(W * 0.8, H * 0.38, W * 0.12, 0, 7); ctx.fill();
      ctx.fillStyle = alpha("#ffffff", 0.9);
      [[0.2, 0.3, 0.07], [0.3, 0.3, 0.09], [0.4, 0.3, 0.065]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(W * x, H * y, W * r, 0, 7); ctx.fill(); });
      [["#7bc96f", 0.62, 0.3], ["#52b36a", 0.7, 1.8], ["#2f9e57", 0.8, 3]].forEach(([c, p, k]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += W / 30) ctx.lineTo(x, H * p + Math.sin(x / W * 3.2 + k) * H * 0.04); ctx.lineTo(W, H); ctx.fill(); });
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.07, maxH: H * 0.25, maxW: W * 0.84, size: 15 * u, font: s.font, weight: 600, color: s.text, lh: 1, maxLines: 3, shadow: "rgba(255,255,255,.7)" });
      block(ctx, s.subtitle || s.tagline, { x: W / 2, y: y + 2 * u, maxW: W * 0.7, size: 3.8 * u, font: "Fredoka", weight: 500, color: s.accent, maxLines: 2 });
      block(ctx, s.author, { x: W / 2, y: H * 0.89, maxW: W * 0.8, size: 6 * u, font: s.font, weight: 600, color: "#ffffff", maxLines: 1, shadow: "rgba(0,0,0,.35)" });
    },
  },
  {
    id: "grid", name: "Clean Grid", genre: "Non-fiction", font: "Montserrat",
    palette: { c1: "#f4f6fa", c2: "#12294a", accent: "#1d5fa8", text: "#12294a" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      const cell = W / 6;
      for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
        const on = (r * 7 + c * 3) % 5 === 0 || (r === 3 && c > 3);
        if (on) { ctx.fillStyle = (r + c) % 2 ? s.accent : s.c2; ctx.fillRect(c * cell, H - (4 - r) * cell, cell, cell); }
      }
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      ctx.fillStyle = s.accent; ctx.fillRect(10 * u, 8 * u, 12 * u, 1.2 * u);
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.1, maxH: H * 0.35, maxW: W * 0.8, size: 12.5 * u, font: s.font, weight: 800, color: s.text, lh: 1.02, maxLines: 4, align: "left", track: -0.02 });
      block(ctx, s.subtitle || s.tagline, { x: W / 2, y: y + 2 * u, maxW: W * 0.8, size: 3.4 * u, font: "Montserrat", weight: 500, color: alpha(s.text, 0.75), align: "left", maxLines: 3, lh: 1.3 });
      ctx.fillStyle = s.c1; ctx.fillRect(0, H * 0.57, W * 0.7, 9 * u);
      block(ctx, s.author, { x: W * 0.45, y: H * 0.57 + 2 * u, maxW: W * 0.62, size: 5 * u, font: "Montserrat", weight: 800, color: s.text, track: 0.14, upper: true, align: "left", maxLines: 1 });
    },
  },

  /* ---------- premium designs ---------- */
  {
    id: "gilded", name: "Gilded Crown", genre: "Fantasy", premium: true, font: "Cinzel",
    palette: { c1: "#08080c", c2: "#1b1630", accent: "#d9b45b", text: "#f6ead0" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c2], [1, s.c1]]); ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H * 0.38;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.5);
      g.addColorStop(0, alpha(s.accent, 0.35)); g.addColorStop(1, alpha(s.accent, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = alpha(s.accent, 0.16);
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2, b = a + Math.PI / 24;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * W, cy + Math.sin(a) * W); ctx.lineTo(cx + Math.cos(b) * W, cy + Math.sin(b) * W); ctx.closePath(); if (i % 2) ctx.fill();
      }
      ctx.strokeStyle = s.accent;
      [0.3, 0.26, 0.2].forEach((r, i) => { ctx.lineWidth = W * (i === 1 ? 0.0035 : 0.008); ctx.beginPath(); ctx.arc(cx, cy, W * r, 0, 7); ctx.stroke(); });
      ctx.fillStyle = s.accent; ctx.beginPath();
      for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? W * 0.07 : W * 0.16; ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = s.c1; ctx.beginPath(); ctx.arc(cx, cy, W * 0.045, 0, 7); ctx.fill();
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      [[4, 1.1], [6.2, 0.35]].forEach(([m, lw]) => { ctx.strokeStyle = s.accent; ctx.lineWidth = lw * u; ctx.strokeRect(m * u, m * u, W - 2 * m * u, H - 2 * m * u); });
      block(ctx, s.tagline, { x: W / 2, y: H * 0.075, maxW: W * 0.66, size: 2.6 * u, font: "Cinzel", weight: 600, color: s.accent, track: 0.35, upper: true, maxLines: 2 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.64, maxH: H * 0.17, maxW: W * 0.78, size: 11 * u, font: s.font, weight: 700, color: s.text, upper: true, lh: 1.05, maxLines: 3, track: 0.05, shadow: "rgba(0,0,0,.6)" });
      rule(ctx, W / 2, y + 2.4 * u, 18 * u, s.accent, 0.5 * u);
      block(ctx, s.subtitle, { x: W / 2, y: y + 4 * u, maxW: W * 0.7, size: 2.8 * u, font: "Cormorant Garamond", weight: 700, color: alpha(s.text, 0.9), track: 0.2, upper: true, maxLines: 2 });
      block(ctx, s.author, { x: W / 2, y: H * 0.9, maxW: W * 0.7, size: 5 * u, font: s.font, weight: 700, color: s.accent, track: 0.3, upper: true, maxLines: 1 });
    },
  },
  {
    id: "neon", name: "Neon Horizon", genre: "Sci-Fi", premium: true, font: "Oswald",
    palette: { c1: "#12062b", c2: "#4a1a7a", accent: "#ff4fd8", text: "#fdf4ff" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H * 0.62, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      const hy = H * 0.62, cx = W / 2;
      const sun = linear(ctx, 0, hy - W * 0.3, 0, hy, [[0, "#ffd36b"], [0.5, s.accent], [1, "#7a2bff"]]);
      ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(cx, hy, W * 0.3, Math.PI, 0); ctx.fill();
      ctx.fillStyle = s.c2;
      for (let i = 0; i < 6; i++) ctx.fillRect(cx - W * 0.3, hy - W * 0.3 + i * W * 0.045 + W * 0.05, W * 0.6, W * (0.006 + i * 0.004));
      ctx.fillStyle = s.c1; ctx.fillRect(0, hy, W, H - hy);
      ctx.strokeStyle = alpha(s.accent, 0.85); ctx.lineWidth = W * 0.003;
      for (let i = 0; i < 9; i++) { const y = hy + Math.pow(i / 8, 2.2) * (H - hy); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(cx + i * W * 0.02, hy); ctx.lineTo(cx + i * W * 0.2, H); ctx.stroke(); }
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      block(ctx, s.author, { x: W / 2, y: H * 0.05, maxW: W * 0.8, size: 4.6 * u, font: s.font, weight: 500, color: s.accent, track: 0.4, upper: true, maxLines: 1 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.1, maxH: H * 0.2, maxW: W * 0.86, size: 15 * u, font: s.font, weight: 600, color: s.text, upper: true, lh: 1, maxLines: 3, track: 0.05, shadow: s.accent });
      block(ctx, s.subtitle || s.tagline, { x: W / 2, y: y + 1.6 * u, maxW: W * 0.7, size: 2.8 * u, font: "Montserrat", weight: 500, color: alpha(s.text, 0.85), track: 0.3, upper: true, maxLines: 2 });
    },
  },
  {
    id: "rosette", name: "Rose Garden", genre: "Romance", premium: true, font: "Great Vibes",
    palette: { c1: "#fbf1e6", c2: "#e9a9a0", accent: "#b23a5b", text: "#3d1426" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H * 0.3;
      [[0.3, 0.35], [0.24, 0.5], [0.18, 0.7], [0.12, 0.95]].forEach(([r, a], k) => {
        for (let i = 0; i < 12; i++) {
          const ang = (i / 12) * Math.PI * 2 + k * 0.26;
          ctx.fillStyle = k % 2 ? alpha(s.accent, a) : alpha(s.c2, a + 0.1);
          ctx.beginPath(); ctx.ellipse(cx + Math.cos(ang) * W * r * 0.55, cy + Math.sin(ang) * W * r * 0.55, W * r * 0.5, W * r * 0.2, ang, 0, 7); ctx.fill();
        }
      });
      ctx.fillStyle = s.c1; ctx.beginPath(); ctx.arc(cx, cy, W * 0.035, 0, 7); ctx.fill();
      ctx.strokeStyle = alpha(s.accent, 0.5); ctx.lineWidth = W * 0.003; ctx.strokeRect(W * 0.04, W * 0.04, W * 0.92, H - W * 0.08);
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.52, maxH: H * 0.24, maxW: W * 0.8, size: 17 * u, font: s.font, weight: 400, color: s.text, lh: 0.95, maxLines: 3 });
      block(ctx, s.subtitle || s.tagline, { x: W / 2, y: y + 1.5 * u, maxW: W * 0.66, size: 2.8 * u, font: "Montserrat", weight: 500, color: s.accent, track: 0.3, upper: true, maxLines: 2 });
      block(ctx, s.author, { x: W / 2, y: H * 0.89, maxW: W * 0.8, size: 4.8 * u, font: "Cormorant Garamond", weight: 700, color: s.text, track: 0.35, upper: true, maxLines: 1 });
    },
  },
  {
    id: "pulp", name: "Vintage Pulp", genre: "Thriller", premium: true, font: "Bebas Neue",
    palette: { c1: "#efe3c8", c2: "#b5472b", accent: "#1d2a35", text: "#1d2a35" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = alpha(s.c2, 0.25);
      for (let r = 0; r < 30; r++) for (let c = 0; c < 20; c++) { const d = Math.max(0.2, 1 - r / 30) * W * 0.011; ctx.beginPath(); ctx.arc(c * W * 0.052 + (r % 2) * W * 0.026, H * 0.45 + r * W * 0.052 * 0.9, d, 0, 7); ctx.fill(); }
      ctx.fillStyle = s.c2; ctx.fillRect(0, H * 0.06, W, H * 0.34);
      ctx.fillStyle = s.accent; ctx.beginPath(); ctx.moveTo(W * 0.08, H * 0.4); ctx.lineTo(W * 0.5, H * 0.14); ctx.lineTo(W * 0.92, H * 0.4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = s.c1; ctx.beginPath(); ctx.arc(W * 0.5, H * 0.24, W * 0.07, 0, 7); ctx.fill();
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      block(ctx, s.tagline, { x: W / 2, y: H * 0.025, maxW: W * 0.8, size: 2.8 * u, font: "Montserrat", weight: 800, color: s.accent, track: 0.25, upper: true, maxLines: 1 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.45, maxH: H * 0.3, maxW: W * 0.86, size: 22 * u, font: s.font, weight: 400, color: s.text, upper: true, lh: 0.9, maxLines: 3 });
      block(ctx, s.subtitle, { x: W / 2, y: y + 2 * u, maxW: W * 0.7, size: 3.2 * u, font: "Montserrat", weight: 800, color: s.c2, track: 0.2, upper: true, maxLines: 2 });
      block(ctx, s.author, { x: W / 2, y: H * 0.9, maxW: W * 0.8, size: 6.5 * u, font: s.font, weight: 400, color: s.text, track: 0.2, upper: true, maxLines: 1 });
    },
  },
  {
    id: "deep", name: "Deep Sea Light", genre: "Literary", premium: true, font: "Playfair Display",
    palette: { c1: "#06182b", c2: "#0f5a7a", accent: "#ffd989", text: "#f2f8fb" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c1], [0.65, s.c2], [1, s.c1]]); ctx.fillRect(0, 0, W, H);
      const lx = W * 0.72, ly = H * 0.5;
      const b = ctx.createLinearGradient(lx, ly, W * -0.2, ly - H * 0.08);
      b.addColorStop(0, alpha(s.accent, 0.55)); b.addColorStop(1, alpha(s.accent, 0));
      ctx.fillStyle = b; ctx.beginPath(); ctx.moveTo(lx, ly - H * 0.012); ctx.lineTo(W * -0.1, ly - H * 0.2); ctx.lineTo(W * -0.1, ly + H * 0.1); ctx.lineTo(lx, ly + H * 0.012); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#02080f";
      ctx.beginPath(); ctx.moveTo(lx - W * 0.045, H * 0.7); ctx.lineTo(lx - W * 0.025, ly + H * 0.02); ctx.lineTo(lx + W * 0.025, ly + H * 0.02); ctx.lineTo(lx + W * 0.045, H * 0.7); ctx.closePath(); ctx.fill();
      ctx.fillRect(lx - W * 0.03, ly - H * 0.015, W * 0.06, H * 0.035);
      ctx.beginPath(); ctx.moveTo(lx - W * 0.035, ly - H * 0.015); ctx.lineTo(lx, ly - H * 0.045); ctx.lineTo(lx + W * 0.035, ly - H * 0.015); ctx.closePath(); ctx.fill();
      ctx.fillStyle = s.accent; ctx.fillRect(lx - W * 0.018, ly - H * 0.008, W * 0.036, H * 0.016);
      [[0.68, "#0a4560", 0.9], [0.76, "#073350", 0.95], [0.85, "#041f33", 1]].forEach(([p, c, a], k) => {
        ctx.globalAlpha = a; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += W / 36) ctx.lineTo(x, H * p + Math.sin((x / W) * 6.28 * 2 + k * 1.3) * H * 0.018);
        ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      });
      ctx.globalAlpha = 1;
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      block(ctx, s.tagline, { x: W / 2, y: H * 0.07, maxW: W * 0.7, size: 2.6 * u, font: "Montserrat", weight: 500, color: s.accent, track: 0.3, upper: true, maxLines: 2 });
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.13, maxH: H * 0.24, maxW: W * 0.8, size: 12 * u, font: s.font, weight: 800, color: s.text, lh: 1.05, maxLines: 4 });
      block(ctx, s.subtitle, { x: W / 2, y: y + 2 * u, maxW: W * 0.66, size: 3.2 * u, font: "Cormorant Garamond", weight: 700, color: alpha(s.text, 0.85), lh: 1.2, maxLines: 2 });
      block(ctx, s.author, { x: W / 2, y: H * 0.9, maxW: W * 0.8, size: 4.8 * u, font: s.font, weight: 700, color: s.text, track: 0.25, upper: true, maxLines: 1 });
    },
  },
  {
    id: "skyline", name: "Shadow City", genre: "Thriller", premium: true, font: "Montserrat",
    palette: { c1: "#0a0f1e", c2: "#3a2a5c", accent: "#ff9a3c", text: "#ffffff" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c1], [0.6, s.c2], [0.8, s.accent], [1, s.c1]]); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = alpha(s.text, 0.9); ctx.beginPath(); ctx.arc(W * 0.7, H * 0.3, W * 0.07, 0, 7); ctx.fill();
      [[0.6, "#161a33"], [0.68, "#0d1024"], [0.76, "#05060f"]].forEach(([p, c], k) => {
        ctx.fillStyle = c;
        for (let i = 0; i < 12; i++) {
          const r = Math.sin((i + 1) * (k + 3) * 7.13) * 1e4, f = r - Math.floor(r);
          const bw = W / 11, bh = H * (0.08 + f * 0.16 + (0.76 - p) * 0.2);
          ctx.fillRect(i * bw - W * 0.02, H * (p + 0.12) - bh, bw * 0.9, bh + H);
          if (k === 2) { ctx.fillStyle = alpha(s.accent, 0.7); for (let j = 0; j < 6; j++) ctx.fillRect(i * bw + (j % 3) * bw * 0.28, H * (p + 0.12) - bh + H * 0.015 + Math.floor(j / 3) * H * 0.025, bw * 0.12, H * 0.009); ctx.fillStyle = c; }
        }
      });
    },
    fg(ctx, W, H, s) {
      const u = W / 100;
      const y = block(ctx, s.title, { x: W / 2, y: H * 0.07, maxH: H * 0.26, maxW: W * 0.84, size: 13 * u, font: s.font, weight: 800, color: s.text, upper: true, lh: 1.02, maxLines: 3, track: 0.02, shadow: "rgba(0,0,0,.5)" });
      block(ctx, s.subtitle || s.tagline, { x: W / 2, y: y + 1.6 * u, maxW: W * 0.7, size: 2.8 * u, font: "Montserrat", weight: 500, color: alpha(s.text, 0.85), track: 0.28, upper: true, maxLines: 2 });
      block(ctx, s.author, { x: W / 2, y: H * 0.915, maxW: W * 0.8, size: 5.2 * u, font: "Montserrat", weight: 800, color: s.accent, track: 0.3, upper: true, maxLines: 1 });
    },
  },
];

export const TEMPLATES = [...BASE, ...EXTRA];

export const FIELD_DEFAULTS = {
  title: "Firefox Publisher",
  subtitle: "Your Story. Our Craft.",
  author: "Your Name",
  tagline: "The story you can't put down",
  blurb: "Write a short, gripping description of your book here. Tell readers who it is for, what happens and why they will love it. Keep it to a few short paragraphs so it stays easy to read on the back of your cover.",
  bio: "About the author: add one or two lines about yourself, your other books and where readers can find you.",
  website: "www.yourwebsite.com",
};

const FONTS_CSS = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Cinzel:wght@600;700&family=Bebas+Neue&family=Great+Vibes&family=Cormorant+Garamond:wght@700&family=Oswald:wght@500;600&family=Fredoka:wght@500;600&family=Montserrat:wght@500;800&display=swap";

// The same drawing code, recorded as SVG. Text stays live text (font-family names) so the
// file is editable in Illustrator, Inkscape, Figma or Affinity; the fonts are all free
// Google Fonts, referenced via @import for browsers.
export function coverToSVG(w, h, tpl, s, img, imgDim = 0.45) {
  const ctx = createSVGContext(w, h, document.createElement("canvas").getContext("2d"));
  paintCover(ctx, w, h, tpl, s, img, imgDim);
  return ctx.toSVG(FONTS_CSS);
}

export function drawCover(canvas, w, h, tpl, s, img, imgDim = 0.45) {
  canvas.width = w; canvas.height = h;
  paintCover(canvas.getContext("2d"), w, h, tpl, s, img, imgDim);
}

// Draws a full cover. `img` is an optional uploaded background image element.
function paintCover(ctx, w, h, tpl, s, img, imgDim) {
  ctx.clearRect(0, 0, w, h);
  tpl.bg(ctx, w, h, s);
  if (img) {
    const r = Math.max(w / img.width, h / img.height);
    const iw = img.width * r, ih = img.height * r;
    ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    ctx.fillStyle = linear(ctx, 0, 0, 0, h, [[0, `rgba(0,0,0,${imgDim})`], [0.5, `rgba(0,0,0,${imgDim * 0.5})`], [1, `rgba(0,0,0,${imgDim})`]]);
    ctx.fillRect(0, 0, w, h);
  }
  if (s.vig) drawVignette(ctx, w, h, s.vig);
  if (s.tex) drawTexture(ctx, w, h, s);
  tpl.fg(ctx, w, h, s);
  if (s.frame) drawFrame(ctx, w, h, s);
}

/* ---------- per-entry decoration: frames, textures and lighting ----------
   Applied on top of a template so entries differ in more than colour. */
export const FRAMES = ["None", "Thin line", "Double line", "Corner brackets", "Top & bottom bars", "Rounded inset"];
export const TEXTURES = ["None", "Diagonal lines", "Dots", "Grid", "Speckle"];
export const LIGHTING = ["None", "Dark edges", "Soft glow"];

function drawVignette(ctx, W, H, kind) {
  if (kind === 1) {
    const g = ctx.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, H * 0.78);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = g;
  } else {
    const g = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, H * 0.7);
    g.addColorStop(0, "rgba(255,255,255,0.22)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
  }
  ctx.fillRect(0, 0, W, H);
}

function drawTexture(ctx, W, H, s) {
  const u = W / 100;
  ctx.strokeStyle = alpha(s.text, 0.09);
  ctx.beginPath();
  if (s.tex === 1) {
    ctx.lineWidth = 0.35 * u;
    for (let x = -H; x < W; x += 3.4 * u) { ctx.moveTo(x, H); ctx.lineTo(x + H, 0); }
  } else if (s.tex === 2) {
    ctx.lineWidth = 0.7 * u;
    for (let y = 2 * u; y < H; y += 4 * u) for (let x = 2 * u; x < W; x += 4 * u) { ctx.moveTo(x, y); ctx.lineTo(x + 0.7 * u, y); }
  } else if (s.tex === 3) {
    ctx.lineWidth = 0.25 * u;
    for (let x = 0; x <= W; x += 5 * u) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = 0; y <= H; y += 5 * u) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  } else {
    ctx.lineWidth = 0.4 * u;
    for (let i = 0; i < 520; i++) {
      const a = Math.sin(i * 12.9898) * 43758.5453, b = Math.sin(i * 78.233) * 43758.5453;
      const x = (a - Math.floor(a)) * W, y = (b - Math.floor(b)) * H;
      ctx.moveTo(x, y); ctx.lineTo(x + 0.5 * u, y + 0.3 * u);
    }
  }
  ctx.stroke();
}

function drawFrame(ctx, W, H, s) {
  const u = W / 100;
  ctx.strokeStyle = alpha(s.accent, 0.9); ctx.fillStyle = alpha(s.accent, 0.9);
  if (s.frame === 1) { ctx.lineWidth = 0.6 * u; ctx.strokeRect(3.5 * u, 3.5 * u, W - 7 * u, H - 7 * u); }
  else if (s.frame === 2) {
    ctx.lineWidth = 0.7 * u; ctx.strokeRect(3 * u, 3 * u, W - 6 * u, H - 6 * u);
    ctx.lineWidth = 0.25 * u; ctx.strokeRect(4.8 * u, 4.8 * u, W - 9.6 * u, H - 9.6 * u);
  } else if (s.frame === 3) {
    const m = 4 * u, L = 11 * u; ctx.lineWidth = 0.9 * u; ctx.beginPath();
    [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, dx, dy]) => { ctx.moveTo(x + dx * L, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * L); });
    ctx.stroke();
  } else if (s.frame === 4) { ctx.fillRect(0, 0, W, 1.8 * u); ctx.fillRect(0, H - 1.8 * u, W, 1.8 * u); }
  else if (s.frame === 5) {
    const x = 3.5 * u, y = 3.5 * u, w = W - 7 * u, h = H - 7 * u, r = 6 * u, P = Math.PI;
    ctx.lineWidth = 0.6 * u; ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arc(x + w - r, y + r, r, -P / 2, 0);
    ctx.lineTo(x + w, y + h - r); ctx.arc(x + w - r, y + h - r, r, 0, P / 2);
    ctx.lineTo(x + r, y + h); ctx.arc(x + r, y + h - r, r, P / 2, P);
    ctx.lineTo(x, y + r); ctx.arc(x + r, y + r, r, P, P * 1.5);
    ctx.closePath(); ctx.stroke();
  }
}

/* ---------- design catalogue ----------
   Every template is paired with the hand-picked palettes of its genre (dark or light, depending
   on the template), then repeated in 3 "rounds": clean, and two decorated looks (frame, texture,
   lighting and an alternate title font). data/coverKeep.js lists the variants that look clearly
   different from each other. */
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
const isLight = (tpl) => lum(tpl.palette.c1) > 0.6;
const palettesFor = (tpl) => (isLight(tpl) ? LIGHT : DARK)[tpl.genre] || DARK.Literary;
const ROUNDS = 3;

const FONT_SETS = {
  Thriller: ["Bebas Neue", "Oswald", "Montserrat", "Playfair Display"],
  Fantasy: ["Cinzel", "Cormorant Garamond", "Playfair Display", "Oswald"],
  Romance: ["Great Vibes", "Playfair Display", "Cormorant Garamond", "Cinzel"],
  "Sci-Fi": ["Oswald", "Bebas Neue", "Montserrat", "Cinzel"],
  Literary: ["Playfair Display", "Cormorant Garamond", "Cinzel", "Montserrat"],
  Horror: ["Cinzel", "Bebas Neue", "Playfair Display", "Oswald"],
  "Non-fiction": ["Montserrat", "Oswald", "Playfair Display", "Bebas Neue"],
  Kids: ["Fredoka", "Montserrat", "Oswald", "Playfair Display"],
};
// Decoration combinations that look good on most covers, picked by round and palette position.
const DECOS = [
  { frame: 1, tex: 0, vig: 0 }, { frame: 0, tex: 0, vig: 1 }, { frame: 2, tex: 4, vig: 0 },
  { frame: 3, tex: 0, vig: 2 }, { frame: 5, tex: 1, vig: 0 }, { frame: 4, tex: 2, vig: 1 },
  { frame: 0, tex: 3, vig: 0 }, { frame: 1, tex: 4, vig: 1 },
];
const decoFor = (tpl, round, pi) => {
  if (!round) return { font: tpl.font, deco: { frame: 0, tex: 0, vig: 0 } };
  const fonts = [tpl.font, ...(FONT_SETS[tpl.genre] || []).filter((f) => f !== tpl.font)];
  return { font: fonts[(round + pi) % fonts.length], deco: DECOS[(pi * 3 + round * 5) % DECOS.length] };
};

// Variant-major order so the unfiltered gallery mixes every template instead of repeating one.
// Old and new art styles alternate, so the first screen of the gallery already shows the variety.
const MIXED = Array.from({ length: Math.max(BASE.length, EXTRA.length) }, (_, k) => [BASE[k], EXTRA[k]]).flat().filter(Boolean);
const CANDIDATES = [];
for (let i = 0; i < ROUNDS * 12; i++) MIXED.forEach((tpl) => {
  const pals = palettesFor(tpl), round = Math.floor(i / pals.length), pi = i % pals.length;
  if (round >= ROUNDS) return;
  const [pname, c1, c2, accent, text] = pals[pi];
  CANDIDATES.push({ tpl, i, pname, round, pi, palette: { c1, c2, accent, text } });
});

const styleTag = (d) => (d.frame ? FRAMES[d.frame] : d.tex ? TEXTURES[d.tex] : d.vig ? LIGHTING[d.vig] : "");

export const COVERS = CANDIDATES.filter(({ tpl, i }) => !KEEP || KEEP[tpl.id]?.includes(i)).map(({ tpl, i, pname, round, pi, palette }) => {
  const look = decoFor(tpl, round, pi), tag = styleTag(look.deco);
  return {
    id: `${tpl.id}-${i}`, tpl, palette, ...look, genre: tpl.genre, premium: !!tpl.premium,
    name: `${tpl.name} \u00b7 ${pname}${tag ? " \u00b7 " + tag : ""}`,
    search: `${tpl.name} ${tpl.genre} ${pname} ${tag} ${tpl.premium ? "premium" : "free"}`.toLowerCase(),
  };
});

/* ---------- back cover, spine and full print wrap ---------- */
const bseed = (n) => { const x = Math.sin(n * 91.3 + 7.1) * 43758.5453; return x - Math.floor(x); };

// Back cover: the same art, calmed down behind a text panel with blurb, bio and an ISBN barcode box.
function paintBack(ctx, w, h, tpl, s, img, imgDim) {
  ctx.clearRect(0, 0, w, h);
  tpl.bg(ctx, w, h, s);
  if (img) {
    const r = Math.max(w / img.width, h / img.height), iw = img.width * r, ih = img.height * r;
    ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
  }
  ctx.fillStyle = alpha(s.c1, img ? 0.55 + imgDim * 0.35 : 0.62); ctx.fillRect(0, 0, w, h);
  if (s.vig) drawVignette(ctx, w, h, s.vig);
  if (s.tex) drawTexture(ctx, w, h, s);
  const u = w / 100;
  const px = 8 * u, py = 7 * u, pw = w - 16 * u, ph = h - 14 * u;
  ctx.fillStyle = alpha(s.c1, 0.84); ctx.fillRect(px, py, pw, ph);
  ctx.strokeStyle = alpha(s.accent, 0.9); ctx.lineWidth = 0.5 * u; ctx.strokeRect(px + 1.6 * u, py + 1.6 * u, pw - 3.2 * u, ph - 3.2 * u);
  const inner = pw - 11 * u, cx = w / 2;
  let y = py + 6 * u;
  if (s.tagline) y = block(ctx, s.tagline, { x: cx, y, maxW: inner, size: 4 * u, font: s.font, weight: 700, color: s.accent, align: "center", lh: 1.2, maxLines: 2, upper: false, maxH: 14 * u }) + 3 * u;
  rule(ctx, cx, y, 14 * u, s.accent, 0.5 * u);
  y += 4 * u;
  // barcode box (bottom right) and the author bio / website beside it
  const bw = 34 * u, bh = 21 * u, bx = px + pw - bw - 5.5 * u, by = py + ph - bh - 5.5 * u;
  if (s.blurb) block(ctx, s.blurb, { x: cx, y, maxW: inner, size: 3.6 * u, font: "Montserrat", weight: 500, color: s.text, align: "left", lh: 1.5, maxLines: 16, upper: false, maxH: by - y - 4 * u, min: 2.2 * u });
  const left = px + 5.5 * u, leftW = bx - left - 4 * u;
  if (s.bio) block(ctx, s.bio, { x: left + leftW / 2, y: by, maxW: leftW, size: 2.7 * u, font: "Montserrat", weight: 500, color: alpha(s.text, 0.9), align: "left", lh: 1.4, maxLines: 5, upper: false, maxH: bh - 6 * u, min: 1.8 * u });
  if (s.website) block(ctx, s.website, { x: left + leftW / 2, y: by + bh - 4 * u, maxW: leftW, size: 2.4 * u, font: "Montserrat", weight: 800, color: s.accent, align: "left", track: 0.08, maxLines: 1, upper: false });
  ctx.fillStyle = "#ffffff"; ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = "#111111";
  for (let k = 0, x = bx + 3 * u; x < bx + bw - 3 * u; k++) { const bwid = (0.35 + bseed(k) * 0.9) * u; ctx.fillRect(x, by + 2.5 * u, bwid, bh - 8 * u); x += bwid + (0.3 + bseed(k + 50) * 0.7) * u; }
  block(ctx, "ISBN 978-0-00-000000-0", { x: bx + bw / 2, y: by + bh - 4.6 * u, maxW: bw - 4 * u, size: 1.7 * u, font: "Montserrat", weight: 500, color: "#111111", align: "center", maxLines: 1, upper: false });
}

export function backToSVG(w, h, tpl, s, img, imgDim = 0.45) {
  const ctx = createSVGContext(w, h, document.createElement("canvas").getContext("2d"));
  paintBack(ctx, w, h, tpl, s, img, imgDim);
  return ctx.toSVG(FONTS_CSS);
}

export function drawBack(canvas, w, h, tpl, s, img, imgDim = 0.45) {
  canvas.width = w; canvas.height = h;
  paintBack(canvas.getContext("2d"), w, h, tpl, s, img, imgDim);
}

// Amazon KDP style wrap: back + spine + front with 0.125 in bleed. Spine = pages x 0.002252 in (white paper).
export function wrapDims(size, pages) {
  const inch = size.w / (size.pt[0] / 72), bleed = Math.round(0.125 * inch);
  const spine = Math.round(Math.max(pages, 24) * 0.002252 * inch);
  const pw = size.w + bleed, ph = size.h + 2 * bleed;
  return { w: pw * 2 + spine, h: ph, pw, ph, spine, bleed, inch, spineIn: spine / inch };
}

export function drawWrap(canvas, d, tpl, s, img, imgDim = 0.45) {
  canvas.width = d.w; canvas.height = d.h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = s.c1; ctx.fillRect(0, 0, d.w, d.h);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, d.pw, d.ph); ctx.clip(); paintBack(ctx, d.pw, d.ph, tpl, s, img, imgDim); ctx.restore();
  ctx.save(); ctx.translate(d.pw + d.spine, 0); ctx.beginPath(); ctx.rect(0, 0, d.pw, d.ph); ctx.clip(); paintCover(ctx, d.pw, d.ph, tpl, s, img, imgDim); ctx.restore();
  // spine
  const x0 = d.pw;
  ctx.fillStyle = s.c2; ctx.fillRect(x0, 0, d.spine, d.h);
  ctx.fillStyle = s.accent; ctx.fillRect(x0, 0, d.spine, d.h * 0.012); ctx.fillRect(x0, d.h * 0.988, d.spine, d.h * 0.012);
  if (d.spineIn >= 0.18) {
    ctx.save(); ctx.translate(x0 + d.spine / 2, d.h / 2); ctx.rotate(Math.PI / 2);
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.letterSpacing = "0px";
    const ts = Math.min(d.spine * 0.5, d.h * 0.05);
    ctx.fillStyle = s.text; ctx.font = `700 ${ts}px "${s.font}", serif`; ctx.fillText(String(s.title || "").slice(0, 40), -d.h * 0.1, 0);
    ctx.fillStyle = s.accent; ctx.font = `700 ${ts * 0.7}px "Montserrat", sans-serif`; ctx.fillText(String(s.author || "").toUpperCase().slice(0, 30), d.h * 0.32, 0);
    ctx.restore();
  }
}
