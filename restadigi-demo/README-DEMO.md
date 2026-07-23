# Demo pública Restadigi — variables y push listos

## Vercel
1. Root Directory: vacío (`.`) — el build copia Nitro a `.vercel/output` en la raíz
2. Variables Production:
   - `PUBLIC_DEMO=true`
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - (próxima vez) `OPENAI_API_KEY`
3. Redeploy tras el push

**Importante:** no pongas `outputDirectory` a una carpeta estática; Nitro usa Build Output API.

## Neon (schema Restadigi)
En SQL Editor pega/ejecuta `restadigi-demo/scripts/init-db.sql`
o localmente:
`cd restadigi-demo && DATABASE_URL="..." npm run db:init`

## URLs
- Landing: https://web-prueba-restadigi.vercel.app/
- Dashboard: https://web-prueba-restadigi.vercel.app/dashboard
