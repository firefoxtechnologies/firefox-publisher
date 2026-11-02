import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `manifest` lets scripts/prerender.mjs link each page's own CSS and scripts into its static HTML.
export default defineConfig({
  plugins: [react()],
  build: { manifest: true },
});
