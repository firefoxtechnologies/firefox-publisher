// 22 more art styles. Each is a different illustration idea (not a recolour), drawn on canvas
// with the same bg/fg contract as the base templates in coverTemplates.js.
import { block, linear, alpha } from "./coverTemplates.js";

const rnd = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// Shared text layout: optional tagline, title, subtitle and author line.
function stdText(ctx, W, H, s, o = {}) {
  const u = W / 100;
  const { ty = 0.08, th = 0.2, size = 12, align = "center", upper = true, weight = 700, tc = s.text, ac = s.text, ay = 0.92, tagY, track = 0.03, lh = 1.04, maxLines = 3, mw = 0.84 } = o;
  const x = W / 2;
  if (tagY !== undefined) block(ctx, s.tagline, { x, y: H * tagY, maxW: W * mw, size: 2.6 * u, font: "Montserrat", weight: 500, color: ac, track: 0.28, upper: true, align, maxLines: 1 });
  const y = block(ctx, s.title, { x, y: H * ty, maxH: H * th, maxW: W * mw, size: size * u, font: s.font, weight, color: tc, upper, lh, maxLines, track, align });
  block(ctx, s.subtitle, { x, y: y + 1.2 * u, maxW: W * mw * 0.9, size: 2.8 * u, font: "Montserrat", weight: 500, color: alpha(tc, 0.85), track: 0.2, upper: true, align, maxLines: 2 });
  block(ctx, s.author, { x, y: H * ay, maxW: W * mw, size: 4.6 * u, font: s.font === "Great Vibes" ? "Cormorant Garamond" : s.font, weight: 700, color: ac, track: 0.28, upper: true, align, maxLines: 1 });
}

export const EXTRA = [
  {
    id: "bauhaus", name: "Bauhaus Shapes", genre: "Non-fiction", font: "Montserrat",
    palette: { c1: "#f2ead8", c2: "#1d3557", accent: "#e63946", text: "#1d1d1b" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = s.accent; ctx.beginPath(); ctx.arc(W * 0.32, H * 0.27, W * 0.22, 0, 7); ctx.fill();
      ctx.fillStyle = s.c2; ctx.fillRect(W * 0.5, H * 0.1, W * 0.34, W * 0.34);
      ctx.fillStyle = "#f4b942"; ctx.beginPath(); ctx.moveTo(W * 0.18, H * 0.56); ctx.lineTo(W * 0.52, H * 0.56); ctx.lineTo(W * 0.35, H * 0.34); ctx.closePath(); ctx.fill();
      ctx.fillStyle = s.text; ctx.fillRect(W * 0.62, H * 0.5, W * 0.22, W * 0.03); ctx.fillRect(W * 0.62, H * 0.54, W * 0.14, W * 0.03);
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.64, th: 0.2, size: 12, align: "left", weight: 800, ay: 0.92, mw: 0.8 }); },
  },
  {
    id: "sunrise", name: "Flat Sunrise", genre: "Literary", font: "Playfair Display",
    palette: { c1: "#fbe3c4", c2: "#e8775d", accent: "#ffb347", text: "#2a1b3d" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = s.accent; ctx.beginPath(); ctx.arc(W / 2, H * 0.55, W * 0.25, Math.PI, 0); ctx.fill();
      ctx.fillStyle = alpha(s.c2, 0.9);
      for (let i = 0; i < 5; i++) ctx.fillRect(W * 0.2, H * (0.45 + i * 0.022), W * 0.6, W * (0.004 + i * 0.004));
      ctx.fillStyle = s.text; ctx.fillRect(0, H * 0.55, W, H * 0.45);
      ctx.fillStyle = alpha(s.accent, 0.5); for (let i = 0; i < 6; i++) ctx.fillRect(W * (0.3 + i * 0.07), H * (0.6 + i * 0.03), W * (0.4 - i * 0.05), W * 0.004);
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.07, th: 0.2, size: 11, upper: false, tc: s.text, ac: s.c1, ay: 0.92, weight: 800 }); },
  },
  {
    id: "botanical", name: "Botanical Leaves", genre: "Non-fiction", font: "Cormorant Garamond",
    palette: { c1: "#eef3e4", c2: "#2f6b4f", accent: "#7fb069", text: "#1e3a2c" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      const bx = W / 2, by = H * 0.9;
      for (let i = 0; i < 15; i++) {
        const a = -Math.PI / 2 + (i - 7) * 0.2, d = W * (0.2 + (i % 3) * 0.06);
        ctx.fillStyle = i % 2 ? alpha(s.accent, 0.9) : alpha(s.c2, 0.95);
        ctx.beginPath(); ctx.ellipse(bx + Math.cos(a) * d, by + Math.sin(a) * d * 1.3, W * 0.2, W * 0.05, a, 0, 7); ctx.fill();
      }
      ctx.strokeStyle = s.c2; ctx.lineWidth = W * 0.006; ctx.beginPath(); ctx.moveTo(bx, by + H * 0.04); ctx.lineTo(bx, H * 0.55); ctx.stroke();
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.07, th: 0.24, size: 14, upper: false, ay: 0.95, weight: 700, lh: 0.98 }); },
  },
  {
    id: "pines", name: "Pine Forest", genre: "Fantasy", font: "Cinzel",
    palette: { c1: "#0d1b2a", c2: "#415a77", accent: "#e0e1dd", text: "#f1f5f9" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = s.accent; ctx.beginPath(); ctx.arc(W * 0.74, H * 0.37, W * 0.09, 0, 7); ctx.fill();
      [[0.62, 0.12, 0.6], [0.72, 0.15, 0.8], [0.84, 0.19, 1]].forEach(([y, sz, a], k) => {
        ctx.fillStyle = alpha("#050a10", a);
        for (let x = -W * 0.05; x < W * 1.05; x += W * sz * 0.8) {
          const tip = H * (y - 0.12 - rnd(x + k) * 0.05), base = H * (y + 0.2);
          for (let t = 0; t < 3; t++) {
            const ty = tip + (base - tip) * (t / 3.2), bw = W * sz * (0.45 + t * 0.25);
            ctx.beginPath(); ctx.moveTo(x, ty); ctx.lineTo(x + bw / 2, ty + (base - tip) * 0.4); ctx.lineTo(x - bw / 2, ty + (base - tip) * 0.4); ctx.closePath(); ctx.fill();
          }
          ctx.fillRect(x - W * 0.008, base - H * 0.05, W * 0.016, H * 0.4);
        }
      });
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.06, th: 0.22, size: 11, tc: s.text, ac: s.accent, ay: 0.93 }); },
  },
  {
    id: "decofan", name: "Deco Fan", genre: "Literary", font: "Cinzel", premium: true,
    palette: { c1: "#0f2a2a", c2: "#14403f", accent: "#d4af37", text: "#f6efd8" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H * 0.6;
      ctx.strokeStyle = s.accent;
      for (let r = 1; r <= 9; r++) { ctx.lineWidth = W * (r % 3 ? 0.003 : 0.008); ctx.beginPath(); ctx.arc(cx, cy, W * 0.05 * r, Math.PI, 0); ctx.stroke(); }
      ctx.lineWidth = W * 0.003; ctx.beginPath();
      for (let k = 0; k <= 16; k++) { const a = Math.PI + (k / 16) * Math.PI; ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * W * 0.45, cy + Math.sin(a) * W * 0.45); }
      ctx.stroke();
      ctx.fillStyle = s.c2; ctx.fillRect(0, cy, W, H - cy);
      ctx.fillStyle = s.accent; ctx.fillRect(0, cy, W, W * 0.008);
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.66, th: 0.17, size: 10.5, tc: s.text, ac: s.accent, ay: 0.93, tagY: 0.045 }); },
  },
  {
    id: "wash", name: "Watercolour Wash", genre: "Romance", font: "Great Vibes", premium: true,
    palette: { c1: "#fdf6ee", c2: "#9ec9d9", accent: "#f4a6b8", text: "#3b2a3f" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      [s.accent, s.c2, "#f6d186", s.accent, s.c2, "#c7a6e8", "#f6d186"].forEach((c, i) => {
        const x = W * (0.15 + rnd(i * 3) * 0.7), y = H * (0.06 + rnd(i * 5 + 1) * 0.36), r = W * (0.2 + rnd(i * 7) * 0.18);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, alpha(c, 0.75)); g.addColorStop(0.7, alpha(c, 0.3)); g.addColorStop(1, alpha(c, 0));
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.54, th: 0.25, size: 17, upper: false, weight: 400, ay: 0.9, lh: 0.95, tagY: 0.47 }); },
  },
  {
    id: "rainbow", name: "Rainbow Arch", genre: "Kids", font: "Fredoka",
    palette: { c1: "#fff6e0", c2: "#4cc9f0", accent: "#f72585", text: "#3a0ca3" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      const cols = [s.accent, "#ff9f1c", "#ffd60a", "#70e000", s.c2, "#7b2cbf"], cx = W / 2, cy = H * 0.7;
      cols.forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, cy, W * (0.46 - i * 0.055), Math.PI, 0); ctx.fill(); });
      ctx.fillStyle = s.c1; ctx.beginPath(); ctx.arc(cx, cy, W * 0.13, Math.PI, 0); ctx.fill();
      ctx.fillStyle = "#ffffff";
      [[0.2, 0.7], [0.8, 0.7]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(W * x, H * y, W * 0.07, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(W * (x + 0.07), H * (y + 0.01), W * 0.06, 0, 7); ctx.fill(); });
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.06, th: 0.2, size: 15, upper: false, weight: 600, ay: 0.9, ac: s.accent, tc: s.text }); },
  },
  {
    id: "flow", name: "Flow Lines", genre: "Sci-Fi", font: "Oswald",
    palette: { c1: "#07102b", c2: "#3a1c71", accent: "#00d4ff", text: "#eaf6ff" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, W, H, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = s.accent; ctx.lineWidth = W * 0.003;
      for (let k = 0; k < 28; k++) {
        ctx.globalAlpha = 0.2 + (k / 28) * 0.6; ctx.beginPath();
        for (let x = 0; x <= W; x += W / 40) { const y = H * 0.38 + Math.sin((x / W) * 6.28 * 1.3 + k * 0.16) * H * 0.1 + (k - 14) * H * 0.009; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.7, th: 0.17, size: 13, ac: s.accent, ay: 0.06 }); },
  },
  {
    id: "stars", name: "Constellation", genre: "Sci-Fi", font: "Montserrat",
    palette: { c1: "#050816", c2: "#1a1f4d", accent: "#ffd166", text: "#f4f6ff" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = alpha(s.text, 0.7); for (let i = 0; i < 90; i++) ctx.fillRect(rnd(i) * W, rnd(i + 99) * H * 0.7, W * 0.003, W * 0.003);
      const pts = Array.from({ length: 9 }, (_, i) => [W * (0.14 + rnd(i * 2 + 3) * 0.72), H * (0.1 + rnd(i * 4 + 9) * 0.5)]);
      ctx.strokeStyle = alpha(s.accent, 0.7); ctx.lineWidth = W * 0.003; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      ctx.fillStyle = s.accent; pts.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, W * 0.012, 0, 7); ctx.fill(); });
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.7, th: 0.17, size: 11, weight: 800, ac: s.accent, ay: 0.93 }); },
  },
  {
    id: "bigletter", name: "Giant Letter", genre: "Literary", font: "Playfair Display", premium: true,
    palette: { c1: "#f0e9dd", c2: "#d95d39", accent: "#d95d39", text: "#1d1a16" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      ctx.font = `800 ${W * 1.15}px "Playfair Display", serif`; ctx.letterSpacing = "0px"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = alpha(s.accent, 0.9); ctx.fillText((s.title || "A").trim().charAt(0).toUpperCase(), W / 2, H * 0.62);
      ctx.fillStyle = s.text; ctx.fillRect(W * 0.1, H * 0.68, W * 0.8, W * 0.012);
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.7, th: 0.17, size: 10, upper: false, ay: 0.93, align: "left", mw: 0.8, weight: 800 }); },
  },
  {
    id: "seal", name: "Royal Seal", genre: "Fantasy", font: "Cinzel", premium: true,
    palette: { c1: "#2b0f1a", c2: "#6b1d2f", accent: "#e5c07b", text: "#fbefd5" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c2], [1, s.c1]]); ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H * 0.37;
      ctx.strokeStyle = s.accent; ctx.lineWidth = W * 0.008; ctx.beginPath(); ctx.arc(cx, cy, W * 0.3, 0, 7); ctx.stroke();
      ctx.lineWidth = W * 0.003; ctx.beginPath(); ctx.arc(cx, cy, W * 0.265, 0, 7); ctx.stroke();
      ctx.beginPath(); for (let k = 0; k < 72; k++) { const a = (k / 72) * Math.PI * 2; ctx.moveTo(cx + Math.cos(a) * W * 0.3, cy + Math.sin(a) * W * 0.3); ctx.lineTo(cx + Math.cos(a) * W * 0.32, cy + Math.sin(a) * W * 0.32); } ctx.stroke();
      ctx.fillStyle = s.accent; ctx.beginPath(); for (let k = 0; k < 24; k++) { const a = (k / 24) * Math.PI * 2 - Math.PI / 2, r = k % 2 ? W * 0.1 : W * 0.2; ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } ctx.closePath(); ctx.fill();
      ctx.fillStyle = s.c1; ctx.beginPath(); ctx.arc(cx, cy, W * 0.07, 0, 7); ctx.fill();
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.66, th: 0.18, size: 10.5, tc: s.text, ac: s.accent, ay: 0.93, tagY: 0.045 }); },
  },
  {
    id: "moonwater", name: "Moon on Water", genre: "Romance", font: "Cormorant Garamond", premium: true,
    palette: { c1: "#10223d", c2: "#47628a", accent: "#fff3d6", text: "#f5f0e6" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H * 0.62, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = s.accent; ctx.beginPath(); ctx.arc(W / 2, H * 0.34, W * 0.15, 0, 7); ctx.fill();
      ctx.fillStyle = s.c1; ctx.fillRect(0, H * 0.62, W, H * 0.38);
      for (let i = 0; i < 6; i++) { const w = W * (0.28 - i * 0.04); ctx.fillStyle = alpha(s.accent, 0.7 - i * 0.1); ctx.fillRect(W / 2 - w / 2, H * (0.635 + i * 0.016), w, W * 0.007); }
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.75, th: 0.15, size: 11, upper: false, ay: 0.93, weight: 700, tagY: 0.06 }); },
  },
  {
    id: "dunes", name: "Desert Dunes", genre: "Thriller", font: "Oswald",
    palette: { c1: "#fbd38d", c2: "#c4582a", accent: "#fff1c9", text: "#3a1a0d" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = s.accent; ctx.beginPath(); ctx.arc(W * 0.5, H * 0.4, W * 0.11, 0, 7); ctx.fill();
      [["#d9743a", 0.58, 0], ["#a8461f", 0.7, 1.6], ["#5e2410", 0.82, 3.1]].forEach(([c, p, k]) => {
        ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += W / 30) ctx.lineTo(x, H * p + Math.sin((x / W) * 4 + k) * H * 0.04);
        ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      });
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.07, th: 0.22, size: 14, tc: s.text, ac: s.accent, ay: 0.92, weight: 600 }); },
  },
  {
    id: "eyeray", name: "Eclipse Eye", genre: "Horror", font: "Bebas Neue",
    palette: { c1: "#0a0a0f", c2: "#2a0a14", accent: "#ff3b3b", text: "#f3ecec" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c2], [1, s.c1]]); ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H * 0.38;
      ctx.fillStyle = alpha(s.accent, 0.4);
      for (let k = 0; k < 40; k += 2) { const a = ((k + 1) / 40) * Math.PI * 2, b = a + 0.1; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * W, cy + Math.sin(a) * W); ctx.lineTo(cx + Math.cos(b) * W, cy + Math.sin(b) * W); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = s.c1; ctx.beginPath(); ctx.ellipse(cx, cy, W * 0.34, W * 0.17, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = s.accent; ctx.lineWidth = W * 0.008; ctx.stroke();
      ctx.fillStyle = s.accent; ctx.beginPath(); ctx.arc(cx, cy, W * 0.13, 0, 7); ctx.fill();
      ctx.fillStyle = "#000000"; ctx.beginPath(); ctx.ellipse(cx, cy, W * 0.035, W * 0.12, 0, 0, 7); ctx.fill();
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.66, th: 0.2, size: 16, ac: s.accent, ay: 0.93, weight: 400, lh: 0.95 }); },
  },
  {
    id: "ink", name: "Ink Splash", genre: "Horror", font: "Playfair Display", premium: true,
    palette: { c1: "#efeae0", c2: "#1a1a1d", accent: "#9b1c1c", text: "#1a1a1d" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = s.c2;
      for (let i = 0; i < 34; i++) { const a = rnd(i) * 6.28, d = rnd(i + 40) * W * 0.28, r = W * (0.015 + rnd(i + 80) * 0.07) * (1 - d / (W * 0.4)); ctx.beginPath(); ctx.arc(W / 2 + Math.cos(a) * d, H * 0.33 + Math.sin(a) * d, Math.max(r, W * 0.006), 0, 7); ctx.fill(); }
      ctx.beginPath(); ctx.arc(W / 2, H * 0.33, W * 0.16, 0, 7); ctx.fill();
      ctx.fillStyle = s.accent; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(W * (0.3 + rnd(i + 5) * 0.4), H * (0.5 + rnd(i + 9) * 0.04), W * 0.007, 0, 7); ctx.fill(); }
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.62, th: 0.2, size: 12, upper: false, weight: 800, ay: 0.93, ac: s.accent }); },
  },
  {
    id: "lowpoly", name: "Low Poly", genre: "Sci-Fi", font: "Montserrat",
    palette: { c1: "#0b132b", c2: "#1c2541", accent: "#5bc0be", text: "#ffffff" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      const cols = 6, rows = 6, cw = W / cols, rh = (H * 0.62) / rows, tones = [s.c2, s.accent, "#3a506b", s.c1];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) for (let t = 0; t < 2; t++) {
        ctx.fillStyle = alpha(tones[Math.floor(rnd(r * 13 + c * 7 + t) * 4)], 0.45 + rnd(r + c * 3 + t) * 0.5);
        ctx.beginPath();
        if (t) { ctx.moveTo(c * cw, r * rh); ctx.lineTo((c + 1) * cw, r * rh); ctx.lineTo((c + 1) * cw, (r + 1) * rh); }
        else { ctx.moveTo(c * cw, r * rh); ctx.lineTo(c * cw, (r + 1) * rh); ctx.lineTo((c + 1) * cw, (r + 1) * rh); }
        ctx.closePath(); ctx.fill();
      }
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.68, th: 0.18, size: 12, weight: 800, ac: s.accent, ay: 0.93 }); },
  },
  {
    id: "spiral", name: "Sunflower Spiral", genre: "Sci-Fi", font: "Oswald", premium: true,
    palette: { c1: "#0d0d1a", c2: "#1d1b3a", accent: "#ff9f1c", text: "#fff6e5" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c2], [1, s.c1]]); ctx.fillRect(0, 0, W, H);
      for (let n = 1; n < 320; n++) { const a = n * 2.39996, r = Math.sqrt(n) * W * 0.024; ctx.fillStyle = alpha(s.accent, 0.35 + (n / 320) * 0.65); ctx.beginPath(); ctx.arc(W / 2 + Math.cos(a) * r, H * 0.38 + Math.sin(a) * r, W * (0.004 + (n / 320) * 0.012), 0, 7); ctx.fill(); }
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.71, th: 0.17, size: 13, ac: s.accent, ay: 0.06 }); },
  },
  {
    id: "bookstack", name: "Book Stack", genre: "Non-fiction", font: "Montserrat",
    palette: { c1: "#f7efe2", c2: "#264653", accent: "#e76f51", text: "#1f2d36" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      [s.accent, s.c2, "#e9c46a", s.c2, s.accent].forEach((c, i) => {
        const w = W * (0.62 - i * 0.07), h = H * 0.05, x = W / 2 - w / 2 + (i % 2 ? W * 0.03 : -W * 0.02), y = H * (0.86 - (i + 1) * 0.052);
        ctx.fillStyle = c; ctx.fillRect(x, y, w, h); ctx.fillStyle = alpha("#ffffff", 0.35); ctx.fillRect(x, y + h * 0.35, w, h * 0.12);
      });
      ctx.fillStyle = s.text; ctx.fillRect(W * 0.1, H * 0.86, W * 0.8, W * 0.01);
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.07, th: 0.3, size: 13, weight: 800, ay: 0.94, align: "left", mw: 0.78, upper: false, track: -0.02 }); },
  },
  {
    id: "hearts", name: "Heart Pattern", genre: "Romance", font: "Playfair Display",
    palette: { c1: "#ffe5ec", c2: "#ff8fab", accent: "#c9184a", text: "#590d22" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      const heart = (x, y, r, c) => {
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(x - r * 0.5, y, r * 0.56, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.5, y, r * 0.56, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x - r * 1.03, y + r * 0.2); ctx.lineTo(x + r * 1.03, y + r * 0.2); ctx.lineTo(x, y + r * 1.35); ctx.closePath(); ctx.fill();
      };
      for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) heart(W * (0.1 + c * 0.2 + (r % 2) * 0.1), H * (0.06 + r * 0.095), W * (0.045 + rnd(r * 5 + c) * 0.025), r % 2 ? alpha(s.accent, 0.85) : alpha(s.c2, 0.95));
      heart(W / 2, H * 0.52, W * 0.09, s.accent);
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.62, th: 0.2, size: 12, upper: false, weight: 800, ay: 0.93, ac: s.accent }); },
  },
  {
    id: "nightstars", name: "Night Wish", genre: "Kids", font: "Fredoka",
    palette: { c1: "#2b1b6b", c2: "#5b4bd6", accent: "#ffd23f", text: "#ffffff" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c1], [1, s.c2]]); ctx.fillRect(0, 0, W, H);
      const star = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2 - Math.PI / 2, rr = k % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); };
      for (let i = 0; i < 16; i++) star(W * (0.08 + rnd(i) * 0.84), H * (0.3 + rnd(i + 30) * 0.4), W * (0.015 + rnd(i + 60) * 0.03), i % 3 ? s.accent : "#ffffff");
      ctx.fillStyle = s.accent; ctx.beginPath(); ctx.arc(W * 0.78, H * 0.22, W * 0.09, 0, 7); ctx.fill();
      ctx.fillStyle = s.c1; ctx.beginPath(); ctx.arc(W * 0.82, H * 0.2, W * 0.08, 0, 7); ctx.fill();
      [["#3dd598", 0.84], ["#22a06b", 0.9]].forEach(([c, p], k) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += W / 24) ctx.lineTo(x, H * p + Math.sin((x / W) * 5 + k * 2) * H * 0.02); ctx.lineTo(W, H); ctx.fill(); });
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.05, th: 0.22, size: 14, upper: false, weight: 600, ay: 0.925, ac: "#ffffff", tc: s.text }); },
  },
  {
    id: "tape", name: "Crime Tape", genre: "Thriller", font: "Bebas Neue",
    palette: { c1: "#16181d", c2: "#2b2f38", accent: "#ffcc00", text: "#ffffff" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = linear(ctx, 0, 0, 0, H, [[0, s.c2], [1, s.c1]]); ctx.fillRect(0, 0, W, H);
      const y0 = H * 0.3, band = H * 0.07, tilt = H * 0.1, yAt = (x) => y0 + tilt * (1 - x / W);
      ctx.fillStyle = s.accent; ctx.beginPath(); ctx.moveTo(0, yAt(0)); ctx.lineTo(W, yAt(W)); ctx.lineTo(W, yAt(W) + band); ctx.lineTo(0, yAt(0) + band); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#000000";
      for (let x = -W * 0.1; x < W; x += W * 0.12) { ctx.beginPath(); ctx.moveTo(x, yAt(x) + band); ctx.lineTo(x + W * 0.06, yAt(x + W * 0.06) + band); ctx.lineTo(x + W * 0.09, yAt(x + W * 0.09)); ctx.lineTo(x + W * 0.03, yAt(x + W * 0.03)); ctx.closePath(); ctx.fill(); }
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.5, th: 0.3, size: 20, ac: s.accent, ay: 0.93, weight: 400, lh: 0.92, tagY: 0.07 }); },
  },
  {
    id: "bars", name: "Growth Chart", genre: "Non-fiction", font: "Oswald", premium: true,
    palette: { c1: "#f4f7fb", c2: "#12294a", accent: "#1d9bf0", text: "#12294a" },
    bg(ctx, W, H, s) {
      ctx.fillStyle = s.c1; ctx.fillRect(0, 0, W, H);
      const n = 6, bw = W * 0.1, gap = W * 0.03, x0 = (W - (n * bw + (n - 1) * gap)) / 2, base = H * 0.88;
      for (let i = 0; i < n; i++) { ctx.fillStyle = i === n - 1 ? s.accent : alpha(s.c2, 0.25 + i * 0.14); ctx.fillRect(x0 + i * (bw + gap), base - H * (0.08 + i * 0.07), bw, H * (0.08 + i * 0.07)); }
      ctx.strokeStyle = s.accent; ctx.lineWidth = W * 0.008; ctx.beginPath();
      for (let i = 0; i < n; i++) { const x = x0 + i * (bw + gap) + bw / 2, y = base - H * (0.12 + i * 0.07); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.stroke();
      ctx.fillStyle = s.text; ctx.fillRect(W * 0.08, base, W * 0.84, W * 0.008);
    },
    fg(ctx, W, H, s) { stdText(ctx, W, H, s, { ty: 0.07, th: 0.26, size: 14, weight: 600, ay: 0.945, align: "left", mw: 0.8, ac: s.accent }); },
  },
];
