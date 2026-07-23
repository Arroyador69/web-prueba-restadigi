import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { dbReady, schema } from "@/db";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDatabaseUrl } from "@/lib/database-url";
import { blockVisitorPersistence, demoNotPersisted } from "@/lib/demo-write-guard";
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
          if (blockVisitorPersistence()) {
            return Response.json(
              demoNotPersisted({
                reservation: { id: params.id, status: parsed.data.status },
              }),
            );
          }

          const db = await dbReady();
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
