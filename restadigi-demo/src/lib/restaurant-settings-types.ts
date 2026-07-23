import type { restaurantSettings } from "@/db/schema";

export type RestaurantSettings = typeof restaurantSettings.$inferSelect;

export const WEEKDAY_OPTIONS = [
  { value: "1", label: "Ma" },
  { value: "2", label: "Ti" },
  { value: "3", label: "Ke" },
  { value: "4", label: "To" },
  { value: "5", label: "Pe" },
  { value: "6", label: "La" },
  { value: "0", label: "Su" },
] as const;

export const DEFAULT_SETTINGS: Omit<RestaurantSettings, "updatedAt"> = {
  id: "default",
  restaurantName: "Demo Ravintola",
  restaurantAddress: "Mannerheimintie 1, 00100 Helsinki",
  restaurantPhone: "+358 403 738 332",
  restaurantEmail: "varaukset@demoravintola.fi",
  cuisineType: "Suomalainen, pohjoismainen",
  restaurantDescription:
    "Viihtyisä naapuristoravintola, joka tarjoaa tuoreita sesongin makuja ja lämpimän palvelun.",
  chatbotWelcomeMessage:
    "Hei! Tervetuloa. Autan pöytävarauksessa — kerro nimesi, henkilömäärä, päivä, kellonaika (12–22) ja puhelinnumero. Sähköposti on vapaaehtoinen. Normaali pöytäaika on 2 tuntia; 3 tuntia onnistuu pyynnöstä.",
  chatbotInstructions:
    "Varaukset joka päivä klo 12:00–22:00. Normaali kesto 2 tuntia; 3 tuntia pyynnöstä. Sähköposti ei ole pakollinen — puhelin riittää. Älä torju varauksia turhaan — ole joustava.",
  requireEmail: false,
  requirePhone: true,
  minPartySize: 1,
  maxPartySize: 80,
  openTime: "12:00",
  closeTime: "22:00",
  lunchEnabled: true,
  lunchOpenTime: "12:00",
  lunchCloseTime: "22:00",
  dinnerEnabled: false,
  dinnerOpenTime: "17:00",
  dinnerCloseTime: "22:00",
  slotMinutes: 30,
  maxCoversPerSlot: 80,
  maxCoversPerEvening: 200,
  closedWeekdays: "",
  advanceBookingDays: 90,
  minNoticeHours: 0,
  reservationsEnabled: true,
  accentColor: "#c46a32",
};

export type PublicRestaurantSettings = Pick<
  RestaurantSettings,
  | "restaurantName"
  | "chatbotWelcomeMessage"
  | "requireEmail"
  | "requirePhone"
  | "minPartySize"
  | "maxPartySize"
  | "reservationsEnabled"
  | "accentColor"
  | "lunchEnabled"
  | "dinnerEnabled"
>;

export function toPublicSettings(settings: RestaurantSettings): PublicRestaurantSettings {
  return {
    restaurantName: settings.restaurantName,
    chatbotWelcomeMessage: settings.chatbotWelcomeMessage,
    requireEmail: settings.requireEmail,
    requirePhone: settings.requirePhone,
    minPartySize: settings.minPartySize,
    maxPartySize: settings.maxPartySize,
    reservationsEnabled: settings.reservationsEnabled,
    accentColor: settings.accentColor,
    lunchEnabled: settings.lunchEnabled,
    dinnerEnabled: settings.dinnerEnabled,
  };
}

export function parseClosedWeekdays(value: string | null | undefined): number[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
}

export function formatClosedWeekdays(days: number[]): string {
  return [...new Set(days)].sort((a, b) => a - b).join(",");
}
