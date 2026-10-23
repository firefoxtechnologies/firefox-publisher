# Firefox Publishers (React)

React + Vite + React Router version of the static site in `../website`.

    npm install
    npm run dev       # http://localhost:5180
    npm run build     # outputs dist/

- `src/pages/` Home, Books, Portfolio, ServicePage (one component, four routes), NotFound
- `src/components/` Layout (topbar, header, footer, scroll progress, back-to-top), Hero, Journey, Tools (estimator, readiness, contact form), ui (Reveal, Count)
- `src/data/` site copy and catalogs (services, packages, books, projects)
- `src/styles/` the original CSS, unchanged
- `public/assets/` logo and cover images

The contact form is front-end only; connect it to a form service before launch.
