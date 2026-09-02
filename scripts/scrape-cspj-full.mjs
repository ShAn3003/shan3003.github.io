import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const papers = [
  { year: 2019, id: 1030 },
  { year: 2020, id: 1034 },
  { year: 2021, id: 1036 },
  { year: 2022, id: 1039 },
  { year: 2023, id: 1041 },
  { year: 2024, id: 1043 },
  { year: 2025, id: 1119 },
];

const assetDirectory = resolve("public/csp-j-assets");
await mkdir(assetDirectory, { recursive: true });

async function localizeImage(url) {
  const parsed = new URL(url);
  const extension = extname(parsed.pathname).toLowerCase() || ".png";
  const filename = `${createHash("sha256").update(url).digest("hex").slice(0, 16)}${extension}`;
  const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 CSP-J teaching archive" } });
  if (!response.ok) throw new Error(`Image download failed (${response.status}): ${url}`);
  await writeFile(resolve(assetDirectory, filename), Buffer.from(await response.arrayBuffer()));
  return `/csp-j-assets/${filename}`;
}

async function localizeMarkdownImages(markdown) {
  const matches = [...markdown.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g)];
  let result = markdown;
  for (const match of matches) {
    const localUrl = await localizeImage(match[2]);
    result = result.replace(match[0], `![${match[1]}](${localUrl})`);
  }
  return result;
}

const output = [];
for (const paper of papers) {
  const sourceUrl = `https://ti.luogu.com.cn/problemset/${paper.id}/training`;
  const response = await fetch(sourceUrl, { headers: { "user-agent": "Mozilla/5.0 CSP-J teaching archive" } });
  if (!response.ok) throw new Error(`Paper fetch failed (${response.status}): ${sourceUrl}`);
  const html = await response.text();
  const match = html.match(/window\._feInjection = JSON\.parse\(decodeURIComponent\("([\s\S]*?)"\)\);/);
  if (!match) throw new Error(`Embedded paper data not found: ${sourceUrl}`);
  const payload = JSON.parse(decodeURIComponent(match[1]));
  const source = payload.currentData.problemset;
  const questions = [];
  for (let index = 0; index < source.problems.length; index += 1) {
    const problem = source.problems[index];
    questions.push({
      q: index + 1,
      score: problem.score,
      description: await localizeMarkdownImages(problem.description),
      choices: index < 15 ? (problem.questions?.[0]?.choices ?? []) : [],
    });
  }
  output.push({ year: paper.year, id: paper.id, name: source.name, sourceUrl, questions });
  console.log(`Saved ${paper.year}: ${questions.length} questions`);
}

await writeFile(resolve("data/cspj-full.json"), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote data/cspj-full.json and localized images in ${assetDirectory}`);
