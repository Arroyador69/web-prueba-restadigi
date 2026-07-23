const publicDemo = require('../lib/public-demo');

async function requireAuth(req, res, next) {
  try {
    if (publicDemo.isEnabled()) {
      if (!req.session.userId || !req.session.publicDemo) {
        await publicDemo.attachSession(req);
      }
      req.negocioId = req.session.negocioId != null ? req.session.negocioId : 1;
      return next();
    }
    if (req.session && req.session.userId) {
      req.negocioId = req.session.negocioId != null ? req.session.negocioId : 1;
      return next();
    }
    const wantsJson =
      req.path.startsWith('/api/') ||
      (req.headers.accept || '').includes('application/json') ||
      req.xhr;
    if (wantsJson) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    return res.redirect('/login');
  } catch (err) {
    console.error('requireAuth:', err);
    return res.status(500).json({ error: 'Error de autenticación demo' });
  }
}

async function requireGuest(req, res, next) {
  try {
    if (publicDemo.isEnabled()) {
      return res.redirect('/dashboard');
    }
    if (req.session && req.session.userId) {
      return res.redirect('/dashboard');
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function ensurePublicDemo(req, res, next) {
  try {
    if (!publicDemo.isEnabled()) return next();
    await publicDemo.attachSession(req);
    next();
  } catch (err) {
    console.error('ensurePublicDemo:', err);
    next(err);
  }
}

module.exports = {
  requireAuth,
  requireGuest,
  ensurePublicDemo
};
