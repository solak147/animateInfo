import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimeGrid } from "@/components/anime-grid";
import { getSeasonAnime } from "@/lib/bangumi";

export const revalidate = 3600;
const labels: Record<string, string> = { WINTER: "冬季", SPRING: "春季", SUMMER: "夏季", FALL: "秋季" };
type Props = { params: Promise<{ year: string; season: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, season } = await params;
  const label = labels[season.toUpperCase()];
  if (!label || !/^\d{4}$/.test(year)) return { title: "找不到季度" };
  const title = `${year} 年${label}新番動畫列表`;
  return { title, description: `瀏覽 ${title}，查看動畫作品介紹、故事簡介、播出資訊與 Bangumi 評分。`, alternates: { canonical: `/seasons/${year}/${season.toUpperCase()}` } };
}

export default async function SeasonPage({ params }: Props) {
  const { year: yearParam, season: seasonParam } = await params;
  const year = Number(yearParam);
  const season = seasonParam.toUpperCase();
  if (!Number.isInteger(year) || year < 1960 || year > new Date().getFullYear() || !labels[season]) notFound();
  const anime = await getSeasonAnime(year, season);
  const label = labels[season];
  const currentYear = new Date().getFullYear();
  const seasonOrder = ["WINTER", "SPRING", "SUMMER", "FALL"];
  const previous = seasonOrder.indexOf(season) > 0 ? { year, season: seasonOrder[seasonOrder.indexOf(season) - 1] } : { year: year - 1, season: "FALL" };
  const next = seasonOrder.indexOf(season) < 3 ? { year, season: seasonOrder[seasonOrder.indexOf(season) + 1] } : { year: year + 1, season: "WINTER" };
  const nextAvailable = next.year < currentYear || (next.year === currentYear && seasonOrder.indexOf(next.season) <= seasonOrder.indexOf(currentSeasonKey()));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const breadcrumbData = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "首頁", item: siteUrl }, { "@type": "ListItem", position: 2, name: "歷年季度", item: `${siteUrl}/seasons` }, { "@type": "ListItem", position: 3, name: `${year} 年${label}新番`, item: `${siteUrl}/seasons/${year}/${season}` }] };
  return <main className="archive-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c") }}/><header className="topbar"><Link className="brand" href="/"><span className="brand-mark">✦</span> 新番雷達</Link><nav><Link href="/#season">本季新番</Link><Link href="/seasons">歷年新番</Link></nav><Link className="nav-cta" href="/">回到首頁 <span>↗</span></Link></header><section className="season-page-hero"><div className="detail-breadcrumb"><Link href="/">首頁</Link><span> / </span><Link href="/seasons">歷年季度</Link><span> / </span>{year} 年{label}</div><div className="eyebrow dark-eyebrow"><span className="pulse"/> SEASON ARCHIVE</div><h1>{year} 年 <em>{label}新番</em></h1><p>本季度收錄 {anime.length} 部動畫作品，依 Bangumi 評分排序。</p><div className="season-page-nav"><Link href={`/seasons/${previous.year}/${previous.season}`}>← {previous.year} {labels[previous.season]}</Link><Link href="/seasons">所有季度索引 ↗</Link>{nextAvailable && <Link href={`/seasons/${next.year}/${next.season}`}>{next.year} {labels[next.season]} →</Link>}</div></section><section className="section season-section archive-results"><AnimeGrid anime={anime}/></section><footer className="detail-footer">© 2026 新番雷達 · 作品資料由 Bangumi 提供</footer></main>;
}

function currentSeasonKey() { const month = new Date().getMonth(); return month < 3 ? "WINTER" : month < 6 ? "SPRING" : month < 9 ? "SUMMER" : "FALL"; }
