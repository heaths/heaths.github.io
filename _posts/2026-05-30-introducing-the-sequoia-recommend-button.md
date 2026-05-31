---
title: Introducing the sequoia-recommend button
date: 2026-05-30T22:19:15-07:00
summary: >
  The sequoia-recommend button lets readers recommend your Sequoia posts directly from your site using their Bluesky account.
image: /assets/images/sequoia-recommend.jpg
category: atproto
tags:
  - atproto
  - javascript
  - sequoia
  - standard-site
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mn4upg7a4z2h"
---

[Sequoia](https://sequoia.pub) version 0.5.7 adds a new component to the existing `sequoia-subscribe` script:

```html
<sequoia-recommend></sequoia-recommend>
```

This adds a new button with a heart, star, or thumbs up SVG image that will create a [site.standard.graph.recommend](https://standard.site/docs/lexicons/recommend/) record that can be shared across sites like [leaflet.pub](https://leaflet.pub), [pckt.blog](https://pckt.blog), and more. <!-- cspell:ignore pckt -->

![Screenshot of new Recommend button along with existing Comment button]({{ page.image }}){: .cover-image}

The `sequoia-recommend` component is [defined](https://tangled.org/stevedylan.dev/sequoia/pulls/77) in the existing `sequoia-subscribe.js` file because it shares a lot in common with the `sequoia-subscribe` button I [added previously](https://tangled.org/stevedylan.dev/sequoia/pulls/25). I didn't want to change the file name and break compatibility, but did refactor it to avoid duplication despite being in the same file.

Leaflet was, up until recently, creating `pub.leaflet.interactions.recommend` records but now is creating `site.standard.graph.recommend` records. It still seems to support enumerating the latter for compatibility.

## Customization

Like `sequoia-subscribe`, it will discover the `site.standard.document` from a `<link rel="site.standard.document">` element or you can specify it. It also supports limited CSS styling via the `container` part e.g.,

```css
sequoia-recommend::part(container) {
  /* ... */
}
```

For more information about customizing the Recommend button, see [sequoia.pub](https://sequoia.pub/recommend).
