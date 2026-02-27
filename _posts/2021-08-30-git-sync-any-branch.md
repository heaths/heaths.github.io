---
title: git sync any branch
date: 2021-08-30 19:40:00 -07:00
excerpt_separator: <!--more-->
categories: tips
tags:
- git
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mfdr2awkp527"
---

Sometime ago I [blogged about `git sync`](2020-05-29-git-sync.md), an alias I created to concisely pull the upstream repo's main branch, push that branch to my origin fork, and fetch origin branches to determine which branches have been deleted - likely from merged pull requests. As many repos I work in have changed from `master` to `main`, not all of them have yet. Some also use `trunk` which, personally, I like better but is less common than `main`.

<!--more-->

Rather than separate aliases for each common main branch and given that shell aliases are processed by a linux shell - most often bash - we can use default argument values to run either of the following:

```bash
git sync
git sync trunk
```

Simply run the following command to set the alias to sync `main` by default, or whichever branch name was specified:

```bash
git config --global alias.sync '!git pull -p --ff-only upstream ${1:-main} && git push origin ${1:-main} && git fetch -p origin'
```
