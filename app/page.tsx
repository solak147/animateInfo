import Link from "next/link";
import { getSeasonAnime } from "@/lib/bangumi";
import { AnimeGrid } from "@/components/anime-grid";
import { WeeklySchedule } from "@/components/weekly-schedule";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export const revalidate = 3600;

export default async function Home() {
  const anime = await getSeasonAnime();
  const featured = anime[0];
  return (
    <main>
      <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">✦</span> 新番雷達</Link><nav><a href="#season">本季新番</a><a href="#schedule">本週播放表</a><Link href="/seasons">歷年新番</Link><a href="#guide">追番指南</a><a href="#about">關於本站</a></nav><a className="nav-cta" href="#season">探索新番 <span>↗</span></a></header>
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="pulse"/> YOUR ANIME RADAR <span className="eyebrow-line"/></div><h1>本季新番，<br/><em>一眼就掌握。</em></h1><p>從話題新作到意外神番，整理每季值得追的動畫情報。找到下一部讓你期待每週更新的作品。</p><div className="hero-actions"><a className="button-primary" href="#season">瀏覽本季新番 <span>↓</span></a><span className="season-caption">✦ {new Date().getFullYear()} 年度新番情報</span></div></div>
        <div className="hero-art" aria-label="本季動畫精選"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-sun"/><div className="art-label"><small>SEASON PICK</small><strong>{featured?.title || "本季焦點作品"}</strong><span>今季必看推薦　✦</span></div>{anime.slice(0, 4).map((item, i) => <div className={`float-poster poster-${i + 1}`} key={item.id}><img src={item.coverImage} alt={item.title}/></div>)}<div className="spark spark-a">✳</div><div className="spark spark-b">✦</div><div className="spark spark-c">✧</div><div className="art-sticker">今季<br/>精選</div></div>
      </section>
      <WeeklySchedule initialWeekday={getTaipeiWeekday()}/>
      <section className="section season-section" id="season"><div className="section-head"><div><div className="eyebrow dark-eyebrow"><span className="pulse"/> NOW SHOWING</div><h2>本季新番<span className="title-dot">.</span></h2><p>快速瀏覽正在播出的動畫，挑一部加入你的待看清單。</p></div><Link href="/seasons" className="season-select season-archive-link"><span>想看以前的季度？</span><strong>瀏覽歷年新番 <b>↗</b></strong></Link></div><AnimeGrid anime={anime}/></section>
      <section className="editorial" id="guide"><div className="editorial-art"><div className="editorial-circle">✦</div><span className="ed-note note-top">YOUR NEXT<br/>FAVORITE</span><span className="ed-note note-bottom">START HERE ↗</span><div className="ed-card"><span>本季追番指南</span><strong>選一部，<br/>開啟新旅程。</strong><span className="ed-arrow">↗</span></div></div><div className="editorial-copy"><div className="eyebrow"><span className="pulse"/> THE WATCHLIST</div><h2>不知道從哪部<br/><em>開始追？</em></h2><p>每個人的口味都不一樣。從作品類型、故事簡介到觀眾評分，幫你快速找到最對味的那一部。</p><a href="#season" className="text-link">看看本季全部作品 <span>↗</span></a></div></section>
      <footer id="about"><div className="footer-main"><Link className="brand" href="/"><span className="brand-mark">✦</span> 新番雷達</Link><p>為每一份追番熱情，找到下一個目的地。</p><span className="footer-tag">ANIME, ON YOUR RADAR.</span></div><div className="footer-bottom"><span>© 2026 新番雷達</span><span>作品資料由 Bangumi 提供</span><span>Made for anime fans ♡</span></div></footer>
    </main>
  );
}
function getTaipeiWeekday() { const day = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Asia/Taipei" }).format(new Date()); return ({ Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 } as Record<string, number>)[day] || 1; }
