/**
 * Prepara el entorno de pruebas. Debe importarse antes que cualquier módulo que use Prisma.
 * Las pruebas borran datos: por eso nunca usan DATABASE_URL y exigen una base "test".
 */
require('dotenv').config();

const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.includes('test')) {
  throw new Error('Define TEST_DATABASE_URL con una base cuyo nombre contenga "test".');
}
process.env.DATABASE_URL = url;
process.env.JWT_SECRET = 'clave-solo-para-pruebas-automaticas';

const prisma = require('../../src/config/prisma');
const { hashearPassword } = require('../../src/services/auth.service');

const IP = '127.0.0.1';

async function limpiar() {
  await prisma.$executeRawUnsafe(`TRUNCATE "cobros", "historial_transmisiones", "requerimientos_personal",
    "transmisiones", "tarifas", "funciones", "clientes", "recintos", "User" RESTART IDENTITY CASCADE`);
}

async function crearUsuario(datos = {}) {
  const { password = 'clave-de-prueba', ...resto } = datos;
  return prisma.user.create({
    data: {
      email: 'dueno@sixseven.cl',
      name: 'Dueño',
      perfil: 'DUENO',
      passwordHash: await hashearPassword(password),
      ...resto,
    },
  });
}

/** Crea los catálogos que necesita una transmisión. */
async function crearCatalogos() {
  const usuario = await crearUsuario();
  const cliente = await prisma.cliente.create({ data: { razonSocial: 'Cliente' } });
  const recinto = await prisma.recinto.create({ data: { nombre: 'Recinto', direccion: 'Calle 1', comuna: 'Maipú' } });
  const funcion = await prisma.funcion.create({ data: { nombre: 'Cámara' } });
  const tarifa = await prisma.tarifa.create({
    data: {
      tarifaBaseBasico: 20000, tarifaBaseComplejo: 260000, valorHora: 10000,
      valorPersona: 10000, valorKit: 10000, recargoKitNuevoPct: 15, creadoPorId: usuario.id,
    },
  });
  return { usuario, cliente, recinto, funcion, tarifa };
}

/** Crea una transmisión válida: 6 h y $400.000, así que exige $200.000 de garantía. */
function crearTransmision(c, datos = {}) {
  return prisma.transmision.create({
    data: {
      clienteId: c.cliente.id,
      recintoId: c.recinto.id,
      tarifaId: c.tarifa.id,
      tipoServicio: 'COMPLEJO',
      inicio: new Date('2026-12-01T10:00:00-03:00'),
      duracionMin: 360,
      cantidadKits: 2,
      valorCotizado: 400000,
      requerimientos: { create: { funcionId: c.funcion.id, cantidad: 2 } },
      historial: { create: { accion: 'CREACION', estadoNuevo: 'COTIZADO', usuarioId: c.usuario.id, ip: IP } },
      ...datos,
    },
  });
}

function registrarGarantia(c, transmisionId, monto) {
  return prisma.cobro.create({
    data: {
      transmisionId, tipo: 'GARANTIA', monto, fechaPago: new Date('2026-11-10'),
      comprobanteUrl: 'comprobante.pdf', registradoPorId: c.usuario.id, ip: IP,
    },
  });
}

/** Cambia el estado y escribe el historial en una misma transacción, como lo hará el servicio. */
function cambiarEstado(c, id, estado, accion, motivo = null) {
  return prisma.$transaction([
    prisma.historialTransmision.create({
      data: { transmisionId: id, accion, estadoNuevo: estado, motivo, usuarioId: c.usuario.id, ip: IP },
    }),
    prisma.transmision.update({ where: { id }, data: { estado } }),
  ]);
}

module.exports = { prisma, IP, limpiar, crearUsuario, crearCatalogos, crearTransmision, registrarGarantia, cambiarEstado };
