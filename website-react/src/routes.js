// One list of every page: the router, the prerender script and the sitemap all read it.
// `name` is the file in src/pages. Pages with `sitemap: false` exist as files but stay out of search results.
export const ROUTES = [
  { path: "/", name: "Home", priority: "1.0", changefreq: "weekly" },
  { path: "/about", name: "About", priority: "0.7" },
  { path: "/book-writing", name: "BookWriting", priority: "0.9" },
  { path: "/book-editing", name: "BookEditing", priority: "0.9" },
  { path: "/free-book-cover-maker", name: "FreeBookCoverMaker", priority: "0.9", changefreq: "weekly" },
  { path: "/ebook-design", name: "EbookDesign", priority: "0.9" },
  { path: "/ebook-publishing", name: "EbookPublishing", priority: "0.9" },
  { path: "/book-printing", name: "BookPrinting", priority: "0.9" },
  { path: "/book-marketing", name: "BookMarketing", priority: "0.9" },
  { path: "/author-branding-illustration", name: "AuthorBranding", priority: "0.9" },
  { path: "/audiobook-production", name: "AudiobookProduction", priority: "0.9" },
  { path: "/book-trailers", name: "BookTrailers", priority: "0.9" },
  { path: "/portfolio", name: "Portfolio", priority: "0.6" },
  { path: "/books", name: "Books", priority: "0.6" },
  { path: "/book-publishing-new-jersey-new-york", name: "BookPublishingNJNY", priority: "0.9" },
  { path: "/book-publishing-services-usa", name: "BookPublishingUSA", priority: "0.9" },
  { path: "/audiobooks", name: "Audiobooks", priority: "0.8" },
  { path: "/privacy-policy", name: "Privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms-of-service", name: "Terms", priority: "0.3", changefreq: "yearly" },
  { path: "/thank-you", name: "ThankYou", sitemap: false },
];

export const pageName = (pathname) => {
  const p = pathname.replace(/\/+$/, "") || "/";
  return ROUTES.find((r) => r.path === p)?.name;
};
