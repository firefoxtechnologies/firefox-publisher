// What the "Ask AI" helper knows. The Worker (worker/ai.js) and the offline answers in the browser
// both read this file, so there is one source of truth. No prices are listed on purpose: the helper
// must never state a price that was not given to it.

export const FACTS = `Firefox Publisher is a creative partner for ebook authors in Hoboken, New Jersey, USA. It is a child company of Firefox Technologies. It works with authors across the USA online.
Services: book writing (fiction, nonfiction, ghostwriting, memoir, children's books); book editing (developmental, line, copyediting, proofreading); ebook cover and interior design with illustration; ebook publishing (formatting, platform setup, upload support for Amazon KDP and other stores); book printing means print-ready files only, not physical printing; book marketing (launch plans, social media content); author branding and illustration; audiobook production (narration, recording, editing, final files); book video trailers.
Free tool: the Free Book Cover Maker has 700+ original cover designs and a studio editor for front cover, back cover and spine, with PNG, JPG, WebP and PDF downloads, including a print wrap for KDP. Some designs and vector files are paid.
Contact: contactus@firefoxpublisher.com, phone +1 201-464-5345, 333 Washington St #233, Hoboken, NJ 07030. The contact form is on the home page.
Rules: results such as sales or bestseller status are never guaranteed. Quotes depend on the project and are confirmed by the team after the author shares details. Timelines are confirmed individually.`;

// The only links the helper may offer. The model never writes links; the server picks from this list.
export const LINKS = [
  { to: "/book-writing", label: "Book Writing", words: ["write", "writing", "ghostwrit", "memoir", "manuscript", "story", "novel"] },
  { to: "/book-editing", label: "Book Editing", words: ["edit", "proofread", "copyedit", "revise", "grammar"] },
  { to: "/ebook-design", label: "Cover & Interior Design", words: ["cover", "design", "interior", "layout", "illustrat", "formatting"] },
  { to: "/ebook-publishing", label: "Ebook Publishing", words: ["publish", "kdp", "amazon", "upload", "self-publish", "ebook"] },
  { to: "/book-printing", label: "Print-ready Files", words: ["print", "paperback", "hardcover"] },
  { to: "/book-marketing", label: "Book Marketing", words: ["market", "promot", "launch", "social", "advertis"] },
  { to: "/author-branding-illustration", label: "Author Branding", words: ["brand", "logo", "illustration", "character"] },
  { to: "/audiobook-production", label: "Audiobook Production", words: ["audiobook", "narrat", "voice", "recording", "audio"] },
  { to: "/book-trailers", label: "Book Trailers", words: ["trailer", "video"] },
  { to: "/free-book-cover-maker", label: "Free Cover Maker", words: ["cover maker", "free cover", "template", "make a cover", "create a cover", "design a cover"] },
  { to: "/book-publishing-services-usa", label: "Publishing Services USA", words: ["usa", "united states", "nationwide", "cost", "package", "price", "pricing", "how much"] },
  { to: "/book-publishing-new-jersey-new-york", label: "NJ & New York Publishing", words: ["new jersey", "new york", "hoboken", "nyc", "nj", "local"] },
  { to: "/#contact", label: "Contact the team", words: ["contact", "quote", "talk", "call", "email", "start", "hire", "consult"] },
  { to: "/about", label: "About us", words: ["about", "who are you", "company", "team"] },
  { to: "/portfolio", label: "Portfolio", words: ["portfolio", "examples", "samples", "work you", "past work"] },
];

export const ALLOWED_PATHS = LINKS.map((l) => l.to);

// Up to three allowed links that match what the visitor talked about (the model is never asked).
export function pickLinks(text, max = 3) {
  const t = String(text || "").toLowerCase();
  const scored = LINKS.map((l) => ({ l, n: l.words.filter((w) => t.includes(w)).length })).filter((x) => x.n > 0);
  scored.sort((a, b) => b.n - a.n);
  const out = scored.slice(0, max).map((x) => ({ to: x.l.to, label: x.l.label }));
  if (!out.some((o) => o.to === "/#contact")) out.push({ to: "/#contact", label: "Contact the team" });
  return out.slice(0, max);
}

const RULES = [
  { re: /\b(hi|hello|hey|help)\b/, reply: "Hi! I can point you to the right Firefox Publisher service: writing, editing, cover design, publishing, marketing, audiobooks or trailers. What are you working on?" },
  { re: /(price|pricing|cost|how much|quote|package|afford|cheap)/, reply: "Pricing depends on the project, so I can't give you a number here. Tell the team what you need through the contact form and they will send a quote." },
  { re: /(cover maker|free cover|template|make a cover|create a cover|design a cover)/, reply: "The Free Book Cover Maker has 700+ original designs. Pick a genre, edit the text, then download your cover. Some designs and vector files are paid." },
  { re: /(audiobook|narrat|voice|recording)/, reply: "We produce audiobooks: narration, recording, editing and final files. You can listen to samples on our Audiobooks page." },
  { re: /(edit|proofread|copyedit)/, reply: "We offer developmental editing, line editing, copyediting and proofreading, so your manuscript is clear and ready for readers." },
  { re: /(write|writing|ghostwrit|memoir|novel)/, reply: "We help with fiction, nonfiction, ghostwriting, memoirs and children's books. Share your idea with the team and they will suggest the best way to start." },
  { re: /(cover|illustrat|interior|layout|design)/, reply: "We design ebook covers and interiors, plus illustrations. You can also try the Free Book Cover Maker to see ideas straight away." },
  { re: /(publish|kdp|amazon|upload|ebook)/, reply: "We prepare your files, format the book and help set it up on publishing platforms such as Amazon KDP. We do not guarantee sales or rankings." },
  { re: /(print|paperback|hardcover)/, reply: "We prepare print-ready files (interior and cover). We do not physically print books." },
  { re: /(market|promot|launch|social)/, reply: "We create launch marketing and social media content for ebook authors. Results vary and are never guaranteed." },
  { re: /(brand|logo)/, reply: "We design author logos and branding kits, plus ebook and character illustrations." },
  { re: /(trailer|video)/, reply: "We make book video trailers with motion graphics and music, in social-ready formats." },
  { re: /(contact|phone|call|email|address|where|location|hoboken|new jersey)/, reply: "You can reach us at contactus@firefoxpublisher.com or +1 201-464-5345. We are at 333 Washington St #233, Hoboken, NJ, and work with authors across the USA online." },
  { re: /(install|app|phone app|download the app)/, reply: "You can install this site as an app: use the Install app button in the menu or footer. On iPhone, open it in Safari, tap Share, then Add to Home Screen." },
];

const FALLBACK = "I can help with Firefox Publisher's services: writing, editing, cover design, publishing, marketing, audiobooks and trailers. Tell me a little about your book, or reach the team through the contact form.";

// Answers that work with no internet and no AI service: keyword rules over the same facts.
export function answerOffline(text) {
  const t = String(text || "").toLowerCase();
  const hit = RULES.find((r) => r.re.test(t));
  return { reply: hit ? hit.reply : FALLBACK, links: pickLinks(t) };
}
