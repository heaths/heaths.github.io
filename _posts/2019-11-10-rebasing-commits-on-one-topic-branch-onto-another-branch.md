---
layout: post
title: Rebasing commits on one topic branch onto another branch
author: Heath Stewart
date: 2019-11-10 16:33:00 -08:00
categories: tips
tags:
- git
- github
- tip
---

Rebasing commits on one topic branch onto another topic branch is a great way to stay productive while waiting for pull requests to be reviewed. Even if subsequent commits are made to the original topic branch, you can still create a subsequent PR with only intended changes.

When you're working in a team and everyone is busy, it's not uncommon to wait for PRs
to be reviewed. You want to continue working, but really need those changes in the topic branch
you're requesting to merge. You create a topic branch from that branch, do some work, and are
ready to submit another code review. Hopefully, by that time, your other PR has been reviewed.

In a lot of repositories to keep histories linear and clean, by some developers' standard, squash
or rebase merge strategies are required. So when you merge that PR, its history has been rewritten.
That means you're new topic branch - the one you created from the original topic branch - has diverged
from your development branch e.g. master.

You could simply submit your changes as-is, since any differences between topic branch should match
with what you just merged; however, what if you made changes on top of your original topic branch?

For example:

```shell
$ git branch
  master
* feature1
$ git checkout -b feature2
$ # commit some changes on feature2
$ git checkout feature1
$ # commit some changes on feature1
$ # push changes and merge; now feature2 has an old history of feature1
$ git checkout feature2
```

You still just want to push changes made after all the commits to feature1. This is where `git rebase --onto`
comes in handy. It allows you to take the commits made since one branch and map those onto another branch,
e.g. master.

Let's assume you haven't pruned your local topic branches, such that feature1 still tracks commits
prior to merging and rewriting their history. If not, you can use `git log` to find the commit
where you diverged based on its commit message, timestamp, etc.

```shell
$ git branch
  master
  feature1
* feature2
$ git rebase --onto master feature1
$ git branch -D feature1
```

This finds the common ancestor of feature1 and feature2, takes all the commits since then,
and replays them atop master.

Now you can push your branch (or `git push --force` if you already pushed) and get a code review
without forcing reviewers to re-review what they already reviewed. I'm sure they'll appreciate it.
