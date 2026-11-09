const endpoint = "https://api.bgm.tv/v0";
const imageFallback = "https://lain.bgm.tv/img/no_icon_subject.png";

export type Anime = {
  id: number;
  title: string;
  englishTitle: string;
  coverImage: string;
  bannerImage: string;
  description: string;
  genres: string[];
  score: number | null;
  episodes: number | null;
  format: string;
  season: string;
  seasonYear: number | null;
  siteUrl: string;
  officialUrl: string;
};
export type AnimeTrailer = { embedUrl: string; url: string };
export type AnimeTheme = { id: string; label: string; title: string; artists: string[]; videoUrl: string; videoType: string; sourceUrl: string };
export type CharacterCredit = {
  id: number;
  name: string;
  relation: string;
  image: string;
  actors: { id: number; name: string; image: string }[];
};
export type AnimeCredits = { characters: CharacterCredit[] };
export type BangumiComment = { id: number; content: string; score: number | null; author: string; url: string };
export type RelatedAnime = { id: number; title: string; coverImage: string; relation: string };

type BangumiSubject = Record<string, any>;

const seasonMonths: Record<string, number[]> = { WINTER: [1, 2, 3], SPRING: [4, 5, 6], SUMMER: [7, 8, 9], FALL: [10, 11, 12] };

function currentSeason(): { season: string; year: number } {
  const month = new Date().getUTCMonth() + 1;
  const season = month <= 3 ? "WINTER" : month <= 6 ? "SPRING" : month <= 9 ? "SUMMER" : "FALL";
  return { season, year: new Date().getUTCFullYear() };
}

function mapSubject(subject: BangumiSubject, season = "", year: number | null = null): Anime {
  const image = subject.images?.large || subject.images?.common || subject.images?.medium || subject.images?.small || imageFallback;
  const tags = Array.isArray(subject.tags) ? subject.tags.map((tag: string | { name?: string }) => typeof tag === "string" ? tag : tag.name).filter((tag): tag is string => Boolean(tag)) : [];
  const dateYear = typeof subject.date === "string" ? Number(subject.date.slice(0, 4)) : null;
  return {
    id: subject.id,
    title: subject.name_cn || subject.name || "未命名作品",
    englishTitle: subject.name || "",
    coverImage: image,
    bannerImage: "",
    description: clean(subject.summary || ""),
    genres: tags,
    score: typeof subject.rating?.score === "number" ? subject.rating.score : null,
    episodes: typeof subject.eps === "number" && subject.eps > 0 ? subject.eps : null,
    format: subject.platform || "動畫",
    season: season || seasonFromDate(subject.date),
    seasonYear: year || dateYear,
    siteUrl: `https://bgm.tv/subject/${subject.id}`,
    officialUrl: officialSite(subject.infobox),
  };
}

function officialSite(infobox: unknown): string {
  if (!Array.isArray(infobox)) return "";
  const officialKeys = new Set(["官网", "官方网站", "公式サイト", "公式ホームページ", "officialsite", "officialwebsite", "website"]);
  const item = infobox.find((entry: BangumiSubject) => {
    const key = String(entry?.key || "").toLocaleLowerCase().replace(/[\s_-]/g, "");
    return officialKeys.has(key);
  });
  if (!item) return "";
  const values = Array.isArray(item.value) ? item.value.flatMap((value: unknown) => typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value as Record<string, unknown>) : []) : [item.value];
  for (const value of values) {
    if (typeof value !== "string") continue;
    const match = value.match(/https?:\/\/[^\s<>\[\]{}"']+/i);
    if (!match) continue;
    const candidate = match[0].replace(/[),.;，。]+$/, "");
    try {
      const url = new URL(candidate);
      if (url.protocol === "http:" || url.protocol === "https:") return url.href;
    } catch { /* Ignore malformed URLs from the infobox. */ }
  }
  return "";
}

function seasonFromDate(date?: string) {
  if (!date) return "";
  const month = Number(date.slice(5, 7));
  return month <= 3 ? "WINTER" : month <= 6 ? "SPRING" : month <= 9 ? "SUMMER" : "FALL";
}

function clean(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\[url[^\]]*\]/gi, "").replace(/\[\/url\]/gi, "").replace(/\[\/?(?:b|i|u|s|quote|code)[^\]]*\]/gi, "").replace(/\s+/g, " ").trim();
}

async function request(path: string, revalidate = 3600) {
  const contact = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return fetch(`${endpoint}${path}`, {
    headers: { Accept: "application/json", "User-Agent": process.env.BANGUMI_USER_AGENT || `AnimeSeasonRadar/1.0 (${contact})` },
    signal: AbortSignal.timeout(8000),
    next: { revalidate },
  });
}

export async function getSeasonAnime(year?: number, season?: string): Promise<Anime[]> {
  const current = currentSeason();
  const selectedYear = year ?? current.year;
  const selectedSeason = season ?? current.season;
  const months = seasonMonths[selectedSeason];
  if (!Number.isInteger(selectedYear) || selectedYear < 1960 || selectedYear > current.year || !months) return [];
  try {
    const monthly = await Promise.all(months.map(async month => {
      // One ranked page per month is enough to build a useful seasonal index,
      // and avoids walking large result sets during a server render.
      const params = new URLSearchParams({ type: "2", year: String(selectedYear), month: String(month), sort: "rank", limit: "100", offset: "0" });
      const response = await request(`/subjects?${params}`, 86400);
      if (!response.ok) throw new Error(`Bangumi returned ${response.status}`);
      const result = await response.json();
      return Array.isArray(result.data) ? result.data as BangumiSubject[] : [];
    }));
    const unique = new Map<number, BangumiSubject>();
    for (const subject of monthly.flat()) if (subject?.id) unique.set(subject.id, subject);
    return [...unique.values()]
      .sort((a, b) => (b.rating?.score || 0) - (a.rating?.score || 0))
      .map(subject => mapSubject(subject, selectedSeason, selectedYear));
  } catch (error) {
    console.error("Unable to fetch Bangumi season anime", error);
    return [];
  }
}

export async function getAnimeById(id: string): Promise<Anime | null> {
  if (!/^\d+$/.test(id)) return null;
  try {
    const response = await request(`/subjects/${id}`);
    if (!response.ok) return null;
    const subject = await response.json();
    if (subject.type !== 2) return null;
    return mapSubject(subject);
  } catch (error) {
    console.error("Unable to fetch Bangumi subject detail", error);
    return null;
  }
}

export async function getAnimeCredits(id: string): Promise<AnimeCredits> {
  const empty: AnimeCredits = { characters: [] };
  if (!/^\d+$/.test(id)) return empty;
  const getList = async (path: string): Promise<Record<string, any>[]> => {
    try {
      const response = await request(path, 86400);
      if (!response.ok) return [];
      const result = await response.json();
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Unable to fetch Bangumi credits", error);
      return [];
    }
  };
  const characters = await getList(`/subjects/${id}/characters`);
  return {
    characters: characters.filter(item => item.id && item.name).map(item => ({
      id: item.id,
      name: item.name,
      relation: item.relation || "",
      image: item.images?.grid || item.images?.medium || item.images?.small || "",
      actors: (Array.isArray(item.actors) ? item.actors : []).filter((actor: Record<string, any>) => actor.id && actor.name).map((actor: Record<string, any>) => ({
        id: actor.id,
        name: actor.name,
        image: actor.images?.grid || actor.images?.medium || actor.images?.small || "",
      })),
    })),
  };
}

export async function getAnimeComments(id: string): Promise<BangumiComment[]> {
  if (!/^\d+$/.test(id)) return [];
  try {
    const contact = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(`https://next.bgm.tv/p1/subjects/${id}/comments?limit=5&offset=0`, {
      headers: { Accept: "application/json", "User-Agent": process.env.BANGUMI_USER_AGENT || `AnimeSeasonRadar/1.0 (${contact})` },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const result = await response.json();
    const rows: Record<string, any>[] = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];
    return rows.slice(0, 5).flatMap((row, index) => {
      const commentId = Number(row.id || row.comment_id);
      const content = clean(String(row.content || row.comment || row.text || ""));
      if (!content) return [];
      const author = String(row.user?.nickname || row.user?.username || row.author?.nickname || row.author?.username || row.username || "Bangumi 使用者");
      return [{
        id: Number.isFinite(commentId) ? commentId : index,
        content,
        score: Number.isFinite(Number(row.rate || row.rating || row.score)) && Number(row.rate || row.rating || row.score) > 0 ? Number(row.rate || row.rating || row.score) : null,
        author,
        url: `https://bgm.tv/subject/${id}/comments`,
      }];
    });
  } catch (error) {
    console.error("Unable to fetch Bangumi comments", error);
    return [];
  }
}

export async function getRelatedAnime(id: string): Promise<RelatedAnime[]> {
  if (!/^\d+$/.test(id)) return [];
  try {
    const response = await request(`/subjects/${id}/subjects`, 86400);
    if (!response.ok) return [];
    const rows: Record<string, any>[] = await response.json();
    return rows.filter(row => row.type === 2 && row.id && String(row.id) !== id).map(row => ({
      id: row.id,
      title: row.name_cn || row.name || "未命名作品",
      coverImage: row.images?.large || row.images?.common || row.images?.medium || row.images?.small || imageFallback,
      relation: row.relation || "相關作品",
    }));
  } catch (error) {
    console.error("Unable to fetch Bangumi related anime", error);
    return [];
  }
}

const trailerQuery = `query FindAnimeTrailer($search: String!) { Page(page: 1, perPage: 10) { media(search: $search, type: ANIME, sort: SEARCH_MATCH, isAdult: false) { id title { romaji english native } seasonYear trailer { site id } } } }`;

function normalizeTitle(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

async function findAniListAnime(anime: Anime): Promise<Record<string, any> | null> {
  const title = anime.englishTitle.trim();
  if (!title) return null;
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: trailerQuery, variables: { search: title } }),
    next: { revalidate: 86400 },
  });
  if (!response.ok) return null;
  const results = (await response.json()).data?.Page?.media || [];
  const targetNames = new Set([anime.englishTitle, anime.title].map(normalizeTitle).filter(Boolean));
  return results.find((item: Record<string, any>) => {
    const names = [item.title?.romaji, item.title?.english, item.title?.native].filter(Boolean).map(normalizeTitle);
    const exactTitleMatch = names.some((name: string) => targetNames.has(name));
    const yearMatches = !anime.seasonYear || !item.seasonYear || Math.abs(item.seasonYear - anime.seasonYear) <= 1;
    return exactTitleMatch && yearMatches;
  }) || null;
}

export async function getAnimeTrailer(anime: Anime): Promise<AnimeTrailer | null> {
  try {
    const matched = await findAniListAnime(anime);
    const trailer = matched?.trailer;
    if (!trailer?.id) return null;
    if (trailer.site?.toLowerCase() === "youtube" && /^[\w-]{6,20}$/.test(trailer.id)) {
      return { embedUrl: `https://www.youtube-nocookie.com/embed/${trailer.id}`, url: `https://www.youtube.com/watch?v=${trailer.id}` };
    }
    if (trailer.site?.toLowerCase() === "dailymotion" && /^[\w-]{3,30}$/.test(trailer.id)) {
      return { embedUrl: `https://www.dailymotion.com/embed/video/${trailer.id}`, url: `https://www.dailymotion.com/video/${trailer.id}` };
    }
    return null;
  } catch (error) {
    console.error("Unable to fetch anime trailer", error);
    return null;
  }
}

