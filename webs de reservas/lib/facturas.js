/**
 * Servicio de facturas. Listar, crear y generar PDF.
 */
const { getQuery, runQuery, allQuery } = require('../utils/db');
const PDFDocument = require('pdfkit');

function formatEuro(n) {
  return typeof n === 'number' ? n.toFixed(2).replace('.', ',') + ' €' : (n || '0,00') + ' €';
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

async function create(negocioId, data) {
  const {
    cliente_nombre, cliente_nif, cliente_direccion, cliente_cp, cliente_ciudad, cliente_provincia,
    concepto, descripcion, totalPagado, ivaPct, forma_pago
  } = data;
  const total = parseFloat(totalPagado) || 0;
  const ivaPctNum = parseFloat(ivaPct) || 21;
  const precioBase = Math.round((total / (1 + ivaPctNum / 100)) * 100) / 100;
  const ivaEur = Math.round((total - precioBase) * 100) / 100;
  const numero = await getNextNumeroFactura(negocioId);
  const fecha = new Date().toISOString().slice(0, 10);
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
      precioBase, ivaPctNum, ivaEur, total,
      forma_pago ? String(forma_pago).trim() : null
    ]
  );
  const row = await getQuery('SELECT id FROM facturas WHERE negocio_id = ? AND numero_factura = ?', [negocioId, numero]);
  return { id: row.id, numero_factura: numero };
}

/** Genera el buffer PDF de la factura (estilo legal: emisor, cliente, tabla, totales, pie) */
async function generatePdfBuffer(negocioId, facturaId) {
  const factura = await getById(negocioId, facturaId);
  if (!factura) return null;
  const negocio = await require('./negocio').getById(negocioId);
  if (!negocio) return null;

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  await new Promise((resolve, reject) => {
    doc.on('end', resolve);
    doc.on('error', reject);

    const blue = '#2563eb';
    doc.fontSize(22).fillColor(blue).text('FACTURA', 50, 50);
    doc.fontSize(10).fillColor('#374151');
    doc.text(`N° ${factura.numero_factura}`, 400, 50, { align: 'right' });
    const fechaStr = factura.fecha_emision ? String(factura.fecha_emision).slice(0, 10) : '';
    doc.text(`Fecha: ${fechaStr ? fechaStr.split('-').reverse().join('/') : ''}`, 400, 65, { align: 'right' });

    let y = 110;
    doc.fontSize(11).fillColor('#111827');
    doc.text('EMISOR', 50, y);
    doc.fontSize(10).fillColor('#374151');
    y += 18;
    doc.text(negocio.nombre || '', 50, y);
    y += 14;
    if (negocio.nif) { doc.text('NIF: ' + negocio.nif, 50, y); y += 14; }
    if (negocio.direccion) { doc.text(negocio.direccion, 50, y); y += 14; }
    if (negocio.telefono) { doc.text('Tel: ' + negocio.telefono, 50, y); y += 14; }
    if (negocio.email) { doc.text('Email: ' + negocio.email, 50, y); y += 14; }

    y = 110;
    doc.fontSize(11).fillColor('#111827');
    doc.text('CLIENTE', 320, y);
    doc.fontSize(10).fillColor('#374151');
    y += 18;
    doc.text(factura.cliente_nombre || '', 320, y);
    y += 14;
    if (factura.cliente_nif) { doc.text('NIF: ' + factura.cliente_nif, 320, y); y += 14; }
    const dirParts = [factura.cliente_direccion, factura.cliente_cp, factura.cliente_ciudad, factura.cliente_provincia].filter(Boolean);
    if (dirParts.length) { doc.text(dirParts.join(', '), 320, y); y += 14; }

    y += 20;
    doc.fontSize(10).fillColor('#111827');
    doc.text('Concepto', 50, y);
    doc.text('Precio Base', 280, y);
    doc.text('IVA', 360, y);
    doc.text('Total', 440, y);
    y += 20;
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 12;
    doc.fillColor('#374151');
    doc.text(factura.concepto || '', 50, y, { width: 220 });
    if (factura.descripcion) doc.fontSize(9).text(factura.descripcion, 50, y + 14, { width: 220 });
    doc.fontSize(10).text(formatEuro(factura.precio_base), 280, y);
    doc.text(formatEuro(factura.iva_eur), 360, y);
    doc.text(formatEuro(factura.total), 440, y);
    y += 40;
    doc.fontSize(10).fillColor('#374151');
    doc.text('Subtotal: ' + formatEuro(factura.precio_base), 380, y);
    y += 16;
    doc.text(`IVA (${factura.iva_pct}%): ${formatEuro(factura.iva_eur)}`, 380, y);
    y += 16;
    doc.fontSize(11).fillColor(blue).text('TOTAL: ' + formatEuro(factura.total), 380, y);
    y += 30;
    if (factura.forma_pago) doc.fontSize(9).fillColor('#374151').text('Forma de pago: ' + factura.forma_pago, 50, y);
    y += 20;
    doc.fontSize(9).fillColor('#6b7280').text('Gracias por su confianza.', 50, y);
    y += 14;
    doc.text('Factura generada automáticamente por el sistema de gestión de citas.', 50, y);
    doc.end();
  });
  return Buffer.concat(chunks);
}

module.exports = {
  list,
  getById,
  create,
  getNextNumeroFactura,
  generatePdfBuffer,
  formatEuro
};
