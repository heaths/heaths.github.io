# Agent Instructions

Personal blog at [heaths.dev](https://heaths.dev), built with [Hugo](https://gohugo.io) and the local `themes/minima` theme (ported from Jekyll Minima 2.5.2).

Keep this file concise and written for agents: rules and facts only, no prose.

| Path                  | Notes                                                                    |
| --------------------- | ------------------------------------------------------------------------ |
| `content/posts/`      | Page bundles: `<slug>/index.md` plus the post's images.                  |
| `archetypes/posts.md` | Front matter template for `hugo new content posts/<slug>/index.md`.      |
| `assets/`             | Shared images and Sequoia scripts, published at `/assets/`.              |
| `static/`             | Site-root files: favicons copied unchanged from the design system.       |
| `.well-known/`        | AT Protocol verification files; keep their public URLs and bytes stable. |

## Posts

To write a post, use the `new-post` skill. Posts publish at `/posts/<slug>/`. Reference bundle images by filename and give them the rounded, shadowed style: `{{< image src="cover.jpg" alt="Alt" class="cover-image" >}}`; add `webp="cover.webp"` when a WebP version exists. Use `image-grid` for galleries. Link to other posts as `../other-slug/index.md`. The build fails on posts that break the rules below.

```yaml
title: My Post Title
date: 2025-01-15T10:00:00-08:00
summary: >
  One or two sentences for the home page and feeds.
image: /posts/my-post-title/cover.jpg
category: tips
tags: [git, tips]
```

- `summary`: required, as a folded or literal string.
- `image`: optional; the published path of a bundle file, `/posts/<slug>/<file>`.
- `aliases`: old URLs that redirect here. Never remove any. Keep the first one first; it's the Atom entry ID. `bin/fixtures/legacy-urls.txt` lists the URLs `npm test` requires.
- `atUri`: never modify.

## Commits

Don't stage or commit unless asked. Before committing, make sure every `content/posts/*/index.md` has a `summary`. If one is missing, write one or two sentences from the post and add it before `category`. Do that before the final checks.

## Final checks

Once all other work is done (implementation, content, docs, and functional verification), run the `check-spelling`, `lint`, then `format` skills (in `.claude/skills/`, mirrored at `.github/skills/`). Run them only on modified files and honor user exclusions. Don't run them mid-task or rerun passing checks on unchanged files, including before committing. After a fix, recheck only the affected files with that tool, and rerun only the affected functional verification.

## Building

Requires Hugo and Node.js (`npm ci`). Use `npm run dev` to preview. `npm test` runs the production build plus the `node:test` checks in `bin/check-site.test.mjs`.
