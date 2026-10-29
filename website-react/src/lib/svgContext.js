// A tiny canvas-2D-compatible recorder that emits SVG, so the exact same template
// code that paints the PNG preview also produces a vector file. It implements only the
// subset the cover templates use (no transforms, clipping or images other than drawImage).

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const r2 = (n) => Math.round(n * 100) / 100;
const hex2 = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");

// "#rrggbb" | "rgba(r,g,b,a)" | "rgb(r,g,b)" -> { color: "#rrggbb", opacity }
function parseColor(c) {
  if (typeof c !== "string") return { color: "#000000", opacity: 1 };
  const m = c.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (m) return { color: "#" + hex2(+m[1]) + hex2(+m[2]) + hex2(+m[3]), opacity: m[4] === undefined ? 1 : +m[4] };
  if (/^#[0-9a-f]{3}$/i.test(c)) return { color: "#" + [...c.slice(1)].map((x) => x + x).join(""), opacity: 1 };
  return { color: c, opacity: 1 };
}

class Gradient {
  constructor(kind, args) { this.kind = kind; this.args = args; this.stops = []; }
  addColorStop(p, c) { this.stops.push([p, c]); }
}

export function createSVGContext(w, h, measureCtx) {
  const defs = [];
  const body = [];
  let gid = 0;
  let path = [];
  const st = { fillStyle: "#000", strokeStyle: "#000", lineWidth: 1, globalAlpha: 1, font: "", letterSpacing: "0px", textAlign: "start", textBaseline: "alphabetic", shadowColor: "transparent", shadowBlur: 0, shadowOffsetY: 0, shadowOffsetX: 0 };

  const paint = (value, attr) => {
    if (value instanceof Gradient) {
      const id = "g" + ++gid;
      const a = value.args;
      const stops = value.stops.map(([p, c]) => { const k = parseColor(c); return `<stop offset="${p}" stop-color="${k.color}" stop-opacity="${r2(k.opacity)}"/>`; }).join("");
      defs.push(value.kind === "linear"
        ? `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${r2(a[0])}" y1="${r2(a[1])}" x2="${r2(a[2])}" y2="${r2(a[3])}">${stops}</linearGradient>`
        : `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" fx="${r2(a[0])}" fy="${r2(a[1])}" cx="${r2(a[3])}" cy="${r2(a[4])}" r="${r2(a[5])}">${stops}</radialGradient>`);
      return `${attr}="url(#${id})"` + (st.globalAlpha < 1 ? ` ${attr}-opacity="${r2(st.globalAlpha)}"` : "");
    }
    const k = parseColor(value);
    const o = k.opacity * st.globalAlpha;
    return `${attr}="${k.color}"` + (o < 1 ? ` ${attr}-opacity="${r2(o)}"` : "");
  };

  const arcTo = (rx, ry, rot, x, y) => `A${r2(rx)} ${r2(ry)} ${r2(rot)} 1 1 ${r2(x)} ${r2(y)}`;

  const ctx = {
    canvas: { width: w, height: h },
    get fillStyle() { return st.fillStyle; }, set fillStyle(v) { st.fillStyle = v; },
    get strokeStyle() { return st.strokeStyle; }, set strokeStyle(v) { st.strokeStyle = v; },
    get lineWidth() { return st.lineWidth; }, set lineWidth(v) { st.lineWidth = v; },
    get globalAlpha() { return st.globalAlpha; }, set globalAlpha(v) { st.globalAlpha = v; },
    get font() { return st.font; }, set font(v) { st.font = v; measureCtx.font = v; },
    get letterSpacing() { return st.letterSpacing; }, set letterSpacing(v) { st.letterSpacing = v; measureCtx.letterSpacing = v; },
    get textAlign() { return st.textAlign; }, set textAlign(v) { st.textAlign = v; },
    get textBaseline() { return st.textBaseline; }, set textBaseline(v) { st.textBaseline = v; },
    get shadowColor() { return st.shadowColor; }, set shadowColor(v) { st.shadowColor = v; },
    get shadowBlur() { return st.shadowBlur; }, set shadowBlur(v) { st.shadowBlur = v; },
    get shadowOffsetY() { return st.shadowOffsetY; }, set shadowOffsetY(v) { st.shadowOffsetY = v; },
    get shadowOffsetX() { return st.shadowOffsetX; }, set shadowOffsetX(v) { st.shadowOffsetX = v; },

    createLinearGradient: (...a) => new Gradient("linear", a),
    createRadialGradient: (...a) => new Gradient("radial", a),
    measureText: (t) => measureCtx.measureText(t),
    clearRect() {},

    fillRect(x, y, rw, rh) { body.push(`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(rw)}" height="${r2(rh)}" ${paint(st.fillStyle, "fill")}/>`); },
    strokeRect(x, y, rw, rh) { body.push(`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(rw)}" height="${r2(rh)}" fill="none" ${paint(st.strokeStyle, "stroke")} stroke-width="${r2(st.lineWidth)}"/>`); },

    beginPath() { path = []; },
    closePath() { path.push("Z"); },
    moveTo(x, y) { path.push(`M${r2(x)} ${r2(y)}`); },
    lineTo(x, y) { path.push(`${path.length ? "L" : "M"}${r2(x)} ${r2(y)}`); },
    arc(cx, cy, r, a0, a1) { ctx.ellipse(cx, cy, r, r, 0, a0, a1); },
    ellipse(cx, cy, rx, ry, rot, a0, a1) {
      const cr = Math.cos(rot), sr = Math.sin(rot);
      const pt = (a) => { const px = rx * Math.cos(a), py = ry * Math.sin(a); return [cx + px * cr - py * sr, cy + px * sr + py * cr]; };
      const deg = (rot * 180) / Math.PI;
      const [x0, y0] = pt(a0);
      path.push(`${path.length ? "L" : "M"}${r2(x0)} ${r2(y0)}`);
      if (Math.abs(a1 - a0) >= Math.PI * 2 - 1e-6) {
        const [x1, y1] = pt(a0 + Math.PI);
        path.push(arcTo(rx, ry, deg, x1, y1), arcTo(rx, ry, deg, x0, y0));
      } else {
        const [x1, y1] = pt(a1);
        const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
        path.push(`A${r2(rx)} ${r2(ry)} ${r2(deg)} ${large} 1 ${r2(x1)} ${r2(y1)}`);
      }
    },
    fill() { if (path.length) body.push(`<path d="${path.join("")}" ${paint(st.fillStyle, "fill")}/>`); },
    stroke() { if (path.length) body.push(`<path d="${path.join("")}" fill="none" ${paint(st.strokeStyle, "stroke")} stroke-width="${r2(st.lineWidth)}" stroke-linejoin="round"/>`); },

    fillText(text, x, y) {
      const m = st.font.match(/(\d+)\s+([\d.]+)px\s+"([^"]+)"/);
      const weight = m ? m[1] : 400, size = m ? m[2] : 16, family = m ? m[3] : "serif";
      const anchor = st.textAlign === "center" ? "middle" : st.textAlign === "right" || st.textAlign === "end" ? "end" : "start";
      let filter = "";
      if (st.shadowBlur > 0 || st.shadowOffsetY) {
        const id = "s" + ++gid;
        const k = parseColor(st.shadowColor);
        defs.push(`<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="${r2(st.shadowOffsetX)}" dy="${r2(st.shadowOffsetY)}" stdDeviation="${r2(st.shadowBlur / 2)}" flood-color="${k.color}" flood-opacity="${r2(k.opacity)}"/></filter>`);
        filter = ` filter="url(#${id})"`;
      }
      const ls = parseFloat(st.letterSpacing) || 0;
      body.push(`<text x="${r2(x)}" y="${r2(y)}" text-anchor="${anchor}" font-family="'${esc(family)}', serif" font-weight="${weight}" font-size="${size}"${ls ? ` letter-spacing="${r2(ls)}"` : ""} ${paint(st.fillStyle, "fill")}${filter}>${esc(text)}</text>`);
    },

    // Uploaded artwork is embedded as a JPEG so the SVG stays a single self-contained file.
    drawImage(img, x, y, iw, ih) {
      const max = 2400, k = Math.min(1, max / Math.max(iw, ih));
      const c = document.createElement("canvas");
      c.width = Math.round(iw * k); c.height = Math.round(ih * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      body.push(`<image x="${r2(x)}" y="${r2(y)}" width="${r2(iw)}" height="${r2(ih)}" preserveAspectRatio="none" href="${c.toDataURL("image/jpeg", 0.9)}"/>`);
    },
  };

  ctx.toSVG = (fontsHref) => [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`,
    fontsHref ? `<style>@import url('${fontsHref}');</style>` : "",
    `<defs><clipPath id="cover"><rect width="${w}" height="${h}"/></clipPath>${defs.join("")}</defs>`,
    `<g clip-path="url(#cover)">`,
    ...body,
    `</g>`,
    `</svg>`,
  ].join("\n");
  return ctx;
}
