import LandingPage from "../components/LandingPage.jsx";

const FAQ = [
  ["Can you illustrate my children's book?", "Yes. Our illustration service creates character and scene artwork for children's books, in a style we agree with you. The team confirms the number of illustrations and the price after hearing about your story."],
  ["I only have the story. Can you do the rest?", "Yes. We can edit the text, illustrate it, lay out the pages for ebook and print, design the cover, and publish the book on Amazon KDP and other stores."],
  ["What page size and format do children's books use?", "Picture books are often square or landscape, and the size affects both the art and the printing. We prepare ebook files and print-ready files to the trim size you choose, and we advise on the options."],
  ["Can the same characters appear in a series?", "Yes. We can design a character and keep the look consistent across books, which also helps with author branding."],
  ["Do you print the physical books?", "We prepare print-ready files for printing. We do not print physical copies ourselves, but we can guide you to print-on-demand through Amazon KDP."],
];

export default function ChildrensBookPublishing() {
  return (
    <LandingPage
      meta={{
        title: "Children's Book Illustration & Publishing | Firefox",
        description: "Children's book illustration, layout and publishing for authors in the USA: characters, scenes, cover, ebook and print-ready files, and Amazon KDP setup.",
      }}
      schemaName="Children's Book Illustration and Publishing"
      path="childrens-book-illustration-publishing"
      crumb="Children's Book Illustration and Publishing"
      h1="Children's Book Illustration and Publishing"
      lead="From a story idea to a finished picture book: illustrated characters and scenes, page layout, a cover that stands out on the shelf, and publishing on Amazon KDP."
      intro={[
        "A children's book depends on its pictures as much as its words. The pages need to be clear for young readers, consistent from page to page, and laid out so that the art and text work together in ebook and in print.",
        "Firefox Publisher offers illustration, layout, cover design and publishing under one roof. We work online with authors across the USA from our Hoboken, New Jersey studio.",
      ]}
      sections={[
        {
          title: "What we make",
          items: [
            ["Characters and scenes", "Illustrations in a style you choose, with characters that look the same on every page."],
            ["Page layout", "Text and pictures placed for easy reading, in ebook and print-ready formats."],
            ["Covers", "Bright, clear covers that catch the eye of both parents and children."],
          ],
        },
        {
          title: "From story to shelf",
          items: [
            ["Editing", "A careful edit of the text so it reads aloud well."],
            ["Publishing", "Setup and upload to Amazon KDP, with your account and ISBN in your name."],
            ["A series, and branding", "Keep your characters consistent across books and build an author brand around them."],
          ],
        },
      ]}
      steps={[
        "Share your story, the age group and the look you imagine.",
        "We agree on a style, the number of pages and the scope.",
        "We create character sketches, then the finished pages, and revise with your feedback.",
        "We prepare ebook and print files and help you publish.",
      ]}
      related={[["/author-branding-illustration", "Author branding and illustration"], ["/ebook-design", "Cover and interior design"], ["/book-writing", "Book writing"], ["/ebook-publishing", "Ebook publishing"]]}
      faq={FAQ}
    />
  );
}
