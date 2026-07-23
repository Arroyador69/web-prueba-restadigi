import { createFileRoute } from "@tanstack/react-router";
import { desc } from "drizzle-orm";

import { getDb, schema } from "@/db";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { ensureSalesLeadsTable } from "@/lib/chat-service";
import { getDatabaseUrl } from "@/lib/database-url";
import { enforceRateLimit } from "@/lib/rate-limit";

export const Route = createFileRoute("/api/dashboard/leads")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const limited = enforceRateLimit(request, "dashboard");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Database not configured" }, { status: 503 });
        }

        try {
          await ensureSalesLeadsTable();
          const db = getDb();
          const leads = await db.query.salesLeads.findMany({
            orderBy: [desc(schema.salesLeads.createdAt)],
          });

          return Response.json({ leads });
        } catch (error) {
          console.error("Dashboard leads error:", error);
          return Response.json({ error: "Liidien lataus epäonnistui" }, { status: 500 });
        }
      },
    },
  },
});
