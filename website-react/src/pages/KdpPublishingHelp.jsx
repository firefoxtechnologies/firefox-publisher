import LandingPage from "../components/LandingPage.jsx";

const FAQ = [
  ["Can you publish my book on Amazon KDP for me?", "Yes. We format your manuscript, prepare the cover files, set up the listing details with you, and upload the book. The account and ISBN stay under your name, so you control your book and your royalties."],
  ["Do I need my own KDP account?", "Yes. KDP accounts belong to the author, and so do the royalties. We guide you through creating it, and you keep control of your login. Never share your password with anyone, including us."],
  ["What file formats does KDP need?", "For ebooks KDP accepts formats such as EPUB, and for paperbacks it needs a print-ready PDF for the interior and a separate cover PDF. We prepare the right files for the format you choose."],
  ["Can you also set up distribution to other stores?", "Yes. Higher packages include distribution to stores such as Barnes & Noble, Apple Books, Kobo and Google Books. We confirm what is included in your quote."],
  ["Will you guarantee sales or a bestseller ranking?", "No. Nobody honestly can. We make sure the book is well edited, well designed and correctly set up, and our marketing service can help you plan a launch. Results vary."],
];

export default function KdpPublishingHelp() {
  return (
    <LandingPage
      meta={{
        title: "Amazon KDP Publishing Help for Authors | Firefox Publisher",
        description: "Publish on Amazon KDP without the headaches: ebook and paperback formatting, cover files, listing setup and upload. You keep your account, ISBN and royalties.",
      }}
      schemaName="Amazon KDP Publishing Help"
      path="amazon-kdp-publishing-help"
      crumb="Amazon KDP Publishing Help"
      h1="Amazon KDP Publishing Help for Authors"
      lead="Kindle Direct Publishing is free to use, but getting the files, cover, categories and listing right takes care. We set it up with you, and everything stays in your name."
      intro={[
        "Many authors reach the KDP upload screen and get stuck on margins, trim size, spine width, categories, keywords or why the preview looks wrong. Fixing these before upload saves rejected files and weeks of back and forth.",
        "Firefox Publisher prepares your ebook and paperback files, finishes the cover, and guides you through the listing. We are based in Hoboken, New Jersey, and work online with authors in every US state.",
      ]}
      sections={[
        {
          title: "What we help with",
          items: [
            ["Ebook and paperback formatting", "A clean interior with the right margins, headings and page numbers for your trim size."],
            ["Cover files", "Front cover for ebooks, and a full wrap with spine and back cover for paperbacks."],
            ["Listing setup", "Title, subtitle, description, categories and keywords chosen with you."],
          ],
        },
        {
          title: "Why authors choose guided publishing",
          items: [
            ["You stay in control", "Your KDP account, ISBN and royalties belong to you."],
            ["Fewer rejected uploads", "We check the files against the platform's requirements before you submit."],
            ["Room to grow", "Add editing, an audiobook, marketing or other stores when you are ready."],
          ],
        },
      ]}
      steps={[
        "Send your manuscript and tell us your goals.",
        "We edit or format it, and design or finish the cover.",
        "We prepare the KDP files and walk you through the listing.",
        "You review the proof and publish. We stay available for questions.",
      ]}
      related={[["/ebook-publishing", "Ebook publishing services"], ["/book-printing", "Print-ready files"], ["/book-cover-design-services", "Book cover design"], ["/book-publishing-services-usa", "Book publishing across the USA"]]}
      faq={FAQ}
    />
  );
}
