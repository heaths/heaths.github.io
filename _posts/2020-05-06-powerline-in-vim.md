---
title: Powerline in Vim
author: Heath Stewart
date: 2020-05-06 00:30:00 -07:00
categories: tips
tags:
- powerline
- tip
- vim
---

As a long-time [vim](https://www.vim.org) user (though I more commonly use [Code](https://code.visualstudio.com) these days), I relish the opportunity to improve my experience. I've been using [Powerline](https://github.com/powerline/powerline) for my bash prompt for a while and even developed a [pure PowerShell variant](https://github.com/heaths/profile/blob/master/Microsoft.PowerShell_profile.ps1). I wanted to integrate it into my vim profile which I maintain as a [Git repo](https://github.com/heaths/vimfiles) across many different machines, physical or virtual.

Because these machines may have different versions of [Python](https://python.org) or none at all, Powerline may not even be installed, or vim doesn't support Python (the default distro for Windows does not), I needed a way to conditionally load and [configure Powerline for vim](https://powerline.readthedocs.io/en/latest/usage/other.html#vim-statusline).

```vim
" use powerline if available
if has('python3')
  python3 << EOF
from os import path
import site
d = path.join(site.getusersitepackages(), 'powerline/bindings/vim')
if path.isdir(d):
  vim.command('set rtp+={} laststatus=2 t_Co=256'.format(d))
EOF
endif
```

This checks if vim was compiled with Python 3 support and its available. It then attempts to detect a user-installed path to Powerline and, if it exists, set the necessary global options to use it. Especially on WSL2, this executes very quickly and has no noticable impact to startup performance of vim.
