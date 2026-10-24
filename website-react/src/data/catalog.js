export const GENRES = ["Fiction", "Travel & Memoir", "Fantasy", "Poetry", "Non-fiction", "Mystery", "Romance", "Spirituality", "Science", "Self-help"];

export const BOOKS = [
  { file: "the-last-lighthouse", title: "The Last Lighthouse", by: "E. Marlowe", genre: "Fiction", fmt: "E-book, Paperback" },
  { file: "northern-atlas", title: "Northern Atlas", by: "R. Quinn", genre: "Travel & Memoir", fmt: "Paperback, Hardcover" },
  { file: "paper-kingdoms", title: "Paper Kingdoms", by: "S. Hale", genre: "Fantasy", fmt: "E-book, Paperback, Hardcover" },
  { file: "salt-and-ember", title: "Salt & Ember", by: "M. Vega", genre: "Poetry", fmt: "E-book, Paperback" },
  { file: "the-quiet-tide", title: "The Quiet Tide", by: "L. Okafor", genre: "Non-fiction", fmt: "E-book, Paperback" },
  { file: "midnight-orchard", title: "Midnight Orchard", by: "T. Brandt", genre: "Mystery", fmt: "E-book, Paperback, Hardcover" },
  { file: "written-in-amber", title: "Written in Amber", by: "C. Dalton", genre: "Romance", fmt: "E-book, Paperback" },
  { file: "evenings-like-this", title: "Evenings Like This", by: "J. Navarro", genre: "Romance", fmt: "E-book, Paperback" },
  { file: "the-quiet-flame", title: "The Quiet Flame", by: "A. Reyes", genre: "Spirituality", fmt: "E-book, Paperback, Hardcover" },
  { file: "light-between-worlds", title: "Light Between Worlds", by: "M. Okonkwo", genre: "Spirituality", fmt: "E-book, Paperback" },
  { file: "mind-in-motion", title: "Mind in Motion", by: "P. Lindqvist", genre: "Science", fmt: "E-book, Paperback, Hardcover" },
  { file: "the-daily-reset", title: "The Daily Reset", by: "R. Ahmadi", genre: "Self-help", fmt: "E-book, Paperback" },
];

export const CLASSICS = [
  { file: "pride-and-prejudice", slug: "jane-austen/pride-and-prejudice", title: "Pride and Prejudice", by: "Jane Austen", tag: "Classic fiction" },
  { file: "frankenstein", slug: "mary-shelley/frankenstein", title: "Frankenstein", by: "Mary Shelley", tag: "Gothic" },
  { file: "the-great-gatsby", slug: "f-scott-fitzgerald/the-great-gatsby", title: "The Great Gatsby", by: "F. Scott Fitzgerald", tag: "Classic fiction" },
  { file: "dracula", slug: "bram-stoker/dracula", title: "Dracula", by: "Bram Stoker", tag: "Gothic" },
  { file: "moby-dick", slug: "herman-melville/moby-dick", title: "Moby-Dick", by: "Herman Melville", tag: "Adventure" },
  { file: "the-picture-of-dorian-gray", slug: "oscar-wilde/the-picture-of-dorian-gray", title: "The Picture of Dorian Gray", by: "Oscar Wilde", tag: "Gothic" },
];

export const PROJECT_CATS = [
  { id: "publishing", label: "Publishing" },
  { id: "author-branding-marketing", label: "Author Branding & Marketing" },
  { id: "audio-video-production", label: "Audio & Video Production" },
];

export const PROJECTS = [
  { cat: "publishing" },
  { cat: "author-branding-marketing" },
  { cat: "audio-video-production" },
  { cat: "publishing" },
  { cat: "author-branding-marketing" },
].map((p, i) => ({ ...p, title: `Project title ${i + 1}` }));

export const SERVICE_PAGES = [
  {
    path: "publishing", name: "Publishing",
    short: "Editing, design and production that take a manuscript to a finished book.",
    intro: "From manuscript to finished book, we handle the craft behind a professional publication and explain each step in plain language.",
    items: [["Editing & proofreading", "Developmental, line and copy editing, plus a final proofread."], ["Cover design", "A cover that fits your genre and reads clearly at thumbnail size."], ["Interior layout", "Typesetting for print and e-book, with consistent styles."], ["Format preparation", "Files prepared for print and digital distribution."], ["Book writing support", "A writing partner to shape ideas into a clear manuscript."], ["Book printing", "Print-ready files and proofs for paperback and hardcover."], ["ISBNs & distribution", "Metadata and retailer set-up, registered under your name."], ["Proofs & final files", "Review proofs and approve final files before release."]],
    who: "Authors with a completed or near-complete manuscript who want a professional finish.",
    heroSecondary: { to: "/portfolio", label: "View our work" },
  },
  {
    path: "author-branding-marketing", name: "Author Branding & Marketing",
    short: "A consistent author presence and launch support that helps your book be found.",
    intro: "A recognisable author identity and a clear plan for introducing your book to readers, without exaggerated promises.",
    items: [["Author brand identity", "Logo, colour and type direction for your author presence."], ["Launch planning", "A timeline and messaging for your release."], ["Social media content", "Templates and posts, from carousels to author spotlights."], ["Promotional materials", "Bookmarks, banners, media kits and email signatures."], ["Book marketing", "Review outreach, pricing and category guidance."], ["Illustration", "Custom illustration for covers, picture books and promotion."]],
    who: "Authors and creators preparing to launch or refresh how they present themselves.",
    heroSecondary: { to: "/portfolio", label: "View our work" },
  },
  {
    path: "audio-video-production", name: "Audio & Video Production",
    short: "Trailers, promo clips and audio that bring your story to life.",
    intro: "Moving image and sound that introduce your work and give readers another way in.",
    items: [["Book trailers", "A short trailer to introduce your book."], ["Short-form video", "Vertical clips and covers for social platforms."], ["Audio production", "Recording and editing for audio versions and promos."], ["Author interviews", "Filmed or recorded conversations and highlights."], ["Audiobook production", "Narration, recording and mastering to retailer specifications."], ["Video editing", "Cut-downs and captions for each platform."]],
    who: "Authors who want video or audio to support a launch or ongoing promotion.",
    heroSecondary: { to: "/portfolio", label: "View our work" },
  },
];
