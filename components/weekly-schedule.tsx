"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CalendarAnime = {
  id: number;
  name: string;
  image: string;
  score: number | null;
  airDate: string;
  episodes: number | null;
};
type CalendarDay = { id: number; items: CalendarAnime[] };

const weekdays = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const fallbackImage = "https://lain.bgm.tv/img/no_icon_subject.png";

export function WeeklySchedule({ initialWeekday }: { initialWeekday: number }) {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [selectedDay, setSelectedDay] = useState(initialWeekday);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.bgm.tv/calendar", { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Bangumi returned ${response.status}`);
        return response.json();
      })
      .then((calendar: Record<string, any>[]) => {
        const parsed = calendar.map(day => ({
          id: Number(day.weekday?.id),
          items: (Array.isArray(day.items) ? day.items : []).filter((item: Record<string, any>) => item.type === 2).map((item: Record<string, any>) => ({
            id: item.id,
            name: item.name_cn || item.name || "未命名動畫",
            image: (item.images?.medium || item.images?.common || item.images?.small || fallbackImage).replace(/^http:/, "https:"),
            score: typeof item.rating?.score === "number" && item.rating.score > 0 ? item.rating.score : null,
            airDate: item.air_date || "",
            episodes: typeof item.eps === "number" && item.eps > 0 ? item.eps : null,
          })),
        })).filter(day => day.id >= 1 && day.id <= 7);
        setDays(parsed);
      })
      .catch(() => { if (!controller.signal.aborted) setFailed(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const selectedItems = days.find(day => day.id === selectedDay)?.items || [];
  return <section className="weekly-schedule" id="schedule">
    <div className="weekly-schedule-head">
      <div>
        <div className="eyebrow dark-eyebrow"><span className="pulse"/> WEEKLY AIRING</div>
        <h2>本週播放表<span>.</span></h2>
        <p>依星期查看本週播出的動畫作品。</p>
      </div>
      <a className="weekly-source" href="https://bgm.tv/calendar" target="_blank" rel="noreferrer">Bangumi 每日放送 ↗</a>
    </div>
    <div className="weekday-tabs" role="tablist" aria-label="選擇播放日">
      {weekdays.map((label, index) => {
        const id = index + 1;
        const count = days.find(day => day.id === id)?.items.length || 0;
        return <button type="button" role="tab" aria-selected={selectedDay === id} className={selectedDay === id ? "active" : ""} key={id} onClick={() => setSelectedDay(id)}>
          <span>{label}</span><small>{loading ? "…" : count}</small>
        </button>;
      })}
    </div>
    {loading ? <p className="weekly-state">正在載入本週播放資訊…</p> : failed ? <p className="weekly-state">暫時無法取得播放表，請稍後再試。</p> : selectedItems.length ? <div className="weekly-anime-list">
      {selectedItems.map(item => <Link className="weekly-anime-card" href={`/anime/${item.id}`} key={item.id}>
        <img src={item.image} alt={`${item.name}動畫封面`} loading="lazy"/>
        <span className="weekly-anime-copy"><strong>{item.name}</strong><small>{item.airDate || "本週播出"}{item.episodes ? ` · ${item.episodes} 集` : ""}</small></span>
        <span className="weekly-score">{item.score ? `★ ${item.score.toFixed(1)}` : "新作"}</span>
      </Link>)}
    </div> : <p className="weekly-state">這天沒有收錄中的動畫作品。</p>}
  </section>;
}
