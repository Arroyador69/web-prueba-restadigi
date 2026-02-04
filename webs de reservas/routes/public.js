const express = require('express');
const router = express.Router();
const { runQuery, allQuery } = require('../utils/db');
const { getBusinessConfig, getAvailableTimeSlots, getAppointmentDuration } = require('../utils/helpers');
const { sendConfirmationEmail } = require('../utils/email');

// Landing pública
router.get('/', async (req, res) => {
  const config = await getBusinessConfig();
  res.sendFile('index.html', { root: './views' });
});

// Obtener configuración pública (para el frontend)
router.get('/api/config', async (req, res) => {
  try {
    const config = await getBusinessConfig();
    res.json({
      businessName: config.businessName,
      businessPhone: config.businessPhone,
      businessEmail: config.businessEmail
    });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo configuración' });
  }
});

// Obtener horas disponibles para una fecha
router.get('/api/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Fecha requerida' });
    }

    const duration = await getAppointmentDuration();
    const slots = await getAvailableTimeSlots(date, duration);

    res.json({
      slots: slots.map(slot => {
        const hours = slot.getHours().toString().padStart(2, '0');
        const minutes = slot.getMinutes().toString().padStart(2, '0');
        return {
          time: `${hours}:${minutes}`, // Formato HH:MM simple
          display: slot.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
      })
    });
  } catch (error) {
    console.error('Error obteniendo slots:', error);
    res.status(500).json({ error: 'Error obteniendo horas disponibles' });
  }
});

// Crear nueva reserva
router.post('/api/book', async (req, res) => {
  try {
    const { name, email, date, time } = req.body;

    // Validaciones básicas
    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Combinar fecha y hora (time viene en formato HH:MM)
    // Crear fecha en zona horaria local
    const [hours, minutes] = time.split(':');
    if (!hours || !minutes) {
      return res.status(400).json({ error: 'Formato de hora inválido' });
    }
    
    // Crear fecha local (sin conversión de zona horaria)
    const appointmentDateTime = new Date(`${date}T${hours}:${minutes}:00`);
    
    // Verificar que la fecha sea válida
    if (isNaN(appointmentDateTime.getTime())) {
      return res.status(400).json({ error: 'Fecha u hora inválida' });
    }
    
    // Verificar que la fecha no sea pasada
    const now = new Date();
    if (appointmentDateTime < now) {
      return res.status(400).json({ error: 'No se pueden reservar citas en el pasado' });
    }

    const duration = await getAppointmentDuration();
    const { isTimeSlotAvailable } = require('../utils/helpers');
    
    // Verificar disponibilidad
    const isAvailable = await isTimeSlotAvailable(appointmentDateTime.toISOString(), duration);
    if (!isAvailable) {
      return res.status(400).json({ error: 'Este horario ya no está disponible' });
    }

    // Crear la cita
    const result = await runQuery(
      `INSERT INTO appointments (client_name, client_email, appointment_date, duration, status) 
       VALUES (?, ?, ?, ?, 'confirmed')`,
      [name, email, appointmentDateTime.toISOString(), duration]
    );

    // Enviar email de confirmación
    const appointment = {
      id: result.lastID,
      client_name: name,
      client_email: email,
      appointment_date: appointmentDateTime.toISOString(),
      duration: duration
    };

    await sendConfirmationEmail(appointment).catch(err => {
      console.error('Error enviando email (pero la cita se guardó):', err);
    });

    res.json({
      success: true,
      message: 'Cita reservada correctamente. Revisa tu email para la confirmación.',
      appointmentId: result.lastID
    });
  } catch (error) {
    console.error('Error creando reserva:', error);
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Este horario ya está reservado' });
    }
    res.status(500).json({ error: 'Error al reservar la cita' });
  }
});

module.exports = router;
