import Link from "next/link";
import type { PostSummary } from "@/lib/posts";

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="post-card">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <h3><Link href={`/posts/${post.slug}/`}>{post.title}</Link></h3>
      <p>{post.excerpt}</p>
      <Link className="text-link" href={`/posts/${post.slug}/`}>继续阅读 →</Link>
    </article>
  );
}
