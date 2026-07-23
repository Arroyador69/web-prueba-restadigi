import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useDashboardUi } from "@/i18n";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHomePage,
});

type Stats = {
  pageViews: number;
  uniqueVisitors: number;
  chatSessions: number;
  reservations: number;
  salesLeads: number;
  viewsByDay: Array<{ day: string; views: number }>;
  topPages: Array<{ path: string; views: number }>;
};

function DashboardHomePage() {
  const t = useDashboardUi();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/dashboard/stats", { credentials: "include" })
      .then(async (res) => {
        const data = (await res.json()) as Stats & { error?: string };
        if (!res.ok) throw new Error(data.error ?? t.home.loadFailed);
        return data;
      })
      .then(setStats)
      .catch((err: Error) => setError(err.message));
  }, [t.home.loadFailed]);

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!stats) {
    return <p className="text-muted-foreground">{t.common.loading}</p>;
  }

  const cards = [
    { label: t.home.pageViews, value: stats.pageViews },
    { label: t.home.uniqueVisitors, value: stats.uniqueVisitors },
    {
      label: t.home.salesLeads,
      value: stats.salesLeads,
      to: "/dashboard/leads" as const,
    },
    { label: t.home.chatSessions, value: stats.chatSessions },
    { label: t.home.reservations, value: stats.reservations },
  ];

  return (
    <div className="space-y-8">
      <div className="dashboard-app__page-head">
        <h2 className="font-serif text-3xl tracking-tight text-[#2a2018]">{t.home.title}</h2>
        <p className="mt-1 text-sm text-[#5c534c]">{t.home.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const inner = (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a7f74]">
                {card.label}
              </p>
              <p className="mt-3 font-serif text-4xl tracking-tight text-[#2a2018]">{card.value}</p>
              <div className="mt-4 h-1 w-10 rounded-full bg-[#c46a32]/70" />
            </>
          );
          if ("to" in card && card.to) {
            return (
              <Link key={card.label} to={card.to} className="dashboard-app__stat-card block">
                {inner}
              </Link>
            );
          }
          return (
            <div key={card.label} className="dashboard-app__stat-card">
              {inner}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="dashboard-app__panel">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-[#2a2018]">
            {t.home.chartDaily}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.viewsByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8dfd4" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8a7f74" }} axisLine={false} />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#8a7f74" }}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e8dfd4",
                    boxShadow: "0 8px 24px rgba(42,32,24,0.08)",
                  }}
                />
                <Bar dataKey="views" fill="#c46a32" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-app__panel">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-[#2a2018]">
            {t.home.topPages}
          </h3>
          <ul className="space-y-2.5">
            {stats.topPages.length === 0 ? (
              <li className="text-sm text-[#8a7f74]">{t.home.noData}</li>
            ) : (
              stats.topPages.map((page) => (
                <li
                  key={page.path}
                  className="flex items-center justify-between rounded-xl border border-[#efe8e0] bg-[#fbf8f4] px-3.5 py-2.5 text-sm"
                >
                  <span className="truncate text-[#43382f]">{page.path}</span>
                  <span className="ml-4 font-semibold tabular-nums text-[#c46a32]">{page.views}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
