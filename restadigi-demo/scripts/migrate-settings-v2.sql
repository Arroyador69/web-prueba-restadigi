-- Run once in Neon if restaurant_settings already exists from migrate-settings.sql

ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS restaurant_address TEXT;
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS restaurant_phone TEXT;
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS restaurant_email TEXT;
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS cuisine_type TEXT;
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS restaurant_description TEXT;
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS lunch_enabled BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS lunch_open_time TEXT NOT NULL DEFAULT '11:00';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS lunch_close_time TEXT NOT NULL DEFAULT '14:30';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS dinner_enabled BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS dinner_open_time TEXT NOT NULL DEFAULT '17:00';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS dinner_close_time TEXT NOT NULL DEFAULT '22:00';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS max_covers_per_evening INTEGER NOT NULL DEFAULT 80;
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS closed_weekdays TEXT NOT NULL DEFAULT '1';
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS advance_booking_days INTEGER NOT NULL DEFAULT 60;
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS min_notice_hours INTEGER NOT NULL DEFAULT 2;

UPDATE restaurant_settings SET require_phone = true WHERE id = 'default' AND require_phone = false;
