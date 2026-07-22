/**
 * Servicio de negocio. Toda lectura/escritura por negocio_id.
 */
const { getQuery, runQuery, allQuery } = require('../utils/db');

function normalizeHex(value) {
  let h = String(value || '').trim();
  if (!h) return null;
  if (h[0] !== '#') h = '#' + h;
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h)) return null;
  if (h.length === 4) {
    h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  }
  return h.toLowerCase();
}

async function getById(negocioId) {
  const n = await getQuery('SELECT * FROM negocio WHERE id = ?', [negocioId]);
  return n || null;
}

async function update(negocioId, data) {
  const {
    nombre, telefono, email, direccion, nif, duracion_cita_default,
    smtp_host, smtp_port, smtp_user, smtp_password, email_remitente, nombre_remitente,
    google_review_url, reputacion_activa, color_primary, color_secondary
  } = data;
  const updates = [];
  const params = [];
  if (nombre !== undefined) { updates.push('nombre = ?'); params.push(String(nombre).trim()); }
  if (telefono !== undefined) { updates.push('telefono = ?'); params.push(telefono ? String(telefono).trim() : null); }
  if (email !== undefined) { updates.push('email = ?'); params.push(email ? String(email).trim() : null); }
  if (direccion !== undefined) { updates.push('direccion = ?'); params.push(direccion ? String(direccion).trim() : null); }
  if (nif !== undefined) { updates.push('nif = ?'); params.push(nif ? String(nif).trim() : null); }
  if (duracion_cita_default !== undefined) { updates.push('duracion_cita_default = ?'); params.push(parseInt(duracion_cita_default, 10) || 50); }
  if (smtp_host !== undefined) { updates.push('smtp_host = ?'); params.push(smtp_host ? String(smtp_host).trim() : null); }
  if (smtp_port !== undefined) { updates.push('smtp_port = ?'); params.push(smtp_port != null ? parseInt(smtp_port, 10) : null); }
  if (smtp_user !== undefined) { updates.push('smtp_user = ?'); params.push(smtp_user ? String(smtp_user).trim() : null); }
  if (smtp_password !== undefined) { updates.push('smtp_password = ?'); params.push(smtp_password ? String(smtp_password).trim() : null); }
  if (email_remitente !== undefined) { updates.push('email_remitente = ?'); params.push(email_remitente ? String(email_remitente).trim() : null); }
  if (nombre_remitente !== undefined) { updates.push('nombre_remitente = ?'); params.push(nombre_remitente ? String(nombre_remitente).trim() : null); }
  if (google_review_url !== undefined) { updates.push('google_review_url = ?'); params.push(google_review_url ? String(google_review_url).trim() : null); }
  if (reputacion_activa !== undefined) { updates.push('reputacion_activa = ?'); params.push(reputacion_activa ? 1 : 0); }
  if (color_primary !== undefined) {
    const hex = normalizeHex(color_primary);
    if (hex) { updates.push('color_primary = ?'); params.push(hex); }
  }
  if (color_secondary !== undefined) {
    const hex = normalizeHex(color_secondary);
    if (hex) { updates.push('color_secondary = ?'); params.push(hex); }
  }
  if (updates.length === 0) return { success: true };
  params.push(negocioId);
  await runQuery(
    `UPDATE negocio SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    params
  );
  return { success: true };
}

/** Duración por defecto de cita para un negocio */
async function getDuracionCitaDefault(negocioId) {
  const n = await getQuery('SELECT duracion_cita_default FROM negocio WHERE id = ?', [negocioId]);
  return n ? parseInt(n.duracion_cita_default, 10) : 50;
}

module.exports = {
  getById,
  update,
  getDuracionCitaDefault,
  normalizeHex
};
