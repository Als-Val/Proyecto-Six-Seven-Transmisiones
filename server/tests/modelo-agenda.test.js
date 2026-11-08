const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  prisma, IP, limpiar, crearCatalogos, crearTransmision, registrarGarantia, cambiarEstado,
} = require('./helpers/base');

let c;

beforeEach(async () => {
  await limpiar();
  c = await crearCatalogos();
});
after(() => prisma.$disconnect());

/** Comprueba que la base rechace la operación con ese mensaje. */
const rechaza = (operacion, patron) => assert.rejects(operacion, patron);

const autorizada = async () => {
  const t = await crearTransmision(c);
  await registrarGarantia(c, t.id, 200000);
  await cambiarEstado(c, t.id, 'AUTORIZADO_TERRENO', 'AUTORIZACION');
  return t;
};

test('CHECK: kits, duración, valor y tarifas fuera de rango', async () => {
  await rechaza(crearTransmision(c, { kitsUltimaGeneracion: 3 }), /tx_kits/);
  await rechaza(crearTransmision(c, { duracionMin: 365 }), /tx_duracion/);
  await rechaza(crearTransmision(c, { duracionMin: 1470 }), /tx_duracion/);
  await rechaza(crearTransmision(c, { valorCotizado: 0 }), /tx_valor/);
  await rechaza(prisma.tarifa.create({
    data: {
      tarifaBaseBasico: 1, tarifaBaseComplejo: 1, valorHora: 1, valorPersona: -1,
      valorKit: 1, recargoKitNuevoPct: 1, creadoPorId: c.usuario.id,
    },
  }), /tarifa_valores/);
});

test('una transmisión no puede nacer en otro estado', async () => {
  await rechaza(crearTransmision(c, { estado: 'FINALIZADA' }), /crearse en estado COTIZADO/);
});

test('una transmisión exige su fila CREACION y personal requerido', async () => {
  await rechaza(crearTransmision(c, { historial: undefined }), /fila CREACION/);
  await rechaza(crearTransmision(c, { requerimientos: undefined }), /personal requerido/);
});

test('no se puede duplicar la fila CREACION', async () => {
  const t = await crearTransmision(c);
  await rechaza(prisma.historialTransmision.create({
    data: { transmisionId: t.id, accion: 'CREACION', estadoNuevo: 'COTIZADO', usuarioId: c.usuario.id, ip: IP },
  }), /Unique constraint|historial_una_creacion/);
});

test('el autor sale de la fila CREACION', async () => {
  const t = await crearTransmision(c);
  const fila = await prisma.historialTransmision.findFirst({ where: { transmisionId: t.id, accion: 'CREACION' } });
  assert.equal(fila.usuarioId, c.usuario.id);
});

test('recinto duplicado, sin distinguir mayúsculas', async () => {
  await rechaza(prisma.recinto.create({
    data: { nombre: 'RECINTO', direccion: 'Otra', comuna: 'MAIPÚ' },
  }), /Unique constraint|recintos_nombre_comuna_key/);
});

test('sin garantía no se autoriza una transmisión de más de 5 horas', async () => {
  const t = await crearTransmision(c);
  await rechaza(cambiarEstado(c, t.id, 'AUTORIZADO_TERRENO', 'AUTORIZACION'), /Garantía pendiente/);
});

test('exactamente 5 horas no exige garantía', async () => {
  const t = await crearTransmision(c, { duracionMin: 300 });
  await cambiarEstado(c, t.id, 'AUTORIZADO_TERRENO', 'AUTORIZACION');
  assert.equal((await prisma.transmision.findUnique({ where: { id: t.id } })).estado, 'AUTORIZADO_TERRENO');
});

test('con la garantía completa se autoriza', async () => {
  const t = await autorizada();
  assert.equal((await prisma.transmision.findUnique({ where: { id: t.id } })).estado, 'AUTORIZADO_TERRENO');
});

test('la garantía debe ser por el monto exacto', async () => {
  const t = await crearTransmision(c);
  await rechaza(registrarGarantia(c, t.id, 100000), /exactamente 200000/);
  await rechaza(registrarGarantia(c, t.id, 300000), /exactamente 200000/);
});

test('la garantía se redondea al peso (valor impar)', async () => {
  const t = await crearTransmision(c, { valorCotizado: 400001 });
  await registrarGarantia(c, t.id, 200001);
  await cambiarEstado(c, t.id, 'AUTORIZADO_TERRENO', 'AUTORIZACION');
});

test('no se registra garantía si no se exige o ya está pagada', async () => {
  const corta = await crearTransmision(c, { duracionMin: 300 });
  await rechaza(registrarGarantia(c, corta.id, 200000), /no requiere garantía/);
  const larga = await crearTransmision(c);
  await registrarGarantia(c, larga.id, 200000);
  await rechaza(registrarGarantia(c, larga.id, 200000), /ya está pagada/);
});

test('subir el valor deja pendiente la diferencia y se paga solo lo que falta', async () => {
  const t = await crearTransmision(c);
  await registrarGarantia(c, t.id, 200000);
  await prisma.transmision.update({ where: { id: t.id }, data: { valorCotizado: 500000 } });
  await rechaza(cambiarEstado(c, t.id, 'AUTORIZADO_TERRENO', 'AUTORIZACION'), /Garantía pendiente/);
  await rechaza(registrarGarantia(c, t.id, 250000), /exactamente 50000/);
  await registrarGarantia(c, t.id, 50000);
  await cambiarEstado(c, t.id, 'AUTORIZADO_TERRENO', 'AUTORIZACION');
});

test('dos registros simultáneos de garantía no suman de más', async () => {
  const t = await crearTransmision(c);
  const resultados = await Promise.allSettled(Array.from({ length: 5 }, () => registrarGarantia(c, t.id, 200000)));
  assert.equal(resultados.filter((r) => r.status === 'fulfilled').length, 1);
  const { _sum } = await prisma.cobro.aggregate({ where: { transmisionId: t.id }, _sum: { monto: true } });
  assert.equal(_sum.monto, 200000);
});

test('no se registra garantía fuera de COTIZADO', async () => {
  const t = await crearTransmision(c, { duracionMin: 360 });
  await cambiarEstado(c, t.id, 'RECHAZADA', 'RECHAZO', 'No aceptó');
  await rechaza(registrarGarantia(c, t.id, 200000), /estado COTIZADO/);
});

test('solo se permiten las transiciones del ciclo de vida', async () => {
  const t = await crearTransmision(c);
  await rechaza(cambiarEstado(c, t.id, 'FINALIZADA', 'CIERRE'), /Transición no permitida/);
  await rechaza(cambiarEstado(c, t.id, 'CANCELADA', 'CANCELACION', 'x'), /Transición no permitida/);
  const a = await autorizada();
  await rechaza(cambiarEstado(c, a.id, 'RECHAZADA', 'RECHAZO', 'x'), /Transición no permitida/);
  await cambiarEstado(c, a.id, 'CANCELADA', 'CANCELACION', 'Se suspendió');
  await rechaza(cambiarEstado(c, a.id, 'COTIZADO', 'EDICION'), /Transición no permitida/);
  const f = await autorizada();
  await cambiarEstado(c, f.id, 'FINALIZADA', 'CIERRE');
});

test('cambiar el estado sin escribir el historial se rechaza al confirmar', async () => {
  const t = await crearTransmision(c, { duracionMin: 300 });
  await rechaza(prisma.transmision.update({ where: { id: t.id }, data: { estado: 'AUTORIZADO_TERRENO' } }), /historial/);
  assert.equal((await prisma.transmision.findUnique({ where: { id: t.id } })).estado, 'COTIZADO');
});

test('el historial no puede contradecir al estado', async () => {
  const t = await crearTransmision(c, { duracionMin: 300 });
  await rechaza(prisma.historialTransmision.create({
    data: { transmisionId: t.id, accion: 'AUTORIZACION', estadoNuevo: 'AUTORIZADO_TERRENO', usuarioId: c.usuario.id, ip: IP },
  }), /historial/);
});

test('acción y estado del historial deben corresponder', async () => {
  const t = await crearTransmision(c);
  await rechaza(prisma.historialTransmision.create({
    data: { transmisionId: t.id, accion: 'CIERRE', estadoNuevo: 'COTIZADO', usuarioId: c.usuario.id, ip: IP },
  }), /hist_accion_estado/);
});

test('rechazar o cancelar exige un motivo con texto', async () => {
  const t = await crearTransmision(c);
  await rechaza(cambiarEstado(c, t.id, 'RECHAZADA', 'RECHAZO'), /hist_motivo/);
  await rechaza(cambiarEstado(c, t.id, 'RECHAZADA', 'RECHAZO', '   '), /hist_motivo/);
});

test('en COTIZADO se edita, y después ya no', async () => {
  const t = await autorizada();
  await rechaza(prisma.transmision.update({ where: { id: t.id }, data: { valorCotizado: 1 } }), /estado COTIZADO/);
  await rechaza(prisma.requerimientoPersonal.update({
    where: { transmisionId_funcionId: { transmisionId: t.id, funcionId: c.funcion.id } },
    data: { cantidad: 9 },
  }), /estado COTIZADO/);
  const editable = await crearTransmision(c);
  await prisma.transmision.update({ where: { id: editable.id }, data: { valorCotizado: 500000 } });
});

test('no se puede dejar una transmisión sin personal', async () => {
  const t = await crearTransmision(c);
  await rechaza(prisma.requerimientoPersonal.deleteMany({ where: { transmisionId: t.id } }), /personal requerido/);
});

test('historial, tarifas y cobros no se modifican ni se borran', async () => {
  const t = await crearTransmision(c);
  const cobro = await registrarGarantia(c, t.id, 200000);
  await rechaza(prisma.historialTransmision.updateMany({ data: { motivo: 'x' } }), /no se pueden modificar/);
  await rechaza(prisma.historialTransmision.deleteMany({}), /no se pueden modificar/);
  await rechaza(prisma.tarifa.update({ where: { id: c.tarifa.id }, data: { valorHora: 1 } }), /no se pueden modificar/);
  await rechaza(prisma.tarifa.delete({ where: { id: c.tarifa.id } }), /no se pueden modificar/);
  await rechaza(prisma.cobro.update({ where: { id: cobro.id }, data: { monto: 1 } }), /no se pueden modificar/);
  await rechaza(prisma.cobro.delete({ where: { id: cobro.id } }), /no se pueden modificar/);
});

test('una transmisión con historial no se puede borrar', async () => {
  const t = await crearTransmision(c);
  await assert.rejects(prisma.transmision.delete({ where: { id: t.id } }));
});
