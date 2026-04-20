---
title: Light and dark themes for my blog
date: 2026-04-19T23:48:45-07:00
image: assets/images/kraken-theme.jpg
summary: >
  I added light and dark themes to my blog along with some responsive fixes on smaller screens
  with a little help.
category: general
tags:
  - blog
  - copilot
  - css
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mjvwnyj4cb2t"
---

![A blog page shown in both light and dark themes side by side, using the Seattle Kraken color palette]({{ "/assets/images/kraken-theme.jpg" | relative_url }})

My posts will always be written by me, a human, sharing tips, personal news, and more.
And though I started writing web sites before HTML 1.0 was formally standardized, I've never been good at design.
My blog used Jekyll Minima with a few overrides and I only recently updated it to 2.5, but was envious of the theming that 3.0 has in development.
Though I really haven't touched much CSS since shortly after 2.0 was released, I knew the mechanics but wanted a little help prototyping some ideas quickly.

## Trying out themes

It probably wasn't obvious, but my previous color palette used Seahawks colors.
I wanted to see what mixing those colors or other colors might look like for light and dark themes.
With some links to the color palettes I was considering - but haven't necessarily settled on for the foreseeable future - asked Copilot with Sonnet 4.6 to render a few.
It didn't take long - certainly faster than I'd have done it - and I was able to select a theme as a start quickly.
I made a few tweaks and had it apply the changes with some color mapping instructions from the old palette.

Having been to several of their games with my son - who loves hockey - and my wife - who merely tolerated it but got a selfie with Buoy - I choose a Kraken color palette.
They put on one heck of a show at Climate Pledge Arena.

It took a few iterations to iron out the kinks. I would verify the responsive site in Safari's dev tools and batch several changes with explicit instructions.
As with any time I use an LLM to generate code, I review and recommend changes as needed.

## Theme switcher and responsive fixes

With separate light and dark themes, I next had it lay the ground work to switch themes and fix some responsive issues,
like certain buttons being too long on mobile viewports so I'd change the text to "Subscribe" instead of "Subscribe on Sequoia" in the `sequoia-subscribe` component.
Again, with a carefully crafted prompt, it didn't take long to generate the necessary changes that'd probably have taken me a couple hours.

With all changes reviewed and tested, I finally had a properly responsive and themed web site I've been wanting but just haven't found the time.
