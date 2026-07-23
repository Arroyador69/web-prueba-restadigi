import { createFileRoute } from "@tanstack/react-router";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "@/db";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDatabaseUrl } from "@/lib/database-url";
import { enforceRateLimit } from "@/lib/rate-limit";

const patchSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "won", "lost"]).optional(),
  adminNotes: z.string().max(4000).nullable().optional(),
});

export const Route = createFileRoute("/api/dashboard/leads/$id")({
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
          return Response.json({ error: "Virheelliset tiedot" }, { status: 400 });
        }

        if (parsed.data.status === undefined && parsed.data.adminNotes === undefined) {
          return Response.json({ error: "Ei päivitettäviä kenttiä" }, { status: 400 });
        }

        try {
          const db = getDb();
          const [updated] = await db
            .update(schema.salesLeads)
            .set({
              ...(parsed.data.status !== undefined ? { status: parsed.data.status } : {}),
              ...(parsed.data.adminNotes !== undefined
                ? { adminNotes: parsed.data.adminNotes }
                : {}),
              updatedAt: sql`NOW()`,
            })
            .where(eq(schema.salesLeads.id, params.id))
            .returning();

          if (!updated) {
            return Response.json({ error: "Liidiä ei löytynyt" }, { status: 404 });
          }

          return Response.json({ lead: updated });
        } catch (error) {
          console.error("Lead PATCH error:", error);
          return Response.json({ error: "Päivitys epäonnistui" }, { status: 500 });
        }
      },
    },
  },
});
