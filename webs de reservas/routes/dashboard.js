const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { runQuery, getQuery, allQuery } = require('../utils/db');
const { getBusinessConfig, getOpeningHours, getAppointmentDuration } = require('../utils/helpers');
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
      params.push(startDate, endDate);
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

// Cancelar una cita
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

// Enviar email de prueba (verificar SMTP)
router.post('/api/test-email', async (req, res) => {
  try {
    // Comprobar que las variables SMTP están en Railway
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(400).json({
        error: 'Faltan SMTP_USER o SMTP_PASS en Railway (Variables del servicio web). Pon tu Gmail y la contraseña de aplicación.'
      });
    }
    // Destino: priorizar EMAIL_FROM, luego email del negocio en BD
    let to = process.env.EMAIL_FROM;
    if (!to) {
      try {
        const businessConfig = await getBusinessConfig();
        to = businessConfig.businessEmail || null;
      } catch (e) {
        console.warn('No se pudo leer config del negocio:', e.message);
      }
    }
    if (!to) {
      return res.status(400).json({ error: 'Añade EMAIL_FROM en Railway (Variables) o guarda el Email del negocio arriba y Guardar configuración.' });
    }
    await sendTestEmail(to);
    res.json({ success: true, message: `Email de prueba enviado a ${to}. Revisa la bandeja (y spam).` });
  } catch (error) {
    const msg = error.message || error.response || (error.responseCode ? `Código ${error.responseCode}` : '') || '';
    const detail = msg ? `: ${msg}` : '. Revisa SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y EMAIL_FROM en Railway.';
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
