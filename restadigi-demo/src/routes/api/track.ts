import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getDb, schema } from "@/db";
import { getDatabaseUrl } from "@/lib/database-url";
import { enforceRateLimit } from "@/lib/rate-limit";

const trackSchema = z.object({
  visitorSessionId: z.string().uuid(),
  path: z.string().min(1).max(500),
  referrer: z.string().max(2000).optional(),
});

export const Route = createFileRoute("/api/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const limited = enforceRateLimit(request, "track");
        if (limited) return limited;

        if (!getDatabaseUrl()) {
          return Response.json({ ok: true, skipped: true });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const parsed = trackSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Invalid payload" }, { status: 400 });
        }

        try {
          const db = getDb();
          await db.insert(schema.pageViews).values({
            visitorSessionId: parsed.data.visitorSessionId,
            path: parsed.data.path,
            referrer: parsed.data.referrer ?? null,
            userAgent: request.headers.get("user-agent"),
          });
          return Response.json({ ok: true });
        } catch (error) {
          console.error("Track error:", error);
          return Response.json({ error: "Tracking failed" }, { status: 500 });
        }
      },
    },
  },
});
