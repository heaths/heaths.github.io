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

Don't edit vendored files unless the repository owner explicitly asks, even to fix CI or review comments: `assets/scripts/sequoia-*.js` (Sequoia) and `themes/minima/assets/css/tokens.css` (generated from the design system's `tokens.json`: `npm run tokens -- <tokens.json>`).

## Posts

To write a post, use the `new-post` skill. Posts publish at `/posts/<slug>/`. Reference bundle images by filename and give them a shadow: `{{< image src="cover.jpg" alt="Alt" class="shadow-md" >}}`; add `webp="cover.webp"` when a WebP version exists. Use `image-grid` for galleries. Link to other posts as `../other-slug/index.md`. The build fails on posts that break the rules below.

### Image shadows

The `image` shortcode always adds `post-image` (block, centered, `radius-md` corners) and appends `class`. Add one `shadow-*` class (tokens in `tokens.css`, classes in `site.css`); don't write `post-image` yourself. Size it to the image as rendered (the content column is 800px; check pixels with `sips -g pixelWidth -g pixelHeight`):

| Image                                                                            | Class       |
| -------------------------------------------------------------------------------- | ----------- |
| Rendered width under 320px: headshots, avatars, thumbnails, `align-right` floats | `shadow-sm` |
| 320px and wider: photos, screenshots, covers in the post body                    | `shadow-md` |
| Transparent background (PNG/SVG/WebP with see-through edges), logos, badges      | none        |
| Floating layers only (menus, dialogs, a lightbox); never an image in the body    | `shadow-lg` |

- One class per image. Don't add a border or stack shadows.
- `hasAlpha: yes` doesn't mean transparent; check the corner pixels.
- `image-grid` images get no shadow.
- Captions: add `caption="…"` (Markdown allowed) to the `image` shortcode. It wraps the image in `<figure class="figure">` with a `<figcaption>` (`text-small`, `ink-muted`, centered). Keep the `shadow-*` class on the image, never the figure, so the caption sits outside the shadow.

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

## ATProto publishing

`.github/workflows/sequoia.yml` runs `sequoia publish` from pull requests, before merge; the site doesn't need to be live because Bluesky renders the card from PDS records.

- Triggers: `pull_request` (`opened`, `synchronize`, `reopened`, `auto_merge_enabled`), `workflow_run` of `hugo.yml` (`Deploy Hugo site to Pages`; only the copy on `main` runs), and `workflow_dispatch` with `dry-run` (default `true`).
- `resolve`: finds the pull request and runs `sequoia publish --dry-run` with placeholder credentials (dry runs never sign in). Pending detection greps the CLI output for `Nothing to publish` and `Dry run complete`; recheck both strings when upgrading `sequoia-cli`.
- `atproto`: the required status check in the `Require checks` ruleset; fails while any post is unpublished. It must never be skipped on a run whose checks attach to a pull request head, because a skipped required check passes.
- `publish`: only when the pull request is open, not from a fork, authored by the repository owner, has auto-merge enabled, and `build` succeeded on its current head (or a manual run with `dry-run` off). Uses environment `atproto`: variable `ATP_IDENTIFIER` and secret `ATP_APP_PASSWORD`. Uploads the diff of `.sequoia-state.json` and `content/posts` as artifact `sequoia-patch`, even after a partial failure.
- `commit`: applies the patch and pushes to the pull request branch using a GitHub App token (repository variable `BOT_APP_CLIENT_ID`, secret `BOT_APP_PRIVATE_KEY`) so the push triggers checks; `GITHUB_TOKEN` pushes don't. Never force-pushes.
- Concurrency: runs that can publish are serialized per branch and never cancelled, so PDS records are always committed to state before the next run checks it. Losing a state update would create duplicate records and Bluesky posts.
- `sequoia publish` writes `atUri` into a new post's front matter, which `themes/minima/layouts/_partials/head.html` renders as the `site.standard.document` link tag. Don't hand-edit `.sequoia-state.json`.

## Commits

Don't stage or commit unless asked. Before committing, make sure every `content/posts/*/index.md` has a `summary`. If one is missing, write one or two sentences from the post and add it before `category`. Do that before the final checks.

## Final checks

Once all other work is done (implementation, content, docs, and functional verification), run the `check-spelling`, `lint`, then `format` skills (in `.claude/skills/`, mirrored at `.github/skills/`). Run them only on modified files and honor user exclusions. Don't run them mid-task or rerun passing checks on unchanged files, including before committing. After a fix, recheck only the affected files with that tool, and rerun only the affected functional verification.

## Building

Requires Hugo and Node.js (`npm ci`). Use `npm run dev` to preview. `npm test` runs the production build plus the `node:test` checks in `bin/check-site.test.mjs`.
