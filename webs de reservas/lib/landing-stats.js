/**
 * Eventos de landing por negocio (aislados multi-tenant).
 * visit | book_click | book_success
 */
const { runQuery, allQuery } = require('../utils/db');

const TYPES = new Set(['visit', 'book_click', 'book_success']);

async function track(negocioId, eventType, meta) {
  const id = parseInt(negocioId, 10);
  if (!id) return { ok: false };
  const type = String(eventType || '').trim();
  if (!TYPES.has(type)) return { ok: false };
  let metaStr = null;
  if (meta != null) {
    try {
      metaStr = typeof meta === 'string' ? meta.slice(0, 500) : JSON.stringify(meta).slice(0, 500);
    } catch (_) {
      metaStr = null;
    }
  }
  await runQuery(
    `INSERT INTO landing_events (negocio_id, event_type, meta) VALUES (?, ?, ?)`,
    [id, type, metaStr]
  );
  return { ok: true };
}

async function getStats(negocioId) {
  const id = parseInt(negocioId, 10);
  const totals = await allQuery(
    `SELECT event_type, COUNT(*) AS c
     FROM landing_events
     WHERE negocio_id = ?
     GROUP BY event_type`,
    [id]
  ).catch(() => []);

  const map = { visit: 0, book_click: 0, book_success: 0 };
  for (const row of totals || []) {
    if (map[row.event_type] != null) map[row.event_type] = parseInt(row.c, 10) || 0;
  }

  let daily = [];
  try {
    daily = await allQuery(
      `SELECT CAST(created_at AS DATE) AS day, event_type, COUNT(*) AS c
       FROM landing_events
       WHERE negocio_id = ?
         AND created_at >= (CURRENT_DATE - INTERVAL '13 days')
       GROUP BY CAST(created_at AS DATE), event_type
       ORDER BY day ASC`,
      [id]
    );
  } catch (_) {
    try {
      daily = await allQuery(
        `SELECT date(created_at) AS day, event_type, COUNT(*) AS c
         FROM landing_events
         WHERE negocio_id = ? AND created_at >= date('now', '-13 days')
         GROUP BY date(created_at), event_type
         ORDER BY day ASC`,
        [id]
      );
    } catch (__) {
      daily = [];
    }
  }

  const byDay = {};
  for (const row of daily || []) {
    const d = String(row.day).slice(0, 10);
    if (!byDay[d]) byDay[d] = { day: d, visits: 0, bookClicks: 0, bookings: 0 };
    const c = parseInt(row.c, 10) || 0;
    if (row.event_type === 'visit') byDay[d].visits = c;
    if (row.event_type === 'book_click') byDay[d].bookClicks = c;
    if (row.event_type === 'book_success') byDay[d].bookings = c;
  }

  const visits = map.visit;
  const bookClicks = map.book_click;
  const bookings = map.book_success;
  const clickRate = visits > 0 ? Math.round((bookClicks / visits) * 1000) / 10 : 0;
  const conversionRate = visits > 0 ? Math.round((bookings / visits) * 1000) / 10 : 0;

  return {
    visits,
    bookClicks,
    bookings,
    clickRate,
    conversionRate,
    last14Days: Object.keys(byDay)
      .sort()
      .map((k) => byDay[k])
  };
}

module.exports = { track, getStats, TYPES };
