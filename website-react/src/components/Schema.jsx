const ORIGIN = "https://firefoxpublisher.com";

// Service + BreadcrumbList structured data for a service page (rendered into the prerendered HTML).
export default function ServiceSchema({ name, path, description }) {
  const url = `${ORIGIN}/${path}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        serviceType: name,
        description,
        url,
        provider: { "@id": `${ORIGIN}/#organization` },
        areaServed: ["United States", "New Jersey", "New York", "Hoboken", "Jersey City", "New York City"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

// WebApplication + FAQPage + BreadcrumbList for the free book cover maker.
export function CoverMakerSchema({ faqs }) {
  const url = `${ORIGIN}/free-book-cover-maker`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: "Free Book Cover Maker",
        url,
        description: "A free online book cover maker with 700+ genre templates, a drag-and-drop studio editor, back cover and spine design, and PNG, JPG, WebP and PDF downloads. No sign-up.",
        featureList: ["700+ original book cover templates", "Drag-and-drop studio editor with layers", "Back cover and spine design", "Full print wrap with bleed for Amazon KDP", "Ebook cover and paperback sizes", "PNG, JPG, WebP and PDF downloads", "Works on phones and tablets"],
        inLanguage: "en",
        keywords: "free book cover maker, book cover creator, ebook cover maker, KDP cover template, make a book cover online",
        applicationCategory: "DesignApplication",
        operatingSystem: "Any (web browser)",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free templates with PNG and JPG download. Premium designs and SVG vector files are paid." },
        provider: { "@id": `${ORIGIN}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Free Book Cover Maker", item: url },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

// WebPage-family markup plus breadcrumbs for the non-service pages (About, Portfolio, Books).
export function PageSchema({ type = "WebPage", name, path, description }) {
  const url = `${ORIGIN}/${path}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": type, "@id": `${url}#page`, url, name, description, isPartOf: { "@id": `${ORIGIN}/#website` }, about: { "@id": `${ORIGIN}/#organization` }, inLanguage: "en" },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
