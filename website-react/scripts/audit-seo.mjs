// Checks the built pages in dist/ for common SEO problems: node scripts/audit-seo.mjs (run after npm run build).
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ORIGIN = "https://firefoxpublisher.com";
const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
const paths = [...sitemap.matchAll(/<loc>https:\/\/firefoxpublisher\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
const known = new Set([...paths, "/thank-you"]);
const problems = [];
const titles = new Map();
const descs = new Map();

for (const p of paths) {
  const file = join(dist, p === "/" ? "index.html" : `${p.slice(1)}.html`);
  if (!existsSync(file)) { problems.push(`${p}: no prerendered file`); continue; }
  const html = readFileSync(file, "utf8");
  const get = (re) => ((html.match(re) || [])[1] || "").replace(/&amp;/g, "&").replace(/&quot;/g, "\"") || undefined;
  const title = get(/<title>(.*?)<\/title>/);
  const desc = get(/<meta name="description" content="([^"]*)"/);
  const canonical = get(/<link rel="canonical" href="([^"]*)"/);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const bad = (m) => problems.push(`${p}: ${m}`);
  if (!title) bad("missing title"); else { if (title.length > 60) bad(`title is ${title.length} characters (max 60): ${title}`); titles.set(title, [...(titles.get(title) || []), p]); }
  if (!desc) bad("missing meta description"); else { if (desc.length > 160) bad(`description is ${desc.length} characters (max 160)`); descs.set(desc, [...(descs.get(desc) || []), p]); }
  if (canonical !== ORIGIN + (p === "/" ? "/" : p)) bad(`canonical is ${canonical}`);
  if (h1s !== 1) bad(`${h1s} H1 headings (want 1)`);
  for (const tag of ['og:title', 'og:description', 'og:url', 'og:image', 'twitter:card']) if (!html.includes(`"${tag}"`)) bad(`missing ${tag}`);
  if (!html.includes("application/ld+json")) bad("no structured data");
  const imgsNoAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (imgsNoAlt) bad(`${imgsNoAlt} images without an alt attribute`);
  for (const m of html.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)) {
    const to = m[1].replace(/\/+$/, "") || "/";
    if (!known.has(to) && !/\.(png|jpg|webp|svg|txt|xml|json|ico|pdf)$/.test(to)) problems.push(`${p}: link to unknown page ${to}`);
  }
}
for (const [t, ps] of titles) if (ps.length > 1) problems.push(`duplicate title on ${ps.join(", ")}`);
for (const [d, ps] of descs) if (ps.length > 1) problems.push(`duplicate description on ${ps.join(", ")}`);

const uniq = [...new Set(problems)];
console.log(`Checked ${paths.length} pages.`);
if (uniq.length) { console.log(uniq.join("\n")); process.exitCode = 1; } else console.log("No problems found.");
