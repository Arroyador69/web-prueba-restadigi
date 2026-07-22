/**
 * Multi-tenant: resolución por slug y helpers de aislamiento.
 * Cada psicólogo/demo = una fila en `negocio` con slug único.
 * Las URLs públicas son /d/:slug — los datos NUNCA se mezclan entre slugs.
 */
const crypto = require('crypto');
const { getQuery, runQuery, allQuery } = require('../utils/db');

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'demo';
}

async function uniqueSlug(base) {
  let slug = slugify(base);
  if (!SLUG_RE.test(slug)) slug = 'demo';
  const suffix = crypto.randomBytes(2).toString('hex');
  let candidate = `${slug}-${suffix}`;
  for (let i = 0; i < 8; i++) {
    const exists = await getQuery('SELECT id FROM negocio WHERE slug = ?', [candidate]);
    if (!exists) return candidate;
    candidate = `${slug}-${crypto.randomBytes(2).toString('hex')}`;
  }
  return `${slug}-${Date.now().toString(36)}`;
}

async function getBySlug(slug) {
  if (!slug || !SLUG_RE.test(String(slug))) return null;
  return getQuery('SELECT * FROM negocio WHERE slug = ?', [String(slug).toLowerCase()]);
}

async function getById(id) {
  return getQuery('SELECT * FROM negocio WHERE id = ?', [id]);
}

/**
 * Crea un tenant/demo listo para llamada comercial:
 * negocio + horarios + landing + textos legales + plantilla email.
 */
async function createDemoTenant({ nombre, email, telefono, duracion = 50 } = {}) {
  const name = (nombre && String(nombre).trim()) || 'Consulta de prueba';
  const mail = email ? String(email).trim().toLowerCase() : null;
  const phone = telefono ? String(telefono).trim() : null;
  const slug = await uniqueSlug(name);

  const result = await runQuery(
    `INSERT INTO negocio (nombre, telefono, email, duracion_cita_default, slug, is_demo, demo_created_at)
     VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`,
    [name, phone, mail, parseInt(duracion, 10) || 50, slug]
  );
  const negocioId = result.lastID;
  if (!negocioId) {
    const row = await getQuery('SELECT id FROM negocio WHERE slug = ?', [slug]);
    if (!row) throw new Error('No se pudo crear el negocio');
  }
  const id = negocioId || (await getQuery('SELECT id FROM negocio WHERE slug = ?', [slug])).id;

  // Horarios L-V 9-14 y 16-20
  const ranges = [
    [1, 9, 14], [1, 16, 20],
    [2, 9, 14], [2, 16, 20],
    [3, 9, 14], [3, 16, 20],
    [4, 9, 14], [4, 16, 20],
    [5, 9, 14], [5, 16, 20]
  ];
  for (const [day, start, end] of ranges) {
    await runQuery(
      `INSERT INTO opening_hours (negocio_id, day_of_week, start_hour, end_hour) VALUES (?, ?, ?, ?)`,
      [id, day, start, end]
    ).catch(() => {});
  }

  const defaultLanding = JSON.stringify({
    hero_title: `Bienvenido/a a ${name}`,
    hero_subtitle: 'Acompañamiento profesional. Reserva tu cita de prueba en un minuto desde el móvil.',
    hero_image_url: '',
    about_title: 'Sobre la consulta',
    about_text: 'Espacio de escucha y acompañamiento. Esta es una demo personalizada: tus datos solo se ven en esta consulta y no se mezclan con otros profesionales.',
    about_image_url: '',
    cta_text: 'Reservar cita',
    sections: []
  });
  await runQuery('INSERT INTO landing_page (negocio_id, content) VALUES (?, ?)', [id, defaultLanding]).catch(() => {});

  const politica = `POLÍTICA DE PRIVACIDAD (demo)

Responsable: ${name}${mail ? `, contacto ${mail}` : ''}.

Finalidad: gestión de la cita de demostración y comunicaciones relativas al servicio.
Legitimación: consentimiento del interesado.
Derechos: acceso, rectificación, supresión ante el responsable o AEPD (www.aepd.es).`;
  const consentimiento = `Consiento el tratamiento de mis datos (nombre, email, teléfono) para gestionar la cita de demostración en ${name}.`;
  await runQuery(
    'INSERT INTO textos_legales (negocio_id, politica_privacidad, consentimiento, version) VALUES (?, ?, ?, ?)',
    [id, politica, consentimiento, '1']
  ).catch(() => {});

  await runQuery(
    `INSERT INTO plantillas_email (negocio_id, nombre, asunto, cuerpo) VALUES (?, 'recordatorio', ?, ?)`,
    [
      id,
      'Recordatorio: cita el {{fecha}} a las {{hora}}',
      `Hola {{nombre_paciente}},\n\nTe recordamos tu cita en {{nombre_negocio}} el {{fecha}} a las {{hora}}.\n\nSaludos.`
    ]
  ).catch(() => {});

  return getById(id);
}

async function listDemos({ limit = 50 } = {}) {
  const demos = await allQuery(
    `SELECT n.id, n.nombre, n.email, n.telefono, n.slug, n.is_demo, n.demo_created_at, n.created_at,
            (SELECT COUNT(*) FROM citas c WHERE c.negocio_id = n.id) AS citas_count,
            (SELECT COUNT(*) FROM users u WHERE u.negocio_id = n.id) AS users_count
     FROM negocio n
     WHERE n.slug IS NOT NULL
     ORDER BY n.id DESC
     LIMIT ?`,
    [Math.min(parseInt(limit, 10) || 50, 200)]
  );
  for (const d of demos) {
    d.users = await allQuery(
      `SELECT id, email, name, created_at FROM users WHERE negocio_id = ? ORDER BY id ASC`,
      [d.id]
    );
  }
  return demos;
}

/**
 * Borra un tenant completo y todos sus datos (usuarios, citas, pacientes, etc.).
 * No permite borrar el negocio principal (id=1 / slug principal).
 */
async function deleteTenant(negocioId) {
  const id = parseInt(negocioId, 10);
  if (!id) throw new Error('ID inválido');
  const negocio = await getById(id);
  if (!negocio) throw new Error('Negocio no encontrado');
  if (id === 1 || negocio.slug === 'principal') {
    throw new Error('No se puede eliminar el negocio principal');
  }

  // Orden por FKs
  await runQuery(
    `DELETE FROM consentimientos WHERE paciente_id IN (SELECT id FROM pacientes WHERE negocio_id = ?)`,
    [id]
  ).catch(() => {});
  await runQuery(`DELETE FROM reputacion_jobs WHERE negocio_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM review_requests WHERE professional_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM citas WHERE negocio_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM pacientes WHERE negocio_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM facturas WHERE negocio_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM plantillas_email WHERE negocio_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM textos_legales WHERE negocio_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM landing_page WHERE negocio_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM landing_images WHERE negocio_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM opening_hours WHERE negocio_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM blocked_slots WHERE negocio_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM users WHERE negocio_id = ?`, [id]).catch(() => {});
  await runQuery(`DELETE FROM negocio WHERE id = ?`, [id]);

  return { deleted: true, id, slug: negocio.slug, nombre: negocio.nombre };
}

/**
 * Crea (o actualiza) el usuario del psicólogo ligado a ese negocio.
 * Así, tras la llamada, le das acceso a /login → ve solo SUS datos.
 */
async function activateUserForNegocio(negocioId, { email, password, name }) {
  const bcrypt = require('bcryptjs');
  const mail = String(email || '').trim().toLowerCase();
  const pass = String(password || '');
  const nombre = (name && String(name).trim()) || 'Psicólogo/a';
  if (!mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
    throw new Error('Email inválido');
  }
  if (pass.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

  const negocio = await getById(negocioId);
  if (!negocio) throw new Error('Negocio no encontrado');

  const hash = await bcrypt.hash(pass, 10);
  const existing = await getQuery('SELECT id, negocio_id FROM users WHERE email = ?', [mail]);
  if (existing) {
    if (existing.negocio_id && Number(existing.negocio_id) !== Number(negocioId)) {
      throw new Error('Ese email ya pertenece a otro negocio. Usa otro email.');
    }
    await runQuery('UPDATE users SET password = ?, name = ?, negocio_id = ? WHERE id = ?', [
      hash, nombre, negocioId, existing.id
    ]);
  } else {
    await runQuery(
      'INSERT INTO users (email, password, name, negocio_id) VALUES (?, ?, ?, ?)',
      [mail, hash, nombre, negocioId]
    );
  }

  await runQuery(
    `UPDATE negocio SET email = COALESCE(email, ?), is_demo = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [mail, negocioId]
  ).catch(() => {});

  return { email: mail, name: nombre, negocioId, slug: negocio.slug };
}

function publicUrlForSlug(slug, baseUrl) {
  const base = (baseUrl || process.env.APP_URL || '').replace(/\/$/, '');
  return base ? `${base}/d/${slug}` : `/d/${slug}`;
}

module.exports = {
  SLUG_RE,
  slugify,
  uniqueSlug,
  getBySlug,
  getById,
  createDemoTenant,
  listDemos,
  deleteTenant,
  activateUserForNegocio,
  publicUrlForSlug
};
