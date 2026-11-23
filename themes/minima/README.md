# Minima for Hugo

A local Hugo port of [Jekyll Minima 2.5.2](https://github.com/jekyll/minima/tree/v2.5.2), combining its base/page layouts and Sass with the heaths.dev customizations. The upstream MIT license is in `LICENSE.txt`. This is not an official Minima release.

The theme contains the Go templates, Sass sources, social icon sprite, search/theme scripts, and shortcodes. Site-specific metadata, author data, publication settings, and content remain in the project. Set `theme: minima` in `hugo.yaml`. Requires Hugo 0.168.0 or later and Dart Sass on `PATH`.

`assets/sass/main.scss` retains the original palette → Minima → custom → syntax-highlighting order. Hugo compiles it with Dart Sass to `/assets/main.css`. Chroma class-based highlighting uses the existing light/dark token palette, with additional wrapper styles for Hugo's code blocks.

The `image`, `image-grid`, and `youtube` shortcodes preserve the site's image classes and video markup. Heading and link render hooks retain heading anchors and resolve Markdown source links to published URLs. The Atom template preserves `/feed.xml` and legacy entry IDs.
