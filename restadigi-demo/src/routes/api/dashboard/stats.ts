import { createFileRoute } from "@tanstack/react-router";
import { count, desc, gte, sql } from "drizzle-orm";

import { getDb, schema } from "@/db";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { ensureSalesLeadsTable } from "@/lib/chat-service";
import { getDatabaseUrl } from "@/lib/database-url";
import { enforceRateLimit } from "@/lib/rate-limit";

export const Route = createFileRoute("/api/dashboard/stats")({
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
          const since = new Date();
          since.setDate(since.getDate() - 30);

          const [pageViewCount] = await db
            .select({ count: count() })
            .from(schema.pageViews)
            .where(gte(schema.pageViews.createdAt, since));

          const uniqueVisitorsResult = await db.execute<{ count: number }>(
            sql`SELECT COUNT(DISTINCT visitor_session_id)::int AS count FROM page_views WHERE created_at >= ${since}`,
          );

          const [chatCount] = await db
            .select({ count: count() })
            .from(schema.chatSessions)
            .where(gte(schema.chatSessions.createdAt, since));

          const [reservationCount] = await db
            .select({ count: count() })
            .from(schema.reservations)
            .where(gte(schema.reservations.createdAt, since));

          let salesLeads = 0;
          try {
            await ensureSalesLeadsTable();
            const [leadCount] = await db
              .select({ count: count() })
              .from(schema.salesLeads)
              .where(gte(schema.salesLeads.createdAt, since));
            salesLeads = leadCount?.count ?? 0;
          } catch {
            salesLeads = 0;
          }

          const viewsByDayResult = await db.execute<{ day: string; views: number }>(
            sql`SELECT to_char(created_at, 'YYYY-MM-DD') AS day, COUNT(*)::int AS views
                FROM page_views
                WHERE created_at >= ${since}
                GROUP BY day
                ORDER BY day`,
          );

          const topPagesResult = await db.execute<{ path: string; views: number }>(
            sql`SELECT path, COUNT(*)::int AS views
                FROM page_views
                WHERE created_at >= ${since}
                GROUP BY path
                ORDER BY views DESC
                LIMIT 8`,
          );

          const uniqueRow = uniqueVisitorsResult.rows[0];

          return Response.json({
            pageViews: pageViewCount?.count ?? 0,
            uniqueVisitors: uniqueRow?.count ?? 0,
            chatSessions: chatCount?.count ?? 0,
            reservations: reservationCount?.count ?? 0,
            salesLeads,
            viewsByDay: viewsByDayResult.rows,
            topPages: topPagesResult.rows,
          });
        } catch (error) {
          console.error("Dashboard stats error:", error);
          const message = error instanceof Error ? error.message : "Tilastojen lataus epäonnistui";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
