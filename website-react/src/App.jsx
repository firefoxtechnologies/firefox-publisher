import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { ROUTES } from "./routes.js";

// `pages` maps a page name to its component. The browser passes lazy ones so each page is its own
// download; the prerender script passes the real components so the HTML is rendered in one pass.
export default function App({ pages }) {
  const NotFound = pages.NotFound;
  return (
    <Routes>
      <Route element={<Layout />}>
        {ROUTES.map((r) => {
          const Page = pages[r.name];
          return r.path === "/" ? <Route key={r.name} index element={<Page />} /> : <Route key={r.name} path={r.path.slice(1)} element={<Page />} />;
        })}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
