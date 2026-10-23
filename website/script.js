(() => {
  // mobile menu
  const btn = document.querySelector(".menu-btn");
  const nav = document.getElementById("nav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
    }
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  // scroll reveal
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  // contact form (front-end only: wire to a backend or form service before launch)
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const rules = {
    name: (v) => (v.trim() ? "" : "Please enter your name."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address, like name@example.com."),
    message: (v) => (v.trim().length >= 10 ? "" : "Please tell us a little about your project (at least 10 characters)."),
  };
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    Object.keys(rules).forEach((k) => {
      const msg = rules[k](form.elements[k].value);
      document.getElementById(k + "-err").textContent = msg;
      form.elements[k].setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) ok = false;
    });
    status.textContent = ok
      ? "Thank you. The form is not connected to email yet, so this message was not sent."
      : "Please fix the highlighted fields.";
  });
})();

// portfolio filter
(() => {
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => { c.classList.toggle("active", c === chip); c.setAttribute("aria-pressed", String(c === chip)); });
    document.querySelectorAll("#projects .work").forEach((w) => {
      w.hidden = chip.dataset.filter !== "all" && w.dataset.cat !== chip.dataset.filter;
    });
  }));
})();

// journey tabs
(() => {
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  if (!tabs.length) return;
  const show = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (document.activeElement && document.activeElement.closest(".tabs")) tab.focus({ preventScroll: true });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => show(t));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(tabs[(i + 1) % tabs.length]);
      if (e.key === "ArrowLeft") show(tabs[(i - 1 + tabs.length) % tabs.length]);
    });
  });
})();

// journey progress, timeline estimator, readiness checker
(() => {
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const bar = document.getElementById("progress-bar");
  const label = document.getElementById("progress-label");
  if (bar) {
    const sync = () => {
      const i = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
      bar.style.width = ((i + 1) / tabs.length) * 100 + "%";
      label.textContent = "Step " + (i + 1) + " of " + tabs.length;
    };
    tabs.forEach((t) => t.addEventListener("click", () => setTimeout(sync)));
    tabs.forEach((t) => t.addEventListener("keydown", () => setTimeout(sync)));
  }

  const range = document.getElementById("words");
  if (range) {
    const out = document.getElementById("est-out");
    const render = () => {
      const k = Number(range.value);
      document.getElementById("words-out").textContent = (k * 1000).toLocaleString() + " words";
      const rows = [
        ["Discovery", 1],
        ["Editorial", k <= 35 ? 2 : k <= 120 ? 3 : 4],
        ["Design & production", 5 - (k <= 35 ? 2 : k <= 120 ? 3 : 4)],
        ["Launch prep", 2],
      ];
      const total = rows.reduce((s, r) => s + r[1], 0);
      const wk = (n) => n + (n === 1 ? " week" : " weeks");
      out.innerHTML = rows.map((r) => `<div><dt>${r[0]}</dt><dd>${wk(r[1])}</dd></div>`).join("") +
        `<div class="total"><dt>Approx. total</dt><dd>${wk(total)}</dd></div>`;
    };
    range.addEventListener("input", render);
    render();
  }

  const rd = document.getElementById("readiness");
  if (rd) {
    const msgs = ["Let us help you get started.", "A good start.", "Making progress.", "Nearly there.", "Well prepared.", "Ready to publish."];
    rd.addEventListener("change", () => {
      const n = rd.querySelectorAll("input:checked").length;
      document.getElementById("rd-out").textContent = "Score: " + n + " of 6. " + msgs[n];
    });
  }
})();

// package buttons prefill the contact form
document.querySelectorAll("[data-plan]").forEach((a) => a.addEventListener("click", () => {
  const msg = document.getElementById("message");
  if (msg && !msg.value.trim()) msg.value = "I am interested in the " + a.dataset.plan + ".";
}));

// books filter by genre
(() => {
  const list = document.getElementById("books");
  if (!list) return;
  document.querySelectorAll(".chip[data-genre]").forEach((chip) => chip.addEventListener("click", () => {
    list.querySelectorAll(".product").forEach((p) => {
      p.hidden = chip.dataset.genre !== "all" && p.dataset.genre !== chip.dataset.genre;
    });
  }));
})();
