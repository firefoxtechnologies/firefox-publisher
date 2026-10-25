import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";

export function render(url) {
  globalThis.__PAGE_META__ = null;
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
  return { html, meta: globalThis.__PAGE_META__ };
}
