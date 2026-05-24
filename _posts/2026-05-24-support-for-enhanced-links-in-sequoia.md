---
title: Support for enhanced links in Sequoia
date: 2026-05-24T00:08:57-07:00
summary: >
  Support for enhanced links is coming to Sequoia.
category: atproto
tags:
  - atproto
  - sequoia
  - bluesky
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mmlhgo33nj25"
---

[Bluesky](https://bsky.app) is [adding support for enhanced links](https://github.com/bluesky-social/atproto/discussions/4978) for [Standard.site](https://standard.site) publications.

[Sequoia](https://sequoia.dev) already embeds `site.standard.document` images into optional Bluesky posts,
but once [#64](https://tangled.org/stevedylan.dev/sequoia/pulls/64) is merged and a new version is released, Sequoia will embedd `associatedRefs` for both the document and publication.

## Custom layout

Sequoia can [inject](https://sequoia.pub/verifying#document-verification) `<link>` tags into static HTML pages, but for some sites like mine using a custom path template, you might need to add links to your `<head>` template yourself.

For ease, I added my publication URI to Jekyll's `_config.yml`:

```yml
sequoia:
  publication_url: at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.publication/3meddhkrg5z2p
```

Then in `_includes/head.html` I added:

```html
{% raw %}
<head>
  <!-- ... -->
  {%- if page.atUri %}
  <link rel="site.standard.document" href="{{ page.atUri }}" />
  {%- endif %}
  <link
    rel="site.standard.publication"
    href="{{ site.sequoia.publication_url }}"
  />
</head>
{% endraw %}
```
