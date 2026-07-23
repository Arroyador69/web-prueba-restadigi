export const LOCALES = ["fi", "en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fi";

/** Production domains for each language (ready for DNS wiring). */
export const LOCALE_DOMAINS: Record<Locale, string> = {
  fi: "https://restadigi.fi",
  en: "https://restadigi.com",
  es: "https://restadigi.es",
};

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
