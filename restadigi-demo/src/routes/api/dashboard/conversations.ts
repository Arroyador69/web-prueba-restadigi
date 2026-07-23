import { createFileRoute } from "@tanstack/react-router";
import { count, desc, eq } from "drizzle-orm";

import { getDb, schema } from "@/db";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDatabaseUrl } from "@/lib/database-url";
import { enforceRateLimit } from "@/lib/rate-limit";

export const Route = createFileRoute("/api/dashboard/conversations")({
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
          const db = getDb();
          const sessions = await db.query.chatSessions.findMany({
            orderBy: [desc(schema.chatSessions.updatedAt)],
            limit: 50,
          });

          const result = await Promise.all(
            sessions.map(async (session) => {
              const [msgCount] = await db
                .select({ count: count() })
                .from(schema.chatMessages)
                .where(eq(schema.chatMessages.sessionId, session.id));

              const lastMessage = await db.query.chatMessages.findFirst({
                where: eq(schema.chatMessages.sessionId, session.id),
                orderBy: [desc(schema.chatMessages.createdAt)],
              });

              const reservation = await db.query.reservations.findFirst({
                where: eq(schema.reservations.chatSessionId, session.id),
              });

              return {
                id: session.id,
                visitorSessionId: session.visitorSessionId,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
                messageCount: msgCount?.count ?? 0,
                lastMessage: lastMessage?.content ?? null,
                hasReservation: Boolean(reservation),
              };
            }),
          );

          return Response.json({ sessions: result });
        } catch (error) {
          console.error("Dashboard conversations error:", error);
          return Response.json({ error: "Conversations load failed" }, { status: 500 });
        }
      },
    },
  },
});
