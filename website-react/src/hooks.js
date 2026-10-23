import { useEffect, useState } from "react";

export const prefersReducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sets the document title and meta description for the current page.
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
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
