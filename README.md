Source for <https://heaths.dev>

Built with [Hugo](https://gohugo.io/) and a local `minima` theme ported from Minima 2.5.2, including this site's custom templates, CSS, and interactive features.

## Development

Install Hugo 0.170.0 or later and Node.js 24 or later.

```sh
npm ci
npm run dev
```

The development server uses port 4000. To build production output in `public/`:

```sh
npm run build
```

Hugo also runs directly with `hugo --minify` or `hugo server --port 4000`. Ruby and Jekyll are no longer needed.

## Content and theme

Posts are page bundles in `content/posts/<slug>/index.md`, with their images alongside, and are published at `/posts/<slug>/`. Archived articles and their listing live in `content/archive/`. Create posts with `hugo new content posts/<slug>/index.md`, which uses `archetypes/posts.md`. Builds fail on non-draft posts that lack a summary, use a category missing from `params.categories`, or name an `image` that isn't in the bundle. Posts migrated from Jekyll list their original date-based `.html` URLs in `aliases`, which Hugo publishes as redirect pages. The first alias also keeps Atom entry IDs stable. Never modify existing `atUri` values.

Site metadata and menus are in `hugo.yaml`; author data is in `data/authors.yml`. The combined Minima theme is in `themes/minima/`. Hugo bundles its CSS to `/assets/main.css`; shared images and Sequoia scripts stay under `assets/` and are mounted at the same public URLs. `.well-known/` is mounted unchanged. Static mounts deliberately avoid publishing repository tools and configuration.

The home page uses Hugo pagination (10 posts per page) at `/page/2/`, with the previous navigation controls and sliding page-number window. Ordinary pages, archive articles, `/feed.xml` (Atom), and `/sitemap.xml` retain their published paths, and old post URLs redirect to the new ones. Taxonomy listing pages are disabled, as on the original site.

## Checks

```sh
npm test
```

This builds the site, including front matter validation, then runs `node:test` checks (`bin/check-site.test.mjs`) on published URLs, redirects, feed entries, internal links, AT Protocol discovery, and static assets.

See [CONTRIBUTING.md](CONTRIBUTING.md) for AT Protocol publishing.
