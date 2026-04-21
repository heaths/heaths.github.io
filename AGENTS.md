# Agent Instructions

This repository is a personal blog and technical website built with [Jekyll](https://jekyllrb.com) and the [minima](https://github.com/jekyll/minima) theme. It contains posts about software engineering, Azure, developer tools, and outdoor adventures, published at [heaths.dev](https://heaths.dev).

## Directory structure

This is a [Jekyll](https://jekyllrb.com) site using the [minima](https://github.com/jekyll/minima) theme.

| Path          | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `_posts/`     | Blog posts in Markdown. This is where most content is authored.          |
| `_archive/`   | Archived articles (custom collection, output enabled).                   |
| `_layouts/`   | HTML layouts that wrap page content (`post.html`, `article.html`, etc.). |
| `_includes/`  | Reusable HTML partials (header, footer, social icons).                   |
| `_sass/`      | Sass partials for site styling (`palette.scss`, `custom.scss`).          |
| `_data/`      | Data files (e.g., `authors.yml`) accessible via `site.data`.             |
| `assets/`     | Static assets: stylesheets, images, and scripts.                         |
| `_config.yml` | Site-wide Jekyll configuration.                                          |
| `Gemfile`     | Ruby dependencies (Jekyll, plugins, theme).                              |
| `index.md`    | Home page content rendered with the `home` layout.                       |
| `about.md`    | About page.                                                              |
| `archive.md`  | Archive listing page.                                                    |

## Writing posts

Posts go in `_posts/` with filenames like `YYYY-MM-DD-title-slug.md`.

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
---
```

- **`summary`** — A short description (one or two sentences) of the post. This should be a YAML literal or folded string. Required for all posts.
- **`excerpt_separator`** — Set to `<!--more-->` only on posts that use that marker in their content body. Do not set globally.
- **`category`** and **`tags`** — Used for organization and rendered on post pages.
- **`atUri`** — AT Protocol URI linking the post to a Bluesky record. Never modify this field.

### Pre-commit check

Do not commit changes unless the user explicitly says to commit. Stage changes freely, but always wait for explicit approval before creating a commit.

Before committing, verify that every post in `_posts/` has a `summary` field in its front matter. If a post is missing one, generate a summary of one or two sentences based on the post content and add it to the front matter before the `category` field.

## Skills

After completing all requested changes, always run these skills in order on modified files before staging or committing:

1. **`check-spelling`** — Check and fix spelling in modified source files.
2. **`lint`** — Check modified files for common issues (e.g., code fence language names).
3. **`format`** — Format modified files with Prettier. Always run last, after all other changes are done.

| Skill            | Path                                     | Description                                                                                 |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| `new-post`       | `.github/skills/new-post/SKILL.md`       | Create a new blog post with the correct filename format, front matter, and required fields. |
| `check-spelling` | `.github/skills/check-spelling/SKILL.md` | Check and fix spelling in project source files using cSpell. Config: `.vscode/cspell.json`. |
| `format`         | `.github/skills/format/SKILL.md`         | Format changed files with Prettier. Run after all other changes are complete.               |
| `lint`           | `.github/skills/lint/SKILL.md`           | Lint project files for common issues. Run on new or changed files before committing.        |

## Building

```sh
bundle exec jekyll build
```

For production (enables minification and analytics):

```sh
JEKYLL_ENV=production bundle exec jekyll build
```

For local development with live reload:

```sh
bundle exec jekyll serve
```
