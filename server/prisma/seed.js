/**
 * Datos de ejemplo: los mismos de los prototipos, para que el equipo pruebe con datos reales.
 * Se puede ejecutar varias veces. Pide SEED_PASSWORD para no versionar contraseñas.
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { hashearPassword } = require('../src/services/auth.service');

const prisma = new PrismaClient();
const IP = '127.0.0.1';
const DIA = 24 * 60 * 60 * 1000;

const USUARIOS = [
  ['dueno@sixseven.cl', 'Usuario Dueño', 'DUENO'],
  ['contador@sixseven.cl', 'Usuario Contador', 'CONTADOR'],
  ['jefetecnico@sixseven.cl', 'Usuario Jefe Técnico', 'JEFE_TECNICO'],
];
const FUNCIONES = ['Cámara', 'Audio', 'Switch'];
const CLIENTES = [
  ['Liga Amateur Cordillera', '65112430-2', 'Marcela Rojas', '+56 9 8123 4410', 'contacto@ligacordillera.cl'],
  ['Colegio San Andrés del Valle', '71540220-K', 'Jorge Pizarro', '+56 9 7712 0391', 'comunicaciones@sanandresvalle.cl'],
  ['Productora Eventos Austral', '76881903-5', 'Daniela Mora', '+56 9 6650 2218', 'produccion@eventosaustral.cl'],
  ['Asociación de Básquetbol Metropolitana Sur', '65209774-1', 'Felipe Araya', '+56 9 9034 5567', 'directiva@basquetsur.cl'],
  ['Iglesia Comunidad Renacer', null, 'Ana Contreras', '+56 9 5521 8840', null],
];
const RECINTOS = [
  ['Estadio El Llano', 'Av. Santa Rosa 5800', 'San Miguel'],
  ['Teatro Colegio San Andrés', 'Los Aromos 1450', 'Peñalolén'],
  ['Centro de Eventos Parque Austral', 'Camino Lo Boza 2200', 'Pudahuel'],
  ['Gimnasio Municipal Las Torres', 'Av. Las Torres 3310', 'Maipú'],
  ['Templo Comunidad Renacer', 'Gran Avenida 9120', 'La Cisterna'],
];
// fecha, hora, horas, cliente, recinto, tipo, [cámara, audio, switch], kits, nuevos, valor, estado, garantía, motivo
const TRANSMISIONES = [
  ['2026-11-01', '15:00', 4, 0, 0, 'BASICO', [1, 1, 0], 1, 0, 90000, 'FINALIZADA'],
  ['2026-11-03', '19:00', 3, 1, 1, 'BASICO', [1, 0, 0], 1, 0, 70000, 'FINALIZADA'],
  ['2026-11-05', '10:00', 7, 2, 2, 'COMPLEJO', [4, 1, 1], 3, 2, 450000, 'FINALIZADA', true],
  ['2026-11-07', '16:00', 5, 3, 3, 'BASICO', [1, 1, 0], 1, 1, 100000, 'AUTORIZADO_TERRENO'],
  ['2026-11-08', '11:00', 2.5, 4, 4, 'BASICO', [1, 0, 0], 1, 0, 65000, 'AUTORIZADO_TERRENO'],
  ['2026-11-10', '18:00', 3, 0, 0, 'BASICO', [1, 1, 0], 1, 0, 80000, 'CANCELADA', false, 'Partido suspendido por la asociación; se reprograma para 2027.'],
  ['2026-11-12', '20:00', 3, 1, 1, 'BASICO', [1, 0, 0], 1, 0, 70000, 'COTIZADO'],
  ['2026-11-14', '09:00', 9, 0, 0, 'COMPLEJO', [5, 1, 1], 3, 1, 480000, 'AUTORIZADO_TERRENO', true],
  ['2026-11-14', '18:00', 4, 3, 3, 'BASICO', [1, 1, 0], 1, 0, 90000, 'COTIZADO'],
  ['2026-11-15', '10:00', 6, 2, 2, 'COMPLEJO', [4, 1, 1], 2, 2, 460000, 'COTIZADO'],
  ['2026-11-19', '19:00', 2, 4, 4, 'BASICO', [1, 0, 0], 1, 0, 60000, 'RECHAZADA', false, 'El cliente eligió transmitir con su propio equipo.'],
  ['2026-11-20', '21:00', 5.5, 2, 2, 'COMPLEJO', [4, 1, 1], 2, 0, 400000, 'COTIZADO', true],
  ['2026-11-21', '15:00', 3, 0, 0, 'BASICO', [1, 1, 0], 1, 0, 80000, 'COTIZADO'],
  ['2026-11-22', '12:00', 4, 4, 4, 'BASICO', [1, 0, 0], 1, 0, 75000, 'COTIZADO'],
  ['2026-11-28', '10:00', 8, 3, 3, 'COMPLEJO', [5, 1, 1], 3, 0, 440000, 'COTIZADO'],
  ['2026-11-29', '17:00', 3, 1, 1, 'BASICO', [1, 0, 0], 1, 0, 70000, 'COTIZADO'],
  ['2026-12-05', '16:00', 4, 3, 3, 'BASICO', [1, 1, 0], 1, 1, 100000, 'COTIZADO'],
];

async function crearTransmision(fila, ids) {
  const [fecha, hora, horas, cliente, recinto, tipoServicio, req, cantidadKits, kitsUltimaGeneracion, valorCotizado, estado, garantia, motivo] = fila;
  // Noviembre y diciembre están en horario de verano de Chile (UTC-3).
  const inicio = new Date(`${fecha}T${hora}:00-03:00`);
  const antes = (dias) => new Date(inicio.getTime() - dias * DIA);

  await prisma.$transaction(async (tx) => {
    const { id } = await tx.transmision.create({
      data: {
        clienteId: ids.clientes[cliente],
        recintoId: ids.recintos[recinto],
        tarifaId: ids.tarifa,
        tipoServicio,
        inicio,
        duracionMin: horas * 60,
        cantidadKits,
        kitsUltimaGeneracion,
        observacionEquipos: kitsUltimaGeneracion ? 'Cliente pidió kits de última generación para las cámaras principales.' : null,
        valorCotizado,
        createdAt: antes(12),
        requerimientos: {
          create: req.flatMap((cantidad, i) => (cantidad ? [{ funcionId: ids.funciones[i], cantidad }] : [])),
        },
        historial: {
          create: { accion: 'CREACION', estadoNuevo: 'COTIZADO', usuarioId: ids.dueno, fechaHora: antes(12), ip: IP },
        },
      },
    });

    const cambiar = async (nuevoEstado, accion, fechaHora, texto = null) => {
      await tx.historialTransmision.create({
        data: { transmisionId: id, accion, estadoNuevo: nuevoEstado, motivo: texto, usuarioId: ids.dueno, fechaHora, ip: IP },
      });
      await tx.transmision.update({ where: { id }, data: { estado: nuevoEstado } });
    };

    if (garantia) {
      await tx.cobro.create({
        data: {
          transmisionId: id,
          tipo: 'GARANTIA',
          monto: Math.round(valorCotizado / 2),
          fechaPago: antes(7),
          comprobanteUrl: `seed/transferencia-${id}.pdf`,
          registradoPorId: ids.contador,
          registradoEn: antes(7),
          ip: IP,
        },
      });
    }
    if (['AUTORIZADO_TERRENO', 'FINALIZADA', 'CANCELADA'].includes(estado)) {
      await cambiar('AUTORIZADO_TERRENO', 'AUTORIZACION', antes(4));
    }
    if (estado === 'FINALIZADA') await cambiar('FINALIZADA', 'CIERRE', antes(-1));
    if (estado === 'CANCELADA') await cambiar('CANCELADA', 'CANCELACION', antes(2), motivo);
    if (estado === 'RECHAZADA') await cambiar('RECHAZADA', 'RECHAZO', antes(6), motivo);
  });
}

async function main() {
  if (!process.env.SEED_PASSWORD) {
    throw new Error('Define SEED_PASSWORD en server/.env antes de cargar los datos de ejemplo.');
  }

  const passwordHash = await hashearPassword(process.env.SEED_PASSWORD);
  const usuarios = {};
  for (const [email, name, perfil] of USUARIOS) {
    usuarios[perfil] = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name, perfil, passwordHash },
    });
  }

  if ((await prisma.transmision.count()) > 0) {
    console.log('Ya hay transmisiones: solo se revisaron las cuentas de ejemplo.');
    return;
  }

  const funciones = [];
  for (const nombre of FUNCIONES) {
    funciones.push((await prisma.funcion.upsert({ where: { nombre }, update: {}, create: { nombre } })).id);
  }
  const clientes = [];
  for (const [razonSocial, rut, contacto, telefono, email] of CLIENTES) {
    clientes.push((await prisma.cliente.create({ data: { razonSocial, rut, contacto, telefono, email } })).id);
  }
  const recintos = [];
  for (const [nombre, direccion, comuna] of RECINTOS) {
    recintos.push((await prisma.recinto.create({ data: { nombre, direccion, comuna } })).id);
  }
  const tarifa = await prisma.tarifa.create({
    data: {
      tarifaBaseBasico: 20000,
      tarifaBaseComplejo: 260000,
      valorHora: 10000,
      valorPersona: 10000,
      valorKit: 10000,
      recargoKitNuevoPct: 15,
      vigenteDesde: new Date('2026-09-01T09:00:00-03:00'),
      creadoPorId: usuarios.DUENO.id,
    },
  });

  const ids = { funciones, clientes, recintos, tarifa: tarifa.id, dueno: usuarios.DUENO.id, contador: usuarios.CONTADOR.id };
  for (const fila of TRANSMISIONES) await crearTransmision(fila, ids);
  console.log(`Datos de ejemplo cargados: ${TRANSMISIONES.length} transmisiones.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
