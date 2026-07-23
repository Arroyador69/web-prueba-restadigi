/**
 * App Express (sin listen). Usada por server.js (local) y api/index.js (Vercel).
 */
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');

const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const demosRoutes = require('./routes/demos');
const cronRoutes = require('./routes/cron');
const chatRoutes = require('./routes/chat');
const publicDemo = require('./lib/public-demo');
const { ensurePublicDemo } = require('./middleware/auth');

function buildApp() {
  const app = express();
  app.set('trust proxy', 1);

  app.use(bodyParser.json({ limit: '2mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  const sessionSecret = process.env.SESSION_SECRET || config.sessionSecret;
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

  const sessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      httpOnly: true
    }
  };

  if (process.env.DATABASE_URL) {
    try {
      const pgSession = require('connect-pg-simple')(session);
      const { pool } = require('./utils/db-pg');
      sessionOptions.store = new pgSession({
        pool,
        tableName: 'session',
        createTableIfMissing: true
      });
    } catch (err) {
      console.warn('⚠️ Session store PG no disponible, usando MemoryStore:', err.message);
    }
  }

  app.use(session(sessionOptions));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/views', express.static(path.join(__dirname, 'views')));

  // Demo pública: sesión automática solo en rutas de app (no estáticos)
  app.use((req, res, next) => {
    if (
      req.path.startsWith('/js/') ||
      req.path.startsWith('/css/') ||
      req.path.startsWith('/views/') ||
      req.path === '/favicon.ico'
    ) {
      return next();
    }
    return ensurePublicDemo(req, res, next);
  });

  app.use('/', cronRoutes);
  app.use('/', chatRoutes);
  app.use('/', demosRoutes);
  app.use('/', publicRoutes);
  app.use('/', authRoutes);
  app.use('/dashboard', dashboardRoutes);

  app.get('/login', (req, res) => {
    if (publicDemo.isEnabled()) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
  });
  app.get('/setup', (req, res) => {
    if (publicDemo.isEnabled()) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'views', 'setup.html'));
  });
  app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reset-password.html'));
  });
  app.get('/demos', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'demos.html'));
  });
  app.get('/dashboard', (req, res) => {
    if (publicDemo.isEnabled()) {
      return res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
    }
    if (!req.session || !req.session.userId) {
      return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
  });
  app.get('/feedback/:sessionId', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'feedback.html'));
  });

  return app;
}

let bootPromise = null;
function ensureBoot() {
  if (!bootPromise) {
    bootPromise = (async () => {
      if (process.env.DATABASE_URL) {
        const { initPostgres } = require('./database/init-pg');
        await initPostgres();
      }
      const { runMigrations } = require('./database/run-migrations');
      await runMigrations();
      const { runQuery } = require('./utils/db');
      await runQuery('ALTER TABLE appointments ADD COLUMN client_phone TEXT').catch(() => {});
      if (publicDemo.isEnabled()) {
        await publicDemo.ensureReady();
        console.log('✅ PUBLIC_DEMO listo (slug public-demo)');
      }
    })().catch((err) => {
      console.error('Error boot app:', err);
      bootPromise = null;
      throw err;
    });
  }
  return bootPromise;
}

const innerApp = buildApp();

const handler = express();
handler.set('trust proxy', 1);
handler.use(async (req, res, next) => {
  try {
    await ensureBoot();
    next();
  } catch (err) {
    console.error(err);
    if (req.path.startsWith('/api/') || (req.headers.accept || '').includes('application/json')) {
      return res.status(503).json({ error: 'BD no disponible. Configura DATABASE_URL (Neon / Vercel Postgres).' });
    }
    res.status(503).send('Servicio no disponible. Configura DATABASE_URL en Vercel (Neon Postgres).');
  }
});
handler.use(innerApp);

module.exports = handler;
module.exports.ensureBoot = ensureBoot;
module.exports.app = innerApp;
