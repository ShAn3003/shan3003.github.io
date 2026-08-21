import type { Skill } from "@/lib/skills";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <article className="skill-card" id={skill.name}>
      <div className="skill-card-top">
        <span className="skill-symbol" aria-hidden="true">{skill.symbol}</span>
        <span className={`status status-${skill.status}`}>{skill.status_label}</span>
      </div>
      <p className="skill-type">{skill.type}{skill.plugin && ` · ${skill.plugin}`}</p>
      <h3>{skill.title}</h3>
      <code>${skill.name}</code>
      <p>{skill.summary}</p>
      <dl>
        <div><dt>解决</dt><dd>{skill.solves}</dd></div>
        <div><dt>触发</dt><dd>{skill.trigger}</dd></div>
      </dl>
      <div className="tag-row">{skill.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      {skill.url && <a className="text-link" href={skill.url} rel="noreferrer">项目来源 →</a>}
    </article>
  );
}
