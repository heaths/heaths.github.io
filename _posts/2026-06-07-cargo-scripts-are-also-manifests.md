---
title: Cargo scripts are also manifests
date: "2026-06-07T22:35:02-07:00"
summary: |
  Cargo scripts are single-file packages written in Rust. They are also valid Cargo manifests for built-in and popular commands like clippy.
category: rust
tags:
  - rust
  - cargo
  - clap
  - tips
atUri: at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mnr2gfxy372r
---

<!-- cspell:ignore clippy Zscript println -->

I've been using [cargo scripts](https://rust-lang.github.io/rfcs/3424-cargo-script.html) for various tasks including in the [Azure SDK for Rust](https://github.com/Azure/azure-sdk-for-rust). Shell scripts are versatile - and fast - but sometimes you just need the programmatic power and third-party crates that Rust gives you.

```rust
#!/usr/bin/env -S cargo +nightly -Zscript
---
[package]
edition = "2024"

[dependencies]
clap = { version = "4.6.1", features = ["derive"] }
---
use clap::Parser;

fn main() {
    let args = Args::parse();
    println!("{}", hello(args.name.as_deref()));
}

#[derive(Parser)]
struct Args {
    name: Option<String>,
}

fn hello(name: Option<&str>) -> String {
    format!("Hello, {}", name.unwrap_or("world"))
}

#[test]
fn test_hello() {
    assert_eq!(hello(None), "Hello, world");
    assert_eq!(hello(Some("people")), "Hello, people");
}
```

Recently, I prototyped [dynamic completion](https://github.com/clap-rs/clap/issues/3166) in `clap` using a cargo script for easily [sharing as a gist](https://gist.github.com/heaths/333d00c1ddddbdc5ebb5dcb7e6e74c9f), though that meant configuring the `#[command(name)]` as the name of the source file e.g., `dynamic.rs`. Even though it compiles to `dynamic`, you run it as `dynamic.rs` which means shell completion has to match that name.

Cargo scripts have evolved quite a bit since I started using them a couple years ago. `cargo fmt` works automatically when configured in editors like helix, but `rust-analyzer` support isn't complete yet making `cargo clippy` especially handy. Turns out, you can run `clippy`, `cargo doc`, and other commands using `--manifest-path`.

```sh
cargo +nightly clippy -Zscript --manifest-path script.rs
```

You can even run tests like shown in the example above:

```sh
cargo +nightly test -Zscript --manifest-path script.rs
```
