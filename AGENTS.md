# Agent Instructions

This repository is a personal blog and technical website built with [Jekyll](https://jekyllrb.com) and the [minima](https://github.com/jekyll/minima) theme. It contains posts about software engineering, Azure, developer tools, and outdoor adventures, published at [heaths.dev](https://heaths.dev).

## Directory structure

This is a [Jekyll](https://jekyllrb.com) site using the [minima](https://github.com/jekyll/minima) theme.

| Path | Description |
|---|---|
| `_posts/` | Blog posts in Markdown. This is where most content is authored. |
| `_archive/` | Archived articles (custom collection, output enabled). |
| `_layouts/` | HTML layouts that wrap page content (`post.html`, `article.html`, etc.). |
| `_includes/` | Reusable HTML partials (header, footer, social icons). |
| `_sass/` | Sass partials for site styling (`palette.scss`, `custom.scss`). |
| `_data/` | Data files (e.g., `authors.yml`) accessible via `site.data`. |
| `assets/` | Static assets: stylesheets, images, and scripts. |
| `_config.yml` | Site-wide Jekyll configuration. |
| `Gemfile` | Ruby dependencies (Jekyll, plugins, theme). |
| `index.md` | Home page content rendered with the `home` layout. |
| `about.md` | About page. |
| `archive.md` | Archive listing page. |

## Writing posts

Posts go in `_posts/` with filenames like `YYYY-MM-DD-title-slug.md`.

When the user asks to write, create, draft, or add a new blog post, use the skill defined in `.github/skills/new-post/SKILL.md`. This skill ensures the correct filename format, frontmatter structure, and required fields are present.

### Frontmatter

Every post must have YAML frontmatter. Example:

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

### Pre-commit check

Before committing, verify that every post in `_posts/` has a `summary` field in its frontmatter. If a post is missing one, generate a summary of one or two sentences based on the post content and add it to the frontmatter before the `categories` field.

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
