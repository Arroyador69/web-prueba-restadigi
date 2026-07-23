/**
 * Auto-crea tablas Restadigi + datos de ejemplo (demo pública).
 * Seguro de llamar en cada request: solo corre una vez por instancia.
 */
import { neon } from "@neondatabase/serverless";
import { count } from "drizzle-orm";

import { getDb, schema } from "@/db";
import { getDatabaseUrl } from "@/lib/database-url";
import { DEMO_FLOOR_PLAN } from "@/lib/floor-plan";

const DDL = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  party_size INTEGER NOT NULL,
  reservation_date TEXT NOT NULL,
  reservation_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'chatbot',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurant_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  restaurant_name TEXT NOT NULL DEFAULT 'Demo Ravintola',
  restaurant_address TEXT,
  restaurant_phone TEXT,
  restaurant_email TEXT,
  cuisine_type TEXT,
  restaurant_description TEXT,
  chatbot_welcome_message TEXT NOT NULL DEFAULT 'Hei! Tervetuloa. Autan pöytävarauksessa.',
  chatbot_instructions TEXT,
  require_email BOOLEAN NOT NULL DEFAULT false,
  require_phone BOOLEAN NOT NULL DEFAULT true,
  min_party_size INTEGER NOT NULL DEFAULT 1,
  max_party_size INTEGER NOT NULL DEFAULT 80,
  open_time TEXT NOT NULL DEFAULT '12:00',
  close_time TEXT NOT NULL DEFAULT '22:00',
  lunch_enabled BOOLEAN NOT NULL DEFAULT true,
  lunch_open_time TEXT NOT NULL DEFAULT '12:00',
  lunch_close_time TEXT NOT NULL DEFAULT '22:00',
  dinner_enabled BOOLEAN NOT NULL DEFAULT false,
  dinner_open_time TEXT NOT NULL DEFAULT '17:00',
  dinner_close_time TEXT NOT NULL DEFAULT '22:00',
  slot_minutes INTEGER NOT NULL DEFAULT 30,
  max_covers_per_slot INTEGER NOT NULL DEFAULT 80,
  max_covers_per_evening INTEGER NOT NULL DEFAULT 200,
  closed_weekdays TEXT NOT NULL DEFAULT '',
  advance_booking_days INTEGER NOT NULL DEFAULT 90,
  min_notice_hours INTEGER NOT NULL DEFAULT 0,
  reservations_enabled BOOLEAN NOT NULL DEFAULT true,
  accent_color TEXT NOT NULL DEFAULT '#c46a32',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  name TEXT,
  company TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  interest TEXT,
  notes TEXT,
  admin_notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'sales_chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurant_floor_plans (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  tables_json TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mail_attachments (
  slot TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  content_base64 TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mail_templates (
  id TEXT PRIMARY KEY DEFAULT 'default',
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outbound_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  to_name TEXT,
  subject TEXT NOT NULL,
  tracking_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  attachment_slots TEXT NOT NULL DEFAULT 'pdf1,pdf2',
  open_count INTEGER NOT NULL DEFAULT 0,
  opened_at TIMESTAMPTZ,
  last_opened_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_sales_leads_created_at ON sales_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_leads_status ON sales_leads(status);
CREATE INDEX IF NOT EXISTS idx_sales_call_events_scheduled_at ON sales_call_events(scheduled_at);
`;

let bootPromise: Promise<void> | null = null;

function daysAgo(n: number, hour = 12) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 15, 0, 0);
  return d;
}

function isoDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

async function runDdl(sql: ReturnType<typeof neon>) {
  const parts = DDL.split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of parts) {
    await sql(statement as never);
  }
}

async function seedIfEmpty() {
  const db = getDb();
  const [pv] = await db.select({ count: count() }).from(schema.pageViews);
  if ((pv?.count ?? 0) > 0) return;

  // Settings
  await db
    .insert(schema.restaurantSettings)
    .values({
      id: "default",
      restaurantName: "Demo Ravintola",
      restaurantAddress: "Mannerheimintie 1, 00100 Helsinki",
      restaurantPhone: "+358 40 123 4567",
      restaurantEmail: "varaukset@demoravintola.fi",
      cuisineType: "Pohjoismainen",
      restaurantDescription:
        "Julkinen Restadigi-demo. Varaa pöytä lomakkeella tai chatilla ja tutki hallintapaneelia.",
      requireEmail: false,
      requirePhone: true,
      openTime: "12:00",
      closeTime: "22:00",
      lunchEnabled: true,
      lunchOpenTime: "12:00",
      lunchCloseTime: "22:00",
      dinnerEnabled: false,
      closedWeekdays: "",
      minNoticeHours: 0,
      maxPartySize: 80,
      maxCoversPerSlot: 80,
      reservationsEnabled: true,
      accentColor: "#c46a32",
    })
    .onConflictDoNothing();

  // Floor plan via raw SQL (no drizzle table export required)
  const sql = neon(getDatabaseUrl()!);
  await sql`
    INSERT INTO restaurant_floor_plans (id, name, capacity, tables_json)
    VALUES (
      'default',
      ${DEMO_FLOOR_PLAN.name},
      ${DEMO_FLOOR_PLAN.capacity},
      ${JSON.stringify(DEMO_FLOOR_PLAN.tables)}
    )
    ON CONFLICT (id) DO NOTHING
  `;

  // Page views
  const paths = ["/", "/dashboard", "/", "/", "/dashboard/reservations", "/dashboard/settings"];
  for (let i = 0; i < 24; i++) {
    await db.insert(schema.pageViews).values({
      visitorSessionId: `demo-visitor-${(i % 8) + 1}`,
      path: paths[i % paths.length],
      referrer: i % 3 === 0 ? "https://google.com" : i % 3 === 1 ? "https://instagram.com" : null,
      userAgent: "DemoBot/1.0",
      createdAt: daysAgo(i % 12, 10 + (i % 8)),
    });
  }

  // Chat sessions + messages
  const [s1] = await db
    .insert(schema.chatSessions)
    .values({ visitorSessionId: "demo-visitor-1", createdAt: daysAgo(2, 18), updatedAt: daysAgo(2, 18) })
    .returning();
  const [s2] = await db
    .insert(schema.chatSessions)
    .values({ visitorSessionId: "demo-visitor-2", createdAt: daysAgo(1, 14), updatedAt: daysAgo(1, 14) })
    .returning();
  const [s3] = await db
    .insert(schema.chatSessions)
    .values({ visitorSessionId: "demo-visitor-3", createdAt: daysAgo(0, 11), updatedAt: daysAgo(0, 11) })
    .returning();

  if (s1) {
    await db.insert(schema.chatMessages).values([
      {
        sessionId: s1.id,
        role: "assistant",
        content: "Hei! Autan pöytävarauksessa. Montako henkilöä ja milloin?",
        createdAt: daysAgo(2, 18),
      },
      {
        sessionId: s1.id,
        role: "user",
        content: "Huomenna klo 19 neljälle, nimeni on Anna Virtanen, puh +358401111111",
        createdAt: daysAgo(2, 18),
      },
      {
        sessionId: s1.id,
        role: "assistant",
        content: "Valmis! Varaus vahvistettu Annolle klo 19, 4 hlö.",
        createdAt: daysAgo(2, 18),
      },
    ]);
  }
  if (s2) {
    await db.insert(schema.chatMessages).values([
      {
        sessionId: s2.id,
        role: "assistant",
        content: "Tervetuloa! Haluatko varata pöydän?",
        createdAt: daysAgo(1, 14),
      },
      {
        sessionId: s2.id,
        role: "user",
        content: "Perjantaina 20:00 kahdelle. Mikko, +358402222222",
        createdAt: daysAgo(1, 14),
      },
    ]);
  }
  if (s3) {
    await db.insert(schema.chatMessages).values([
      {
        sessionId: s3.id,
        role: "user",
        content: "Onko terassipaikkoja lauantaina?",
        createdAt: daysAgo(0, 11),
      },
      {
        sessionId: s3.id,
        role: "assistant",
        content: "Kyllä, terassilla on tilaa. Kerro henkilömäärä ja kellonaika.",
        createdAt: daysAgo(0, 11),
      },
    ]);
  }

  // Reservations
  await db.insert(schema.reservations).values([
    {
      chatSessionId: s1?.id ?? null,
      guestName: "Anna Virtanen",
      guestEmail: "anna@example.fi",
      guestPhone: "+358401111111",
      partySize: 4,
      reservationDate: isoDate(1),
      reservationTime: "19:00",
      status: "confirmed",
      notes: "Demo · ikkunapöytä",
      source: "chatbot",
      createdAt: daysAgo(2, 18),
    },
    {
      guestName: "Mikko Nieminen",
      guestPhone: "+358402222222",
      partySize: 2,
      reservationDate: isoDate(2),
      reservationTime: "20:00",
      status: "pending",
      notes: "Demo",
      source: "landing",
      createdAt: daysAgo(1, 14),
    },
    {
      guestName: "Sofia Korhonen",
      guestEmail: "sofia@example.fi",
      guestPhone: "+358403333333",
      partySize: 6,
      reservationDate: isoDate(3),
      reservationTime: "18:30",
      status: "confirmed",
      notes: "Syntymäpäivä · demo",
      source: "chatbot",
      createdAt: daysAgo(3, 16),
    },
    {
      guestName: "Carlos García",
      guestPhone: "+34600111222",
      partySize: 3,
      reservationDate: isoDate(0),
      reservationTime: "13:00",
      status: "completed",
      notes: "Lounas · demo",
      source: "landing",
      createdAt: daysAgo(5, 9),
    },
    {
      guestName: "Emily Johnson",
      guestEmail: "emily@example.com",
      guestPhone: "+447700900123",
      partySize: 5,
      reservationDate: isoDate(5),
      reservationTime: "19:30",
      status: "pending",
      notes: "Tourist group · demo",
      source: "chatbot",
      createdAt: daysAgo(0, 10),
    },
  ]);

  // Leads
  await db.insert(schema.salesLeads).values([
    {
      name: "Ville Heikkinen",
      company: "Helsinki Bistro Oy",
      phone: "+358404444444",
      email: "ville@helsinkibistro.fi",
      interest: "Pöytävaraus + verkkosivut",
      notes: "Demo-liidi",
      status: "new",
      source: "sales_chat",
      createdAt: daysAgo(1, 15),
      updatedAt: daysAgo(1, 15),
    },
    {
      name: "Laura Mäkinen",
      company: "Café Aura",
      phone: "+358405555555",
      email: "laura@cafeaura.fi",
      interest: "AI-asiakaspalvelu",
      status: "contacted",
      source: "sales_chat",
      createdAt: daysAgo(4, 11),
      updatedAt: daysAgo(3, 11),
    },
    {
      name: "Joonas Laine",
      company: "Nordic Kitchen",
      phone: "+358406666666",
      email: "joonas@nordickitchen.fi",
      interest: "Koko paketti",
      status: "qualified",
      adminNotes: "Haluaa demopuhelun ensi viikolla",
      source: "sales_chat",
      createdAt: daysAgo(6, 10),
      updatedAt: daysAgo(2, 10),
    },
    {
      name: "María López",
      company: "Tapas Norte",
      phone: "+34600999888",
      email: "maria@tapasnorte.es",
      interest: "Reservas online",
      status: "new",
      source: "sales_chat",
      createdAt: daysAgo(0, 12),
      updatedAt: daysAgo(0, 12),
    },
  ]);

  // Sales calls
  await sql`
    INSERT INTO sales_call_events (client_name, contact_person, phone, email, scheduled_at, status, notes)
    VALUES
      ('Helsinki Bistro Oy', 'Ville Heikkinen', '+358404444444', 'ville@helsinkibistro.fi', ${daysAgo(-1, 10).toISOString()}, 'planned', 'Demo-esittely'),
      ('Café Aura', 'Laura Mäkinen', '+358405555555', 'laura@cafeaura.fi', ${daysAgo(0, 15).toISOString()}, 'planned', 'Seurantapuhelu'),
      ('Nordic Kitchen', 'Joonas Laine', '+358406666666', 'joonas@nordickitchen.fi', ${daysAgo(2, 11).toISOString()}, 'completed', 'Kiinnostunut paketista'),
      ('Tapas Norte', 'María López', '+34600999888', 'maria@tapasnorte.es', ${daysAgo(-3, 16).toISOString()}, 'planned', 'ES-asiakas · demo')
  `;

  // Mail template + sample outbound (no real send)
  await sql`
    INSERT INTO mail_templates (id, subject, body_text)
    VALUES (
      'default',
      'Tervetuloa Restadigi-demoon',
      'Hei!\n\nTämä on demoviesti. Oikeaa sähköpostia ei lähetetä julkisessa demossa.\n\nYstävällisin terveisin,\nRestadigi'
    )
    ON CONFLICT (id) DO NOTHING
  `;
  await sql`
    INSERT INTO outbound_emails (to_email, to_name, subject, tracking_token, status, open_count, sent_at)
    VALUES
      ('ville@helsinkibistro.fi', 'Ville', 'Demo: Restadigi esittely', 'demo-token-1', 'sent', 2, ${daysAgo(3, 9).toISOString()}),
      ('laura@cafeaura.fi', 'Laura', 'Demo: tarjousmateriaali', 'demo-token-2', 'sent', 0, ${daysAgo(1, 17).toISOString()})
  `;
}

async function ensureDemoDbInner() {
  const url = getDatabaseUrl();
  if (!url) return;

  const sql = neon(url);
  await runDdl(sql);
  await sql`INSERT INTO restaurant_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING`;

  // Seed examples for public demo (and also if empty in any mode — helps first boot)
  try {
    await seedIfEmpty();
  } catch (err) {
    console.error("Demo seed error:", err);
  }
}

/** Call at the start of API handlers that touch the DB. */
export async function ensureDemoDb() {
  if (!bootPromise) {
    bootPromise = ensureDemoDbInner().catch((err) => {
      bootPromise = null;
      throw err;
    });
  }
  await bootPromise;
}

export async function ensureDemoDbSafe() {
  try {
    await ensureDemoDb();
    return true;
  } catch (err) {
    console.error("ensureDemoDb failed:", err);
    return false;
  }
}
