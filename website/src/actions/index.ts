import { ActionError, defineAction } from "astro:actions";
import {
  SMTP_PASSWORD,
  SMTP_USER,
  TURNSTILE_SECRET_KEY,
} from "astro:env/server";
import { redact, sendContactMail, verifyTurnstile } from "./helpers";
import { contactSchema } from "./models";

export const server = {
  contact: defineAction({
    accept: "form",
    input: contactSchema,
    handler: async (input, { clientAddress, url }) => {
      const { "cf-turnstile-response": token, referral, ...mail } = input;

      if (referral) {
        // Fake success. Logged so false positives show up in Workers logs.
        console.warn("Contact form honeypot filled", { referral, ...redact(mail) });
        return;
      }

      // Worker secrets, so the build can't check them (see astro.config.mjs).
      if (!TURNSTILE_SECRET_KEY || !SMTP_USER || !SMTP_PASSWORD) {
        console.error("Contact form secrets are not set", redact(mail));
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR" });
      }

      let verified: boolean;
      try {
        verified = await verifyTurnstile(
          TURNSTILE_SECRET_KEY,
          token,
          clientAddress,
          url.hostname,
        );
      } catch (error) {
        console.error("Turnstile siteverify failed", error);
        throw new ActionError({ code: "SERVICE_UNAVAILABLE" });
      }
      if (!verified) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "We couldn't verify that you're human. Please try again.",
        });
      }

      try {
        await sendContactMail(mail, {
          username: SMTP_USER,
          password: SMTP_PASSWORD,
        });
      } catch (error) {
        // The message itself is lost; the visitor sees the error and can
        // retry or email directly.
        console.error("Contact form mail failed", error, redact(mail));
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR" });
      }
    },
  }),
};
