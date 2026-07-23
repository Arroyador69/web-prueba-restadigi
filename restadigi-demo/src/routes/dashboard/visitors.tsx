import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
  const [visits, setVisits] = useState<Visit[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/dashboard/visitors", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Kävijätietojen lataus epäonnistui");
        return res.json() as Promise<{ visits: Visit[] }>;
      })
      .then((data) => setVisits(data.visits))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium">Kävijät</h2>
        <p className="text-sm text-muted-foreground">Viimeiset 100 sivulatausta (7 pv)</p>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="overflow-x-auto rounded-sm border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/50">
            <tr>
              <th className="px-4 py-3 font-medium">Aika</th>
              <th className="px-4 py-3 font-medium">Sivu</th>
              <th className="px-4 py-3 font-medium">Referrer</th>
              <th className="px-4 py-3 font-medium">Session</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {new Date(visit.createdAt).toLocaleString("fi-FI")}
                </td>
                <td className="px-4 py-3">{visit.path}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                  {visit.referrer || "—"}
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
