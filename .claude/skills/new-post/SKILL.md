---
name: new-post
description: Create a new blog post. Use whenever the user asks to write, create, draft, or add a blog post.
---

The build fails on a non-draft post with a missing or `TODO` summary, a missing category or one not listed in `hugo.yaml`, or an `image` that isn't in the bundle. For drafts these are warnings.

1. Derive the slug from the title: lowercase, hyphens between words, punctuation dropped ("I'm a Hugo user!" → `im-a-hugo-user`).
2. Run `hugo new content posts/<slug>/index.md`. This sets `date` and fills in `archetypes/posts.md`.
3. Edit `content/posts/<slug>/index.md`:
   - `title`;
   - `summary`: one or two sentences as a folded `>` string;
   - `category`: one of `params.categories` in `hugo.yaml`. If none fits, ask before adding one (keep the list sorted);
   - `tags`: include the category unless it's `general`;
   - `image` (optional): copy the file into the bundle and set `/posts/<slug>/<file>`; otherwise delete the commented line;
   - delete the `# Categories:` comment;
   - keep `draft: true` unless the user asks to publish;
   - write the body; reference images by filename and link posts as `../other-slug/index.md`.
4. Ask only for values the user hasn't given and that can't be inferred.
5. Verify with `npm test`, or preview a draft with `hugo server -D`. Then run the final checks.
