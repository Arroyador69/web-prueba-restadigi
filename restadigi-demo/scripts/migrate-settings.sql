-- Run once in Neon if you already ran init-db.sql before this feature.
-- Adds restaurant_settings for dashboard configuration.

CREATE TABLE IF NOT EXISTS restaurant_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  restaurant_name TEXT NOT NULL DEFAULT 'Demo Ravintola',
  chatbot_welcome_message TEXT NOT NULL DEFAULT 'Hei! Olen ravintolan chatbot. Voin auttaa pöytävarauksessa — kerro nimesi, henkilömäärän, päivän, kellonajan ja sähköpostisi.',
  chatbot_instructions TEXT,
  require_email BOOLEAN NOT NULL DEFAULT true,
  require_phone BOOLEAN NOT NULL DEFAULT false,
  min_party_size INTEGER NOT NULL DEFAULT 1,
  max_party_size INTEGER NOT NULL DEFAULT 12,
  open_time TEXT NOT NULL DEFAULT '11:00',
  close_time TEXT NOT NULL DEFAULT '22:00',
  slot_minutes INTEGER NOT NULL DEFAULT 30,
  max_covers_per_slot INTEGER NOT NULL DEFAULT 20,
  reservations_enabled BOOLEAN NOT NULL DEFAULT true,
  accent_color TEXT NOT NULL DEFAULT '#c46a32',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO restaurant_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
