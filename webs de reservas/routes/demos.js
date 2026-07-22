/**
 * Panel comercial: crear demos aislados por llamada y activar usuario del psicólogo.
 * Protegido con DEMO_ADMIN_SECRET (variable de entorno).
 */
const express = require('express');
const router = express.Router();
const tenant = require('../lib/tenant');

function requireDemoAdmin(req, res, next) {
  const secret = process.env.DEMO_ADMIN_SECRET;
  if (!secret) {
    return res.status(503).json({
      error: 'Define DEMO_ADMIN_SECRET en Vercel para usar el panel de demos.'
    });
  }
  const provided =
    req.headers['x-demo-admin-secret'] ||
    req.query.secret ||
    (req.body && req.body.secret) ||
    (req.session && req.session.demoAdminOk && secret);
  if (provided === secret || (req.session && req.session.demoAdminOk === true)) {
    if (req.session) req.session.demoAdminOk = true;
    return next();
  }
  return res.status(401).json({ error: 'No autorizado. Introduce la clave de demos.' });
}

router.post('/api/demos/login', (req, res) => {
  const secret = process.env.DEMO_ADMIN_SECRET;
  if (!secret) {
    return res.status(503).json({ error: 'DEMO_ADMIN_SECRET no configurado' });
  }
  if (!req.body || req.body.secret !== secret) {
    return res.status(401).json({ error: 'Clave incorrecta' });
  }
  if (req.session) req.session.demoAdminOk = true;
  res.json({ success: true });
});

router.post('/api/demos/logout', (req, res) => {
  if (req.session) req.session.demoAdminOk = false;
  res.json({ success: true });
});

router.get('/api/demos', requireDemoAdmin, async (req, res) => {
  try {
    const demos = await tenant.listDemos({ limit: req.query.limit || 100 });
    const base = `${req.protocol}://${req.get('host')}`;
    res.json({
      demos: demos.map((d) => ({
        ...d,
        url: tenant.publicUrlForSlug(d.slug, base)
      }))
    });
  } catch (err) {
    console.error('list demos:', err);
    res.status(500).json({ error: 'Error listando demos' });
  }
});

/** Crear demo en ~1s durante la llamada: nombre + email (+ teléfono opcional) */
router.post('/api/demos', requireDemoAdmin, async (req, res) => {
  try {
    const { nombre, email, telefono, duracion } = req.body || {};
    if (!nombre || String(nombre).trim().length < 2) {
      return res.status(400).json({ error: 'Nombre del psicólogo/consulta obligatorio' });
    }
    const negocio = await tenant.createDemoTenant({ nombre, email, telefono, duracion });
    const base = `${req.protocol}://${req.get('host')}`;
    const url = tenant.publicUrlForSlug(negocio.slug, base);
    res.json({
      success: true,
      negocio: {
        id: negocio.id,
        nombre: negocio.nombre,
        email: negocio.email,
        telefono: negocio.telefono,
        slug: negocio.slug
      },
      url,
      message: 'Demo creado. Envíale este enlace por WhatsApp/SMS durante la llamada.'
    });
  } catch (err) {
    console.error('create demo:', err);
    res.status(500).json({ error: err.message || 'Error creando demo' });
  }
});

/**
 * Tras la llamada: crear usuario con el email del psicólogo ligado a ESE negocio.
 * Así entra en /login y solo ve sus pacientes/citas.
 */
router.post('/api/demos/:id/activate', requireDemoAdmin, async (req, res) => {
  try {
    const negocioId = parseInt(req.params.id, 10);
    if (!negocioId) return res.status(400).json({ error: 'ID inválido' });
    const { email, password, name } = req.body || {};
    const user = await tenant.activateUserForNegocio(negocioId, { email, password, name });
    const base = `${req.protocol}://${req.get('host')}`;
    res.json({
      success: true,
      user,
      loginUrl: `${base}/login`,
      landingUrl: tenant.publicUrlForSlug(user.slug, base),
      message: 'Usuario creado. Puede entrar en /login con ese email y contraseña.'
    });
  } catch (err) {
    console.error('activate demo:', err);
    res.status(400).json({ error: err.message || 'Error activando usuario' });
  }
});

module.exports = router;
