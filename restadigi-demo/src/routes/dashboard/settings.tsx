import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { fillDashboardUi, localeDateTag, useDashboardUi, useLocale } from "@/i18n";
import { writeDemoTheme } from "@/lib/demo-theme";
import {
  formatClosedWeekdays,
  parseClosedWeekdays,
  type RestaurantSettings,
} from "@/lib/restaurant-settings-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/settings")({
  component: DashboardSettingsPage,
});

type SettingsForm = Omit<RestaurantSettings, "id" | "updatedAt">;

function normalizeForm(form: SettingsForm): SettingsForm {
  return {
    ...form,
    restaurantAddress: form.restaurantAddress?.trim() || null,
    restaurantPhone: form.restaurantPhone?.trim() || null,
    restaurantEmail: form.restaurantEmail?.trim() || null,
    cuisineType: form.cuisineType?.trim() || null,
    restaurantDescription: form.restaurantDescription?.trim() || null,
    chatbotInstructions: form.chatbotInstructions?.trim() || null,
    minPartySize: Number(form.minPartySize) || 1,
    maxPartySize: Number(form.maxPartySize) || 1,
    slotMinutes: Number(form.slotMinutes) || 30,
    maxCoversPerSlot: Number(form.maxCoversPerSlot) || 1,
    maxCoversPerEvening: Number(form.maxCoversPerEvening) || 1,
    advanceBookingDays: Number(form.advanceBookingDays) || 1,
    minNoticeHours: Number(form.minNoticeHours) || 0,
  };
}

function DashboardSettingsPage() {
  const t = useDashboardUi();
  const { locale } = useLocale();
  const [form, setForm] = useState<SettingsForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void fetch("/api/dashboard/settings", { credentials: "include" })
      .then(async (res) => {
        const data = (await res.json()) as { settings?: RestaurantSettings; error?: string };
        if (!res.ok) throw new Error(data.error ?? t.settings.loadFailed);
        const { id: _id, updatedAt: _updatedAt, ...rest } = data.settings!;
        setForm(rest);
        writeDemoTheme({
          accentColor: rest.accentColor,
          restaurantName: rest.restaurantName,
        });
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [t.settings.loadFailed]);

  function updateField<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };
      if (key === "accentColor" && typeof value === "string") {
        writeDemoTheme({
          accentColor: value,
          restaurantName: next.restaurantName,
        });
      }
      if (key === "restaurantName" && typeof value === "string") {
        writeDemoTheme({
          accentColor: next.accentColor,
          restaurantName: value,
        });
      }
      return next;
    });
    setMessage(null);
    setError(null);
  }

  function toggleClosedDay(day: string) {
    if (!form) return;
    const current = parseClosedWeekdays(form.closedWeekdays);
    const dayNum = Number(day);
    const next = current.includes(dayNum)
      ? current.filter((value) => value !== dayNum)
      : [...current, dayNum];
    updateField("closedWeekdays", formatClosedWeekdays(next));
  }

  function showFeedback(type: "success" | "error", text: string) {
    if (type === "success") {
      setMessage(text);
      setError(null);
      toast.success(t.settings.savedTitle, { description: text, duration: 6000 });
    } else {
      setError(text);
      setMessage(null);
      toast.error(t.settings.saveFailed, { description: text, duration: 8000 });
    }

    requestAnimationFrame(() => {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    const payload = normalizeForm(form);

    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { settings?: RestaurantSettings; error?: string };
      if (!res.ok) throw new Error(data.error ?? t.settings.saveFailed);

      if (!res.ok) throw new Error(data.error ?? t.settings.saveFailed);

      // Demo: apply theme even if API echoes settings without DB write
      writeDemoTheme({
        accentColor: (data.settings?.accentColor ?? payload.accentColor) as string,
        restaurantName: (data.settings?.restaurantName ?? payload.restaurantName) as string,
      });

      if (data.settings) {
        const { id: _id, updatedAt, ...rest } = data.settings;
        setForm(rest);
        const savedAt = new Date(updatedAt ?? Date.now()).toLocaleString(localeDateTag(locale));
        showFeedback("success", fillDashboardUi(t.settings.savedBody, { date: savedAt }));
      } else {
        showFeedback("success", t.settings.savedBody);
      }
    } catch (err) {
      const text = err instanceof Error ? err.message : t.settings.saveFailed;
      showFeedback("error", text);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">{t.common.loading}</p>;
  }

  if (error && !form) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!form) return null;

  const closedDays = parseClosedWeekdays(form.closedWeekdays);

  return (
    <div className="space-y-8 pb-4">
      <div>
        <h2 className="text-2xl font-medium">{t.settings.title}</h2>
        <p className="text-sm text-muted-foreground">{t.settings.subtitle}</p>
      </div>

      <section className="space-y-4 rounded-sm border border-border bg-card p-6">
        <h3 className="font-medium">{t.settings.identity}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="restaurantName">{t.settings.restaurantName}</Label>
            <Input
              id="restaurantName"
              value={form.restaurantName}
              onChange={(e) => updateField("restaurantName", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="restaurantAddress">{t.settings.address}</Label>
            <Input
              id="restaurantAddress"
              placeholder={t.settings.address}
              value={form.restaurantAddress ?? ""}
              onChange={(e) => updateField("restaurantAddress", e.target.value || null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurantPhone">{t.settings.phone}</Label>
            <Input
              id="restaurantPhone"
              placeholder="+358 40 123 4567"
              value={form.restaurantPhone ?? ""}
              onChange={(e) => updateField("restaurantPhone", e.target.value || null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurantEmail">{t.settings.email}</Label>
            <Input
              id="restaurantEmail"
              type="email"
              placeholder="varaukset@ravintola.fi"
              value={form.restaurantEmail ?? ""}
              onChange={(e) => updateField("restaurantEmail", e.target.value || null)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cuisineType">{t.settings.cuisine}</Label>
            <Input
              id="cuisineType"
              placeholder={t.settings.cuisine}
              value={form.cuisineType ?? ""}
              onChange={(e) => updateField("cuisineType", e.target.value || null)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="restaurantDescription">{t.settings.description}</Label>
            <Textarea
              id="restaurantDescription"
              rows={3}
              value={form.restaurantDescription ?? ""}
              onChange={(e) => updateField("restaurantDescription", e.target.value || null)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-sm border border-border bg-card p-6">
        <h3 className="font-medium">{t.settings.chatbotTheme}</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="chatbotWelcomeMessage">{t.settings.welcome}</Label>
            <Textarea
              id="chatbotWelcomeMessage"
              rows={3}
              value={form.chatbotWelcomeMessage}
              onChange={(e) => updateField("chatbotWelcomeMessage", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chatbotInstructions">{t.settings.instructions}</Label>
            <Textarea
              id="chatbotInstructions"
              rows={3}
              placeholder={t.settings.instructions}
              value={form.chatbotInstructions ?? ""}
              onChange={(e) => updateField("chatbotInstructions", e.target.value || null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentColor">{t.settings.accentColor}</Label>
            <div className="flex items-center gap-3">
              <Input
                id="accentColor"
                type="color"
                className="h-10 w-16 cursor-pointer p-1"
                value={form.accentColor}
                onChange={(e) => updateField("accentColor", e.target.value)}
              />
              <Input
                value={form.accentColor}
                onChange={(e) => updateField("accentColor", e.target.value)}
                className="w-28 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-sm border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-medium">{t.settings.bookingService}</h3>
            <p className="text-sm text-muted-foreground">{t.settings.bookingOffHint}</p>
          </div>
          <Switch
            checked={form.reservationsEnabled}
            onCheckedChange={(v) => updateField("reservationsEnabled", v)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <Label>{t.settings.lunch}</Label>
              <Switch
                checked={form.lunchEnabled}
                onCheckedChange={(v) => updateField("lunchEnabled", v)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t.settings.open}</Label>
                <Input
                  type="time"
                  value={form.lunchOpenTime}
                  disabled={!form.lunchEnabled}
                  onChange={(e) => updateField("lunchOpenTime", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t.settings.close}</Label>
                <Input
                  type="time"
                  value={form.lunchCloseTime}
                  disabled={!form.lunchEnabled}
                  onChange={(e) => updateField("lunchCloseTime", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <Label>{t.settings.dinner}</Label>
              <Switch
                checked={form.dinnerEnabled}
                onCheckedChange={(v) => updateField("dinnerEnabled", v)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t.settings.open}</Label>
                <Input
                  type="time"
                  value={form.dinnerOpenTime}
                  disabled={!form.dinnerEnabled}
                  onChange={(e) => updateField("dinnerOpenTime", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t.settings.close}</Label>
                <Input
                  type="time"
                  value={form.dinnerCloseTime}
                  disabled={!form.dinnerEnabled}
                  onChange={(e) => updateField("dinnerCloseTime", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t.settings.closedWeekdays}</Label>
          <div className="flex flex-wrap gap-2">
            {t.settings.weekdays.map((day) => {
              const active = closedDays.includes(Number(day.value));
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleClosedDay(day.value)}
                  className={cn(
                    "rounded-sm border px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-background text-foreground/70 hover:bg-secondary",
                  )}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-sm border border-border bg-card p-6">
        <h3 className="font-medium">{t.settings.capacityRules}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="minPartySize">{t.settings.minParty}</Label>
            <Input
              id="minPartySize"
              type="number"
              min={1}
              value={form.minPartySize}
              onChange={(e) => updateField("minPartySize", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPartySize">{t.settings.maxParty}</Label>
            <Input
              id="maxPartySize"
              type="number"
              min={1}
              value={form.maxPartySize}
              onChange={(e) => updateField("maxPartySize", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxCoversPerSlot">{t.settings.maxCoversSlot}</Label>
            <Input
              id="maxCoversPerSlot"
              type="number"
              min={1}
              value={form.maxCoversPerSlot}
              onChange={(e) => updateField("maxCoversPerSlot", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxCoversPerEvening">{t.settings.maxCoversEvening}</Label>
            <Input
              id="maxCoversPerEvening"
              type="number"
              min={1}
              value={form.maxCoversPerEvening}
              onChange={(e) => updateField("maxCoversPerEvening", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slotMinutes">{t.settings.slotMinutes}</Label>
            <Input
              id="slotMinutes"
              type="number"
              min={15}
              step={15}
              value={form.slotMinutes}
              onChange={(e) => updateField("slotMinutes", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="advanceBookingDays">{t.settings.advanceDays}</Label>
            <Input
              id="advanceBookingDays"
              type="number"
              min={1}
              value={form.advanceBookingDays}
              onChange={(e) => updateField("advanceBookingDays", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minNoticeHours">{t.settings.noticeHours}</Label>
            <Input
              id="minNoticeHours"
              type="number"
              min={0}
              value={form.minNoticeHours}
              onChange={(e) => updateField("minNoticeHours", Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-sm border border-border bg-card p-6">
        <h3 className="font-medium">{t.settings.contactRequirements}</h3>
        <p className="text-sm text-muted-foreground">{t.settings.contactHint}</p>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <Switch
              checked={form.requireEmail}
              onCheckedChange={(v) => updateField("requireEmail", v)}
            />
            <Label>{t.settings.requireEmail}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.requirePhone}
              onCheckedChange={(v) => updateField("requirePhone", v)}
            />
            <Label>{t.settings.requirePhone}</Label>
          </div>
        </div>
      </section>

      <div
        ref={feedbackRef}
        className="sticky bottom-0 z-10 -mx-2 space-y-3 rounded-sm border border-border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/90 sm:-mx-0"
      >
        {message && (
          <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <AlertTitle>{t.settings.savedTitle}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>{t.settings.saveFailed}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="button"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => void save()}
          disabled={saving}
        >
          {saving ? t.settings.saving : t.settings.save}
        </Button>
      </div>
    </div>
  );
}
