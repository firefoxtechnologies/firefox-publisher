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
        areaServed: "Worldwide",
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
