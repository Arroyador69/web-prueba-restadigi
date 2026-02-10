# 🚀 Configuración para Vercel - Acceso al Dashboard

## ⚠️ IMPORTANTE: Limitaciones de Vercel

**Vercel es serverless**, lo que significa que:
- ❌ SQLite puede tener problemas porque necesita sistema de archivos persistente
- ❌ Los datos pueden perderse entre invocaciones en el plan gratuito
- ⚠️ **Recomendado**: Usar Railway o Render para esta aplicación

Sin embargo, si ya estás en Vercel, aquí te explico cómo acceder al dashboard.

---

## 📋 Pasos para Acceder al Dashboard

### Paso 1: Crear el Primer Usuario

Tienes **2 opciones**:

#### Opción A: Usar la página de setup (RECOMENDADO)

1. Ve a tu URL de Vercel + `/setup`
   ```
   https://tu-proyecto.vercel.app/setup
   ```

2. Completa el formulario:
   - Nombre completo
   - Email
   - Contraseña (mínimo 6 caracteres)

3. Haz clic en "Crear usuario"

4. Serás redirigido automáticamente al dashboard

#### Opción B: Usar la API directamente

Puedes hacer una petición POST a `/api/setup/first-user`:

```bash
curl -X POST https://tu-proyecto.vercel.app/api/setup/first-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tu Nombre",
    "email": "tu@email.com",
    "password": "tu-contraseña"
  }'
```

**Nota**: Este endpoint solo funciona si NO hay usuarios en la base de datos.

---

### Paso 2: Acceder al Dashboard

Una vez creado el usuario:

1. Ve a: `https://tu-proyecto.vercel.app/dashboard`
   - O ve a: `https://tu-proyecto.vercel.app/login` y luego inicia sesión

2. Inicia sesión con:
   - Email que usaste al crear el usuario
   - Contraseña que configuraste

3. ¡Ya estás en el dashboard! 🎉

---

## 🔐 Funcionalidades del Dashboard

Una vez dentro del dashboard, podrás:

1. **Ver citas** - Ver todas las reservas confirmadas
2. **Configuración** - Cambiar datos del negocio, teléfono, email, duración de citas
3. **Horarios** - Configurar horarios de atención por día de la semana
4. **Bloqueos** - Bloquear horarios específicos (para reservas externas)
5. **Usuarios** - Crear más usuarios del negocio

---

## ⚠️ Problemas Comunes en Vercel

### Problema: Los datos se pierden

**Causa**: Vercel es serverless y SQLite necesita almacenamiento persistente.

**Solución temporal**: 
- Los datos pueden persistir en el plan Pro de Vercel
- O migrar a PostgreSQL (requiere cambios en el código)

**Solución recomendada**: 
- Usar Railway o Render (mejor para SQLite)

### Problema: No puedo crear el primer usuario

**Causa**: Ya existe un usuario en la base de datos.

**Solución**: 
- Ve a `/login` e inicia sesión con las credenciales existentes
- O desde el dashboard (si ya tienes acceso), crea más usuarios desde la pestaña "Usuarios"

### Problema: Error al inicializar base de datos

**Causa**: Vercel puede tener problemas con SQLite en el primer despliegue.

**Solución**: 
- El script `postinstall` en `package.json` debería inicializar la BD automáticamente
- Si no funciona, puedes ejecutar manualmente: `node database/init.js` (pero esto requiere acceso SSH, que Vercel no tiene fácilmente)

---

## 🔄 Migrar a Railway (Recomendado)

Si quieres una solución más estable:

1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno (ver `RAILWAY_SETUP.md`)
4. Despliega

Railway es mejor porque:
- ✅ Soporta SQLite perfectamente
- ✅ Almacenamiento persistente
- ✅ Plan gratuito generoso
- ✅ Más fácil de mantener

---

## 📝 URLs Importantes

- **Landing pública**: `https://tu-proyecto.vercel.app/`
- **Crear primer usuario**: `https://tu-proyecto.vercel.app/setup`
- **Login**: `https://tu-proyecto.vercel.app/login`
- **Dashboard**: `https://tu-proyecto.vercel.app/dashboard`

---

## ✅ Checklist

- [ ] Crear primer usuario en `/setup`
- [ ] Acceder al dashboard en `/dashboard`
- [ ] Configurar datos del negocio
- [ ] Configurar horarios de atención
- [ ] Probar hacer una reserva desde la landing pública
- [ ] Verificar que la reserva aparece en el dashboard

---

**¿Problemas?** Revisa los logs de Vercel en el dashboard de Vercel para ver errores específicos.
