import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const questions = JSON.parse(readFileSync(new URL("../data/cspj-round2.json", import.meta.url), "utf8"));
assert.equal(questions.length, 28, "Expected 28 national problems");
assert.equal(new Set(questions.map((item) => item.id)).size, 28, "Duplicate problem ID");
for (let year = 2019; year <= 2025; year++) {
  const paper = questions.filter((item) => item.year === year);
  assert.deepEqual(paper.map((item) => item.q), [1, 2, 3, 4], "Missing or misordered problem in " + year);
}
for (const item of questions) {
  assert.match(item.id, /^P[0-9]+$/);
  assert.ok(Number.isInteger(item.difficulty) && item.difficulty >= 1 && item.difficulty <= 5);
  for (const key of ["title", "topic", "summary", "approach", "trap"]) assert.ok(item[key]?.trim(), item.id + ": missing " + key);
}
console.log("Validated 7 papers / 28 unique second-round problems");
