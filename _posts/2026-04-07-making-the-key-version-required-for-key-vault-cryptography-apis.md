---
title: Making the key version required for Key Vault cryptography APIs
date: 2026-04-07T22:32:00-07:00
summary: >
  Why we changed the key version to be a required parameters for Key Vault cryptography APIs in Azure SDK for Rust.
category: azure
tags:
  - azure
  - cryptography
  - keyvault
  - rustlang
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mixnsl7nfe25"
---

When I started on the Azure SDK team almost 7 years ago, I immediately jumped into the Azure Key Vault SDK for .NET among other responsibilities.
We already had a pretty good codebase as a start lead by a former colleague who worked in Azure Key Vault prior to joining the Azure SDK team.

Since the Key Vault service allowed an empty string for the key version for all endpoints, the KV SDKs across all languages back then -
[.NET], [Java], [JavaScript/TypeScript], and [Python] - we made the key version parameters in all those languages optional
even though they didn't all technically follow language guidelines for optional parameters: optional parameters go into "options bags" -
an optional parameter that had a bunch of optional properties on it or, for pythonistas, `kwargs`.

For key data operations that generally fine: an empty version means you act on the latest key version;
however, for cryptography operations - encrypt, decrypt, sign, verify, wrap, and unwrap - that can inadvertently lock you out of your data.
For example, if you encrypt with key version 1 and that key is rotated to version 2, you won't be able to decrypt with version 2.
You can work around this by cycling through key versions, but knowing when you found the right one isn't always easy if you don't know the plaintext.
This is compounded when unwrapping a symmetric key because the key length is the same and, in some block ciphers,
will decrypt into plaintext you can't always validate.

## Required for Rust

Since I'm the architect for the [Azure SDK for Rust][Rust], have much more experience with Azure Key Vault now, and have been working on the Key Vault SDKs for Rust,
after having talked with the Key Vault service team about it, we made the key version parameter required for cryptography operations.
Not only does this mean the version parameters actually follow [language guidelines](https://azure.github.io/azure-sdk/rust_introduction.html#rust-client-methods),
but that they steer customers into the pit of success. You can still pass an empty string `""` to use the latest version but it's not recommended.

I've [updated](https://github.com/heaths/akv-cli-rs/pull/111) the [akv CLI](https://github.com/heaths/akv-cli-rs) accordingly to require the key version
for the `encrypt` command, whether passed to `--version` or (new) passed as a key URI with version.

Hopefully by requiring a key version for crypto functions, customers will be less likely to accidentally lock themselves out of their encrypted data.

[.NET]: https://github.com/Azure/azure-sdk-for-net
[Java]: https://github.com/Azure/azure-sdk-for-java
[JavaScript/TypeScript]: https://github.com/Azure/azure-sdk-for-js
[Python]: https://github.com/Azure/azure-sdk-for-python
[Rust]: https://github.com/Azure/azure-sdk-for-rust
