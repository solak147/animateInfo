import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "新番雷達說明網站資料處理、Cookie、第三方服務與廣告相關資訊。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <main className="info-page">
    <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">✦</span> 新番雷達</Link><nav><Link href="/">首頁</Link><Link href="/about">關於本站</Link><Link href="/contact">聯絡我們</Link></nav><Link className="nav-cta" href="/">回到首頁 <span>↗</span></Link></header>
    <article className="info-content">
      <div className="eyebrow dark-eyebrow"><span className="pulse"/> PRIVACY</div>
      <h1>隱私權政策</h1>
      <p className="info-lead">本政策說明新番雷達（以下稱「本站」）如何處理瀏覽本站時可能產生的資料，以及第三方服務可能使用的 Cookie。最後更新：2026 年 11 月。</p>
      <h2>本站收集的資料</h2>
      <p>本站目前沒有會員註冊、留言帳號或站內聯絡表單。網站伺服器或代管服務可能依其正常運作與安全需要記錄連線資訊，例如 IP 位址、瀏覽器類型、請求時間及錯誤紀錄；這些紀錄由代管服務依其政策處理。本站目前不使用自有廣告追蹤或站內分析工具。</p>
      <h2>Cookie 與 Google 廣告</h2>
      <p>本站載入 Google AdSense 廣告服務。Google 及其合作夥伴可能使用 Cookie 或類似技術，依使用者先前造訪本站或其他網站的情形提供、衡量及改善廣告。Cookie 的使用方式可能受使用者所在國家、瀏覽器設定及 Google 廣告設定影響。你可以前往 <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer">Google 廣告設定</a>管理個人化廣告，也可以參閱 <a href="https://www.aboutads.info/" target="_blank" rel="noreferrer">AboutAds.info</a> 的選擇退出資訊。即使停用個人化廣告，仍可能看到非個人化廣告。</p>
      <p>瀏覽器通常允許你拒絕或刪除 Cookie；停用 Cookie 可能影響部分第三方功能。Google 對廣告 Cookie 的說明可參閱 <a href="https://support.google.com/adsense/answer/7549925" target="_blank" rel="noreferrer">AdSense Cookie 說明</a>。</p>
      <h2>第三方服務與外部連結</h2>
      <p>本站會向 Bangumi 取得動畫資料，並可能載入外部圖片、字型、影片或歌曲資訊。當頁面載入這些資源或你點選外部連結時，第三方服務可能依其自身政策收到連線資料或設定 Cookie。本站無法控制第三方網站的資料處理方式，建議同時查看各服務的隱私權政策。</p>
      <h2>資料保留與使用者選擇</h2>
      <p>本站不會要求訪客提供敏感個人資料。若你透過公開聯絡信箱寄信，郵件內容與回覆地址只會用於處理該次詢問及必要的後續溝通。你可以透過<Link href="/contact">聯絡頁</Link>提出資料查詢或更正要求。</p>
      <h2>政策更新</h2>
      <p>本站可能因服務或適用規範變更而更新本政策。更新版本會刊載於本頁，並標示最後更新日期。</p>
      <p className="info-note">發布前請確認本站實際啟用的廣告、分析與託管服務，並依服務所在地適用的隱私法規調整本政策。</p>
    </article>
    <SiteFooter />
  </main>;
}
