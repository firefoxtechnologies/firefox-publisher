// Audiobook samples on /audiobook-production. `seconds` is the measured length of the MP3.
export const AUDIOBOOKS = [
  { slug: "bhagavad-gita", label: "First audiobook", title: "Bhagavad Gita: A New Translation", by: "Stephen Mitchell", w: 302, h: 500, seconds: 581 },
  { slug: "frankenstein", label: "Second audiobook", title: "Frankenstein", by: "Mary Shelley", w: 343, h: 500, seconds: 630 },
  { slug: "the-time-machine", label: "Third audiobook", title: "The Time Machine", by: "H.G. Wells", w: 333, h: 500, seconds: 1462 },
  { slug: "the-gods-of-mars", label: "Fourth audiobook", title: "The Gods of Mars", by: "Edgar Rice Burroughs", w: 333, h: 500, seconds: 1870 },
  { slug: "the-idiot", label: "Fifth audiobook", title: "The Idiot", by: "Fyodor Dostoevsky", w: 333, h: 500, seconds: 1779 },
];

export const audioUrl = (b) => `/assets/audiobooks/${b.slug}-introduction.mp3`;
export const coverUrl = (b) => `/assets/audiobooks/${b.slug}-cover.jpg`;
export const durationText = (s) => `${Math.floor(s / 60)} min`;
export const isoDuration = (s) => `PT${Math.floor(s / 60)}M${s % 60}S`;
