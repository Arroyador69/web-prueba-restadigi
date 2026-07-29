export const LOCALES = ["fi", "en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fi";

/** Restatable — restaurant table booking showcase (web.*). */
export const WEB_LOCALE_DOMAINS: Record<Locale, string> = {
  fi: "https://web.restadigi.fi",
  en: "https://web.restadigi.com",
  es: "https://web.restadigi.es",
};

/** Shared demo dashboard (demo.*). */
export const DEMO_LOCALE_DOMAINS: Record<Locale, string> = {
  fi: "https://demo.restadigi.fi",
  en: "https://demo.restadigi.com",
  es: "https://demo.restadigi.es",
};

/** Restachat — customer-service chatbot showcase (chat.*). */
export const CHAT_LOCALE_DOMAINS: Record<Locale, string> = {
  fi: "https://chat.restadigi.fi",
  en: "https://chat.restadigi.com",
  es: "https://chat.restadigi.es",
};

/** Restabooking — hotel / lodging showcase (hotel.*). */
export const HOTEL_LOCALE_DOMAINS: Record<Locale, string> = {
  fi: "https://hotel.restadigi.fi",
  en: "https://hotel.restadigi.com",
  es: "https://hotel.restadigi.es",
};

/**
 * Default locale domains (restaurant landing).
 * Prefer product-specific maps when the product matters.
 */
export const LOCALE_DOMAINS: Record<Locale, string> = WEB_LOCALE_DOMAINS;

export type DemoProduct = "web" | "demo" | "chat" | "hotel";

export const LOCALE_META: Record<
  Locale,
  { label: string; nativeLabel: string; htmlLang: string; flag: "fi" | "gb" | "es" }
> = {
  fi: { label: "Finnish", nativeLabel: "Suomi", htmlLang: "fi", flag: "fi" },
  en: { label: "English", nativeLabel: "English", htmlLang: "en", flag: "gb" },
  es: { label: "Spanish", nativeLabel: "Español", htmlLang: "es", flag: "es" },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "fi" || value === "en" || value === "es";
}
