/**
 * Servicio de facturas. Listar, crear y generar PDF.
 * PDF con colores de marca del negocio + idioma de creación (es/en/fi).
 */
const { getQuery, runQuery, allQuery } = require('../utils/db');
const PDFDocument = require('pdfkit');
const negocioService = require('./negocio');

const SUPPORTED_LANGS = ['es', 'en', 'fi'];

const PDF_LABELS = {
  es: {
    invoice: 'FACTURA',
    number: 'Nº',
    date: 'Fecha',
    issuer: 'EMISOR',
    client: 'CLIENTE',
    tax_id: 'NIF',
    phone: 'Tel',
    email: 'Email',
    concept: 'Concepto',
    base_price: 'Base',
    vat: 'IVA',
    total: 'Total',
    subtotal: 'Subtotal',
    grand_total: 'TOTAL',
    payment: 'Forma de pago',
    thanks: 'Gracias por su confianza.',
    auto: 'Factura generada automáticamente por {name}.'
  },
  en: {
    invoice: 'INVOICE',
    number: 'No.',
    date: 'Date',
    issuer: 'ISSUER',
    client: 'CLIENT',
    tax_id: 'Tax ID',
    phone: 'Tel',
    email: 'Email',
    concept: 'Description',
    base_price: 'Net',
    vat: 'VAT',
    total: 'Total',
    subtotal: 'Subtotal',
    grand_total: 'TOTAL',
    payment: 'Payment method',
    thanks: 'Thank you for your business.',
    auto: 'Invoice generated automatically by {name}.'
  },
  fi: {
    invoice: 'LASKU',
    number: 'Nro',
    date: 'Päivämäärä',
    issuer: 'LASKUTTAJA',
    client: 'ASIAKAS',
    tax_id: 'Y-tunnus',
    phone: 'Puh',
    email: 'Sähköposti',
    concept: 'Nimike',
    base_price: 'Netto',
    vat: 'ALV',
    total: 'Yhteensä',
    subtotal: 'Välisumma',
    grand_total: 'YHTEENSÄ',
    payment: 'Maksutapa',
    thanks: 'Kiitos luottamuksestanne.',
    auto: 'Lasku luotu automaattisesti: {name}.'
  }
};

function normalizeLang(lang) {
  const l = String(lang || '').toLowerCase().slice(0, 2);
  return SUPPORTED_LANGS.includes(l) ? l : 'fi';
}

function labelsFor(lang) {
  return PDF_LABELS[normalizeLang(lang)] || PDF_LABELS.fi;
}

function formatEuro(n, lang) {
  const num = typeof n === 'number' ? n : parseFloat(n) || 0;
  const l = normalizeLang(lang);
  try {
    const locale = l === 'en' ? 'en-GB' : l === 'es' ? 'es-ES' : 'fi-FI';
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(num);
  } catch (_) {
    return num.toFixed(2).replace('.', ',') + ' €';
  }
}

function formatFecha(fecha, lang) {
  if (!fecha) return '';
  const s = typeof fecha === 'string' ? fecha.slice(0, 10) : new Date(fecha).toISOString().slice(0, 10);
  if (s.length < 10) return '';
  const [yy, mm, dd] = s.split('-');
  const l = normalizeLang(lang);
  if (l === 'en') return `${dd}/${mm}/${yy}`;
  if (l === 'fi') return `${dd}.${mm}.${yy}`;
  return `${dd}/${mm}/${yy}`;
}

function hexToRgb(hex) {
  const h = negocioService.normalizeHex(hex) || '#2563eb';
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16)
  };
}

function darkenHex(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const f = 1 - (amount == null ? 0.18 : amount);
  const c = (n) => Math.max(0, Math.min(255, Math.round(n * f))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Siguiente número de factura para el año (ej. 2025-0001) */
async function getNextNumeroFactura(negocioId) {
  const year = new Date().getFullYear();
  const prefix = year + '-';
  const row = await getQuery(
    `SELECT numero_factura FROM facturas WHERE negocio_id = ? AND numero_factura LIKE ? ORDER BY id DESC LIMIT 1`,
    [negocioId, prefix + '%']
  );
  let next = 1;
  if (row && row.numero_factura) {
    const parts = String(row.numero_factura).split('-');
    if (parts.length >= 2) next = parseInt(parts[1], 10) + 1;
  }
  return prefix + String(next).padStart(4, '0');
}

async function list(negocioId) {
  return allQuery(
    `SELECT * FROM facturas WHERE negocio_id = ? ORDER BY fecha_emision DESC, id DESC`,
    [negocioId]
  );
}

async function getById(negocioId, id) {
  return getQuery('SELECT * FROM facturas WHERE id = ? AND negocio_id = ?', [id, negocioId]);
}

async function remove(negocioId, facturaId) {
  const f = await getById(negocioId, facturaId);
  if (!f) return false;
  await runQuery('DELETE FROM facturas WHERE id = ? AND negocio_id = ?', [facturaId, negocioId]);
  return true;
}

async function create(negocioId, data) {
  const {
    cliente_nombre, cliente_nif, cliente_direccion, cliente_cp, cliente_ciudad, cliente_provincia,
    concepto, descripcion, totalPagado, ivaPct, forma_pago, idioma
  } = data;
  const total = parseFloat(totalPagado) || 0;
  const ivaPctNum = parseFloat(ivaPct);
  const vat = Number.isFinite(ivaPctNum) ? ivaPctNum : 25.5;
  const precioBase = Math.round((total / (1 + vat / 100)) * 100) / 100;
  const ivaEur = Math.round((total - precioBase) * 100) / 100;
  const numero = await getNextNumeroFactura(negocioId);
  const fecha = new Date().toISOString().slice(0, 10);
  const lang = normalizeLang(idioma);
  try {
    await runQuery(
      `INSERT INTO facturas (negocio_id, numero_factura, fecha_emision, cliente_nombre, cliente_nif, cliente_direccion, cliente_cp, cliente_ciudad, cliente_provincia, concepto, descripcion, precio_base, iva_pct, iva_eur, total, forma_pago, idioma)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        negocioId, numero, fecha,
        String(cliente_nombre || '').trim(),
        cliente_nif ? String(cliente_nif).trim() : null,
        cliente_direccion ? String(cliente_direccion).trim() : null,
        cliente_cp ? String(cliente_cp).trim() : null,
        cliente_ciudad ? String(cliente_ciudad).trim() : null,
        cliente_provincia ? String(cliente_provincia).trim() : null,
        String(concepto || '').trim(),
        descripcion ? String(descripcion).trim() : null,
        precioBase, vat, ivaEur, total,
        forma_pago ? String(forma_pago).trim() : null,
        lang
      ]
    );
  } catch (err) {
    // Compatibilidad si aún no existe la columna idioma
    await runQuery(
      `INSERT INTO facturas (negocio_id, numero_factura, fecha_emision, cliente_nombre, cliente_nif, cliente_direccion, cliente_cp, cliente_ciudad, cliente_provincia, concepto, descripcion, precio_base, iva_pct, iva_eur, total, forma_pago)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        negocioId, numero, fecha,
        String(cliente_nombre || '').trim(),
        cliente_nif ? String(cliente_nif).trim() : null,
        cliente_direccion ? String(cliente_direccion).trim() : null,
        cliente_cp ? String(cliente_cp).trim() : null,
        cliente_ciudad ? String(cliente_ciudad).trim() : null,
        cliente_provincia ? String(cliente_provincia).trim() : null,
        String(concepto || '').trim(),
        descripcion ? String(descripcion).trim() : null,
        precioBase, vat, ivaEur, total,
        forma_pago ? String(forma_pago).trim() : null
      ]
    );
  }
  const row = await getQuery('SELECT id FROM facturas WHERE negocio_id = ? AND numero_factura = ?', [negocioId, numero]);
  return { id: row.id, numero_factura: numero, idioma: lang };
}

/**
 * Genera el buffer PDF de la factura.
 * @param {number} negocioId
 * @param {number|string} facturaId
 * @param {{ lang?: string }} [options] — override opcional; por defecto factura.idioma
 */
async function generatePdfBuffer(negocioId, facturaId, options = {}) {
  const factura = await getById(negocioId, facturaId);
  if (!factura) return null;
  const negocio = await negocioService.getById(negocioId);
  if (!negocio) return null;

  let nombreNegocio = negocio.nombre || '';
  try {
    const { getBusinessConfig } = require('../utils/helpers');
    const config = await getBusinessConfig();
    if (config && config.businessName) nombreNegocio = String(config.businessName).trim();
  } catch (_) {}

  const lang = normalizeLang(factura.idioma || options.lang || 'fi');
  const L = labelsFor(lang);
  const primary = negocioService.normalizeHex(negocio.color_primary) || '#2563eb';
  const secondary = negocioService.normalizeHex(negocio.color_secondary) || '#0f172a';
  const primaryDark = darkenHex(primary, 0.12);
  const gris = '#6b7280';
  const lineHeight = 16;
  const blockGap = 28;

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));

  await new Promise((resolve, reject) => {
    doc.on('end', resolve);
    doc.on('error', reject);

    // Barra de marca
    doc.rect(0, 0, 595, 8).fill(primary);
    doc.rect(0, 8, 595, 52).fill(primaryDark);

    doc.fillColor('#ffffff').fontSize(22).text(L.invoice, 50, 22, { continued: false });
    doc.fontSize(10).fillColor('#e2e8f0');
    doc.text(`${L.number} ${factura.numero_factura}`, 50, 28, { width: 495, align: 'right' });
    doc.text(`${L.date}: ${formatFecha(factura.fecha_emision, lang)}`, 50, 44, { width: 495, align: 'right' });

    let yEmisor = 85;
    doc.fontSize(11).fillColor(secondary).text(L.issuer, 50, yEmisor);
    yEmisor += lineHeight + 4;
    doc.fontSize(10).fillColor('#374151');
    doc.text(nombreNegocio || '—', 50, yEmisor, { width: 240 });
    yEmisor += lineHeight;
    if (negocio.nif) { doc.text(`${L.tax_id}: ${negocio.nif}`, 50, yEmisor); yEmisor += lineHeight; }
    if (negocio.direccion) { doc.text(negocio.direccion, 50, yEmisor, { width: 240 }); yEmisor += lineHeight; }
    if (negocio.telefono) { doc.text(`${L.phone}: ${negocio.telefono}`, 50, yEmisor); yEmisor += lineHeight; }
    if (negocio.email) { doc.text(`${L.email}: ${negocio.email}`, 50, yEmisor, { width: 240 }); yEmisor += lineHeight; }

    let yCliente = 85;
    doc.fontSize(11).fillColor(secondary).text(L.client, 320, yCliente);
    yCliente += lineHeight + 4;
    doc.fontSize(10).fillColor('#374151');
    doc.text(factura.cliente_nombre || '—', 320, yCliente, { width: 230 });
    yCliente += lineHeight;
    if (factura.cliente_nif) { doc.text(`${L.tax_id}: ${factura.cliente_nif}`, 320, yCliente); yCliente += lineHeight; }
    const dirParts = [factura.cliente_direccion, factura.cliente_cp, factura.cliente_ciudad, factura.cliente_provincia].filter(Boolean);
    if (dirParts.length) { doc.text(dirParts.join(', '), 320, yCliente, { width: 230 }); yCliente += lineHeight; }

    let y = Math.max(yEmisor, yCliente) + blockGap;

    // Cabecera tabla con color primario
    doc.rect(50, y - 4, 495, 22).fill(primary);
    doc.fillColor('#ffffff').fontSize(9);
    doc.text(L.concept, 56, y + 2, { width: 220 });
    doc.text(L.base_price, 290, y + 2, { width: 70 });
    doc.text(L.vat, 370, y + 2, { width: 70 });
    doc.text(L.total, 450, y + 2, { width: 90 });
    y += 26;

    doc.fillColor('#374151').fontSize(10);
    const conceptY = y;
    doc.text(factura.concepto || '', 56, y, { width: 220 });
    if (factura.descripcion) {
      doc.fontSize(9).fillColor(gris).text(factura.descripcion, 56, y + 14, { width: 220 });
    }
    doc.fontSize(10).fillColor('#374151');
    doc.text(formatEuro(factura.precio_base, lang), 290, conceptY, { width: 70 });
    doc.text(formatEuro(factura.iva_eur, lang), 370, conceptY, { width: 70 });
    doc.text(formatEuro(factura.total, lang), 450, conceptY, { width: 90 });
    y += (factura.descripcion ? 32 : 20) + 12;

    doc.moveTo(50, y).lineTo(545, y).strokeColor(primary).lineWidth(1).stroke();
    y += 16;
    doc.strokeColor('#000000').lineWidth(1);

    doc.fontSize(10).fillColor('#374151');
    doc.text(`${L.subtotal}: ${formatEuro(factura.precio_base, lang)}`, 320, y, { width: 225, align: 'right' });
    y += lineHeight;
    doc.text(`${L.vat} (${factura.iva_pct}%): ${formatEuro(factura.iva_eur, lang)}`, 320, y, { width: 225, align: 'right' });
    y += lineHeight + 4;
    doc.fontSize(12).fillColor(primary).text(`${L.grand_total}: ${formatEuro(factura.total, lang)}`, 320, y, { width: 225, align: 'right' });
    y += blockGap + 8;

    if (factura.forma_pago) {
      doc.fontSize(9).fillColor('#374151').text(`${L.payment}: ${factura.forma_pago}`, 50, y);
      y += lineHeight + 8;
    }

    y += 8;
    doc.fontSize(9).fillColor(gris).text(L.thanks, 50, y);
    y += lineHeight;
    const auto = L.auto.replace('{name}', nombreNegocio || '—');
    doc.fontSize(8).fillColor('#9ca3af').text(auto, 50, y, { width: 495 });

    // Pie con acento de marca
    doc.rect(0, 842 - 6, 595, 6).fill(primary);

    doc.end();
  });

  return Buffer.concat(chunks);
}

module.exports = {
  list,
  getById,
  create,
  remove,
  getNextNumeroFactura,
  generatePdfBuffer,
  formatEuro,
  normalizeLang,
  labelsFor
};
