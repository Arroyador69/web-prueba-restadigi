# Plantilla de Reservas para Psicólogos

Sistema **multi-tenant** de reservas para psicólogos. Un solo deploy en **Vercel + Neon Postgres**; cada demo/cliente tiene su URL `/d/:slug` y sus datos no se mezclan.

## Flujo de ventas (llamadas)

1. `/demos` → crear demo (nombre + email) → enlace único.
2. Enviar el enlace al móvil durante la llamada → reservan.
3. Activar usuario con su email → dashboard solo con sus datos.

## Despliegue

**Recomendado: Vercel** — ver [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md).

Railway sigue siendo posible, pero para ~100 demos/día es mejor un solo proyecto Vercel multi-tenant.

## Local

```bash
cp .env.example .env   # DATABASE_URL de Neon
npm install --omit=optional
npm start
```

- Panel demos: `http://localhost:3000/demos`
- Landing tenant: `http://localhost:3000/d/<slug>`
- Dashboard: `http://localhost:3000/dashboard`

## Características

- Landing pública editable + reserva móvil
- CRM pacientes, citas, horarios, bloqueos
- Confirmaciones / recordatorios email
- Facturas PDF, Google Calendar, ReputacionPro (opcional)
- Aislamiento por `negocio_id` + `slug`

## Variables clave

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Postgres (Neon) – obligatorio en Vercel |
| `SESSION_SECRET` | Cookies de sesión |
| `DEMO_ADMIN_SECRET` | Acceso a `/demos` |
| `RESEND_API_KEY` / `EMAIL_FROM` | Emails en serverless |

## Licencia

MIT
