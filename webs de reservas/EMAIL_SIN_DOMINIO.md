# Enviar emails sin tener dominio propio

Puedes usar el sistema de confirmación (al paciente) y de notificación (al psicólogo) **sin comprar ningún dominio**. Dos opciones recomendadas:

---

## Opción 1: Gmail (recomendada para empezar)

No necesitas dominio. Usas una cuenta de Gmail como remitente (ej. una cuenta solo para este proyecto).

### Pasos

1. **Crea una cuenta Gmail** (o usa una existente), por ejemplo: `tureservas.psicologos@gmail.com`.

2. **Activa verificación en 2 pasos** en esa cuenta:
   - Google → Cuenta → Seguridad → Verificación en 2 pasos → Activar.

3. **Genera una contraseña de aplicación**:
   - Google → Cuenta → Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones.
   - Crear → Nombre: "Reservas Railway" → Copiar la contraseña de 16 caracteres.

4. **En Railway** (o en tu `.env` local), configura estas variables:

   | Variable     | Valor |
   |-------------|--------|
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_SECURE` | `false` |
   | `SMTP_USER` | `tureservas.psicologos@gmail.com` |
   | `SMTP_PASS` | La contraseña de aplicación de 16 caracteres |
   | `EMAIL_FROM` | Mismo que `SMTP_USER` (Gmail exige que el remitente sea la cuenta con la que te autenticas). Si pones otro, Gmail puede rechazar el envío. |

5. **En el dashboard** del psicólogo, el **Email del negocio** debe ser el correo donde quieras recibir la notificación de nuevas reservas (puede ser el mismo Gmail u otro). El **email de prueba** del dashboard se envía a la dirección que tengas en `EMAIL_FROM` (en Railway) si está definida; si no, al email del negocio guardado arriba.

### Ventajas

- Gratis.
- Sin dominio.
- Los correos llegan desde ese Gmail (ej. `tureservas.psicologos@gmail.com`).
- Límite aproximado: 500 envíos/día con cuenta gratuita (suele sobrar para demos y pocos clientes).

### Importante

- **SMTP_PASS** debe ser la **contraseña de aplicación**, no la contraseña normal de la cuenta.
- Si el cliente final quiere que los emails salgan “de su negocio”, puede usar *su* Gmail y poner su email en Configuración del negocio; el sistema ya usa el mismo SMTP para paciente y psicólogo.

---

## Opción 2: Resend (API, sin SMTP)

Servicio de envío por API. Tienen plan gratuito (miles de emails al mes) y permiten enviar desde su dominio sin verificar uno propio.

### Pasos

1. Regístrate en [resend.com](https://resend.com) y obtén una **API Key**.

2. El proyecto actual usa **Nodemailer con SMTP**. Para usar Resend sin dominio tienes dos caminos:
   - **A) Usar SMTP de Resend** (si Resend lo ofrece con su dominio): configurar en Railway las variables SMTP que te den ellos (host, port, user, pass) y `EMAIL_FROM` con el remitente que te asignen.
   - **B) Cambiar a la API de Resend** (requiere tocar código): instalar `resend`, sustituir en `utils/email.js` el envío por Nodemailer por llamadas a la API de Resend usando la API Key. El “from” puede ser algo como `onboarding@resend.dev` o el que permitan sin verificar dominio.

Para no cambiar código ahora, la opción más simple sin dominio sigue siendo **Gmail (Opción 1)**.

---

## Resumen

| Opción | Dominio | Coste | Dificultad |
|--------|--------|--------|------------|
| **Gmail** | No hace falta | Gratis | Baja (solo variables de entorno) |
| Resend (API) | No obligatorio | Plan gratis | Media (cambio de código si usas API) |

Recomendación: **usar Gmail** con una cuenta dedicada y contraseña de aplicación. Cuando más adelante tengas dominio (o el cliente el suyo), puedes cambiar a ese dominio y SMTP manteniendo el mismo flujo (confirmación al paciente + notificación al psicólogo).
