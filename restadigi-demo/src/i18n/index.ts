export type { Locale, DemoProduct } from "./types";
export type { Messages } from "./messages";
export {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_DOMAINS,
  WEB_LOCALE_DOMAINS,
  DEMO_LOCALE_DOMAINS,
  CHAT_LOCALE_DOMAINS,
  HOTEL_LOCALE_DOMAINS,
  LOCALE_META,
  isLocale,
} from "./types";
export {
  detectLocale,
  localeFromHostname,
  localeDomainUrl,
  localeFromSearch,
  productFromHostname,
  productUrl,
  landingUrl,
  chatShowcaseUrl,
  hotelShowcaseUrl,
  dashboardUrl,
  hostProductRedirect,
  shouldJumpToLocaleDomain,
} from "./detect";
export { LocaleProvider, useLocale, useMessages } from "./LocaleProvider";
export { LocaleFlag } from "./flags";
export {
  useDashboardUi,
  getDashboardUi,
  localeDateTag,
  fill as fillDashboardUi,
} from "./dashboard-ui";
export { getMessages, messages } from "./messages";
export { getShowcaseCopy, SHOWCASE_BRAND, SHOWCASE_COPY } from "./showcase-landing";
export type { ShowcaseCopy } from "./showcase-landing";
