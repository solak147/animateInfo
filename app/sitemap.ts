import type { MetadataRoute } from "next";

// Keep sitemap generation independent of Bangumi so builds never wait on its API.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/seasons`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
