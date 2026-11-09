import type { Anime } from "@/lib/bangumi";
import Link from "next/link";

function scoreTone(score: number | null) { return score && score >= 80 ? "score-good" : "score-normal"; }
export function AnimeGrid({ anime }: { anime: Anime[] }) {
  if (!anime.length) return <div className="empty-state"><span>✧</span><strong>新番情報正在整理中</strong><p>目前無法取得 Bangumi 資料，請稍後重新整理。</p></div>;
  return <div className="anime-grid">{anime.map((item, index) => <article className="anime-card" key={item.id}><Link href={`/anime/${item.id}`} className="poster-link" aria-label={`閱讀 ${item.title} 動畫介紹`}><div className="cover-wrap"><img src={item.coverImage} alt={`${item.title} 動畫主視覺`} loading={index < 4 ? "eager" : "lazy"}/><span className="card-number">{String(index + 1).padStart(2, "0")}</span><span className="card-open">↗</span></div></Link><div className="card-info"><div className="card-meta"><span>{item.format || "動畫"}</span>{item.episodes && <><i/> {item.episodes} 話</>}<span className={`score ${scoreTone(item.score)}`}>★ {item.score ? item.score.toFixed(1) : "—"}</span></div><h3><Link href={`/anime/${item.id}`}>{item.title}</Link></h3><p>{item.description || "新番作品情報持續更新中，閱讀動畫介紹了解作品。"}</p><div className="genre-list">{item.genres.slice(0, 2).map(genre => <span key={genre}>{genre}</span>)}</div></div></article>)}</div>;
}
