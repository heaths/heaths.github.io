# Contributing

## Prepublish

Before publishing, make sure you have the required tools installed:

```sh
npm i
```

Use `hugo new content posts/<slug>/index.md` to create a page bundle in
`content/posts/<slug>/`; remove `draft: true` when it's ready to publish. The bundle
directory name determines the published path, `/posts/<slug>/`, for both Hugo and
Sequoia (`pathTemplate` in `sequoia.json`). If you rename a published bundle, add
its old path to `aliases`. Keep existing `atUri` fields and aliases unchanged.

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
