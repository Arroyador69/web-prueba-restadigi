/** Local calendar date as YYYY-MM-DD (avoids UTC shift from toISOString). */
export function formatLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse YYYY-MM-DD as local noon (stable for calendar widgets). */
export function parseLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function isSameLocalDate(a: Date, b: Date): boolean {
  return formatLocalDateKey(a) === formatLocalDateKey(b);
}

const HELSINKI_TZ = "Europe/Helsinki";

function helsinkiParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: HELSINKI_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
    hour12: false,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour") === "24" ? "00" : get("hour"),
    minute: get("minute"),
    weekday: get("weekday"),
  };
}

/** Calendar date YYYY-MM-DD in Europe/Helsinki. */
export function formatHelsinkiDateKey(date: Date = new Date()): string {
  const p = helsinkiParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

/** Add calendar days in Europe/Helsinki and return YYYY-MM-DD. */
export function addHelsinkiDays(date: Date, days: number): string {
  const p = helsinkiParts(date);
  // Noon UTC on that calendar day, then shift by days (safe across DST for date-only)
  const base = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day) + days, 12, 0, 0);
  return formatHelsinkiDateKey(new Date(base));
}

/** JS weekday 0=Sun…6=Sat for a civil YYYY-MM-DD (timezone-independent). */
export function weekdayFromDateKey(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
}

/**
 * Normalize reservation date to YYYY-MM-DD (Europe/Helsinki).
 * Accepts ISO, DD.MM.YYYY, DD/MM/YYYY, and relative words.
 */
export function normalizeReservationDate(raw: string, now: Date = new Date()): string {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  if (lower === "tänään" || lower === "today" || lower === "hoy") {
    return formatHelsinkiDateKey(now);
  }
  if (lower === "huomenna" || lower === "tomorrow" || lower === "mañana" || lower === "manana") {
    return addHelsinkiDays(now, 1);
  }

  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  if (iso) {
    let result = `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
    // LLM often uses the wrong year; if MM-DD is still upcoming this year, fix it.
    const today = formatHelsinkiDateKey(now);
    if (result < today) {
      const thisYear = `${today.slice(0, 4)}${result.slice(4)}`;
      if (thisYear >= today) result = thisYear;
    }
    return result;
  }

  const eu = /^(\d{1,2})[./](\d{1,2})[./](\d{4})$/.exec(trimmed);
  if (eu) {
    let result = `${eu[3]}-${eu[2].padStart(2, "0")}-${eu[1].padStart(2, "0")}`;
    const today = formatHelsinkiDateKey(now);
    if (result < today) {
      const thisYear = `${today.slice(0, 4)}${result.slice(4)}`;
      if (thisYear >= today) result = thisYear;
    }
    return result;
  }

  return trimmed;
}

/** Normalize time to HH:MM (accepts 16.00, 16:00:00, 9:30, etc.). */
export function normalizeReservationTime(raw: string): string {
  const trimmed = raw.trim();
  const match = /^(\d{1,2})[.:](\d{2})(?::\d{2})?$/.exec(trimmed);
  if (!match) return trimmed;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return trimmed;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * Minutes from Helsinki "now" until the given Helsinki wall date+time.
 * Positive = future. Uses wall-clock components only (no UTC offset bugs).
 */
export function minutesUntilHelsinki(
  dateKey: string,
  timeHhMm: string,
  now: Date = new Date(),
): number {
  const date = normalizeReservationDate(dateKey, now);
  const time = normalizeReservationTime(timeHhMm);
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!dateMatch || !timeMatch) return Number.NaN;

  const n = helsinkiParts(now);
  const res = Date.UTC(
    Number(dateMatch[1]),
    Number(dateMatch[2]) - 1,
    Number(dateMatch[3]),
    Number(timeMatch[1]),
    Number(timeMatch[2]),
  );
  const cur = Date.UTC(
    Number(n.year),
    Number(n.month) - 1,
    Number(n.day),
    Number(n.hour),
    Number(n.minute),
  );
  return (res - cur) / 60_000;
}

const WEEKDAY_FI: Record<string, string> = {
  Monday: "maanantai",
  Tuesday: "tiistai",
  Wednesday: "keskiviikko",
  Thursday: "torstai",
  Friday: "perjantai",
  Saturday: "lauantai",
  Sunday: "sunnuntai",
};

/** Human-readable “now” block for chatbot system prompts (Helsinki time). */
export function formatHelsinkiNowForPrompt(date: Date = new Date()): {
  nowLabel: string;
  today: string;
  tomorrow: string;
  time: string;
  weekdayFi: string;
} {
  const p = helsinkiParts(date);
  const today = `${p.year}-${p.month}-${p.day}`;
  const tomorrow = addHelsinkiDays(date, 1);
  const time = `${p.hour.padStart(2, "0")}:${p.minute.padStart(2, "0")}`;
  const weekdayFi = WEEKDAY_FI[p.weekday] ?? p.weekday;
  const nowLabel = `${weekdayFi} ${Number(p.day)}.${Number(p.month)}.${p.year} klo ${time}`;
  return { nowLabel, today, tomorrow, time, weekdayFi };
}
