import { createFileRoute } from "@tanstack/react-router";

import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDatabaseUrl } from "@/lib/database-url";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  createCallEvent,
  listCallsInRange,
  listUpcomingCalls,
  type CallStatus,
} from "@/lib/sales-calls-service";

export const Route = createFileRoute("/api/dashboard/calls")({
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
          const url = new URL(request.url);
          const year = Number(url.searchParams.get("year") ?? new Date().getFullYear());
          const month = Number(url.searchParams.get("month") ?? new Date().getMonth() + 1);

          if (!year || month < 1 || month > 12) {
            return Response.json({ error: "Virheellinen kuukausi" }, { status: 400 });
          }

          const from = new Date(Date.UTC(year, month - 1, 1));
          const to = new Date(Date.UTC(year, month, 1));
          const [calls, upcoming] = await Promise.all([
            listCallsInRange(from, to),
            listUpcomingCalls(15),
          ]);

          return Response.json({ calls, upcoming, year, month });
        } catch (error) {
          console.error("Dashboard calls list error:", error);
          return Response.json({ error: "Soitukalenterin lataus epäonnistui" }, { status: 500 });
        }
      },

      POST: async ({ request }) => {
        const limited = enforceRateLimit(request, "dashboard");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Database not configured" }, { status: 503 });
        }

        try {
          const body = (await request.json()) as {
            clientName?: string;
            contactPerson?: string;
            phone?: string;
            email?: string;
            scheduledAt?: string;
            notes?: string;
            status?: CallStatus;
          };

          if (!body.clientName?.trim() || !body.scheduledAt) {
            return Response.json(
              { error: "Asiakas ja soittoaika ovat pakollisia" },
              { status: 400 },
            );
          }

          const call = await createCallEvent({
            clientName: body.clientName,
            contactPerson: body.contactPerson,
            phone: body.phone,
            email: body.email,
            scheduledAt: body.scheduledAt,
            notes: body.notes,
            status: body.status,
          });

          return Response.json({ ok: true, call });
        } catch (error) {
          console.error("Dashboard call create error:", error);
          const message = error instanceof Error ? error.message : "Tallennus epäonnistui";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
