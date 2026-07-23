import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, Check, ChevronLeft, ChevronRight, Phone, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/calls")({
  component: DashboardCallsPage,
});

type CallEvent = {
  id: string;
  clientName: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  scheduledAt: string;
  status: "planned" | "done" | "cancelled" | string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const WEEKDAYS = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function dayKey(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1);
}

function buildMonthCells(year: number, month: number) {
  const first = startOfMonth(year, month);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<{ date: Date; inMonth: boolean }> = [];

  for (let i = 0; i < startOffset; i++) {
    const d = new Date(year, month - 1, 1 - (startOffset - i));
    cells.push({ date: d, inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month - 1, day), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      inMonth: false,
    });
  }
  return cells;
}

function emptyForm(scheduledAt?: string) {
  return {
    clientName: "",
    contactPerson: "",
    phone: "",
    email: "",
    scheduledAt: scheduledAt ?? toLocalInputValue(new Date().toISOString()),
    notes: "",
  };
}

function DashboardCallsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [calls, setCalls] = useState<CallEvent[]>([]);
  const [upcoming, setUpcoming] = useState<CallEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState(dayKey(now));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [nextCallAt, setNextCallAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/calls?year=${year}&month=${month}`, {
        credentials: "include",
      });
      const data = (await res.json()) as {
        calls?: CallEvent[];
        upcoming?: CallEvent[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Lataus epäonnistui");
      setCalls(data.calls ?? []);
      setUpcoming(data.upcoming ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Virhe");
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const cells = useMemo(() => buildMonthCells(year, month), [year, month]);

  const callsByDay = useMemo(() => {
    const map = new Map<string, CallEvent[]>();
    for (const call of calls) {
      const key = dayKey(new Date(call.scheduledAt));
      const list = map.get(key) ?? [];
      list.push(call);
      map.set(key, list);
    }
    return map;
  }, [calls]);

  const dayCalls = useMemo(() => {
    return (callsByDay.get(selectedDay) ?? []).slice().sort((a, b) => {
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
    });
  }, [callsByDay, selectedDay]);

  const selected = calls.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) return;
    setForm({
      clientName: selected.clientName,
      contactPerson: selected.contactPerson ?? "",
      phone: selected.phone ?? "",
      email: selected.email ?? "",
      scheduledAt: toLocalInputValue(selected.scheduledAt),
      notes: selected.notes ?? "",
    });
    setNextCallAt("");
  }, [selected]);

  function shiftMonth(delta: number) {
    const d = new Date(year, month - 1 + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  }

  function selectDay(date: Date) {
    const key = dayKey(date);
    setSelectedDay(key);
    setSelectedId(null);
    setForm(emptyForm(`${key}T10:00`));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/calls", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Tallennus epäonnistui");
      toast.success("Soitto lisätty kalenteriin");
      setSelectedId(null);
      setForm(emptyForm(`${selectedDay}T10:00`));
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Virhe");
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/calls/${selected.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Päivitys epäonnistui");
      toast.success("Tallennettu");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Virhe");
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/calls/${selected.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "done",
          notes: form.notes,
          completeAndNextAt: nextCallAt || null,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Merkintä epäonnistui");
      toast.success(nextCallAt ? "Soitto tehty · seuraava lisätty" : "Soitto merkitty tehdyksi");
      setSelectedId(null);
      setNextCallAt("");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Virhe");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    if (!confirm("Poistetaanko tämä soitto?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/calls/${selected.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Poisto epäonnistui");
      toast.success("Poistettu");
      setSelectedId(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Virhe");
    } finally {
      setSaving(false);
    }
  }

  const monthLabel = startOfMonth(year, month).toLocaleDateString("fi-FI", {
    month: "long",
    year: "numeric",
  });

  if (loading && calls.length === 0) {
    return <p className="text-muted-foreground">Ladataan…</p>;
  }

  if (error) {
    return (
      <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-4 text-sm">
        {error}
        <p className="mt-2 text-muted-foreground">
          Aja Neonissa <code className="text-xs">scripts/migrate-sales-calls.sql</code> jos taulu
          puuttuu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Myynti</p>
        <h2 className="mt-1 text-2xl font-medium">Soitukalenteri</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Yksinkertainen kalenteri asiakaspuheluille: lisää soitto, kirjoita muistiinpanot ja aseta
          seuraava soittoaika. Ei raskasta CRM:ää — vain se mitä tarvitset päivässä.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <section className="rounded-sm border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => shiftMonth(-1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <h3 className="text-base font-medium capitalize">{monthLabel}</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => shiftMonth(1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1 font-medium">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map(({ date, inMonth }) => {
              const key = dayKey(date);
              const dayList = callsByDay.get(key) ?? [];
              const planned = dayList.filter((c) => c.status === "planned").length;
              const done = dayList.filter((c) => c.status === "done").length;
              const isSelected = key === selectedDay;
              const isToday = key === dayKey(new Date());

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectDay(date)}
                  className={cn(
                    "min-h-[4.25rem] rounded-sm border p-1.5 text-left transition-colors",
                    inMonth ? "border-border bg-background" : "border-transparent bg-secondary/30",
                    isSelected && "border-accent ring-1 ring-accent/40",
                    isToday && !isSelected && "border-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      inMonth ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {date.getDate()}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {planned > 0 ? (
                      <span className="block truncate rounded-sm bg-accent/15 px-1 text-[10px] text-accent">
                        {planned} soitto
                      </span>
                    ) : null}
                    {done > 0 ? (
                      <span className="block truncate rounded-sm bg-muted px-1 text-[10px] text-muted-foreground">
                        {done} tehty
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-sm border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-accent" />
              <h3 className="font-medium">
                {new Date(selectedDay).toLocaleDateString("fi-FI", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h3>
            </div>
            {dayCalls.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ei soittoja tälle päivälle.</p>
            ) : (
              <ul className="space-y-2">
                {dayCalls.map((call) => (
                  <li key={call.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(call.id)}
                      className={cn(
                        "w-full rounded-sm border px-3 py-2 text-left text-sm transition-colors",
                        selectedId === call.id
                          ? "border-accent bg-accent/10"
                          : "border-border hover:bg-secondary/50",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{call.clientName}</span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {new Date(call.scheduledAt).toLocaleTimeString("fi-FI", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {call.status === "planned"
                          ? "Suunniteltu"
                          : call.status === "done"
                            ? "Tehty"
                            : call.status}
                        {call.notes ? ` · ${call.notes.slice(0, 60)}` : ""}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-sm border border-border bg-card p-4 space-y-3">
            <h3 className="font-medium text-sm">Seuraavat soitot</h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ei tulevia soittoja.</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.slice(0, 6).map((call) => (
                  <li key={call.id} className="text-sm">
                    <button
                      type="button"
                      className="w-full text-left hover:text-accent"
                      onClick={() => {
                        const d = new Date(call.scheduledAt);
                        setYear(d.getFullYear());
                        setMonth(d.getMonth() + 1);
                        setSelectedDay(dayKey(d));
                        setSelectedId(call.id);
                      }}
                    >
                      <span className="font-medium">{call.clientName}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {new Date(call.scheduledAt).toLocaleString("fi-FI", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-sm border border-border bg-card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <CalendarPlus className="size-4 text-accent" />
          <h3 className="font-medium">
            {selected ? "Muokkaa soittoa / muistiinpanoja" : "Lisää soitto kalenteriin"}
          </h3>
        </div>

        <form
          onSubmit={(e) => {
            if (selected) {
              e.preventDefault();
              void handleSave();
              return;
            }
            void handleCreate(e);
          }}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Asiakas / yritys</Label>
              <Input
                id="clientName"
                required
                value={form.clientName}
                onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                placeholder="Ravintola Example Oy"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Yhteyshenkilö</Label>
              <Input
                id="contactPerson"
                value={form.contactPerson}
                onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))}
                placeholder="Matti Meikäläinen"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Puhelin</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+358…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Soittoaika</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                required
                value={form.scheduledAt}
                onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Muistiinpanot (mitä puhuttiin / mitä tehdä)</Label>
            <Textarea
              id="notes"
              rows={5}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder={"• Tarve: verkkosivut + pöytävaraus\n• Budjetti:\n• Seuraava askel:"}
            />
          </div>

          {selected && selected.status === "planned" ? (
            <div className="space-y-2 rounded-sm border border-dashed border-border p-3">
              <Label htmlFor="nextCallAt">Merkitse tehdyksi + seuraava soitto (valinnainen)</Label>
              <Input
                id="nextCallAt"
                type="datetime-local"
                value={nextCallAt}
                onChange={(e) => setNextCallAt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Jos täytät ajan, nykyinen soitto merkitään tehdyksi ja uusi ilmestyy kalenteriin.
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {selected ? (
              <>
                <Button type="submit" disabled={saving}>
                  Tallenna muutokset
                </Button>
                {selected.status === "planned" ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving}
                    onClick={() => void handleComplete()}
                  >
                    <Check className="size-4" />
                    Merkitse tehdyksi
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => void handleDelete()}
                >
                  <Trash2 className="size-4" />
                  Poista
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setSelectedId(null);
                    setForm(emptyForm(`${selectedDay}T10:00`));
                    setNextCallAt("");
                  }}
                >
                  Peruuta
                </Button>
              </>
            ) : (
              <Button type="submit" disabled={saving}>
                <CalendarPlus className="size-4" />
                {saving ? "Tallennetaan…" : "Lisää kalenteriin"}
              </Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
