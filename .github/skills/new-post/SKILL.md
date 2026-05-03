---
name: new-post
description: >
  Create a new blog post. Use this skill whenever the user asks to write, create,
  draft, or add a new blog post. This skill ensures the correct filename format,
  front matter structure, and required fields are present.
---

Create a new blog post in `_posts/`.

## Steps

1. Ask for missing required info: **title**, **category**, and **tags**.
   - Known categories are in `_config.yml` under `categories`: `atproto`, `azure`,
     `general`, `rust`, `setup`, `sport`, `tips`, `troubleshooting`.
   - If no category was given, suggest the best match from the list based on content.
   - If the category isn't in the list, confirm with the user. If adding a new one,
     insert it alphabetically into `categories` in `_config.yml` first.
2. Create `_posts/YYYY-MM-DD-title-slug.md` (today's date; slug: lowercase, hyphens, no special chars).
3. Front matter fields in order: `title`, `date` (RFC 3339 with timezone), `summary` (`>` block), `category`, `tags` (list).
4. Append user-provided body content after the front matter.

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
