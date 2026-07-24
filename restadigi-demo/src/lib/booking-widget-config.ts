/** Online table-booking widget config (Restadigi product demo on marketing + dashboard). */

import type { Locale } from "@/i18n/types";
import { LOCALES } from "@/i18n/types";

export type BookingWidgetType = {
  id: string;
  name: string;
  description: string;
  active: boolean;
};

/** Locale-specific copy shown on the public booking widget. */
export type BookingWidgetLocaleCopy = {
  restaurantName: string;
  address: string;
  brandTitle: string;
  brandSubtitle: string;
  bookingTypes: BookingWidgetType[];
  termsText: string;
};

export type BookingWidgetConfig = {
  /** Shared brand image for all languages. */
  brandImageUrl: string;
  /** Per-language restaurant identity, types and terms. */
  locales: Record<Locale, BookingWidgetLocaleCopy>;
  minGuests: number;
  maxGuests: number;
  /** Reservation length in minutes (e.g. 150 = 2h30). */
  durationMinutes: number;
  /** Slot grid interval in minutes. */
  slotIntervalMinutes: number;
  /** Opening time "HH:mm" */
  openTime: string;
  /** Last start time "HH:mm" */
  lastStartTime: string;
  /** 0=Sun … 6=Sat — closed days */
  closedWeekdays: number[];
  minNoticeHours: number;
  advanceBookingDays: number;
  slotAccentColor: string;
  showEndTime: boolean;
};

/** Flat view used by the public widget for one language. */
export type BookingWidgetDisplay = BookingWidgetLocaleCopy &
  Pick<
    BookingWidgetConfig,
    | "brandImageUrl"
    | "minGuests"
    | "maxGuests"
    | "durationMinutes"
    | "slotIntervalMinutes"
    | "openTime"
    | "lastStartTime"
    | "closedWeekdays"
    | "minNoticeHours"
    | "advanceBookingDays"
    | "slotAccentColor"
    | "showEndTime"
  >;

export const BOOKING_WIDGET_STORAGE_KEY = "restadigi-booking-widget-config-v3";
export const BOOKING_WIDGET_CONFIG_EVENT = "restadigi-booking-widget-config";

const SHOWCASE_TYPES_FI: BookingWidgetType[] = [
  {
    id: "salon",
    name: "Sali",
    description: "Pöytä pääruokasalissa — rentoutunut fine dining -tunnelma.",
    active: true,
  },
  {
    id: "bar",
    name: "Baari & lounge",
    description: "Paikka baaritiskiltä tai lounge-alueelta.",
    active: true,
  },
];

const SHOWCASE_TYPES_EN: BookingWidgetType[] = [
  {
    id: "salon",
    name: "Dining room",
    description: "A table in the main room — relaxed fine-dining atmosphere.",
    active: true,
  },
  {
    id: "bar",
    name: "Bar & lounge",
    description: "A seat at the bar or in the lounge area.",
    active: true,
  },
];

const SHOWCASE_TYPES_ES: BookingWidgetType[] = [
  {
    id: "salon",
    name: "Salón",
    description: "Mesa en el comedor principal — ambiente de fine dining relajado.",
    active: true,
  },
  {
    id: "bar",
    name: "Barra y lounge",
    description: "Sitio en la barra o en la zona lounge.",
    active: true,
  },
];

export const DEFAULT_BOOKING_LOCALE_COPY: Record<Locale, BookingWidgetLocaleCopy> = {
  fi: {
    restaurantName: "Ravintola Kajo",
    address: "Bulevardi 12, 00120 Helsinki",
    brandTitle: "KAJO",
    brandSubtitle: "HELSINKI",
    bookingTypes: SHOWCASE_TYPES_FI,
    termsText:
      "Hyväksyn varausehdot. Voin peruuttaa viimeistään 24 tuntia ennen. Tämä on Restadigin tuote-esittely — tietoja ei tallenneta.",
  },
  en: {
    restaurantName: "Restaurant Kajo",
    address: "Bulevardi 12, 00120 Helsinki",
    brandTitle: "KAJO",
    brandSubtitle: "HELSINKI",
    bookingTypes: SHOWCASE_TYPES_EN,
    termsText:
      "I accept the booking terms. I can cancel up to 24 hours before. This is a Restadigi product showcase — nothing is stored.",
  },
  es: {
    restaurantName: "Restaurante Kajo",
    address: "Bulevardi 12, 00120 Helsinki",
    brandTitle: "KAJO",
    brandSubtitle: "HELSINKI",
    bookingTypes: SHOWCASE_TYPES_ES,
    termsText:
      "Acepto las condiciones de reserva. Puedo cancelar hasta 24 horas antes. Esto es una demo del producto Restadigi: no se guarda ningún dato.",
  },
};

/** Fictional Restadigi showcase restaurant — fully editable in the dashboard (per language). */
export const DEFAULT_BOOKING_WIDGET_CONFIG: BookingWidgetConfig = {
  brandImageUrl: "/booking-widget-brand.jpg",
  locales: {
    fi: { ...DEFAULT_BOOKING_LOCALE_COPY.fi, bookingTypes: [...SHOWCASE_TYPES_FI] },
    en: { ...DEFAULT_BOOKING_LOCALE_COPY.en, bookingTypes: [...SHOWCASE_TYPES_EN] },
    es: { ...DEFAULT_BOOKING_LOCALE_COPY.es, bookingTypes: [...SHOWCASE_TYPES_ES] },
  },
  minGuests: 1,
  maxGuests: 10,
  durationMinutes: 150,
  slotIntervalMinutes: 15,
  openTime: "17:00",
  lastStartTime: "21:00",
  closedWeekdays: [1],
  minNoticeHours: 2,
  advanceBookingDays: 60,
  slotAccentColor: "#cde6d0",
  showEndTime: true,
};

export function resolveBookingWidgetDisplay(
  config: BookingWidgetConfig,
  locale: Locale,
): BookingWidgetDisplay {
  const copy = config.locales[locale] ?? config.locales.fi ?? DEFAULT_BOOKING_LOCALE_COPY.fi;
  return {
    brandImageUrl: config.brandImageUrl,
    restaurantName: copy.restaurantName,
    address: copy.address,
    brandTitle: copy.brandTitle,
    brandSubtitle: copy.brandSubtitle,
    bookingTypes: copy.bookingTypes,
    termsText: copy.termsText,
    minGuests: config.minGuests,
    maxGuests: config.maxGuests,
    durationMinutes: config.durationMinutes,
    slotIntervalMinutes: config.slotIntervalMinutes,
    openTime: config.openTime,
    lastStartTime: config.lastStartTime,
    closedWeekdays: config.closedWeekdays,
    minNoticeHours: config.minNoticeHours,
    advanceBookingDays: config.advanceBookingDays,
    slotAccentColor: config.slotAccentColor,
    showEndTime: config.showEndTime,
  };
}

function parseTypes(raw: unknown, fallback: BookingWidgetType[]): BookingWidgetType[] {
  if (!Array.isArray(raw)) return fallback.map((t) => ({ ...t }));
  const types = raw
    .filter((t) => t && typeof t === "object")
    .map((t, i) => ({
      id: String((t as BookingWidgetType).id || `type-${i}`),
      name: String((t as BookingWidgetType).name || "Type"),
      description: String((t as BookingWidgetType).description || ""),
      active: Boolean((t as BookingWidgetType).active),
    }));
  return types.length ? types : fallback.map((t) => ({ ...t }));
}

function parseLocaleCopy(raw: unknown, fallback: BookingWidgetLocaleCopy): BookingWidgetLocaleCopy {
  if (!raw || typeof raw !== "object") {
    return {
      ...fallback,
      bookingTypes: fallback.bookingTypes.map((t) => ({ ...t })),
    };
  }
  const o = raw as Partial<BookingWidgetLocaleCopy>;
  return {
    restaurantName: String(o.restaurantName || fallback.restaurantName),
    address: String(o.address || fallback.address),
    brandTitle: String(o.brandTitle || fallback.brandTitle),
    brandSubtitle: String(o.brandSubtitle || fallback.brandSubtitle),
    bookingTypes: parseTypes(o.bookingTypes, fallback.bookingTypes),
    termsText: String(o.termsText || fallback.termsText),
  };
}

/** Detect legacy single-language config (pre multi-locale). */
function isLegacyFlatConfig(raw: Record<string, unknown>) {
  return typeof raw.restaurantName === "string" && !raw.locales;
}

export function parseBookingWidgetConfig(raw: unknown): BookingWidgetConfig {
  if (!raw || typeof raw !== "object") {
    return structuredClone(DEFAULT_BOOKING_WIDGET_CONFIG);
  }
  const o = raw as Record<string, unknown> & Partial<BookingWidgetConfig>;

  let locales: Record<Locale, BookingWidgetLocaleCopy>;

  if (o.locales && typeof o.locales === "object") {
    const loc = o.locales as Partial<Record<Locale, unknown>>;
    locales = {
      fi: parseLocaleCopy(loc.fi, DEFAULT_BOOKING_LOCALE_COPY.fi),
      en: parseLocaleCopy(loc.en, DEFAULT_BOOKING_LOCALE_COPY.en),
      es: parseLocaleCopy(loc.es, DEFAULT_BOOKING_LOCALE_COPY.es),
    };
  } else if (isLegacyFlatConfig(o)) {
    // Migrate old Finnish-only row into fi; keep polished defaults for en/es.
    const legacyTypes = parseTypes(o.bookingTypes, DEFAULT_BOOKING_LOCALE_COPY.fi.bookingTypes);
    const fiCopy: BookingWidgetLocaleCopy = {
      restaurantName: String(o.restaurantName || DEFAULT_BOOKING_LOCALE_COPY.fi.restaurantName),
      address: String(o.address || DEFAULT_BOOKING_LOCALE_COPY.fi.address),
      brandTitle: String(o.brandTitle || DEFAULT_BOOKING_LOCALE_COPY.fi.brandTitle),
      brandSubtitle: String(o.brandSubtitle || DEFAULT_BOOKING_LOCALE_COPY.fi.brandSubtitle),
      bookingTypes: legacyTypes,
      termsText: String(o.termsText || DEFAULT_BOOKING_LOCALE_COPY.fi.termsText),
    };
    locales = {
      fi: fiCopy,
      en: {
        ...DEFAULT_BOOKING_LOCALE_COPY.en,
        bookingTypes: DEFAULT_BOOKING_LOCALE_COPY.en.bookingTypes.map((t) => ({ ...t })),
      },
      es: {
        ...DEFAULT_BOOKING_LOCALE_COPY.es,
        bookingTypes: DEFAULT_BOOKING_LOCALE_COPY.es.bookingTypes.map((t) => ({ ...t })),
      },
    };
  } else {
    locales = {
      fi: {
        ...DEFAULT_BOOKING_LOCALE_COPY.fi,
        bookingTypes: DEFAULT_BOOKING_LOCALE_COPY.fi.bookingTypes.map((t) => ({ ...t })),
      },
      en: {
        ...DEFAULT_BOOKING_LOCALE_COPY.en,
        bookingTypes: DEFAULT_BOOKING_LOCALE_COPY.en.bookingTypes.map((t) => ({ ...t })),
      },
      es: {
        ...DEFAULT_BOOKING_LOCALE_COPY.es,
        bookingTypes: DEFAULT_BOOKING_LOCALE_COPY.es.bookingTypes.map((t) => ({ ...t })),
      },
    };
  }

  return {
    brandImageUrl: String(o.brandImageUrl || DEFAULT_BOOKING_WIDGET_CONFIG.brandImageUrl),
    locales,
    minGuests: clampInt(o.minGuests, 1, 50, DEFAULT_BOOKING_WIDGET_CONFIG.minGuests),
    maxGuests: clampInt(o.maxGuests, 1, 100, DEFAULT_BOOKING_WIDGET_CONFIG.maxGuests),
    durationMinutes: clampInt(
      o.durationMinutes,
      30,
      480,
      DEFAULT_BOOKING_WIDGET_CONFIG.durationMinutes,
    ),
    slotIntervalMinutes: clampInt(
      o.slotIntervalMinutes,
      5,
      60,
      DEFAULT_BOOKING_WIDGET_CONFIG.slotIntervalMinutes,
    ),
    openTime: normalizeTime(o.openTime, DEFAULT_BOOKING_WIDGET_CONFIG.openTime),
    lastStartTime: normalizeTime(o.lastStartTime, DEFAULT_BOOKING_WIDGET_CONFIG.lastStartTime),
    closedWeekdays: Array.isArray(o.closedWeekdays)
      ? o.closedWeekdays.map(Number).filter((d) => d >= 0 && d <= 6)
      : DEFAULT_BOOKING_WIDGET_CONFIG.closedWeekdays,
    minNoticeHours: clampInt(
      o.minNoticeHours,
      0,
      168,
      DEFAULT_BOOKING_WIDGET_CONFIG.minNoticeHours,
    ),
    advanceBookingDays: clampInt(
      o.advanceBookingDays,
      1,
      365,
      DEFAULT_BOOKING_WIDGET_CONFIG.advanceBookingDays,
    ),
    slotAccentColor: String(o.slotAccentColor || DEFAULT_BOOKING_WIDGET_CONFIG.slotAccentColor),
    showEndTime: o.showEndTime !== false,
  };
}

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function normalizeTime(value: unknown, fallback: string) {
  const s = String(value || "");
  return /^\d{1,2}:\d{2}$/.test(s) ? s.padStart(5, "0") : fallback;
}

export function timeToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function addMinutesToTime(hhmm: string, minutes: number) {
  return minutesToTime(timeToMinutes(hhmm) + minutes);
}

export function generateTimeSlots(
  config: Pick<
    BookingWidgetConfig,
    "closedWeekdays" | "minNoticeHours" | "openTime" | "lastStartTime" | "slotIntervalMinutes"
  >,
  date: Date,
): string[] {
  const day = date.getDay();
  if (config.closedWeekdays.includes(day)) return [];

  const now = new Date();
  const minStart = new Date(now.getTime() + config.minNoticeHours * 60 * 60 * 1000);
  const start = timeToMinutes(config.openTime);
  const end = timeToMinutes(config.lastStartTime);
  const step = config.slotIntervalMinutes;
  const slots: string[] = [];

  for (let t = start; t <= end; t += step) {
    const label = minutesToTime(t);
    const candidate = new Date(date);
    candidate.setHours(Math.floor(t / 60), t % 60, 0, 0);
    if (candidate < minStart) continue;
    slots.push(label);
  }
  return slots;
}

export function isDateBookable(
  config: Pick<
    BookingWidgetConfig,
    | "closedWeekdays"
    | "minNoticeHours"
    | "openTime"
    | "lastStartTime"
    | "slotIntervalMinutes"
    | "advanceBookingDays"
  >,
  date: Date,
  today = new Date(),
) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  if (dayStart < todayStart) return false;

  const max = new Date(todayStart);
  max.setDate(max.getDate() + config.advanceBookingDays);
  if (dayStart > max) return false;

  if (config.closedWeekdays.includes(dayStart.getDay())) return false;
  return generateTimeSlots(config, dayStart).length > 0;
}

export function readBookingWidgetConfigFromStorage(): BookingWidgetConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BOOKING_WIDGET_STORAGE_KEY);
    if (!raw) return null;
    return parseBookingWidgetConfig(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeBookingWidgetConfigToStorage(config: BookingWidgetConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOOKING_WIDGET_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(
      new CustomEvent(BOOKING_WIDGET_CONFIG_EVENT, { detail: config }),
    );
  } catch {
    /* ignore */
  }
}

export function cloneDefaultBookingTypes(locale: Locale): BookingWidgetType[] {
  return DEFAULT_BOOKING_LOCALE_COPY[locale].bookingTypes.map((t) => ({ ...t }));
}

export { LOCALES as BOOKING_WIDGET_LOCALES };
