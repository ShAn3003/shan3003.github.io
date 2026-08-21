import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "文章归档", description: "研究记录、工程反思与阶段性阅读笔记。" };

export default function ArchivePage() {
  const posts = getAllPosts();
  return (
    <>
      <header className="page-hero compact"><p className="eyebrow">WRITING</p><h1>文章归档</h1><p>研究记录、工程反思与阶段性阅读笔记。</p></header>
      <div className="archive-list">
        {posts.map((post) => (
          <article key={post.slug}>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <div><h2><Link href={`/posts/${post.slug}/`}>{post.title}</Link></h2><p>{post.excerpt}</p></div>
          </article>
        ))}
      </div>
    </>
  );
}
