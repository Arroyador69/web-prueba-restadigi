# Demo pública Restadigi (sin login)

Con `PUBLIC_DEMO=true` en Vercel:

| URL | Qué es |
|-----|--------|
| `/` | Landing de muestra + chatbot de reserva de mesa |
| `/dashboard` | Panel completo **sin usuario ni contraseña** |
| `/demos` | Sigue existiendo (equipo interno), no es la home |

## Qué hacer en Vercel

1. Environment Variables → Production:
   - `PUBLIC_DEMO=true`
   - `DATABASE_URL` (Neon)
   - `SESSION_SECRET`
   - `APP_URL=https://web-prueba-restadigi.vercel.app`
   - Opcional: `OPENAI_API_KEY` para el chat con GPT (si no, usa flujo guiado)
2. Quitar o ignorar `MULTI_TENANT_HOME=demos` (con PUBLIC_DEMO la home es la landing).
3. Redeploy.

## Comportamiento

- Sin login / sin crear demos por cliente.
- Banner claro de **demostración pública**.
- Colores, landing, citas, clientes, etc. editables y guardados en Neon.
- Botón **Restablecer demo** limpia datos de muestra.
- Correos y SMS reales **desactivados** en este modo.
- Idiomas: ES / EN / FI.

## Enlaces a enviar al cliente

- Landing: `https://web-prueba-restadigi.vercel.app/`
- Panel: `https://web-prueba-restadigi.vercel.app/dashboard`
