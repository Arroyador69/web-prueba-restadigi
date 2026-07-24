import {
  DEFAULT_LOCALE,
  DEMO_LOCALE_DOMAINS,
  isLocale,
  WEB_LOCALE_DOMAINS,
  type DemoProduct,
  type Locale,
} from "./types";

const STORAGE_KEY = "restadigi-locale";

/** Canonical hosts → language (web.*, demo.*, and apex reserved for later). */
const HOST_TO_LOCALE: Record<string, Locale> = {
  "web.restadigi.fi": "fi",
  "demo.restadigi.fi": "fi",
  "restadigi.fi": "fi",
  "www.restadigi.fi": "fi",
  "web.restadigi.com": "en",
  "demo.restadigi.com": "en",
  "restadigi.com": "en",
  "www.restadigi.com": "en",
  "web.restadigi.es": "es",
  "demo.restadigi.es": "es",
  "restadigi.es": "es",
  "www.restadigi.es": "es",
};

export function normalizeHostname(hostname: string): string {
  return (
    hostname
      .toLowerCase()
      .replace(/^www\./, "")
      .split(":")[0] ?? ""
  );
}

/** Map hostname to locale for web/demo/apex .fi / .com / .es. */
export function localeFromHostname(hostname: string): Locale | null {
  const host = normalizeHostname(hostname);
  if (HOST_TO_LOCALE[host]) return HOST_TO_LOCALE[host];
  // Fallback by TLD when host is known restadigi.*
  if (host.endsWith(".restadigi.fi") || host === "restadigi.fi") return "fi";
  if (host.endsWith(".restadigi.com") || host === "restadigi.com") return "en";
  if (host.endsWith(".restadigi.es") || host === "restadigi.es") return "es";
  return null;
}

/** web.* = landing, demo.* = dashboard. Apex treated as web. */
export function productFromHostname(hostname: string): DemoProduct | null {
  const host = normalizeHostname(hostname);
  if (host.startsWith("demo.")) return "demo";
  if (host.startsWith("web.")) return "web";
  if (
    host === "restadigi.fi" ||
    host === "restadigi.com" ||
    host === "restadigi.es"
  ) {
    return "web";
  }
  return null;
}

export function domainsForProduct(product: DemoProduct): Record<Locale, string> {
  return product === "demo" ? DEMO_LOCALE_DOMAINS : WEB_LOCALE_DOMAINS;
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

/** Optional ?lang=fi|en|es for preview hosts (Vercel / Lovable). */
export function localeFromSearch(search: string): Locale | null {
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
    const lang = params.get("lang");
    return isLocale(lang) ? lang : null;
  } catch {
    return null;
  }
}

export function isLocalDevHost(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
}

export function isPreviewHost(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  return (
    isLocalDevHost(host) ||
    host.endsWith(".vercel.app") ||
    host.endsWith(".lovable.app") ||
    host.endsWith(".lovableproject.com")
  );
}

/**
 * Resolve active locale:
 * 1) Domain web/demo/apex .fi / .com / .es (wins)
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
 * Jump between .fi / .com / .es when already on those domains.
 * Preview hosts keep in-page language switching.
 */
export function shouldJumpToLocaleDomain(hostname: string): boolean {
  if (isPreviewHost(hostname)) return false;
  return localeFromHostname(hostname) !== null;
}

function stripLangParam(search: string): string {
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    params.delete("lang");
    const cleaned = params.toString();
    return cleaned ? `?${cleaned}` : "";
  } catch {
    return search && search !== "?" ? (search.startsWith("?") ? search : `?${search}`) : "";
  }
}

/**
 * Absolute URL on the matching locale domain, keeping web↔web or demo↔demo.
 */
export function localeDomainUrl(
  locale: Locale,
  pathname: string,
  search = "",
  product?: DemoProduct | null,
): string {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const resolvedProduct = product ?? productFromHostname(host) ?? "web";
  const base = domainsForProduct(resolvedProduct)[locale].replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const qs = search && search !== "?" ? stripLangParam(search) : "";
  return `${base}${path}${qs}`;
}

/**
 * Cross-link between landing (web) and dashboard (demo) for the current locale.
 * On preview hosts returns a relative path so local/Vercel previews still work.
 */
export function productUrl(
  target: DemoProduct,
  pathname: string,
  search = "",
  locale?: Locale,
): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const qs =
    search && search !== "?"
      ? search.startsWith("?")
        ? search
        : `?${search}`
      : "";

  if (typeof window === "undefined") {
    return `${path}${qs}`;
  }

  const host = window.location.hostname;
  if (isPreviewHost(host) || !localeFromHostname(host)) {
    return `${path}${qs}`;
  }

  const loc = locale ?? detectLocale(host, window.location.search);
  const base = domainsForProduct(target)[loc].replace(/\/$/, "");
  return `${base}${path}${stripLangParam(qs)}`;
}

export function landingUrl(locale?: Locale): string {
  return productUrl("web", "/", "", locale);
}

export function dashboardUrl(pathname = "/dashboard", locale?: Locale): string {
  const path = pathname.startsWith("/dashboard") ? pathname : `/dashboard${pathname}`;
  return productUrl("demo", path, "", locale);
}

/**
 * If the current host/path combo is wrong for the product, return where to go.
 * - demo.* + `/` → `/dashboard`
 * - web.* + `/dashboard…` → demo.* same path
 */
export function hostProductRedirect(
  hostname: string,
  pathname: string,
  search = "",
): string | null {
  const product = productFromHostname(hostname);
  if (!product) return null;

  if (product === "demo" && (pathname === "/" || pathname === "")) {
    return `/dashboard${search || ""}`;
  }

  if (product === "web" && pathname.startsWith("/dashboard")) {
    const loc = localeFromHostname(hostname) ?? DEFAULT_LOCALE;
    const base = DEMO_LOCALE_DOMAINS[loc].replace(/\/$/, "");
    return `${base}${pathname}${search || ""}`;
  }

  return null;
}
