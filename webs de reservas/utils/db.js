/**
 * Capa de BD: PostgreSQL si existe DATABASE_URL (obligatorio en Vercel);
 * SQLite solo en desarrollo local sin DATABASE_URL.
 */
const usePg = !!process.env.DATABASE_URL;

if (!usePg && process.env.VERCEL) {
  throw new Error('En Vercel es obligatorio DATABASE_URL (Neon / Vercel Postgres).');
}

let impl;
if (usePg) {
  impl = require('./db-pg');
} else {
  try {
    impl = require('./db-sqlite');
  } catch (err) {
    throw new Error(
      'SQLite no disponible. Instala sqlite3 o define DATABASE_URL para PostgreSQL. ' +
      (err && err.message ? err.message : '')
    );
  }
}

module.exports = {
  getDb: impl.getDb,
  runQuery: impl.runQuery,
  getQuery: impl.getQuery,
  allQuery: impl.allQuery,
  usePg
};
