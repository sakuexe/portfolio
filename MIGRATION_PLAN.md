# Migration plan: Umbraco + Astro → static Astro on Cloudflare Workers

Goal: drop the Umbraco backend entirely. Content lives in the repo, every page
is prerendered, and the only on-demand code is the contact form Astro Action.
Running cost ≈ 0.

Reference setup: `../taurudesign_landingpage/website` (adapter config,
`wrangler.jsonc`, deploy workflow, Turnstile verify).

## Decisions

| Topic | Decision |
| --- | --- |
| Project folder | `frontend/` → `website/` |
| Hosting | Cloudflare Workers via `@astrojs/cloudflare`, all pages prerendered |
| Content | Projects as Markdown in a content collection; home sections as typed data |
| Images | Downloaded from `api.sakukarttunen.com/media/*`, colocated, optimized by astro:assets at build (`imageService: "compile"`) |
| Contact form | Astro Action → Scaleway TEM over SMTP. No DB copy |
| Spam | Cloudflare Turnstile + an off-screen honeypot field |
| Deploys | Push to `main` → build + `wrangler deploy`. `prod` branch removed |

## 1. Content export (one-off script, not committed)

> **Status: done, awaiting local test.** Beyond the plan:
> - Experiences were a separate Umbraco tree (`/professional-background`), exported
>   as an `experiences` collection (`src/content/experiences/<slug>.md`).
> - Home sections went into a typed TS module (`src/data/home.ts`), not YAML: six
>   differently shaped singletons with inline SVG icons (`?raw` imports).
> - Icons downloaded to `src/assets/icons/{expertise,skills}/`, CV to `public/files/saku-cv.pdf`.
> - Check: the Korpilahti banner is a CMYK JPEG; compare its colours to the original.

- Pull from the still-live Delivery API (`/umbraco/delivery/api/v2`,
  `expand=all`):
  - root item → home blocks: `aboutMe, expertise, skills, projects, experiences, contact`
  - `fetch=descendants:/projects` → 11 projects
- Write each project to `website/src/content/projects/<slug>/index.md`:
  - frontmatter: `title`, `tags`, `start`, `end`, `links`, `team`, `image`, `imageAlt`, SEO fields
  - body: rich text HTML → Markdown (`turndown`)
  - banner image downloaded next to it, referenced relatively
- Write the home sections to `website/src/content/` data files (YAML via `file()` loader)
  or plain TS modules, whichever reads better once we see the data.
- Spot-check image quality. Ask Saku for originals of anything that looks soft.

## 2. Astro project rewire

> **Status: done, awaiting local test.** Beyond the plan:
> - Also deleted the unused `components/pages/*` and `utils/extensions.ts`.
> - Projects are sorted by recency (ongoing first), not Umbraco's manual order.
> - The contact form still posts to the live Umbraco backend until step 3
>   (`TODO(migration step 3)` in `EmailForm.astro`).

- `git mv frontend website`
- `src/content.config.ts`: `projects` collection (`glob()` loader, `image()`
  helper, `z.coerce.date()` for dates) plus the home data collections.
- Replace every Umbraco type and fetch with collection entries:
  - `pages/index.astro` / `components/pages/Index.astro`: render the sections
    in fixed order instead of switching over the blocklist
  - `pages/projects/[slug].astro`: `getCollection('projects')` + `render()`
  - `sitemap.xml.ts`: build it from the collection
- Fix the date formatting bug: `getDay()` is the weekday and `getMonth()` is
  0-based. Use `Intl.DateTimeFormat('fi-FI')`.
- Delete: `src/client/`, `src/utils/umbraco.ts`, `UmbracoHotReload.astro`,
  `generate.sh`, `openapitools.json`, `@hey-api/openapi-ts`, `@microsoft/signalr`,
  `image.domains` config, `PUBLIC_API_URL` usage.

## 3. Cloudflare adapter + contact Action

> **Status: done, awaiting SMTP/Turnstile values.** Beyond the plan:
> - Tested against the built Worker (`wrangler dev -c dist/server/wrangler.json`):
>   validation, honeypot, missing-secrets path. Turnstile and SMTP are untested
>   until the real values are in.
> - `nodejs_compat` flag in `wrangler.jsonc` (worker-mailer needs it).
> - Action split into `index.ts` (handler), `models.ts` (schema + field limits,
>   also imported by the form, so no server-only imports) and `helpers.ts`
>   (Turnstile verify, mail send).
> - Turnstile token goes through the widget's default `cf-turnstile-response`
>   form field and is validated by the Zod schema.
> - Dev values are committed: `website/.env.development` (Vite, `astro dev` only,
>   so a missing CI var fails the build instead of shipping test values) and
>   `website/.dev.vars` (Worker secrets). Turnstile test keys + smtp4dev from the
>   flake (`localhost:2525`, inbox at `localhost:5000`). Tested end to end.
> - SMTP uses implicit TLS whenever `!import.meta.env.DEV`. worker-mailer's
>   `authType` defaults to `[]` (every auth fails), so it's set explicitly.
> - TODO: privacy policy page mentioning Turnstile (invisible mode).

- Adapter config mirrors the sister repo: `imageService: "compile"`,
  `session: false`, `prerenderEnvironment: "node"`.
- `wrangler.jsonc`: name, `compatibility_date`, `custom_domain` route for
  `sakukarttunen.com`, `workers_dev: false`, `preview_urls: false`.
- Config split: real secrets are Worker secrets (`wrangler secret put`,
  `.dev.vars` locally). Non-secret config (host, port, addresses, site key)
  goes in `.env` files / GitHub vars.
- `astro:env` schema:
  - client/public: `TURNSTILE_SITE_KEY` (baked in at build time)
  - server/public config from `.env`: `SMTP_HOST`, `SMTP_PORT` (465),
    `MAIL_FROM`, `MAIL_TO`
  - server secrets, optional (Worker secrets, checked at runtime):
    `TURNSTILE_SECRET_KEY`, `SMTP_USER`, `SMTP_PASSWORD`
- SMTP library: `worker-mailer` (built on `cloudflare:sockets`). Notes:
  - Scaleway TEM on port 465 with implicit TLS. Workers can't connect to
    outbound port 25, and implicit TLS is the reliable path on sockets.
  - `nodemailer` relies on Node `net`/`tls` and isn't a safe bet on workerd,
    even with `nodejs_compat`.
  - Visitor's address goes in `Reply-To`. `From` stays a verified TEM sender.
- `src/actions/index.ts` → `contact` action, `accept: 'form'`, Zod schema
  (name, email, subject?, message, turnstile token, honeypot).
  1. Honeypot filled → return a fake success (don't tip off the bot)
  2. Verify Turnstile (`hostname` + `action === "contact"`, as in the sister repo)
  3. Send the mail. On failure, `console.error` the payload (shows in Workers
     logs) and throw `ActionError`
- `EmailForm.astro`:
  - The pages are prerendered, so call `actions.contact(formData)` from the
    client script. `Astro.getActionResult()` doesn't work on prerendered pages.
  - Add the Turnstile widget.
  - Honeypot: `name="referral"`, labelled "How did you find me?" with
    `placeholder="A friend, a search, a business card…"`. It looks like a
    real optional field to a bot (a bare, unlabelled input is a common bot
    tell). It's a plausible field that no browser or password-manager autofill dictionary
    maps to. Positioned off-screen with `transform`/absolute positioning, plus
    `tabindex="-1"`, `aria-hidden`, and `autocomplete="off"`. Avoid identity
    words (phone, address, company, job title/occupation…), or real users'
    autofill trips it.
  - Honeypot hits get a `console.warn` in the Action so false positives
    show up in the Workers logs.
  - Fix the "Clear" button (`type="submit"` → `type="reset"`).

## 4. CI/CD

- New `.github/workflows/deploy.yml` (copied from the sister repo):
  - on push to `main` (paths `website/**` and the workflow), plus `workflow_dispatch`
  - concurrency queues instead of cancelling
  - `npm ci` → `astro check && astro build` → `npx wrangler deploy`
  - build env (vars): `TURNSTILE_SITE_KEY`, `SMTP_HOST`, `SMTP_PORT`, `MAIL_FROM`,
    `MAIL_TO`. Public `astro:env` values are inlined at build time. Deploy env: `CLOUDFLARE_API_TOKEN`,
    `CLOUDFLARE_ACCOUNT_ID` (secrets)
- Delete `frontend_deploy.yml` and `backend_deploy.yml`.
- Set Worker secrets once with `wrangler secret put` (`SMTP_USER`, `SMTP_PASSWORD`, `TURNSTILE_SECRET_KEY`).

## 5. Cutover

0. ~~Tag the last Umbraco-era commit (`baf703b`) as `umbraco` and push it.~~ Done. The
   Portfolio Website project page links to `https://github.com/sakuexe/portfolio/tree/umbraco`.
1. Create a Turnstile widget for `sakukarttunen.com` (+ `localhost`).
2. Make the first deploy to a temporary route and test the form end to end
   (Turnstile, SMTP, honeypot).
3. Delete the GitHub Pages DNS record for `sakukarttunen.com`. A
   `custom_domain` route can't be created over an existing record. Then
   deploy with the real route. Expect a minute or two of downtime.
4. Disable GitHub Pages, delete the `prod` branch.
5. Shut down the Umbraco host, remove the `api.sakukarttunen.com` DNS record.

## 6. Repo cleanup

- Remove `backend/`, `docker-compose.yml`, and the .NET/Umbraco bits of `flake.nix`.
- Rewrite the README: dev setup, `.dev.vars` for local secrets, how to add a
  project (new folder + `index.md` + image), deploy flow.

## Open items (not blocking)

- Scaleway TEM sender address / domain for `MAIL_FROM`.
- Image originals, only if the exported ones look soft.
