export const SITE = {
  email: "contactus@firefoxpublishing.com",
  phone: "+1 201-464-5345",
  phoneHref: "tel:+12014645345",
  parentUrl: "https://firefoxtechnologies.com/",
};

export const NAV = [
  { to: "/#services", label: "Services", id: "services" },
  { to: "/#packages", label: "Packages", id: "packages" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/books", label: "Books" },
  { to: "/#process", label: "Process", id: "process" },
  { to: "/#tools", label: "Tools", id: "tools" },
  { to: "/#about", label: "About", id: "about" },
];

const I = {
  write: "M5 4h10l4 4v12H5zM9 12h6M9 16h6",
  edit: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4",
  design: "M8 8h8M8 12h8M8 16h4",
  publish: "M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z",
  print: "M7 9V4h10v5M7 17H4v-7h16v7h-3M7 14h10v6H7z",
  market: "M4 14v-4l11-5v14zM15 9.5a3 3 0 0 1 0 5M7 14.5l1 5h2.5l-1-4.5",
  brand: "M4 20c3 0 5-1 5-3a2 2 0 0 0-2-2c-2 0-3 2-3 5zM9 15 19 5l-1-1L8 14z",
  audio: "M5 11a7 7 0 0 0 14 0M12 18v3",
  video: "m15 11 6-3v8l-6-3",
  web: "M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  article: "M5 4h11v16H5zM16 8h3v10a2 2 0 0 1-2 2M8 8h5M8 12h5M8 16h3",
  code: "m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14",
};

// `extra` holds the shapes an icon needs besides its main path (rect, circle).
export const SERVICES = [
  { title: "Book Writing", to: "/book-writing", text: "Shape your ideas into a clear, compelling manuscript with a writing partner.", d: I.write },
  { title: "Book Editing", to: "/publishing", text: "Developmental, line and copy editing that sharpens clarity and reader appeal.", d: I.edit },
  { title: "Cover & Interior Design", to: "/publishing", text: "Covers and layouts that suit your genre and meet retailer standards.", d: I.design, rect: { x: 4, y: 3, width: 16, height: 18, rx: 2 } },
  { title: "Book Publishing", to: "/publishing", text: "Production, ISBNs, metadata and distribution set-up for print and digital.", d: I.publish },
  { title: "Book Printing", to: "/publishing", text: "Print-ready files and proofs for paperback and hardcover editions.", d: I.print },
  { title: "Book Marketing", to: "/author-branding-marketing", text: "Launch planning, reviews and audience-building to help your book be found.", d: I.market },
  { title: "Author Branding & Illustration", to: "/author-branding-marketing", text: "A consistent author identity, with custom illustration where your project needs it.", d: I.brand },
  { title: "Audiobook Production", to: "/audio-video-production", text: "Narration, recording and production to extend your book into audio.", d: I.audio, rect: { x: 9, y: 3, width: 6, height: 11, rx: 3 } },
  { title: "Book Video Trailers", to: "/audio-video-production", text: "Short trailers and promo clips that introduce your story.", d: I.video, rect: { x: 3, y: 6, width: 12, height: 12, rx: 2 } },
  { title: "Web Design & SEO", to: "/digital-creative-services", text: "Fast, accessible author websites that search engines and readers can find.", d: I.web, circle: { cx: 12, cy: 12, r: 9 } },
  { title: "Articles & Web Content", to: "/digital-creative-services", text: "Articles, blog posts and web copy written to support your platform.", d: I.article },
  { title: "Graphic & Marketing Design", to: "/digital-creative-services", text: "Social graphics, one-sheets and promotional materials in a consistent style.", d: I.code },
];

// Photo and caption for each service in the ring carousel. Photos are from
// Pexels (free licence) and live in public/assets/services/.
const SERVICE_MEDIA = [
  ["book-writing", "Manuscript"],
  ["book-editing", "Editorial"],
  ["cover-interior-design", "Design"],
  ["book-publishing", "Publishing"],
  ["book-printing", "Production"],
  ["book-marketing", "Marketing"],
  ["author-branding", "Branding"],
  ["audiobook-production", "Audio"],
  ["video-trailers", "Video"],
  ["web-design-seo", "Digital"],
  ["articles-web-content", "Content"],
  ["graphic-marketing-design", "Design"],
];
SERVICES.forEach((s, i) => {
  s.image = `/assets/services/${SERVICE_MEDIA[i][0]}.jpg`;
  s.meta = SERVICE_MEDIA[i][1];
});

export const STATS = [
  { label: "Services", end: 12 },
  { label: "Publishing packages", end: 5 },
  { label: "Stages, idea to launch", end: 5 },
  { label: "Packages from", end: 399, prefix: "$" },
];

export const PACKAGES = [
  { name: "Starter Publishing Package", price: "$399", short: "Starter", forWho: "An affordable digital launch with essential polish.", items: ["Proofreading (core grammar check)", "E-book interior formatting", "Professional genre-appropriate cover design", "ISBN for the e-book, registered under your name", "Publishing on Amazon KDP (e-book)"] },
  { name: "Basic Publishing Package", price: "$699", short: "Basic", forWho: "Print and digital with copy editing and standard formatting.", items: ["Copy editing: spelling, grammar, punctuation, consistency", "Standard formatting: e-book, paperback, hardcover", "Cover design: 2 concepts and 2 revisions", "Publishing on Amazon KDP (all formats)"] },
  { name: "Premium Publishing Package", price: "$1,499", short: "Premium", featured: true, forWho: "Deeper editing, enhanced formatting and a custom cover.", items: ["Line and structural editing, including copy editing", "Enhanced formatting: custom chapter openers, graphics, drop caps", "Premium custom cover: 3 concepts, 3 revisions and mock-ups", "3 ISBNs: e-book, paperback, hardcover", "KDP publishing and author page set-up", "Amazon metadata and keyword guidance"] },
  { name: "Extensive Publishing Package", price: "$2,499", short: "Extensive", forWho: "Wider distribution with author and promotion tools.", items: ["Editing, formatting and cover from the Premium package", "Distribution to Amazon, Barnes & Noble, Apple Books, Kobo and Google Books", "Per-platform keywords, categories, titles and descriptions", "Author pages and A+ content on Amazon", "Promotional tools and a post-launch strategy guide", "10 complimentary author copies"] },
  { name: "Signature Publishing Package", price: "$4,999", short: "Signature", forWho: "Our fullest publishing service, with wide global distribution.", items: ["Comprehensive editorial services: line and structural review", "Enhanced formatting for all formats", "Bespoke luxury cover with unlimited concepts, revisions and marketing assets", "3 ISBNs", "Wide global distribution to retailers and libraries", "Advanced optimisation for each platform, author pages and A+ content", "Promotional tools and a strategy guide"] },
];

export const STAGES = [
  { label: "Discovery", title: "Discovery & strategy", text: "We clarify your goals, audience and what success looks like, so the creative direction matches your vision.", items: ["Author intake and manuscript review", "Genre fit and a look at comparable books", "Publishing pathway and budget planning", "High-level title and series strategy"] },
  { label: "Editorial", title: "Editorial craft", text: "Objective feedback and clear edits sharpen your voice rather than replace it, with check-ins at each milestone.", items: ["Editing matched to your manuscript", "Annotated feedback and revision rounds", "Consistency and style checks", "Final proofread"] },
  { label: "Design & production", title: "Design & production", text: "Covers and layouts built for your audience and for print and retailer requirements.", items: ["Cover concepts with revision rounds", "Interior layout for print and digital", "Proofs and final files", "ISBNs and metadata set-up"] },
  { label: "Launch", title: "Launch & marketing", text: "A launch plan with realistic expectations and honest reporting.", items: ["Launch timeline and messaging", "Review and outreach templates", "Social and promotional content", "Pricing and category guidance"] },
  { label: "Growth", title: "Long-term growth", text: "Launch is day one. We help you plan for your backlist and your next title.", items: ["List-building and reader engagement ideas", "Seasonal promotion planning", "Author brand toolkit: type, colour, social assets", "Planning your next book"] },
];

export const READINESS = [
  "The manuscript is complete",
  "I have revised it at least once",
  "Someone other than me has read it",
  "I know my genre and target readers",
  "I have a working title and short description",
  "I have a rough budget and timeline",
];
export const READINESS_MSGS = ["Let us help you get started.", "A good start.", "Making progress.", "Nearly there.", "Well prepared.", "Ready to publish."];

export const INTERESTS = [
  "Book Writing", "Book Editing", "Cover & Interior Design", "Book Publishing",
  "Author Branding & Marketing", "Audio & Video Production", "Digital & Creative Services", "Not sure yet",
];

// Hero floating books; `vars` map onto the CSS custom properties .book uses.
export const HERO_BOOKS = [
  { layer: "b1", d: 14, rx: "5deg", ry: "18deg", delay: "0s", dur: "12s", color: "#0e2540", file: "the-last-lighthouse", label: "The Last Lighthouse by E. Marlowe" },
  { layer: "b2", d: 22, rx: "5deg", ry: "14deg", delay: "-4s", dur: "13s", color: "#3a0a19", file: "paper-kingdoms", label: "Paper Kingdoms by S. Hale" },
  { layer: "b3", d: 16, rx: "5deg", ry: "-18deg", delay: "-2s", dur: "11s", color: "#07142a", file: "midnight-orchard", label: "Midnight Orchard by T. Brandt" },
  { layer: "b4", d: 24, rx: "5deg", ry: "-14deg", delay: "-6s", dur: "14s", color: "#0a0a0d", file: "the-quiet-flame", label: "The Quiet Flame by A. Reyes" },
  { layer: "b5", d: 18, rx: "5deg", ry: "16deg", delay: "-3s", dur: "12s", color: "#10304a", file: "northern-atlas", label: "Northern Atlas" },
  { layer: "b6", d: 26, rx: "5deg", ry: "-16deg", delay: "-5s", dur: "13s", color: "#2a1410", file: "salt-and-ember", label: "Salt and Ember" },
  { layer: "b7", d: 12, rx: "5deg", ry: "12deg", delay: "-7s", dur: "12s", color: "#3a2208", file: "written-in-amber", label: "Written in Amber" },
  { layer: "b8", d: 20, rx: "5deg", ry: "-12deg", delay: "-1s", dur: "14s", color: "#14123a", file: "light-between-worlds", label: "Light Between Worlds" },
];

export const DUST = [
  [0, 11, 2, 0], [53, 48, 3, 7], [6, 85, 4, 3], [59, 22, 2, 10], [12, 59, 3, 6], [65, 96, 4, 2],
  [18, 33, 2, 9], [71, 70, 3, 5], [24, 7, 4, 1], [77, 44, 2, 8], [30, 81, 3, 4], [83, 18, 4, 0],
  [36, 55, 2, 7], [89, 92, 3, 3], [42, 29, 4, 10], [95, 66, 2, 6], [48, 3, 3, 2], [1, 40, 4, 9],
];

export const SHELF = [
  { file: "the-last-lighthouse", title: "The Last Lighthouse by E. Marlowe" },
  { file: "paper-kingdoms", title: "Paper Kingdoms by S. Hale" },
  { file: "midnight-orchard", title: "Midnight Orchard by T. Brandt" },
  { file: "evenings-like-this", title: "Evenings Like This by J. Navarro" },
  { file: "the-quiet-flame", title: "The Quiet Flame by A. Reyes" },
];

// PLACEHOLDERS. These are not real testimonials or ratings: they show the layout only.
// Replace each with a verified quote, the author's name, their rating (if you show one)
// and their written permission, then then delete `sample`. The cards no longer show a "Sample" tag, so nothing on the page marks these as placeholders.
export const TESTIMONIALS = [
  { quote: "The editorial feedback sharpened my manuscript without taking my voice away from it.", name: "Jane Doe", role: "Fiction author", sample: true },
  { quote: "Clear communication at every stage. I always knew what was happening and what came next.", name: "John Smith", role: "Non-fiction author", sample: true },
  { quote: "My cover and layout looked professional from day one, ready for every retailer.", name: "Mary Major", role: "Fantasy author", sample: true },
  { quote: "They explained ISBNs, metadata and distribution in plain language. I felt in good hands.", name: "Richard Roe", role: "First-time author", sample: true },
  { quote: "The launch plan gave me a realistic path to readers, with no exaggerated promises.", name: "Jane Roe", role: "Memoir author", sample: true },
  { quote: "Fast, careful and friendly. Every revision round made the book better.", name: "Joe Bloggs", role: "Poetry author", sample: true },
  { quote: "The audiobook and trailer extended my book far beyond the page.", name: "Erika Mustermann", role: "Children's author", sample: true },
  { quote: "A team that treats your book like it matters. I would work with them again.", name: "Juan Perez", role: "Self-help author", sample: true },
];
