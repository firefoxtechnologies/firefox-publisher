// Twelve original covers, each in a different art style. Drawn from scratch as SVG.
const fs = require("fs");
const dir = "C:/Users/LAPVY/OneDrive/Desktop/New folder (2)/firefox-publishing/assets/covers/";
fs.mkdirSync(dir, { recursive: true });

const rnd = (seed) => { let x = seed; return () => ((x = (x * 9301 + 49297) % 233280) / 233280); };
const GRAIN = (op = 0.3) => `<filter id="gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 -.25"/></filter>`;
const finish = (op, dark = true) => `<rect width="600" height="900" filter="url(#gr)" opacity="${op}"/>
<rect width="600" height="900" fill="url(#vg)"/>
<rect x="0" y="0" width="22" height="900" fill="#000" opacity=".16"/><rect x="22" y="0" width="3" height="900" fill="#fff" opacity=".22"/>`;
const frame = (defs, body, label, grain = 0.3) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900" role="img" aria-label="${label.replace(/&/g, "&amp;")}">
<defs>${GRAIN()}<radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>${defs}</defs>
${body}
${finish(grain)}
</svg>
`;
const T = (x, y, size, txt, attrs = "") => `<text x="${x}" y="${y}" font-size="${size}" ${attrs}>${txt}</text>`;

const covers = {};

// 1. Linocut travel poster, three flat colours
covers["the-last-lighthouse"] = frame("", `
<rect width="600" height="900" fill="#f1e4c8"/>
<rect x="42" y="42" width="516" height="816" fill="none" stroke="#12294a" stroke-width="6"/>
<circle cx="300" cy="400" r="150" fill="#e8742a"/>
<g fill="#12294a">${Array.from({ length: 9 }, (_, i) => `<rect x="150" y="${318 + i * 18}" width="300" height="2.5" opacity=".18"/>`).join("")}</g>
<path d="M270 640 L282 330 L318 330 L330 640Z" fill="#12294a"/>
<path d="M276 560 H324 L326 585 H274Z M279 470 H321 L323 495 H277Z M282 395 H318 L320 418 H280Z" fill="#f1e4c8"/>
<rect x="276" y="300" width="48" height="32" fill="#12294a"/><rect x="284" y="306" width="32" height="20" fill="#f6c453"/><path d="M270 300 L300 268 L330 300Z" fill="#c4402f"/>
<path d="M300 316 L560 250 M300 316 L560 380" stroke="#f6c453" stroke-width="10" opacity=".55"/>
<path d="M42 640 Q120 610 200 640 T360 640 T520 640 T558 632 V858 H42Z" fill="#1d5fa8"/>
${Array.from({ length: 6 }, (_, i) => `<path d="M42 ${676 + i * 26} Q110 ${654 + i * 26} 180 ${676 + i * 26} T320 ${676 + i * 26} T460 ${676 + i * 26} T558 ${670 + i * 26}" fill="none" stroke="#12294a" stroke-width="${3 + (i % 2)}" opacity=".7"/>`).join("")}
<g font-family="'Arial Black', Impact, Arial, sans-serif" fill="#12294a" text-anchor="middle">
${T(300, 118, 26, "A NOVEL OF THE NORTH COAST", `letter-spacing="6" font-family="Arial, sans-serif" font-weight="700"`)}
${T(300, 190, 78, "THE LAST")}${T(300, 252, 58, "LIGHTHOUSE", `letter-spacing="2"`)}
${T(300, 822, 28, "E. MARLOWE", `letter-spacing="10" font-family="Arial, sans-serif" font-weight="700" fill="#f1e4c8"`)}
</g>`, "The Last Lighthouse by E. Marlowe", 0.35);

// 2. Topographic map on kraft paper
{
  const R = rnd(21); let rings = "";
  const centres = [[360, 430, 1], [190, 300, 0.7]];
  for (const [cx, cy, s] of centres) for (let k = 1; k <= 13; k++) {
    const ph = R() * 6, ph2 = R() * 6; let d = "";
    for (let a = 0; a <= 64; a++) { const t = (a / 64) * Math.PI * 2; const r = (k * 19 * s) * (1 + 0.16 * Math.sin(3 * t + ph) + 0.1 * Math.sin(5 * t + ph2)); d += `${a ? "L" : "M"}${(cx + Math.cos(t) * r).toFixed(1)} ${(cy + Math.sin(t) * r * 0.9).toFixed(1)} `; }
    rings += `<path d="${d}Z" fill="none" stroke="#7a5a30" stroke-width="${k % 4 === 0 ? 2.2 : 1}" opacity="${k % 4 === 0 ? 0.85 : 0.5}"/>`;
  }
  covers["northern-atlas"] = frame("", `
<rect width="600" height="900" fill="#d8c096"/>
<clipPath id="c"><rect x="60" y="150" width="480" height="560"/></clipPath>
<rect x="60" y="150" width="480" height="560" fill="#e6d3ad"/>
<g clip-path="url(#c)">${rings}<path d="M90 650 C170 560 240 600 300 500 S420 430 500 260" fill="none" stroke="#c4402f" stroke-width="3.5" stroke-dasharray="3 9" stroke-linecap="round"/>
<g stroke="#c4402f" stroke-width="5"><path d="M490 250 l20 20 M510 250 l-20 20"/></g><circle cx="96" cy="650" r="8" fill="#12294a"/></g>
<rect x="60" y="150" width="480" height="560" fill="none" stroke="#3b2a12" stroke-width="3"/>
<g stroke="#3b2a12" stroke-width="1.2">${Array.from({ length: 13 }, (_, i) => `<path d="M${60 + i * 40} 150 v10 M${60 + i * 40} 710 v-10"/>`).join("")}</g>
<g transform="translate(470 640)" fill="none" stroke="#3b2a12" stroke-width="2"><circle r="38"/><path d="M0 -52 L8 0 L0 52 L-8 0Z M-52 0 L0 -8 L52 0 L0 8Z" fill="#3b2a12"/></g>
<g fill="#2b1d0c" text-anchor="start" font-family="'Courier New', Courier, monospace">
${T(60, 98, 22, "FIELD NOTES &amp; ROUTES", `letter-spacing="5" font-weight="700"`)}
${T(60, 128, 15, "WITH 31 HAND-DRAWN MAPS", `letter-spacing="3"`)}
${T(60, 778, 66, "NORTHERN", `font-family="Georgia, serif" font-weight="700" letter-spacing="1"`)}
${T(60, 842, 66, "ATLAS", `font-family="Georgia, serif" font-weight="700" letter-spacing="1"`)}
${T(540, 842, 20, "R. QUINN", `text-anchor="end" letter-spacing="6" font-weight="700"`)}
</g>`, "Northern Atlas by R. Quinn", 0.5);
}

// 3. Gold-on-burgundy ornate fantasy
covers["paper-kingdoms"] = frame(`<linearGradient id="au" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7e29a"/><stop offset=".5" stop-color="#c9922c"/><stop offset="1" stop-color="#f2d27a"/></linearGradient><radialGradient id="bg" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#7a1b32"/><stop offset="1" stop-color="#2b0713"/></radialGradient>`, `
<rect width="600" height="900" fill="url(#bg)"/>
<rect x="44" y="44" width="512" height="812" fill="none" stroke="url(#au)" stroke-width="4"/><rect x="58" y="58" width="484" height="784" fill="none" stroke="url(#au)" stroke-width="1.5"/>
${[[44, 44], [556, 44], [44, 856], [556, 856]].map(([x, y]) => `<g transform="translate(${x} ${y})"><rect x="-13" y="-13" width="26" height="26" fill="#2b0713" stroke="url(#au)" stroke-width="3" transform="rotate(45)"/><circle r="5" fill="url(#au)"/></g>`).join("")}
<circle cx="300" cy="330" r="165" fill="none" stroke="url(#au)" stroke-width="3"/><circle cx="300" cy="330" r="150" fill="#3a0a19" stroke="url(#au)" stroke-width="1.5"/>
<g fill="url(#au)">
<path d="M190 470 V350 h22 v-24 h14 v24 h20 v-60 h18 v-24 h12 v24 h18 v60 h20 v-24 h14 v24 h22 v120Z" opacity=".95"/>
<path d="M270 470 v-52 q30 -30 60 0 v52Z" fill="#3a0a19"/>
<path d="M300 210 v-30 M300 190 l22 8 -22 8Z"/></g>
<g stroke="url(#au)" stroke-width="2" fill="none"><path d="M120 330 q-30 0 -30 30 M480 330 q30 0 30 30 M110 300 q10 -20 30 -10 M490 300 q-10 -20 -30 -10"/>${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${150 + i * 60}" cy="530" r="4" fill="url(#au)"/>`).join("")}</g>
<g text-anchor="middle" fill="url(#au)" font-family="Georgia, 'Palatino Linotype', serif">
${T(300, 622, 62, "PAPER", `letter-spacing="14" font-weight="700"`)}${T(300, 690, 62, "KINGDOMS", `letter-spacing="6" font-weight="700"`)}
${T(300, 738, 20, "BOOK ONE OF THE EMBER CROWN", `letter-spacing="5"`)}
<path d="M200 764 h80 M320 764 h80" stroke="#c9922c" stroke-width="1.5"/><rect x="293" y="757" width="14" height="14" transform="rotate(45 300 764)" fill="url(#au)"/>
${T(300, 818, 26, "S. HALE", `letter-spacing="12"`)}</g>`, "Paper Kingdoms by S. Hale", 0.45);

// 4. Soft watercolour poetry
covers["salt-and-ember"] = frame(`<filter id="wc" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="8" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="70"/><feGaussianBlur stdDeviation="9"/></filter>`, `
<rect width="600" height="900" fill="#f7f1e6"/>
<g filter="url(#wc)" style="mix-blend-mode:multiply">
<circle cx="230" cy="290" r="150" fill="#f28c28" opacity=".78"/><circle cx="360" cy="360" r="130" fill="#1d5fa8" opacity=".6"/><circle cx="300" cy="250" r="90" fill="#e8607a" opacity=".5"/>
<ellipse cx="300" cy="470" rx="230" ry="40" fill="#1d5fa8" opacity=".25"/></g>
<g stroke="#12294a" opacity=".5" stroke-width="1.2"><path d="M70 560 H530"/></g>
<g font-family="Georgia, 'Times New Roman', serif" fill="#12294a" text-anchor="middle" font-style="italic">
${T(300, 650, 76, "salt &amp; ember", `letter-spacing="-1"`)}
${T(300, 700, 20, "poems", `letter-spacing="8" font-style="normal" opacity=".7"`)}
${T(300, 818, 22, "M. VEGA", `font-style="normal" letter-spacing="12" font-family="Arial, sans-serif" font-weight="600"`)}</g>`, "Salt & Ember by M. Vega", 0.4);

// 5. Swiss typographic
covers["the-quiet-tide"] = frame("", `
<rect width="600" height="900" fill="#12294a"/>
<g stroke="#fff" stroke-opacity=".12">${Array.from({ length: 9 }, (_, i) => `<path d="M${60 + i * 60} 0 V900"/>`).join("")}${Array.from({ length: 14 }, (_, i) => `<path d="M0 ${60 + i * 60} H600"/>`).join("")}</g>
<circle cx="440" cy="236" r="112" fill="#f28c28"/>
<path d="M60 236 H330" stroke="#fff" stroke-width="3"/>
<g font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" fill="#fff">
${T(60, 120, 22, "NON-FICTION", `letter-spacing="6" font-weight="700"`)}
${T(60, 540, 40, "THE", `font-weight="700" letter-spacing="2"`)}
${T(52, 660, 150, "Quiet", `font-weight="800" letter-spacing="-6"`)}
${T(52, 784, 150, "Tide", `font-weight="800" letter-spacing="-6"`)}
${T(60, 840, 20, "ON SLOWING DOWN IN A LOUD WORLD", `letter-spacing="3" opacity=".85"`)}
${T(540, 120, 20, "L. OKAFOR", `text-anchor="end" letter-spacing="6" font-weight="700"`)}</g>`, "The Quiet Tide by L. Okafor", 0.25);

// 6. Noir halftone
{
  let dots = "";
  for (let y = 0; y < 46; y++) for (let x = 0; x < 31; x++) {
    const px = 12 + x * 19.4 + (y % 2 ? 9.7 : 0), py = 30 + y * 15.2;
    const dx = (px - 400) / 300, dy = (py - 330) / 330; const v = Math.max(0, 1 - Math.hypot(dx, dy));
    const r = v * 8.2; if (r > 0.6) dots += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}"/>`;
  }
  covers["midnight-orchard"] = frame("", `
<rect width="600" height="900" fill="#0c0c12"/>
<g fill="#f28c28">${dots}</g>
<g fill="#0c0c12"><path d="M20 640 V560 Q120 520 190 560 L200 640Z"/>
<g transform="translate(250 470)"><rect x="-9" y="0" width="18" height="180"/><path d="M0 40 L-90 -20 M0 60 L110 0 M0 10 L-40 -90 M0 20 L60 -80 M-90 -20 l-30 -30 M110 0 l30 -34" stroke="#0c0c12" stroke-width="12" stroke-linecap="round" fill="none"/>
<circle cx="-60" cy="-60" r="42"/><circle cx="50" cy="-90" r="50"/><circle cx="-110" cy="-10" r="30"/><circle cx="130" cy="-20" r="34"/><circle cx="0" cy="-130" r="40"/></g>
<path d="M0 650 Q140 620 300 650 T600 640 V900 H0Z"/></g>
<g fill="#f6c453">${[[-60, -20], [52, -90], [-4, -110], [118, -14], [-100, -4]].map(([x, y]) => `<circle cx="${250 + x}" cy="${470 + y}" r="7"/>`).join("")}</g>
<rect x="40" y="690" width="14" height="150" fill="#c4402f"/>
<g font-family="Impact, 'Arial Narrow', 'Arial Black', sans-serif" fill="#fff">
${T(74, 760, 96, "MIDNIGHT", `letter-spacing="2"`)}${T(74, 840, 96, "ORCHARD", `letter-spacing="2"`)}
${T(74, 880, 18, "SOME HARVESTS ARE BURIED.", `font-family="Arial, sans-serif" letter-spacing="5" font-weight="700" fill="#f28c28"`)}
${T(560, 56, 22, "T. BRANDT", `text-anchor="end" letter-spacing="8" font-family="Arial, sans-serif" font-weight="700"`)}</g>`, "Midnight Orchard by T. Brandt", 0.4);
}

// 7. Contemporary romance: bokeh and script
{
  const R = rnd(33); let b = "";
  for (let i = 0; i < 34; i++) { const x = R() * 600, y = R() * 620, r = 14 + R() * 56; b += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${["#ffd9a0", "#ffb566", "#ff8f70", "#fff1d6"][i % 4]}" opacity="${(0.12 + R() * 0.4).toFixed(2)}"/>`; }
  covers["written-in-amber"] = frame(`<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0e2e"/><stop offset=".55" stop-color="#8e2f3c"/><stop offset="1" stop-color="#f08a3a"/></linearGradient><filter id="bk"><feGaussianBlur stdDeviation="7"/></filter><filter id="gl"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`, `
<rect width="600" height="900" fill="url(#g)"/><g filter="url(#bk)">${b}</g>
<g fill="#12040f" opacity=".92"><circle cx="262" cy="430" r="34"/><path d="M200 700 Q196 520 262 480 Q300 500 306 560 L312 700Z"/><circle cx="346" cy="426" r="32"/><path d="M300 700 Q300 520 346 478 Q410 500 408 700Z"/></g>
<path d="M0 700 Q300 640 600 700 V900 H0Z" fill="#12040f" opacity=".82"/>
<g text-anchor="middle" fill="#fff6e6">
${T(300, 150, 20, "THE BREAKOUT ROMANCE OF THE SEASON", `letter-spacing="5" font-family="Arial, sans-serif" font-weight="700" opacity=".85"`).replace("THE BREAKOUT ROMANCE OF THE SEASON", "A LOVE STORY")}
<g filter="url(#gl)" font-family="'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive">
${T(300, 770, 96, "Written", `fill="#fff6e6"`)}${T(300, 850, 82, "in Amber", `fill="#ffd9a0"`)}</g>
${T(300, 880, 18, "C. DALTON", `letter-spacing="12" font-family="Arial, sans-serif" font-weight="700" opacity=".9"`)}</g>`, "Written in Amber by C. Dalton", 0.3);
}

// 8. Mid-century illustrated romance
covers["evenings-like-this"] = frame("", `
<rect width="600" height="900" fill="#f4d9c6"/>
<path d="M0 560 H600 V900 H0Z" fill="#e7b99a"/>
<path d="M130 560 a170 170 0 0 1 340 0Z" fill="#2a8c8c"/><circle cx="300" cy="560" r="96" fill="#f6c453"/>
<g fill="#c4602f"><rect x="30" y="470" width="70" height="90"/><rect x="108" y="430" width="56" height="130"/><rect x="480" y="450" width="64" height="110"/><rect x="552" y="490" width="48" height="70"/></g>
<g fill="#f6c453">${[[44, 490], [64, 490], [44, 520], [64, 520], [120, 450], [136, 450], [120, 480], [136, 480], [494, 470], [514, 470], [494, 500], [514, 500]].map(([x, y]) => `<rect x="${x}" y="${y}" width="9" height="13"/>`).join("")}</g>
<g fill="#12294a"><circle cx="272" cy="520" r="20"/><path d="M246 590 q0 -52 28 -52 q14 0 22 14 l-8 38Z" transform="translate(0 -8)"/><path d="M250 566 q22 -36 44 0 v90 h-44Z" transform="translate(0 -22)"/>
<circle cx="338" cy="524" r="19"/><path d="M308 568 q24 -40 52 -4 v92 h-52Z" transform="translate(0 -20)"/></g>
<g fill="#c4402f"><path d="M284 520 q16 -26 40 0 q-20 16 -40 0Z" transform="translate(-4 -38) scale(.8)"/></g>
<path d="M0 700 Q300 676 600 700" stroke="#c4602f" stroke-width="3" fill="none" opacity=".6"/>
<g font-family="'Trebuchet MS', Verdana, sans-serif" fill="#1f5a5a" text-anchor="middle">
${T(300, 130, 84, "evenings", `font-weight="700" letter-spacing="-2"`)}${T(300, 214, 84, "like this", `font-weight="700" letter-spacing="-2" fill="#c4402f"`)}
${T(300, 270, 20, "a love story for slow summers", `letter-spacing="3" fill="#7a3d22"`)}
${T(300, 830, 24, "J. NAVARRO", `letter-spacing="12" font-weight="700" fill="#12294a"`)}</g>`, "Evenings Like This by J. Navarro", 0.35);

// 9. Art deco gold on black
covers["the-quiet-flame"] = frame(`<linearGradient id="au" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8e7a8"/><stop offset=".5" stop-color="#c79a35"/><stop offset="1" stop-color="#8a6420"/></linearGradient>`, `
<rect width="600" height="900" fill="#0a0a0d"/>
<rect x="40" y="40" width="520" height="820" fill="none" stroke="url(#au)" stroke-width="3"/><rect x="52" y="52" width="496" height="796" fill="none" stroke="url(#au)" stroke-width="1"/>
<g transform="translate(300 500)" fill="url(#au)">${Array.from({ length: 25 }, (_, i) => { const a = Math.PI + (i / 24) * Math.PI; const x1 = Math.cos(a - .03) * 330, y1 = Math.sin(a - .03) * 330, x2 = Math.cos(a + .03) * 330, y2 = Math.sin(a + .03) * 330; return `<path d="M0 0 L${x1.toFixed(0)} ${y1.toFixed(0)} L${x2.toFixed(0)} ${y2.toFixed(0)}Z" opacity="${i % 2 ? 0.55 : 0.9}"/>`; }).join("")}</g>
<g fill="none" stroke="#0a0a0d" stroke-width="10">${[250, 190, 130].map((r) => `<path d="M${300 - r} 500 A${r} ${r} 0 0 1 ${300 + r} 500"/>`).join("")}</g>
<g fill="none" stroke="url(#au)" stroke-width="4">${[250, 190, 130, 70].map((r) => `<path d="M${300 - r} 500 A${r} ${r} 0 0 1 ${300 + r} 500"/>`).join("")}</g>
<path d="M300 380 c28 40 40 62 28 90 c-6 14 -18 20 -28 20 c-10 0 -22 -6 -28 -20 c-12 -28 0 -50 28 -90Z" fill="#fff0c0"/>
<rect x="276" y="490" width="48" height="30" fill="url(#au)"/><path d="M60 520 H540" stroke="url(#au)" stroke-width="3"/><path d="M60 530 H540" stroke="url(#au)" stroke-width="1"/>
<g text-anchor="middle" fill="url(#au)" font-family="Georgia, 'Palatino Linotype', serif">
${T(300, 616, 22, "A MEDITATION ON STILLNESS", `letter-spacing="6" font-family="Arial, sans-serif" font-weight="700"`)}
${T(300, 700, 72, "THE QUIET", `letter-spacing="8"`)}${T(300, 780, 72, "FLAME", `letter-spacing="30"`)}
${T(300, 830, 22, "A. REYES", `letter-spacing="14" font-family="Arial, sans-serif"`)}</g>`, "The Quiet Flame by A. Reyes", 0.4);

// 10. Sacred geometry, fine line
{
  const cx = 300, cy = 400, r = 70; let c = `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
  for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3; c += `<circle cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" r="${r}"/>`; }
  for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3 + Math.PI / 6; c += `<circle cx="${(cx + Math.cos(a) * r * 1.732).toFixed(1)}" cy="${(cy + Math.sin(a) * r * 1.732).toFixed(1)}" r="${r}"/>`; }
  covers["light-between-worlds"] = frame(`<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a1a5e"/><stop offset=".6" stop-color="#3a2a85"/><stop offset="1" stop-color="#6b3a9a"/></linearGradient><radialGradient id="gl" cx=".5" cy=".44" r=".5"><stop offset="0" stop-color="#ffd2a1" stop-opacity=".55"/><stop offset="1" stop-color="#ffd2a1" stop-opacity="0"/></radialGradient>`, `
<rect width="600" height="900" fill="url(#g)"/><circle cx="300" cy="400" r="330" fill="url(#gl)"/>
<g fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.6">${c}<circle cx="300" cy="400" r="${r * 3.1}" stroke-opacity=".6"/><circle cx="300" cy="400" r="${r * 3.3}" stroke-opacity=".35"/></g>
<g fill="#ffd2a1">${Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; return `<circle cx="${(300 + Math.cos(a) * r * 3.3).toFixed(1)}" cy="${(400 + Math.sin(a) * r * 3.3).toFixed(1)}" r="${i % 3 ? 2 : 4}"/>`; }).join("")}</g>
<circle cx="300" cy="400" r="8" fill="#fff"/>
<g text-anchor="middle" fill="#fff" font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-weight="300">
${T(300, 690, 40, "LIGHT BETWEEN", `letter-spacing="10"`)}${T(300, 744, 40, "WORLDS", `letter-spacing="28"`)}
<path d="M240 776 h120" stroke="#ffd2a1"/>
${T(300, 820, 20, "M. OKONKWO", `letter-spacing="12" font-weight="600" fill="#ffd2a1"`)}</g>`, "Light Between Worlds by M. Okonkwo", 0.3);
}

// 11. Risograph two-colour
{
  const R = rnd(55); const pts = Array.from({ length: 26 }, () => [90 + R() * 420, 120 + R() * 420]);
  let l = ""; for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < 120) l += `<line x1="${pts[i][0].toFixed(0)}" y1="${pts[i][1].toFixed(0)}" x2="${pts[j][0].toFixed(0)}" y2="${pts[j][1].toFixed(0)}"/>`; }
  const nodes = pts.map(([x, y], i) => `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${4 + (i % 4) * 3}"/>`).join("");
  covers["mind-in-motion"] = frame("", `
<rect width="600" height="900" fill="#f1ead9"/>
<g style="mix-blend-mode:multiply"><g transform="translate(7 5)" fill="#ff6a3d" stroke="#ff6a3d" stroke-width="1.5" opacity=".92"><ellipse cx="300" cy="330" rx="210" ry="190" opacity=".35"/>${l}${nodes}</g>
<g fill="#2d4fd0" stroke="#2d4fd0" stroke-width="1.5" opacity=".92"><ellipse cx="300" cy="330" rx="210" ry="190" opacity=".25"/>${l}${nodes}</g></g>
<g font-family="'Courier New', Courier, monospace" fill="#2d4fd0">
${T(60, 90, 18, "A FIELD GUIDE TO ATTENTION", `letter-spacing="4" font-weight="700"`)}
${T(60, 690, 78, "MIND", `font-weight="700" letter-spacing="-2"`)}${T(60, 770, 78, "IN MOTION", `font-weight="700" letter-spacing="-2"`)}
<rect x="60" y="800" width="480" height="3" fill="#ff6a3d"/>
${T(60, 840, 22, "P. LINDQVIST", `letter-spacing="10" font-weight="700"`)}</g>`, "Mind in Motion by P. Lindqvist", 0.55);
}

// 12. Bold typographic self-help
covers["the-daily-reset"] = frame("", `
<rect width="600" height="900" fill="#f28c28"/>
<rect x="0" y="0" width="600" height="320" fill="#12294a"/>
<g fill="#ffd9b0">${Array.from({ length: 7 }, (_, i) => `<rect x="${60 + i * 70}" y="${250 - i * 22}" width="46" height="${70 + i * 22}"/>`).join("")}</g>
<path d="M60 230 L130 200 L200 170 L270 130 L340 120 L410 90 L480 60" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="480" cy="60" r="11" fill="#fff"/>
<g font-family="'Arial Black', Impact, 'Helvetica Neue', Arial, sans-serif" fill="#12294a">
${T(52, 440, 74, "THE DAILY", `textLength="490" lengthAdjust="spacingAndGlyphs"`)}
${T(52, 600, 160, "RESET", `textLength="490" lengthAdjust="spacingAndGlyphs" fill="#fff"`)}
${T(52, 662, 25, "SMALL STEPS. STEADY CHANGE.", `letter-spacing="2" font-family="Arial, sans-serif" font-weight="700"`)}
${T(52, 836, 26, "R. AHMADI", `letter-spacing="10" font-family="Arial, sans-serif" font-weight="700"`)}</g>
<g transform="translate(118 112)"><circle r="66" fill="#f28c28"/><circle r="60" fill="#12294a"/><circle r="58" fill="none" stroke="#f28c28" stroke-width="2" stroke-dasharray="3 5"/>
<g fill="#fff" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800">${T(0, -6, 36, "30")}${T(0, 20, 15, "DAY PLAN", `letter-spacing="2"`)}</g></g>`, "The Daily Reset by R. Ahmadi", 0.3);

for (const [slug, svg] of Object.entries(covers)) fs.writeFileSync(dir + slug + ".svg", svg);
console.log(Object.keys(covers).length, "covers written");
