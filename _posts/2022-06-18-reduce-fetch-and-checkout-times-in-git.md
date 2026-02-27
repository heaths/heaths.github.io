---
title: Reduce fetch and checkout times in git
date: 2022-06-18T00:20:31-07:00
excerpt_separator: <!--more-->
category: tips
tags:
- git
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mfdr3dkfi322"
---

Some repos can be huge, like [Azure/azure-sdk-for-net](https://github.com/Azure/azure-sdk-for-net) (at the time this was written) due to a number of factors, like history, old binaries, or other large files. A repo could also have a relatively small history but a huge amount of files that take a very long time to check out. You can both reduce the time it takes to fetch such a repo and how long it takes to check out files.

<!--more-->

## Reduce how much you fetch

One way to reduce how much much you fetch is to fetch a single branch. For example, assuming your `upstream` and `origin` remotes are set to the primary repository and your fork respectively, it's rarely necessary to fetch more than the main branch e.g., `git fetch upstream main` to fetch just the `upstream` remote's `main` branch. This will avoid fetching any other branches and all the objects referenced by those branches, tags, etc. I take advantage of this in my [`git sync`](2021-08-30-git-sync-any-branch.md) alias, for example.

But if you often find yourself just running something like `git pull`, it's beneficial to set remote tracking refspecs in your configuration file to only those branches of interest.

If you open your _.git/config_ file from the root of your repo, you should see something like this somewhere:

```ini
[remote "upstream"]
    url = https://github.com/Azure/azure-sdk-for-net.git
    fetch = +refs/heads/*:refs/remotes/upstream/*
```

This means that any remote branches from `upstream` will be fetched if not specified explicitly. You can change that pattern and add more, for example:

```ini
[remote "upstream"]
    url = https://github.com/Azure/azure-sdk-for-net.git
    fetch = +refs/heads/main:refs/remotes/upstream/main
    fetch = +refs/heads/release/*:refs/remotes/upstream/release/*
```

This will fetch only `main` and any branch starting with `release/` from the `upstream` remote if no branch is specified explicitly.

If you work in a large team, this can save a lot of time if people are often pushing branches to a shared remote like your typical `upstream` remote.

### Shallow clones

Another way to reduce how much you fetch is to create a shallow clone:

```bash
git clone --depth=1 https://github.com/heaths/azure-sdk-for-net.git
cd azure-sdk-for-net
git remote add upstream https://github.com/Azure/azure-sdk-for-net.git
```

Note that none of the history prior to the cloned branch - often `main` for many repos - will not be fetched, nor will any objects those commits reference. This could affect some commands that depend on the history, though that's probably unlikely in most cases. Any commits after that time will continue to accrue, however.

You can run `git fetch --unshallow` at any time to restore full history. There are also ways you can make an existing repo a shallow clone, but by then you've already fetched the brunt of the repo. Given that fact, and that it's not straight forward, I'll not cover that now.

## Reduce how much you check out

When you run `git checkout {branch}` or similar, it checks out all files in the `HEAD` of that branch in your local repo. To limit how many files are checked out, you can either create a sparse clone or set up a sparse checkout on an existing repo.

### Sparse checkout when cloning

To create a sparse checkout when you initially clone, run the following command:

```bash
git clone --sparse https://github.com/heaths/azure-sdk-for-net.git
cd azure-sdk-for-net
git remote add upstream https://github.com/Azure/azure-sdk-for-net.git
```

By default, this creates a _.git/info/sparse-checkout_ file with the default content:

```gitignore
/*
!/*/
```

The file format is similar to _.gitignore_ but with the default [`cone` mode](https://github.com/git/git/blob/v2.37.0/Documentation/git-sparse-checkout.txt#L193-L282) you can only specify directories. This default value checks out any files - including dotfiles - directly under the repo root directory, but no subdirectories. You can use the `git sparse-checkout add` command to add patterns, but these will be merely appended to the end of the file. If you add a directory that already exists, it will be added to the end while the old entry/entries remain resulting in duplicates. `git sparse-checkout add` also checks out files immediately, so if you want to negate any paths beneath it may waste a bit of time.

Instead, I find it easier to just open _.git/info/sparse-checkout_ and modify it by hand. For example, in the repo I've been using as an example, I might want to only check out engineering system files and services I'm working on:

```gitignore
/*
!/*/
/.config/
/.vscode/
/common/
/eng/
/sdk/cognitivelanguage/
/sdk/keyvault/
```

After you make modifications, run `git sparse-checkout reapply` to affect changes.

#### Non-cone mode

Though the default content checks out all files under the root, it seems no other path can specify files when using `cone` mode. If you have files under a directory e.g., `sdk/*` that you need and want to negate the rest e.g., `!sdk/*/` you'll need to pass `--no-cone` to `git sparse-checkout set` along with all the patterns you want to enable; though, `git sparse-checkout set --no-cone` enables options to disable `cone` mode so you could still edit _.git/info/sparse-checkout_ by hand afterward.

```bash
git sparse-checkout set --no-cone '/*' '!/*/' '/.config' '/.vscode' '/common' '/eng' '/sdk/*' '!/sdk/*/' '/sdk/cognitivelanguage' '/sdk/keyvault'
git sparse-checkout reapply
```

### Converting an existing repo to sparse checkouts

If you have already cloned a repo, you can create a sparse checkout by running `git sparse-checkout set`. Optionally it can take patterns on the command line or from stdin with `--stdin`, but I still personally find manually editing the _.git/info/sparse-checkout_ file afterward is easier.

Note that if you use worktrees - another way to reduce how much you fetch if you need multiple clones of a single repository - `git sparse-checkout set` will create worktree-specific configuration to avoid adversely affecting other worktrees.

## Combining

You can, of course, combine both approaches to really trim how much you fetch and checkout:

```bash
git clone --depth=1 --sparse https://github.com/heaths/azure-sdk-for-net.git
cd azure-sdk-for-net
git remote add upstream https://github.com/Azure/azure-sdk-for-net.git
```

You can even do this with the [GitHub CLI](https://github.com/cli/cli), which conveniently clones your fork (if any, which is recommended) as `origin` and the `upstream` automatically:

```bash
gh repo clone azure-sdk-for-net -- --depth=1 --sparse
```

## History

* 2022-11-09 - Updated now that [non-`cone` mode is deprecated](https://github.blog/2022-06-27-highlights-from-git-2-37/#tidbits).
