---
layout: post
title: Fixing Time Drift in Docker on WSL2
author: Heath Stewart
date: 2020-05-23 10:00:00 -07:00
categories: troubleshooting
tags:
- docker
- wsl2
---

WSL2 has been amazing! It's so much faster than on WSL, and Git commands and Python scripts just run faster. But what really gets me giddy is [Docker on WSL2](https://docs.docker.com/docker-for-windows/wsl). No Hyper-V VM - in fact, Hyper-V doesn't even need to be installed. I loved Hyper-V, but with Docker and WSL2 I haven't had much reason to run it. It's just works...well, usually.

I fired up [VSCode](https://code.visualstudio.com) in my [PowerShell](https://github.com/PowerShell/PowerShell) repo and Code prompted me to restart in a devcontainer, but the `apt-get` statement failed with errno 100:

```
E: Release file for http://security.debian.org/debian-security/dists/buster/updates/InRelease is not valid yet (invalid for another 3h 49min 34s). Updates for this repository will not be applied.
```

I found [docker/for-win#4526](https://github.com/docker/for-win/issues/4526) and [docker/for-win#5593](https://github.com/docker/for-win/issues/5593), specifically a [comment](https://github.com/docker/for-win/issues/5593) that instructed to run this:

```bash
sudo hwclock -s
```

It wasn't clean where I should run that, but since Docker is running on the Linux kernel for WSL2, I started Ubuntu in Windows Terminal and ran that command, restarted my intermediate docker container, and it completed successfully.

The problem occurs when a distribution is running and the machine sleeps. The container clock isn't synchronized when the distribution again runs after the computer wakes.
