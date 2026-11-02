import LandingPage from "../components/LandingPage.jsx";

const FAQ = [
  ["How much does a custom book cover cost?", "The price depends on the genre, how much illustration is involved, and whether you need a front cover only or a full paperback wrap. Tell us about your book through the contact form and the team will send a quote. We do not guarantee sales or rankings."],
  ["What cover sizes do you design?", "We design ebook covers, and paperback covers for the common KDP trim sizes such as 6 x 9 inches and 5.5 x 8.5 inches, including the spine and back cover for a print wrap. We confirm the exact size with you before we start."],
  ["Can I try a design before I hire anyone?", "Yes. Our free book cover maker has hundreds of genre templates you can edit and download. If you would like something made for your book, our designers can build a custom cover."],
  ["Will my cover work for Amazon KDP?", "We prepare cover files to the publishing platform's specifications, with the right dimensions, bleed for print and a spine width based on your page count. The platform's own checks have the final say, so we recommend uploading a proof."],
  ["Do I own the finished cover?", "Rights and usage are confirmed in writing for each project before work begins. Ask the team if you have a specific requirement."],
];

export default function BookCoverDesignServices() {
  return (
    <LandingPage
      meta={{
        title: "Book Cover Design Services for Ebooks & Print | Firefox",
        description: "Custom book cover design for ebooks and paperbacks: genre-fit covers, spine and back cover, KDP-ready files. Try our free cover maker or get a quote.",
      }}
      schemaName="Book Cover Design Services"
      path="book-cover-design-services"
      crumb="Book Cover Design Services"
      h1="Book Cover Design Services for Ebooks and Paperbacks"
      lead="A cover has a few seconds to tell a reader what your book is. We design covers that fit your genre, read clearly as a small thumbnail, and come as the files each store or printer asks for."
      intro={[
        "Readers do judge a book by its cover, first on a phone screen where the cover is the size of a postage stamp. A good cover is clear at that size, suits the genre, and looks like it belongs next to the bestsellers in its category without copying them.",
        "Firefox Publisher designs original covers for authors across the USA, working online from Hoboken, New Jersey. If you want to explore ideas first, the free book cover maker lets you design and download a cover yourself.",
      ]}
      sections={[
        {
          title: "What is included",
          items: [
            ["Front cover design", "Original artwork and typography that match your genre and audience, with revisions."],
            ["Spine and back cover", "A full wrap for paperback and hardcover, with the spine width based on your page count."],
            ["Ebook and print files", "Files sized for ebook stores and for print, with bleed where the printer needs it."],
          ],
        },
        {
          title: "Who it is for",
          text: "We design for first-time and returning authors in every genre.",
          items: [
            ["Fiction", "Thriller, fantasy, romance, science fiction, horror and literary covers."],
            ["Nonfiction", "Business, self-help, memoir and educational titles that need to look credible."],
            ["Children's books", "Friendly, illustrated covers that parents and kids both notice."],
          ],
        },
      ]}
      steps={[
        "Tell us about your book, genre, readers and any covers you admire.",
        "We send cover concepts. You choose a direction and ask for changes.",
        "We finish the cover and prepare the ebook and print files.",
        "You publish, or we help you upload to Amazon KDP and other stores.",
      ]}
      related={[["/ebook-design", "Ebook cover and interior design"], ["/free-book-cover-maker", "Free book cover maker"], ["/ebook-publishing", "Ebook publishing"], ["/portfolio", "Portfolio"]]}
      faq={FAQ}
    />
  );
}
