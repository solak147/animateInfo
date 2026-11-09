import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "追番指南：怎麼挑一部適合自己的新番",
  description: "用題材、觀看時間、故事簡介和評分脈絡挑選動畫，不必只看排行榜決定追番清單。",
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  return <main className="info-page">
    <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">✦</span> 新番雷達</Link><nav><Link href="/">首頁</Link><Link href="/seasons">歷年新番</Link><Link href="/about">關於本站</Link></nav><Link className="nav-cta" href="/seasons">瀏覽季度 <span>↗</span></Link></header>
    <article className="info-content guide-content">
      <div className="eyebrow dark-eyebrow"><span className="pulse"/> THE WATCHLIST</div>
      <h1>追番指南：挑到適合自己的作品</h1>
      <p className="info-lead">一季動畫往往同時有數十部作品。選片不一定要追排行榜第一名；先想清楚自己想看什麼、每週能花多少時間，再用簡介和資料交叉確認，通常更容易找到願意追下去的作品。</p>
      <h2>先從觀看情境開始</h2>
      <p>如果平日時間有限，可以先挑單集長度一般、每週更新一集的作品，並控制同時追看的數量。想要完整投入一段故事，則可優先看已完結作品，避免把未完結作品的等待時間誤認成自己不喜歡它。觀影時間和更新節奏是實際選擇條件，往往比「本季必看」標籤更有用。</p>
      <h2>用題材縮小範圍，再看故事核心</h2>
      <p>類型標籤適合用來初步篩選，例如冒險、日常、懸疑或科幻，但同一類型的作品也可能有完全不同的氣氛。接著讀故事簡介，留意主角的目標、主要衝突，以及作品把重心放在角色關係、解謎、競賽還是世界觀。若簡介沒有交代這些，就先看官方預告或第一集，不必只根據標籤推測整部作品。</p>
      <h2>評分可以參考，不能單獨決定</h2>
      <p>平台評分是觀眾回饋的摘要，不是作品品質的客觀測量。不同平台的使用者組成、評分人數和作品播出時間都會影響分數；新播作品的樣本尤其少，分數容易變動。比較作品時，先確認評分平台、滿分尺度與評分數量，再把分數當成「值得多看一眼」的提示，而不是直接排除低分作品的理由。</p>
      <h2>預告片適合確認風格</h2>
      <p>預告片可以快速呈現畫面風格、配樂、角色設計和剪輯節奏，適合判斷作品的氣氛是否合胃口。它通常是宣傳素材，不能完整代表劇情步調；而且有些預告會揭露重要情節。如果你很在意劇透，可以先看短版預告或只確認官方公開的製作資訊。</p>
      <h2>把候選清單縮成可維持的數量</h2>
      <p>將候選作品分成「確定想看」、「試看一集」和「之後再說」三組。看完一集後，問自己是否在意角色接下來的選擇、是否喜歡敘事節奏，以及是否期待下一集。若答案都是否定的，就先放下；追番是休閒，不需要為了補完清單勉強自己。</p>
      <h2>用季度索引回頭探索</h2>
      <p>當前季作品不合口味時，可以從<Link href="/seasons">歷年季度索引</Link>找已播出的動畫。過往作品有較完整的集數與觀眾回饋，也更容易確認是否已完結。開始前仍建議查看官方或串流平台的播出資訊，因為本站整理的來源資料可能有延遲，且不代表目前每個地區都有合法觀看管道。</p>
      <div className="guide-callout"><strong>快速檢查清單</strong><ul><li>題材和故事核心是否符合現在想看的心情？</li><li>每週更新節奏與集數是否適合自己的時間？</li><li>評分是否來自清楚的平台，且有足夠評分樣本？</li><li>預告與官方資訊是否讓自己想看第一集？</li></ul></div>
      <p className="info-updated">本文為新番雷達編輯整理，最後更新：2026 年 11 月</p>
    </article>
    <SiteFooter />
  </main>;
}
