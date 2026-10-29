import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Books from "./pages/Books.jsx";
import BookWriting from "./pages/BookWriting.jsx";
import BookEditing from "./pages/BookEditing.jsx";
import EbookDesign from "./pages/EbookDesign.jsx";
import EbookPublishing from "./pages/EbookPublishing.jsx";
import BookPrinting from "./pages/BookPrinting.jsx";
import BookMarketing from "./pages/BookMarketing.jsx";
import AuthorBranding from "./pages/AuthorBranding.jsx";
import AudiobookProduction from "./pages/AudiobookProduction.jsx";
import BookTrailers from "./pages/BookTrailers.jsx";
import FreeBookCoverMaker from "./pages/FreeBookCoverMaker.jsx";
import About from "./pages/About.jsx";
import ThankYou from "./pages/ThankYou.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="books" element={<Books />} />
        <Route path="book-writing" element={<BookWriting />} />
        <Route path="book-editing" element={<BookEditing />} />
        <Route path="ebook-design" element={<EbookDesign />} />
        <Route path="ebook-publishing" element={<EbookPublishing />} />
        <Route path="book-printing" element={<BookPrinting />} />
        <Route path="book-marketing" element={<BookMarketing />} />
        <Route path="author-branding-illustration" element={<AuthorBranding />} />
        <Route path="audiobook-production" element={<AudiobookProduction />} />
        <Route path="book-trailers" element={<BookTrailers />} />
        <Route path="free-book-cover-maker" element={<FreeBookCoverMaker />} />
        <Route path="about" element={<About />} />
        <Route path="thank-you" element={<ThankYou />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
