---
title: Cleaning up Rust made easier
date: 2026-03-20T23:14:00-07:00
summary: >
  Changes in WSL appear to have made shrinking a VHDX containing a WSL distro easier.
  These are new, simpler instructions for cleaning up rust and shrinking a distro.
category: rust
tags:
  - rustlang
  - tips
  - wsl
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mhkj26txqp2b"
---

WSL distributions are installed into VHDX files that, by default, automatically expand up to the amount of drive space on which they are stored - your system drive, by default. Some toolchains like Rust tend to fill up that space pretty quickly. If you don't delete older dependencies from `~/.cargo` often or keep `targets/` for a long time across multiple toolchain versions or target architectures, that space will fill up quickly.

Using [`cargo-cache`](https://crates.io/crates/cargo-cache) as I [described previously](2025-02-28-cleaning-up-rust.md) can help clean up old dependencies, and you can delete all `targets/` from repos under some directory like so:

```bash
find -maxdepth 2 -name targets -execdir rm -rf {} \;
```

After that and cleaning up any other files you don't need, log out of all your WSL sessions, close down Visual Studio Code if you have it running and connected to WSL e.g., if you started `code` from within WSL, and shut down WSL:

```powershell
wsl --shutdown
```

Now for the easier part: find the VHDX for your distro and shrink it all from within PowerShell:

```powershell
# Replace "Ubuntu-24.04" with your distro name
$path = (Get-ChildItem -Path HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss `
  | Where-Object { $_.GetValue("DistributionName") -eq 'Ubuntu-24.04' } `
  ).GetValue("BasePath") + "\ext4.vhdx"
Optimize-VHDX -Path $path
```

It may take a while, but after it completes you can log back into your distro. Seems WSL changed it so you don't have to run `resize2fs` anymore - Ubuntu 24.04, at least, automatically picked up that more space was available.
