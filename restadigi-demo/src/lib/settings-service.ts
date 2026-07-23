import { and, eq, ne } from "drizzle-orm";

import { getDb, schema } from "@/db";
import {
  formatHelsinkiNowForPrompt,
  minutesUntilHelsinki,
  normalizeReservationDate,
  normalizeReservationTime,
  weekdayFromDateKey,
} from "@/lib/date-utils";
import {
  DEFAULT_SETTINGS,
  parseClosedWeekdays,
  type RestaurantSettings,
  WEEKDAY_OPTIONS,
} from "@/lib/restaurant-settings-types";
import { getDatabaseUrl } from "@/lib/database-url";

/** Flexible demo booking rules: every day 12–22, 2h default / 3h on request. */
const FLEXIBLE_BOOKING_PATCH: Partial<Omit<RestaurantSettings, "id" | "updatedAt">> = {
  openTime: "12:00",
  closeTime: "22:00",
  lunchEnabled: true,
  lunchOpenTime: "12:00",
  lunchCloseTime: "22:00",
  dinnerEnabled: false,
  closedWeekdays: "",
  minNoticeHours: 0,
  advanceBookingDays: 90,
  maxCoversPerSlot: 80,
  maxCoversPerEvening: 200,
  maxPartySize: 80,
  minPartySize: 1,
  slotMinutes: 30,
  requireEmail: false,
  requirePhone: true,
  reservationsEnabled: true,
  chatbotWelcomeMessage: DEFAULT_SETTINGS.chatbotWelcomeMessage,
  chatbotInstructions: DEFAULT_SETTINGS.chatbotInstructions,
};

let flexibleBookingEnsured = false;

export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  if (!getDatabaseUrl()) {
    return { ...DEFAULT_SETTINGS, updatedAt: new Date() };
  }

  try {
    const db = getDb();
    let row = await db.query.restaurantSettings.findFirst({
      where: eq(schema.restaurantSettings.id, "default"),
    });

    if (!row) {
      return { ...DEFAULT_SETTINGS, updatedAt: new Date() };
    }

    // One-time loosen old restrictive defaults (Mon closed / lunch–dinner gap).
    if (!flexibleBookingEnsured) {
      flexibleBookingEnsured = true;
      const needsFlex =
        row.closedWeekdays === "1" ||
        row.lunchCloseTime === "14:30" ||
        row.minNoticeHours >= 2 ||
        row.maxPartySize < 80 ||
        row.maxCoversPerSlot < 80 ||
        row.requireEmail === true ||
        (row.lunchEnabled &&
          row.dinnerEnabled &&
          timeToMinutes(row.lunchCloseTime) < timeToMinutes(row.dinnerOpenTime));

      if (needsFlex) {
        try {
          const [updated] = await db
            .update(schema.restaurantSettings)
            .set({ ...FLEXIBLE_BOOKING_PATCH, updatedAt: new Date() })
            .where(eq(schema.restaurantSettings.id, "default"))
            .returning();
          if (updated) row = updated;
        } catch (error) {
          console.error("ensure flexible booking settings error:", error);
        }
      }
    }

    return row;
  } catch (error) {
    console.error("getRestaurantSettings error:", error);
  }

  return { ...DEFAULT_SETTINGS, updatedAt: new Date() };
}

export async function upsertRestaurantSettings(
  input: Omit<RestaurantSettings, "id" | "updatedAt">,
): Promise<RestaurantSettings> {
  const db = getDb();
  const [row] = await db
    .insert(schema.restaurantSettings)
    .values({ id: "default", ...input })
    .onConflictDoUpdate({
      target: schema.restaurantSettings.id,
      set: { ...input, updatedAt: new Date() },
    })
    .returning();

  return row;
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function normalizeToSlot(time: string, slotMinutes: number) {
  const total = timeToMinutes(time);
  const slotStart = Math.floor(total / slotMinutes) * slotMinutes;
  const hours = Math.floor(slotStart / 60);
  const mins = slotStart % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function isInLunchService(time: string, settings: RestaurantSettings) {
  if (!settings.lunchEnabled) return false;
  const minutes = timeToMinutes(time);
  return (
    minutes >= timeToMinutes(settings.lunchOpenTime) &&
    minutes <= timeToMinutes(settings.lunchCloseTime)
  );
}

export function isInDinnerService(time: string, settings: RestaurantSettings) {
  if (!settings.dinnerEnabled) return false;
  const minutes = timeToMinutes(time);
  return (
    minutes >= timeToMinutes(settings.dinnerOpenTime) &&
    minutes <= timeToMinutes(settings.dinnerCloseTime)
  );
}

/** Continuous open window (preferred) or lunch/dinner windows. */
export function isInServiceHours(time: string, settings: RestaurantSettings) {
  const minutes = timeToMinutes(time);
  const open = timeToMinutes(settings.openTime);
  const close = timeToMinutes(settings.closeTime);
  if (Number.isFinite(open) && Number.isFinite(close) && close > open) {
    if (minutes >= open && minutes <= close) return true;
  }
  return isInLunchService(time, settings) || isInDinnerService(time, settings);
}

function formatServiceWindows(settings: RestaurantSettings) {
  if (settings.openTime && settings.closeTime) {
    return `Joka päivä ${settings.openTime}–${settings.closeTime}`;
  }
  const parts: string[] = [];
  if (settings.lunchEnabled) {
    parts.push(`Lounas ${settings.lunchOpenTime}–${settings.lunchCloseTime}`);
  }
  if (settings.dinnerEnabled) {
    parts.push(`Illallinen ${settings.dinnerOpenTime}–${settings.dinnerCloseTime}`);
  }
  return parts.length > 0 ? parts.join(", ") : "Ei palveluaikoja";
}

function formatClosedDays(settings: RestaurantSettings) {
  const closed = parseClosedWeekdays(settings.closedWeekdays);
  if (closed.length === 0) return "Auki joka päivä";
  const labels = closed
    .map((day) => WEEKDAY_OPTIONS.find((option) => Number(option.value) === day)?.label)
    .filter(Boolean);
  return labels.join(", ");
}

export function buildChatbotSystemPrompt(
  settings: RestaurantSettings,
  locale: "fi" | "en" | "es" = "fi",
) {
  const contactRules = [
    settings.requireEmail ? "sähköposti (pakollinen)" : null,
    settings.requirePhone ? "puhelinnumero (pakollinen)" : null,
    !settings.requireEmail && !settings.requirePhone
      ? "puhelin tai sähköposti (vähintään toinen)"
      : null,
  ]
    .filter(Boolean)
    .join(" ja ");

  const identityLines = [
    `- Nimi: ${settings.restaurantName}`,
    settings.restaurantAddress ? `- Osoite: ${settings.restaurantAddress}` : null,
    settings.cuisineType ? `- Keittiö: ${settings.cuisineType}` : null,
    settings.restaurantPhone ? `- Puhelin: ${settings.restaurantPhone}` : null,
    settings.restaurantEmail ? `- Sähköposti: ${settings.restaurantEmail}` : null,
    settings.restaurantDescription ? `- Kuvaus: ${settings.restaurantDescription}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const languageRule =
    locale === "en"
      ? "Always reply in English, professionally and concisely (2–4 sentences)."
      : locale === "es"
        ? "Responde siempre en español, de forma profesional y concisa (2–4 frases)."
        : "Vastaa aina suomeksi, ammattimaisesti ja tiiviisti (2–4 lausetta).";

  const confirmRule =
    locale === "en"
      ? "Confirm the reservation warmly in English and repeat the key details including duration."
      : locale === "es"
        ? "Confirma la reserva con calidez en español y repite los datos principales, incluida la duración."
        : "Vahvista varaus lämpimästi suomeksi ja toista keskeiset tiedot, myös kesto.";

  const clock = formatHelsinkiNowForPrompt();

  const reservationBlock = settings.reservationsEnabled
    ? `
Olet ${settings.restaurantName} -ravintolan varausavustaja. Toimit kuin ravintolan henkilökunta — älä mainitse, että olet demo tai ulkopuolinen palvelu.
Ole joustava ja avulias. Älä keksi turhia estoja. Kun tiedot on kerätty, kutsu create_restaurant_reservation heti.

NYKYHETKI (Europe/Helsinki — ainoa totuus päivästä ja ajasta):
- Nyt: ${clock.nowLabel}
- Tänään: ${clock.today}
- Huomenna: ${clock.tomorrow}
- Kun asiakas sanoo "tänään", käytä päivämäärää ${clock.today}
- Kun asiakas sanoo "huomenna", käytä päivämäärää ${clock.tomorrow}
- Muunna viikonpäivät (esim. lauantai) oikeaan YYYY-MM-DD-päivään Helsingin kalenterin mukaan
- ÄLÄ KOSKAAN väitä, että huominen tai muu tulevaisuuden päivä/aika on jo mennyt
- Mennyt on vain jos varausaika on ennen nykyhetkeä (${clock.today} klo ${clock.time})
- Älä arvaa vuotta tai kuukautta — käytä yllä olevia päivämääriä

RAVINTOLA:
${identityLines}

PALVELUAJAT:
- ${formatServiceWindows(settings)}
- Suljettu: ${formatClosedDays(settings)}

VARAUSSÄÄNNÖT (noudata näitä, älä tiukenna):
- Varauksia otetaan vastaan joka päivä klo ${settings.openTime}–${settings.closeTime}
- Normaali pöytäaika on 2 tuntia
- 3 tunnin varaus onnistuu pyynnöstä — hyväksy jos asiakas pyytää
- Pöytävaraus ${settings.minPartySize}–${settings.maxPartySize} hengelle (isot seurueet OK)
- Älä torju varauksia henkilömäärän takia, jos määrä on ${settings.maxPartySize} tai alle
- Varaus enintään ${settings.advanceBookingDays} päivää etukäteen
- Ei erillistä ennakkoilmoituspakkoa (minNotice = ${settings.minNoticeHours} h)

Kerää varaukselle (voit kysyä 2–3 asiaa kerralla, älä venytä keskustelua):
1. Nimi
2. Henkilömäärä
3. Päivämäärä (YYYY-MM-DD; tänään=${clock.today}, huomenna=${clock.tomorrow})
4. Kellonaika (HH:MM, ${settings.openTime}–${settings.closeTime})
5. Kesto: 2 tai 3 tuntia (oletus 2 jos asiakas ei sano)
6. ${contactRules}
7. Erityistoiveet (valinnainen)

Kun kaikki on kunnossa, kutsu create_restaurant_reservation -työkalua. Laita kestotieto notes-kenttään muodossa "Kesto: 2 h" tai "Kesto: 3 h".
${confirmRule}`
    : `
Pöytävaraukset eivät ole tällä hetkellä käytössä. Ohjaa asiakas soittamaan ravintolaan${
        settings.restaurantPhone ? ` (${settings.restaurantPhone})` : ""
      } tai ottamaan yhteyttä sähköpostitse${
        settings.restaurantEmail ? ` (${settings.restaurantEmail})` : ""
      }.`;

  const extra = settings.chatbotInstructions?.trim()
    ? `\n\nLisäohjeet ravintolasta:\n${settings.chatbotInstructions.trim()}`
    : "";

  return `${reservationBlock}

${languageRule}${extra}`;
}

export function buildReservationTool(settings: RestaurantSettings) {
  const required = ["guest_name", "party_size", "date", "time"] as string[];
  if (settings.requireEmail) required.push("guest_email");
  if (settings.requirePhone) required.push("guest_phone");

  const serviceHint = formatServiceWindows(settings);
  const clock = formatHelsinkiNowForPrompt();

  return {
    type: "function" as const,
    function: {
      name: "create_restaurant_reservation",
      description: `Luo pöytävaraus ravintolaan ${settings.restaurantName}. Normaali kesto 2 h, 3 h pyynnöstä. Ajat Europe/Helsinki (nyt ${clock.nowLabel}).`,
      parameters: {
        type: "object",
        properties: {
          guest_name: { type: "string", description: "Asiakkaan nimi" },
          party_size: {
            type: "number",
            description: `Henkilömäärä (${settings.minPartySize}-${settings.maxPartySize})`,
          },
          date: {
            type: "string",
            description: `Päivämäärä YYYY-MM-DD (Europe/Helsinki). Tänään=${clock.today}, huomenna=${clock.tomorrow}`,
          },
          time: {
            type: "string",
            description: `Aloitusaika HH:MM Europe/Helsinki-ajassa. Palveluajat: ${serviceHint}`,
          },
          duration_hours: {
            type: "number",
            description: "Varauksen kesto tunteina: 2 (normaali) tai 3 (pyynnöstä)",
          },
          guest_email: { type: "string", description: "Sähköposti (vapaaehtoinen)" },
          guest_phone: { type: "string", description: "Puhelinnumero (pakollinen)" },
          notes: { type: "string", description: "Erityistoiveet ja kesto (esim. Kesto: 2 h)" },
        },
        required,
      },
    },
  };
}

export async function validateReservationInput(
  input: {
    guestName: string;
    partySize: number;
    date: string;
    time: string;
    guestEmail?: string;
    guestPhone?: string;
    notes?: string;
    durationHours?: number;
  },
  settings: RestaurantSettings,
) {
  if (!settings.reservationsEnabled) {
    throw new Error("Varaukset eivät ole käytössä");
  }

  if (input.partySize < settings.minPartySize || input.partySize > settings.maxPartySize) {
    throw new Error(`Henkilömäärän tulee olla ${settings.minPartySize}–${settings.maxPartySize}`);
  }

  if (settings.requireEmail && !input.guestEmail?.trim()) {
    throw new Error("Sähköposti on pakollinen");
  }
  if (settings.requirePhone && !input.guestPhone?.trim()) {
    throw new Error("Puhelinnumero on pakollinen");
  }
  if (
    !settings.requireEmail &&
    !settings.requirePhone &&
    !input.guestEmail?.trim() &&
    !input.guestPhone?.trim()
  ) {
    throw new Error("Anna puhelinnumero tai sähköposti");
  }
  if (input.guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.guestEmail)) {
    throw new Error("Virheellinen sähköposti");
  }
  if (input.guestPhone && input.guestPhone.replace(/\D/g, "").length < 6) {
    throw new Error("Virheellinen puhelinnumero");
  }

  if (input.durationHours != null && input.durationHours !== 2 && input.durationHours !== 3) {
    throw new Error("Keston tulee olla 2 tai 3 tuntia");
  }

  const date = normalizeReservationDate(input.date);
  const time = normalizeReservationTime(input.time);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Virheellinen päivämäärä");
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    throw new Error("Virheellinen kellonaika");
  }

  // Keep normalized values for downstream capacity checks
  input.date = date;
  input.time = time;

  const weekday = weekdayFromDateKey(date);
  if (parseClosedWeekdays(settings.closedWeekdays).includes(weekday)) {
    throw new Error("Ravintola on suljettu valittuna päivänä");
  }

  const minutesUntil = minutesUntilHelsinki(date, time);
  if (Number.isNaN(minutesUntil)) {
    throw new Error("Virheellinen päivämäärä tai kellonaika");
  }

  // 30 min grace — only reject when Helsinki wall time is clearly in the past
  if (minutesUntil < -30) {
    const clock = formatHelsinkiNowForPrompt();
    throw new Error(
      `Varausaika ${date} klo ${time} on jo mennyt (nyt ${clock.today} klo ${clock.time}). Ehdota myöhempää aikaa.`,
    );
  }
  if (settings.minNoticeHours > 0 && minutesUntil < settings.minNoticeHours * 60) {
    throw new Error(`Varaus vaatii vähintään ${settings.minNoticeHours} tuntia ennakkoilmoitusta`);
  }

  const maxMinutes = settings.advanceBookingDays * 24 * 60;
  if (minutesUntil > maxMinutes) {
    throw new Error(
      `Varaus voidaan tehdä enintään ${settings.advanceBookingDays} päivää etukäteen`,
    );
  }

  if (!isInServiceHours(time, settings)) {
    throw new Error(
      `Aika ${time} on palveluaikojen ulkopuolella (${formatServiceWindows(settings)})`,
    );
  }

  // Last seating: start time should leave room for at least 2h before close
  const closeMinutes = timeToMinutes(settings.closeTime);
  const startMinutes = timeToMinutes(time);
  const duration = input.durationHours === 3 ? 3 : 2;
  if (startMinutes + duration * 60 > closeMinutes + 30) {
    // Soft warning only if way past close — allow seating until close
    if (startMinutes > closeMinutes) {
      throw new Error(`Viimeinen aloitusaika on klo ${settings.closeTime}`);
    }
  }

  if (!getDatabaseUrl()) return;

  const db = getDb();
  const existing = await db.query.reservations.findMany({
    where: and(
      eq(schema.reservations.reservationDate, date),
      ne(schema.reservations.status, "cancelled"),
    ),
  });

  const slot = normalizeToSlot(time, settings.slotMinutes);
  const slotCovers = existing
    .filter((row) => normalizeToSlot(row.reservationTime, settings.slotMinutes) === slot)
    .reduce((sum, row) => sum + row.partySize, 0);

  // Allow any single party up to maxPartySize; only block if total slot load would exceed cover cap.
  const coverCap = Math.max(settings.maxCoversPerSlot, settings.maxPartySize);
  if (slotCovers + input.partySize > coverCap) {
    throw new Error(
      `Kello ${slot} on ruuhkainen — ehdota toista aikaa (±30–60 min) samalle päivälle`,
    );
  }
}
