import { readFileSync } from "node:fs";

const path = new URL("../data/skills.json", import.meta.url);
const skills = JSON.parse(readFileSync(path, "utf8"));
const required = ["name", "title", "symbol", "ownership", "type", "status", "status_label", "summary", "solves", "trigger", "tags"];
const ownerships = new Set(["original", "maintained", "adopted"]);
const names = new Set();

if (!Array.isArray(skills) || skills.length === 0) throw new Error("Skill catalog must be a non-empty array");

for (const [index, skill] of skills.entries()) {
  for (const key of required) {
    if (!(key in skill) || skill[key] === "") throw new Error(`skills[${index}] is missing ${key}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.name)) throw new Error(`Invalid skill name: ${skill.name}`);
  if (names.has(skill.name)) throw new Error(`Duplicate skill name: ${skill.name}`);
  if (!ownerships.has(skill.ownership)) throw new Error(`Invalid ownership for ${skill.name}`);
  if (!Array.isArray(skill.tags) || skill.tags.length === 0) throw new Error(`${skill.name} needs at least one tag`);
  names.add(skill.name);
}

console.log(`Validated ${skills.length} skills: ${[...names].join(", ")}`);
