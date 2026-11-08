import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const link = z.object({
  title: z.string(),
  url: z.url(),
});

const projects = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tags: z.array(z.string()).default([]),
      start: z.coerce.date().optional(),
      end: z.coerce.date().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      links: z.array(link).default([]),
      team: z
        .array(
          z.object({
            name: z.string(),
            role: z.string().optional(),
            comments: z.string().optional(),
            links: z.array(link).default([]),
          }),
        )
        .default([]),
      seo: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          keywords: z.array(z.string()).optional(),
          noindex: z.boolean().default(false),
          nofollow: z.boolean().default(false),
        })
        .optional(),
    }),
});

const experiences = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/experiences" }),
  schema: z.object({
    role: z.string(),
    organization: z.string(),
    location: z.string().optional(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, experiences };
