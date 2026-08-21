import type { Metadata } from "next";
import { SkillCard } from "@/components/SkillCard";
import { skills, skillsByOwnership, type SkillOwnership } from "@/lib/skills";

export const metadata: Metadata = { title: "Skills", description: "个人 Codex Skills 的公开能力目录与维护记录。" };

const sections: Array<[SkillOwnership, string, string]> = [
  ["original", "ORIGINAL", "原创 Skills"],
  ["maintained", "MAINTAINED", "参与维护"],
  ["adopted", "ADOPTED", "采用的社区 Skill"],
];

export default function SkillsPage() {
  return (
    <>
      <header className="page-hero">
        <p className="eyebrow">PERSONAL TOOLKIT</p>
        <h1>Skills 是压缩后的经验</h1>
        <p>每个 Skill 都来自真实任务中的重复摩擦：协议漂移、证据不足、续训失真或交付不可复现。这里记录它解决什么、何时触发，以及维护状态。</p>
        <p className="catalog-date">目录审阅于 2026-08-21 · {skills.length} 个条目</p>
      </header>

      {sections.map(([ownership, eyebrow, title]) => {
        const entries = skillsByOwnership(ownership);
        return (
          <section className="skill-section" key={ownership}>
            <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><span>{entries.length}</span></div>
            <div className="skill-grid">{entries.map((skill) => <SkillCard key={skill.name} skill={skill} />)}</div>
          </section>
        );
      })}

      <aside className="catalog-note">
        <strong>记录原则</strong>
        <p>这里只展示公开、安全的能力摘要，不发布本机路径、私有数据或内部提示。原创、维护与采用分开标注，避免把安装的社区能力写成个人作品。</p>
      </aside>
    </>
  );
}
