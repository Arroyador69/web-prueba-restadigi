import {
  BedDouble,
  CalendarCheck2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Moon,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { localeDateTag, useLocale, useMessages } from "@/i18n";
import {
  addDays,
  DEFAULT_STAY_BOOKING_CONFIG,
  isCheckInBookable,
  readStayBookingConfigFromStorage,
  resolveStayBookingDisplay,
  STAY_BOOKING_CONFIG_EVENT,
  STAY_BOOKING_STORAGE_KEY,
  writeStayBookingConfigToStorage,
  type StayBookingConfig,
  type StayRoomType,
} from "@/lib/stay-booking-config";
import { cn } from "@/lib/utils";

type Step = "room" | "guests" | "checkin" | "nights" | "confirm" | "done";

const STEPS: Step[] = ["room", "guests", "checkin", "nights", "confirm"];

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

function formatGuestLabel(n: number, locale: string, word: string) {
  if (locale.startsWith("fi")) return `${n} hlö`;
  return `${n} ${word}`;
}

function formatNightsLabel(n: number, word: string) {
  return `${n} ${word}`;
}

export function StayBookingWidget({ className }: { className?: string }) {
  const t = useMessages();
  const demo = t.stayBooking.demo;
  const { locale } = useLocale();
  const dateLocale = localeDateTag(locale);

  const [config, setConfig] = useState<StayBookingConfig>(() =>
    structuredClone(DEFAULT_STAY_BOOKING_CONFIG),
  );
  const display = useMemo(() => resolveStayBookingDisplay(config, locale), [config, locale]);

  const [step, setStep] = useState<Step>("room");
  const [roomId, setRoomId] = useState("");
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [nights, setNights] = useState(2);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function applyConfig(next: StayBookingConfig) {
      setConfig(next);
      const first =
        next.locales[locale]?.roomTypes.find((x) => x.active) ?? next.locales.fi.roomTypes[0];
      if (first) setRoomId((prev) => prev || first.id);
      setGuests((g) => Math.min(Math.max(g, next.minGuests), next.maxGuests));
      setNights((n) => Math.min(Math.max(n, next.minNights), next.maxNights));
    }

    const cached = readStayBookingConfigFromStorage();
    if (cached) {
      applyConfig(cached);
    } else {
      const seed = structuredClone(DEFAULT_STAY_BOOKING_CONFIG);
      writeStayBookingConfigToStorage(seed);
      applyConfig(seed);
    }

    function onStorage(e: StorageEvent) {
      if (e.key !== STAY_BOOKING_STORAGE_KEY || !e.newValue) return;
      try {
        applyConfig(JSON.parse(e.newValue) as StayBookingConfig);
      } catch {
        /* ignore */
      }
    }

    function onCustom(e: Event) {
      const detail = (e as CustomEvent<StayBookingConfig>).detail;
      if (detail) applyConfig(detail);
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener(STAY_BOOKING_CONFIG_EVENT, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(STAY_BOOKING_CONFIG_EVENT, onCustom);
    };
  }, [locale]);

  const activeRooms = useMemo(() => display.roomTypes.filter((x) => x.active), [display.roomTypes]);

  const selectedRoom: StayRoomType | undefined =
    activeRooms.find((x) => x.id === roomId) ?? activeRooms[0];

  const checkOut = checkIn ? addDays(checkIn, nights) : null;
  const stepIndex = STEPS.indexOf(step === "done" ? "confirm" : step);

  function go(next: Step) {
    setStep(next);
  }

  function resetFlow() {
    setStep("room");
    setCheckIn(null);
    setName("");
    setPhone("");
    setEmail("");
    setComment("");
    setAccepted(false);
  }

  async function confirmBooking() {
    if (!name.trim() || !email.trim() || !accepted || !checkIn || !selectedRoom) return;
    setSubmitting(true);
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
      id: "room" as const,
      icon: BedDouble,
      label: demo.stepRoom,
      value: selectedRoom?.name,
    },
    {
      id: "guests" as const,
      icon: UserRound,
      label: demo.stepGuests,
      value: formatGuestLabel(guests, dateLocale, demo.guestsLabel),
    },
    {
      id: "checkin" as const,
      icon: CalendarDays,
      label: demo.stepCheckIn,
      value: checkIn
        ? checkIn.toLocaleDateString(dateLocale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : undefined,
    },
    {
      id: "nights" as const,
      icon: Moon,
      label: demo.stepNights,
      value: formatNightsLabel(nights, demo.nightsLabel),
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
      <div className="mb-5 rounded-2xl border border-[#c46a32]/35 bg-gradient-to-r from-[#f2f2f2] to-[#f0f0f0] px-4 py-3 sm:px-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c46a32]">
          {demo.bannerEyebrow}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[#43382f]">{demo.bannerBody}</p>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-[#d6d6d6] bg-white shadow-[0_18px_50px_rgba(42,32,24,0.08)] sm:rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-[#e6e6e6] px-4 py-3 sm:px-6">
          <p className="font-medium tracking-tight text-[#2a2018]">{display.propertyName}</p>
          <span className="rounded-full bg-[#e8e8e8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7f74]">
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
              <p className="font-serif text-4xl tracking-tight text-[#f0f0f0]">
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
                      active ? "bg-[#e8e8e8]" : "hover:bg-[#f3f3f3]",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex size-9 items-center justify-center rounded-lg border",
                        active || done
                          ? "border-[#432f24] bg-[#432f24] text-white"
                          : "border-[#d6d6d6] text-[#8a7f74]",
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

            {step === "room" ? (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl tracking-tight text-[#2a2018]">
                  {demo.roomTitle}
                </h3>
                <p className="text-sm text-[#5c534c]">{demo.roomBody}</p>
                <div className="grid gap-3">
                  {activeRooms.map((room) => {
                    const selected = room.id === (selectedRoom?.id ?? "");
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => {
                          setRoomId(room.id);
                          go("guests");
                        }}
                        className={cn(
                          "rounded-2xl border px-4 py-4 text-left transition-all",
                          selected
                            ? "border-[#432f24] bg-[#f0f0f0] shadow-sm"
                            : "border-[#d6d6d6] hover:border-[#c46a32]/50",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-medium text-[#2a2018]">{room.name}</p>
                          <span className="shrink-0 text-xs font-semibold text-[#c46a32]">
                            {room.priceLabel}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#5c534c]">{room.description}</p>
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
                  <Button type="button" variant="outline" onClick={() => go("room")}>
                    {demo.back}
                  </Button>
                  <Button type="button" onClick={() => go("checkin")}>
                    {demo.continue}
                  </Button>
                </div>
              </div>
            ) : null}

            {step === "checkin" ? (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl tracking-tight text-[#2a2018]">
                  {demo.checkInTitle}
                </h3>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="rounded-lg p-2 text-[#5c534c] hover:bg-[#e8e8e8]"
                    onClick={() => setMonth((m) => addMonths(m, -1))}
                    aria-label={demo.prevMonth}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <p className="font-medium capitalize text-[#2a2018]">
                    {month.toLocaleDateString(dateLocale, { month: "long", year: "numeric" })}
                  </p>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-[#5c534c] hover:bg-[#e8e8e8]"
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
                    const bookable = inMonth && isCheckInBookable(display, day);
                    const selected = checkIn ? sameDay(day, checkIn) : false;
                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        disabled={!bookable}
                        onClick={() => {
                          setCheckIn(day);
                          go("nights");
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

            {step === "nights" ? (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl tracking-tight text-[#2a2018]">
                  {demo.nightsTitle}
                </h3>
                {checkIn ? (
                  <p className="text-sm text-[#5c534c]">
                    {demo.checkIn}:{" "}
                    <span className="font-medium capitalize text-[#2a2018]">
                      {checkIn.toLocaleDateString(dateLocale, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </p>
                ) : null}
                <div className="flex items-center justify-center gap-5 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-11 rounded-full"
                    disabled={nights <= display.minNights}
                    onClick={() => setNights((n) => Math.max(display.minNights, n - 1))}
                  >
                    −
                  </Button>
                  <div className="text-center">
                    <p className="font-serif text-5xl tabular-nums text-[#2a2018]">{nights}</p>
                    <p className="mt-1 text-sm text-[#8a7f74]">{demo.nightsLabel}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-11 rounded-full"
                    disabled={nights >= display.maxNights}
                    onClick={() => setNights((n) => Math.min(display.maxNights, n + 1))}
                  >
                    +
                  </Button>
                </div>
                {checkOut ? (
                  <p className="text-center text-sm text-[#5c534c]">
                    {demo.checkOut}:{" "}
                    <span className="font-medium capitalize text-[#2a2018]">
                      {checkOut.toLocaleDateString(dateLocale, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </p>
                ) : null}
                <div className="flex justify-between gap-3">
                  <Button type="button" variant="outline" onClick={() => go("checkin")}>
                    {demo.back}
                  </Button>
                  <Button type="button" onClick={() => go("confirm")}>
                    {demo.continue}
                  </Button>
                </div>
              </div>
            ) : null}

            {step === "confirm" && checkIn && checkOut ? (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl tracking-tight text-[#2a2018]">
                  {demo.confirmTitle}
                </h3>
                <div className="grid gap-3 rounded-2xl border border-[#e6e6e6] bg-[#f5f5f5] p-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7f74]">
                      {demo.place}
                    </p>
                    <p className="mt-1 font-medium text-[#2a2018]">{display.propertyName}</p>
                    <p className="text-[#5c534c]">{display.address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7f74]">
                      {demo.room}
                    </p>
                    <p className="mt-1 font-medium text-[#2a2018]">
                      {selectedRoom?.name ?? demo.standardRoom}
                    </p>
                    {selectedRoom?.priceLabel ? (
                      <p className="text-[#c46a32]">{selectedRoom.priceLabel}</p>
                    ) : null}
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
                      {demo.stay}
                    </p>
                    <p className="mt-1 font-medium capitalize text-[#2a2018]">
                      {checkIn.toLocaleDateString(dateLocale, {
                        day: "numeric",
                        month: "short",
                      })}
                      {" → "}
                      {checkOut.toLocaleDateString(dateLocale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" · "}
                      {formatNightsLabel(nights, demo.nightsLabel)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="sb-name">{demo.name}</Label>
                    <Input
                      id="sb-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sb-phone">{demo.phone}</Label>
                    <Input
                      id="sb-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      placeholder="+358…"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sb-email">{demo.email}</Label>
                    <Input
                      id="sb-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="sb-comment">{demo.comment}</Label>
                    <Textarea
                      id="sb-comment"
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
                  <Button type="button" variant="outline" onClick={() => go("nights")}>
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
