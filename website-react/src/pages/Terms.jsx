import LegalPage from "../components/LegalPage.jsx";

const SECTIONS = [
  ["Agreeing to these terms", [
    "By using firefoxpublisher.com you agree to these terms. If you do not agree, please do not use the site. Our services are also covered by the written scope we agree with you for your project.",
  ]],
  ["Our services", [
    "Firefox Publisher offers manuscript writing and editing, book cover and interior design, ebook formatting and publishing support, print-ready file preparation, author branding and illustration, audiobook production, book marketing and book trailers.",
    ["Prices shown on the site, including package prices, are starting points. We confirm the scope, timeline and price in writing before any work begins.", "Timelines on the site, including the timeline estimator, are illustrations, not promises. Your real timeline is set in your written scope.", "We prepare print-ready files. We do not print physical books ourselves.", "Fees apply. Results vary. We do not guarantee sales, rankings, reviews or bestseller status."],
  ]],
  ["Your content and your rights", [
    "You keep the rights to your manuscript and other material you give us. You confirm that you own it or have permission to use it, and that it does not infringe anyone else's rights. You give us permission to use it only as needed to do the work you ask for.",
    "ISBNs we register for your book are registered under your name, as described in our packages.",
  ]],
  ["Our website and tools", [
    "The site's text, designs, templates, code and logos belong to Firefox Publisher or its licensors. Do not copy, resell or republish them without our written permission.",
    "The free book cover maker is provided as is. Premium designs and vector files may require payment. You are responsible for the text, images and artwork you add to your own cover, and for having the right to use them.",
  ]],
  ["Samples and third-party material", [
    "Audiobook samples, book covers and other examples shown on the site demonstrate our work. Rights in the books, recordings and artwork belong to their owners. Public-domain classics shown on the Books page come from Standard Ebooks and may still be protected by copyright in some countries, so check local law before publishing them.",
    "If you own material shown on this site and want it changed or removed, email us and we will act promptly.",
  ]],
  ["Using the site responsibly", [
    ["Do not use the site to break the law, send spam, or try to disrupt or gain unauthorized access to it.", "Do not submit false or harmful content through the contact form or chat."],
  ]],
  ["Links to other sites", [
    "We link to other websites for your convenience. We do not control them and are not responsible for their content.",
  ]],
  ["No warranty", [
    "The site and its information are provided as is and as available. We try to keep them accurate and up to date but do not promise they are free of errors or always available.",
  ]],
  ["Limit of liability", [
    "To the fullest extent the law allows, Firefox Publisher is not liable for indirect, incidental or consequential losses arising from your use of the site. This does not limit any rights you have under the law that cannot be limited.",
  ]],
  ["Governing law", [
    "These terms are governed by the laws of the State of New Jersey, USA, without regard to its conflict of laws rules.",
  ]],
  ["Changes to these terms", [
    "We may update these terms from time to time. The date at the top shows when they last changed. Using the site after a change means you accept the new terms.",
  ]],
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      metaTitle="Terms of Service | Firefox Publisher"
      description="The terms for using the Firefox Publisher website and tools, and how our publishing services, prices and timelines work."
      path="terms-of-service"
      intro="The rules for using our website and tools, and how our services work."
      sections={SECTIONS}
    />
  );
}
