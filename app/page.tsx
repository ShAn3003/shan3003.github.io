import Link from "next/link";
import { formatDate } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="home">
      <section className="home-intro" aria-labelledby="home-title">
        <h1 id="home-title">Shan Xie</h1>
        <p>关注多语视觉语言模型、跨语言一致性与可信评测。</p>
        <p>这里记录研究过程、阅读笔记，以及科研工作中积累的工具与经验。</p>
      </section>

      <section className="home-notes" aria-labelledby="notes-title">
        <h2 id="notes-title">最近文章</h2>
        <ul>
          {posts.slice(0, 5).map((post) => (
            <li key={post.slug}>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <Link href={`/posts/${post.slug}/`}>{post.title}</Link>
            </li>
          ))}
        </ul>
        <Link className="home-more" href="/archive/">所有文章 →</Link>
      </section>

      <section className="home-tools" aria-labelledby="tools-title">
        <h2 id="tools-title">工具</h2>
        <p><Link href="/skills/">Codex Skills</Link> — 整理日常科研与工程中可复用的工作方法。</p>
      </section>
    </div>
  );
}
