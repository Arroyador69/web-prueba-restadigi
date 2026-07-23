-- =============================================================================
-- Restadigi PUBLIC DEMO — Neon setup COMPLETO (1 sola ejecución)
-- Archivo: restadigi-demo/scripts/seed-demo-note.sql
--
-- Qué hace:
--  1) Borra tablas viejas (clínica / Alpine / multi-tenant) que ya no usa la demo
--  2) Crea las tablas Restadigi que faltaban (por eso falló restaurant_settings)
--  3) Inserta SOLO nuestros datos de ejemplo
--
-- Pegar TODO en Neon SQL Editor → Run
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 1) LIMPIEZA: tablas del proyecto antiguo (no las usa la demo Restadigi)
--    CASCADE por si hay FKs entre ellas.
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS consentimientos CASCADE;
DROP TABLE IF EXISTS facturas CASCADE;
DROP TABLE IF EXISTS textos_legales CASCADE;
DROP TABLE IF EXISTS blocked_slots CASCADE;
DROP TABLE IF EXISTS opening_hours CASCADE;
DROP TABLE IF EXISTS negocio CASCADE;
DROP TABLE IF EXISTS business_config CASCADE;
DROP TABLE IF EXISTS review_requests CASCADE;
DROP TABLE IF EXISTS reputacion_jobs CASCADE;
DROP TABLE IF EXISTS plantillas_email CASCADE;
DROP TABLE IF EXISTS landing_events CASCADE;
DROP TABLE IF EXISTS landing_images CASCADE;
DROP TABLE IF EXISTS landing_page CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS session CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;

-- -----------------------------------------------------------------------------
-- 2) SCHEMA Restadigi (CREATE IF NOT EXISTS — seguro de re-ejecutar)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 3) DATOS DE EJEMPLO (nuestros). Re-ejecutable: limpia ejemplos previos.
-- -----------------------------------------------------------------------------

INSERT INTO restaurant_settings (
  id, restaurant_name, restaurant_address, restaurant_phone, restaurant_email,
  cuisine_type, restaurant_description, chatbot_welcome_message,
  require_email, require_phone, open_time, close_time,
  lunch_enabled, lunch_open_time, lunch_close_time, dinner_enabled,
  closed_weekdays, min_notice_hours, max_party_size, max_covers_per_slot,
  reservations_enabled, accent_color
) VALUES (
  'default',
  'Demo Ravintola',
  'Mannerheimintie 1, Helsinki',
  '+358 40 123 4567',
  'varaukset@demoravintola.fi',
  'Pohjoismainen',
  'Julkinen Restadigi-demo. Varaa pöytä lomakkeella tai chatilla ja tutki hallintapaneelia.',
  'Hei! Tervetuloa. Autan pöytävarauksessa.',
  false, true, '12:00', '22:00',
  true, '12:00', '22:00', false,
  '', 0, 80, 80,
  true, '#c46a32'
)
ON CONFLICT (id) DO UPDATE SET
  restaurant_name = EXCLUDED.restaurant_name,
  restaurant_address = EXCLUDED.restaurant_address,
  restaurant_phone = EXCLUDED.restaurant_phone,
  restaurant_email = EXCLUDED.restaurant_email,
  cuisine_type = EXCLUDED.cuisine_type,
  restaurant_description = EXCLUDED.restaurant_description,
  accent_color = EXCLUDED.accent_color,
  reservations_enabled = EXCLUDED.reservations_enabled;

INSERT INTO restaurant_floor_plans (id, name, capacity, tables_json)
VALUES (
  'default',
  'Demo Ravintola — 50 paikkaa',
  50,
  '[{"id":"t1","label":"1","seats":2,"x":14,"y":16,"shape":"round","zone":"ikkuna"},{"id":"t2","label":"2","seats":4,"x":36,"y":18,"shape":"rect","zone":"ikkuna"},{"id":"t3","label":"3","seats":4,"x":58,"y":18,"shape":"rect","zone":"ikkuna"},{"id":"t4","label":"4","seats":2,"x":80,"y":16,"shape":"round","zone":"ikkuna"},{"id":"t5","label":"5","seats":4,"x":22,"y":42,"shape":"rect","zone":"sali"},{"id":"t6","label":"6","seats":6,"x":48,"y":44,"shape":"rect","zone":"sali"},{"id":"t7","label":"7","seats":4,"x":74,"y":42,"shape":"rect","zone":"sali"},{"id":"t8","label":"8","seats":4,"x":22,"y":68,"shape":"rect","zone":"sali"},{"id":"t9","label":"9","seats":6,"x":48,"y":70,"shape":"rect","zone":"sali"},{"id":"t10","label":"10","seats":2,"x":78,"y":66,"shape":"round","zone":"sali"},{"id":"t11","label":"11","seats":4,"x":28,"y":88,"shape":"rect","zone":"terassi"},{"id":"t12","label":"12","seats":8,"x":68,"y":88,"shape":"rect","zone":"kabinetti"}]'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity,
  tables_json = EXCLUDED.tables_json;

DELETE FROM chat_messages WHERE session_id IN (
  SELECT id FROM chat_sessions WHERE visitor_session_id LIKE 'demo-visitor-%'
);
DELETE FROM reservations WHERE notes ILIKE '%demo%' OR guest_name IN (
  'Anna Virtanen', 'Mikko Nieminen', 'Sofia Korhonen', 'Carlos García', 'Emily Johnson'
);
DELETE FROM chat_sessions WHERE visitor_session_id LIKE 'demo-visitor-%';
DELETE FROM page_views WHERE visitor_session_id LIKE 'demo-visitor-%';
DELETE FROM sales_leads WHERE notes ILIKE '%Demo%' OR company IN (
  'Helsinki Bistro Oy', 'Café Aura', 'Nordic Kitchen', 'Tapas Norte'
);
DELETE FROM sales_call_events WHERE notes ILIKE '%demo%' OR client_name IN (
  'Helsinki Bistro Oy', 'Café Aura', 'Nordic Kitchen', 'Tapas Norte'
);
DELETE FROM outbound_emails WHERE tracking_token LIKE 'demo-token-%';

INSERT INTO page_views (visitor_session_id, path, referrer, user_agent, created_at)
SELECT
  'demo-visitor-' || ((g % 8) + 1),
  (ARRAY['/', '/dashboard', '/', '/', '/dashboard/reservations', '/dashboard/settings'])[1 + (g % 6)],
  CASE g % 3 WHEN 0 THEN 'https://google.com' WHEN 1 THEN 'https://instagram.com' ELSE NULL END,
  'DemoBot/1.0',
  NOW() - ((g % 12) || ' days')::interval - ((10 + (g % 8)) || ' hours')::interval
FROM generate_series(0, 23) AS g;

WITH s AS (
  INSERT INTO chat_sessions (visitor_session_id, created_at, updated_at)
  VALUES
    ('demo-visitor-1', NOW() - INTERVAL '2 days' - INTERVAL '18 hours', NOW() - INTERVAL '2 days' - INTERVAL '18 hours'),
    ('demo-visitor-2', NOW() - INTERVAL '1 day' - INTERVAL '14 hours', NOW() - INTERVAL '1 day' - INTERVAL '14 hours'),
    ('demo-visitor-3', NOW() - INTERVAL '11 hours', NOW() - INTERVAL '11 hours')
  RETURNING id, visitor_session_id
)
INSERT INTO chat_messages (session_id, role, content, created_at)
SELECT s.id, m.role, m.content, m.created_at
FROM s
JOIN (
  VALUES
    ('demo-visitor-1', 'assistant', 'Hei! Autan pöytävarauksessa. Montako henkilöä ja milloin?', NOW() - INTERVAL '2 days' - INTERVAL '18 hours'),
    ('demo-visitor-1', 'user', 'Huomenna klo 19 neljälle, nimeni on Anna Virtanen, puh +358401111111', NOW() - INTERVAL '2 days' - INTERVAL '18 hours'),
    ('demo-visitor-1', 'assistant', 'Valmis! Varaus vahvistettu Annolle klo 19, 4 hlö.', NOW() - INTERVAL '2 days' - INTERVAL '18 hours'),
    ('demo-visitor-2', 'assistant', 'Tervetuloa! Haluatko varata pöydän?', NOW() - INTERVAL '1 day' - INTERVAL '14 hours'),
    ('demo-visitor-2', 'user', 'Perjantaina 20:00 kahdelle. Mikko, +358402222222', NOW() - INTERVAL '1 day' - INTERVAL '14 hours'),
    ('demo-visitor-3', 'user', 'Onko terassipaikkoja lauantaina?', NOW() - INTERVAL '11 hours'),
    ('demo-visitor-3', 'assistant', 'Kyllä, terassilla on tilaa. Kerro henkilömäärä ja kellonaika.', NOW() - INTERVAL '11 hours')
) AS m(visitor_session_id, role, content, created_at)
  ON s.visitor_session_id = m.visitor_session_id;

INSERT INTO reservations (
  guest_name, guest_email, guest_phone, party_size,
  reservation_date, reservation_time, status, notes, source, created_at
) VALUES
  ('Anna Virtanen', 'anna@example.fi', '+358401111111', 4,
   to_char(CURRENT_DATE + 1, 'YYYY-MM-DD'), '19:00', 'confirmed', 'Demo · ikkunapöytä', 'chatbot',
   NOW() - INTERVAL '2 days' - INTERVAL '18 hours'),
  ('Mikko Nieminen', NULL, '+358402222222', 2,
   to_char(CURRENT_DATE + 2, 'YYYY-MM-DD'), '20:00', 'pending', 'Demo', 'landing',
   NOW() - INTERVAL '1 day' - INTERVAL '14 hours'),
  ('Sofia Korhonen', 'sofia@example.fi', '+358403333333', 6,
   to_char(CURRENT_DATE + 3, 'YYYY-MM-DD'), '18:30', 'confirmed', 'Syntymäpäivä · demo', 'chatbot',
   NOW() - INTERVAL '3 days' - INTERVAL '16 hours'),
  ('Carlos García', NULL, '+34600111222', 3,
   to_char(CURRENT_DATE, 'YYYY-MM-DD'), '13:00', 'completed', 'Lounas · demo', 'landing',
   NOW() - INTERVAL '5 days' - INTERVAL '9 hours'),
  ('Emily Johnson', 'emily@example.com', '+447700900123', 5,
   to_char(CURRENT_DATE + 5, 'YYYY-MM-DD'), '19:30', 'pending', 'Tourist group · demo', 'chatbot',
   NOW() - INTERVAL '10 hours');

INSERT INTO sales_leads (
  name, company, phone, email, interest, notes, status, source, created_at, updated_at
) VALUES
  ('Ville Heikkinen', 'Helsinki Bistro Oy', '+358404444444', 'ville@helsinkibistro.fi',
   'Pöytävaraus + verkkosivut', 'Demo-liidi', 'new', 'sales_chat',
   NOW() - INTERVAL '1 day' - INTERVAL '15 hours', NOW() - INTERVAL '1 day' - INTERVAL '15 hours'),
  ('Laura Mäkinen', 'Café Aura', '+358405555555', 'laura@cafeaura.fi',
   'AI-asiakaspalvelu', NULL, 'contacted', 'sales_chat',
   NOW() - INTERVAL '4 days' - INTERVAL '11 hours', NOW() - INTERVAL '3 days' - INTERVAL '11 hours'),
  ('Joonas Laine', 'Nordic Kitchen', '+358406666666', 'joonas@nordickitchen.fi',
   'Koko paketti', NULL, 'qualified', 'sales_chat',
   NOW() - INTERVAL '6 days' - INTERVAL '10 hours', NOW() - INTERVAL '2 days' - INTERVAL '10 hours'),
  ('María López', 'Tapas Norte', '+34600999888', 'maria@tapasnorte.es',
   'Reservas online', NULL, 'new', 'sales_chat',
   NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours');

INSERT INTO sales_call_events (client_name, contact_person, phone, email, scheduled_at, status, notes)
VALUES
  ('Helsinki Bistro Oy', 'Ville Heikkinen', '+358404444444', 'ville@helsinkibistro.fi',
   NOW() + INTERVAL '1 day' + INTERVAL '10 hours', 'planned', 'Demo-esittely'),
  ('Café Aura', 'Laura Mäkinen', '+358405555555', 'laura@cafeaura.fi',
   NOW() + INTERVAL '15 hours', 'planned', 'Seurantapuhelu'),
  ('Nordic Kitchen', 'Joonas Laine', '+358406666666', 'joonas@nordickitchen.fi',
   NOW() - INTERVAL '2 days' - INTERVAL '11 hours', 'done', 'Kiinnostunut paketista'),
  ('Tapas Norte', 'María López', '+34600999888', 'maria@tapasnorte.es',
   NOW() + INTERVAL '3 days' + INTERVAL '16 hours', 'planned', 'ES-asiakas · demo');

INSERT INTO mail_templates (id, subject, body_text)
VALUES (
  'default',
  'Tervetuloa Restadigi-demoon',
  E'Hei!\n\nTämä on demoviesti. Oikeaa sähköpostia ei lähetetä julkisessa demossa.\n\nYstävällisin terveisin,\nRestadigi'
)
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  body_text = EXCLUDED.body_text;

INSERT INTO outbound_emails (to_email, to_name, subject, tracking_token, status, open_count, sent_at)
VALUES
  ('ville@helsinkibistro.fi', 'Ville', 'Demo: Restadigi esittely', 'demo-token-1', 'sent', 2,
   NOW() - INTERVAL '3 days' - INTERVAL '9 hours'),
  ('laura@cafeaura.fi', 'Laura', 'Demo: tarjousmateriaali', 'demo-token-2', 'sent', 0,
   NOW() - INTERVAL '1 day' - INTERVAL '17 hours');

-- Listo. Tras Run deberías ver tablas Restadigi + ejemplos.
-- CONSERVAR: page_views, chat_*, reservations, restaurant_*, sales_*, mail_*, outbound_emails
