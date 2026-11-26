# Contributing

## Prerequisites

- [Hugo](https://gohugo.io/installation/) 0.170.0 or later.
- [Node.js](https://nodejs.org/) 24 or later. Then install the remaining tools:

  ```sh
  npm ci
  ```

### Linux and macOS

With [Homebrew](https://brew.sh), install Hugo:

```sh
brew install hugo
```

## Prepublish

Use `hugo new content posts/<slug>/index.md` to create a page bundle in
`content/posts/<slug>/`; remove `draft: true` when it's ready to publish. The bundle
directory name determines the published path, `/posts/<slug>/`, for both Hugo and
Sequoia (`pathTemplate` in `sequoia.json`). If you rename a published bundle, add
its old path to `aliases`. Keep existing `atUri` fields and aliases unchanged.

## Publish

Open a pull request with the new or changed posts and enable auto-merge. That's it:

1. The `atproto` check fails while any post is unpublished, so the pull request can't
   merge yet. The run summary lists what will be published.
2. Once `build` passes and auto-merge is enabled, in either order, the
   [Publish to ATProto](.github/workflows/sequoia.yml) workflow publishes the posts to
   your PDS and Bluesky, then pushes a commit with the updated `.sequoia-state.json`
   and any new `atUri` front matter.
3. Checks pass on that commit, the pull request merges, and the site deploys.

Readers who follow the Bluesky link before the site deploys get a 404 for a minute
or two; the Bluesky card itself renders right away. Bluesky posts are only created
for posts dated within the last 7 days.

To preview without publishing, run the workflow manually on any branch. Leave
**dry-run** checked.

### Publish manually

Build the production site with Hugo before publishing:

```sh
npm run build
```

The compiled site is in `public/`. The `sequoia.json` paths point to the Hugo
content and output directories; generated Sequoia UI modules remain in
`assets/scripts/` so they are available at their existing URLs.

Then authenticate with your ATProto PDS if you haven't already:

```sh
npm run sequoia auth
# or
npx sequoia auth
```

After building the site, publish content to ATProto:

```sh
npm run sequoia publish
# or
npx sequoia publish
```

Finally, inject the required link tags into the built HTML:

```sh
npm run sequoia inject
# or
npx sequoia inject
```

For full publishing documentation, see <https://sequoia.pub/publishing>.
