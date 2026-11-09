# Sistema Integral de Gestión — Six Seven Transmisiones

Plataforma web con acceso por perfil para gestionar la agenda de transmisiones, el inventario de equipos, el personal, los auspiciadores y las finanzas por evento de **Six Seven Transmisiones**.

Esta guía explica cómo levantar el proyecto en tu computador, qué significa cada variable de configuración y cómo correr las pruebas.

**Contenido:** [Estado actual](#estado-actual) · [Requisitos](#requisitos) · [Puesta en marcha](#puesta-en-marcha) · [Variables de entorno](#variables-de-entorno) · [Cuentas de ejemplo](#cuentas-de-ejemplo) · [Pruebas](#pruebas) · [Comandos](#comandos) · [Base de datos](#trabajar-con-la-base-de-datos) · [API](#api-disponible) · [Estructura](#estructura-del-proyecto) · [Ramas](#trabajo-con-ramas) · [Problemas frecuentes](#problemas-frecuentes)

## Estado actual

| Área | Estado |
| :--- | :--- |
| Inicio de sesión y permisos por perfil | Funcionando |
| Modelo de datos de cotizaciones y agenda | Tablas y reglas creadas; aún sin endpoints ni pantalla |
| Páginas de los módulos | En construcción |
| Administración de cuentas | Pendiente: por ahora las cuentas se crean con los datos de ejemplo |

**Tecnologías:** React 18, Vite 5 y Ant Design 6 en el cliente; Node.js, Express 4 y Prisma 5 en el servidor; PostgreSQL como base de datos.

## Requisitos

| Programa | Versión | Para comprobarlo |
| :--- | :--- | :--- |
| [Node.js](https://nodejs.org/) | 20.10 o superior; probado con la 24 | `node -v` |
| [PostgreSQL](https://www.postgresql.org/download/) | Probado con la 16 | `psql --version` |
| [Git](https://git-scm.com/) | Cualquier versión reciente | `git --version` |

## Puesta en marcha

Los comandos son para Linux o macOS. En Windows, usa `copy` en vez de `cp` y abre PostgreSQL con `psql -U postgres`.

### 1. Clonar el repositorio

```bash
git clone git@github.com:Als-Val/Proyecto-Six-Seven-Transmisiones---ISW-2026.git
cd Proyecto-Six-Seven-Transmisiones---ISW-2026
git switch dev
```

El desarrollo se integra en `dev`, no en `main`.

### 2. Crear las bases de datos

Se usan dos bases: una para desarrollar y otra para las pruebas, que borran todos sus datos.

Abre PostgreSQL como administrador:

```bash
sudo -u postgres psql
```

Ejecuta lo siguiente, con una contraseña elegida por ti, y cierra con `\q`:

```sql
CREATE USER sixseven WITH PASSWORD 'elige-una-clave' CREATEDB;
CREATE DATABASE sixseven_dev OWNER sixseven;
CREATE DATABASE sixseven_test OWNER sixseven;
```

`CREATEDB` no es opcional: `prisma migrate dev` crea una base temporal para validar las migraciones.

### 3. Configurar el servidor

```bash
cp server/.env.example server/.env
```

Genera un valor para `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Completa `server/.env`. La [tabla de variables](#variables-de-entorno) explica cada una:

```dotenv
DATABASE_URL="postgresql://sixseven:elige-una-clave@localhost:5432/sixseven_dev?schema=public"
PORT=3000
JWT_SECRET=pega-aqui-el-valor-generado
JWT_EXPIRES_IN=8h
SEED_PASSWORD=elige-una-clave-para-las-cuentas-de-ejemplo
TEST_DATABASE_URL="postgresql://sixseven:elige-una-clave@localhost:5432/sixseven_test?schema=public"
```

### 4. Configurar el cliente

```bash
cp client/.env.example client/.env
```

El valor que trae, `VITE_API_URL=/api`, sirve tal cual para desarrollar.

### 5. Instalar y preparar el servidor

```bash
cd server
npm install
npx prisma migrate dev
npx prisma db seed
cd ..
```

- `npm install` instala las dependencias.
- `npx prisma migrate dev` crea las tablas y reglas en `sixseven_dev`, y genera el cliente de Prisma.
- `npx prisma db seed` carga las cuentas y los datos de ejemplo.

### 6. Instalar el cliente

```bash
cd client
npm install
cd ..
```

### 7. Levantar la aplicación

Necesitas dos terminales abiertas:

```bash
# Terminal 1: API en http://localhost:3000
cd server
npm run dev
```

```bash
# Terminal 2: aplicación en http://localhost:5173
cd client
npm run dev
```

### 8. Comprobar que funciona

1. Abre <http://localhost:3000/api/health>. Debe responder con `"status":"ok"`.
2. Abre <http://localhost:5173>. Debe aparecer la pantalla de inicio de sesión.
3. Entra con una de las [cuentas de ejemplo](#cuentas-de-ejemplo).
4. Comprueba que el menú corresponda al perfil y que **Cerrar sesión** te devuelva al inicio de sesión.

## Variables de entorno

Los archivos `.env` contienen credenciales: Git los ignora y **nunca deben subirse al repositorio**. Si agregas una variable nueva, documéntala también en el `.env.example` correspondiente y en esta tabla.

### `server/.env`

| Variable | Obligatoria | Qué significa | Ejemplo |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Sí | Conexión a la base de datos de desarrollo | `postgresql://sixseven:clave@localhost:5432/sixseven_dev?schema=public` |
| `PORT` | No | Puerto de la API. Si queda vacío, usa el 3000 | `3000` |
| `JWT_SECRET` | Sí | Clave privada que firma las sesiones. Sin ella, el servidor no arranca. Si cambia, todas las sesiones abiertas dejan de valer | 96 caracteres generados con el comando del paso 3 |
| `JWT_EXPIRES_IN` | No | Duración de una sesión. Si queda vacío, dura 8 horas | `8h`, `30m` |
| `SEED_PASSWORD` | Solo para el seed | Contraseña de las cuentas de ejemplo. Se aplica solo al crearlas: cambiarla no modifica las que ya existen | Una clave a tu elección |
| `TEST_DATABASE_URL` | Solo para `npm test` | Conexión a la base de pruebas, **cuyos datos se borran**. Su nombre debe contener `test` | `postgresql://sixseven:clave@localhost:5432/sixseven_test?schema=public` |

**Partes de una URL de conexión:**

```text
postgresql://sixseven:clave@localhost:5432/sixseven_dev?schema=public
             │        │     │         │    │            │
             usuario  clave servidor  puerto base       esquema
```

Si la contraseña tiene caracteres especiales, como `@`, `:`, `/` o `#`, debes [codificarlos](https://www.prisma.io/docs/orm/reference/connection-urls#special-characters). Por ejemplo, `@` se escribe `%40`. Es más simple usar solo letras, números y guiones.

**Si cambias `PORT`,** cambia también `target` en `client/vite.config.js`, que apunta al puerto 3000.

### `client/.env`

| Variable | Obligatoria | Qué significa | Valor |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Sí | Dirección base de la API. En desarrollo es una ruta relativa, que Vite redirige al servidor | `/api` |

Vite lee este archivo al arrancar: si lo cambias, reinicia `npm run dev`. Su valor queda visible en el navegador, así que aquí no debe ir ninguna clave.

## Cuentas de ejemplo

Las crea `npx prisma db seed`. Todas usan la contraseña que definiste en `SEED_PASSWORD`.

| Correo | Perfil | Módulos del menú |
| :--- | :--- | :--- |
| `dueno@sixseven.cl` | Dueño | Agenda, Personal, Inventario, Auspicios y Finanzas |
| `contador@sixseven.cl` | Contador | Agenda, Auspicios y Finanzas |
| `jefetecnico@sixseven.cl` | Jefe Técnico | Agenda e Inventario |

Inicio aparece para los tres perfiles. Los módulos de cada perfil se definen en `server/src/services/permisos.service.js`.

El seed también carga catálogos, una tarifa y 17 transmisiones de ejemplo. Se puede ejecutar más de una vez sin duplicar datos: si ya hay transmisiones, no vuelve a crearlas.

## Pruebas

Necesitas `TEST_DATABASE_URL` en `server/.env` y que esa base exista.

```bash
cd server
npm test
```

El comando aplica las migraciones a la base de pruebas y luego ejecuta `server/tests/`:

| Archivo | Qué comprueba |
| :--- | :--- |
| `auth.test.js` | Inicio de sesión, tokens, cuentas desactivadas, permisos y formato de los errores |
| `modelo-agenda.test.js` | Reglas de la base de datos: garantía, transiciones de estado, historial e inmutabilidad |

Al final debe mostrar `fail 0`. Durante las pruebas, se borran todos los datos de la base de `TEST_DATABASE_URL`, pero nunca los de `DATABASE_URL`. Si esa variable falta o el nombre de la base no contiene `test`, las pruebas se detienen sin tocar ninguna base.

Para agregar una prueba, crea un archivo `*.test.js` en `server/tests/`. Importa primero `./helpers/base`, que prepara el entorno y ofrece funciones para crear datos.

El cliente todavía no tiene pruebas automáticas. Para comprobar que compila:

```bash
cd client
npm run build
```

## Comandos

**En `server/`:**

| Comando | Qué hace |
| :--- | :--- |
| `npm run dev` | Levanta la API y la reinicia al guardar cambios |
| `npm start` | Levanta la API sin reinicio automático |
| `npm test` | Ejecuta las pruebas sobre la base de pruebas |
| `npx prisma migrate dev` | Aplica las migraciones pendientes y detecta cambios en el esquema |
| `npx prisma db seed` | Carga los datos de ejemplo |
| `npx prisma studio` | Abre un explorador visual de la base de datos |
| `npx prisma migrate reset` | **Borra** la base de desarrollo, y la recrea con sus datos de ejemplo |

**En `client/`:**

| Comando | Qué hace |
| :--- | :--- |
| `npm run dev` | Levanta la aplicación en el puerto 5173 |
| `npm run build` | Compila la aplicación en `client/dist/` |
| `npm run preview` | Sirve localmente la versión compilada |

`npm run lint` todavía no funciona, porque ESLint no está instalado en el proyecto.

## Trabajar con la base de datos

El modelo se define en `server/prisma/schema.prisma`. Para cambiarlo:

1. Actualiza tu rama con `dev`, para que tu migración quede encima de las de los demás.
2. Edita `schema.prisma`.
3. Crea la migración con un nombre descriptivo:

   ```bash
   cd server
   npx prisma migrate dev --name agrega_equipos_y_kits
   ```

4. Haz commit de `schema.prisma` y de la carpeta nueva en `prisma/migrations/`.

**Reglas:**

- No edites una migración que ya está en `dev`: crea una nueva.
- Si necesitas `CHECK` o triggers, que Prisma no genera, crea la migración con `--create-only`, agrega el SQL al archivo y aplícala con `npx prisma migrate dev`.
- No uses `prisma db push`: cambia la base sin dejar una migración para el resto del equipo.

**Reglas que protege la base de datos.** Algunas operaciones se rechazan aunque el código intente hacerlas:

- `cobros`, `tarifas` y `historial_transmisiones` no admiten `UPDATE` ni `DELETE`.
- Una transmisión de más de 5 horas no se autoriza sin su garantía completa, y esa garantía debe registrarse por el monto exacto que falta.
- Un cambio de estado debe seguir el ciclo de vida permitido y escribir su fila en el historial dentro de la misma transacción.

## API disponible

Todas las rutas parten de `/api`.

| Método y ruta | Sesión | Qué hace |
| :--- | :--- | :--- |
| `GET /health` | No | Indica si la API responde |
| `POST /auth/login` | No | Recibe `email` y `password`; entrega `token` y `usuario` |
| `GET /auth/me` | Sí | Entrega el usuario de la sesión y sus módulos |

Las rutas con sesión requieren este encabezado:

```text
Authorization: Bearer <token>
```

Para probar el inicio de sesión desde la terminal:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dueno@sixseven.cl","password":"TU_SEED_PASSWORD"}'
```

Todos los errores tienen la misma forma. `detalle` aparece solo si hay errores por campo:

```json
{
  "error": {
    "codigo": "VALIDACION",
    "mensaje": "Revisa los datos ingresados",
    "detalle": { "email": "Ingresa un correo válido" }
  }
}
```

**Para proteger una ruta nueva,** usa los middlewares de `server/src/middlewares/auth.js`:

```js
router.post('/ruta', autenticar, requierePerfil('DUENO', 'CONTADOR'), controlador);
```

Ocultar una opción del menú no protege los datos: cada endpoint debe validar el perfil.

## Estructura del proyecto

```text
client/src/
├── components/ui/     Barra lateral, layout y componentes comunes
├── context/           Sesión del usuario (AuthContext)
├── pages/             Una página por ruta
├── services/api.js    Llamadas a la API, con token y manejo de errores
└── App.jsx            Rutas de la aplicación

server/
├── index.js           Arranque del servidor
├── prisma/            Modelo, migraciones y datos de ejemplo
├── scripts/           Preparación de la base de pruebas
├── tests/             Pruebas automáticas
└── src/
    ├── routes/        Define cada endpoint y sus permisos
    ├── controllers/   Traduce entre HTTP y los servicios
    ├── services/      Reglas de negocio
    ├── schemas/       Validación de datos con Zod
    ├── middlewares/   Autenticación, validación y errores
    └── config/        Conexión única de Prisma
```

## Trabajo con ramas

1. Crea tu rama desde `dev` actualizado:

   ```bash
   git switch dev
   git pull
   git switch -c feat/nombre-de-la-funcionalidad
   ```

2. Agrega archivos por su nombre, y evita `git add .`.
3. Antes de abrir el PR, incorpora lo último de `dev` y prueba:

   ```bash
   git fetch origin
   git merge origin/dev
   cd server && npm test
   ```

4. Abre el PR hacia `dev`.

Después de traer cambios de `dev`, ejecuta `npm install` en `server/` y `client/`, y `npx prisma migrate dev` en `server/`. Revisa también si `.env.example` trae variables nuevas.

## Problemas frecuentes

| Mensaje o síntoma | Causa | Solución |
| :--- | :--- | :--- |
| `Falta JWT_SECRET en server/.env` | La variable no existe o está vacía | Genera una con el comando del paso 3 |
| `VITE_API_URL no esta definida` | Falta `client/.env` | Créalo con el paso 4 y reinicia el cliente |
| `P1000: Authentication failed` | Usuario o contraseña incorrectos en la URL | Revisa `DATABASE_URL` |
| `P1001: Can't reach database server` | PostgreSQL está detenido, o el servidor o el puerto están mal | Inicia PostgreSQL y revisa la URL |
| `P3014` o `permission denied to create database` | El usuario no tiene `CREATEDB` | Ejecuta `ALTER USER sixseven CREATEDB;` como administrador |
| `Drift detected` o Prisma pide reiniciar la base | Tu base no coincide con las migraciones | Si no necesitas sus datos, ejecuta `npx prisma migrate reset`, que **los borra** |
| `Define SEED_PASSWORD` | Falta esa variable | Agrégala a `server/.env` |
| `Define TEST_DATABASE_URL` | Falta esa variable, o el nombre de la base no contiene `test` | Revisa `server/.env` |
| «No se pudo completar la solicitud» al iniciar sesión | La API no está corriendo o no responde en el puerto 3000 | Levanta `npm run dev` en `server/` y revisa esa terminal |
| «El correo o la contraseña son incorrectos» con una cuenta de ejemplo | No se cargó el seed, o la cuenta se creó con otra `SEED_PASSWORD` | Ejecuta el seed o, si no necesitas los datos, `npx prisma migrate reset` |
| `EADDRINUSE` | El puerto ya está ocupado | Cierra el otro proceso o cambia `PORT` |

## Equipo

- Danae Acosta
- Javiera Márquez
- Nicolás Montes
- Vicente Palma
- Alonso Valderrama
