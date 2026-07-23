# Demo pública Restadigi (dashboard oficial + landing)

El deploy de Vercel usa **`restadigi-demo/`** (dashboard real de Restadigi).

| URL | Qué |
|-----|-----|
| `/` | Landing demo (formulario + chat reserva mesa) |
| `/dashboard` | Panel oficial **sin login** |

## Variables Vercel (Production)

Obligatorias:
- `PUBLIC_DEMO=true`
- `DATABASE_URL` (Neon)
- `SESSION_SECRET` (≥16 caracteres)

Opcional (próxima iteración):
- `OPENAI_API_KEY` — chatbot con GPT
- `OPENAI_MODEL=gpt-4o-mini`

## Base de datos

El schema de Restadigi es distinto al antiguo Alpine. Tras el primer deploy:

```bash
cd restadigi-demo && DATABASE_URL="..." npm run db:init
```

O ejecuta el SQL de `restadigi-demo/scripts/init-db.sql` en Neon.

## Nota

La app Express antigua (`webs de reservas/`) ya **no** se despliega. El dashboard Alpine se eliminó.
