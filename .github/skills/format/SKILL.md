---
name: format
description: >
  Format changed files with Prettier. Run after all other changes in a prompt
  are complete.
---

After all changes in response to a prompt are complete, format modified files.

## Installation

If dependencies are missing, run `npm ci` from the repository root. Run tools using
`npm run`.

## Steps

1. Run `npm run prettier -- --write <changed-files...>` to format changed files.
   Go templates in the local Hugo theme use `prettier-plugin-go-template`.
   Use `--ignore-unknown` for extensionless support scripts; format `bin/new-post`
   separately with `--parser babel`.
