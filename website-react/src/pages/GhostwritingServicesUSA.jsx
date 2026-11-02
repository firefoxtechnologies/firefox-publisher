import LandingPage from "../components/LandingPage.jsx";

const FAQ = [
  ["What is ghostwriting?", "A ghostwriter writes a book with you, from your ideas, notes and interviews, and the book is published under your name. It is a common and legitimate way for busy experts, founders and storytellers to get a book written."],
  ["Will the book sound like me?", "That is the goal. We start with conversations and any notes or recordings you have, learn how you speak and what you want readers to take away, and share chapters for your feedback as we go."],
  ["Who owns the finished book?", "Ownership and credit terms are agreed in writing before work begins, and the standard approach is that the book is yours. Ask the team about your specific situation."],
  ["How long does a ghostwritten book take?", "It depends on the length, the amount of material you already have and how quickly you can review chapters. The team confirms a timeline for your project after hearing about it. We do not promise a fixed turnaround for every book."],
  ["Do you also edit, design and publish the book?", "Yes. We can take the manuscript through editing, cover and interior design, and publishing on Amazon KDP and other stores, so one team handles the whole project."],
];

export default function GhostwritingServicesUSA() {
  return (
    <LandingPage
      meta={{
        title: "Ghostwriting Services for Authors in the USA | Firefox",
        description: "Ghostwriting and memoir writing for authors across the USA: fiction, nonfiction and children's books, written with you and published under your name.",
      }}
      schemaName="Ghostwriting Services"
      path="ghostwriting-services-usa"
      crumb="Ghostwriting Services"
      h1="Ghostwriting Services for Authors Across the USA"
      lead="You have the story, expertise or idea. We help turn it into a finished manuscript in your voice, then edit, design and publish it if you wish."
      intro={[
        "Writing a book is a large project, and many people with something worth saying never find the time. Ghostwriting pairs you with a writer who interviews you, shapes your material into chapters, and drafts the book for your review.",
        "Firefox Publisher works with authors online from Hoboken, New Jersey, across all 50 states. We write fiction, nonfiction, memoirs and children's books, and we can continue into editing, cover design and publishing.",
      ]}
      sections={[
        {
          title: "What we write",
          items: [
            ["Memoir and life stories", "Personal and family stories told with care, for you or for those who come after."],
            ["Nonfiction and expert books", "Business, health, education and how-to books that build your credibility."],
            ["Fiction and children's books", "Novels and picture books, from first outline to finished manuscript."],
          ],
        },
        {
          title: "What you can expect",
          items: [
            ["Your voice", "Interviews and your own material set the tone, so the book sounds like you."],
            ["Chapter-by-chapter review", "You read drafts as they arrive and shape the direction."],
            ["Clear agreements", "Scope, credit and rights are written down before work starts."],
          ],
        },
      ]}
      steps={[
        "Tell us your idea, audience and any material you already have.",
        "We agree on an outline and the scope of the project.",
        "We interview you, draft chapters and revise them with your feedback.",
        "The finished manuscript moves on to editing, design and publishing, if you want those too.",
      ]}
      related={[["/book-writing", "Book writing services"], ["/book-editing", "Book editing"], ["/ebook-publishing", "Ebook publishing"], ["/book-publishing-services-usa", "Publishing across the USA"]]}
      faq={FAQ}
    />
  );
}
