-- =============================================================================
-- Restadigi · Neon SQL Editor
-- Lightweight sales call calendar (no separate client CRM)
-- Safe to run multiple times (IF NOT EXISTS).
-- GitHub: https://github.com/z8ht6zzdsd-debug/restadigi/blob/main/scripts/migrate-sales-calls.sql
-- =============================================================================

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

COMMENT ON TABLE sales_call_events IS
  'Sales call calendar entries: client label + scheduled time + conversation notes. No heavy CRM.';

CREATE INDEX IF NOT EXISTS idx_sales_call_events_scheduled_at
  ON sales_call_events (scheduled_at);

CREATE INDEX IF NOT EXISTS idx_sales_call_events_status
  ON sales_call_events (status);
