import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { fillDashboardUi, localeDateTag, useDashboardUi, useLocale } from "@/i18n";
import { formatLocalDateKey, parseLocalDateKey } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/reservations")({
  component: DashboardReservationsPage,
});

type Reservation = {
  id: string;
  guestName: string;
  guestEmail: string | null;
  guestPhone: string | null;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  status: string;
  notes: string | null;
  source: string;
  createdAt: string;
};

function ReservationCard({
  reservation,
  updatingId,
  onUpdateStatus,
}: {
  reservation: Reservation;
  updatingId: string | null;
  onUpdateStatus: (id: string, status: "pending" | "confirmed" | "cancelled") => void;
}) {
  const t = useDashboardUi();
  const statusLabels: Record<string, string> = {
    pending: t.reservations.pending,
    confirmed: t.reservations.confirmed,
    cancelled: t.reservations.cancelled,
  };

  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">{reservation.guestName}</p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs uppercase",
            reservation.status === "confirmed"
              ? "bg-accent/20 text-accent"
              : reservation.status === "cancelled"
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground",
          )}
        >
          {statusLabels[reservation.status] ?? reservation.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-foreground/80">
        {fillDashboardUi(t.reservations.partyLine, {
          date: reservation.reservationDate,
          time: reservation.reservationTime,
          n: reservation.partySize,
        })}
      </p>
      {reservation.guestEmail && (
        <p className="mt-1 text-sm">
          <span className="text-muted-foreground">{t.reservations.email} </span>
          <a
            href={`mailto:${reservation.guestEmail}`}
            className="text-accent underline-offset-2 hover:underline"
          >
            {reservation.guestEmail}
          </a>
        </p>
      )}
      {reservation.guestPhone && (
        <p className="mt-1 text-sm text-muted-foreground">
          {t.reservations.phone} {reservation.guestPhone}
        </p>
      )}
      {reservation.notes && (
        <p className="mt-2 text-sm italic text-foreground/70">{reservation.notes}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {reservation.status !== "confirmed" && (
          <Button
            size="sm"
            variant="outline"
            disabled={updatingId === reservation.id}
            onClick={() => onUpdateStatus(reservation.id, "confirmed")}
          >
            {t.reservations.confirm}
          </Button>
        )}
        {reservation.status !== "cancelled" && (
          <Button
            size="sm"
            variant="outline"
            disabled={updatingId === reservation.id}
            onClick={() => onUpdateStatus(reservation.id, "cancelled")}
          >
            {t.reservations.cancel}
          </Button>
        )}
      </div>
    </div>
  );
}

function DashboardReservationsPage() {
  const t = useDashboardUi();
  const { locale } = useLocale();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    parseLocalDateKey(formatLocalDateKey(new Date())),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [didAutoSelect, setDidAutoSelect] = useState(false);

  const loadReservations = useCallback(async () => {
    const res = await fetch("/api/dashboard/reservations", { credentials: "include" });
    if (!res.ok) throw new Error(t.reservations.loadFailed);
    const data = (await res.json()) as { reservations: Reservation[] };
    setReservations(data.reservations);
    return data.reservations;
  }, [t.reservations.loadFailed]);

  useEffect(() => {
    void loadReservations()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loadReservations]);

  useEffect(() => {
    function refreshOnFocus() {
      void loadReservations().catch(() => undefined);
    }
    window.addEventListener("focus", refreshOnFocus);
    return () => window.removeEventListener("focus", refreshOnFocus);
  }, [loadReservations]);

  useEffect(() => {
    if (didAutoSelect || reservations.length === 0) return;

    const todayKey = formatLocalDateKey(new Date());
    const selectedKey = formatLocalDateKey(selectedDate);
    const selectedHasItems = reservations.some((r) => r.reservationDate === selectedKey);

    if (selectedHasItems) {
      setDidAutoSelect(true);
      return;
    }

    const sorted = [...reservations].sort((a, b) => {
      const byDate = a.reservationDate.localeCompare(b.reservationDate);
      return byDate !== 0 ? byDate : a.reservationTime.localeCompare(b.reservationTime);
    });

    const next =
      sorted.find((r) => r.reservationDate >= todayKey && r.status !== "cancelled") ?? sorted[0];

    if (next) {
      setSelectedDate(parseLocalDateKey(next.reservationDate));
    }
    setDidAutoSelect(true);
  }, [reservations, selectedDate, didAutoSelect]);

  async function updateStatus(id: string, status: "pending" | "confirmed" | "cancelled") {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/dashboard/reservations/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(t.reservations.statusFailed);
      const data = (await res.json()) as { reservation: Reservation };
      setReservations((prev) => prev.map((r) => (r.id === id ? data.reservation : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : t.reservations.updateFailed);
    } finally {
      setUpdatingId(null);
    }
  }

  const datesWithReservations = useMemo(() => {
    const keys = new Set(
      reservations.filter((r) => r.status !== "cancelled").map((r) => r.reservationDate),
    );
    return Array.from(keys).map((key) => parseLocalDateKey(key));
  }, [reservations]);

  const selectedDateKey = formatLocalDateKey(selectedDate);
  const dayReservations = useMemo(
    () =>
      reservations
        .filter((r) => r.reservationDate === selectedDateKey)
        .sort((a, b) => a.reservationTime.localeCompare(b.reservationTime)),
    [reservations, selectedDateKey],
  );

  const activeReservations = reservations.filter((r) => r.status !== "cancelled");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium">{t.reservations.title}</h2>
          <p className="text-sm text-muted-foreground">{t.reservations.subtitle}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setLoading(true);
            void loadReservations()
              .catch((err: Error) => setError(err.message))
              .finally(() => setLoading(false));
          }}
        >
          {t.common.refresh}
        </Button>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">{t.reservations.loading}</p>
      ) : activeReservations.length === 0 ? (
        <p className="rounded-sm border border-border bg-card p-6 text-sm text-muted-foreground">
          {t.reservations.empty}
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {fillDashboardUi(t.reservations.summary, { n: activeReservations.length })}
          </p>

          <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
            <div className="rounded-sm border border-border bg-card p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                modifiers={{ booked: datesWithReservations }}
                modifiersClassNames={{
                  booked: "bg-accent/30 font-semibold text-accent-foreground",
                }}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">
                {selectedDate.toLocaleDateString(localeDateTag(locale), {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>

              {dayReservations.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.reservations.emptyDay}</p>
              ) : (
                dayReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    updatingId={updatingId}
                    onUpdateStatus={updateStatus}
                  />
                ))
              )}
            </div>
          </div>

          <section className="space-y-3">
            <h3 className="font-medium">{t.reservations.allTitle}</h3>
            <div className="space-y-3">
              {activeReservations
                .sort((a, b) => {
                  const byDate = b.reservationDate.localeCompare(a.reservationDate);
                  return byDate !== 0 ? byDate : b.reservationTime.localeCompare(a.reservationTime);
                })
                .map((reservation) => (
                  <div key={`all-${reservation.id}`} className="space-y-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setSelectedDate(parseLocalDateKey(reservation.reservationDate))
                      }
                    >
                      {fillDashboardUi(t.reservations.showInCalendar, {
                        date: reservation.reservationDate,
                      })}
                    </Button>
                    <ReservationCard
                      reservation={reservation}
                      updatingId={updatingId}
                      onUpdateStatus={updateStatus}
                    />
                  </div>
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
