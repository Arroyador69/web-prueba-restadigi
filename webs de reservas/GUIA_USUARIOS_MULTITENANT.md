# Guía: base de datos + usuarios multi-tenant

## 1. Base de datos (Neon)

No hace falta ejecutar SQL a mano para el arranque normal: la app **crea tablas y migraciones sola** al primer request si `DATABASE_URL` está bien.

### Crear la BD

1. Entra en [https://console.neon.tech](https://console.neon.tech)
2. **New Project** → nombre libre (ej. `reservas-psicologos`)
3. Copia la connection string (**Connection string** → URI), algo como:
   ```
   postgresql://usuario:password@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Pégala en Vercel como variable `DATABASE_URL`

### Si quieres ver / comprobar tablas en Neon

SQL Editor de Neon → puedes listar:

```sql
SELECT id, nombre, slug, email, is_demo FROM negocio ORDER BY id;
SELECT id, email, name, negocio_id FROM users ORDER BY id;
SELECT negocio_id, COUNT(*) AS citas FROM citas GROUP BY negocio_id;
```

Las tablas principales las crea la app: `negocio`, `users`, `pacientes`, `citas`, `opening_hours`, `landing_page`, `textos_legales`, `session`, etc.

---

## 2. Variables en Vercel (mínimo)

| Variable | Ejemplo | Para qué |
|----------|---------|----------|
| `DATABASE_URL` | URI de Neon | Postgres |
| `SESSION_SECRET` | 64 hex aleatorios | Cookies login |
| `DEMO_ADMIN_SECRET` | clave del equipo ventas | Entrar a `/demos` |
| `APP_URL` | `https://tu-app.vercel.app` | Enlaces absolutos |
| `MULTI_TENANT_HOME` | `demos` | `/` → panel demos |
| `RESEND_API_KEY` | `re_...` | Emails (recomendado) |
| `EMAIL_FROM` | `Reservas <onboarding@resend.dev>` | Remitente |

Root Directory del proyecto Vercel: **vacío / `.`** (usa el `vercel.json` de la raíz).
No uses Root Directory = `webs de reservas` salvo que sepas lo que haces.

---

## 3. Crear tenant + usuario (flujo correcto)

### A) Durante la llamada → solo demo (sin login aún)

1. Abre `https://tu-app.vercel.app/demos`
2. Introduce `DEMO_ADMIN_SECRET`
3. **Nueva demo**: nombre + email del psicólogo
4. Copia el enlace `/d/slug-xxxx` y envíaselo por WhatsApp
5. Él reserva; los datos quedan **solo** en ese negocio

### B) Darle acceso al dashboard (tú eliges email y contraseña)

En la misma pantalla `/demos`, en esa demo → **Activar usuario**:

- **Nombre**: el del psicólogo
- **Email login**: el que tú quieras (normalmente el suyo)
- **Contraseña temporal**: la que **tú inventes** (mín. 6 caracteres)

Eso crea (o actualiza) una fila en `users` con:

- `email` + `password` (hash bcrypt)
- `negocio_id` = el de esa demo

Él entra en:

- URL: `https://tu-app.vercel.app/login`
- Usuario: ese email
- Contraseña: la que tú le diste

Y **solo ve** pacientes/citas/landing de su `negocio_id`.

### C) Primer admin (opcional, BD vacía)

Si aún no hay ningún usuario en toda la app:

1. `https://tu-app.vercel.app/setup`
2. Crea el primer usuario (queda ligado al negocio `principal` id=1)

Eso no sustituye el flujo de demos; es solo bootstrap.

---

## 4. Crear usuario a mano por SQL (opcional)

Solo si necesitas forzar un acceso sin pasar por `/demos`.

La contraseña **no** se guarda en claro: hay que hashearla con bcrypt.

Desde un entorno con Node y el paquete `bcryptjs`:

```bash
cd "webs de reservas"
node -e "require('bcryptjs').hash('TuPassword123', 10).then(console.log)"
```

Luego en Neon SQL Editor (ajusta `negocio_id` al id real del tenant):

```sql
-- Ver negocios / slugs
SELECT id, nombre, slug, email FROM negocio ORDER BY id DESC LIMIT 20;

-- Crear usuario ligado a un negocio concreto (ej. id = 5)
INSERT INTO users (email, password, name, negocio_id)
VALUES (
  'maria@ejemplo.com',
  '$2a$10$PEGAR_AQUI_EL_HASH_BCRYPT',
  'María López',
  5
);
```

Login: `/login` con ese email y la contraseña en claro que usaste al generar el hash.

---

## 5. Checklist “está bien aislado”

1. Creas dos demos distintas → dos URLs `/d/...` distintas  
2. Reservas en la A → no aparecen en el dashboard del usuario de la B  
3. Usuario de A solo ve negocio A tras login  

Si algo falla: mira en Neon `users.negocio_id` y `citas.negocio_id`.
