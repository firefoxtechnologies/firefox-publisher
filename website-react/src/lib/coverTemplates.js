import { createSVGContext } from "./svgContext.js";

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
  { id: "kdp", label: "Paperback 6 x 9 in", w: 1800, h: 2700, pt: [432, 648] },
  { id: "ebook", label: "Ebook 1600 x 2560 px", w: 1600, h: 2560, pt: [400, 640] },
  { id: "small", label: "Paperback 5.5 x 8.5 in", w: 1650, h: 2550, pt: [396, 612] },
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
function block(ctx, text, o) {
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

function linear(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([p, c]) => g.addColorStop(p, c));
  return g;
}
function alpha(hex, a) {
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
export const TEMPLATES = [
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

export const FIELD_DEFAULTS = {
  title: "Firefox Publisher",
  subtitle: "Your Story. Our Craft.",
  author: "Your Name",
  tagline: "The story you can't put down",
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
  tpl.fg(ctx, w, h, img ? { ...s, text: s.text } : s);
}

/* ---------- design catalogue ----------
   Every base template is re-coloured into 48 originals (16 hues x 3 moods), so the
   gallery holds TEMPLATES.length * 48 distinct, ready-to-edit covers. */
const hexToHsl = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return [h, s, l];
};
const hslToHex = (h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return "#" + [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("");
};

export const HUES = 16;
export const MOODS = ["", "Muted", "Vivid"];
export const VARIANTS = HUES * MOODS.length;
const HUE_NAMES = [[15, "Red"], [40, "Orange"], [65, "Gold"], [90, "Lime"], [150, "Green"], [185, "Teal"], [215, "Sky"], [250, "Blue"], [275, "Indigo"], [310, "Violet"], [340, "Rose"], [361, "Red"]];
const hueName = (h) => HUE_NAMES.find(([max]) => h < max)[1];

export function paletteFor(tpl, i) {
  const rot = (i % HUES) * (360 / HUES), mood = Math.floor(i / HUES);
  const out = { ...tpl.palette };
  // Dark and neutral base colours barely change when rotated, so give every variant a saturation floor.
  const floor = { c1: 0.3, c2: 0.38, accent: 0.55 };
  ["c1", "c2", "accent"].forEach((k) => {
    const [h, s, l] = hexToHsl(tpl.palette[k]);
    let ns = mood === 1 ? s * 0.55 : mood === 2 ? Math.min(1, s * 1.25) : s;
    if (i > 0) ns = Math.max(ns, floor[k] * (mood === 1 ? 0.6 : mood === 2 ? 1.25 : 1));
    out[k] = hslToHex((h + rot) % 360, Math.min(1, ns), l);
  });
  return out;
}

// Variant-major order so the unfiltered gallery mixes every template instead of repeating one.
export const COVERS = Array.from({ length: VARIANTS }, (_, i) => TEMPLATES.map((tpl) => [tpl, i])).flat().map(
  ([tpl, i]) => {
    const palette = paletteFor(tpl, i), mood = MOODS[Math.floor(i / HUES)];
    const color = hueName(hexToHsl(palette.accent)[0]);
    return {
      id: `${tpl.id}-${i}`, tpl, palette, genre: tpl.genre, premium: !!tpl.premium,
      name: `${tpl.name} \u00b7 ${mood ? mood + " " : ""}${color} ${String(i + 1).padStart(2, "0")}`,
      search: `${tpl.name} ${tpl.genre} ${color} ${mood} ${tpl.premium ? "premium" : "free"}`.toLowerCase(),
    };
  }
);
