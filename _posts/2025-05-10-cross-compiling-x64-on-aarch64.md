---
layout: post
title: Cross-compiling x64 on Aarch64
date: 2025-05-11T01:39:18+00:00
categories: rust
tags:
- gcc
- rustlang
- tips
- wsl
summary: >
  How to support cross-compiling -sys crates for x64 (x86_64) on Ubuntu 24.04 aarch64 (arm64) in WSL2.
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mfdr2apavz2r"
---
Cross-compiling in Rust is generally pretty easy:

```bash
rustup target add x86_64-unknown-linux-gnu
cargo build --target x86_64-unknown-linux-gnu
```

Of course, the targets' compiler, headers, and libraries need to be available, but a typical install of [Visual Studio] or gcc will support common targets.
But on my new work Surface Laptop 7 arm64 I needed to compile `openssl-sys` for [my a project](https://github.com/heaths/akv-cli-rs) and that's when the fun began:

```text
error: failed to run custom build command for `openssl-sys v0.9.102`

----- SNIP ---8<
  cargo:rerun-if-env-changed=OPENSSL_DIR
  OPENSSL_DIR unset
```

While there are lots of ways of getting the bits I need - like compiling source myself or downloading and extracting files to the right locations -
I like the convenience of a package manager especially when it comes to installing updates. But I'm running Ubuntu 24.04 aarch64, so how do I install packages for amd64 e.g., `libssl-dev:amd64`?

## Configuring sources

While I've had some experience managing debian package repositories e.g., in `/etc/apt/` I've never before had need to try to install packages for other architectures. I wasn't even entirely sure it was supported, but a quick search got me started:

```bash
sudo dpkg --add-architecture amd64
sudo apt update
```

But updating the package index failed: I was getting several 404s because packages weren't available on <http://ports.ubuntu.com/ubuntu-ports/>.
I was also only familiar with the one-line format and not this new format I was seeing, which `man 5 sources.list tells me is DEP822-style.

After reading `sources.list(5)` and a bit of trial and error, I ended up with the following `/etc/apt/sources.list.d/ubuntu.sources`

```text
Types: deb
URIs: http://ports.ubuntu.com/ubuntu-ports/
Suites: noble noble-updates noble-backports
Components: main universe restricted multiverse
Architectures: arm64
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: http://archive.ubuntu.com/ubuntu/
Suites: noble noble-updates noble-backports
Components: main universe restricted multiverse
Architectures: amd64
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: http://ports.ubuntu.com/ubuntu-ports/
Suites: noble-security
Components: main universe restricted multiverse
Architectures: arm64
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: http://archive.ubuntu.com/ubuntu/
Suites: noble-security
Components: main universe restricted multiverse
Architectures: amd64
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
```

## Installing packages

After a quick and finally successful `sudo apt update`, I was able to install packages:

```bash
sudo apt install --yes libssl-dev:amd64
```

I was able to get further with my original goal of compiling `openssl-sys`, but then got an error about no linker available.
I installed `gcc:amd64` and almost able to compile my crate, but the linker failed so I needed to specify the linker explicitly in `.cargo/config.toml`:

```toml
[tageet.aarch64-unknown-linux-gnu]
linker = "aarch64-linux-gnu-gcc"

[target.x86_64-unknown-linux-gnu]
linker = "x86_64-linux-gnu-gcc"
```

Success! ...well, almost.

When I tried a normal build e.g., `cargo build` I got pages full of compiler errors. Turns out, when I installed `gcc:amd64` it replace a few components,
since `apt list --installed *gcc` showed `gcc-13-aarch64-linux-gnu` was now removable.

After a quick search - there's plenty of information of people wanting to cross-compile for aarch64 on amd64 - I realized I need to install a few packages at once,
to effectively make sure all the right symlinks are created. I could've done this manually, but figured there were a number of executables I'd need to fix and would rather just let `apt` handle it:

```bash
sudo apt install --yes gcc-13 gcc-13-aarch64-linux-gnu gcc-13-x86-64-linux-gnu
sudo ln -s /usr/bin/x86_64-linux-gnu-gcc /usr/bin/x86_64-linux-gnu-gcc-13
```

The last line was just for convenience, which `apt` did for `aarch64-linux-gnu-gcc` and, originally, when I installed `gcc-13-x86-64-linux-gnu` standalone.

## Cross-compiling for openssl-sys

I was finally able to cross-compile `openssl-sys`:

```bash
cargo build
PKG_CONFIG_SYSROOT_DIR=/usr/lib/x86_64-linux-gnu cargo build --target x86_64-unknown-linux-gnu
```

[Visual Studio]: https://www.visualstudio.com
