# Minima for Hugo

A local Hugo port of [Jekyll Minima 2.5.2](https://github.com/jekyll/minima/tree/v2.5.2), combining its base/page layouts and styles with the heaths.dev customizations. The upstream MIT license is in `LICENSE.txt`. This is not an official Minima release.

The theme contains the Go templates, CSS, social icon sprite, search/theme scripts, and shortcodes. Site-specific metadata, author data, publication settings, and content remain in the project. Set `theme: minima` in `hugo.yaml`. Requires Hugo 0.168.0 or later.

`assets/css/main.css` imports `tokens.css`, `site.css`, then `syntax.css`. The `stylesheet.html` partial bundles them with Hugo's `css.Build` and publishes it fingerprinted as `/assets/main.<hash>.css`. The styles are plain CSS with native nesting and custom properties; there's no Sass step.

`tokens.css` is the generated export of the site's design system, copied unchanged. To update colors, type, spacing, or radii, replace it with a newer export instead of editing it. It switches to dark colors on `html[data-theme="dark"]`, so the inline script in `head.html` always sets `data-theme` from the saved choice or the system preference. For visitors without JavaScript, `stylesheet.html` copies the dark block out of `tokens.css` into a `prefers-color-scheme: dark` fallback at build time, so a new export needs no other change; the build fails if that block can't be found. `site.css` holds everything the design system doesn't define, such as hover colors and Sequoia variables, and `syntax.css` holds Chroma's GitHub light and dark colors. Both use `light-dark()`, so they follow `color-scheme` with or without JavaScript.

The `image`, `image-grid`, and `youtube` shortcodes preserve the site's image classes and video markup. Heading and link render hooks retain heading anchors and resolve Markdown source links to published URLs. The Atom template preserves `/feed.xml` and legacy entry IDs.
