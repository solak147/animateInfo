import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./info.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: { default: "新番雷達｜每季動畫新番整理與追番指南", template: "%s｜新番雷達" },
  description: "每季新番動畫一覽、播出時間、作品介紹與追番指南。快速找到值得看的新番，掌握本季動畫情報。",
  openGraph: { type: "website", locale: "zh_TW", siteName: "新番雷達", title: "新番雷達｜每季動畫新番整理與追番指南", description: "每季新番動畫一覽、播出時間、作品介紹與追番指南。" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7750788533596067" crossOrigin="anonymous" strategy="beforeInteractive" /></body></html>;
}
