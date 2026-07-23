/**
 * Demo pública Restadigi (sin login).
 * Un único negocio de muestra compartido; se puede resetear.
 */
const bcrypt = require('bcryptjs');
const { runQuery, getQuery } = require('../utils/db');

const SLUG = 'public-demo';
const DEMO_EMAIL = 'demo@restadigi.public';
const DEMO_NAME = 'Restadigi Demo';

const DEFAULT_COLORS = {
  primary: '#c46a32',
  secondary: '#432f24'
};

const DEFAULT_LANDING = {
  i18n_demo: true,
  hero_title: 'Ravintola Demo · Restadigi',
  hero_subtitle:
    'Julkinen esittely. Varaa pöytä lomakkeella tai chatilla. Muokkaa värejä ja landingia hallintapaneelissa — ilman kirjautumista.',
  hero_image_url: '',
  about_title: 'Tästä demosta',
  about_text:
    'Tämä on Restadigin julkinen demo. Voit kokeilla varauksia, asiakkaita, värejä ja landing-sivua. Tiedot ovat esimerkkidataa ja voidaan nollata milloin tahansa. Ei oikeaa sähköpostia eikä SMS-viestejä.',
  about_image_url: '',
  cta_text: 'Varaa pöytä',
  sections: []
};

let readyCache = null;
let readyAt = 0;

function isEnabled() {
  const v = String(process.env.PUBLIC_DEMO || '').toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

async function ensureReady() {
  const now = Date.now();
  if (readyCache && now - readyAt < 60_000) return readyCache;
  readyCache = await ensureReadyInner();
  readyAt = now;
  return readyCache;
}

async function ensureReadyInner() {
  let negocio = await getQuery('SELECT * FROM negocio WHERE slug = ?', [SLUG]);
  if (!negocio) {
    const result = await runQuery(
      `INSERT INTO negocio (nombre, telefono, email, duracion_cita_default, slug, is_demo, demo_created_at, color_primary, color_secondary)
       VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, ?, ?)`,
      [
        'Ravintola Demo',
        '+358 40 000 0000',
        'demo@restadigi.fi',
        90,
        SLUG,
        DEFAULT_COLORS.primary,
        DEFAULT_COLORS.secondary
      ]
    );
    let id = result.lastID;
    if (!id) {
      negocio = await getQuery('SELECT * FROM negocio WHERE slug = ?', [SLUG]);
      id = negocio && negocio.id;
    }
    if (!id) throw new Error('No se pudo crear el negocio public-demo');

    const ranges = [
      [1, 11, 15],
      [1, 17, 22],
      [2, 11, 15],
      [2, 17, 22],
      [3, 11, 15],
      [3, 17, 22],
      [4, 11, 15],
      [4, 17, 22],
      [5, 11, 15],
      [5, 17, 22],
      [6, 12, 23],
      [0, 12, 22]
    ];
    for (const [day, start, end] of ranges) {
      await runQuery(
        `INSERT INTO opening_hours (negocio_id, day_of_week, start_hour, end_hour) VALUES (?, ?, ?, ?)`,
        [id, day, start, end]
      ).catch(() => {});
    }

    await runQuery('INSERT INTO landing_page (negocio_id, content) VALUES (?, ?)', [
      id,
      JSON.stringify(DEFAULT_LANDING)
    ]).catch(() => {});

    await runQuery(
      'INSERT INTO textos_legales (negocio_id, politica_privacidad, consentimiento, version) VALUES (?, ?, ?, ?)',
      [
        id,
        'TIETOSUOJAKÄYTÄNTÖ (julkinen demo)\n\nTämä on demonstraatio. Älä syötä oikeita henkilötietoja.',
        'Ymmärrän, että tämä on julkinen demo.',
        '1'
      ]
    ).catch(() => {});

    negocio = await getQuery('SELECT * FROM negocio WHERE id = ?', [id]);
  }

  let user = await getQuery('SELECT * FROM users WHERE email = ?', [DEMO_EMAIL]);
  if (!user) {
    const hash = await bcrypt.hash('public-demo-no-login', 10);
    const r = await runQuery(
      'INSERT INTO users (email, password, name, negocio_id) VALUES (?, ?, ?, ?)',
      [DEMO_EMAIL, hash, DEMO_NAME, negocio.id]
    );
    let uid = r.lastID;
    if (!uid) {
      user = await getQuery('SELECT * FROM users WHERE email = ?', [DEMO_EMAIL]);
    } else {
      user = await getQuery('SELECT * FROM users WHERE id = ?', [uid]);
    }
  } else if (user.negocio_id !== negocio.id) {
    await runQuery('UPDATE users SET negocio_id = ?, name = ? WHERE id = ?', [
      negocio.id,
      DEMO_NAME,
      user.id
    ]);
    user = await getQuery('SELECT * FROM users WHERE id = ?', [user.id]);
  }

  // Colores por defecto si faltan
  if (!negocio.color_primary || !negocio.color_secondary) {
    await runQuery('UPDATE negocio SET color_primary = ?, color_secondary = ? WHERE id = ?', [
      negocio.color_primary || DEFAULT_COLORS.primary,
      negocio.color_secondary || DEFAULT_COLORS.secondary,
      negocio.id
    ]).catch(() => {});
    negocio = await getQuery('SELECT * FROM negocio WHERE id = ?', [negocio.id]);
  }

  return {
    negocioId: negocio.id,
    slug: SLUG,
    userId: user.id,
    email: user.email,
    name: user.name,
    negocio
  };
}

async function resetDemo() {
  readyCache = null;
  readyAt = 0;
  const demo = await ensureReady();
  const id = demo.negocioId;

  await runQuery('DELETE FROM citas WHERE negocio_id = ?', [id]).catch(() => {});
  await runQuery('DELETE FROM pacientes WHERE negocio_id = ?', [id]).catch(() => {});
  await runQuery('DELETE FROM facturas WHERE negocio_id = ?', [id]).catch(() => {});
  await runQuery('DELETE FROM landing_events WHERE negocio_id = ?', [id]).catch(() => {});
  // appointments legado (si existe y tiene negocio_id)
  await runQuery('DELETE FROM appointments WHERE negocio_id = ?', [id]).catch(() => {});

  await runQuery('UPDATE landing_page SET content = ? WHERE negocio_id = ?', [
    JSON.stringify(DEFAULT_LANDING),
    id
  ]).catch(async () => {
    await runQuery('INSERT INTO landing_page (negocio_id, content) VALUES (?, ?)', [
      id,
      JSON.stringify(DEFAULT_LANDING)
    ]);
  });

  await runQuery(
    'UPDATE negocio SET nombre = ?, telefono = ?, email = ?, color_primary = ?, color_secondary = ? WHERE id = ?',
    [
      'Ravintola Demo',
      '+358 40 000 0000',
      'demo@restadigi.fi',
      DEFAULT_COLORS.primary,
      DEFAULT_COLORS.secondary,
      id
    ]
  );

  return { ok: true, negocioId: id, slug: SLUG };
}

async function attachSession(req) {
  if (!isEnabled()) return null;
  const demo = await ensureReady();
  req.session.userId = demo.userId;
  req.session.userEmail = demo.email;
  req.session.userName = demo.name;
  req.session.negocioId = demo.negocioId;
  req.session.publicDemo = true;
  req.negocioId = demo.negocioId;
  return demo;
}

module.exports = {
  SLUG,
  DEMO_EMAIL,
  isEnabled,
  ensureReady,
  resetDemo,
  attachSession,
  DEFAULT_LANDING,
  DEFAULT_COLORS
};
