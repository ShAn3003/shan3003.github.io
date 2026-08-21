import type { Metadata } from "next";
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
        <p className="eyebrow">RESEARCH NOTE</p>
        <h1>{post.title}</h1>
        <div className="post-meta"><time dateTime={post.date}>{formatDate(post.date)}</time>{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
      </header>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
