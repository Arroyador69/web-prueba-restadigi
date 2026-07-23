import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDatabaseUrl } from "@/lib/database-url";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getRestaurantSettings, upsertRestaurantSettings } from "@/lib/settings-service";

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/);

const settingsSchema = z.object({
  restaurantName: z.string().min(1).max(120),
  restaurantAddress: z.string().max(200).nullable().optional(),
  restaurantPhone: z.string().max(40).nullable().optional(),
  restaurantEmail: z.string().max(120).nullish(),
  cuisineType: z.string().max(120).nullable().optional(),
  restaurantDescription: z.string().max(1000).nullable().optional(),
  chatbotWelcomeMessage: z.string().min(1).max(500),
  chatbotInstructions: z.string().max(2000).nullable().optional(),
  requireEmail: z.boolean(),
  requirePhone: z.boolean(),
  minPartySize: z.number().int().min(1).max(50),
  maxPartySize: z.number().int().min(1).max(100),
  openTime: timeSchema,
  closeTime: timeSchema,
  lunchEnabled: z.boolean(),
  lunchOpenTime: timeSchema,
  lunchCloseTime: timeSchema,
  dinnerEnabled: z.boolean(),
  dinnerOpenTime: timeSchema,
  dinnerCloseTime: timeSchema,
  slotMinutes: z.number().int().min(15).max(120),
  maxCoversPerSlot: z.number().int().min(1).max(200),
  maxCoversPerEvening: z.number().int().min(1).max(500),
  closedWeekdays: z.string().max(20),
  advanceBookingDays: z.number().int().min(1).max(365),
  minNoticeHours: z.number().int().min(0).max(168),
  reservationsEnabled: z.boolean(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const Route = createFileRoute("/api/dashboard/settings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const limited = enforceRateLimit(request, "dashboard");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();

        try {
          const settings = await getRestaurantSettings();
          return Response.json({ settings });
        } catch (error) {
          console.error("Dashboard settings GET error:", error);
          return Response.json({ error: "Asetusten lataus epäonnistui" }, { status: 500 });
        }
      },
      PUT: async ({ request }) => {
        const limited = enforceRateLimit(request, "dashboard", ":write");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Tietokantaa ei ole konfiguroitu" }, { status: 503 });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Virheellinen pyyntö" }, { status: 400 });
        }

        const parsed = settingsSchema.safeParse(body);
        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0]?.message ?? "Virheelliset asetukset";
          return Response.json({ error: firstIssue }, { status: 400 });
        }

        if (parsed.data.minPartySize > parsed.data.maxPartySize) {
          return Response.json(
            { error: "Minimi henkilömäärä ei voi olla suurempi kuin maksimi" },
            { status: 400 },
          );
        }

        if (!parsed.data.lunchEnabled && !parsed.data.dinnerEnabled) {
          return Response.json(
            { error: "Vähintään yksi palvelu (lounas tai illallinen) on oltava käytössä" },
            { status: 400 },
          );
        }

        if (!parsed.data.requireEmail && !parsed.data.requirePhone) {
          return Response.json(
            { error: "Sähköposti tai puhelin on oltava pakollinen varauksessa" },
            { status: 400 },
          );
        }

        if (
          parsed.data.restaurantEmail &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.data.restaurantEmail)
        ) {
          return Response.json({ error: "Virheellinen ravintolan sähköposti" }, { status: 400 });
        }

        try {
          const settings = await upsertRestaurantSettings({
            ...parsed.data,
            restaurantAddress: parsed.data.restaurantAddress ?? null,
            restaurantPhone: parsed.data.restaurantPhone ?? null,
            restaurantEmail: parsed.data.restaurantEmail ?? null,
            cuisineType: parsed.data.cuisineType ?? null,
            restaurantDescription: parsed.data.restaurantDescription ?? null,
            chatbotInstructions: parsed.data.chatbotInstructions ?? null,
          });
          return Response.json({ settings });
        } catch (error) {
          console.error("Dashboard settings PUT error:", error);
          return Response.json({ error: "Asetusten tallennus epäonnistui" }, { status: 500 });
        }
      },
    },
  },
});
