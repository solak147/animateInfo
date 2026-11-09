import Link from "next/link";

export function SiteFooter({ note }: { note?: string }) {
  return (
    <footer className="site-footer">
      {note && <p className="site-footer-note">{note}</p>}
      <div className="site-footer-main">
        <Link className="brand" href="/"><span className="brand-mark">✦</span> 新番雷達</Link>
        <p>以季度、播出日與作品資料，協助動畫觀眾找到下一部想看的作品。</p>
      </div>
      <nav className="site-footer-links" aria-label="網站資訊">
        <Link href="/guide">追番指南</Link>
        <Link href="/about">關於本站</Link>
        <Link href="/contact">聯絡我們</Link>
        <Link href="/privacy">隱私權政策</Link>
      </nav>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} 新番雷達</span>
        <span>動畫作品資料依各來源標示，本站與作品權利人無隸屬關係。</span>
      </div>
    </footer>
  );
}
