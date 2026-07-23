import type { Locale } from "./types";
import { LOCALE_META } from "./types";

type FlagProps = {
  locale: Locale;
  className?: string;
};

/** Compact SVG flags for the language switcher. */
export function LocaleFlag({ locale, className = "size-5 shrink-0 rounded-[2px]" }: FlagProps) {
  const flag = LOCALE_META[locale].flag;

  if (flag === "fi") {
    return (
      <svg viewBox="0 0 18 12" className={className} aria-hidden>
        <rect width="18" height="12" fill="#fff" />
        <rect x="5" width="3" height="12" fill="#003580" />
        <rect y="4.5" width="18" height="3" fill="#003580" />
      </svg>
    );
  }

  if (flag === "es") {
    return (
      <svg viewBox="0 0 18 12" className={className} aria-hidden>
        <rect width="18" height="12" fill="#AA151B" />
        <rect y="3" width="18" height="6" fill="#F1BF00" />
      </svg>
    );
  }

  // UK / English
  return (
    <svg viewBox="0 0 18 12" className={className} aria-hidden>
      <rect width="18" height="12" fill="#012169" />
      <path d="M0 0 L18 12 M18 0 L0 12" stroke="#fff" strokeWidth="2.2" />
      <path d="M0 0 L18 12 M18 0 L0 12" stroke="#C8102E" strokeWidth="1.1" />
      <path d="M9 0 V12 M0 6 H18" stroke="#fff" strokeWidth="3.4" />
      <path d="M9 0 V12 M0 6 H18" stroke="#C8102E" strokeWidth="1.8" />
    </svg>
  );
}
