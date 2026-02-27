---
layout: post
title: Helix support for TypeSpec
date: 2024-08-02T16:19:04-07:00
excerpt_separator: <!--more-->
categories: tips
tags:
- azure
- typespec
- helix
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mfdr2as5lp2u"
---

You can add [TypeSpec](https://typespec.io) language support to [Helix](https://helix-editor.com) fairly easily. I've done this in my profile repo and you can copy the code. I hope to get this [added to Helix](https://github.com/helix-editor/helix) if they'll accept an up-and-comer.

<!--more-->

## Update

🎉 My [pull request](https://github.com/helix-editor/helix/pull/11412) was merged: TypeSpec is now supported out of the box in Helix! You still need to install the LSP as with any other supported language, but that's a single, simple command. See below, or in [their wiki](https://github.com/helix-editor/helix/wiki/Language-Server-Configurations#typespec).

## Background

I've been using [`vim`](https://www.vim.org) and before it `vi` for close to 30 years. I started my programming career in a terminal and, while I often enjoy GUI apps like [Visual Studio Code](https://code.visualstudio.com) and am more productive when touching lots of files, I still like the efficiency of a good terminal editor.

But `vim` is feeling rather dated. There's clearly a lot of cruft they have to support, and much of this seems to have carried over into [neovim](https://neovim.io). While neovim does support tree-sitter for LSP support and has a rich ecosystem, I thought I'd give another, fairly new editor a try: Helix.

Helix is a vim-like editor written in Rust and seems to be fairly popular with some other Rust developers. Given it doesn't have a long legacy to support, it seems worth a try at first. So far, I've been loving it. [Language support](https://github.com/helix-editor/helix/wiki/Language-Server-Configurations) is fairly easy to add and it supports a large number of languages out of the box, though you have to install the LSPs and perhaps other tools for some languages.

One language it's missing is [TypeSpec](https://typespec.io), which my team, the Azure SDK team, develops. It's also getting used by some third-parties, and since we're planning to generate source generation only from TypeSpec for the Azure SDKs for Rust, I'll be using it a lot more. It's also being reviewed more frequently by the Azure REST API Review Board, of which I'm a member.

## Installing the LSP

The TypeSpec LSP is contained in the [`@typespec/compiler`](https://npmjs.org/packages/@typespec/compiler), so all you need to do is install that globally (or otherwise discoverable in your `$PATH`):

```bash
npm install -g @typespec/compiler
```

## Configuring the grammar

You'll need to add some configuration to your `languages.toml` configuration file e.g., `~/.config/helix/languages.toml`:

```toml
use-grammars = { only = ["typespec"] }

[[grammar]]
name = "typespec"
source = { git = "https://github.com/happenslol/tree-sitter-typespec", rev = "af7a97eea5d4c62473b29655a238d4f4e055798b" }

[[language]]
name = "typespec"
language-id = "typespec"
scope = "source.typespec"
injection-regex = "(tsp|typespec)"
file-types = ["tsp"]
roots = ["tspconfig.yaml"]
auto-format = true
comment-token = "//"
block-comment-tokens = { start = "/*", end = "*/" }
indent = { tab-width = 2, unit = "  " }
language-servers = ["typespec"]

[language-server.typespec]
command = "tsp-server"
args = ["--stdio"]
```

### Compilation

Once that configuration is in place, you need to actually compile the parser. Helix has made that easy:

```bash
hg -g fetch
hg -g build
```

## Rich language support

Now that helix is configured to start and use the TypeSpec LSP for any files with a `.tsp` file extension with an ancestor `tspconfig.yaml` configuration file, you need to tell it what to do with that information.

To support syntax highlighting; selection of functions, arguments, models, etc.; and proper indentation, copy files from <https://github.com/heaths/helix/tree/main/runtime/queries/typespec> into the `runtime/queries/typespec` subdirectory of your helix configuration directory.

## Demo

What do you get after all that?

[![asciicast](https://asciinema.org/a/DvpTtI9bx9N0tQiMinM114t0a.svg)](https://asciinema.org/a/DvpTtI9bx9N0tQiMinM114t0a)
