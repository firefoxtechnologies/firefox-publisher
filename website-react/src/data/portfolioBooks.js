// Book covers shown on /portfolio, in display order.
const book = (file, title, by, genre) => ({ src: `/assets/portfolio/book-${file}`, title, by, genre });

export const PORTFOLIO_BOOKS = [
  book("ryder-gone-to-hell.jpg", "Ryder: Gone to Hell", "Wyatt Steele", "Western"),
  book("oasis.jpg", "Oasis", "Dima Zales", "Sci-Fi"),
  book("anchored-by-the-sea.jpg", "Anchored By The Sea", "Eve Bennett", "Romance"),
  book("ambitious.jpg", "Ambitious", "Ayden Presley", "Contemporary"),
  book("big-big-secrets.jpg", "Big Big Secrets", "Robert Arley", "Middle Grade"),
  book("archon-protocol.jpg", "Archon Protocol", "Dominic Jackson", "Sci-Fi"),
  book("the-soul-trade.jpg", "The Soul Trade", "Edward Rose", "Urban Fantasy"),
  book("dragon.jpg", "Dragon", "Zoe Dawson", "Romance"),
  book("no-pea-in-the-pool.jpg", "No Pea in the Pool", "Candice Jarrett", "Kids"),
  book("fear-justice.jpg", "Fear Justice", "C.C. Bolick", "Urban Fantasy"),
  book("vance-her-second-chance-cowboy.jpg", "Vance: Her Second-Chance Cowboy", "Debra Clopton", "Romance"),
  book("finding-angus.jpg", "Finding Angus", "L.K. Johnson", "Historical"),
  book("gas-griddle-cookbook.jpg", "Gas Griddle Cookbook", "Charlie Turner", "Cookbook"),
  book("glass-and-darkness.jpg", "Glass and Darkness", "Francis Anderson", "Fiction"),
  book("aurah-academy.jpg", "Aura'ah Academy: Whispers of the Iron Door", "Aditya Elango", "Fantasy"),
  book("hope-lake.jpg", "Hope Lake: Hoping on Change", "Danae Little", "Romance"),
  book("off-the-map.jpg", "Off the Map", "JL Crosswhite", "Romantic Suspense"),
  book("grill-cookbook.jpg", "Grill Cookbook", "Alexander Davis", "Cookbook"),
  book("someone-like-you.jpg", "Someone Like You", "Kait Nolan", "Romance"),
  book("just-ten-days.jpg", "Just Ten Days", "M.P. Anderfeldt", "Thriller"),
];
