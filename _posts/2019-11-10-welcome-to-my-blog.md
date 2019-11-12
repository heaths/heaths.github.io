---
layout: post
title: Welcome to my blog
author: Heath Stewart
date: 2019-11-10 08:23:56 -08:00
categories: general
tags:
- about
---

After many years of being <https://blogs.msdn.com/heaths> and changing positions,
it was time to set up a new blog for technical tips and trips, as well as personal adventures.

Shortly after I joined Microsoft over 15 years ago, I started blogging as a means of
helping customers find workarounds for many of the problems we had with Visual Studio
and .NET Framework installs. Though it had a few URLs over the years,
<https://blogs.msdn.com/heaths> quickly became one of the most-read blogs across MSDN
or TechNet blogs at Microsoft. While that felt pretty cool, the reason why it was so
popular - apart from being good at SEO, so much so the KB team asked me to stop,
but instead I helped them get better - was concerning.

With 20 years of experience with Windows Installer and software deployment concepts
in general, I knew another approach was necessary. Years prior, I was a very active
developer on [WiX][wix] - especially on the improved patch build pipeline, and several
features of Burn including related bundles and package dependencies. But while Burn
solved several of our problems with reliability of Windows Installer, it didn't provide
the flexibility Visual Studio needed to move at break-neck speeds with new features.
Windows Installer itself was also just too slow and allowed our feature teams to do
things they really shouldn't, which prevented the product from being able to install
to multiple places so customers could try new features in one instance while maintaining
a separate, stable instance. So, after all the cries of, "Why can't you just xcopy
Visual Studio?", I got us almost there.

This new system was inspired by NuGet and npm - a package manager. Packages were simplified
to ZIPs (more specifically, OPCs like those used by Office, NuGet, and VSIX) with a
limited grammar to support was Visual Studio required (we added a few more features
over the years based on need). But the biggest change was a dependency graph of features
that allowed feature teams to express feature dependencies like they tried to do
all those years prior through package ordering and conditions - something that was
incredibly hard to get right and more often failed.

With a great lead and team, we brought this vision - and insightful ideas from other
developers backed by well-curated telemetry of issues - to reality. After a few
initial bumps along the road, we made an engine that was 4x faster and about 99%
reliable. As a happy consequence, I had no issues to blog about. Instead, I changed
the blog URL from being /heaths to /setup and we used that for a few setup-related
announcements, like the [.vsconfig][vsconfig] idea I proposed and customers love.

After 15 years of setup at Microsoft and seeing my "baby" succeed (Visual Studio
setup went from being a bad joke to a sometimes beloved feature on socials),
I decided it was time to move on. I always felt like I was where Microsoft needed
me and my experience most, but it was time to leave the future of setup in others'
hands and for me to find something new and exciting. And since I already gave up
ownership of what is now /setup but still wanted to share technical tips and tricks
I've discovered, I started this blog.

I'll mostly stick to technical information but may occasionally post about my
family's adventures here in the gorgeous Pacific Northwest. I'll do my best to
refrain from any political discussion, as there's enough of that on socials already
(which I also usually try to avoid).

I hope you'll find some tips and tricks that help you be more productive.

[vsconfig]: https://devblogs.microsoft.com/setup/configure-visual-studio-across-your-organization-with-vsconfig/
[wix]: http://wixtoolset.org
