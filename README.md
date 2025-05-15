## ThanaThan.com
This is the frontend for my static React website/blog.

## Dev Environment
I use [Next.js](https://nextjs.org) within the dev environment.
Because of this you should install and be a least a little familiar with [Node.js](https://nodejs.org/en).
Next.js is not (or should not be) present on the static site.

## To Run
Use the command `npm run dev` to run dev environment locally.
`npm run build` will build the static site, and `npm start` with begin hosting it.

## How is this static?
Every time I update the content manager I send a webhook to create a new build using the updated data. The static build is then served on [Cloudflare Pages](https://pages.cloudflare.com/). One day I may explain this in more detail on my blog.

## Content Management
For content management I use a [Directus](https://directus.io/) [Docker](https://www.docker.com/) container running within my local network. This is primarily for web traffic / security reasons, but also has the bonus of enforcing my site to remain static (and therefore, very snappy).