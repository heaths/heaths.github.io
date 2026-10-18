# Agent Instructions

This repository is a personal blog and technical website built with [Hugo](https://gohugo.io) and the local `minima` theme, ported from Jekyll Minima 2.5.2 with site customizations. It contains posts about software engineering, Azure, developer tools, and outdoor adventures, published at [heaths.dev](https://heaths.dev).

## Directory structure

| Path                         | Description                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------- |
| `content/posts/`             | Blog posts in Markdown.                                                       |
| `content/archive/`           | Archived articles; `_index.md` is the archive listing.                        |
| `content/`                   | Home page, About, and Privacy Policy.                                         |
| `themes/minima/layouts/`     | Hugo Go templates, `_partials/`, `_markup/` render hooks, and `_shortcodes/`. |
| `themes/minima/assets/sass/` | Minima defaults and custom Sass, compiled to `/assets/main.css`.              |
| `themes/minima/static/`      | Theme scripts and social icons.                                               |
| `data/`                      | Data files (e.g., `authors.yml`) accessible via `hugo.Data`.                  |
| `assets/`                    | Images and Sequoia scripts mounted at `/assets/`.                             |
| `.well-known/`               | AT Protocol publication verification files; preserve public URLs.             |
| `hugo.yaml`                  | Site configuration, metadata, menus, and mount settings.                      |
| `bin/new-post`               | Node.js post helper used by the new-post skill.                               |
| `public/`                    | Generated Hugo output (ignored by git).                                       |

## Writing posts

Posts go in `content/posts/` with filenames like `YYYY-MM-DD-title-slug.md`.

When the user asks to write, create, draft, or add a new blog post, use the skill defined in `.github/skills/new-post/SKILL.md`. This skill ensures the correct filename format, front matter structure, and required fields are present.

### Front matter

Every post must have YAML front matter. Example:

```yaml
---
title: My Post Title
date: 2025-01-15T10:00:00-08:00
summary: >
  A one or two sentence description of the post for use on the home page
  and in feeds.
category: tips
tags:
  - git
  - tip
url: /tips/2025/01/15/my-post-title.html
---
```

- **`summary`** — A short description (one or two sentences) of the post. This should be a YAML literal or folded string. Required for all posts.
- **`url`** — Explicit published path, also used by Sequoia. Preserve existing values. Hugo recognizes `<!--more-->` without Jekyll's `excerpt_separator` field.
- **`category`** and **`tags`** — Used for organization and rendered on post pages.
- **`atUri`** — AT Protocol URI linking the post to a Bluesky record. Never modify this field.

### Pre-commit check

Do not stage or commit changes unless the user explicitly says to.

Before committing, verify that every post in `content/posts/` (except the section's `_index.md`) has a `summary` field in its front matter. If a post is missing one, generate a summary of one or two sentences based on the post content and add it to the front matter before the `category` field.

Complete any required summary additions before the final quality pass below. Reuse successful checks from the session when the relevant files have not changed; a request to commit is not a reason to rerun them.

## Skills

Reserve spelling, Markdown lint, and Prettier for one final quality pass, only when all other work is done: implementation, content, documentation, and applicable functional verification. Do not run them during exploration or after each intermediate edit.

At the end, run these skills in order on modified files that still need checking, honoring user-specified exclusions:

1. **`check-spelling`** — Check and fix spelling in modified source files.
2. **`lint`** — Check modified files for common issues (e.g., code fence language names), including Markdown lint when applicable.
3. **`format`** — Format modified files with Prettier. Always run last.

Use the session's known results instead of repeating successful checks on unchanged files, including before staging or committing. Do not restart the entire pass because one check needs a fix: recheck only affected files with the relevant tool, then continue. If a final-pass change requires functional verification, run only the affected verification; do not repeat unrelated quality checks.

| Skill            | Path                                     | Description                                                                                 |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| `new-post`       | `.github/skills/new-post/SKILL.md`       | Create a new blog post with the correct filename format, front matter, and required fields. |
| `check-spelling` | `.github/skills/check-spelling/SKILL.md` | Check and fix spelling in project source files using cSpell. Config: `.vscode/cspell.json`. |
| `format`         | `.github/skills/format/SKILL.md`         | Format changed files with Prettier. Run after all other changes are complete.               |
| `lint`           | `.github/skills/lint/SKILL.md`           | Lint modified files during the final quality pass, before formatting.                       |

## Building

```sh
hugo
```

For production (enables minification):

```sh
npm run build
```

For local development with live reload:

```sh
npm run dev
```

Hugo requires Dart Sass on `PATH`. Use `npm test` for post-helper and generated-site checks.
