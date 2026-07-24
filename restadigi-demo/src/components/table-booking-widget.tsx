import {
  CalendarCheck2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Info,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { localeDateTag, useLocale, useMessages } from "@/i18n";
import {
  addMinutesToTime,
  BOOKING_WIDGET_CONFIG_EVENT,
  BOOKING_WIDGET_STORAGE_KEY,
  DEFAULT_BOOKING_WIDGET_CONFIG,
  generateTimeSlots,
  isDateBookable,
  readBookingWidgetConfigFromStorage,
  resolveBookingWidgetDisplay,
  writeBookingWidgetConfigToStorage,
  type BookingWidgetConfig,
  type BookingWidgetType,
} from "@/lib/booking-widget-config";
import { cn } from "@/lib/utils";

type Step = "info" | "guests" | "date" | "time" | "confirm" | "done";

const STEPS: Step[] = ["info", "guests", "date", "time", "confirm"];

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatGuestLabel(n: number, locale: string, guestsWord: string) {
  if (locale.startsWith("fi")) return `${n} hlö`;
  return `${n} ${guestsWord}`;
}

export function TableBookingWidget({ className }: { className?: string }) {
  const t = useMessages();
  const demo = t.booking.demo;
  const { locale } = useLocale();
  const dateLocale = localeDateTag(locale);

  const [config, setConfig] = useState<BookingWidgetConfig>(() =>
    structuredClone(DEFAULT_BOOKING_WIDGET_CONFIG),
  );
  const display = useMemo(() => resolveBookingWidgetDisplay(config, locale), [config, locale]);

  const [step, setStep] = useState<Step>("info");
  const [bookingTypeId, setBookingTypeId] = useState<string>("");
  const [guests, setGuests] = useState(2);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function applyConfig(next: BookingWidgetConfig) {
      setConfig(next);
      const first =
        next.locales[locale]?.bookingTypes.find((x) => x.active) ??
        next.locales.fi.bookingTypes[0];
      if (first) setBookingTypeId((prev) => prev || first.id);
      setGuests((g) => Math.min(Math.max(g, next.minGuests), next.maxGuests));
    }

    const cached = readBookingWidgetConfigFromStorage();
    if (cached) {
      applyConfig(cached);
    } else {
      const seed = structuredClone(DEFAULT_BOOKING_WIDGET_CONFIG);
      writeBookingWidgetConfigToStorage(seed);
      applyConfig(seed);
    }

    function onStorage(e: StorageEvent) {
      if (e.key !== BOOKING_WIDGET_STORAGE_KEY || !e.newValue) return;
      try {
        applyConfig(JSON.parse(e.newValue) as BookingWidgetConfig);
      } catch {
        /* ignore */
      }
    }

    function onCustom(e: Event) {
      const detail = (e as CustomEvent<BookingWidgetConfig>).detail;
      if (detail) applyConfig(detail);
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener(BOOKING_WIDGET_CONFIG_EVENT, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(BOOKING_WIDGET_CONFIG_EVENT, onCustom);
    };
  }, [locale]);

  const activeTypes = useMemo(
    () => display.bookingTypes.filter((x) => x.active),
    [display.bookingTypes],
  );

  const selectedType: BookingWidgetType | undefined =
    activeTypes.find((x) => x.id === bookingTypeId) ?? activeTypes[0];

  const slots = useMemo(() => {
    if (!selectedDate) return [];
    return generateTimeSlots(display, selectedDate);
  }, [display, selectedDate]);

  const endTime = selectedTime ? addMinutesToTime(selectedTime, display.durationMinutes) : null;

  const stepIndex = STEPS.indexOf(step === "done" ? "confirm" : step);

  function go(next: Step) {
    setStep(next);
  }

  function resetFlow() {
    setStep("info");
    setSelectedDate(null);
    setSelectedTime(null);
    setName("");
    setPhone("");
    setEmail("");
    setComment("");
    setAccepted(false);
  }

  async function confirmBooking() {
    if (!name.trim() || !email.trim() || !accepted || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    // Demo only — no persistence
    await new Promise((r) => setTimeout(r, 450));
    setSubmitting(false);
    setStep("done");
  }

  const weekdays =
    locale === "es"
      ? ["lu", "ma", "mi", "ju", "vi", "sá", "do"]
      : locale === "en"
        ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
        : ["ma", "ti", "ke", "to", "pe", "la", "su"];

  const calendarDays = useMemo(() => {
    const first = startOfMonth(month);
    // Monday-based grid
    const mondayIndex = (first.getDay() + 6) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - mondayIndex);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [month]);

  const stepperItems = [
    {
      id: "info" as const,
      icon: Info,
      label: demo.stepInfo,
      value: selectedType?.name,
    },
    {
      id: "guests" as const,
      icon: UserRound,
      label: demo.stepGuests,
      value: formatGuestLabel(guests, dateLocale, demo.guestsLabel),
    },
    {
      id: "date" as const,
      icon: CalendarDays,
      label: demo.stepDate,
      value: selectedDate
        ? selectedDate.toLocaleDateString(dateLocale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : undefined,
    },
    {
      id: "time" as const,
      icon: Clock3,
      label: demo.stepTime,
      value: selectedTime ?? undefined,
    },
    {
      id: "confirm" as const,
      icon: CalendarCheck2,
      label: demo.stepConfirm,
      value: undefined,
    },
  ];

  return (
    <section className={cn("w-full", className)}>
      <div className="mb-5 rounded-2xl border border-[#c46a32]/35 bg-gradient-to-r from-[#fff7f0] to-[#f7f3ee] px-4 py-3 sm:px-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c46a32]">
          {demo.bannerEyebrow}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[#43382f]">{demo.bannerBody}</p>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-[#e8dfd4] bg-white shadow-[0_18px_50px_rgba(42,32,24,0.08)] sm:rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-[#efe8e0] px-4 py-3 sm:px-6">
          <p className="font-medium tracking-tight text-[#2a2018]">{display.restaurantName}</p>
          <span className="rounded-full bg-[#f3eee8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7f74]">
            {demo.liveBadge}
          </span>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
          <aside className="relative hidden min-h-[420px] bg-[#2a2018] lg:block">
            <img
              src={display.brandImageUrl}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512]/90 via-[#1a1512]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="font-serif text-4xl tracking-tight text-[#f7f3ee]">
                {display.brandTitle}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c46a32]">
                {display.brandSubtitle}
              </p>
            </div>
          </aside>

          <div className="min-w-0 p-4 sm:p-6 lg:p-8">
            <nav className="mb-6 flex gap-1 overflow-x-auto pb-1" aria-label={demo.stepperAria}>
              {stepperItems.map((item, i) => {
                const Icon = item.icon;
                const active = STEPS.indexOf(item.id) === stepIndex;
                const done = STEPS.indexOf(item.id) < stepIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={step === "done" || STEPS.indexOf(item.id) > stepIndex}
                    onClick={() => {
                      if (STEPS.indexOf(item.id) <= stepIndex) go(item.id);
                    }}
                    className={cn(
                      "flex min-w-[4.5rem] flex-1 flex-col items-center gap-1.5 rounded-xl px-1.5 py-2 text-center transition-colors",
                      active ? "bg-[#f3eee8]" : "hover:bg-[#faf7f3]",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex size-9 items-center justify-center rounded-lg border",
                        active || done
                          ? "border-[#432f24] bg-[#432f24] text-white"
                          : "border-[#e8dfd4] text-[#8a7f74]",
                      )}
                    >
                      {done && !active ? <Check className="size-4" /> : <Icon className="size-4" />}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] font-medium leading-tight",
                        active ? "text-[#2a2018]" : "text-[#8a7f74]",
                      )}
                    >
                      {item.value && (done || active) ? item.value : item.label}
                    </span>
                    <span className="sr-only">
                      {i + 1}/{STEPS.length}
                    </span>
                  </button>
                );
              })}
            </nav>

            {step === "info" ? (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl tracking-tight text-[#2a2018]">
                  {demo.infoTitle}
                </h3>
                <p className="text-sm text-[#5c534c]">{demo.infoBody}</p>
                <div className="grid gap-3">
                  {activeTypes.map((type) => {
                    const selected = type.id === (selectedType?.id ?? "");
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setBookingTypeId(type.id);
                          go("guests");
                        }}
                        className={cn(
                          "rounded-2xl border px-4 py-4 text-left transition-all",
                          selected
                            ? "border-[#432f24] bg-[#f7f3ee] shadow-sm"
                            : "border-[#e8dfd4] hover:border-[#c46a32]/50",
                        )}
                      >
                        <p className="font-medium text-[#2a2018]">{type.name}</p>
                        <p className="mt-1 text-sm text-[#5c534c]">{type.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {step === "guests" ? (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl tracking-tight text-[#2a2018]">
                  {demo.guestsTitle}
                </h3>
                <div className="flex items-center justify-center gap-5 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-11 rounded-full"
                    disabled={guests <= display.minGuests}
                    onClick={() => setGuests((g) => Math.max(display.minGuests, g - 1))}
                  >
                    −
                  </Button>
                  <div className="text-center">
                    <p className="font-serif text-5xl tabular-nums text-[#2a2018]">{guests}</p>
                    <p className="mt-1 text-sm text-[#8a7f74]">{demo.guestsLabel}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-11 rounded-full"
                    disabled={guests >= display.maxGuests}
                    onClick={() => setGuests((g) => Math.min(display.maxGuests, g + 1))}
                  >
                    +
                  </Button>
                </div>
                <div className="flex justify-between gap-3">
                  <Button type="button" variant="outline" onClick={() => go("info")}>
                    {demo.back}
                  </Button>
                  <Button type="button" onClick={() => go("date")}>
                    {demo.continue}
                  </Button>
                </div>
              </div>
            ) : null}

            {step === "date" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="rounded-lg p-2 text-[#5c534c] hover:bg-[#f3eee8]"
                    onClick={() => setMonth((m) => addMonths(m, -1))}
                    aria-label={demo.prevMonth}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <h3 className="font-medium capitalize text-[#2a2018]">
                    {month.toLocaleDateString(dateLocale, { month: "long", year: "numeric" })}
                  </h3>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-[#5c534c] hover:bg-[#f3eee8]"
                    onClick={() => setMonth((m) => addMonths(m, 1))}
                    aria-label={demo.nextMonth}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-[#8a7f74]">
                  {weekdays.map((d) => (
                    <span key={d} className="py-1">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {calendarDays.map((day) => {
                    const inMonth = day.getMonth() === month.getMonth();
                    const bookable = inMonth && isDateBookable(display, day);
                    const selected = selectedDate ? sameDay(day, selectedDate) : false;
                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        disabled={!bookable}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedTime(null);
                          go("time");
                        }}
                        className={cn(
                          "aspect-square rounded-full text-sm tabular-nums transition-all",
                          !inMonth && "invisible",
                          inMonth && !bookable && "text-[#cfc7bd]",
                          bookable &&
                            !selected &&
                            "border border-[#d5dccb] text-[#2a2018] hover:border-[#432f24]",
                          selected && "bg-[#432f24] text-white shadow-md",
                        )}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
                <Button type="button" variant="outline" onClick={() => go("guests")}>
                  {demo.back}
                </Button>
              </div>
            ) : null}

            {step === "time" && selectedDate ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="rounded-lg p-2 text-[#5c534c] hover:bg-[#f3eee8]"
                    onClick={() => {
                      const prev = new Date(selectedDate);
                      prev.setDate(prev.getDate() - 1);
                      if (isDateBookable(display, prev)) {
                        setSelectedDate(prev);
                        setSelectedTime(null);
                      }
                    }}
                    aria-label={demo.prevDay}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <h3 className="text-center font-medium capitalize text-[#2a2018]">
                    {selectedDate.toLocaleDateString(dateLocale, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-[#5c534c] hover:bg-[#f3eee8]"
                    onClick={() => {
                      const next = new Date(selectedDate);
                      next.setDate(next.getDate() + 1);
                      if (isDateBookable(display, next)) {
                        setSelectedDate(next);
                        setSelectedTime(null);
                      }
                    }}
                    aria-label={demo.nextDay}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
                {slots.length === 0 ? (
                  <p className="text-sm text-[#8a7f74]">{demo.noSlots}</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {slots.map((slot) => {
                      const selected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedTime(slot);
                            go("confirm");
                          }}
                          className={cn(
                            "rounded-full px-3 py-3 text-sm font-medium tabular-nums transition-all",
                            selected ? "ring-4 ring-[#432f24]/15" : "hover:brightness-95",
                          )}
                          style={{
                            backgroundColor: display.slotAccentColor,
                            color: "#1a1512",
                            boxShadow: selected
                              ? `0 0 0 3px ${display.slotAccentColor}`
                              : undefined,
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
                <Button type="button" variant="outline" onClick={() => go("date")}>
                  {demo.back}
                </Button>
              </div>
            ) : null}

            {step === "confirm" && selectedDate && selectedTime ? (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl tracking-tight text-[#2a2018]">
                  {demo.confirmTitle}
                </h3>
                <div className="grid gap-3 rounded-2xl border border-[#efe8e0] bg-[#fbf8f4] p-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7f74]">
                      {demo.place}
                    </p>
                    <p className="mt-1 font-medium text-[#2a2018]">{display.restaurantName}</p>
                    <p className="text-[#5c534c]">{display.address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7f74]">
                      {demo.type}
                    </p>
                    <p className="mt-1 font-medium text-[#2a2018]">
                      {selectedType?.name ?? demo.normalType}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7f74]">
                      {demo.guestsLabel}
                    </p>
                    <p className="mt-1 font-medium text-[#2a2018]">
                      {formatGuestLabel(guests, dateLocale, demo.guestsLabel)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7f74]">
                      {demo.when}
                    </p>
                    <p className="mt-1 font-medium capitalize text-[#2a2018]">
                      {selectedDate.toLocaleDateString(dateLocale, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {" · "}
                      {selectedTime}
                      {display.showEndTime && endTime ? ` – ${endTime}` : ""}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="bw-name">{demo.name}</Label>
                    <Input
                      id="bw-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bw-phone">{demo.phone}</Label>
                    <Input
                      id="bw-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      placeholder="+358…"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bw-email">{demo.email}</Label>
                    <Input
                      id="bw-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="bw-comment">{demo.comment}</Label>
                    <Textarea
                      id="bw-comment"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm text-[#5c534c]">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 rounded border-[#d4cdc3]"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />
                  <span>{display.termsText || demo.termsFallback}</span>
                </label>

                <div className="flex flex-wrap justify-between gap-3">
                  <Button type="button" variant="outline" onClick={() => go("time")}>
                    {demo.back}
                  </Button>
                  <Button
                    type="button"
                    disabled={
                      submitting || !name.trim() || !email.trim() || !accepted || !phone.trim()
                    }
                    onClick={() => void confirmBooking()}
                  >
                    {submitting ? demo.sending : demo.submit}
                  </Button>
                </div>
              </div>
            ) : null}

            {step === "done" ? (
              <div className="space-y-4 py-6 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#432f24] text-white">
                  <Check className="size-7" />
                </div>
                <h3 className="font-serif text-2xl tracking-tight text-[#2a2018]">
                  {demo.successTitle}
                </h3>
                <p className="mx-auto max-w-md text-sm text-[#5c534c]">{demo.successBody}</p>
                <Button type="button" onClick={resetFlow}>
                  {demo.tryAgain}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
