# Shan Xie · Research Notes

Personal research blog built with Next.js 16, React 19, and GitHub Pages.

## Content

- `app/`: pages, metadata, and visual theme
- `content/posts/`: Markdown research notes and build logs
- `data/skills.json`: single source of truth for the public Skill catalog
- `lib/posts.ts`: Markdown loading and static rendering
- `.github/workflows/pages.yml`: static export and GitHub Pages deployment

To add or update a Skill, edit `data/skills.json`. Keep ownership explicit as
`original`, `maintained`, or `adopted`, and do not publish private paths or
internal prompts.

```bash
npm install
npm run validate:skills
npm run build
npm run validate:export
npm run dev
```
