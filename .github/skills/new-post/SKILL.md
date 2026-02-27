---
name: new-post
description: >
  Create a new blog post. Use this skill whenever the user asks to write, create,
  draft, or add a new blog post. This skill ensures the correct filename format,
  frontmatter structure, and required fields are present.
---

Create a new blog post in the `_posts/` directory.

## Steps

1. Ask the user for any missing required information:
   - **Title**: The post title.
   - **Category**: A single category for the post (e.g., `tips`, `azure`, `general`).
   - **Tags**: One or more tags as a list.

2. Create the file in `_posts/` using the current date for the filename:
   - Format: `_posts/YYYY-MM-DD-title-slug.md`
   - The slug should be the title lowercased with spaces replaced by hyphens and special characters removed.

3. Add YAML frontmatter with the following fields in this order:
   - `title`: The post title.
   - `date`: The current date and time in RFC 3339 format with the local timezone offset (e.g., `2025-01-15T10:00:00-08:00`).
   - `summary`: Leave as a placeholder `>` block for the user to fill in, or generate one if the user provided post content.
   - `category`: The single category.
   - `tags`: A YAML list of tags.

4. If the user provides content for the post body, include it after the frontmatter.

## Example output

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
