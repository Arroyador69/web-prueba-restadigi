export const LOCALES = ["fi", "en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fi";

/** Landing showcase hosts (web.*). */
export const WEB_LOCALE_DOMAINS: Record<Locale, string> = {
  fi: "https://web.restadigi.fi",
  en: "https://web.restadigi.com",
  es: "https://web.restadigi.es",
};

/** Dashboard demo hosts (demo.*). */
export const DEMO_LOCALE_DOMAINS: Record<Locale, string> = {
  fi: "https://demo.restadigi.fi",
  en: "https://demo.restadigi.com",
  es: "https://demo.restadigi.es",
};

/**
 * Default locale domains (landing). Kept for callers that only need language hosts.
 * Prefer WEB_LOCALE_DOMAINS / DEMO_LOCALE_DOMAINS when the product matters.
 */
export const LOCALE_DOMAINS: Record<Locale, string> = WEB_LOCALE_DOMAINS;

export type DemoProduct = "web" | "demo";

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
