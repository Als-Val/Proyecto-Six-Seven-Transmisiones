const { test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const { prisma, limpiar, crearUsuario } = require('./helpers/base');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = require('../src/app');
const { autenticar, requierePerfil } = require('../src/middlewares/auth');
const { manejadorErrores } = require('../src/middlewares/errores');

let servidor;
let api;

async function pedir(ruta, { token, body, crudo, method } = {}) {
  const res = await fetch(api + ruta, {
    method: method ?? (body !== undefined || crudo !== undefined ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: crudo ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  return { status: res.status, datos: res.status === 204 ? null : await res.json() };
}

const entrar = (email = 'dueno@sixseven.cl', password = 'clave-de-prueba') =>
  pedir('/api/auth/login', { body: { email, password } });

before(async () => {
  // Ruta de ejemplo para probar requierePerfil sin depender de otro módulo.
  const raiz = express();
  raiz.get('/solo-dueno', autenticar, requierePerfil('DUENO'), (_req, res) => res.json({ ok: true }));
  raiz.use(app);
  raiz.use(manejadorErrores);
  await new Promise((listo) => { servidor = raiz.listen(0, listo); });
  api = `http://127.0.0.1:${servidor.address().port}`;
});
beforeEach(limpiar);
after(async () => {
  await new Promise((listo) => servidor.close(listo));
  await prisma.$disconnect();
});

test('el login correcto entrega token y usuario, sin el hash', async () => {
  await crearUsuario();
  const { status, datos } = await entrar();
  assert.equal(status, 200);
  assert.ok(datos.token);
  assert.equal(datos.usuario.perfil, 'DUENO');
  assert.equal('passwordHash' in datos.usuario, false);
});

test('el correo no distingue mayúsculas ni espacios', async () => {
  await crearUsuario();
  assert.equal((await entrar('  DUENO@SixSeven.cl ')).status, 200);
});

test('correo inexistente y contraseña incorrecta responden lo mismo', async () => {
  await crearUsuario();
  const incorrecta = await entrar('dueno@sixseven.cl', 'otra-clave');
  const inexistente = await entrar('nadie@sixseven.cl', 'otra-clave');
  assert.equal(incorrecta.status, 401);
  assert.deepEqual(incorrecta, inexistente);
});

test('una cuenta desactivada no puede entrar (RF01)', async () => {
  await crearUsuario({ activo: false });
  const { status, datos } = await entrar();
  assert.equal(status, 401);
  assert.equal(datos.error.codigo, 'CUENTA_INACTIVA');
});

test('una cuenta desactivada no revela su estado sin la contraseña', async () => {
  await crearUsuario({ activo: false });
  const { datos } = await entrar('dueno@sixseven.cl', 'otra-clave');
  assert.equal(datos.error.codigo, 'CREDENCIALES_INVALIDAS');
});

test('los datos mal formados responden 422 por campo', async () => {
  const { status, datos } = await pedir('/api/auth/login', { body: { email: 'no-es-correo' } });
  assert.equal(status, 422);
  assert.equal(datos.error.codigo, 'VALIDACION');
  assert.ok(datos.error.detalle.email);
  assert.ok(datos.error.detalle.password);
});

test('cada perfil recibe sus módulos', async () => {
  await crearUsuario({ email: 'j@sixseven.cl', perfil: 'JEFE_TECNICO' });
  const { datos } = await entrar('j@sixseven.cl');
  assert.deepEqual(datos.usuario.modulos, ['AGENDA', 'INVENTARIO']);
});

test('/me devuelve la sesión y exige token', async () => {
  await crearUsuario();
  const { datos: { token } } = await entrar();
  const me = await pedir('/api/auth/me', { token });
  assert.equal(me.status, 200);
  assert.equal(me.datos.email, 'dueno@sixseven.cl');
  assert.equal((await pedir('/api/auth/me')).status, 401);
});

test('se rechazan tokens manipulados, vencidos o sin firma', async () => {
  const usuario = await crearUsuario();
  const vencido = jwt.sign({}, process.env.JWT_SECRET, { subject: String(usuario.id), expiresIn: -10 });
  const otraClave = jwt.sign({}, 'otra-clave', { subject: String(usuario.id) });
  const sinFirma = jwt.sign({}, '', { subject: String(usuario.id), algorithm: 'none' });

  const respuesta = await pedir('/api/auth/me', { token: vencido });
  assert.equal(respuesta.status, 401);
  assert.equal(respuesta.datos.error.codigo, 'SESION_EXPIRADA');
  assert.equal((await pedir('/api/auth/me', { token: otraClave })).status, 401);
  assert.equal((await pedir('/api/auth/me', { token: sinFirma })).status, 401);
});

test('desactivar una cuenta corta su sesión de inmediato', async () => {
  const usuario = await crearUsuario();
  const { datos: { token } } = await entrar();
  await prisma.user.update({ where: { id: usuario.id }, data: { activo: false } });
  const { status, datos } = await pedir('/api/auth/me', { token });
  assert.equal(status, 401);
  assert.equal(datos.error.codigo, 'CUENTA_INACTIVA');
});

test('requierePerfil responde 403 a otro perfil', async () => {
  await crearUsuario();
  await crearUsuario({ email: 'c@sixseven.cl', perfil: 'CONTADOR' });
  const dueno = (await entrar()).datos.token;
  const contador = (await entrar('c@sixseven.cl')).datos.token;
  assert.equal((await pedir('/solo-dueno', { token: dueno })).status, 200);
  const { status, datos } = await pedir('/solo-dueno', { token: contador });
  assert.equal(status, 403);
  assert.equal(datos.error.codigo, 'ACCESO_DENEGADO');
});

test('los errores tienen siempre la misma forma', async () => {
  const noExiste = await pedir('/api/no-existe');
  assert.equal(noExiste.status, 404);
  assert.equal(noExiste.datos.error.codigo, 'RUTA_NO_ENCONTRADA');
  const malFormado = await pedir('/api/auth/login', { crudo: '{no es json' });
  assert.equal(malFormado.status, 400);
  assert.equal(malFormado.datos.error.codigo, 'PETICION_INVALIDA');
});

test('/api/health sigue respondiendo', async () => {
  const { status, datos } = await pedir('/api/health');
  assert.equal(status, 200);
  assert.equal(datos.status, 'ok');
});
