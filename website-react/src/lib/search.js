// Ranking for the header search. Every typed word must match somewhere in an item; title and web address
// matches count most, then headings, the short description, extra search words and finally the page text.
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9$\s]/g, " ").replace(/\s+/g, " ");

const prepare = (it) => {
  if (it._n) return it._n;
  const n = {
    title: norm(it.title),
    url: norm(it.to.replace(/^\/#?/, "").replace(/-/g, " ")),
    heads: norm((it.heads || []).join(" ")),
    text: norm(it.text),
    words: norm(it.words),
    body: norm(it.body),
  };
  Object.defineProperty(it, "_n", { value: n, enumerable: false });
  return n;
};

const wordStart = (hay, t) => hay.startsWith(t) || hay.includes(" " + t);

function scoreTerm(n, t) {
  if (wordStart(n.title, t)) return 12;
  if (n.title.includes(t)) return 8;
  if (wordStart(n.url, t)) return 9;
  if (n.url.includes(t)) return 6;
  if (wordStart(n.heads, t)) return 5;
  if (n.text.includes(t)) return 4;
  if (n.words.includes(t)) return 3;
  if (n.body.includes(t)) return 1;
  return 0;
}

export function searchItems(items, query, limit = 8) {
  const terms = norm(query).split(" ").filter(Boolean);
  if (!terms.length) return [];
  const out = [];
  for (const it of items) {
    const n = prepare(it);
    let score = 0;
    let ok = true;
    for (const t of terms) {
      const s = scoreTerm(n, t);
      if (!s) { ok = false; break; }
      score += s;
    }
    // A phrase match in the title beats separate word matches.
    if (ok && terms.length > 1 && n.title.includes(terms.join(" "))) score += 10;
    if (ok) out.push({ it, score });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit).map((r) => r.it);
}

// A short piece of page text around the first typed word, for results that matched in the body.
export function snippetFor(it, query) {
  const terms = norm(query).split(" ").filter(Boolean);
  const body = it.body || "";
  const low = body.toLowerCase();
  const n = prepare(it);
  if (terms.some((t) => n.title.includes(t) || n.text.includes(t))) return it.text;
  for (const t of terms) {
    const i = low.indexOf(t);
    if (i >= 0) {
      const start = Math.max(0, body.lastIndexOf(" ", Math.max(0, i - 40)));
      return (start > 0 ? "\u2026" : "") + body.slice(start, i + 90).trim() + "\u2026";
    }
  }
  return it.text;
}
