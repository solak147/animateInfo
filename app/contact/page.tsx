import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "聯絡新番雷達",
  description: "聯絡新番雷達回報作品資料錯誤、失效連結或權利相關問題。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return <main className="info-page">
    <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">✦</span> 新番雷達</Link><nav><Link href="/">首頁</Link><Link href="/about">關於本站</Link><Link href="/privacy">隱私權政策</Link></nav><Link className="nav-cta" href="/seasons">瀏覽新番 <span>↗</span></Link></header>
    <article className="info-content contact-content">
      <div className="eyebrow dark-eyebrow"><span className="pulse"/> CONTACT</div>
      <h1>聯絡我們</h1>
      <p className="info-lead">歡迎回報作品資料錯誤、失效連結、隱私疑問或權利相關問題。請附上頁面網址、作品名稱與需要處理的內容，方便我們核對。</p>
      <section className="contact-card">
        <h2>電子郵件</h2>
        {email ? <p><a href={`mailto:${email}`}>{email}</a></p> : <p className="info-note">聯絡信箱尚未設定。網站管理者請設定環境變數 <code>NEXT_PUBLIC_CONTACT_EMAIL</code>，並在正式部署後確認信箱可正常收件。</p>}
      </section>
      <h2>資料來源問題</h2>
      <p>本站作品基本資料主要來自 Bangumi。若原始條目本身有誤，也可以前往 <a href="https://bgm.tv/" target="_blank" rel="noreferrer">Bangumi</a> 查看或回報；本站頁面顯示內容可能需要等來源更新後才同步。</p>
      <p>我們會依可用資訊核對回報；收到訊息不代表能立即修正來源平台上的資料。</p>
    </article>
    <SiteFooter />
  </main>;
}
