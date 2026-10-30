# Firefox Publisher: project notes

Marketing site for firefoxpublisher.com. Read this instead of re-exploring the repo.

## Layout
- `website-react/` is the live site (Vite + React 19 + react-router). `website/` and `pak-services-post/` are old or unrelated: ignore them.
- `worker/index.js`: Cloudflare Worker, only handles `/api/*` (contact form email). `wrangler.jsonc` deploys `website-react/dist`.
- Dev server: `npm run dev --prefix website-react` (port 5180, configured in `.claude/launch.json`). Build: `npm run build --prefix website-react` (also prerenders HTML per route).

## Where things are
- Routes: `src/App.jsx`. Nav and footer: `src/components/Layout.jsx`. One page per file in `src/pages/`.
- SEO: `usePageMeta(title, description)` in every page (keep title under 60 chars and description under 160). JSON-LD helpers in `src/components/Schema.jsx`. New pages must also be added to `public/sitemap.xml`, `public/llms.txt` and `public/ai-catalog.json`.
- Styles load in this order: styles.css, cinematic.css, polish.css, theme.css, motion.css. Cover maker styles are in `cover-maker.css`. Later files win.
- Primary buttons have a custom animated "shiny" border in theme.css: never override their `animation`.

## Free book cover maker (`/free-book-cover-maker`)
- `src/lib/coverTemplates.js`: 18 code-drawn templates (12 free, 6 premium) on canvas, plus the generator that makes 48 colour variants each (864 total). Exports `COVERS`, `drawCover`, `coverToSVG`.
- `src/lib/svgContext.js` records the same canvas drawing as SVG. `src/lib/pdf.js` writes a one-page PDF.
- Paywall config: `src/data/premium.js` (`PAYMENT_LINK` is empty until the payment link exists). The lock is front-end only; real sales need a server-side check in the Worker.
- Never copy templates from Canva, Adobe, Pinterest or other sites (copyright). Add new designs as original code-drawn templates.
- Studio editor (pop-up, front cover only): `src/components/CoverStudio.jsx` (UI, lazy-loaded and portalled to `document.body`) and `src/lib/studio.js` (layer model, drawing, hit-testing, resize/rotate maths, `seedLayers`). `seedLayers` records the template's own `fillText` calls to turn its title, subtitle, author and tagline into movable text layers; the template art is drawn with those four fields blank. Styles: `cover-studio.css`. Studio exports are PNG, JPG, WebP, PDF (no SVG) and reuse the same watermark and unlock gate.
- Header search: `SiteSearch.jsx` over the static index in `src/data/searchIndex.js`. Add new pages and services there.
- Scroll performance: endless animations on buttons and dots are paused off-screen by `useOffscreenPause` in `Layout.jsx` (`.is-off` in motion.css). Avoid `backdrop-filter` on repeated or animated elements.

## Conventions
- Respect `prefers-reduced-motion`. Keep one H1 per page. Decorative images use `alt=""`.
- Verify UI changes with the preview tools, not by asking the user.
- Do not read `dist/`, `dist-ssr/`, `node_modules/` or `public/assets/` images.
