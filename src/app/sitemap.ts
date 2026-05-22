import type { MetadataRoute } from "next";

/** Production site URL (no trailing slash). Set NEXT_PUBLIC_SITE_URL in Vercel if the domain differs. */
function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://www.siemenstechsummitsg2026.com";
  return raw.replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
