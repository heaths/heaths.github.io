---
name: new-post
description: >
  Create a new blog post. Use this skill whenever the user asks to write, create,
  draft, or add a new blog post. This skill ensures the correct filename format,
  front matter structure, and required fields are present.
---

Create a new blog post in `_posts/` by using `bin/new-post` instead of writing the
file manually. Prefer delegating to the script to reduce token usage and keep the
workflow consistent with the repository.

## Steps

1. Gather any obvious inputs from the user request and pass them to `bin/new-post`.
   - Supported flags are `--title`, `--date`, `--summary`, `--image`, `--category`,
     `--tag`/`--tags`, `--body`, and `--body-file`.
   - If the request already includes clear values, pass them directly instead of
     restating them or recreating the front matter yourself.
2. Let `bin/new-post` prompt for anything missing.
   - Required values are effectively **title**, **summary**, **category**, and
     **tags**.
   - `--date` is optional and defaults to the current date-time when omitted.
   - Known categories are in `_config.yml` under `categories`: `atproto`, `azure`,
     `general`, `rust`, `setup`, `sport`, `tips`, `troubleshooting`.
   - The script suggests a category when one is not provided, confirms new
     categories, updates `_config.yml` alphabetically when needed, and includes
     the category as a tag except for `general`.
3. For short content, prefer `--body`. For longer drafted content already available
   in a file, prefer `--body-file`.
4. The script creates `_posts/YYYY-MM-DD-title-slug.md`, writes front matter in the
   repository's expected order, and appends the body content.
5. Do **not** manually create the post file unless the script cannot be used.
6. Do **not** run `lint` or `format` on new posts — they are not necessary.

## Example

```sh
bin/new-post \
  --title "My Post Title" \
  --summary "A one or two sentence description of the post." \
  --image /assets/images/cover-image.jpg \
  --category tips \
  --tags git,tips \
  --body "Post content goes here."
```
