import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/dashboard/stats", { credentials: "include" })
      .then(async (res) => {
        const data = (await res.json()) as Stats & { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Tilastojen lataus epäonnistui");
        return data;
      })
      .then(setStats)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!stats) {
    return <p className="text-muted-foreground">Ladataan…</p>;
  }

  const cards = [
    { label: "Sivulataukset (30 pv)", value: stats.pageViews },
    { label: "Uniikit kävijät", value: stats.uniqueVisitors },
    {
      label: "Myyntiliidit",
      value: stats.salesLeads,
      to: "/dashboard/leads" as const,
    },
    { label: "Chat-keskustelut", value: stats.chatSessions },
    { label: "Varaukset", value: stats.reservations },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium">Yhteenveto</h2>
        <p className="text-sm text-muted-foreground">Viimeiset 30 päivää</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const inner = (
            <>
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-medium">{card.value}</p>
            </>
          );
          if ("to" in card && card.to) {
            return (
              <Link
                key={card.label}
                to={card.to}
                className="rounded-sm border border-border bg-card p-5 transition-colors hover:border-accent/50 hover:bg-accent/5"
              >
                {inner}
              </Link>
            );
          }
          return (
            <div key={card.label} className="rounded-sm border border-border bg-card p-5">
              {inner}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-sm border border-border bg-card p-5">
          <h3 className="mb-4 font-medium">Kävijät päivittäin</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.viewsByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="views" fill="oklch(0.6 0.17 40)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-sm border border-border bg-card p-5">
          <h3 className="mb-4 font-medium">Suosituimmat sivut</h3>
          <ul className="space-y-3">
            {stats.topPages.length === 0 ? (
              <li className="text-sm text-muted-foreground">Ei vielä dataa.</li>
            ) : (
              stats.topPages.map((page) => (
                <li key={page.path} className="flex items-center justify-between text-sm">
                  <span className="truncate text-foreground/80">{page.path}</span>
                  <span className="ml-4 font-medium">{page.views}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
