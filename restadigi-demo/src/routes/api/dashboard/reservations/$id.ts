import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "@/db";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDatabaseUrl } from "@/lib/database-url";
import { enforceRateLimit } from "@/lib/rate-limit";

const patchSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

export const Route = createFileRoute("/api/dashboard/reservations/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const limited = enforceRateLimit(request, "dashboard", ":write");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Database not configured" }, { status: 503 });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Virheellinen pyyntö" }, { status: 400 });
        }

        const parsed = patchSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Virheellinen tila" }, { status: 400 });
        }

        try {
          const db = getDb();
          const [updated] = await db
            .update(schema.reservations)
            .set({ status: parsed.data.status })
            .where(eq(schema.reservations.id, params.id))
            .returning();

          if (!updated) {
            return Response.json({ error: "Varausta ei löytynyt" }, { status: 404 });
          }

          return Response.json({ reservation: updated });
        } catch (error) {
          console.error("Reservation PATCH error:", error);
          return Response.json({ error: "Päivitys epäonnistui" }, { status: 500 });
        }
      },
    },
  },
});
