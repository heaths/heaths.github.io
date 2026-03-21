---
name: new-post
description: >
  Create a new blog post. Use this skill whenever the user asks to write, create,
  draft, or add a new blog post. This skill ensures the correct filename format,
  frontmatter structure, and required fields are present.
---

Create a new blog post in `_posts/`.

## Steps

1. Ask the user for missing required info: **title**, **category** (e.g., `tips`, `azure`, `general`), and **tags**.
2. Create `_posts/YYYY-MM-DD-title-slug.md` using the current date. Slug is the title lowercased, spaces to hyphens, special characters removed.
3. Add YAML frontmatter in this field order:
   - `title`
   - `date`: current date/time in RFC 3339 with local timezone offset.
   - `summary`: placeholder `>` block, or generate one if the user provided content.
   - `category`
   - `tags`: YAML list.
4. Include user-provided body content after the frontmatter.

## Example

```markdown
---
title: My Post Title
date: 2025-01-15T10:00:00-08:00
summary: >
  A one or two sentence description of the post.
category: tips
tags:
  - git
  - tip
---

Post content goes here.
```
