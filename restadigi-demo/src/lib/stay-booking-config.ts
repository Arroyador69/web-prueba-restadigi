/** Stay / lodging booking widget config (Restabooking product demo). */

import type { Locale } from "@/i18n/types";
import { LOCALES } from "@/i18n/types";

export type StayRoomType = {
  id: string;
  name: string;
  description: string;
  /** Hint price label shown in UI, e.g. "from 129 € / night". */
  priceLabel: string;
  active: boolean;
};

export type StayBookingLocaleCopy = {
  propertyName: string;
  address: string;
  brandTitle: string;
  brandSubtitle: string;
  roomTypes: StayRoomType[];
  termsText: string;
};

export type StayBookingConfig = {
  brandImageUrl: string;
  locales: Record<Locale, StayBookingLocaleCopy>;
  minGuests: number;
  maxGuests: number;
  minNights: number;
  maxNights: number;
  /** 0=Sun … 6=Sat — closed for check-in */
  closedWeekdays: number[];
  minNoticeHours: number;
  advanceBookingDays: number;
  accentColor: string;
};

export type StayBookingDisplay = StayBookingLocaleCopy &
  Pick<
    StayBookingConfig,
    | "brandImageUrl"
    | "minGuests"
    | "maxGuests"
    | "minNights"
    | "maxNights"
    | "closedWeekdays"
    | "minNoticeHours"
    | "advanceBookingDays"
    | "accentColor"
  >;

export const STAY_BOOKING_STORAGE_KEY = "restadigi-stay-booking-config-v1";
export const STAY_BOOKING_CONFIG_EVENT = "restadigi-stay-booking-config";

const ROOMS_FI: StayRoomType[] = [
  {
    id: "standard",
    name: "Standard-huone",
    description:
      "Rauhallinen huone kahdelle — pehmeä valaistus ja tyylikäs skandinaavinen sisustus.",
    priceLabel: "alk. 119 € / yö",
    active: true,
  },
  {
    id: "sea",
    name: "Merinäköala",
    description: "Valoisa huone merinäköalalla — täydellinen viikonloppulomaan Helsingissä.",
    priceLabel: "alk. 159 € / yö",
    active: true,
  },
  {
    id: "suite",
    name: "Sviitti",
    description: "Tilava sviitti oleskelutilalla — sopii pidemmälle majoitukselle tai juhlaan.",
    priceLabel: "alk. 229 € / yö",
    active: true,
  },
];

const ROOMS_EN: StayRoomType[] = [
  {
    id: "standard",
    name: "Standard room",
    description: "A calm room for two — soft lighting and refined Scandinavian interiors.",
    priceLabel: "from 119 € / night",
    active: true,
  },
  {
    id: "sea",
    name: "Sea view",
    description: "A bright room with sea views — perfect for a Helsinki weekend.",
    priceLabel: "from 159 € / night",
    active: true,
  },
  {
    id: "suite",
    name: "Suite",
    description: "A spacious suite with a living area — ideal for longer stays or celebrations.",
    priceLabel: "from 229 € / night",
    active: true,
  },
];

const ROOMS_ES: StayRoomType[] = [
  {
    id: "standard",
    name: "Habitación estándar",
    description: "Habitación tranquila para dos — iluminación suave e interiores nórdicos.",
    priceLabel: "desde 119 € / noche",
    active: true,
  },
  {
    id: "sea",
    name: "Vista al mar",
    description: "Habitación luminosa con vistas al mar — ideal para un fin de semana en Helsinki.",
    priceLabel: "desde 159 € / noche",
    active: true,
  },
  {
    id: "suite",
    name: "Suite",
    description: "Suite amplia con zona de estar — perfecta para estancias largas o celebraciones.",
    priceLabel: "desde 229 € / noche",
    active: true,
  },
];

export const DEFAULT_STAY_LOCALE_COPY: Record<Locale, StayBookingLocaleCopy> = {
  fi: {
    propertyName: "Hotelli Aava",
    address: "Katajanokanlaituri 4, 00160 Helsinki",
    brandTitle: "AAVA",
    brandSubtitle: "HELSINKI",
    roomTypes: ROOMS_FI,
    termsText:
      "Hyväksyn majoitusehdot. Voin peruuttaa viimeistään 48 tuntia ennen saapumista. Tämä on Restadigin Restabooking-tuote-esittely — tietoja ei tallenneta.",
  },
  en: {
    propertyName: "Hotel Aava",
    address: "Katajanokanlaituri 4, 00160 Helsinki",
    brandTitle: "AAVA",
    brandSubtitle: "HELSINKI",
    roomTypes: ROOMS_EN,
    termsText:
      "I accept the stay terms. I can cancel up to 48 hours before arrival. This is a Restadigi Restabooking product showcase — nothing is stored.",
  },
  es: {
    propertyName: "Hotel Aava",
    address: "Katajanokanlaituri 4, 00160 Helsinki",
    brandTitle: "AAVA",
    brandSubtitle: "HELSINKI",
    roomTypes: ROOMS_ES,
    termsText:
      "Acepto las condiciones de estancia. Puedo cancelar hasta 48 horas antes de la llegada. Esto es una demo del producto Restabooking de Restadigi: no se guarda ningún dato.",
  },
};

export const DEFAULT_STAY_BOOKING_CONFIG: StayBookingConfig = {
  brandImageUrl: "/stay-booking-brand.jpg",
  locales: {
    fi: { ...DEFAULT_STAY_LOCALE_COPY.fi, roomTypes: ROOMS_FI.map((r) => ({ ...r })) },
    en: { ...DEFAULT_STAY_LOCALE_COPY.en, roomTypes: ROOMS_EN.map((r) => ({ ...r })) },
    es: { ...DEFAULT_STAY_LOCALE_COPY.es, roomTypes: ROOMS_ES.map((r) => ({ ...r })) },
  },
  minGuests: 1,
  maxGuests: 6,
  minNights: 1,
  maxNights: 14,
  closedWeekdays: [],
  minNoticeHours: 12,
  advanceBookingDays: 120,
  accentColor: "#c4b5a5",
};

export function resolveStayBookingDisplay(
  config: StayBookingConfig,
  locale: Locale,
): StayBookingDisplay {
  const copy = config.locales[locale] ?? config.locales.fi ?? DEFAULT_STAY_LOCALE_COPY.fi;
  return {
    brandImageUrl: config.brandImageUrl,
    propertyName: copy.propertyName,
    address: copy.address,
    brandTitle: copy.brandTitle,
    brandSubtitle: copy.brandSubtitle,
    roomTypes: copy.roomTypes,
    termsText: copy.termsText,
    minGuests: config.minGuests,
    maxGuests: config.maxGuests,
    minNights: config.minNights,
    maxNights: config.maxNights,
    closedWeekdays: config.closedWeekdays,
    minNoticeHours: config.minNoticeHours,
    advanceBookingDays: config.advanceBookingDays,
    accentColor: config.accentColor,
  };
}

function parseRooms(raw: unknown, fallback: StayRoomType[]): StayRoomType[] {
  if (!Array.isArray(raw)) return fallback.map((r) => ({ ...r }));
  const rooms = raw
    .filter((t) => t && typeof t === "object")
    .map((t, i) => ({
      id: String((t as StayRoomType).id || `room-${i}`),
      name: String((t as StayRoomType).name || "Room"),
      description: String((t as StayRoomType).description || ""),
      priceLabel: String((t as StayRoomType).priceLabel || ""),
      active: Boolean((t as StayRoomType).active),
    }));
  return rooms.length ? rooms : fallback.map((r) => ({ ...r }));
}

function parseLocaleCopy(raw: unknown, fallback: StayBookingLocaleCopy): StayBookingLocaleCopy {
  if (!raw || typeof raw !== "object") {
    return { ...fallback, roomTypes: fallback.roomTypes.map((r) => ({ ...r })) };
  }
  const o = raw as Partial<StayBookingLocaleCopy>;
  return {
    propertyName: String(o.propertyName || fallback.propertyName),
    address: String(o.address || fallback.address),
    brandTitle: String(o.brandTitle || fallback.brandTitle),
    brandSubtitle: String(o.brandSubtitle || fallback.brandSubtitle),
    roomTypes: parseRooms(o.roomTypes, fallback.roomTypes),
    termsText: String(o.termsText || fallback.termsText),
  };
}

export function parseStayBookingConfig(raw: unknown): StayBookingConfig {
  if (!raw || typeof raw !== "object") {
    return structuredClone(DEFAULT_STAY_BOOKING_CONFIG);
  }
  const o = raw as Record<string, unknown> & Partial<StayBookingConfig>;
  let locales: Record<Locale, StayBookingLocaleCopy>;

  if (o.locales && typeof o.locales === "object") {
    const loc = o.locales as Partial<Record<Locale, unknown>>;
    locales = {
      fi: parseLocaleCopy(loc.fi, DEFAULT_STAY_LOCALE_COPY.fi),
      en: parseLocaleCopy(loc.en, DEFAULT_STAY_LOCALE_COPY.en),
      es: parseLocaleCopy(loc.es, DEFAULT_STAY_LOCALE_COPY.es),
    };
  } else {
    locales = {
      fi: {
        ...DEFAULT_STAY_LOCALE_COPY.fi,
        roomTypes: DEFAULT_STAY_LOCALE_COPY.fi.roomTypes.map((r) => ({ ...r })),
      },
      en: {
        ...DEFAULT_STAY_LOCALE_COPY.en,
        roomTypes: DEFAULT_STAY_LOCALE_COPY.en.roomTypes.map((r) => ({ ...r })),
      },
      es: {
        ...DEFAULT_STAY_LOCALE_COPY.es,
        roomTypes: DEFAULT_STAY_LOCALE_COPY.es.roomTypes.map((r) => ({ ...r })),
      },
    };
  }

  return {
    brandImageUrl: String(o.brandImageUrl || DEFAULT_STAY_BOOKING_CONFIG.brandImageUrl),
    locales,
    minGuests: clampInt(o.minGuests, 1, 20, DEFAULT_STAY_BOOKING_CONFIG.minGuests),
    maxGuests: clampInt(o.maxGuests, 1, 30, DEFAULT_STAY_BOOKING_CONFIG.maxGuests),
    minNights: clampInt(o.minNights, 1, 30, DEFAULT_STAY_BOOKING_CONFIG.minNights),
    maxNights: clampInt(o.maxNights, 1, 60, DEFAULT_STAY_BOOKING_CONFIG.maxNights),
    closedWeekdays: Array.isArray(o.closedWeekdays)
      ? o.closedWeekdays.map(Number).filter((d) => d >= 0 && d <= 6)
      : DEFAULT_STAY_BOOKING_CONFIG.closedWeekdays,
    minNoticeHours: clampInt(o.minNoticeHours, 0, 168, DEFAULT_STAY_BOOKING_CONFIG.minNoticeHours),
    advanceBookingDays: clampInt(
      o.advanceBookingDays,
      1,
      365,
      DEFAULT_STAY_BOOKING_CONFIG.advanceBookingDays,
    ),
    accentColor: String(o.accentColor || DEFAULT_STAY_BOOKING_CONFIG.accentColor),
  };
}

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isCheckInBookable(
  config: Pick<StayBookingConfig, "closedWeekdays" | "minNoticeHours" | "advanceBookingDays">,
  date: Date,
  today = new Date(),
) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  if (dayStart < todayStart) return false;

  const minArrival = new Date(today.getTime() + config.minNoticeHours * 60 * 60 * 1000);
  minArrival.setHours(0, 0, 0, 0);
  if (dayStart < minArrival) return false;

  const max = addDays(todayStart, config.advanceBookingDays);
  if (dayStart > max) return false;

  if (config.closedWeekdays.includes(dayStart.getDay())) return false;
  return true;
}

export function readStayBookingConfigFromStorage(): StayBookingConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STAY_BOOKING_STORAGE_KEY);
    if (!raw) return null;
    return parseStayBookingConfig(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeStayBookingConfigToStorage(config: StayBookingConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STAY_BOOKING_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent(STAY_BOOKING_CONFIG_EVENT, { detail: config }));
  } catch {
    /* ignore */
  }
}

export { LOCALES as STAY_BOOKING_LOCALES };
