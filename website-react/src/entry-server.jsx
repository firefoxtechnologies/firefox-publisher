import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";

export { ROUTES } from "./routes.js";
export { SEARCH_INDEX } from "./data/searchIndex.js";

const modules = import.meta.glob("./pages/*.jsx", { eager: true });
const pages = Object.fromEntries(Object.entries(modules).map(([f, m]) => [f.slice(8, -4), m.default]));

export function render(url) {
  globalThis.__PAGE_META__ = null;
  const html = renderToString(
    <StaticRouter location={url}>
      <App pages={pages} />
    </StaticRouter>
  );
  return { html, meta: globalThis.__PAGE_META__ };
}
