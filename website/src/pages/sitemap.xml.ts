import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const projects = await getCollection("projects", ({ data }) => !data.seo?.noindex);
  const paths = ["/", "/privacy/", ...projects.map(project => `/projects/${project.id}/`)];

  const urls = paths
    .map(path => `  <url><loc>${new URL(path, site)}</loc></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
