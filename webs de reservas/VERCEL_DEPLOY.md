# Despliegue en Vercel (multi-tenant)

Este sistema vive en la carpeta `webs de reservas` del repo. **Una sola app en Vercel + Neon Postgres** sirve a todos los psicólogos/demos sin mezclar datos.

## Flujo comercial (llamadas)

1. Entras a `/demos` con `DEMO_ADMIN_SECRET`.
2. Creas demo: nombre + email del psicólogo → obtienes `https://tu-app.vercel.app/d/maria-lopez-a3f2`.
3. Se lo envías por WhatsApp; reserva desde el móvil.
4. Sus pacientes/citas viven solo en ese `negocio_id` (slug).
5. Si compra: **Activar usuario** con su email → entra en `/login` y ve solo su dashboard.

No hace falta un proyecto Railway por cliente.

## Por qué Vercel + Neon (no SQLite)

Vercel es serverless: el disco no persiste. Usamos **PostgreSQL** (`DATABASE_URL`) con aislamiento por `negocio_id` + `slug`.

## Pasos de despliegue

### 1. Neon (o Vercel Postgres)

1. Crea proyecto en [neon.tech](https://neon.tech) (gratis).
2. Copia la connection string (`DATABASE_URL`).

### 2. Proyecto en Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → importa  
   `Arroyador69/web-prueba-restadigi`
2. **Root Directory**: déjalo vacío / `.` (la raíz). El `vercel.json` de la raíz monta la app.
3. Framework: Other. Build: `npm run build`.
4. Variables de entorno:

```
DATABASE_URL=postgresql://...@...neon.tech/neondb?sslmode=require
SESSION_SECRET=genera-32-bytes-hex
DEMO_ADMIN_SECRET=clave-equipo-ventas
CRON_SECRET=otra-clave-cron
APP_URL=https://tu-proyecto.vercel.app
MULTI_TENANT_HOME=demos
NODE_ENV=production

# Email (recomendado Resend en Vercel; SMTP a veces falla en serverless)
RESEND_API_KEY=re_...
EMAIL_FROM=Reservas <onboarding@resend.dev>
```

Generar secretos:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Deploy. Abre `/demos`, crea una demo, prueba reserva en el enlace `/d/...`.
6. Primer admin global (opcional): `/setup` si aún no hay usuarios.

### 3. Crons

`vercel.json` ya define:

- Recordatorios diarios `0 7 * * *` → `/api/cron/reminders`
- Reputación cada 5 min → `/api/cron/reputacion`

En plan Hobby los crons diarios bastan; el de 5 min puede requerir plan Pro.

## URLs útiles

| URL | Uso |
|-----|-----|
| `/demos` | Panel ventas: crear tenants y activar usuarios |
| `/d/:slug` | Landing + reserva de ese psicólogo (aislada) |
| `/login` | Dashboard del psicólogo (solo su `negocio_id`) |
| `/setup` | Primer usuario si BD vacía |

## Aislamiento de datos

- Cada demo = fila en `negocio` con `slug` único.
- `pacientes`, `citas`, `landing_page`, `opening_hours`, `users` llevan `negocio_id`.
- El dashboard filtra siempre por `req.session.negocioId`.
- La landing pública resuelve el tenant por `?tenant=` / path `/d/:slug`.

## Local

```bash
cd "webs de reservas"
cp .env.example .env   # pon DATABASE_URL de Neon
npm install --omit=optional
npm start
```

## Railway

Se puede seguir usando Railway con `DATABASE_URL`, pero el flujo recomendado para demos masivos (~100/día) es **un solo deploy Vercel**.
