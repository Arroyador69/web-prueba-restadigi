import { createFileRoute } from "@tanstack/react-router";

import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDatabaseUrl } from "@/lib/database-url";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  completeCallAndScheduleNext,
  deleteCallEvent,
  updateCallEvent,
  type CallStatus,
} from "@/lib/sales-calls-service";

export const Route = createFileRoute("/api/dashboard/calls/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const limited = enforceRateLimit(request, "dashboard");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Database not configured" }, { status: 503 });
        }

        try {
          const body = (await request.json()) as {
            clientName?: string;
            contactPerson?: string | null;
            phone?: string | null;
            email?: string | null;
            scheduledAt?: string;
            notes?: string | null;
            status?: CallStatus;
            completeAndNextAt?: string | null;
          };

          if (body.completeAndNextAt !== undefined || body.status === "done") {
            const result = await completeCallAndScheduleNext(
              params.id,
              body.notes ?? null,
              body.completeAndNextAt ?? null,
            );
            return Response.json({ ok: true, ...result });
          }

          const call = await updateCallEvent(params.id, {
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
          console.error("Dashboard call update error:", error);
          const message = error instanceof Error ? error.message : "Päivitys epäonnistui";
          return Response.json({ error: message }, { status: 500 });
        }
      },

      DELETE: async ({ request, params }) => {
        const limited = enforceRateLimit(request, "dashboard");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Database not configured" }, { status: 503 });
        }

        try {
          await deleteCallEvent(params.id);
          return Response.json({ ok: true });
        } catch (error) {
          console.error("Dashboard call delete error:", error);
          return Response.json({ error: "Poisto epäonnistui" }, { status: 500 });
        }
      },
    },
  },
});
