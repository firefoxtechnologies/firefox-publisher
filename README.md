# Firefox Publishing website

Static site (HTML, CSS, JavaScript). No build step.

## Run it

    npx http-server . -p 5180

Then open http://localhost:5180

## Structure

- index.html, books.html, portfolio.html, publishing.html, author-branding-marketing.html,
  audio-video-production.html, digital-creative-services.html
- styles.css (base), cinematic.css (hero), polish.css (refinements), theme.css (blue/orange/white theme, animation)
- script.js, cinematic.js
- assets/logo.jpg, assets/covers/*.svg (original sample covers), assets/classics/*.jpg (public-domain covers from Standard Ebooks, CC0)
- tools/gen.js builds the inner pages (service pages, portfolio, books); tools/covers2.js redraws the sample covers.
  Both write to a hard-coded output path near the top of each file: edit `out` / `dir` before running.

## Still to do

- Connect the contact form to contactus@firefoxpublishing.com (needs a form service or backend).
- Replace placeholder portfolio cards and sample books with real projects (with permission).
