---
title: Getting back to a good state in Git
date: 2020-09-24 08:00:00 -07:00
categories: tips
tags:
- git
- tip
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mfdr2b4qig2x"
---

I was helping a colleague the other day after they merged the `master` branch into their older topic branch, which brought along a lot of other commits and made the pull request on [GitHub](https://github.com) huge - too many files to even review in full on GitHub or in [Visual Studio Code](https://code.visualstudio.com). I commented that instead, rebasing onto `master` (or whatever branch you want to merge) is cleaner. First, however, you have to get back to a good state.

<!--more-->

*Note: if multiple people are working against a feature branch, you should simply merge master into the feature branch while your feature team works on topic branches targeting the feature branch. Rebasing the feature branch on your trunk e.g. `master` will make it difficult for anyone else to merge into the feature branch. You can rebase or squash the feature branch when ready to merge to your trunk.*

After over a decade using Git, it seems half of knowing Git is how to get back to a good state!

`git revert` won't do it since it just replays your specified commit(s) in "reverse", i.e. it inverts the patch and commits it to the repo. There are several other ways, however.

## Setting up

Before we can get into a good state, we have to put ourselves into a bad state.

1. Create a new repo:

   ```bash
   mkdir test-repo
   cd test-repo
   git init
   ```

2. Commit your first change:

   ```bash
   echo "a" >> readme.txt
   git add -A
   git commit -am "a"
   ```

3. Create your topic branch. We'll check out this branch later.

   ```bash
   git branch topic
   ```

4. Commit a few more changes to your trunk to simulate ongoing work:

   ```bash
   echo "b" >> readme.txt
   git commit -am "b"
   echo "c" >> readme.txt
   git commit -am "c"
   ```

5. Check out your topic branch and commit a couple changes to it:

   ```bash
   git checkout topic
   echo "1" >> readme.txt
   git commit -am "1"
   echo "2" >> readme.txt
   git commit -am "2"
   ```

6. Now lets mess it up by merging your trunk e.g. `master`:

   ```bash
   git merge master
   ```

   You'll end up with merge conflicts. I suggest ordering numbers after letters to simulate how you want your topic branch's commits to end up, but it really doesn't matter. After resolving the conflicts, add the file and commit:

   ```bash
   git commit -am "Merge branch 'master' into topic"
   ```

7. Before we explore options to get back to your topic branch before you merged, create a couple branches to save this commit graph:

   ```bash
   git branch option1
   git branch option2
   ```

Now let's explore options to get back to a good state.

## Option 1: Reset before your merge

If you haven't made any subsequent changes since merging, `git reset` can be a simple, effective way to get back to a good state. Note, however, that if you have made changes this will cause them to be lost (`git reflog` may help restore them, but that's another topic).

1. Check out the `option1` branch we created earlier that is in the bad state:

   ```bash
   git checkout option1
   ```

2. Reset to the previous `HEAD` for your topic branch. Because you just merged your trunk e.g. `master` into your topic branch, `HEAD^` is an easy way to refer to the first parent:

   ```bash
   git reset --hard HEAD^
   ```

   A hard reset will remove all commits after the commit you specify. `HEAD~` will also work in this case because you merged another branch into your current branch. See [this discussion](https://stackoverflow.com/questions/2221658/whats-the-difference-between-head-and-head-in-git) on Stack Overflow for a good discussion of the difference.

Now run `git log --oneline` and notice how your branch is back to a clean state before the merge. From this point, you can rebase onto your trunk e.g. `master` and continue work:

```bash
git fetch upstream master
git rebase upstream/master
```

You may have to resolve some merge commits, but follow the instructions with each step and you should be in a good state. After you have completed your rebase, run `git log --oneline` again to see your numbered commits ordered after your lettered commits.

## Option 2: Rebase your commits on your target branch

If you do have commits after your merge, you can use `git rebase --onto`. This is a great way to [transpose a series of commits from one commit to another](2019-11-10-rebasing-commits-on-one-topic-branch-onto-another-branch.md).

1. Check out the `option2` branch we created earlier that is in the bad state:

   ```bash
   git checkout option2
   ```

2. Add another commit to simulate additional work since the merge:

   ```bash
   echo "3" >> readme.txt
   git commit -am "3"
   ```

3. Ideally, make sure you have the latest upstream trunk, e.g. `upstream/master`:

   ```bash
   git fetch upstream master
   ```

4. We need to find the commit from which we branched originally to create our topic branch. There are many ways to do this, and you might even still have a branch pointing to it (e.g. `origin/master` if you haven't updated your remote tracking branch in a typical `GitHub` setup). You could run `git log` and just review the commit summaries to find where you branched, or you could use `git merge-base`. This command helps find the common ancestor, though we still have to do a little investigation because, with the merge commit in our history, it's going to report the commit from our second parent, i.e. our trunk.

   First run `git log` and find your merge commit. It will look something like this:

   ```git
   commit 2f978c75f0ff969f94f695bcbbb1bbdd20130e5d (topic, option3)
   Merge: 1deea8e d4c07ce
   Author: Heath Stewart <heaths@microsoft.com>
   Date:   Thu Sep 24 08:01:13 2020 -0700

       Merge branch 'master' into topic
   ```

   Now we can refer to the parent of our topic branch to find where we merged:

   ```bash
   git merge-base --fork-point master 2f978c75f0ff969f94f695bcbbb1bbdd20130e5d^
   ```

   This will output the commit of the fork point like this:

   ```text
   1cf84d9621730ef86a6867676a630193ff939464
   ```

5. Now that we know the commit from where we forked, we can transpose our commits back onto our trunk e.g. `upstream/master`:

   ```bash
   git rebase --onto upstream/master 1cf84d9621730ef86a6867676a630193ff939464
   ```

   We could've also used `FETCH_HEAD`, which is the head of the last branch we fetched, but `upstream/master` is more specific. `FETCH_HEAD` would also be overwritten if you fetched any other branches, so you could end up with the wrong result.

You may have to resolve some merge commits, but follow the instructions with each step and you should be in a good state. After you have completed your rebase, run `git log --oneline` to see your numbered commits ordered after your lettered commits.

## Option 3: Obliterate and start over

If and only if you have a backup branch - either locally like we created with the `option3` branch, or a remote branch that you may have pushed to GitHub or another remote - it may sometimes be faster to just obliterate and start over.

For example, if you pushed your local branch to a remote e.g. `origin/topic`, then did a merge locally only to realise you meant to rebase, you could switch to another branch and obliterate your local topic branch:

```bash
git checkout master

# The following command will delete all commits!
git branch -D topic
```

You can then recreate your topic branch from your remote:

```bash
git branch --track topic origin/topic
```

It's the most destructive option and can result in lost work, so this should be a last resort; however, it can be handy if you know you have a lot of complicated merge conflicts to resolve again if rebasing, so starting fresh could save time.
