import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

import { getDb, schema } from "@/db";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDatabaseUrl } from "@/lib/database-url";
import { enforceRateLimit } from "@/lib/rate-limit";

export const Route = createFileRoute("/api/dashboard/conversations/$sessionId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const limited = enforceRateLimit(request, "dashboard");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Database not configured" }, { status: 503 });
        }

        try {
          const db = getDb();
          const messages = await db.query.chatMessages.findMany({
            where: eq(schema.chatMessages.sessionId, params.sessionId),
            orderBy: [schema.chatMessages.createdAt],
          });

          const reservation = await db.query.reservations.findFirst({
            where: eq(schema.reservations.chatSessionId, params.sessionId),
          });

          return Response.json({ messages, reservation });
        } catch (error) {
          console.error("Dashboard conversation detail error:", error);
          return Response.json({ error: "Conversation load failed" }, { status: 500 });
        }
      },
    },
  },
});
