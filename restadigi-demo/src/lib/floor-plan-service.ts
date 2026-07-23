import { sql } from "drizzle-orm";

import { getDb } from "@/db";
import { getDatabaseUrl } from "@/lib/database-url";
import {
  countBySeats,
  DEMO_FLOOR_PLAN,
  type FloorPlan,
  type FloorTable,
  sumSeats,
} from "@/lib/floor-plan";

export async function ensureFloorPlanTable() {
  const db = getDb();
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS restaurant_floor_plans (
      id TEXT PRIMARY KEY DEFAULT 'default',
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      tables_json TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function parseTables(raw: string): FloorTable[] {
  const parsed = JSON.parse(raw) as FloorTable[];
  if (!Array.isArray(parsed)) return DEMO_FLOOR_PLAN.tables;
  return parsed;
}

export async function getFloorPlan(): Promise<FloorPlan> {
  if (!getDatabaseUrl()) {
    return DEMO_FLOOR_PLAN;
  }

  try {
    await ensureFloorPlanTable();
    const db = getDb();
    const rows = await db.execute<{
      id: string;
      name: string;
      capacity: number;
      tables_json: string;
    }>(
      sql`SELECT id, name, capacity, tables_json FROM restaurant_floor_plans WHERE id = 'default' LIMIT 1`,
    );

    const row = rows.rows?.[0];
    if (!row) {
      await seedDemoFloorPlan();
      return DEMO_FLOOR_PLAN;
    }

    const tables = parseTables(row.tables_json);
    return {
      id: row.id,
      name: row.name,
      capacity: row.capacity,
      tables,
    };
  } catch (error) {
    console.error("getFloorPlan error:", error);
    return DEMO_FLOOR_PLAN;
  }
}

export async function seedDemoFloorPlan() {
  const db = getDb();
  await db.execute(sql`
    INSERT INTO restaurant_floor_plans (id, name, capacity, tables_json, updated_at)
    VALUES (
      'default',
      ${DEMO_FLOOR_PLAN.name},
      ${DEMO_FLOOR_PLAN.capacity},
      ${JSON.stringify(DEMO_FLOOR_PLAN.tables)},
      NOW()
    )
    ON CONFLICT (id) DO NOTHING
  `);
}

export async function upsertFloorPlan(plan: FloorPlan): Promise<FloorPlan> {
  const db = getDb();
  await ensureFloorPlanTable();
  await db.execute(sql`
    INSERT INTO restaurant_floor_plans (id, name, capacity, tables_json, updated_at)
    VALUES (
      'default',
      ${plan.name},
      ${plan.capacity},
      ${JSON.stringify(plan.tables)},
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      capacity = EXCLUDED.capacity,
      tables_json = EXCLUDED.tables_json,
      updated_at = NOW()
  `);
  return plan;
}

export function floorPlanStats(plan: FloorPlan) {
  const seats = sumSeats(plan.tables);
  const bySeats = countBySeats(plan.tables);
  return {
    tableCount: plan.tables.length,
    seats,
    bySeats,
    capacityMatch: seats === plan.capacity,
  };
}
