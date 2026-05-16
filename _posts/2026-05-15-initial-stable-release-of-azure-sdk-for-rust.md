---
title: Initial stable release of Azure SDK for Rust
date: 2026-05-15T20:12:12-07:00
image: /assets/images/rust-cake.jpg
summary: >
  I'm excited to announce our initial stable release of the Azure SDK for Rust including Storage blobs and queues,
  and Key Vault secrets, keys, and certificates.
category: azure
tags:
  - rust
  - rustlang
  - azure-sdk
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mlx6vipoaw2x"
---

I'm excited to announce our initial stable release of the [Azure SDK for Rust](https://devblogs.microsoft.com/azure-sdk/from-beta-to-stable-announcing-the-azure-sdk-for-rust-ga/)! 🎉

Besides the core libraries, we made the following crates generally available (GA):

- [azure_storage_blob](https://crates.io/crates/azure_storage_blob)
- [azure_storage_queue](https://crates.io/crates/azure_storage_queue)
- [azure_security_keyvault_secrets](https://crates.io/crates/azure_security_keyvault_secrets)
- [azure_security_keyvault_keys](https://crates.io/crates/azure_security_keyvault_keys)
- [azure_security_keyvault_certificates](https://crates.io/crates/azure_security_keyvault_certificates)

`azure_data_cosmos` and `azure_messaging_eventhubs` will be available soon.

## Getting Started

We have a lot of great examples in our [`azure_core`](https://docs.rs/azure_core) documentation.
You can also find other [`azure_core` examples](https://github.com/Azure/azure-sdk-for-rust/tree/main/sdk/core/azure_core/examples) in our [repository](https://github.com/Azure/azure-sdk-for-rust).

## Extensibility

Rust doesn't have a lot in its standard library - not even an async executor. Thus, applications need to pick an executor.
While [tokio](https://docs.rs/tokio) is the most common async executor - and on which our default HTTP client, [`reqwest`](https://docs.rs/reqwest) is based - there are other executors and HTTP clients applications may want to use. Azure service have to use a platform called Oxidizer - some of which is public - that provides an async executor optimized for running Azure services.

Thus, we support [replacing](https://docs.rs/azure_core/latest/azure_core/#replacing-the-http-client) the async executor and/or the HTTP client, along with customizing the default `reqwest::HttpClient` or even just [adding HTTP policies](https://docs.rs/azure_core/latest/azure_core/#adding-http-policies) like with all our Azure SDK languages.

See our cross-cutting [samples](https://github.com/Azure/azure-sdk-for-rust/tree/main/samples).

## Origins

This started as passion project. I had been writing [Rust](https://www.rust-lang.org) for a while but wanted something substantial to work on. I started the original Azure/azure-sdk-for-rust repo. Not long after, some colleagues heard about this and had been working on some unofficial crates that [MindFlavor](https://github.com/MindFlavor) started. I ended up archiving my project and we forked his in its place. It went through a lot of changes to align with our Azure SDK [general guidelines](https://azure.github.io/azure-sdk/general_introduction.html) while I started working on the initial [Rust guidelines](https://azure.github.io/azure-sdk/rust_introduction.html).

As people moved on and the project was made official, I was named the architect and started prototyping many different ideas based on popular Rust projects. Anyone that tells you there is decidedly an "idiomatic Rust" is wrong. There are certainly common patterns, but with no clear language guidelines/recommendations like some other languages, there are lots of popular patterns from simple struct initialization, builders, typestate builders, and more. After going through some patterns with other architects, Rustaceans in the company, and people just starting to learn Rust - we want this to be approachable - we settled on a pattern.

While I tried to maintain as much legacy as possible, some radical change was necessary. At that point, I moved the existing code to that point into the [legacy](https://github.com/Azure/azure-sdk-for-rust/tree/legacy) branch. If we needed to make any critical security fixes, we still could. But development continued on in the `main` branch.

### Thanks

I can't thank enough the people who bootstrapped all this effort: Francesco, Ryan, Cameron, Brian, et. al.
And for the people who took up the mantle when this was made an official project: Larry, Joel, Rick, Ashley, Anton, Ronnie, Patrick, Brian, et. al.

<div style="text-align: center;">
<picture>
<source type="image/webp" srcset="/assets/images/rust-cake.webp"/>
<img src="/assets/images/rust-cake.jpg"/>
</picture>
</div>
