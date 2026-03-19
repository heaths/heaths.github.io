# Contributing

## Prepublish

Before publishing, make sure you have the required tools installed:

```sh
npm i
```

Then authenticate with your ATProto PDS if you haven't already:

```sh
npm run sequoia auth
# or
npx sequoia auth
```

After building the site, inject the required link tags into the built HTML:

```sh
npm run sequoia inject
# or
npx sequoia inject
```

Finally, publish content to ATProto:

```sh
npm run sequoia publish
# or
npx sequoia publish
```

For full publishing documentation, see <https://sequoia.pub/publishing>.
