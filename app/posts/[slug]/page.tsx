import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/components/PostCard";
import { getPost, getPostSlugs } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  return (
    <article className="post">
      <header className="post-header">
        <h1>{post.title}</h1>
        <p className="post-author">Shan Xie</p>
        <p className="post-date"><time dateTime={post.date}>{formatDate(post.date)}</time></p>
      </header>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <footer className="post-footer"><Link href="/archive/">返回文章列表</Link></footer>
    </article>
  );
}
