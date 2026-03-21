---
name: check-spelling
description: Check and fix spelling in project source files using cSpell
---

## Installation

Run `npm i` from the repository root to install dependencies. Run tools using `npx`.

## Configuration

Config file: `.vscode/cspell.json`. Always pass `--config .vscode/cspell.json`.

## Check spelling

Run `npx cspell lint [options] [globs...]` to check file globs or `.` for the full tree.

## Fix spelling

Show misspellings to the user. Prompt which words to replace. Add remaining words to the dictionary.

- **Dictionary**: add words to the `words` array in `.vscode/cspell.json`.
- **Overrides**: if misspellings only appear in files matching an `overrides[].filename` glob, add words to that override's `words` array.
- **Inline ignores**: for seldom-used words, add a comment in the file (e.g., `// cspell:ignore <word>`).

## Testing

Re-run the same lint command. All misspellings should be resolved.
