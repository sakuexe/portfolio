# Saku's portfolio site

[sakukarttunen.com](https://sakukarttunen.com). Astro, prerendered and served
from Cloudflare Workers. The only code that runs on demand is the contact form
(an Astro Action that sends mail over SMTP).

The older Umbraco-backed version is tagged
[`umbraco`](https://github.com/sakuexe/portfolio/tree/umbraco).

## Development

```sh
nix develop --command zsh   # node + a tmux window with `astro dev` and smtp4dev
```

Without the flake, run `npm install && npm run dev` in `website/` and start
smtp4dev yourself:

```sh
docker run --rm -it -p 5000:80 -p 2525:25 rnwood/smtp4dev
```

The contact form works locally without any setup. The dev values are committed:

- `website/.env.development`: build-time config (Turnstile test site key,
  smtp4dev on `localhost:2525`). Vite loads it only in `astro dev`.
- `website/.dev.vars`: Worker secrets (Turnstile always-pass secret, dummy
  SMTP credentials).

Sent mail shows up in the smtp4dev inbox at <http://localhost:5000>. Never put
real values in either file. Personal overrides go in
`.env.development.local` (gitignored).

To test the built Worker rather than the dev server:

```sh
npm run build
npx wrangler dev -c dist/server/wrangler.json
```

## Content

- Projects: `website/src/content/projects/<slug>/index.md`, with the banner
  image next to it (`image: ./banner.jpg`). The folder name is the URL slug.
  The frontmatter schema is in `website/src/content.config.ts`.
- Work history: `website/src/content/experiences/<slug>.md`.
- Home page sections (about, expertise, skills, contact): `website/src/data/home.ts`.

Images go through `astro:assets` at build time, so commit originals and let
the build optimize them.

## Deploying

Pushing to `main` (changes under `website/` or the workflow) runs
`.github/workflows/deploy.yml`: `astro check`, `astro build`, `wrangler deploy`.

Config lives in two places:

- **GitHub `astro-build` environment**: vars `TURNSTILE_SITE_KEY`,
  `SMTP_HOST`, `SMTP_PORT`, `MAIL_FROM`, `MAIL_TO`, and secrets
  `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. These are public
  `astro:env` values that get inlined at build, so changing one means
  redeploying.
- **Worker secrets**: `TURNSTILE_SECRET_KEY`, `SMTP_USER`, `SMTP_PASSWORD`.
  They're read at runtime, so no redeploy is needed:

  ```sh
  cd website && npx wrangler secret put SMTP_PASSWORD --name portfolio
  ```

  Keep `--name portfolio`. `.wrangler/deploy/config.json` points wrangler at
  `dist/server/wrangler.json`, so an outdated `dist/` can send the command to
  the wrong Worker.
