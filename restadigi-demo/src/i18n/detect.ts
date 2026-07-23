import { DEFAULT_LOCALE, isLocale, LOCALE_DOMAINS, type Locale } from "./types";

const STORAGE_KEY = "restadigi-locale";

/** Canonical hosts for each language (with or without www). */
const HOST_TO_LOCALE: Record<string, Locale> = {
  "restadigi.fi": "fi",
  "restadigi.com": "en",
  "restadigi.es": "es",
};

/** Map hostname to locale for .fi / .com / .es. */
export function localeFromHostname(hostname: string): Locale | null {
  const host =
    hostname
      .toLowerCase()
      .replace(/^www\./, "")
      .split(":")[0] ?? "";
  return HOST_TO_LOCALE[host] ?? null;
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}

export function clearStoredLocale() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Optional ?lang=fi|en|es for preview hosts (Lovable / vercel.app). */
export function localeFromSearch(search: string): Locale | null {
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
    const lang = params.get("lang");
    return isLocale(lang) ? lang : null;
  } catch {
    return null;
  }
}

function isLocalDevHost(hostname: string): boolean {
  const host = hostname.toLowerCase().split(":")[0] ?? "";
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
}

/**
 * Resolve active locale:
 * 1) Domain restadigi.fi / .com / .es (wins over everything)
 * 2) ?lang= on preview
 * 3) localStorage on preview
 * 4) Default Finnish
 */
export function detectLocale(hostname?: string, search?: string): Locale {
  const host = hostname ?? (typeof window !== "undefined" ? window.location.hostname : "");
  const fromHost = host ? localeFromHostname(host) : null;
  if (fromHost) return fromHost;

  const query = search ?? (typeof window !== "undefined" ? window.location.search : "");
  const fromQuery = query ? localeFromSearch(query) : null;
  if (fromQuery) return fromQuery;

  const stored = readStoredLocale();
  if (stored) return stored;

  return DEFAULT_LOCALE;
}

/** True when we are on a language production domain. */
export function shouldNavigateToLocaleDomain(hostname: string): boolean {
  return localeFromHostname(hostname) !== null;
}

/**
 * Only jump between .fi / .com / .es when already on those domains.
 * Preview hosts (vercel.app, etc.) keep in-page language switching.
 */
export function shouldJumpToLocaleDomain(hostname: string): boolean {
  if (isLocalDevHost(hostname)) return false;
  return localeFromHostname(hostname) !== null;
}

export function localeDomainUrl(locale: Locale, pathname: string, search = ""): string {
  const base = LOCALE_DOMAINS[locale].replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const qs = search && search !== "?" ? (search.startsWith("?") ? search : `?${search}`) : "";
  // Drop ?lang= when jumping to a real language domain (domain owns the locale)
  if (localeFromHostname(new URL(base).hostname)) {
    try {
      const params = new URLSearchParams(qs.startsWith("?") ? qs.slice(1) : qs);
      params.delete("lang");
      const cleaned = params.toString();
      return `${base}${path}${cleaned ? `?${cleaned}` : ""}`;
    } catch {
      return `${base}${path}`;
    }
  }
  return `${base}${path}${qs}`;
}
