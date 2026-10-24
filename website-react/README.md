# Firefox Publisher (React)

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

## Credits

Photos in `public/assets/services/` and `public/assets/journey/` are from [Pexels](https://www.pexels.com) and used under the
[Pexels licence](https://www.pexels.com/license/) (free for commercial use, attribution not required).
Photo ids: 5905849, 1475290, 17890948, 844734, 76942, 2041891, 5428670, 5939401, 12044783, 8640098,
7129624, 20456575 (services); 7550402, 7596910, 15309303, 3952079, 8581043 (journey). The services wheel is `src/components/ui/works-wheel.tsx` (CSS 3D).

Stage photos in `public/assets/stages/` (Pexels): idea 7120923, writing 8036328, draft 8035295, edited 7968067, designed 8408540, launch 27854754.
