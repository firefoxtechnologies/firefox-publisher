// Cinematic hero: mouse + scroll parallax, progress bar, counters, stagger, pinned journey
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".cine");
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, heroVisible = true;

  const bar = document.createElement("div");
  bar.id = "sp";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const pin = document.querySelector(".pin");
  const pinIn = document.querySelector(".pin__in");

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
    if (hero && !reduce) hero.style.setProperty("--sy", scrollY);
    if (pin && pinIn && tabs.length && pin.offsetHeight > pinIn.offsetHeight + 100) {
      const r = pin.getBoundingClientRect();
      const span = pin.offsetHeight - pinIn.offsetHeight;
      const p = Math.min(0.999, Math.max(0, (110 - r.top) / span));
      const i = Math.floor(p * tabs.length);
      if (tabs[i].getAttribute("aria-selected") !== "true") tabs[i].click();
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (hero && !reduce) {
    new IntersectionObserver((e) => { heroVisible = e[0].isIntersecting; }).observe(hero);
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      hero.style.setProperty("--mx", cx.toFixed(3));
      hero.style.setProperty("--my", cy.toFixed(3));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  }

  // animated counters
  document.querySelectorAll("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count), pre = el.dataset.prefix || "";
    if (reduce || !("IntersectionObserver" in window)) return;
    el.textContent = pre + "0";
    new IntersectionObserver((en, o) => {
      if (!en[0].isIntersecting) return;
      o.disconnect();
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1400);
        el.textContent = pre + Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.15 }).observe(el);
  });

  // staggered reveal delays
  document.querySelectorAll(".grid > .reveal, .steps > .reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 70 + "ms";
  });
})();

// smooth flow: current-section nav highlight, back-to-top, covers parallax
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // current section in the nav (home page)
  const links = [...document.querySelectorAll('#nav a[href^="#"]')];
  if (links.length && "IntersectionObserver" in window) {
    const map = new Map();
    links.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); if (s) map.set(s, a); });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.removeAttribute("aria-current"));
        map.get(e.target).setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, s) => io.observe(s));
  }

  // back to top
  const up = document.createElement("button");
  up.type = "button"; up.className = "to-top"; up.setAttribute("aria-label", "Back to top");
  up.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  up.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  document.body.appendChild(up);

  // throttled scroll work
  const books = [...document.querySelectorAll(".shelf-book")];
  let ticking = false;
  const frame = () => {
    ticking = false;
    up.classList.toggle("show", scrollY > 900);
    if (!reduce) books.forEach((b, i) => {
      const r = b.getBoundingClientRect();
      const off = (r.top + r.height / 2 - innerHeight / 2) * (i % 2 ? -0.06 : 0.06);
      b.style.setProperty("--py", Math.max(-40, Math.min(40, off)).toFixed(1) + "px");
    });
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  frame();
})();
