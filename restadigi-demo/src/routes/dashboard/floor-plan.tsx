import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { fillDashboardUi, useDashboardUi } from "@/i18n";
import {
  DEMO_FLOOR_PLAN,
  type FloorPlan,
  type FloorTable,
  suggestTableMix,
  ZONE_LABELS,
} from "@/lib/floor-plan";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/floor-plan")({
  component: DashboardFloorPlanPage,
});

type Stats = {
  tableCount: number;
  seats: number;
  bySeats: Record<2 | 4 | 6 | 8, number>;
  capacityMatch: boolean;
};

function tableSizeClass(seats: FloorTable["seats"]) {
  switch (seats) {
    case 2:
      return "size-11 sm:size-12 text-[10px]";
    case 4:
      return "size-14 sm:size-16 text-[11px]";
    case 6:
      return "h-14 w-[4.5rem] sm:h-16 sm:w-20 text-[11px]";
    case 8:
      return "h-16 w-[5.5rem] sm:h-[4.5rem] sm:w-24 text-[11px]";
  }
}

function FloorCanvas({
  plan,
  selectedId,
  onSelect,
}: {
  plan: FloorPlan;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const t = useDashboardUi();
  const zoneLabel = (zone: FloorTable["zone"]) => t.floorPlan.zones[zone] ?? ZONE_LABELS[zone];

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-border bg-[#f3efe8]">
      {/* Soft zone hints */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22%] border-b border-dashed border-[#c46a32]/25 bg-[#c46a32]/5" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] border-t border-dashed border-[#432f24]/15 bg-[#432f24]/5" />
      <p className="pointer-events-none absolute top-2 left-3 text-[10px] uppercase tracking-[0.16em] text-[#8a8178]">
        {zoneLabel("ikkuna")}
      </p>
      <p className="pointer-events-none absolute bottom-2 left-3 text-[10px] uppercase tracking-[0.16em] text-[#8a8178]">
        {zoneLabel("terassi")} / {zoneLabel("kabinetti")}
      </p>
      <p className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[10px] uppercase tracking-[0.16em] text-[#8a8178]">
        {zoneLabel("sali")}
      </p>

      {plan.tables.map((table) => {
        const selected = selectedId === table.id;
        return (
          <button
            key={table.id}
            type="button"
            onClick={() => onSelect(selected ? null : table.id)}
            className={cn(
              "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border shadow-sm transition-transform",
              table.shape === "round" ? "rounded-full" : "rounded-md",
              tableSizeClass(table.seats),
              selected
                ? "z-10 scale-110 border-[#c46a32] bg-[#432f24] text-white"
                : "border-[#d4cdc3] bg-white text-[#1a1512] hover:border-[#c46a32] hover:scale-105",
            )}
            style={{ left: `${table.x}%`, top: `${table.y}%` }}
            title={`${fillDashboardUi(t.floorPlan.table, { label: table.label })} · ${table.seats} ${t.common.persons} · ${zoneLabel(table.zone)}`}
          >
            <span className="font-medium leading-none">{table.label}</span>
            <span className={cn("mt-0.5 leading-none opacity-70", selected && "opacity-90")}>
              {table.seats}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DashboardFloorPlanPage() {
  const t = useDashboardUi();
  const [plan, setPlan] = useState<FloorPlan>(DEMO_FLOOR_PLAN);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/dashboard/floor-plan", { credentials: "include" });
    if (!res.ok) throw new Error(t.floorPlan.loadFailed);
    const data = (await res.json()) as { plan: FloorPlan; stats: Stats };
    setPlan(data.plan);
    setStats(data.stats);
    return data;
  }, [t.floorPlan.loadFailed]);

  useEffect(() => {
    void load()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [load]);

  const selected = useMemo(
    () => plan.tables.find((t) => t.id === selectedId) ?? null,
    [plan.tables, selectedId],
  );

  const suggested = useMemo(() => suggestTableMix(plan.capacity), [plan.capacity]);

  async function resetDemo() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/dashboard/floor-plan", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true }),
      });
      if (!res.ok) throw new Error(t.floorPlan.loadFailed);
      const data = (await res.json()) as { plan: FloorPlan; stats: Stats };
      setPlan(data.plan);
      setStats(data.stats);
      setSelectedId(null);
      setMessage(t.floorPlan.resetOk);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.floorPlan.loadFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium">{t.floorPlan.title}</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t.floorPlan.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading || saving}
            onClick={() => {
              setLoading(true);
              void load()
                .catch((err: Error) => setError(err.message))
                .finally(() => setLoading(false));
            }}
          >
            {t.common.refresh}
          </Button>
          <Button variant="outline" size="sm" disabled={saving} onClick={() => void resetDemo()}>
            {t.floorPlan.resetDemo}
          </Button>
        </div>
      </div>

      {error && <p className="text-destructive">{error}</p>}
      {message && <p className="text-sm text-accent">{message}</p>}

      {loading ? (
        <p className="text-muted-foreground">{t.common.loading}</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label={t.floorPlan.seats}
              value={`${stats?.seats ?? "—"} / ${plan.capacity}`}
            />
            <StatCard
              label={t.floorPlan.tables}
              value={String(stats?.tableCount ?? plan.tables.length)}
            />
            <StatCard
              label={`2 / 4 ${t.common.persons}`}
              value={`${stats?.bySeats[2] ?? 0} × 2 · ${stats?.bySeats[4] ?? 0} × 4`}
            />
            <StatCard
              label={`6 / 8 ${t.common.persons}`}
              value={`${stats?.bySeats[6] ?? 0} × 6 · ${stats?.bySeats[8] ?? 0} × 8`}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <FloorCanvas plan={plan} selectedId={selectedId} onSelect={setSelectedId} />

            <aside className="space-y-4">
              <div className="rounded-sm border border-border bg-card p-4">
                <h3 className="font-medium">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.floorPlan.hint}</p>
              </div>

              {selected ? (
                <div className="rounded-sm border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {t.floorPlan.selected}
                  </p>
                  <p className="mt-1 text-lg font-medium">
                    {fillDashboardUi(t.floorPlan.table, { label: selected.label })}
                  </p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">{t.floorPlan.seats}</dt>
                      <dd className="font-medium">
                        {selected.seats} {t.common.persons}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">{t.floorPlan.zone}</dt>
                      <dd className="font-medium">
                        {t.floorPlan.zones[selected.zone] ?? ZONE_LABELS[selected.zone]}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">{t.floorPlan.shape}</dt>
                      <dd className="font-medium">
                        {selected.shape === "round" ? t.floorPlan.round : t.floorPlan.rect}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="rounded-sm border border-dashed border-border bg-card/50 p-4 text-sm text-muted-foreground">
                  {t.floorPlan.none}
                </div>
              )}

              <div className="rounded-sm border border-border bg-card p-4">
                <h4 className="text-sm font-medium">{t.floorPlan.tables}</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.capacity}: {suggested[2]} × 2 {t.common.persons}, {suggested[4]} × 4{" "}
                  {t.common.persons}, {suggested[6]} × 6 {t.common.persons}, {suggested[8]} × 8{" "}
                  {t.common.persons}.
                </p>
              </div>
            </aside>
          </div>

          <section className="space-y-3">
            <h3 className="font-medium">{t.floorPlan.allTables}</h3>
            <div className="overflow-x-auto rounded-sm border border-border">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">{t.floorPlan.tables}</th>
                    <th className="px-3 py-2 font-medium">{t.floorPlan.seats}</th>
                    <th className="px-3 py-2 font-medium">{t.floorPlan.zone}</th>
                    <th className="px-3 py-2 font-medium">{t.floorPlan.shape}</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.tables.map((table) => (
                    <tr
                      key={table.id}
                      className={cn(
                        "border-b border-border/70 last:border-0",
                        selectedId === table.id && "bg-accent/10",
                      )}
                    >
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          className="font-medium text-accent underline-offset-2 hover:underline"
                          onClick={() => setSelectedId(table.id)}
                        >
                          {table.label}
                        </button>
                      </td>
                      <td className="px-3 py-2 tabular-nums">
                        {table.seats} {t.common.persons}
                      </td>
                      <td className="px-3 py-2">
                        {t.floorPlan.zones[table.zone] ?? ZONE_LABELS[table.zone]}
                      </td>
                      <td className="px-3 py-2">
                        {table.shape === "round" ? t.floorPlan.round : t.floorPlan.rect}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-border bg-card px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-medium tabular-nums">{value}</p>
    </div>
  );
}
