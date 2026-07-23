import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { localeDateTag, useDashboardUi, useLocale } from "@/i18n";

export const Route = createFileRoute("/dashboard/visitors")({
  component: DashboardVisitorsPage,
});

type Visit = {
  id: string;
  visitorSessionId: string;
  path: string;
  referrer: string | null;
  userAgent: string | null;
  createdAt: string;
};

function DashboardVisitorsPage() {
  const t = useDashboardUi();
  const { locale } = useLocale();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/dashboard/visitors", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error(t.visitors.loadFailed);
        return res.json() as Promise<{ visits: Visit[] }>;
      })
      .then((data) => setVisits(data.visits))
      .catch((err: Error) => setError(err.message));
  }, [t.visitors.loadFailed]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium">{t.visitors.title}</h2>
        <p className="text-sm text-muted-foreground">{t.visitors.subtitle}</p>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="overflow-x-auto rounded-sm border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/50">
            <tr>
              <th className="px-4 py-3 font-medium">{t.visitors.time}</th>
              <th className="px-4 py-3 font-medium">{t.visitors.page}</th>
              <th className="px-4 py-3 font-medium">{t.visitors.referrer}</th>
              <th className="px-4 py-3 font-medium">{t.visitors.session}</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {new Date(visit.createdAt).toLocaleString(localeDateTag(locale))}
                </td>
                <td className="px-4 py-3">{visit.path}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                  {visit.referrer || t.common.dash}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {visit.visitorSessionId.slice(0, 8)}…
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
