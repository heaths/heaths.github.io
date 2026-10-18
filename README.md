Source for <https://heaths.dev>

Built with [Hugo](https://gohugo.io/) and a local `minima` theme ported from Minima 2.5.2, including this site's custom templates, Sass, and interactive features.

## Development

Install Hugo 0.168.0 or later, [Dart Sass](https://gohugo.io/functions/css/sass/#dart-sass) (the standalone `sass` executable on `PATH`), and Node.js 24 or later.

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

Posts live in `content/posts/`; archived articles and their listing live in `content/archive/`. Create posts with `bin/new-post` (see the `new-post` skill). Existing content has explicit `url` front matter to preserve published `.html` URLs independently of titles and filenames. The post helper sets this field for new posts, and Sequoia uses the same field. Never modify existing `atUri` values.

Site metadata and menus are in `hugo.yaml`; author data is in `data/authors.yml`. The combined Minima theme is in `themes/minima/`. Hugo compiles its SCSS with Dart Sass to `/assets/main.css`; images and Sequoia scripts stay under `assets/` and are mounted at the same public URLs. `.well-known/` is mounted unchanged. Static mounts deliberately avoid publishing repository tools and configuration.

The home page uses Hugo pagination (10 posts per page) at `/page/2/`, with the previous navigation controls and sliding page-number window. Posts, ordinary pages, archive articles, redirects, `/feed.xml` (Atom), and `/sitemap.xml` retain their published paths. Taxonomy listing pages are disabled, as on the original site.

## Checks

```sh
npm test
```

This checks the post helper, builds the site, and checks published URLs, redirects, feed entries, internal links, AT Protocol discovery, and static assets. During migration, `python3 bin/check-site.py --baseline /path/to/jekyll-output` additionally compares the original post/page paths and Atom IDs.

See [CONTRIBUTING.md](CONTRIBUTING.md) for AT Protocol publishing.
