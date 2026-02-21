---
title: Add aliases to GitHub CLI from stdin
date: 2021-05-19 16:15:30 -07:00
excerpt: Add multiline aliases or aliases with mixed quotes easily with gh version 1.10.
categories: tips
tags:
- github
- git
- productivity
- tips
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mfdr2ayput2b"
---
With the [GitHub CLI](https://github.com/cli/cli) before 1.10 as described originally in [gh user](2021-04-21-gh-user.md), adding aliases with multiple lines or mixed quotes could be difficult. After some time I found it easier and faster just to open *~/.config/gh/config.yml* and write the YAML string literal manually. Starting with `gh` version 1.10, my [PR](https://github.com/cli/cli/pull/3490) makes that even easier in bash using a herestring as an example:

```bash
gh alias set -s hello - << 'EOF'
echo "Hello, \e[32m$USER\e[0m!"
EOF
```

> Note: putting EOF in quotes disables variable expansion, command substitution, and more.

You can use herestrings in PowerShell as well, shown here using a literal herestring to also avoid variable expansion:

```powershell
@'
echo "Hello, \e[32m$USER\e[0m!"
'@ | gh alias set -s hello -
```

In both cases, shell commands are executed in `sh` that is installed with `git`.

You can just as easily use files for input. If you have a file named command.txt with a complicated GraphQL expression, for example, you could import it into an alias named `user` like so:

```bash
cat command.txt | gh alias set user -
```

`gh` aliases can be very useful - especially for `gh api` - and I hope this makes them a little easier to set.
