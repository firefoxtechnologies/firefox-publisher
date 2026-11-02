import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { pageName } from "./routes.js";
import "./styles/styles.css";
import "./styles/cinematic.css";
import "./styles/polish.css";
import "./styles/theme.css";
import "./styles/motion.css";

// Every page is its own download. The page being opened is fetched first so the prerendered
// HTML stays on screen until the real page is ready (no blank flash).
const loaders = import.meta.glob("./pages/*.jsx");
const pages = {};
for (const [file, load] of Object.entries(loaders)) pages[file.slice(8, -4)] = lazy(load);

const first = loaders[`./pages/${pageName(location.pathname) || "NotFound"}.jsx`];
Promise.resolve(first?.()).catch(() => {}).then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <App pages={pages} />
      </BrowserRouter>
    </StrictMode>
  );
});
