import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  categories: string[];
  tags: string[];
};

export type Post = PostSummary & { contentHtml: string };

function readSource(slug: string) {
  const source = fs.readFileSync(path.join(postsDirectory, `${slug}.md`), "utf8");
  const { data, content } = matter(source);
  if (!data.title || !data.date || !data.excerpt) {
    throw new Error(`${slug}.md must define title, date, and excerpt`);
  }
  return { data, content };
}

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

export function getAllPosts(): PostSummary[] {
  return getPostSlugs()
    .map((slug) => {
      const { data } = readSource(slug);
      return {
        slug,
        title: String(data.title),
        date: String(data.date),
        excerpt: String(data.excerpt),
        categories: Array.isArray(data.categories) ? data.categories.map(String) : [],
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post> {
  const summary = getAllPosts().find((post) => post.slug === slug);
  if (!summary) throw new Error(`Unknown post: ${slug}`);
  const { content } = readSource(slug);
  const rendered = await remark().use(html).process(content);
  return { ...summary, contentHtml: rendered.toString() };
}
