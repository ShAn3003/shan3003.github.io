import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";

const input = process.argv[2];
if (!input) throw new Error("Missing visualization source path.");

const source = readFileSync(input, "utf8");
const match = source.match(/const years = (\[[\s\S]*?\n  \]);/);
if (!match) throw new Error("Could not locate the years dataset.");

const years = runInNewContext(`(${match[1]})`);
writeFileSync(resolve("data/cspj.json"), `${JSON.stringify(years, null, 2)}\n`);

