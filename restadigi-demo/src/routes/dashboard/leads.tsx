import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Mail, Phone } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { fillDashboardUi, localeDateTag, useDashboardUi, useLocale } from "@/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/leads")({
  component: DashboardLeadsPage,
});

type Lead = {
  id: string;
  chatSessionId: string | null;
  name: string | null;
  company: string | null;
  phone: string;
  email: string;
  interest: string | null;
  notes: string | null;
  adminNotes: string | null;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_VALUES = ["new", "contacted", "qualified", "won", "lost"] as const;

type LeadStatus = (typeof STATUS_VALUES)[number];

function statusClass(status: string) {
  switch (status) {
    case "won":
      return "bg-accent/20 text-accent";
    case "lost":
      return "bg-destructive/10 text-destructive";
    case "contacted":
    case "qualified":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function exportCsv(
  leads: Lead[],
  t: ReturnType<typeof useDashboardUi>,
  dateLocale: string,
  statusLabels: Record<string, string>,
) {
  const header = [
    t.leads.csvName,
    t.leads.csvCompany,
    t.leads.csvPhone,
    t.leads.csvEmail,
    t.leads.csvInterest,
    t.leads.csvNotes,
    t.leads.csvAdmin,
    t.leads.csvStatus,
    t.leads.csvCreated,
  ];
  const rows = leads.map((lead) =>
    [
      lead.name ?? "",
      lead.company ?? "",
      lead.phone,
      lead.email,
      lead.interest ?? "",
      lead.notes ?? "",
      lead.adminNotes ?? "",
      statusLabels[lead.status] ?? lead.status,
      new Date(lead.createdAt).toLocaleString(dateLocale),
    ]
      .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...rows].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `restadigi-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function DashboardLeadsPage() {
  const t = useDashboardUi();
  const { locale } = useLocale();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | LeadStatus>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminNotesDraft, setAdminNotesDraft] = useState("");
  const statusOptions = [
    { value: "new", label: t.leads.statusNew },
    { value: "contacted", label: t.leads.statusContacted },
    { value: "qualified", label: t.leads.statusQualified },
    { value: "won", label: t.leads.statusWon },
    { value: "lost", label: t.leads.statusLost },
  ] as const;
  const statusLabels: Record<string, string> = Object.fromEntries(
    statusOptions.map((status) => [status.value, status.label]),
  );

  const loadLeads = useCallback(async () => {
    const res = await fetch("/api/dashboard/leads", { credentials: "include" });
    if (!res.ok) throw new Error(t.leads.loadFailed);
    const data = (await res.json()) as { leads: Lead[] };
    setLeads(data.leads);
    return data.leads;
  }, [t.leads.loadFailed]);

  useEffect(() => {
    void loadLeads()
      .then((items) => {
        if (items[0]) setSelectedId(items[0].id);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loadLeads]);

  const filtered = useMemo(
    () => (filter === "all" ? leads : leads.filter((l) => l.status === filter)),
    [filter, leads],
  );

  const selected = useMemo(
    () => leads.find((l) => l.id === selectedId) ?? null,
    [leads, selectedId],
  );

  useEffect(() => {
    setAdminNotesDraft(selected?.adminNotes ?? "");
  }, [selected?.id, selected?.adminNotes]);

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: leads.length };
    for (const status of STATUS_VALUES) {
      base[status] = leads.filter((lead) => lead.status === status).length;
    }
    return base;
  }, [leads]);

  async function updateLead(
    id: string,
    patch: { status?: LeadStatus; adminNotes?: string | null },
  ) {
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/leads/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await res.json()) as { lead?: Lead; error?: string };
      if (!res.ok) throw new Error(data.error ?? t.leads.updateFailed);
      if (data.lead) {
        setLeads((prev) => prev.map((l) => (l.id === id ? data.lead! : l)));
        toast.success(t.leads.updatedToast);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.leads.updateFailed);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">{t.common.loading}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium">{t.leads.title}</h2>
          <p className="text-sm text-muted-foreground">{t.leads.subtitle}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={leads.length === 0}
          onClick={() =>
            exportCsv(filter === "all" ? leads : filtered, t, localeDateTag(locale), statusLabels)
          }
        >
          <Download className="size-4" />
          {t.leads.exportCsv}
        </Button>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground/70 hover:text-foreground",
          )}
        >
          {t.leads.filterAll} ({counts.all})
        </button>
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filter === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground/70 hover:text-foreground",
            )}
          >
            {opt.label} ({counts[opt.value] ?? 0})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-sm border border-border bg-card p-8 text-sm text-muted-foreground">
          {t.leads.empty}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-2">
            {filtered.map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => setSelectedId(lead.id)}
                className={cn(
                  "w-full rounded-sm border p-4 text-left transition-colors",
                  selectedId === lead.id
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card hover:bg-secondary/50",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium truncate">{lead.name || lead.company || lead.email}</p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide",
                      statusClass(lead.status),
                    )}
                  >
                    {statusLabels[lead.status] ?? lead.status}
                  </span>
                </div>
                {lead.company && lead.name && (
                  <p className="mt-1 text-xs text-muted-foreground truncate">{lead.company}</p>
                )}
                <p className="mt-2 text-sm text-foreground/80 truncate">{lead.phone}</p>
                <p className="text-sm text-foreground/70 truncate">{lead.email}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(lead.createdAt).toLocaleString(localeDateTag(locale))}
                </p>
              </button>
            ))}
          </div>

          {selected && (
            <div className="rounded-sm border border-border bg-card p-6 space-y-6">
              <div>
                <h3 className="text-xl font-medium">
                  {selected.name || selected.company || t.leads.unnamed}
                </h3>
                {selected.company && selected.name && (
                  <p className="text-sm text-muted-foreground">{selected.company}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {fillDashboardUi(t.leads.created, {
                    date: new Date(selected.createdAt).toLocaleString(localeDateTag(locale)),
                  })}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${selected.phone}`}
                  className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-3 text-sm hover:bg-secondary/60"
                >
                  <Phone className="size-4 text-accent" />
                  {selected.phone}
                </a>
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(
                    `Restadigi ${t.common.dash} ${selected.interest || t.leads.title}`,
                  )}`}
                  className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-3 text-sm hover:bg-secondary/60"
                >
                  <Mail className="size-4 text-accent" />
                  {selected.email}
                </a>
              </div>

              {selected.interest && (
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">
                    {t.leads.interest}
                  </p>
                  <p className="text-sm">{selected.interest}</p>
                </div>
              )}

              {selected.notes && (
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">
                    {t.leads.visitorNotes}
                  </p>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">{selected.notes}</p>
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {t.leads.status}
                </p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      type="button"
                      size="sm"
                      variant={selected.status === opt.value ? "default" : "outline"}
                      disabled={saving || selected.status === opt.value}
                      onClick={() => void updateLead(selected.id, { status: opt.value })}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {t.leads.adminNotes}
                </p>
                <Textarea
                  value={adminNotesDraft}
                  onChange={(e) => setAdminNotesDraft(e.target.value)}
                  rows={4}
                  placeholder={t.leads.adminNotesPh}
                  className="border-border bg-background"
                />
                <Button
                  type="button"
                  size="sm"
                  className="mt-2"
                  disabled={saving || adminNotesDraft === (selected.adminNotes ?? "")}
                  onClick={() =>
                    void updateLead(selected.id, {
                      adminNotes: adminNotesDraft.trim() || null,
                    })
                  }
                >
                  {t.leads.saveNotes}
                </Button>
              </div>

              {selected.chatSessionId && (
                <p className="text-sm text-muted-foreground">
                  {t.common.dash}{" "}
                  <Link
                    to="/dashboard/conversations"
                    className="text-accent underline-offset-2 hover:underline"
                  >
                    {t.leads.openChat}
                  </Link>{" "}
                  {t.leads.sessionPrefix} {selected.chatSessionId.slice(0, 8)}…)
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
