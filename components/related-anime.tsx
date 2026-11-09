import Link from "next/link";
import type { RelatedAnime } from "@/lib/bangumi";

export function RelatedAnimeSidebar({ anime }: { anime: RelatedAnime[] }) {
  if (!anime.length) return null;
  return <aside className="related-anime-sidebar" aria-labelledby="related-anime-heading">
    <div className="eyebrow dark-eyebrow"><span className="pulse"/> RELATED</div>
    <h2 id="related-anime-heading">關聯動畫</h2>
    <div className="related-anime-list">{anime.map(item => <article className="related-anime-card" key={item.id}>
      <Link className="related-anime-main" href={`/anime/${item.id}`}>
        <img src={item.coverImage} alt={`${item.title}封面`} loading="lazy"/>
        <span><strong>{item.title}</strong><small>{item.relation}</small></span>
      </Link>
      <a className="related-anime-source" href={`https://bgm.tv/subject/${item.id}`} target="_blank" rel="noreferrer">Bangumi ↗</a>
    </article>)}</div>
  </aside>;
}
