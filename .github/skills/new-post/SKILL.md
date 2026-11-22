---
name: new-post
description: >
  Create a new blog post. Use this skill whenever the user asks to write, create,
  draft, or add a new blog post. This skill ensures the correct page bundle layout,
  front matter structure, and required fields are present.
---

Posts are Hugo page bundles created from the `archetypes/posts.md` archetype. The build
enforces the conventions below: it fails on a non-draft post with a missing or `TODO`
summary, a missing or unlisted category, or an `image` that isn't in the bundle. For
drafts, these are warnings.

## Steps

1. Derive the slug from the title: lowercase, words joined by hyphens, punctuation
   dropped (e.g., "I'm a Hugo user!" → `im-a-hugo-user`). The post is published at
   `/posts/<slug>/`.
2. Run `hugo new content posts/<slug>/index.md`. This sets `date` to now and fills in
   the front matter template.
3. Edit the new `content/posts/<slug>/index.md`:
   - **`title`**: the post title.
   - **`summary`**: one or two sentences, as a folded `>` string.
   - **`category`**: one of `params.categories` in `hugo.yaml`. If none fits, ask the
     user before adding a new one to that list (keep it sorted).
   - **`tags`**: relevant tags, including the category unless it is `general`.
   - **`image`** (optional): copy the cover image into the bundle and set
     `image: /posts/<slug>/<file>`. Otherwise delete the commented line.
   - Delete the `# Categories:` comment line.
   - Keep `draft: true` unless the user asks to publish.
   - Write the body after the front matter. Reference bundle images by filename and
     link to other posts as `../other-slug/index.md`.
4. Ask the user only for values they haven't given and that can't be inferred from
   the request or content.
5. Verify with `npm test`, or `hugo server -D` to preview a draft. Then run the
   repository's final quality pass: spelling, lint, then formatting.
