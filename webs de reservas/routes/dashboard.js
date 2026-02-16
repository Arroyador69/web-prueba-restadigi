const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { runQuery, getQuery, allQuery } = require('../utils/db');
const { getBusinessConfig, getOpeningHours, getAppointmentDuration, isTimeSlotAvailable } = require('../utils/helpers');
const { sendTestEmail } = require('../utils/email');
const { requireAuth } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas del dashboard
router.use(requireAuth);

// Dashboard principal
router.get('/', (req, res) => {
  res.sendFile('dashboard.html', { root: './views' });
});

// Obtener todas las citas
router.get('/api/appointments', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = `SELECT * FROM appointments WHERE status = 'confirmed'`;
    const params = [];

    if (startDate && endDate) {
      query += ` AND appointment_date >= ? AND appointment_date <= ?`;
      const endOfDay = endDate.length === 10 ? endDate + 'T23:59:59.999Z' : endDate;
      params.push(startDate.length === 10 ? startDate + 'T00:00:00.000Z' : startDate, endOfDay);
    } else {
      // Por defecto, mostrar próximas 2 semanas
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 14);
      query += ` AND appointment_date >= ? AND appointment_date <= ?`;
      params.push(start.toISOString(), end.toISOString());
    }

    query += ` ORDER BY appointment_date ASC`;

    const appointments = await allQuery(query, params);
    res.json({ appointments });
  } catch (error) {
    console.error('Error obteniendo citas:', error);
    res.status(500).json({ error: 'Error obteniendo citas' });
  }
});

// Obtener una cita específica
router.get('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await getQuery('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo cita' });
  }
});

// Cancelar una cita (marca como cancelada)
router.post('/api/appointments/:id/cancel', async (req, res) => {
  try {
    await runQuery(
      'UPDATE appointments SET status = ? WHERE id = ?',
      ['cancelled', req.params.id]
    );
    res.json({ success: true, message: 'Cita cancelada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error cancelando cita' });
  }
});

// Crear cita desde el panel (centralizado con reservas)
router.post('/api/appointments', async (req, res) => {
  try {
    const { client_name, client_email, appointment_date, duration: bodyDuration } = req.body;

    if (!client_name || !client_email || !appointment_date) {
      return res.status(400).json({ error: 'Nombre, email y fecha/hora son obligatorios' });
    }

    const duration = bodyDuration ? parseInt(bodyDuration, 10) : await getAppointmentDuration();
    if (isNaN(duration) || duration < 5) {
      return res.status(400).json({ error: 'Duración no válida' });
    }

    const appointmentDateTime = new Date(appointment_date);
    if (isNaN(appointmentDateTime.getTime())) {
      return res.status(400).json({ error: 'Fecha y hora no válidas' });
    }

    const now = new Date();
    if (appointmentDateTime < now) {
      return res.status(400).json({ error: 'No se pueden crear citas en el pasado' });
    }

    const isAvailable = await isTimeSlotAvailable(appointmentDateTime.toISOString(), duration);
    if (!isAvailable) {
      return res.status(400).json({ error: 'Ese horario no está disponible (ocupado o bloqueado)' });
    }

    const result = await runQuery(
      `INSERT INTO appointments (client_name, client_email, appointment_date, duration, status) 
       VALUES (?, ?, ?, ?, 'confirmed')`,
      [client_name.trim(), client_email.trim(), appointmentDateTime.toISOString(), duration]
    );

    res.status(201).json({
      success: true,
      message: 'Cita creada correctamente',
      appointmentId: result.lastID
    });
  } catch (error) {
    console.error('Error creando cita:', error);
    res.status(500).json({ error: 'Error creando cita' });
  }
});

// Eliminar cita permanentemente (solo tras doble verificación en el cliente)
router.delete('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await getQuery('SELECT id FROM appointments WHERE id = ?', [req.params.id]);
    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    await runQuery('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando cita:', error);
    res.status(500).json({ error: 'Error eliminando cita' });
  }
});

// Obtener configuración del negocio
router.get('/api/config', async (req, res) => {
  try {
    const config = await getBusinessConfig();
    const openingHours = await getOpeningHours();
    const duration = await getAppointmentDuration();
    
    res.json({
      ...config,
      openingHours,
      appointmentDuration: duration
    });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo configuración' });
  }
});

// Actualizar configuración del negocio
router.post('/api/config', async (req, res) => {
  try {
    const { businessName, businessPhone, businessEmail, appointmentDuration } = req.body;

    const updates = [];
    if (businessName) updates.push(['businessName', businessName]);
    if (businessPhone) updates.push(['businessPhone', businessPhone]);
    if (businessEmail) updates.push(['businessEmail', businessEmail]);
    if (appointmentDuration) updates.push(['appointmentDuration', appointmentDuration.toString()]);

    for (const [key, value] of updates) {
      await runQuery(
        `INSERT INTO business_config (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP`,
        [key, value, value]
      );
    }

    res.json({ success: true, message: 'Configuración actualizada correctamente' });
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({ error: 'Error actualizando configuración' });
  }
});

// Obtener horarios de apertura
router.get('/api/opening-hours', async (req, res) => {
  try {
    const hours = await getOpeningHours();
    res.json({ openingHours: hours });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo horarios' });
  }
});

// Actualizar horarios de apertura
router.post('/api/opening-hours', async (req, res) => {
  try {
    const { openingHours } = req.body;

    // Eliminar horarios existentes
    await runQuery('DELETE FROM opening_hours');

    // Insertar nuevos horarios
    for (const [day, ranges] of Object.entries(openingHours)) {
      if (Array.isArray(ranges) && ranges.length > 0) {
        for (const range of ranges) {
          if (Array.isArray(range) && range.length === 2) {
            await runQuery(
              'INSERT INTO opening_hours (day_of_week, start_hour, end_hour) VALUES (?, ?, ?)',
              [parseInt(day), range[0], range[1]]
            );
          }
        }
      }
    }

    res.json({ success: true, message: 'Horarios actualizados correctamente' });
  } catch (error) {
    console.error('Error actualizando horarios:', error);
    res.status(500).json({ error: 'Error actualizando horarios' });
  }
});

// Obtener slots bloqueados
router.get('/api/blocked-slots', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM blocked_slots';
    const params = [];

    if (startDate && endDate) {
      query += ` WHERE start_time >= ? AND end_time <= ?`;
      params.push(startDate, endDate);
    }

    query += ' ORDER BY start_time ASC';

    const slots = await allQuery(query, params);
    res.json({ blockedSlots: slots });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo slots bloqueados' });
  }
});

// Crear slot bloqueado
router.post('/api/blocked-slots', async (req, res) => {
  try {
    const { startTime, endTime, reason } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: 'Fecha de inicio y fin requeridas' });
    }

    await runQuery(
      'INSERT INTO blocked_slots (start_time, end_time, reason) VALUES (?, ?, ?)',
      [startTime, endTime, reason || null]
    );

    res.json({ success: true, message: 'Horario bloqueado correctamente' });
  } catch (error) {
    console.error('Error bloqueando slot:', error);
    res.status(500).json({ error: 'Error bloqueando horario' });
  }
});

// Eliminar slot bloqueado
router.delete('/api/blocked-slots/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM blocked_slots WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Bloqueo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando bloqueo' });
  }
});

// Crear nuevo usuario (solo desde dashboard autenticado)
router.post('/api/users', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el email ya existe
    const existingUser = await getQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await runQuery(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    res.json({ success: true, message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error creando usuario' });
  }
});

// Obtener usuarios
router.get('/api/users', async (req, res) => {
  try {
    const users = await allQuery('SELECT id, email, name, created_at FROM users ORDER BY created_at DESC');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
});

// Enviar email de prueba (Resend o SMTP)
router.post('/api/test-email', async (req, res) => {
  try {
    const useResend = !!process.env.RESEND_API_KEY;
    if (!useResend && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
      return res.status(400).json({
        error: 'Configura Resend (RESEND_API_KEY en Railway) o SMTP (SMTP_USER y SMTP_PASS). Ver EMAIL_SIN_DOMINIO.md.'
      });
    }
    // Destino: email del negocio (donde quieres recibir la prueba). EMAIL_FROM es el remitente, no el destinatario.
    let to = null;
    try {
      const businessConfig = await getBusinessConfig();
      to = (businessConfig.businessEmail || '').trim() || null;
    } catch (e) {
      console.warn('No se pudo leer config del negocio:', e.message);
    }
    if (!to) {
      return res.status(400).json({ error: 'Guarda el Email del negocio arriba y pulsa «Guardar configuración» antes de enviar la prueba.' });
    }
    await sendTestEmail(to);
    res.json({ success: true, message: `Email de prueba enviado a ${to}. Revisa la bandeja (y spam).` });
  } catch (error) {
    const msg = error.message || error.response || (error.responseCode ? `Código ${error.responseCode}` : '') || '';
    const isTimeout = /timeout|ETIMEDOUT|ECONNRESET|socket hang up/i.test(String(msg));
    let detail = msg ? `: ${msg}` : '';
    if (!process.env.RESEND_API_KEY && isTimeout) {
      detail += ' En Railway plan Hobby el SMTP está bloqueado (puertos 465/587). Usa Resend (API) o pásate a Railway Pro. Ver ZOHO_MAIL_RAILWAY.md.';
    } else if (!process.env.RESEND_API_KEY) {
      detail += detail ? '. Revisa SMTP_* y EMAIL_FROM en Railway.' : ' Revisa SMTP_* y EMAIL_FROM en Railway.';
    } else {
      detail += detail ? '. Revisa RESEND_API_KEY y EMAIL_FROM.' : ' Revisa RESEND_API_KEY y EMAIL_FROM en Railway.';
    }
    console.error('Error en test-email', detail, error);
    res.status(500).json({ error: `No se pudo enviar${detail}` });
  }
});

// Cerrar sesión
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error cerrando sesión' });
    }
    res.json({ success: true });
  });
});

module.exports = router;
