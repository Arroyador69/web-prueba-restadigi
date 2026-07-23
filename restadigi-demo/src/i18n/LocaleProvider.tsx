import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearStoredLocale,
  detectLocale,
  localeDomainUrl,
  localeFromHostname,
  shouldJumpToLocaleDomain,
  storeLocale,
} from "./detect";
import { getMessages, type Messages } from "./messages";
import { LOCALE_META, type Locale } from "./types";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());

  useEffect(() => {
    const next = detectLocale();
    setLocaleState(next);
    // On .fi / .com / .es the domain owns the language — drop stale preview choice
    if (typeof window !== "undefined" && localeFromHostname(window.location.hostname)) {
      clearStoredLocale();
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = LOCALE_META[locale].htmlLang;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    if (typeof window === "undefined") {
      setLocaleState(next);
      return;
    }

    const host = window.location.hostname;
    const current = detectLocale(host, window.location.search);

    if (shouldJumpToLocaleDomain(host) && next !== current) {
      const url = localeDomainUrl(next, window.location.pathname, window.location.search);
      window.location.assign(url);
      return;
    }

    // Same production domain already showing that language, or localhost preview
    if (localeFromHostname(host)) {
      clearStoredLocale();
    } else {
      storeLocale(next);
    }
    setLocaleState(next);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      messages: getMessages(locale),
      setLocale,
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useMessages(): Messages {
  return useLocale().messages;
}
