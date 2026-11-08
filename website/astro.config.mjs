// @ts-check
import { defineConfig, envField } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// https://astro.build/config
export default defineConfig({
  site: "https://sakukarttunen.com",
  // Cloudflare Workers. Every page is prerendered; the Worker only runs the
  // `contact` Action.
  adapter: cloudflare({
    // Sharp at build time; no runtime Images binding.
    imageService: "compile",
    // The default (workerd) prerenderer doesn't see astro:env values from the
    // CI shell.
    prerenderEnvironment: "node",
  }),
  // Otherwise the adapter provisions a KV namespace for sessions.
  session: false,
  env: {
    schema: {
      // Baked into the prerendered form at build time.
      TURNSTILE_SITE_KEY: envField.string({
        context: "client",
        access: "public",
      }),
      SMTP_HOST: envField.string({ context: "server", access: "public" }),
      // Implicit TLS. Workers can't reach port 25.
      SMTP_PORT: envField.number({
        context: "server",
        access: "public",
        default: 465,
      }),
      // A verified Scaleway TEM sender.
      MAIL_FROM: envField.string({ context: "server", access: "public" }),
      MAIL_TO: envField.string({ context: "server", access: "public" }),
      // Worker secrets (`wrangler secret put`, `.dev.vars` locally). The build
      // can't see them, so they're optional here and the Action checks them.
      TURNSTILE_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SMTP_USER: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SMTP_PASSWORD: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
    // Fail at startup, not when the first request reads a secret.
    validateSecrets: true,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
