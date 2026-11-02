// The "Ask AI" cover helper (pick what to make, a style, a colour) opens the Free Book Cover Maker with
// these choices in the web address. The cover maker reads them with readPreset() and starts filtered
// and recoloured. Nothing is sent to a server.
export const MAKE_CHOICES = [
  { id: "ebook", label: "Ebook cover", hint: "For Kindle and other ebook stores" },
  { id: "kdp", label: "Paperback 6 x 9 in", hint: "For Amazon KDP print" },
  { id: "small", label: "Paperback 5.5 x 8.5 in", hint: "A smaller paperback" },
];

export const STYLE_CHOICES = ["Thriller", "Fantasy", "Romance", "Sci-Fi", "Literary", "Horror", "Non-fiction", "Kids"];

export const COLOR_CHOICES = [
  { id: "blue", label: "Blue", swatch: "#1d5fa8", palette: { c1: "#0a1a3a", c2: "#1d5fa8", accent: "#7cc4ff", text: "#f2f8ff" } },
  { id: "red", label: "Red", swatch: "#c0392b", palette: { c1: "#1a0608", c2: "#7a1620", accent: "#ff6b57", text: "#fff1ee" } },
  { id: "green", label: "Green", swatch: "#2e7d4f", palette: { c1: "#06170f", c2: "#1f6b43", accent: "#7be0a4", text: "#effff5" } },
  { id: "gold", label: "Gold", swatch: "#d4a017", palette: { c1: "#16110a", c2: "#6b4a12", accent: "#f2c46b", text: "#fff6dc" } },
  { id: "purple", label: "Purple", swatch: "#6a3fb5", palette: { c1: "#120a24", c2: "#4b2a8a", accent: "#c7a6ff", text: "#f6f0ff" } },
  { id: "pink", label: "Pink", swatch: "#d9468f", palette: { c1: "#2a0d1e", c2: "#a52a68", accent: "#ffb3d6", text: "#fff0f7" } },
  { id: "black", label: "Black and white", swatch: "#111111", palette: { c1: "#050505", c2: "#2b2b2b", accent: "#ffffff", text: "#f5f5f5" } },
];

export function coverMakerUrl({ make, style, color }) {
  const p = new URLSearchParams();
  if (make) p.set("size", make);
  if (style) p.set("genre", style);
  if (color) p.set("color", color);
  const q = p.toString();
  return "/free-book-cover-maker" + (q ? "?" + q : "") + "#editor";
}

// Only values from the lists above are accepted, so a hand-made link cannot put anything else on the page.
export function readPreset(search) {
  const p = new URLSearchParams(search);
  const genre = STYLE_CHOICES.find((g) => g === p.get("genre"));
  const color = COLOR_CHOICES.find((c) => c.id === p.get("color"));
  const size = MAKE_CHOICES.find((m) => m.id === p.get("size"));
  return { genre, palette: color && color.palette, sizeId: size && size.id };
}
