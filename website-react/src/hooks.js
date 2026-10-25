import { useEffect, useState } from "react";

export const prefersReducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const ORIGIN = "https://firefoxpublisher.com";

function upsertHead(selector, create, value, attr) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  tag.setAttribute(attr, value);
  return tag;
}

const metaTag = (attr, key) => () => {
  const m = document.createElement("meta");
  m.setAttribute(attr, key);
  return m;
};

// Sets the document title, meta description, canonical URL and social tags for the current page.
// During prerendering (no document) it records the values so the build script can write them into the HTML.
export function usePageMeta(title, description, { noindex = false } = {}) {
  if (typeof document === "undefined") {
    globalThis.__PAGE_META__ = { title, description, noindex };
  }
  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const url = ORIGIN + (path === "/" ? "/" : path);
    document.title = title;
    if (description) {
      upsertHead('meta[name="description"]', metaTag("name", "description"), description, "content");
      upsertHead('meta[property="og:description"]', metaTag("property", "og:description"), description, "content");
    }
    upsertHead('meta[property="og:title"]', metaTag("property", "og:title"), title, "content");
    upsertHead('meta[property="og:url"]', metaTag("property", "og:url"), url, "content");
    upsertHead('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), url, "href");
    const robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) upsertHead('meta[name="robots"]', metaTag("name", "robots"), "noindex", "content");
    else if (robots) robots.remove();
  }, [title, description, noindex]);
}

// Calls `handler` on window scroll, throttled to one call per animation frame.
export function useRafScroll(handler) {
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        handler();
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    handler();
    return () => removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// True once the element has scrolled into view (and stays true).
export function useInView(ref, threshold = 0.12) {
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === "undefined");
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, threshold]);
  return seen;
}
