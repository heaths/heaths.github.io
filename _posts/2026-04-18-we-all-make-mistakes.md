---
title: We all make mistakes
date: 2026-04-18T00:24:41-07:00
summary: >
  We all make mistakes - at any level - but how we deal with them is how we grow.
category: general
tags:
  - about
  - azure
  - mentoring
  - story
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mjqwgevm2i2d"
---

After 15 years in Visual Studio and having shipped a few versions of the new setup engine I architected as a senior engineer at Microsoft, it was time for a change.
I was a few weeks into my new job on the Azure SDK for .NET team as, among other responsibilities, the technical lead on the Key Vault SDK virtual team.

I was also working on an idea for [unified test resource provisioning](https://github.com/Azure/azure-sdk-for-net/blob/941cc979bf7b36cb9592888d8397f23b2b10f5bd/eng/common/TestResources/README.md) across SDKs and languages and was working with a couple different vaults in the Azure Portal: our test secrets used by all the languages, and one I had just created for some tests.
Certain I had the right one selected, I was prompted **Are you sure you want to delete this vault?** with just **Yes** and **No** buttons, and clicked **Yes**.

I was wrong.

I deleted the shared test secrets used by Azure Pipelines and more.

Within seconds I realized my mistake, hurried down the hall to our engineering systems team room, and echoed [Gob Bluth](https://en.wikipedia.org/wiki/George_Oscar_Bluth_II)'s famous line, "I've made a huge mistake."

Not the best start on a new team, but what happened next is what I like to share with mentees both junior and senior.

## Driving change

In the short term, we needed to restore functionality. Soft delete wasn't enabled on the vault, so the vault was truly gone. But across all the developers, we all had enough secrets in process or machine environment variables[^1] that we could restore most of the secrets. Others we just had to regenerate and deal with as problems arose.

In the long term, I wanted to make sure something so vital - think about a company losing production secrets on which their business depends - didn't happen again, or at least wasn't so easy.

I had already developed a pretty good rapport with the Key Vault service team, and worked with them on some changes:

1. The name of the vault wasn't part of the original prompt. They added the name of the vault and changed the buttons to more descriptive **Delete** and **Cancel**.
2. They moved up plans to enable soft delete by default. After that change, you had to explicitly disable soft delete. Seems many customers weren't aware of soft delete, which allows you to recover a deleted vault or vault resource for a configured number of days - the default being 90 days.

   Eventually, a change was made such that soft delete couldn't be disabled,
   and purge protection could be enabled that prevented a deleted vault or vault resource from being purged for the configured number of days.

## Final thoughts

We all make mistakes. I was a senior at the time and not long after that was promoted to a principal engineer. I still make mistakes - perhaps not as bad and hopefully won't - but how we deal with them and learn from them is what matters.

Own up to the mistake and try to prevent them from happening again or to anyone else, if relevant. Seek out partners to brainstorm ideas and show a growth mindset among your peers and management. They've all made mistakes too.

[^1]: We later changed how authentication was done and moved non-secrets into normal configuration variables.
