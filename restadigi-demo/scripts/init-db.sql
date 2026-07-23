-- Run once in Neon SQL Editor (or: npm run db:init)

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

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);

CREATE TABLE IF NOT EXISTS restaurant_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  restaurant_name TEXT NOT NULL DEFAULT 'Demo Ravintola',
  restaurant_address TEXT,
  restaurant_phone TEXT,
  restaurant_email TEXT,
  cuisine_type TEXT,
  restaurant_description TEXT,
  chatbot_welcome_message TEXT NOT NULL DEFAULT 'Hei! Tervetuloa Demo Ravintolaan. Autan mielelläni pöytävarauksessa — kerro nimesi, henkilömäärän, toivomasi päivän ja kellonajan sekä sähköpostisi ja puhelinnumerosi.',
  chatbot_instructions TEXT,
  require_email BOOLEAN NOT NULL DEFAULT true,
  require_phone BOOLEAN NOT NULL DEFAULT true,
  min_party_size INTEGER NOT NULL DEFAULT 1,
  max_party_size INTEGER NOT NULL DEFAULT 10,
  open_time TEXT NOT NULL DEFAULT '11:00',
  close_time TEXT NOT NULL DEFAULT '22:00',
  lunch_enabled BOOLEAN NOT NULL DEFAULT true,
  lunch_open_time TEXT NOT NULL DEFAULT '11:00',
  lunch_close_time TEXT NOT NULL DEFAULT '14:30',
  dinner_enabled BOOLEAN NOT NULL DEFAULT true,
  dinner_open_time TEXT NOT NULL DEFAULT '17:00',
  dinner_close_time TEXT NOT NULL DEFAULT '22:00',
  slot_minutes INTEGER NOT NULL DEFAULT 30,
  max_covers_per_slot INTEGER NOT NULL DEFAULT 16,
  max_covers_per_evening INTEGER NOT NULL DEFAULT 80,
  closed_weekdays TEXT NOT NULL DEFAULT '1',
  advance_booking_days INTEGER NOT NULL DEFAULT 60,
  min_notice_hours INTEGER NOT NULL DEFAULT 2,
  reservations_enabled BOOLEAN NOT NULL DEFAULT true,
  accent_color TEXT NOT NULL DEFAULT '#c46a32',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO restaurant_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

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

CREATE INDEX IF NOT EXISTS idx_sales_leads_created_at ON sales_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_leads_status ON sales_leads(status);
CREATE INDEX IF NOT EXISTS idx_sales_leads_email ON sales_leads(email);

CREATE TABLE IF NOT EXISTS restaurant_floor_plans (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  tables_json TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
