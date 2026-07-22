-- =============================================================================
-- Schema completo multi-tenant (Neon / Postgres) — web-prueba-restadigi
-- Pegar en Neon → SQL Editor → Run
-- Seguro con IF NOT EXISTS (se puede re-ejecutar)
-- =============================================================================

-- Negocios / tenants (cada psicólogo o demo)
CREATE TABLE IF NOT EXISTS negocio (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  direccion TEXT,
  nif TEXT,
  duracion_cita_default INTEGER NOT NULL DEFAULT 50,
  slug TEXT,
  is_demo INTEGER DEFAULT 0,
  demo_created_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_password TEXT,
  email_remitente TEXT,
  nombre_remitente TEXT,
  google_review_url TEXT,
  reputacion_activa INTEGER DEFAULT 1,
  color_primary TEXT,
  color_secondary TEXT,
  google_calendar_refresh_token TEXT,
  google_calendar_calendar_id TEXT,
  google_calendar_sync_busy INTEGER DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS negocio_slug_unique
  ON negocio (slug) WHERE slug IS NOT NULL;

-- Usuarios del dashboard (cada uno ligado a un negocio_id)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  negocio_id INTEGER DEFAULT 1 REFERENCES negocio(id)
);

CREATE TABLE IF NOT EXISTS business_config (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS opening_hours (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER NOT NULL,
  start_hour INTEGER NOT NULL,
  end_hour INTEGER NOT NULL,
  negocio_id INTEGER DEFAULT 1 REFERENCES negocio(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS opening_hours_negocio_day_range
  ON opening_hours (negocio_id, day_of_week, start_hour, end_hour);

CREATE TABLE IF NOT EXISTS blocked_slots (
  id SERIAL PRIMARY KEY,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  negocio_id INTEGER DEFAULT 1 REFERENCES negocio(id)
);

CREATE TABLE IF NOT EXISTS pacientes (
  id SERIAL PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocio(id),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  fecha_nacimiento DATE,
  tipo_sesion_habitual TEXT CHECK (tipo_sesion_habitual IN ('online', 'presencial')),
  estado TEXT NOT NULL DEFAULT 'activo'
    CHECK (estado IN ('activo', 'en_proceso', 'alta_terapeutica', 'inactivo')),
  motivo_consulta TEXT,
  notas_privadas TEXT,
  precio_sesion REAL,
  metodo_pago TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS citas (
  id SERIAL PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocio(id),
  paciente_id INTEGER NOT NULL REFERENCES pacientes(id),
  fecha DATE NOT NULL,
  hora_inicio TEXT NOT NULL,
  hora_fin TEXT NOT NULL,
  tipo_sesion TEXT CHECK (tipo_sesion IN ('online', 'presencial')),
  estado TEXT NOT NULL DEFAULT 'confirmada'
    CHECK (estado IN ('confirmada', 'pendiente', 'cancelada', 'pasada', 'no_asistio', 'completada')),
  notas TEXT,
  google_calendar_event_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plantillas_email (
  id SERIAL PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocio(id),
  nombre TEXT NOT NULL,
  asunto TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (negocio_id, nombre)
);

CREATE TABLE IF NOT EXISTS textos_legales (
  id SERIAL PRIMARY KEY,
  negocio_id INTEGER NOT NULL UNIQUE REFERENCES negocio(id),
  politica_privacidad TEXT,
  consentimiento TEXT,
  version TEXT DEFAULT '1',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS landing_page (
  negocio_id INTEGER NOT NULL PRIMARY KEY REFERENCES negocio(id),
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS landing_images (
  id SERIAL PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocio(id),
  filename TEXT NOT NULL,
  mimetype TEXT NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consentimientos (
  id SERIAL PRIMARY KEY,
  paciente_id INTEGER NOT NULL REFERENCES pacientes(id),
  fecha TIMESTAMP NOT NULL,
  ip TEXT,
  version_texto TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS facturas (
  id SERIAL PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocio(id),
  numero_factura TEXT NOT NULL,
  fecha_emision DATE NOT NULL,
  cliente_nombre TEXT NOT NULL,
  cliente_nif TEXT,
  cliente_direccion TEXT,
  cliente_cp TEXT,
  cliente_ciudad TEXT,
  cliente_provincia TEXT,
  concepto TEXT NOT NULL,
  descripcion TEXT,
  precio_base REAL NOT NULL,
  iva_pct REAL NOT NULL DEFAULT 21,
  iva_eur REAL NOT NULL,
  total REAL NOT NULL,
  forma_pago TEXT,
  idioma TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Legacy (compatibilidad)
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  appointment_date TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL DEFAULT 50,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (appointment_date)
);

-- Sesiones Express (login en Vercel)
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);

-- ReputacionPro (opcional)
CREATE TABLE IF NOT EXISTS review_requests (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL,
  professional_id INTEGER NOT NULL REFERENCES negocio(id),
  email_enviado BOOLEAN NOT NULL DEFAULT false,
  rating INTEGER,
  redirigido_a_google BOOLEAN NOT NULL DEFAULT false,
  comentario TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reputacion_jobs (
  id SERIAL PRIMARY KEY,
  cita_id INTEGER NOT NULL REFERENCES citas(id),
  negocio_id INTEGER NOT NULL REFERENCES negocio(id),
  programado_para TIMESTAMP NOT NULL,
  enviado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Negocio principal por defecto
INSERT INTO negocio (id, nombre, telefono, email, duracion_cita_default, slug, is_demo)
VALUES (1, 'Consulta principal', '', '', 50, 'principal', 0)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('negocio', 'id'), (SELECT COALESCE(MAX(id), 1) FROM negocio));

-- Horarios L-V 9-14 y 16-20 para negocio 1
INSERT INTO opening_hours (negocio_id, day_of_week, start_hour, end_hour) VALUES
  (1, 1, 9, 14), (1, 1, 16, 20),
  (1, 2, 9, 14), (1, 2, 16, 20),
  (1, 3, 9, 14), (1, 3, 16, 20),
  (1, 4, 9, 14), (1, 4, 16, 20),
  (1, 5, 9, 14), (1, 5, 16, 20)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- Comprobaciones útiles
-- =============================================================================
-- SELECT id, nombre, slug, email, is_demo FROM negocio ORDER BY id;
-- SELECT id, email, name, negocio_id FROM users ORDER BY id;
-- SELECT negocio_id, COUNT(*) FROM citas GROUP BY negocio_id;

-- Migración colores (Neon ya existente)
ALTER TABLE negocio ADD COLUMN IF NOT EXISTS color_primary TEXT;
ALTER TABLE negocio ADD COLUMN IF NOT EXISTS color_secondary TEXT;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS idioma TEXT;
