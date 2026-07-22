/**
 * Adapter PostgreSQL (Neon / Vercel Postgres / Railway).
 * Misma interfaz que SQLite: runQuery, getQuery, allQuery.
 */
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || '';
const needsSsl =
  /neon\.tech|vercel-storage|supabase|railway|render\.com|sslmode=require/i.test(connectionString) ||
  process.env.PGSSLMODE === 'require' ||
  process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  max: process.env.VERCEL ? 3 : 10,
  idleTimeoutMillis: process.env.VERCEL ? 5000 : 30000,
  connectionTimeoutMillis: 10000
});

if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  console.log('💾 Base de datos: PostgreSQL – persistencia multi-tenant');
}

function toPgParams(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

function runQuery(query, params = []) {
  const pgSql = toPgParams(query);
  const isInsert = /^\s*INSERT\s+/i.test(query.trim()) && !/RETURNING\s+/i.test(query);
  const sqlWithReturning = isInsert ? pgSql.replace(/;\s*$/, '') + ' RETURNING id' : pgSql;
  const run = (sql) => pool.query(sql, params).then((res) => {
    const lastID = isInsert && res.rows && res.rows[0] ? res.rows[0].id : undefined;
    return { lastID, changes: res.rowCount || 0 };
  });
  if (!isInsert) return run(pgSql);
  return run(sqlWithReturning).catch((err) => {
    if (err.message && /column "id" does not exist/i.test(err.message)) {
      return run(pgSql).then((res) => ({ lastID: undefined, changes: res.rowCount || 0 }));
    }
    return Promise.reject(err);
  });
}

function getQuery(query, params = []) {
  const pgSql = toPgParams(query);
  return pool.query(pgSql, params).then((res) => (res.rows && res.rows[0] ? res.rows[0] : null));
}

function allQuery(query, params = []) {
  const pgSql = toPgParams(query);
  return pool.query(pgSql, params).then((res) => res.rows || []);
}

function getDb() {
  return {
    run: (sql, params, cb) => {
      runQuery(toPgParams(sql), params || [])
        .then((r) => cb && cb(null, r))
        .catch((err) => cb && cb(err));
    },
    close: () => {}
  };
}

module.exports = {
  getDb,
  runQuery,
  getQuery,
  allQuery,
  pool
};
