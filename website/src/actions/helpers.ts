import { MAIL_FROM, MAIL_TO, SMTP_HOST, SMTP_PORT } from "astro:env/server";
import { WorkerMailer } from "worker-mailer";
import type { ContactMail } from "./models";

// Tokens are single-use and expire after 300 s.
export async function verifyTurnstile(
  secret: string,
  token: string,
  remoteip: string,
  hostname: string,
) {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip }),
    },
  );
  if (!response.ok) throw new Error(`siteverify answered ${response.status}`);

  const result: { success: boolean; hostname?: string; action?: string } =
    await response.json();
  // The test keys answer for example.com with no action.
  return (
    result.success &&
    (import.meta.env.DEV ||
      (result.hostname === hostname && result.action === "contact"))
  );
}

export async function sendContactMail(
  mail: ContactMail,
  credentials: { username: string; password: string },
) {
  await WorkerMailer.send(
    {
      host: SMTP_HOST,
      port: SMTP_PORT,
      // Always implicit TLS in production (Scaleway TEM on 465), so a
      // misconfigured port fails instead of falling back to plaintext.
      // In dev, smtp4dev speaks plain SMTP.
      secure: !import.meta.env.DEV,
      credentials,
      // Defaults to none, which fails every auth attempt.
      authType: ["plain", "login"],
    },
    {
      // A verified TEM sender. The visitor goes in Reply-To.
      from: { name: `${mail.name} (sakukarttunen.com)`, email: MAIL_FROM },
      to: MAIL_TO,
      reply: { name: mail.name, email: mail.email },
      subject: `[sakukarttunen.com] ${mail.subject ?? "New message"}`,
      text: `${mail.message}\n\n— ${mail.name} <${mail.email}>`,
    },
  );
}
