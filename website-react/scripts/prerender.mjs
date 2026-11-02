// Writes a static HTML file per route into dist/ so crawlers get real content, titles and canonicals,
// links each page's own CSS and scripts into it, and writes sitemap.xml from the route list.
import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ORIGIN = "https://firefoxpublisher.com";

const { render, ROUTES } = await import(pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href);
const template = readFileSync(join(dist, "index.html"), "utf8");
const manifest = JSON.parse(readFileSync(join(dist, ".vite", "manifest.json"), "utf8"));

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Everything a page needs: its own chunk plus the chunks it imports, with their CSS.
function assetsFor(name) {
  const key = `src/pages/${name}.jsx`;
  const js = new Set(), css = new Set(), seen = new Set();
  const walk = (k) => {
    const c = manifest[k];
    if (!c || seen.has(k)) return;
    seen.add(k);
    js.add(c.file);
    (c.css || []).forEach((f) => css.add(f));
    (c.imports || []).forEach(walk);
  };
  walk(key);
  return { js: [...js], css: [...css] };
}

function page(url, canonical, noindex, name) {
  const { html, meta } = render(url);
  let out = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  if (meta) {
    const set = (re, val) => { out = out.replace(re, val); };
    set(/<title>.*?<\/title>/, `<title>${esc(meta.title)}</title>`);
    if (meta.description) {
      set(/(<meta name="description" content=")[^"]*(")/, `$1${esc(meta.description)}$2`);
      set(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(meta.description)}$2`);
    }
    set(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(meta.title)}$2`);
    set(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(meta.title)}$2`);
    if (meta.description) set(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(meta.description)}$2`);
  }
  if (canonical) {
    out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
    out = out.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`);
  } else {
    out = out.replace(/\s*<link rel="canonical"[^>]*>/, "").replace(/\s*<meta property="og:url"[^>]*>/, "");
  }
  if (noindex) out = out.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex">');
  if (name) {
    const a = assetsFor(name);
    const tags = [...a.css.map((f) => `<link rel="stylesheet" href="/${f}">`), ...a.js.map((f) => `<link rel="modulepreload" href="/${f}">`)];
    out = out.replace("</head>", `  ${tags.join("\n  ")}\n</head>`);
  }
  return out;
}

const fileFor = (p) => (p === "/" ? "index.html" : `${p.slice(1)}.html`);
const listed = ROUTES.filter((r) => r.sitemap !== false);

for (const r of listed) writeFileSync(join(dist, fileFor(r.path)), page(r.path, ORIGIN + r.path, false, r.name));
// Pages that exist as files (so a refresh works) but stay out of the sitemap and search results.
for (const r of ROUTES.filter((x) => x.sitemap === false)) writeFileSync(join(dist, fileFor(r.path)), page(r.path, null, true, r.name));
writeFileSync(join(dist, "404.html"), page("/this-page-does-not-exist", null, true, "NotFound"));

// sitemap.xml, with last-modified dates from the committed src/data/lastmod.json (npm run lastmod).
const lastmodFile = join(root, "src", "data", "lastmod.json");
const lastmod = existsSync(lastmodFile) ? JSON.parse(readFileSync(lastmodFile, "utf8")) : {};
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...listed.map((r) => {
    if (!lastmod[r.path]) console.warn(`WARNING: no last-modified date for ${r.path}. Run "npm run lastmod" and commit src/data/lastmod.json.`);
    return [
      "  <url>",
      `    <loc>${ORIGIN}${r.path}</loc>`,
      lastmod[r.path] ? `    <lastmod>${lastmod[r.path]}</lastmod>` : null,
      `    <changefreq>${r.changefreq || "monthly"}</changefreq>`,
      `    <priority>${r.priority || "0.5"}</priority>`,
      "  </url>",
    ].filter(Boolean).join("\n");
  }),
  "</urlset>",
  "",
].join("\n");
writeFileSync(join(dist, "sitemap.xml"), xml);

// Every sitemap page should also be listed in llms.txt for AI assistants.
const llms = readFileSync(join(root, "public", "llms.txt"), "utf8");
for (const r of listed) {
  const url = ORIGIN + r.path;
  if (!llms.includes(`(${url})`) && !llms.includes(`(${url}/)`)) console.warn(`WARNING: ${r.path} is missing from public/llms.txt`);
}

rmSync(join(root, "dist-ssr"), { recursive: true, force: true });
rmSync(join(dist, ".vite"), { recursive: true, force: true });
console.log(`Prerendered ${listed.length} routes + ${ROUTES.length - listed.length} unlisted + 404.html, wrote sitemap.xml`);
