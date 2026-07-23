# Demo pública Restadigi — variables y push listos

## Vercel
1. Root Directory: dejar vacío (`.`) — el `vercel.json` construye `restadigi-demo/`
2. Variables Production:
   - `PUBLIC_DEMO=true`
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - (próxima vez) `OPENAI_API_KEY`
3. Redeploy tras el push

## Neon (schema Restadigi)
En SQL Editor pega/ejecuta `restadigi-demo/scripts/init-db.sql`
o localmente:
`cd restadigi-demo && DATABASE_URL="..." npm run db:init`

## URLs
- Landing: https://web-prueba-restadigi.vercel.app/
- Dashboard: https://web-prueba-restadigi.vercel.app/dashboard
