---
title: Helmiälä Puoti
tags:
  - Web Development
  - Django
  - Tailwind
  - CMS
  - Docker
  - SEO
start: 2024-11-06
image: ./banner.webp
imageAlt: Images from helmiala with code on the left side
links:
  - title: www.helmiala.com
    url: https://www.helmiala.com/?from=sakukarttunen.com
team:
  - name: Pia Vilkman
    role: Ideas & content
    comments: The co-owner of the business.
  - name: Minna Taiponen
    role: Ideas & content
    comments: The co-owner of the Helmiälä business
  - name: Teemu Vilkman
    role: Photography
    links:
      - title: instagram @vilkmedia
        url: https://www.instagram.com/vilkmedia/
---

I got a chance to build a website for a local startup in Hämeenlinna, as I was recommended by to the owners. They were family friends, so I was very happy to help them however I could. The business was just starting and they wanted to have a website to showcase their products and services, as well as provide a basis for their brand image online. I was excited to work on the project, since after talking with the owners, I realized that it was going to be a fullstack project. Since they wanted to have a way to quickly manage and maintain the contents on the website.

I decided to use Django as the fullstack web framework, since I had some prior experience with it and I knew that it would allow for fast and reliable development. It is battle-tested and provides a whole bunch of tools and services right out of the box that would be useful for the project. I also used TailwindCSS as it it personally my favorite styling solution and can provide me with the fastest way to iterate and develop the frontend. I had worked on a project with two classmates before, where we used Django, so I was excited to return to it and see how I could implement new skills that I had learned since.

The website is hosted on a VPS on DigitalOcean, running two docker containers. One for the Django webapp and one for the Nginx reverse proxy. The database is a SQLite database, which came built in with Django. It also allowed for easy backups with docker volumes and mounts. The website is also behind a Cloudflare CDN, which provides SSL certificates and DDoS protection as well as static file caching. I tried to optimize the website for SEO and performance, while keeping the design easy to use and clean. Overall the tech stack was very fun and I learned a whole lot during the process. I am very glad that I went with Docker and Cloudflare, as they made the deployment and maintenance of the website very easy. Django was definitely not too slow!

The clients were very happy with the result and while the website has had some errors and bugs that were inevitable with my first fullstack project, they have been understanding and patient. The end result is a website that runs fast is scalable, easy to maintain and has good SEO. I am glad that I got to work on this project and I am very proud of the team that I got to work with. The site has gotten more than 2000 unique visitors and over 500 google search clicks in it's first month of being published. Thank you to everyone who made it possible!
