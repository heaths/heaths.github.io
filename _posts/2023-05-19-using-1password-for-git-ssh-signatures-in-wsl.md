---
layout: post
title: Using 1Password for git SSH signatures in WSL
date: 2023-05-19 17:02 +0000
excerpt_separator: <!--more-->
categories: tips
tags:
- git
- ssh
- wsl
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mfdr2atatr2r"
---

1Password allows developers to sign [git commits using SSH](https://developer.1password.com/docs/ssh/git-commit-signing)
by setting up [their own SSH agent](https://developer.1password.com/docs/ssh/agent). Doing this in your host platform e.g., Windows,
is relatively straight forward but if you want to set this up in Windows Subsystem for Linux (WSL) there is additional configuration
you need to perform.

<!--more-->

While there are many different ways to configure this, many have you set up a service or autorun program but I want neither
of those affecting Windows boot and login performance for something I don't use often throughout the course of every day.
Fortunately, I found one [one such article](https://dev.to/d4vsanchez/use-1password-ssh-agent-in-wsl-2j6m) that accomplished
exactly what I wanted using `socat` and `npiperelay`.

I made a few modifications including how to acquire `npiperelay` given changes to the Go toolset.

## 1. Acquire npiperelay

You need to acquire `npiperelay` in Windows. You can download it from <https://github.com/jstarks/npiperelay/releases/latest>
into a directory in your `PATH` environment variable or, if you have Go installed, run:

```bash
go install github.com/jstarks/npiperelay@latest
```

## 2. Install socat

Next you need to install `socat` in your WSL distribution. I'm assuming you are using some Debian-based distro e.g., Ubuntu.
If you are using another distro, please use appropriate commands.

```bash
apt update
apt install -y socat
```

## 3. Create startup script

You'll need to create a bash script that will start when you log into your distro. I'm assuming bash below.

```bash
mkdir ~/.1password
touch ~/.1password/agent && chmod +x ~/.1password/agent
```

Open *~/.1password/agent* and paste the following content:

```bash
#!/usr/bin/bash

export SSH_AUTH_SOCK=$HOME/.1password/agent.sock

ALREADY_RUNNING=$(ps -auxww | grep -q '[n]piperelay.exe -ei -s //./pipe/openssh-ssh-agent'; echo $?)
if [[ $ALREADY_RUNNING != '0' ]]; then
    if [[ -S $SSH_AUTH_SOCK ]]; then
        rm $SSH_AUTH_SOCK
    fi

    (setsid socat UNIX-LISTEN:$SSH_AUTH_SOCK,fork EXEC:'npiperelay.exe -ei -s //./pipe/openssh-ssh-agent',nofork &) > /dev/null 2>&1
fi
```

## 4. Run script on login

To run the script when you log in interactively, edit your appropriate profile e.g., *.bashrc* for bash:

```bash
. ~/.1password/agent
```

You can restart your login session or just source *~/.1password/agent* yourself.

## 5. Test

Assuming you have already configured 1Password's SSH agent using the instructions at the beginning of this post,
you can test and reset any git repository you have handy e.g.,

```bash
cd ~/src/some-project
echo test > test.txt
git add -A
git commit -am'test' -S
git show --show-signature
```

### Unknown signer

If the `git show --show-signature` command about shows an unknown or invalid signer, be sure you have your `allowed_signers`
set up for git. Unlike GPG that can use counter signatures to validate identities, SSH signatures need explicit approval:

```bash
mkdir -p ~/.config/git/
cat ~/.ssh/identity_rsa.pub > ~/.config/git/allowed_signers
git config --global gpg.ssh.allowedsignersfile $HOME/.config/git/allowed_signers
```

### Blocks tunneling into other hosts

If you are also using SSH to tunnel into other hosts, you should configure SSH separately for github.com:

```text
Host *
    IdentityFile ~/.ssh/id_rsa.pub

Host github.com
    IdentityAgent ~/.1password/agent.sock
    IdentitiesOnly yes
```
