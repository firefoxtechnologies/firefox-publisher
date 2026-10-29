import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { NAV, SERVICES, SITE } from "../data/site.js";
import { prefersReducedMotion, useRafScroll } from "../hooks.js";
import ContactPopup from "./ContactPopup.jsx";
import HalftoneWordmarkFooter from "./ui/halftone-wordmark-footer";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

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

// Keyed on the path so every page change replays the soft fade-in defined in motion.css.
function RoutedMain() {
  const { pathname } = useLocation();
  return <main id="main" key={pathname}><Outlet /></main>;
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

function ServiceIcon({ s }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {s.rect && <rect {...s.rect} />}
      {s.circle && <circle {...s.circle} />}
      <path d={s.d} />
    </svg>
  );
}

const WORK_LINKS = [
  { to: "/portfolio", title: "Portfolio", text: "Selected projects, with the objective and what was delivered." },
  { to: "/free-book-cover-maker", title: "Free Cover Maker", text: "Design your own book cover from genre templates and download it free." },
  { to: "/books", title: "Books", text: "Sample covers and public-domain classics we can publish." },
];
const FLAT_LINKS = NAV.filter((n) => n.id && n.id !== "services");
const SERVICE_PAGES = [
  { to: "/book-writing", label: "Book Writing" },
  { to: "/book-editing", label: "Book Editing" },
  { to: "/ebook-design", label: "Ebook Cover & Interior Design" },
  { to: "/ebook-publishing", label: "Ebook Publishing" },
  { to: "/book-printing", label: "Book Printing" },
  { to: "/book-marketing", label: "Book Marketing" },
  { to: "/author-branding-illustration", label: "Author Branding & Illustration" },
  { to: "/audiobook-production", label: "Audiobook Production" },
  { to: "/book-trailers", label: "Book Video Trailers" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const [preview, setPreview] = useState(0);
  const btnRef = useRef(null);
  const { pathname, hash, key } = useLocation();
  const active = useActiveSection(pathname === "/");

  useEffect(() => setOpen(false), [pathname, hash, key]);
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

  // Warm the cache so the service photos are ready the first time the menu opens.
  useEffect(() => {
    SERVICES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  const current = SERVICES[preview];

  return (
    <header className="header">
      <div className="wrap header__in">
        <Link className="brand" to="/" aria-label="Firefox Publisher, home">
          <img className="brand__fox" src="/assets/logo-fox-mark.webp" alt="" width="700" height="379" />
          <span className="brand__name" role="img" aria-label="Firefox Publisher"><span aria-hidden="true">FIREFOX</span><span className="spread" aria-hidden="true">{[..."PUBLISHER"].map((c, i) => <span key={i}>{c}</span>)}</span></span>
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

        <div className={"nav" + (open ? " open" : "")} id="nav" onClick={(e) => e.target.closest("a") && setOpen(false)}>
          {/* Desktop: dropdown menu. Hidden when the menu collapses into the button. */}
          <NavigationMenu className="nm--desktop" aria-label="Main">
            <NavigationMenuList>
              <NavigationMenuItem mega>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent className="nm__content--mega">
                  <div className="nmx">
                    <ul className="nmx__list">
                      {SERVICES.map((sv, i) => (
                        <li key={sv.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              className="nmx__item"
                              to={sv.to}
                              data-on={i === preview}
                              onMouseEnter={() => setPreview(i)}
                              onFocus={() => setPreview(i)}
                            >
                              <span className="nmx__icon"><ServiceIcon s={sv} /></span>
                              <span className="nmx__txt"><strong>{sv.title}</strong><small>{sv.text}</small></span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                    <Link className="nmx__preview" to={current.to} tabIndex={-1} aria-hidden="true">
                      <span className="nmx__pic">
                        {SERVICES.map((sv, i) => (
                          <img key={sv.title} src={sv.image} alt="" data-on={i === preview} />
                        ))}
                      </span>
                      <strong>{current.title}</strong>
                      <span className="nmx__more">Learn more &rarr;</span>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Work</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="nmw">
                    {WORK_LINKS.map((w) => (
                      <li key={w.to}>
                        <NavigationMenuLink asChild>
                          <Link className="nmw__item" to={w.to}><strong>{w.title}</strong><small>{w.text}</small></Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {FLAT_LINKS.map((n) => (
                <NavigationMenuItem key={n.to}>
                  <NavigationMenuLink asChild>
                    <Link className="nm__link" to={n.to} aria-current={active === n.id ? "true" : undefined}>{n.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Collapsed: a flat list inside the menu button's panel. */}
          <nav className="nm-mobile" aria-label="Main (mobile)">
            <ul>
              <li className={"nm-mobile__svc" + (svcOpen ? " is-open" : "")}>
                <button type="button" className="nm-mobile__toggle" aria-expanded={svcOpen} aria-controls="nm-mobile-services" onClick={() => setSvcOpen((v) => !v)}>
                  <span>Services</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </button>
                <ul id="nm-mobile-services" hidden={!svcOpen}>
                  <li><Link to="/#services" aria-current={active === "services" ? "true" : undefined}>All services</Link></li>
                  {SERVICE_PAGES.map((sp) => <li key={sp.to}><Link to={sp.to}>{sp.label}</Link></li>)}
                </ul>
              </li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/books">Books</Link></li>
              {FLAT_LINKS.map((n) => (
                <li key={n.to}><Link to={n.to} aria-current={active === n.id ? "true" : undefined}>{n.label}</Link></li>
              ))}
            </ul>
          </nav>

          <Link className="btn btn--primary" to="/#contact">Start a project</Link>
        </div>
      </div>
    </header>
  );
}

const FOOTER_COLUMNS = [
  { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Portfolio", href: "/portfolio" }, { label: "Books", href: "/books" }, { label: "Process", href: "/#process" }, { label: "Contact", href: "/#contact" }] },
  { title: "Services", links: [{ label: "Book Writing", href: "/book-writing" }, { label: "Book Editing", href: "/book-editing" }, { label: "Ebook Cover & Interior Design", href: "/ebook-design" }, { label: "Free Book Cover Maker", href: "/free-book-cover-maker" }, { label: "Ebook Publishing", href: "/ebook-publishing" }, { label: "Book Marketing", href: "/book-marketing" }, { label: "Audiobook Production", href: "/audiobook-production" }, { label: "All services: what we do", href: "/#services" }] },
  { title: "Contact", links: [{ label: SITE.email, href: "mailto:" + SITE.email }, { label: SITE.phone, href: SITE.phoneHref }, { label: "333 Washington St #233, Hoboken NJ 07030" }, { label: "Social media", social: true }] },
];

const SOCIAL_ICONS = {
  instagram: <path fillRule="evenodd" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8zm0 2.2a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4zm5.5-4.6a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z" />,
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
};

function SocialIcon({ name }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      {SOCIAL_ICONS[name]}
    </svg>
  );
}

// Internal URLs go through the router; mailto:, tel: and external URLs stay plain anchors.
function renderFooterLink(l) {
  if (l.social) {
    return (
      <span style={{ display: "flex", gap: 10, marginTop: 6 }}>
        {SITE.social.map((o) => (
          <a key={o.label} href={o.href} target="_blank" rel="noopener noreferrer" aria-label={o.label} title={o.label}
            style={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 7, color: "#fff", border: "1px solid rgba(255,255,255,.4)", background: "rgba(234,243,253,.06)" }}>
            <SocialIcon name={o.icon} />
          </a>
        ))}
      </span>
    );
  }
  if (!l.href) return <span style={{ opacity: 0.78 }}>{l.label}</span>;
  if (l.href.startsWith("/")) return <Link to={l.href}>{l.label}</Link>;
  return <a href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{l.label}</a>;
}

function Footer() {
  return (
    <HalftoneWordmarkFooter
      wordmark="firefox publisher"
      logo={(
        <span className="footer-lockup">
          <img className="footer-fox" src="/assets/logo-fox-mark.webp" alt="" width="700" height="379" />
          <span className="footer-lockup__name" role="img" aria-label="Firefox Publisher"><span aria-hidden="true">FIREFOX</span><span className="spread" aria-hidden="true">{[..."PUBLISHER"].map((c, i) => <span key={i}>{c}</span>)}</span></span>
        </span>
      )}
      meta={`\u00a9${new Date().getFullYear()} \u00b7 Hoboken, New Jersey`}
      legal={
        <>
          A child company of <ParentLink />. Fees apply; results vary. We do not guarantee sales or bestseller status. All rights reserved.
        </>
      }
      columns={FOOTER_COLUMNS}
      renderLink={renderFooterLink}
      palette={{ background: "#0b1c35", ink: "#eaf3fd", warm: "#f28c28" }}
      fontFamily='"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif'
      monoFamily='"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif'
      dotOpacity={0.4}
      height="clamp(520px, 38vw, 620px)"
    />
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
      <RoutedMain />
      <Footer />
      <ScrollProgress />
      <BackToTop />
      <ScrollManager />
      <ContactPopup />
    </>
  );
}

export { ParentLink };
