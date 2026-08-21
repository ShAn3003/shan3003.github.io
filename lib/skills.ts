import skillData from "@/data/skills.json";

export type SkillOwnership = "original" | "maintained" | "adopted";

export type Skill = {
  name: string;
  title: string;
  symbol: string;
  ownership: SkillOwnership;
  type: string;
  plugin?: string;
  status: string;
  status_label: string;
  summary: string;
  solves: string;
  trigger: string;
  tags: string[];
  url?: string;
};

export const skills = skillData as Skill[];

export function skillsByOwnership(ownership: SkillOwnership): Skill[] {
  return skills.filter((skill) => skill.ownership === ownership);
}
