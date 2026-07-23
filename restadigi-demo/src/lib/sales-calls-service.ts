import { and, asc, eq, gte, lt, sql } from "drizzle-orm";

import { getDb, schema } from "@/db";

export type CallStatus = "planned" | "done" | "cancelled";

export type CallEventInput = {
  clientName: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  scheduledAt: string | Date;
  status?: CallStatus;
  notes?: string | null;
};

export async function ensureSalesCallTables() {
  const db = getDb();
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS sales_call_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_name TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT,
      email TEXT,
      scheduled_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL DEFAULT 'planned',
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS idx_sales_call_events_scheduled_at ON sales_call_events(scheduled_at)`,
  );
}

function parseScheduledAt(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Virheellinen soittoaika");
  }
  return date;
}

export async function listCallsInRange(from: Date, to: Date) {
  await ensureSalesCallTables();
  const db = getDb();
  return db.query.salesCallEvents.findMany({
    where: and(
      gte(schema.salesCallEvents.scheduledAt, from),
      lt(schema.salesCallEvents.scheduledAt, to),
    ),
    orderBy: [asc(schema.salesCallEvents.scheduledAt)],
  });
}

export async function listUpcomingCalls(limit = 20) {
  await ensureSalesCallTables();
  const db = getDb();
  const now = new Date();
  return db.query.salesCallEvents.findMany({
    where: and(
      gte(schema.salesCallEvents.scheduledAt, now),
      eq(schema.salesCallEvents.status, "planned"),
    ),
    orderBy: [asc(schema.salesCallEvents.scheduledAt)],
    limit,
  });
}

export async function createCallEvent(input: CallEventInput) {
  await ensureSalesCallTables();
  const clientName = input.clientName.trim();
  if (!clientName) throw new Error("Asiakkaan nimi on pakollinen");

  const db = getDb();
  const [row] = await db
    .insert(schema.salesCallEvents)
    .values({
      clientName,
      contactPerson: input.contactPerson?.trim() || null,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      scheduledAt: parseScheduledAt(input.scheduledAt),
      status: input.status ?? "planned",
      notes: input.notes?.trim() || null,
    })
    .returning();

  return row;
}

export async function updateCallEvent(id: string, input: Partial<CallEventInput>) {
  await ensureSalesCallTables();
  const db = getDb();

  const patch: Partial<typeof schema.salesCallEvents.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.clientName !== undefined) {
    const name = input.clientName.trim();
    if (!name) throw new Error("Asiakkaan nimi on pakollinen");
    patch.clientName = name;
  }
  if (input.contactPerson !== undefined) patch.contactPerson = input.contactPerson?.trim() || null;
  if (input.phone !== undefined) patch.phone = input.phone?.trim() || null;
  if (input.email !== undefined) patch.email = input.email?.trim() || null;
  if (input.notes !== undefined) patch.notes = input.notes?.trim() || null;
  if (input.status !== undefined) patch.status = input.status;
  if (input.scheduledAt !== undefined) patch.scheduledAt = parseScheduledAt(input.scheduledAt);

  const [row] = await db
    .update(schema.salesCallEvents)
    .set(patch)
    .where(eq(schema.salesCallEvents.id, id))
    .returning();

  if (!row) throw new Error("Soitutapahtumaa ei löytynyt");
  return row;
}

export async function deleteCallEvent(id: string) {
  await ensureSalesCallTables();
  const db = getDb();
  await db.delete(schema.salesCallEvents).where(eq(schema.salesCallEvents.id, id));
}

/** Mark current call done and optionally schedule the next one (same client). */
export async function completeCallAndScheduleNext(
  id: string,
  notes: string | null,
  nextScheduledAt?: string | null,
) {
  const current = await updateCallEvent(id, {
    status: "done",
    notes: notes ?? undefined,
  });

  if (!nextScheduledAt) return { current, next: null };

  const next = await createCallEvent({
    clientName: current.clientName,
    contactPerson: current.contactPerson,
    phone: current.phone,
    email: current.email,
    scheduledAt: nextScheduledAt,
    status: "planned",
    notes: `Seuraava soitto · edellinen: ${current.scheduledAt.toISOString().slice(0, 10)}`,
  });

  return { current, next };
}
