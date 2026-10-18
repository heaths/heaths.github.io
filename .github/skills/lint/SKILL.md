---
name: lint
description: >
  Lint modified files during the final quality pass, after all other work is done
  and before formatting.
---

Lint new or changed files for common issues only at the end of the task, after implementation, content, documentation, and applicable functional verification are complete. Follow `AGENTS.md`: spelling, lint (including Markdown lint when applicable), then formatting.

Reuse successful results from the session when the relevant files have not changed. A request to stage or commit does not require rerunning lint. If a fix is needed, recheck only affected files with the relevant lint check rather than restarting the entire quality pass.

## Checks

### Code fence languages in Markdown

In Markdown files, code fences must use `powershell` instead of `pwsh`.

- Find: ` ```pwsh `
- Replace with: ` ```powershell `
