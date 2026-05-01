---
title: Improving the Azure SDK developer experience with MCP
date: 2026-04-30T23:03:39-07:00
summary: >
  Providing version-specfic context to an LLM using an MCP can greatly improve productivity and reduce cost.
image: assets/images/mcp-demo-01.jpg
category: azure
tags:
  - azure-sdk
  - mcp
  - rustlang
  - experiment
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mkruperrgt2t"
---

The [Azure SDK for Rust](https://github.com/Azure/azure-sdk-for-rust) has been in active development for about two years now and will be releasing 1.0.0 soon.
A lot has changed since the beginning, and the training data for even modern models shows that.
When given enough context to recognize the API, it uses outdated patterns and even APIs that have been removed, renamed, or otherwise changed.

Even for more established Azure SDK languages like [.NET](https://github.com/Azure/azure-sdk-for-net) or [Python](https://github.com/Azure/azure-sdk-for-python),
new APIs might be added to a particular service or new patterns may evolve that are better to use.

Whatever the case, additional context can improve productivity and reduce cost.

## Example context

I wrote an [MCP](https://github.com/heaths/azsdk-samples-mcp) that discovers Azure SDK dependencies already pulled down,
and adds their `README.md` and other regocnized examples - like Rust's `examples/` directory that is included in our crates - and adds them as context.
As the demo video below shows, this greatly reduces the number of turns for Rust, thereby reducing the token count and cost:

{% youtube "MAhdQDmkZOs" title: "Azure SDK Samples MCP Demo" %}

As a successful prototype, there is still more we can improve on here like distilling the examples from the `README.md` instead of sending the entire page.
Taking advantage of memory in modern agents, we could also link general patterns like those found in our core libraries e.g., [`azure_core`](https://docs.rs/azure_core) for Rust.

I'm excited to see how we can apply findings from this prototype to further improve the developer experience when using Azure SDKs!
