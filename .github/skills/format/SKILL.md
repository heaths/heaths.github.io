---
name: format
description: >
  Format changed files with Prettier. Run after all other changes in a prompt
  are complete.
---

Run only at the very end of the task, after implementation, content, documentation, applicable functional verification, spelling, and lint are complete. Format modified files as the last step of the final quality pass in `AGENTS.md`, not after intermediate edits.

Reuse successful formatting results from the session when the relevant files have not changed. Do not rerun Prettier merely because the user requests staging or committing. If a file changes afterward, format only that file; do not restart the entire quality pass.

## Installation

If dependencies are missing, run `npm ci` from the repository root. Run tools using
`npm run`.

## Steps

1. Run `npm run prettier -- --write <changed-files...>` to format changed files.
   Go templates in the local Hugo theme use `prettier-plugin-go-template`.
   Use `--ignore-unknown` for extensionless support scripts; format `bin/new-post`
   separately with `--parser babel`.
