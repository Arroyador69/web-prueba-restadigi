-- Floor plan storage for customized restaurant table maps

CREATE TABLE IF NOT EXISTS restaurant_floor_plans (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  tables_json TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
