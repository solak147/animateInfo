import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "關於新番雷達",
  description: "了解新番雷達的網站目的、作品資料來源與整理方式。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <main className="info-page">
    <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">✦</span> 新番雷達</Link><nav><Link href="/">首頁</Link><Link href="/seasons">歷年新番</Link><Link href="/guide">追番指南</Link></nav><Link className="nav-cta" href="/contact">聯絡我們 <span>↗</span></Link></header>
    <article className="info-content">
      <div className="eyebrow dark-eyebrow"><span className="pulse"/> ABOUT THIS SITE</div>
      <h1>關於新番雷達</h1>
      <p className="info-lead">新番雷達是一個繁體中文動畫資訊整理網站，目標是讓觀眾更容易依季度、播出日和作品類型找到想追的動畫。</p>
      <h2>我們提供什麼</h2>
      <p>網站整理本季動畫、歷年季度索引與單部作品資訊。作品頁可能包含故事簡介、播出季度、集數、類型、評分、製作與演出資訊、預告片及相關作品，讓讀者能在同一頁先掌握基本脈絡，再前往原始資料或官方網站查閱。</p>
      <h2>資料來源與更新</h2>
      <p>動畫基本資料、評分、人物與關聯作品主要取自 <a href="https://bgm.tv/" target="_blank" rel="noreferrer">Bangumi</a>；預告片、歌曲主題曲等欄位會依頁面標示，參照 AniList、AnimeThemes 或影片平台資料。資料由來源服務提供並定期更新，可能有缺漏、延遲或標題差異。評分反映來源平台的使用者評分，不代表本站編輯評價。</p>
      <h2>編輯原則</h2>
      <p>本站將來源資料作為查找入口與作品索引，不宣稱擁有作品、圖片、影片或使用者留言的著作權。資料來源與權利資訊以各作品頁標示為準。本站的選番指南則以一般觀影方法和資訊判讀為主，不以單一平台分數替作品下定論。</p>
      <h2>資料更正</h2>
      <p>若發現作品資料錯誤、連結失效，或內容涉及權利疑慮，請透過<Link href="/contact">聯絡頁</Link>告知作品名稱、頁面網址與需要更正的欄位，我們會核對來源後處理。</p>
      <p className="info-updated">最後更新：2026 年 11 月</p>
    </article>
    <SiteFooter />
  </main>;
}
