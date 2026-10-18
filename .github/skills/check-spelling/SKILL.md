---
name: check-spelling
description: Check and fix spelling with cSpell during the final quality pass, after all other work is done.
---

Run only at the end of the task, after implementation, content, documentation, and applicable functional verification are complete. Follow the final quality pass in `AGENTS.md`: spelling, lint, then formatting. Honor user-specified exclusions.

Reuse successful results from this session if the relevant files have not changed. Do not rerun spelling merely because the user requests staging or committing.

## Installation

If dependencies are missing, run `npm ci` from the repository root. Run tools using
`npm run`.

## Configuration

Config file: `.vscode/cspell.json`. Always pass `--config .vscode/cspell.json`.

## Check spelling

Run `npm run cspell -- <changed-files...>` on modified files that still need
checking. Check the full tree only when explicitly requested.

## Fix spelling

Show misspellings to the user. Prompt which words to replace. Add remaining words to the dictionary.

- **Dictionary**: add words to the `words` array in `.vscode/cspell.json`.
- **Overrides**: if misspellings only appear in files matching an `overrides[].filename` glob, add words to that override's `words` array.
- **Inline ignores**: for seldom-used words, add a comment in the file (e.g., `// cspell:ignore <word>`).

## Testing

After fixing spelling or updating the dictionary, recheck only the affected files.
Do not repeat a successful check on unchanged files or restart the entire quality pass.
