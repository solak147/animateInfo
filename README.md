# 新番雷達

以 Next.js App Router 與 React 建立的繁體中文動畫新番介紹網站。作品基本資料來自 Bangumi API v0；詳情頁的動畫 PV 由 AniList 補充，僅在標題精確吻合時顯示。首頁採伺服器端呈現，作品頁提供獨立 metadata、canonical、TVSeries 與麵包屑結構化資料；sitemap 收錄近六年有作品的季度及對應動畫頁。

## 開發

```sh
npm install
cp .env.example .env.local
npm run dev
```

部署前請將 `.env.local` 的 `NEXT_PUBLIC_SITE_URL` 改成正式 HTTPS 網域，並將 `BANGUMI_USER_AGENT` 裡的範例 Bangumi ID 換成你的帳號 ID。Next.js 和 Bangumi 回應會快取一小時。

## 技術選擇

Quasar 是 Vue 元件框架，不能直接作為 React / Next.js 的元件庫使用。本專案保留你指定的 React 與 Next.js，使用自訂 Material 風格 CSS；若需要實際使用 Quasar 元件，需改採 Vue + Quasar，或另選 React 元件庫。
