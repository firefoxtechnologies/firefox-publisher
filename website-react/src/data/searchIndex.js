import { SERVICES, PACKAGES } from "./site.js";
import { AUDIOBOOKS } from "./audiobooks.js";
import { PORTFOLIO_BOOKS } from "./portfolioBooks.js";

// Everything the header search can find. `kind` is the label shown beside each result;
// `words` adds search terms people may type that the title does not contain.
const PAGES = [
  { title: "Home", to: "/", kind: "Page", text: "Ebook publishing and design services for authors", words: "firefox publisher self-publishing hoboken" },
  { title: "Audiobooks", to: "/audiobooks", kind: "Page", text: "Listen to our audiobook samples", words: "audio book listen narration sample play" },
  { title: "Portfolio", to: "/portfolio", kind: "Page", text: "Book covers we have designed", words: "covers work designs gallery" },
  { title: "Books", to: "/books", kind: "Page", text: "Sample covers and public-domain classics", words: "classics samples shelf" },
  { title: "Free Book Cover Maker", to: "/free-book-cover-maker", kind: "Tool", text: "Design a book cover online for free", words: "cover maker free template design download png jpg" },
  { title: "Book Publishing Services USA", to: "/book-publishing-services-usa", kind: "Page", text: "Nationwide book publishing for authors in all 50 states", words: "usa america nationwide self-publishing amazon kdp" },
  { title: "Book Publishing in New Jersey & New York", to: "/book-publishing-new-jersey-new-york", kind: "Page", text: "Hoboken, NJ and NYC book publishing", words: "hoboken jersey city nj ny nyc new york local" },
  { title: "About Firefox Publisher", to: "/about", kind: "Page", text: "Who we are and what we do", words: "company team mission" },
  { title: "Packages and prices", to: "/#packages", kind: "Section", text: "Publishing packages from $399", words: "pricing cost price how much" },
  { title: "Our process", to: "/#process", kind: "Section", text: "From idea to launch, step by step", words: "how it works stages steps" },
  { title: "How long will my book take?", to: "/#estimator", kind: "Tool", text: "Timeline estimator in weeks", words: "timeline weeks time estimate how long" },
  { title: "Privacy Policy", to: "/privacy-policy", kind: "Page", text: "How we handle your information", words: "privacy data cookies personal information gdpr" },
  { title: "Terms of Service", to: "/terms-of-service", kind: "Page", text: "The terms for using our site and services", words: "terms conditions legal agreement" },
  { title: "Contact us", to: "/#contact", kind: "Section", text: "Get a free consultation", words: "email phone call quote start a project message" },
];

const SERVICE_WORDS = {
  "/book-writing": "ghostwriting ghostwriter memoir fiction nonfiction children's author write",
  "/book-editing": "proofreading copyediting developmental line edit editor manuscript",
  "/ebook-design": "book cover design interior layout formatting ebook",
  "/ebook-publishing": "amazon kdp isbn self publish upload distribution kindle",
  "/book-printing": "print ready paperback hardcover pdf file",
  "/book-marketing": "launch promotion social media reviews advertising",
  "/author-branding-illustration": "logo brand illustration character art",
  "/audiobook-production": "audio narration recording voice audible",
  "/book-trailers": "video trailer promo tiktok instagram youtube",
};

export const SEARCH_INDEX = [
  ...PAGES,
  ...SERVICES.map((s) => ({ title: s.title, to: s.to, kind: "Service", text: s.text, words: SERVICE_WORDS[s.to] || "" })),
  ...PACKAGES.map((p) => ({ title: p.name, to: "/#packages", kind: "Package", text: `${p.price}. ${p.forWho}`, words: p.items.join(" ") })),
  ...AUDIOBOOKS.map((b) => ({ title: b.title, to: `/audiobooks#audio-${b.slug}`, kind: "Audiobook", text: `by ${b.by}`, words: "audiobook audio listen sample" })),
  ...PORTFOLIO_BOOKS.map((b) => ({ title: b.title, to: "/portfolio", kind: "Book cover", text: `by ${b.by}, ${b.genre}`, words: `${b.genre} book cover portfolio` })),
];

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$\s]/g, " ");

export function searchSite(query, limit = 8) {
  const terms = norm(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const out = [];
  for (const it of SEARCH_INDEX) {
    const title = norm(it.title), text = norm(it.text), words = norm(it.words || "");
    let score = 0;
    let ok = true;
    for (const t of terms) {
      if (title.startsWith(t) || title.includes(" " + t)) score += 10;
      else if (title.includes(t)) score += 6;
      else if (text.includes(t)) score += 3;
      else if (words.includes(t)) score += 2;
      else { ok = false; break; }
    }
    if (ok) out.push({ it, score });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit).map((r) => r.it);
}
