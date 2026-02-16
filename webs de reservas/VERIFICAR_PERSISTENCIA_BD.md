# Verificar que la base de datos persista (usuarios no se borran)

Si cada vez que pasa un tiempo (o cada push/deploy) tienes que volver a crear el usuario, la BD **no** está usando el volumen. Sigue esta lista y revisa los logs.

---

## Por qué se borra todo en cada deploy

- En cada deploy Railway arranca un **contenedor nuevo**. Todo lo que la app escribe en el disco “normal” del contenedor (por ejemplo `./database.db` o `/app/database.db`) **se pierde** cuando ese contenedor desaparece.
- La **única** forma de que los datos sobrevivan es escribir el fichero de la base de datos **dentro del path donde está montado el Volume**. Ese path lo eliges tú al crear el volumen en Railway (p. ej. `/data` o `/app/data`).
- Si tienes Volume pero **`DATABASE_PATH` no apunta a ese path**, la app sigue escribiendo en el disco del contenedor y los datos se borran en cada deploy. Por eso es **crítico** que **`DATABASE_PATH` = &lt;Mount Path del volumen&gt;/database.db** (el mismo path que ves en la configuración del volumen).

---

## 1. Comprobar en Railway

### Volumen

- En el proyecto, en la vista donde ves el servicio **web**, debe aparecer un recurso **Volume** (no "Database").
- Ese volumen debe estar **conectado al servicio web**.
- Anota el **Mount Path** del volumen (en Railway lo ves en la configuración del volumen; a veces es `/data`, `/app/data`, etc.).

Si no hay volumen, o está en otro servicio, la app escribe en el disco efímero y los datos se pierden en cada deploy.

### Variable de entorno (tiene que coincidir con el volumen)

- Servicio **web** → **Variables**.
- Debe existir **`DATABASE_PATH`** y su valor **tiene que ser exactamente** el Mount Path del volumen + **`/database.db`**.
  - Si el Mount Path del volumen es **`/app/data`** → **`DATABASE_PATH`** = **`/app/data/database.db`**.
  - Si el Mount Path es **`/data`** → **`DATABASE_PATH`** = **`/data/database.db`**.
  - Sin espacios, sin barra final, tal cual.

Si `DATABASE_PATH` apunta a otra ruta (por ejemplo `/app/database.db` cuando el volumen está en `/data`), el fichero se crea **fuera** del volumen y se pierde en cada deploy.

### Una sola réplica

- En **Settings** del servicio web, revisa si hay opción de **replicas** o **instances**.
- Debe ser **1**. Con más de una, cada una puede tener su propia copia del volumen o una sin volumen, y los usuarios creados en una no aparecen en la otra.

---

## 2. Qué ver en los logs al arrancar

Después de cada deploy, en **Railway** → **web** → **Deployments** → último deploy → **View Logs**, al iniciar la app deberías ver algo como:

```
📂 Archivo BD al arrancar: ya existía (volumen persistió)
💾 Base de datos: /app/data/database.db (persistente)
   RAILWAY_VOLUME_MOUNT_PATH = /app/data   (si Railway lo inyecta)
✅ Base de datos inicializada correctamente
🚀 Servidor iniciado en puerto XXXX
👥 Usuarios en BD: 1
```

- **📂 Archivo BD al arrancar:** Si dice **"ya existía (volumen persistió)"** en el *segundo* deploy después de crear un usuario → el volumen está persistiendo. Si siempre dice **"nuevo"** en cada deploy → el archivo no está en el volumen (path equivocado o volumen no persiste).
- Si ves **(persistente)** → la app cree estar usando el volumen; si además siempre "nuevo" y Usuarios en BD: 0, prueba la opción B más abajo.
- Si ves **(NO PERSISTENTE)** y el aviso de "Los datos se perderán en cada deploy" → falta volumen o `DATABASE_PATH`; los usuarios se borrarán.
- **Usuarios en BD: 0** después de haber creado uno → la BD que está usando no es la del volumen (o es otra instancia). Revisa volumen y variable.
- **Usuarios en BD: 1** (o más) → la BD persistente tiene usuarios; no deberías tener que volver a crearlos.

---

## 3. Si sigue fallando (persistente + Usuarios en BD: 0 en cada deploy)

### Opción A – Revisar path y variable

1. En Railway, abre el **Volume** asociado al servicio **web** y anota el **Mount Path** (p. ej. `/app/data` o `/data`).
2. En **Variables** del servicio **web**, pon **`DATABASE_PATH`** = **&lt;Mount Path&gt;/database.db** (ej. `/app/data/database.db` o `/data/database.db`). Debe ser **exactamente** ese path, sin otra ruta.
3. Si lo prefieres, puedes **recrear el volumen** vinculado al servicio **web** con Mount Path **`/app/data`** y entonces **`DATABASE_PATH`** = **`/app/data/database.db`**.
4. **Redeploy** (push o "Redeploy" en Railway).
5. En los logs confirma que salga **Base de datos: &lt;ruta&gt; (persistente)** y, la primera vez, **Usuarios en BD: 0**.
6. Crea el usuario **una vez** en **/setup**. En el siguiente deploy, en los logs debería salir **📂 Archivo BD al arrancar: ya existía** y **Usuarios en BD: 1**.

### Opción B – Dejar que Railway ponga la ruta (recomendada si A no funciona)

A veces Railway monta el volumen en un path que no coincide con el que pusiste en la UI. La app puede usar la variable que Railway inyecta:

1. En **Variables** del servicio **web**, **borra** la variable **`DATABASE_PATH`** (o coméntala).
2. Deja el **Volume** como está. Railway inyecta **`RAILWAY_VOLUME_MOUNT_PATH`** con el path real del volumen; la app usará esa ruta + `database.db`.
3. **Redeploy**. En los logs deberías ver **RAILWAY_VOLUME_MOUNT_PATH = &lt;ruta&gt;**; esa es la ruta donde se guarda la BD.
4. Crea el usuario en **/setup**, haz otro deploy y comprueba que salga **Archivo BD al arrancar: ya existía** y **Usuarios en BD: 1**.

### Permisos

Si el archivo nunca aparece o hay errores de escritura, en **Variables** añade **`RAILWAY_RUN_UID=0`** para que el contenedor pueda escribir en el volumen.

---

Si en los logs sigue saliendo **(NO PERSISTENTE)** o **Usuarios en BD: 0** después de crear usuario, el volumen no está llegando al servicio o el path no coincide: revisa que el volumen esté asignado al servicio **web** y, si usas `DATABASE_PATH`, que sea exactamente &lt;Mount Path&gt;/database.db.
