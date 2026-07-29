import { createFileRoute } from "@tanstack/react-router";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardUi } from "@/i18n";
import { LOCALE_META, type Locale } from "@/i18n/types";
import {
  DEFAULT_STAY_BOOKING_CONFIG,
  parseStayBookingConfig,
  readStayBookingConfigFromStorage,
  STAY_BOOKING_LOCALES,
  writeStayBookingConfigToStorage,
  type StayBookingConfig,
  type StayBookingLocaleCopy,
  type StayRoomType,
} from "@/lib/stay-booking-config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/stay-booking-widget")({
  component: DashboardStayBookingWidgetPage,
});

const WEEKDAY_OPTIONS = [
  { value: 1, labelKey: "mon" },
  { value: 2, labelKey: "tue" },
  { value: 3, labelKey: "wed" },
  { value: 4, labelKey: "thu" },
  { value: 5, labelKey: "fri" },
  { value: 6, labelKey: "sat" },
  { value: 0, labelKey: "sun" },
] as const;

function DashboardStayBookingWidgetPage() {
  const t = useDashboardUi();
  const bw = t.stayBookingWidget;
  const [config, setConfig] = useState<StayBookingConfig>(() =>
    structuredClone(DEFAULT_STAY_BOOKING_CONFIG),
  );
  const [editLocale, setEditLocale] = useState<Locale>("fi");
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cached = readStayBookingConfigFromStorage();
    if (cached) {
      setConfig(cached);
    } else {
      const seed = structuredClone(DEFAULT_STAY_BOOKING_CONFIG);
      writeStayBookingConfigToStorage(seed);
      setConfig(seed);
    }
    setReady(true);
  }, []);

  function updateShared<K extends keyof StayBookingConfig>(key: K, value: StayBookingConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function updateLocaleCopy<K extends keyof StayBookingLocaleCopy>(
    key: K,
    value: StayBookingLocaleCopy[K],
  ) {
    setConfig((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          [key]: value,
        },
      },
    }));
  }

  function updateRoom(index: number, patch: Partial<StayRoomType>) {
    setConfig((prev) => {
      const rooms = prev.locales[editLocale].roomTypes.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      );
      return {
        ...prev,
        locales: {
          ...prev.locales,
          [editLocale]: {
            ...prev.locales[editLocale],
            roomTypes: rooms,
          },
        },
      };
    });
  }

  function addRoom() {
    setConfig((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          roomTypes: [
            ...prev.locales[editLocale].roomTypes,
            {
              id: `room-${Date.now()}`,
              name: bw.newRoomName,
              description: "",
              priceLabel: "",
              active: true,
            },
          ],
        },
      },
    }));
  }

  function removeRoom(index: number) {
    setConfig((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          roomTypes: prev.locales[editLocale].roomTypes.filter((_, i) => i !== index),
        },
      },
    }));
  }

  function toggleClosedDay(day: number) {
    setConfig((prev) => {
      const has = prev.closedWeekdays.includes(day);
      return {
        ...prev,
        closedWeekdays: has
          ? prev.closedWeekdays.filter((d) => d !== day)
          : [...prev.closedWeekdays, day],
      };
    });
  }

  function save() {
    setSaving(true);
    try {
      const next = parseStayBookingConfig(config);
      setConfig(next);
      writeStayBookingConfigToStorage(next);
      toast.success(bw.saved);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : bw.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  if (!ready) {
    return <p className="text-muted-foreground">{t.common.loading}</p>;
  }

  const weekdayLabels: Record<string, string> = {
    mon: bw.mon,
    tue: bw.tue,
    wed: bw.wed,
    thu: bw.thu,
    fri: bw.fri,
    sat: bw.sat,
    sun: bw.sun,
  };

  const localeCopy = config.locales[editLocale];
  const localeLabel = LOCALE_META[editLocale].nativeLabel;

  return (
    <div className="space-y-8 pb-6">
      <div className="dashboard-app__page-head flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl tracking-tight text-[#2a2018]">{bw.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-[#5c534c]">{bw.subtitle}</p>
        </div>
        <Button type="button" onClick={save} disabled={saving}>
          <Save className="size-4" />
          {saving ? t.common.saving : t.common.save}
        </Button>
      </div>

      <p className="rounded-xl border border-[#c46a32]/30 bg-[#f2f2f2] px-4 py-3 text-sm text-[#43382f]">
        {bw.demoNote}
      </p>

      <section className="space-y-4 rounded-sm border border-border bg-card p-6">
        <div>
          <h3 className="font-medium">{bw.contentByLanguage}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{bw.contentByLanguageHint}</p>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label={bw.contentByLanguage}>
          {STAY_BOOKING_LOCALES.map((code) => {
            const active = editLocale === code;
            return (
              <button
                key={code}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setEditLocale(code)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#432f24] text-white"
                    : "border border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {LOCALE_META[code].nativeLabel}
              </button>
            );
          })}
        </div>

        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#c46a32]">
          {bw.editingLanguage.replace("{lang}", localeLabel)}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>{bw.propertyName}</Label>
            <Input
              value={localeCopy.propertyName}
              onChange={(e) => updateLocaleCopy("propertyName", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>{bw.address}</Label>
            <Input
              value={localeCopy.address}
              onChange={(e) => updateLocaleCopy("address", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{bw.brandTitle}</Label>
            <Input
              value={localeCopy.brandTitle}
              onChange={(e) => updateLocaleCopy("brandTitle", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{bw.brandSubtitle}</Label>
            <Input
              value={localeCopy.brandSubtitle}
              onChange={(e) => updateLocaleCopy("brandSubtitle", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-medium">{bw.rooms}</h4>
            <Button type="button" variant="outline" size="sm" onClick={addRoom}>
              <Plus className="size-4" />
              {bw.addRoom}
            </Button>
          </div>
          <div className="space-y-4">
            {localeCopy.roomTypes.map((room, index) => (
              <div
                key={`${editLocale}-${room.id}`}
                className="space-y-3 rounded-xl border border-border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={room.active}
                      onCheckedChange={(v) => updateRoom(index, { active: v })}
                    />
                    <span className="text-sm text-muted-foreground">{bw.active}</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={localeCopy.roomTypes.length <= 1}
                    onClick={() => removeRoom(index)}
                  >
                    <Trash2 className="size-3.5" />
                    {t.common.delete}
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{bw.roomName}</Label>
                    <Input
                      value={room.name}
                      onChange={(e) => updateRoom(index, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{bw.priceLabel}</Label>
                    <Input
                      value={room.priceLabel}
                      onChange={(e) => updateRoom(index, { priceLabel: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>{bw.roomDescription}</Label>
                    <Textarea
                      rows={2}
                      value={room.description}
                      onChange={(e) => updateRoom(index, { description: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <Label>{bw.terms}</Label>
          <p className="text-xs text-muted-foreground">{bw.termsHint}</p>
          <Textarea
            rows={4}
            value={localeCopy.termsText}
            onChange={(e) => updateLocaleCopy("termsText", e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-sm border border-border bg-card p-6">
        <div>
          <h3 className="font-medium">{bw.sharedSettings}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{bw.sharedSettingsHint}</p>
        </div>

        <div className="space-y-2">
          <Label>{bw.brandImageUrl}</Label>
          <Input
            value={config.brandImageUrl}
            onChange={(e) => updateShared("brandImageUrl", e.target.value)}
          />
        </div>

        <h4 className="pt-2 font-medium">{bw.rules}</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>{bw.minGuests}</Label>
            <Input
              type="number"
              min={1}
              value={config.minGuests}
              onChange={(e) => updateShared("minGuests", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>{bw.maxGuests}</Label>
            <Input
              type="number"
              min={1}
              value={config.maxGuests}
              onChange={(e) => updateShared("maxGuests", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>{bw.minNights}</Label>
            <Input
              type="number"
              min={1}
              value={config.minNights}
              onChange={(e) => updateShared("minNights", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>{bw.maxNights}</Label>
            <Input
              type="number"
              min={1}
              value={config.maxNights}
              onChange={(e) => updateShared("maxNights", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>{bw.minNoticeHours}</Label>
            <Input
              type="number"
              min={0}
              value={config.minNoticeHours}
              onChange={(e) => updateShared("minNoticeHours", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>{bw.advanceDays}</Label>
            <Input
              type="number"
              min={1}
              value={config.advanceBookingDays}
              onChange={(e) => updateShared("advanceBookingDays", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>{bw.accentColor}</Label>
            <Input
              type="color"
              className="h-10 w-20 cursor-pointer p-1"
              value={config.accentColor}
              onChange={(e) => updateShared("accentColor", e.target.value)}
            />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">{bw.closedDays}</p>
          <div className="flex flex-wrap gap-2">
            {WEEKDAY_OPTIONS.map((day) => {
              const active = config.closedWeekdays.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleClosedDay(day.value)}
                  className={
                    active
                      ? "rounded-full bg-[#432f24] px-3 py-1.5 text-xs font-medium text-white"
                      : "rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  }
                >
                  {weekdayLabels[day.labelKey]}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
