import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const questions = JSON.parse(readFileSync(new URL("../data/cspj-round2.json", import.meta.url), "utf8"));
assert.equal(questions.length, 14);
assert.equal(new Set(questions.map((item) => item.id)).size, 14);
for (let year = 2019; year <= 2025; year++) assert.deepEqual(questions.filter((item) => item.year === year).map((item) => item.q), [1, 2]);
for (const item of questions) {
  for (const key of ["title", "topic", "summary", "approach", "trap"]) assert.ok(item[key]?.trim());
  assert.ok(item.prerequisites.length >= 2);
  assert.ok(item.practice.length >= 3);
  assert.ok(new Set(item.practice.filter((step) => step.id !== item.id).map((step) => step.id)).size >= 2);
  assert.equal(item.practice.filter((step) => step.id === item.id && step.stage === "真题").length, 1);
  for (const step of item.practice) {
    assert.match(step.id, /^P[0-9]+$/);
    assert.ok(step.title && step.stage && step.reason);
  }
}
console.log("Validated 14 T1/T2 routes, each with prerequisites and at least two other Luogu exercises");
