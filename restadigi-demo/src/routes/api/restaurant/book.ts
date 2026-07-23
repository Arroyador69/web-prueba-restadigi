import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { createReservation } from "@/lib/chat-service";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getRestaurantSettings } from "@/lib/settings-service";

const bodySchema = z.object({
  guestName: z.string().min(2).max(120),
  guestEmail: z.string().email().optional().or(z.literal("")),
  guestPhone: z.string().min(5).max(40),
  partySize: z.coerce.number().int().min(1).max(80),
  reservationDate: z.string().min(8).max(12),
  reservationTime: z.string().min(4).max(8),
  notes: z.string().max(500).optional(),
});

export const Route = createFileRoute("/api/restaurant/book")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const limited = enforceRateLimit(request, "book");
        if (limited) return limited;

        try {
          const json = await request.json();
          const parsed = bodySchema.safeParse(json);
          if (!parsed.success) {
            return Response.json({ error: "Invalid booking data" }, { status: 400 });
          }

          const settings = await getRestaurantSettings();
          if (!settings.reservationsEnabled) {
            return Response.json({ error: "Reservations disabled" }, { status: 403 });
          }

          const data = parsed.data;
          const reservation = await createReservation(
            {
              guestName: data.guestName,
              guestEmail: data.guestEmail || undefined,
              guestPhone: data.guestPhone,
              partySize: data.partySize,
              date: data.reservationDate,
              time: data.reservationTime,
              notes: data.notes || "Landing form (public demo)",
            },
            settings,
          );

          return Response.json({ ok: true, reservation });
        } catch (error) {
          console.error("Public book error:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "Booking failed" },
            { status: 400 },
          );
        }
      },
    },
  },
});
