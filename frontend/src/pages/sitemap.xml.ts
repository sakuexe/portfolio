import type { IApiContentModel, SiteContentModel } from "@/client";
import { GetChildContent, GetContent } from "@/utils/umbraco";

// https://bepyan.me/en/post/astro-sitemap/
export async function GET() {
  const root = await GetContent<SiteContentModel>("/");
  const siteContent = await GetChildContent<IApiContentModel>("/");

  const baseUrl = "https://sakukarttunen.com";

  // Build the XML
  const urls = siteContent.items
    .filter(page => !page.properties?.hideFromSitemap)
    .map(page => `
      <url>
        <loc>${baseUrl}${page.route.path}</loc>
        <lastmod>${new Date(page.updateDate).toISOString()}</lastmod>
        <changefreq>${page.properties?.changeFrequency ?? "monthly"}</changefreq>
      </url>`)
    .join("").trim();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}/</loc>
      <lastmod>${new Date(root.updateDate).toISOString()}</lastmod>
      <changefreq>${root.properties?.changeFrequency ?? "monthly"}</changefreq>
    </url>
    ${urls}
  </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
