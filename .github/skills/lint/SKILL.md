---
name: lint
description: >
  Lint project files for common issues. Run on new or changed files before
  committing.
---

Lint new or changed files for common issues.

## Checks

### Code fence languages in Markdown

In Markdown files, code fences must use `powershell` instead of `pwsh`.

- Find: `` ```pwsh ``
- Replace with: `` ```powershell ``
