---
title: Portfolio Website
tags:
  - Web Development
  - .NET
  - MongoDB
  - AstroJS
  - Tailwind
  - Umbraco
  - Docker
  - Cloudflare Workers
start: 2024-03-04
links:
  - title: Source code
    url: https://github.com/sakuexe/portfolio
  - title: Website
    url: https://www.sakukarttunen.com/
  - title: First version (.NET)
    url: https://github.com/sakuexe/portfolio_dotnet
  - title: Umbraco version
    url: https://github.com/sakuexe/portfolio/tree/umbraco
---

The website you are currently viewing. It has gone through a few versions, and it has been a fun project to come back to.

It started as a mockup in AstroJS, but only the first two sections were designed and finished before the Fullstack Web Development course at school, where the site became my course project. In three weeks I designed the rest of the site from scratch and built it with ASP.NET Core and MongoDB, including my own CMS: an admin dashboard behind a login, with hashed and salted passwords, for managing the content. It ran in Docker containers on a virtual machine, with Traefik as the reverse proxy. If you would like to know more, the source code is linked below.

Later the site got an Umbraco backend. The content was edited in Umbraco and the AstroJS frontend fetched it from Umbraco's Delivery API at build time. It worked well, but it meant a separate server and a CMS to host, update and keep secure, just to serve a handful of pages.

When I built the Taurudesign site on Cloudflare Workers, I liked the setup so much that I moved this site over to the same way of doing things. Every page is now prerendered at build time, the content lives in the repository as Markdown next to the code, and the only code running on demand is the contact form.

The reason I was able to make the move is simple: I am the only one editing the content and the only one coding the site. An external CMS brought no extra value. It was just one more thing to maintain. Editing a Markdown file and pushing it is faster for me anyway.
