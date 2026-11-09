import type { MetadataRoute } from "next";
import { getSeasonAnime } from "@/lib/bangumi";

const seasons = ["WINTER", "SPRING", "SUMMER", "FALL"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const currentYear = new Date().getFullYear();
  // Limit the archive crawl to recent seasons with meaningful search demand.
  // Older seasons remain reachable through the archive index and season navigation.
  const years = Array.from({ length: Math.min(6, currentYear - 1960 + 1) }, (_, index) => currentYear - index);
  const results = await Promise.all(years.flatMap(year => seasons.map(async season => ({
    year,
    season,
    anime: await getSeasonAnime(year, season),
  }))));
  const populatedSeasons = results.filter(result => result.anime.length > 0);
  const animeById = new Map(populatedSeasons.flatMap(result => result.anime).map(anime => [anime.id, anime]));

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/seasons`, changeFrequency: "monthly", priority: 0.8 },
    ...populatedSeasons.map(({ year, season }) => ({
      url: `${base}/seasons/${year}/${season}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...[...animeById.values()].map(anime => ({
      url: `${base}/anime/${anime.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
