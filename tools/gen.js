const fs = require("fs"), path = require("path");
const out = "C:/Users/LAPVY/OneDrive/Desktop/New folder (2)/firefox-publishing";

const head = (title, desc) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Firefox Publishers</title>
  <meta name="description" content="${desc}">
  <link rel="icon" href="assets/logo.jpg">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Firefox Publishers">
  <meta property="og:image" content="assets/logo.jpg">
  <noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>
  <meta name="theme-color" content="#12294a">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="cinematic.css">
  <link rel="stylesheet" href="polish.css">
  <link rel="stylesheet" href="theme.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <div class="topbar"><div class="wrap topbar__in"><span class="topbar__brand">A child company of <strong><a class="parent-link" href="https://firefoxtechnologies.com/" target="_blank" rel="noopener">Firefox Technologies</a></strong></span><span class="topbar__links"><a class="plain" href="mailto:contactus@firefoxpublishing.com">contactus@firefoxpublishing.com</a><a class="plain" href="tel:+12014645345">+1 201-464-5345</a><a href="index.html#contact">Get a free consultation</a></span></div></div>
  <header class="header">
    <div class="wrap header__in">
      <a class="brand" href="index.html" aria-label="Firefox Publishers, home">
        <img src="assets/logo.jpg" alt="">
        <span>FIREFOX<small>PUBLISHING</small></span>
      </a>
      <button type="button" class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
      <nav class="nav" id="nav" aria-label="Main">
        <a href="index.html#services">Services</a>
        <a href="index.html#packages">Packages</a>
        <a href="portfolio.html">Portfolio</a>
        <a href="books.html">Books</a>
        <a href="index.html#process">Process</a>
        <a href="index.html#about">About</a>
        <a class="btn btn--primary" href="index.html#contact">Start a project</a>
      </nav>
    </div>
  </header>
  <main id="main">
`;
const foot = `  </main>
  <footer class="footer">
    <div class="wrap">
      <div class="footer__cols">
        <div><strong>FIREFOX PUBLISHERS</strong><p style="margin-top:12px">Helping authors present, publish and promote their work with professional care.</p><p class="footer__parent">A child company of <a class="parent-link" href="https://firefoxtechnologies.com/" target="_blank" rel="noopener">Firefox Technologies</a>.</p></div>
        <div><p class="fhead">Company</p><a href="index.html#about">About</a><a href="portfolio.html">Portfolio</a><a href="books.html">Books</a><a href="index.html#process">Process</a><a href="index.html#contact">Contact</a></div>
        <div><p class="fhead">Services</p><a href="publishing.html">Publishing</a><a href="author-branding-marketing.html">Author Branding &amp; Marketing</a><a href="audio-video-production.html">Audio &amp; Video Production</a><a href="digital-creative-services.html">Digital &amp; Creative Services</a></div>
        <div><p class="fhead">Contact</p><a href="mailto:contactus@firefoxpublishing.com">contactus@firefoxpublishing.com</a><a href="tel:+12014645345">+1 201-464-5345</a><address>333 Washington St #233<br>Hoboken, New Jersey 07030, USA</address></div>
      </div>
      <small>Fees apply; results vary. We do not guarantee sales or bestseller status.<br>&copy; <span id="year">2026</span> Firefox Publishers. Part of Firefox Technologies.</small>
    </div>
  </footer>
  <script src="script.js"></script>
  <script src="cinematic.js"></script>
</body>
</html>
`;
const cta = `    <section class="section band">
      <div class="wrap cta">
        <div><h2>Ready to talk about your story?</h2><p>Tell us about your project and we will reply with the next step.</p></div>
        <a class="btn btn--primary" href="index.html#contact">Start a project</a>
      </div>
    </section>
`;
const services = [
  { file: "publishing", name: "Publishing", short: "Editing, design and production that take a manuscript to a finished book.",
    intro: "From manuscript to finished book, we handle the craft behind a professional publication and explain each step in plain language.",
    items: [["Editing &amp; proofreading","Developmental, line and copy editing, plus a final proofread."],["Cover design","A cover that fits your genre and reads clearly at thumbnail size."],["Interior layout","Typesetting for print and e-book, with consistent styles."],["Format preparation","Files prepared for print and digital distribution."],["Book writing support","A writing partner to shape ideas into a clear manuscript."],["Book printing","Print-ready files and proofs for paperback and hardcover."],["ISBNs &amp; distribution","Metadata and retailer set-up, registered under your name."],["Proofs &amp; final files","Review proofs and approve final files before release."]],
    who: "Authors with a completed or near-complete manuscript who want a professional finish." },
  { file: "author-branding-marketing", name: "Author Branding &amp; Marketing", short: "A consistent author presence and launch support that helps your book be found.",
    intro: "A recognisable author identity and a clear plan for introducing your book to readers, without exaggerated promises.",
    items: [["Author brand identity","Logo, colour and type direction for your author presence."],["Launch planning","A timeline and messaging for your release."],["Social media content","Templates and posts, from carousels to author spotlights."],["Promotional materials","Bookmarks, banners, media kits and email signatures."],["Book marketing","Review outreach, pricing and category guidance."],["Illustration","Custom illustration for covers, picture books and promotion."]],
    who: "Authors and creators preparing to launch or refresh how they present themselves." },
  { file: "audio-video-production", name: "Audio &amp; Video Production", short: "Trailers, promo clips and audio that bring your story to life.",
    intro: "Moving image and sound that introduce your work and give readers another way in.",
    items: [["Book trailers","A short trailer to introduce your book."],["Short-form video","Vertical clips and covers for social platforms."],["Audio production","Recording and editing for audio versions and promos."],["Author interviews","Filmed or recorded conversations and highlights."],["Audiobook production","Narration, recording and mastering to retailer specifications."],["Video editing","Cut-downs and captions for each platform."]],
    who: "Authors who want video or audio to support a launch or ongoing promotion." },
  { file: "digital-creative-services", name: "Digital &amp; Creative Services", short: "Websites and design work that give your project a professional home online.",
    intro: "A calm, content-first online home and the design pieces that support it.",
    items: [["Author websites","A fast, accessible site that presents you and your books."],["Graphic design","Layouts for documents, presentations and print."],["Marketing materials","Flyers, one-sheets and promotional graphics."],["Business documents","Proposals, quotations and invoices in a consistent style."],["Web design &amp; SEO","Search-friendly structure so readers can find you."],["Articles &amp; web content","Blog posts, articles and web copy for your platform."]],
    who: "Authors and creators who need a professional online presence or design support." },
];
const others = (cur) => services.filter(s => s.file !== cur).map(s => `<a class="card" href="${s.file}.html"><h3>${s.name}</h3><p>${s.short}</p></a>`).join("\n          ");

for (const s of services) {
  fs.writeFileSync(path.join(out, s.file + ".html"),
    head(s.name, s.short) + `    <section class="page-hero">
      <div class="wrap">
        <p class="crumbs"><a href="index.html">Home</a> / <a href="index.html#services">Services</a> / ${s.name}</p>
        <h1>${s.name}</h1>
        <p class="lead">${s.intro}</p>
        <div class="hero__cta"><a class="btn btn--primary" href="index.html#contact">Start a project</a><a class="btn btn--secondary" href="portfolio.html">View our work</a></div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="section__head reveal"><p class="eyebrow">What is included</p><h2>Deliverables</h2><p>Final scope and deliverables are confirmed in a written plan before work begins.</p></div>
        <div class="grid grid--3">
${s.items.map(i => `          <article class="card reveal"><h3>${i[0]}</h3><p>${i[1]}</p></article>`).join("\n")}
        </div>
        <p class="note">Draft service details. Replace with the final offer before launch.</p>
      </div>
    </section>
    <section class="section section--ice">
      <div class="wrap split">
        <div class="reveal"><p class="eyebrow">Who it is for</p><p class="quote">${s.who}</p></div>
        <div class="reveal"><h2>How it works</h2>
          <ol class="mini">
            <li><strong>Discover.</strong> We learn about your story and goals.</li>
            <li><strong>Plan.</strong> You receive a clear scope, timeline and deliverables.</li>
            <li><strong>Create.</strong> We produce the work and share progress.</li>
            <li><strong>Launch.</strong> We help you present and promote the result.</li>
          </ol>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="section__head reveal"><p class="eyebrow">Explore more</p><h2>Other services</h2></div>
        <div class="grid grid--3">
          ${others(s.file)}
        </div>
      </div>
    </section>
` + cta + foot);
}

const projects = services.concat(services.slice(0, 2));
fs.writeFileSync(path.join(out, "portfolio.html"),
  head("Portfolio", "Selected Firefox Publishers projects: objective, work completed and deliverables.") + `    <section class="page-hero">
      <div class="wrap">
        <p class="crumbs"><a href="index.html">Home</a> / Portfolio</p>
        <h1>Portfolio</h1>
        <p class="lead">Each project shows the objective, the work we completed and what was delivered. The work leads; our branding stays secondary.</p>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <h2 class="sr-only">Projects</h2>
        <div class="filters" role="group" aria-label="Filter projects">
          <button type="button" class="chip active" data-filter="all" aria-pressed="true">All</button>
${services.map(s => `          <button type="button" class="chip" data-filter="${s.file}" aria-pressed="false">${s.name}</button>`).join("\n")}
        </div>
        <div class="grid grid--3" id="projects">
${projects.map((s, n) => `          <article class="work" data-cat="${s.file}">
            <div class="work__img" role="img" aria-label="Placeholder for project image">Project image</div>
            <div class="work__body">
              <p class="tag">${s.name}</p>
              <h3>Project title ${n + 1}</h3>
              <dl>
                <dt>Objective</dt><dd>What the client wanted to achieve.</dd>
                <dt>Work completed</dt><dd>What Firefox Publishers did.</dd>
                <dt>Deliverables</dt><dd>What was handed over.</dd>
              </dl>
            </div>
          </article>`).join("\n")}
        </div>
        <p class="note">Placeholders. Publish only real projects, permissioned visuals and substantiated results, and keep each client's identity distinct from ours.</p>
      </div>
    </section>
` + cta + foot);

const sampleBooks = [
  ["k1","moon","The Last Lighthouse","E. Marlowe","Fiction","E-book, Paperback"],
  ["k2","peaks","Northern Atlas","R. Quinn","Travel &amp; Memoir","Paperback, Hardcover"],
  ["k3","sun","Paper Kingdoms","S. Hale","Fantasy","E-book, Paperback, Hardcover"],
  ["k4","waves","Salt &amp; Ember","M. Vega","Poetry","E-book, Paperback"],
  ["k5","stripes","The Quiet Tide","L. Okafor","Non-fiction","E-book, Paperback"],
  ["k6","rings","Midnight Orchard","T. Brandt","Mystery","E-book, Paperback, Hardcover"],
  ["k4","sun","Written in Amber","C. Dalton","Romance","E-book, Paperback"],
  ["k1","stripes","Evenings Like This","J. Navarro","Romance","E-book, Paperback"],
  ["k6","rings","The Quiet Flame","A. Reyes","Spirituality","E-book, Paperback, Hardcover"],
  ["k1","sun","Light Between Worlds","M. Okonkwo","Spirituality","E-book, Paperback"],
  ["k4","rings","Mind in Motion","P. Lindqvist","Science","E-book, Paperback, Hardcover"],
  ["k2","stripes","The Daily Reset","R. Ahmadi","Self-help","E-book, Paperback"],
];
const coverFor = (t) => { const slug = t.replace(/&amp;/g, "and").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); for (const ext of ["svg", "jpg", "jpeg", "png", "webp"]) if (fs.existsSync(path.join(out, "assets/covers", slug + "." + ext))) return "assets/covers/" + slug + "." + ext; return ""; };
const bookCard = ([k, art, t, a, genre, fmt]) => `          <article class="product reveal" data-genre="${genre}">
            <div class="product__stage">
${coverFor(t) ? `<img class="product__cover" src="${coverFor(t)}" alt="Cover of ${t} by ${a}" width="600" height="900" loading="lazy" decoding="async">` : `<div class="book book--static ${k}" aria-hidden="true" style="--w:150px"><span class="back"></span><span class="spine"></span><span class="edge"></span><span class="front"><u class="art ${art}"></u><b>${t}</b><em>${a}</em></span></div>`}
            </div>
            <div class="product__body">
              <p class="tag">${genre}</p>
              <h3>${t}</h3>
              <p class="by">by ${a}</p>
              <p class="fmt">${fmt}</p>
              <span class="sample-tag">Sample title</span>
            </div>
          </article>`;

const classics = [
  ["pride-and-prejudice","Pride and Prejudice","Jane Austen","jane-austen/pride-and-prejudice","Classic fiction"],
  ["frankenstein","Frankenstein","Mary Shelley","mary-shelley/frankenstein","Gothic"],
  ["the-great-gatsby","The Great Gatsby","F. Scott Fitzgerald","f-scott-fitzgerald/the-great-gatsby","Classic fiction"],
  ["dracula","Dracula","Bram Stoker","bram-stoker/dracula","Gothic"],
  ["moby-dick","Moby-Dick","Herman Melville","herman-melville/moby-dick","Adventure"],
  ["the-picture-of-dorian-gray","The Picture of Dorian Gray","Oscar Wilde","oscar-wilde/the-picture-of-dorian-gray","Gothic"],
];
const classicCard = ([f, t, a, p, genre]) => `          <article class="product classic reveal">
            <a class="product__stage" href="https://standardebooks.org/ebooks/${p}" target="_blank" rel="noopener" aria-label="${t} by ${a} on Standard Ebooks (opens in a new tab)">
              <img class="classic__cover" src="assets/classics/${f}.jpg" alt="Cover of ${t} by ${a}" width="300" height="450" loading="lazy">
            </a>
            <div class="product__body">
              <p class="tag">${genre}</p>
              <h3>${t}</h3>
              <p class="by">by ${a}</p>
              <p class="fmt">Public domain classic</p>
              <span class="sample-tag sample-tag--pd">Public domain</span>
            </div>
          </article>`;
const genres = [...new Set(sampleBooks.map((b) => b[4]))];
fs.writeFileSync(path.join(out, "books.html"),
  head("Books", "Sample books showing the covers and formats Firefox Publishers produces.") + `    <section class="page-hero">
      <div class="wrap">
        <p class="crumbs"><a href="index.html">Home</a> / Books</p>
        <h1>Books</h1>
        <p class="lead">A shelf of sample titles showing the kind of covers, formats and finish we produce. Your book would sit here next.</p>
        <div class="hero__cta"><a class="btn btn--primary" href="index.html#contact">Publish your book</a><a class="btn btn--secondary" href="index.html#packages">See packages</a></div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <h2 class="sr-only">Sample books</h2>
        <div class="filters" role="group" aria-label="Filter books by genre">
          <button type="button" class="chip active" data-genre="all" aria-pressed="true">All</button>
${genres.map((x) => `          <button type="button" class="chip" data-genre="${x}" aria-pressed="false">${x}</button>`).join(String.fromCharCode(10))}
        </div>
        <div class="grid grid--4" id="books">
${sampleBooks.map(bookCard).join(String.fromCharCode(10))}
        </div>

        <p class="note">These are original sample covers with invented titles and authors, shown for layout only. Replace them with books Firefox Publishers has published, and only with the author's permission.</p>
        <div class="section__head classics-head">
          <p class="eyebrow">Public-domain classics</p>
          <h2>Classics we can format and publish</h2>
          <p>These timeless books are free of copyright in the United States, so anyone can publish new editions. We can design, format and distribute yours. Covers and texts are from Standard Ebooks, which dedicates its work to the public domain under CC0.</p>
        </div>
        <div class="grid grid--3 classics-grid">
${classics.map(classicCard).join(String.fromCharCode(10))}
        </div>
        <p class="note">Source: <a href="https://standardebooks.org/" target="_blank" rel="noopener">Standard Ebooks</a> (CC0 1.0). Texts and artwork are believed to be in the U.S. public domain and may still be copyrighted in other countries, so check local law before publishing outside the United States. These titles are not Firefox Publishers originals.</p>
      </div>
    </section>
` + cta + foot);

console.log("ok");
