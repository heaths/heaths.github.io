---
layout: post
title: "Cleaning up Rust"
date: 2025-02-28T21:10:00-08:00
categories: rust
tags:
- rustlang
- tips
- wsl
excerpt: >
  Tips for cleaning up after Rust, which can consume a lot of disk space.
# cspell:ignore diskpart hkcu vdisk vhdx
---
I'm the lead developer on the [Azure SDK for Rust] and have been working on it for a few years now.
I also started or contribute to a number of other [Rust] projects.
With all the different crates and numerous versions of the same crate names, a lot of drive space is lost to downloaded crates and cloned - but shallow - repos.
When I switch branches that might use different versions or features of crates, it also uses a lot of drive space.

Fortunately, cleaning up all that Rust doesn't require WD-40 and a little elbow grease. Here are a few tips:

1. Use [cargo-cache](https://crates.io/crates/cargo-cache) to view information about and clean up the cargo cache:

   ```bash
   cargo install cargo-cache
   cargo cache --info
   cargo cache --help
   ```

   It hasn't been updated in a while, but seems to work quite well.
2. Delete your `target/` directory. Generally, most of the time building is spent acquiring crates anyway,
   but this can typically save you a lot of space, especially if you've been working in a repo for a while
   and dependencies have changed frequently.

## WSL

This can be even more problematic when working in Windows Subsystem for Linux (WSL), since the virtual hard disk (VHDX)
used to default to 256GB then later 512GB, and currently 1TB.
Note, however, this is only the maximum size the VHDX sees as the maximum space.
Depending on your physical drive space availability, it may be less.

In my case, recently, my old WSL Ubuntu-22.04 image thought it ran out because it only saw 256GB.
Most of that was consumed by Rust and Go. You can view space using `du` from within WSL like so:

```bash
du -hd1 -t1gb .
```

If deleting repos' `target/` directories didn't free enough space, you can [resize your VHDX](https://learn.microsoft.com/windows/wsl/disk-space) from an elevated shell:

```powershell
# Replace 'Ubuntu-22.04' below with the name of your distro.

# Shut down your distro.
wsl --shutdown 'Ubuntu-22.04'

# Find the path to the VHDX file for your distro.
(Get-ChildItem -Path HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss `
  | Where-Object { $_.GetValue("DistributionName") -eq 'Ubuntu-22.04' } `
  ).GetValue("BasePath") + "\ext4.vhdx"

# Launch diskpart and resize the disk returned above as {path}.
diskpart
select vdisk file="{path}"
expand vdisk maximum="{size in MB}"
exit
```

Now log into your distro's shell again and tell it that it has more disk space available:

```bash
# Find the correct device.
sudo mount -t devtmpfs none /dev 2> /dev/null
mount | grep ext4

# Copy the name e.g., /dev/sdc and resize it using the same size in MB as above.
sudo resize2fs /dev/sdb '{size in MB}M'
```

[Azure SDK for Rust]: https://github.com/Azure/azure-sdk-for-rust
[Rust]: https://www.rust-lang.org
