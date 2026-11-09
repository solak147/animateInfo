"use client";

import { useEffect, useState } from "react";
import type { AnimeTheme } from "@/lib/bangumi";

const query = `query FindAnimeThemes($search: String!, $first: Int!) { search(search: $search, first: $first) { anime { id title { romaji english native } year slug siteUrl animethemes(first: 100) { id slug type sequence song { title { romaji native } performances(first: 20) { artist { name { main native } } } } animethemeentries(first: 20) { videos(first: 20) { nodes { link mimetype resolution } } } } } } }`;

function normalizeTitle(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

export function AnimeThemes({ title, alternateTitle, year }: { title: string; alternateTitle: string; year: number | null }) {
  const [themes, setThemes] = useState<AnimeTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function loadThemes() {
      setLoading(true);
      const titles = [...new Set([title, alternateTitle].filter(Boolean))];
      const targets = new Set(titles.map(normalizeTitle));
      try {
        for (const search of titles) {
          const response = await fetch("https://graphql.animethemes.moe/", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ query, variables: { search, first: 10 } }),
            signal: controller.signal,
          });
          if (!response.ok) continue;
          const payload = await response.json();
          const results: Record<string, any>[] = payload.data?.search?.anime || [];
          const match = results.find(item => {
            const names = [item.title?.romaji, item.title?.english, item.title?.native].filter(Boolean).map(normalizeTitle);
            const exactTitleMatch = names.some((name: string) => targets.has(name));
            const yearMatches = !year || !item.year || Math.abs(item.year - year) <= 1;
            return exactTitleMatch && yearMatches;
          });
          if (!match) continue;

          const found: AnimeTheme[] = [];
          for (const [index, theme] of (match.animethemes || []).entries()) {
            const type = String(theme.type || "").toUpperCase();
            if (type !== "OP" && type !== "ED") continue;
            const sequence = theme.sequence || theme.slug?.match(/\d+/)?.[0] || index + 1;
            const song = theme.song || {};
            const artists = (song.performances || []).map((performance: Record<string, any>) => performance.artist?.name?.main || performance.artist?.name?.native).filter(Boolean);
            const videos = (theme.animethemeentries || []).flatMap((entry: Record<string, any>) => entry.videos?.nodes || []);
            const video = videos.find((item: Record<string, any>) => typeof item.link === "string" && item.link.startsWith("https://") && item.mimetype?.startsWith("video/"));
            found.push({
              id: `${type}-${sequence}-${theme.id || index}`,
              label: `${type}${sequence}`,
              title: song.title?.romaji || song.title?.native || "未提供歌曲名稱",
              artists,
              videoUrl: video?.link || "",
              videoType: video?.mimetype || "video/webm",
              sourceUrl: match.siteUrl || `https://animethemes.moe/anime/${encodeURIComponent(match.slug || match.id)}`,
            });
          }
          if (found.length) {
            setThemes(found);
            setLoading(false);
            return;
          }
        }
        setThemes([]);
      } catch (error) {
        if (!controller.signal.aborted) setThemes([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadThemes();
    return () => controller.abort();
  }, [title, alternateTitle, year]);

  const hasOpening = themes.some(theme => theme.label.startsWith("OP"));
  const hasEnding = themes.some(theme => theme.label.startsWith("ED"));
  const searchUrl = (kind: "OP" | "ED") => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} anime ${kind === "OP" ? "opening" : "ending"} theme`)}`;
  return <section className="anime-themes-section">
    <div className="eyebrow dark-eyebrow"><span className="pulse"/> ANIME MUSIC</div>
    <h2>片頭曲 OP・片尾曲 ED</h2>
    <div className="anime-themes-list">
      {themes.map(theme => <article className="anime-theme-card" key={theme.id}>
        <span className={`anime-theme-label ${theme.label.startsWith("ED") ? "ending" : "opening"}`}>{theme.label}</span>
        <div className="anime-theme-copy">
          <h3>{theme.title}</h3>
          {theme.artists.length > 0 && <p>{theme.artists.join("、")}</p>}
        </div>
        {theme.videoUrl && <video className="anime-theme-video" controls preload="none" playsInline aria-label={`${theme.label}：${theme.title}`}>
          <source src={theme.videoUrl} type={theme.videoType}/>
          您的瀏覽器不支援影片播放。
        </video>}
        {theme.videoUrl && <a href={theme.videoUrl} target="_blank" rel="noreferrer">另開影片 ↗</a>}
      </article>)}
    </div>
    {(!hasOpening || !hasEnding) && <div className="anime-theme-searches">
      {!hasOpening && <a href={searchUrl("OP")} target="_blank" rel="noreferrer"><span>OP</span> 搜尋片頭曲影片 ↗</a>}
      {!hasEnding && <a href={searchUrl("ED")} target="_blank" rel="noreferrer"><span>ED</span> 搜尋片尾曲影片 ↗</a>}
      {!themes.length && <p>{loading ? "正在載入 OP／ED 資訊…" : "目前沒有找到可確認的曲目資料，先用 YouTube 搜尋相關影片。"}</p>}
    </div>}
    <a className="anime-themes-source" href={themes[0]?.sourceUrl || "https://animethemes.moe/"} target="_blank" rel="noreferrer">曲目資料來源：AnimeThemes ↗</a>
  </section>;
}
