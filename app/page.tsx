import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";
import { skillsByOwnership } from "@/lib/skills";

const focuses = [
  ["01", "Cross-lingual VLM", "研究同一视觉问题在不同语言中的决策一致性、表征机制与训练迁移。", "violet"],
  ["02", "Evidence-first Evaluation", "让 prompt、parser、覆盖率、分母和逐行输出共同支撑每一个结果声明。", "cyan"],
  ["03", "Agent Workflows", "把反复出现的科研协作问题沉淀成可复用、可验证的个人 Skills。", "orange"],
] as const;

export default function Home() {
  const posts = getAllPosts();
  const originalCount = skillsByOwnership("original").length;
  const maintainedCount = skillsByOwnership("maintained").length;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">AI RESEARCH · OPEN NOTEBOOK</p>
          <h1>把实验的来路，<br /><span>写清楚。</span></h1>
          <p className="hero-lead">我关注多语视觉语言模型、可信评测与人机科研协作。这里记录论文之外仍值得保留的东西：失败、证据链，以及把教训固化成工作流的 Codex Skills。</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/skills/">浏览 Skills</Link>
            <Link className="button button-secondary" href="/archive/">阅读笔记</Link>
          </div>
        </div>
        <aside className="hero-console" aria-label="Research workflow summary">
          <div className="console-bar"><span /><span /><span /></div>
          <p><b>research_contract</b></p>
          <p><span className="console-key">scope</span>: multilingual VLM</p>
          <p><span className="console-key">evidence</span>: rows → metrics → claims</p>
          <p><span className="console-key">status</span>: <span className="console-ok">learning in public</span></p>
        </aside>
      </section>

      <section className="stat-strip" aria-label="站点概览">
        <div><strong>{originalCount}</strong><span>原创 Skills</span></div>
        <div><strong>{maintainedCount}</strong><span>维护中 Skill</span></div>
        <div><strong>{posts.length}</strong><span>公开笔记</span></div>
      </section>

      <section className="home-section">
        <div className="section-heading"><div><p className="eyebrow">CURRENT FOCUS</p><h2>正在研究什么</h2></div></div>
        <div className="focus-grid">
          {focuses.map(([index, title, summary, color]) => (
            <article className={`focus-card focus-${color}`} key={index}>
              <span className="card-index">{index}</span><h3>{title}</h3><p>{summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <div><p className="eyebrow">LATEST NOTES</p><h2>最近记录</h2></div>
          <Link href="/archive/">查看全部 →</Link>
        </div>
        <div className="post-grid">{posts.slice(0, 3).map((post) => <PostCard key={post.slug} post={post} />)}</div>
      </section>

      <section className="manifesto">
        <p className="eyebrow">WORKING PRINCIPLE</p>
        <blockquote>一个实验的价值，不只在最终数字，也在于别人能否从原始证据走到同一个结论。</blockquote>
      </section>
    </>
  );
}
