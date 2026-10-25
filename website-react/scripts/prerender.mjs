// Writes a static HTML file per route into dist/ so crawlers get real content, titles and canonicals.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ORIGIN = "https://firefoxpublisher.com";

const { render } = await import(pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href);
const template = readFileSync(join(dist, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function page(url, canonical, isNotFound) {
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
  }
  if (canonical) {
    out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
    out = out.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`);
  } else {
    out = out.replace(/\s*<link rel="canonical"[^>]*>/, "").replace(/\s*<meta property="og:url"[^>]*>/, "");
  }
  if (isNotFound) out = out.replace("</head>", '  <meta name="robots" content="noindex">\n</head>');
  return out;
}

const sitemap = readFileSync(join(root, "public", "sitemap.xml"), "utf8");
const paths = [...sitemap.matchAll(/<loc>https:\/\/firefoxpublisher\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");

for (const p of paths) {
  const html = page(p, ORIGIN + p);
  // /foo is served from foo.html by Cloudflare; "/" from index.html
  writeFileSync(join(dist, p === "/" ? "index.html" : `${p.slice(1)}.html`), html);
}
writeFileSync(join(dist, "404.html"), page("/this-page-does-not-exist", null, true));
rmSync(join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`Prerendered ${paths.length} routes + 404.html`);
