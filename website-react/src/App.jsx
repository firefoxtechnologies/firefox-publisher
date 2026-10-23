import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Books from "./pages/Books.jsx";
import ServicePage from "./pages/ServicePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import { SERVICE_PAGES } from "./data/catalog.js";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="books" element={<Books />} />
        {SERVICE_PAGES.map((s) => (
          <Route key={s.path} path={s.path} element={<ServicePage service={s} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
