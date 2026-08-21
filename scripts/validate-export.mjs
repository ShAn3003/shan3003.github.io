import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../out/", import.meta.url);

function filesUnder(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

if (!existsSync(root)) throw new Error("Missing out/. Run npm run build first.");

const htmlFiles = filesUnder(root.pathname).filter((path) => path.endsWith(".html"));
const missing = new Set();

for (const htmlFile of htmlFiles) {
  const source = readFileSync(htmlFile, "utf8");
  if (source.includes("{{") || source.includes("{%")) throw new Error(`Unrendered template syntax in ${htmlFile}`);
  for (const match of source.matchAll(/\b(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const urlPath = decodeURIComponent(match[1]);
    const relative = urlPath.replace(/^\//, "");
    const candidates = urlPath.endsWith("/")
      ? [join(root.pathname, relative, "index.html")]
      : [join(root.pathname, relative), join(root.pathname, relative, "index.html")];
    if (!candidates.some(existsSync)) missing.add(`${htmlFile}: ${urlPath}`);
  }
}

if (missing.size) throw new Error(`Broken internal references:\n${[...missing].join("\n")}`);
console.log(`Validated ${htmlFiles.length} HTML files and their internal references`);
