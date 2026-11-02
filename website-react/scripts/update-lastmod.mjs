// Records the last git commit date of every page file in src/data/lastmod.json, which is committed.
// Hosts that build from a shallow git clone cannot read history, so the build reads this file instead.
// Run `npm run lastmod` after changing page content, then commit the file.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "src", "data", "lastmod.json");
const { ROUTES } = await import(pathToFileURL(join(root, "src", "routes.js")).href);
const old = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
const out = {};
for (const r of ROUTES) {
  if (r.sitemap === false) continue;
  let date = "";
  try {
    date = execFileSync("git", ["log", "-1", "--format=%cs", "--", `src/pages/${r.name}.jsx`], { cwd: root, encoding: "utf8" }).trim();
  } catch { /* no git history available */ }
  out[r.path] = date || old[r.path] || new Date().toISOString().slice(0, 10);
}
writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${Object.keys(out).length} dates to src/data/lastmod.json`);
