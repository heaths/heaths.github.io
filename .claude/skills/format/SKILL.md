---
name: format
description: Format modified files with Prettier (final checks, last step).
---

Run `npm run prettier -- --write --ignore-unknown <files>` (run `npm ci` first if needed). Go templates use `prettier-plugin-go-template`. `.prettierignore` excludes `archetypes/`, whose Go templates in YAML Prettier would break. If a file changes afterward, format only that file.
