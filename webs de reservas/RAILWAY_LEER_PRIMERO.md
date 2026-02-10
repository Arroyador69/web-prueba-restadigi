# ⚠️ Railway: configurar para que el deploy no falle

Railway bloquea el deploy por **Next.js vulnerable** porque está usando un `package-lock.json` de la raíz del repo (esta app es **Express**, no usa Next). Hay que decirle que use solo la carpeta de esta app.

---

## 1. Root Directory (obligatorio)

1. **Railway** → proyecto → servicio **web**.
2. Pestaña **Settings**.
3. En la sección **Source** (donde ves el repo conectado y "CI/CD Root necessary"):
   - Busca el campo **Root Directory** o **Root** o **CI/CD Root**.
   - Escribe exactamente: **`webs de reservas`**  
     (con espacio, sin `/` al final.)
4. Guarda los cambios. Railway hará un nuevo deploy usando solo esa carpeta y el error de Next.js desaparecerá.

Si no ves ese campo, puede estar más abajo en Source o con otro nombre parecido; es el que indica “desde qué carpeta del repo se construye”.

---

## 2. Rollouts / “Wait for CI” (opcional)

En **Settings** → **Source** tienes **Rollouts** con “Wait for CI” activado: Railway solo despliega cuando **todas** las GitHub Actions terminan bien.

- Si quieres que Railway despliegue **en cuanto hagas push**, sin depender de que pasen los workflows: cambia a **“Don’t wait for CI”** (o la opción que no espere a GitHub Actions).
- Si prefieres que solo se despliegue cuando CI pase: déjalo en “Wait for CI” (ya hemos ajustado el workflow para que pase).

---

## Resumen

| Dónde        | Qué poner / hacer                          |
|-------------|---------------------------------------------|
| Source      | **Root Directory** = `webs de reservas`    |
| Rollouts    | Opcional: “Don’t wait for CI” si lo prefieres |

Cuando **Root Directory** esté en `webs de reservas`, el build usará el `package-lock.json` de esta app (sin Next) y el aviso de vulnerabilidades no debería volver a salir.
