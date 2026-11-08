import { z } from "astro/zod";

// Also the form's `maxlength`s. EmailForm imports this module, so it must not
// import anything server-only (worker-mailer, secrets).
export const limits = { name: 100, subject: 150, message: 5000 } as const;

// With `accept: "form"`, an empty required input arrives as `null` and fails
// the type check, so the "missing" message goes on the type itself, not only
// on `.min(1)` (which catches whitespace-only input after the trim).
const line = (missing: string, max: number, label: string) =>
  z
    .string({ error: missing })
    .trim()
    .min(1, missing)
    .max(max, `Please keep the ${label} under ${max} characters.`)
    // Single-line fields end up in mail headers.
    .transform((value) => value.replace(/\s+/g, " "));

export const contactSchema = z.object({
  name: line("Please enter your name.", limits.name, "name"),
  email: z.email({
    error: (issue) =>
      issue.code === "invalid_type"
        ? "Please enter your email address."
        : "That doesn't look like an email address.",
  }),
  // Empty optional inputs arrive as `undefined`.
  subject: z
    .string()
    .trim()
    .max(
      limits.subject,
      `Please keep the subject under ${limits.subject} characters.`,
    )
    .transform((value) => value.replace(/\s+/g, " "))
    .optional(),
  message: z
    .string({ error: "Please write a message." })
    .trim()
    .min(1, "Please write a message.")
    .max(
      limits.message,
      `Please keep the message under ${limits.message} characters.`,
    ),
  // Added by the Turnstile widget. Missing means it hasn't finished yet.
  "cf-turnstile-response": z.string({
    error: "Verification hasn't finished yet. Please try again in a moment.",
  }),
  // Honeypot. Any value passes validation, so a bot never learns this field
  // is the one that tripped.
  referral: z.string().optional(),
});

/** The fields that end up in the email. */
export type ContactMail = Omit<
  z.output<typeof contactSchema>,
  "cf-turnstile-response" | "referral"
>;
