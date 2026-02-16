/**
 * Migraciones multi-negocio.
 * Crea tablas: negocio, pacientes, citas (nueva), plantillas_email, textos_legales, consentimientos.
 * Añade negocio_id a users, opening_hours, blocked_slots.
 * Migra datos desde appointments + business_config al nuevo esquema.
 */
const { runQuery, getQuery, allQuery, getDb } = require('../utils/db');
const config = require('../config');

const DEFAULT_NEGOCIO_ID = 1;

async function runMigrations() {
  let db;
  try {
    db = getDb();
  } catch (e) {
    console.warn('Migraciones: no se pudo abrir BD', e.message);
    return;
  }

  const run = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });

  const runIgnore = (sql, params = []) =>
    run(sql, params).catch((err) => {
      if (!/duplicate column name|already exists/i.test(err.message)) console.warn('[Migration]', err.message);
    });

  try {
    // --- Tabla negocio ---
    await run(`
      CREATE TABLE IF NOT EXISTS negocio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT,
        email TEXT,
        direccion TEXT,
        duracion_cita_default INTEGER NOT NULL DEFAULT 50,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // --- Tabla pacientes ---
    await run(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        negocio_id INTEGER NOT NULL REFERENCES negocio(id),
        nombre TEXT NOT NULL,
        email TEXT NOT NULL,
        telefono TEXT,
        fecha_nacimiento DATE,
        tipo_sesion_habitual TEXT CHECK(tipo_sesion_habitual IN ('online', 'presencial')),
        estado TEXT NOT NULL DEFAULT 'activo' CHECK(estado IN ('activo', 'en_proceso', 'alta_terapeutica', 'inactivo')),
        motivo_consulta TEXT,
        notas_privadas TEXT,
        precio_sesion REAL,
        metodo_pago TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // --- Tabla citas (nueva estructura) ---
    await run(`
      CREATE TABLE IF NOT EXISTS citas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        negocio_id INTEGER NOT NULL REFERENCES negocio(id),
        paciente_id INTEGER NOT NULL REFERENCES pacientes(id),
        fecha DATE NOT NULL,
        hora_inicio TEXT NOT NULL,
        hora_fin TEXT NOT NULL,
        tipo_sesion TEXT CHECK(tipo_sesion IN ('online', 'presencial')),
        estado TEXT NOT NULL DEFAULT 'confirmada' CHECK(estado IN ('confirmada', 'pendiente', 'cancelada', 'pasada', 'no_asistio')),
        notas TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // --- Tabla plantillas_email ---
    await run(`
      CREATE TABLE IF NOT EXISTS plantillas_email (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        negocio_id INTEGER NOT NULL REFERENCES negocio(id),
        nombre TEXT NOT NULL,
        asunto TEXT NOT NULL,
        cuerpo TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(negocio_id, nombre)
      )
    `);

    // --- Tabla textos_legales ---
    await run(`
      CREATE TABLE IF NOT EXISTS textos_legales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        negocio_id INTEGER NOT NULL REFERENCES negocio(id) UNIQUE,
        politica_privacidad TEXT,
        consentimiento TEXT,
        version TEXT DEFAULT '1',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // --- Tabla consentimientos (log RGPD) ---
    await run(`
      CREATE TABLE IF NOT EXISTS consentimientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        paciente_id INTEGER NOT NULL REFERENCES pacientes(id),
        fecha DATETIME NOT NULL,
        ip TEXT,
        version_texto TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // --- SMTP en negocio ---
    await runIgnore('ALTER TABLE negocio ADD COLUMN smtp_host TEXT');
    await runIgnore('ALTER TABLE negocio ADD COLUMN smtp_port INTEGER');
    await runIgnore('ALTER TABLE negocio ADD COLUMN smtp_user TEXT');
    await runIgnore('ALTER TABLE negocio ADD COLUMN smtp_password TEXT');
    await runIgnore('ALTER TABLE negocio ADD COLUMN email_remitente TEXT');
    await runIgnore('ALTER TABLE negocio ADD COLUMN nombre_remitente TEXT');

    // --- Añadir negocio_id a tablas existentes ---
    await runIgnore('ALTER TABLE users ADD COLUMN negocio_id INTEGER DEFAULT 1');
    await runIgnore('ALTER TABLE opening_hours ADD COLUMN negocio_id INTEGER DEFAULT 1');
    await runIgnore('ALTER TABLE blocked_slots ADD COLUMN negocio_id INTEGER DEFAULT 1');

    // --- Insertar negocio por defecto si no existe ---
    const negocioExists = await getQuery('SELECT id FROM negocio WHERE id = ?', [DEFAULT_NEGOCIO_ID]);
    if (!negocioExists) {
      const bc = await allQuery('SELECT key, value FROM business_config').catch(() => []);
      const kv = {};
      bc.forEach((r) => { kv[r.key] = r.value; });
      await run(
        `INSERT INTO negocio (id, nombre, telefono, email, direccion, duracion_cita_default) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          DEFAULT_NEGOCIO_ID,
          kv.businessName || config.businessName || 'Mi Negocio',
          kv.businessPhone || config.businessPhone || '',
          kv.businessEmail || config.businessEmail || '',
          kv.direccion || '',
          parseInt(kv.appointmentDuration || config.appointmentDuration || '50', 10)
        ]
      );
      console.log('✅ Negocio por defecto creado (id=1)');
    }

    // --- Migrar appointments → pacientes + citas (una sola vez) ---
    const citasCount = await getQuery('SELECT COUNT(*) as c FROM citas').catch(() => null);
    if (citasCount && citasCount.c === 0) {
      const oldAppointments = await allQuery(
        `SELECT * FROM appointments WHERE status = 'confirmed' OR status = 'cancelled' ORDER BY id`
      ).catch(() => []);
      for (const apt of oldAppointments) {
        const d = new Date(apt.appointment_date);
        const fecha = d.toISOString().slice(0, 10);
        const hora = d.toTimeString().slice(0, 5);
        const end = new Date(d.getTime() + (apt.duration || 50) * 60000);
        const hora_fin = end.toTimeString().slice(0, 5);
        let paciente = await getQuery(
          'SELECT id FROM pacientes WHERE negocio_id = ? AND email = ?',
          [DEFAULT_NEGOCIO_ID, apt.client_email]
        );
        if (!paciente) {
          const r = await run(
            `INSERT INTO pacientes (negocio_id, nombre, email, telefono, estado) VALUES (?, ?, ?, ?, 'activo')`,
            [DEFAULT_NEGOCIO_ID, apt.client_name || 'Sin nombre', apt.client_email, apt.client_phone || null]
          );
          paciente = { id: r.lastID };
        }
        const estado = apt.status === 'cancelled' ? 'cancelada' : (d < new Date() ? 'pasada' : 'confirmada');
        await run(
          `INSERT INTO citas (negocio_id, paciente_id, fecha, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?, ?, ?)`,
          [DEFAULT_NEGOCIO_ID, paciente.id, fecha, hora, hora_fin, estado]
        );
      }
      if (oldAppointments.length > 0) console.log('✅ Migradas', oldAppointments.length, 'citas a nuevo esquema');
    }

    // --- Insertar plantilla de recordatorio por defecto si no existe ---
    const plantillaExists = await getQuery(
      'SELECT id FROM plantillas_email WHERE negocio_id = ? AND nombre = ?',
      [DEFAULT_NEGOCIO_ID, 'recordatorio']
    );
    if (!plantillaExists) {
      await run(
        `INSERT INTO plantillas_email (negocio_id, nombre, asunto, cuerpo) VALUES (?, 'recordatorio', ?, ?)`,
        [
          DEFAULT_NEGOCIO_ID,
          'Recordatorio: cita el {{fecha}} a las {{hora}}',
          `Hola {{nombre_paciente}},\n\nTe recordamos tu cita en {{nombre_negocio}} el {{fecha}} a las {{hora}}.\n\nSaludos.`
        ]
      );
    }

  } catch (err) {
    throw err;
  } finally {
    if (db) db.close();
  }
}

module.exports = { runMigrations, DEFAULT_NEGOCIO_ID };
