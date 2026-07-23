import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDatabaseUrl } from "@/lib/database-url";
import { DEMO_FLOOR_PLAN, type FloorPlan, type TableSeats } from "@/lib/floor-plan";
import { floorPlanStats, getFloorPlan, upsertFloorPlan } from "@/lib/floor-plan-service";
import { enforceRateLimit } from "@/lib/rate-limit";

const tableSchema = z.object({
  id: z.string().min(1).max(40),
  label: z.string().min(1).max(20),
  seats: z.union([z.literal(2), z.literal(4), z.literal(6), z.literal(8)]),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  shape: z.enum(["round", "rect"]),
  zone: z.enum(["ikkuna", "sali", "terassi", "kabinetti"]),
});

const planSchema = z.object({
  id: z.string().min(1).max(40),
  name: z.string().min(1).max(120),
  capacity: z.number().int().min(10).max(500),
  tables: z.array(tableSchema).min(1).max(120),
});

export const Route = createFileRoute("/api/dashboard/floor-plan")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const limited = enforceRateLimit(request, "dashboard");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();

        try {
          const plan = await getFloorPlan();
          return Response.json({ plan, stats: floorPlanStats(plan) });
        } catch (error) {
          console.error("Floor plan GET error:", error);
          return Response.json(
            { plan: DEMO_FLOOR_PLAN, stats: floorPlanStats(DEMO_FLOOR_PLAN) },
            { status: 200 },
          );
        }
      },

      PUT: async ({ request }) => {
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

        // Allow reset to demo
        if (
          body &&
          typeof body === "object" &&
          "reset" in body &&
          (body as { reset?: boolean }).reset === true
        ) {
          const plan = await upsertFloorPlan(DEMO_FLOOR_PLAN);
          return Response.json({ plan, stats: floorPlanStats(plan) });
        }

        const parsed = planSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Virheellinen pöytäkartta" }, { status: 400 });
        }

        const plan = parsed.data as FloorPlan;
        const seatsOk = plan.tables.every((t) => ([2, 4, 6, 8] as TableSeats[]).includes(t.seats));
        if (!seatsOk) {
          return Response.json({ error: "Pöydän koon tulee olla 2, 4, 6 tai 8" }, { status: 400 });
        }

        try {
          const saved = await upsertFloorPlan(plan);
          return Response.json({ plan: saved, stats: floorPlanStats(saved) });
        } catch (error) {
          console.error("Floor plan PUT error:", error);
          return Response.json({ error: "Pöytäkartan tallennus epäonnistui" }, { status: 500 });
        }
      },
    },
  },
});
