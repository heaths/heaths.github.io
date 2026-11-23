---
name: check-spelling
description: Check and fix spelling in modified files with cSpell (final checks, step 1).
---

Run `npm run cspell -- <files>` (uses `.cspell.json`; run `npm ci` first if needed). Check the full tree only when asked.

Show misspellings and ask which to replace. Add the rest to `.cspell.json`:

- `words` for general terms;
- the matching `overrides[].words` when they only occur in files matching that entry's `filename`;
- an inline `cspell:ignore <word>` comment for rarely used words.

Then recheck only the affected files.
