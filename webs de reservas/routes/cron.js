/**
 * Cron jobs para Vercel (vercel.json → crons).
 * Protegidos con CRON_SECRET o Authorization: Bearer <CRON_SECRET>.
 */
const express = require('express');
const router = express.Router();

function requireCron(req, res, next) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // En Vercel Cron, se puede validar con el header de Vercel; si no hay secret, solo allow en Vercel cron
    const isVercelCron = req.headers['x-vercel-cron'] === '1';
    if (isVercelCron) return next();
    return res.status(503).json({ error: 'CRON_SECRET no configurado' });
  }
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : (req.query.secret || '');
  if (token === secret || req.headers['x-cron-secret'] === secret || req.headers['x-vercel-cron'] === '1') {
    return next();
  }
  return res.status(401).json({ error: 'No autorizado' });
}

router.get('/api/cron/reminders', requireCron, async (req, res) => {
  try {
    const { runReminders } = require('../lib/reminder-job');
    const result = await runReminders();
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error('cron reminders:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/cron/reputacion', requireCron, async (req, res) => {
  try {
    const { processDueJobs } = require('../lib/reputacion-pro/jobs');
    await processDueJobs();
    res.json({ ok: true });
  } catch (err) {
    console.error('cron reputacion:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
