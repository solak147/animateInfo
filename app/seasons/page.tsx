import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "歷年動畫季度列表",
  description: "依年份與季度瀏覽歷年動畫新番列表，探索每一季推出的動畫作品。",
  alternates: { canonical: "/seasons" },
};

const seasons = [
  { key: "WINTER", label: "冬季" },
  { key: "SPRING", label: "春季" },
  { key: "SUMMER", label: "夏季" },
  { key: "FALL", label: "秋季" },
];

export default function SeasonsIndex() {
  const currentYear = new Date().getFullYear();
  const firstYear = 1960;
  const years = Array.from({ length: currentYear - firstYear + 1 }, (_, index) => currentYear - index);
  return <main className="archive-page"><header className="topbar"><Link className="brand" href="/"><span className="brand-mark">✦</span> 新番雷達</Link><nav><Link href="/#season">本季新番</Link><Link href="/seasons">歷年新番</Link><Link href="/#guide">追番指南</Link></nav><Link className="nav-cta" href="/">回到首頁 <span>↗</span></Link></header><section className="archive-hero"><div className="eyebrow"><span className="pulse"/> SEASON ARCHIVE</div><h1>每一季的新番，<br/><em>都值得回味。</em></h1><p>選擇年份與季度，重新探索歷年動畫作品。</p><div className="archive-legend">{seasons.map(s => <span key={s.key}><i className={`season-dot ${s.key.toLowerCase()}`}/>{s.label}</span>)}</div></section><section className="archive-years"><div className="archive-heading"><div><div className="eyebrow dark-eyebrow"><span className="pulse"/> BROWSE BY YEAR</div><h2>季度索引<span className="title-dot">.</span></h2></div><span className="archive-range">{firstYear} — {currentYear}</span></div><div className="year-list">{years.map((year, index) => <details className="year-row" key={year} open={index === 0}><summary><span className="year-number">{year}</span><span className="year-caption">年動畫季度</span><span className="year-toggle">＋</span></summary><div className="season-links">{seasons.map(s => <Link href={`/seasons/${year}/${s.key}`} key={s.key}><i className={`season-dot ${s.key.toLowerCase()}`}/>{s.label}<span>↗</span></Link>)}</div></details>)}</div></section><footer className="detail-footer">© 2026 新番雷達 · 作品資料由 Bangumi 提供</footer></main>;
}
