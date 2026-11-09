import type { MetadataRoute } from "next";
import { getSeasonAnime } from "@/lib/bangumi";

// Refresh the sitemap daily without making every historical season query part
// of the build. The archive index links to older seasons for crawlers.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
  const anime = await getSeasonAnime();

  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/seasons`, changeFrequency: "monthly", priority: 0.8 },
    ...anime.map(item => ({
      url: `${base}/anime/${item.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
