import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { NAV, SITE } from "../data/site.js";
import { prefersReducedMotion, useRafScroll } from "../hooks.js";

function ParentLink() {
  return <a className="parent-link" href={SITE.parentUrl} target="_blank" rel="noopener">Firefox Technologies</a>;
}

// Scrolls to the #hash target after navigation, or to the top for a plain route change.
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
        return;
      }
    }
    scrollTo(0, 0);
  }, [pathname, hash, key]);
  return null;
}

function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      ref.current.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return <div id="sp" ref={ref} aria-hidden="true" />;
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useRafScroll(() => setShow(scrollY > 900));
  return (
    <button
      type="button"
      className={"to-top" + (show ? " show" : "")}
      aria-label="Back to top"
      onClick={() => scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}

// Highlights the nav link of the home-page section currently in view.
function useActiveSection(enabled) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") {
      setActive(null);
      return;
    }
    const sections = NAV.filter((n) => n.id).map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

function Header() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const { pathname } = useLocation();
  const active = useActiveSection(pathname === "/");

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="header">
      <div className="wrap header__in">
        <Link className="brand" to="/" aria-label="Firefox Publishers, home">
          <img src="/assets/logo.jpg" alt="" />
          <span>FIREFOX<small>PUBLISHERS</small></span>
        </Link>
        <button
          ref={btnRef}
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
        <nav className={"nav" + (open ? " open" : "")} id="nav" aria-label="Main" onClick={(e) => e.target.closest("a") && setOpen(false)}>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} aria-current={n.id && active === n.id ? "true" : undefined}>{n.label}</Link>
          ))}
          <Link className="btn btn--primary" to="/#contact">Start a project</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__cols">
          <div>
            <strong>FIREFOX PUBLISHERS</strong>
            <p style={{ marginTop: 12 }}>Helping authors present, publish and promote their work with professional care.</p>
            <p className="footer__parent">A child company of <ParentLink />.</p>
          </div>
          <div>
            <p className="fhead">Company</p>
            <Link to="/#about">About</Link><Link to="/portfolio">Portfolio</Link><Link to="/books">Books</Link><Link to="/#process">Process</Link><Link to="/#contact">Contact</Link>
          </div>
          <div>
            <p className="fhead">Services</p>
            <Link to="/publishing">Publishing</Link><Link to="/author-branding-marketing">Author Branding &amp; Marketing</Link><Link to="/audio-video-production">Audio &amp; Video Production</Link><Link to="/digital-creative-services">Digital &amp; Creative Services</Link>
          </div>
          <div>
            <p className="fhead">Contact</p>
            <a href={"mailto:" + SITE.email}>{SITE.email}</a><a href={SITE.phoneHref}>{SITE.phone}</a>
            <address>333 Washington St #233<br />Hoboken, New Jersey 07030, USA</address>
          </div>
        </div>
        <small>
          Fees apply; results vary. We do not guarantee sales or bestseller status.<br />
          &copy; {new Date().getFullYear()} Firefox Publishers, a child company of <ParentLink />. All rights reserved.
        </small>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="topbar">
        <div className="wrap topbar__in">
          <span className="topbar__brand">A child company of <strong><ParentLink /></strong></span>
          <span className="topbar__links">
            <a className="plain" href={"mailto:" + SITE.email}>{SITE.email}</a>
            <a className="plain" href={SITE.phoneHref}>{SITE.phone}</a>
            <Link to="/#contact">Get a free consultation</Link>
          </span>
        </div>
      </div>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <ScrollProgress />
      <BackToTop />
      <ScrollManager />
    </>
  );
}

export { ParentLink };
