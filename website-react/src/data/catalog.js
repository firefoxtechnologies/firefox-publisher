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

