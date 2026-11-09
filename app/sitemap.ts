import type { MetadataRoute } from "next";
import { getSeasonAnime } from "@/lib/bangumi";

const seasons = ["WINTER", "SPRING", "SUMMER", "FALL"] as const;

// Build this sitemap when requested, so an external data provider cannot hold
// up Vercel's static build. Bangumi requests are cached and have an 8s timeout.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: Math.min(6, currentYear - 1960 + 1) }, (_, index) => currentYear - index);

  // Current season anime pages provide direct discovery of the site's newest
  // content. Older anime pages remain linked from their season archive pages.
  const currentAnime = await getSeasonAnime();

  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/seasons`, changeFrequency: "monthly", priority: 0.8 },
    ...years.flatMap(year => seasons.map(season => ({
      url: `${base}/seasons/${year}/${season}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))),
    ...currentAnime.map(anime => ({
      url: `${base}/anime/${anime.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
