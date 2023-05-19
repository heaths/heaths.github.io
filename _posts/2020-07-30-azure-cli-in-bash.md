---
title: Batch operations with Azure CLI in bash
date: 2020-07-29 18:00:00 -07:00
categories: tips
tags:
- azure
- azurecli
- tip
- wsl2
---

While I use [PowerShell](https://github.com/powershell/powershell) on a daily basis, the [Azure CLI](https://aka.ms/azure-cli) has better support for Azure management and some data operations. It also runs faster on WSL2, since python.exe startup on Windows could use some performance work.

<!--more-->

Since the Azure CLI returns valid JSON, you can simply pipe it to `ConvertFrom-Json`:

```powershell
az keyvault secret list --vault-name myvault | convertfrom-json
```

But as much as I love PowerShell, when I'm using WSL I tend to stick with bash - exercise those muscles that atrophied years back. One common operation I find myself repeating is after running Key Vault SDK unit tests, sometimes I need to clean up (this should happen automatically with most tests, but we have a few more to fix). That means enumerating resources (secrets, keys, and certificates), deleting them, and purging them. If they aren't purged, creating new ones if I run tests again will fail since random names are seeded from a recorded value.

That gets tedious when you have to weed through the JSON to find the IDs, and call the Azure CLI subsequently for each one. Instead, you can install and use `jq` and `xargs` (the latter is likely already installed with your distro) to make this easier.

First, you need to install the Azure CI and `jq` if not already installed:

```bash
sudo apt install -u azure-cli jq
```

After that completes, you can log into the Azure CLI and delete secrets. While you could chain these commands together, deleting secrets can take a little while since the service does it on a schedule.

```bash
az keyvault secret list --vault-name myvault --query [].id | jq -r .[] | xargs -rtL1 az keyvault secret delete --id
# wait a bit, or just enumerate deleted secrets to check if they are ready; maybe even just run: sleep 5s
az keyvault secret list-deleted --vault-name myvault --query [].recoveryId | jq -r .[] | xargs -rtL1 az keyvault secret purge --id
```

The parameter `-r` passed to `xargs` tells it to run nothing if `stdin` contains no lines, while `-t` shows the command that is being run. This is handy for diagnostics if the command fails. The parameter `-L1` passes each line (up until the first whitespace) to a separate invocation of `xargs`, since the CLI only operates on a single ID at a time for Key Vault.
