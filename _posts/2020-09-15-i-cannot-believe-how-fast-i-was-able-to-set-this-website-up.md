---
title: I Cannot Believe How Fast I Was Able To Set This Website Up
tags: [Jekyll, Web Dev, Dev Logs]
style: border
color: primary
description: Static website generation, where have you been all my life.
---

## Why a website?

Well I had a look into my saved notes, and realised that I had a huge number of internal dialogues I had with myself. I figured it served no purpose
whatsoever when kept internal, and voila, a blog. Another reason arose from a Discord conversation with my friend [Dheeraj](https://squadrick.github.io).
I was talking about how I wanted to remake my resume so that wouldn't so flashy, and he recommended me to look into Jekyll (a static website generator),
and possibly generate a resume dynamically from YAML sources. I've been a React kid this whole time, and had never looked into static website generation,
perceiving it to be too rudimentary for the level of customisation I would require. Boy was I wrong.

## Why now?

- Covid.
- Having to wait for my final semester results.
- My job's joining date being months away.
- Boredom.

## So what's Jekyll

Jekyll is a static site generator that can build website and structure from markdown. It's written in Ruby by Tom Preston-Werner, GitHub's co-founder.
I've never used Ruby, and wasn't too keen on getting into it either, after hearing of Twitter [switching away](https://medium.com/@mittalyashu/why-did-twitter-switch-from-ruby-on-rails-dac66150044d) due to scalability concerns, but I digress. Ruby uses gemfiles for distributing packages, of which Jekyll is one.

## Why Jekyll

Because Github natively supports it, and hey, it's free reales...hosting.

## The 'under a minute' explanation

So jekyll projects use a structure of directories starting with an \_ followed by a name, each of which pertains to some aspect of the website's structure. Here's an example:

```
.
├── _config.yml
├── _data
│   └── members.yml
├── _drafts
│   ├── begin-with-the-crazy-ideas.md
│   └── on-simplicity-in-technology.md
├── _includes
│   ├── footer.html
│   └── header.html
├── _layouts
│   ├── default.html
│   └── post.html
├── _posts
│   ├── 2007-10-29-why-every-programmer-should-play-nethack.md
│   └── 2009-04-26-barcamp-boston-4-roundup.md
├── _sass
│   ├── _base.scss
│   └── _layout.scss
├── _site
├── .jekyll-metadata
└── index.html
```

Of particular importance is the _config.yml file, which stores configuration data, site wide variables and parameters, which are then used during site generation.
jekyll also allows you to customize permalink behaviour, how URL requests are handled, and meta info on what and what not to consider during generation.

It has a pretty solid conditional and loop based rendering engine that makes use of Ruby, allowing you to utilise variables and metadata when generating HTML.
You can also define different layouts and corresponding SASS styling for layouts and individual elements.

The most powerful use, in my opinion, is the ability to share themes. Its such a time saver to be able to just define some elements with styling, plop them into your includes, and use them elsewhere.
It's basically a poor man's React, without statefullness and hooks, and the like.
