const prisma = require('../config/prisma');

const tiposPermitidos = [
  'CAMARA',
  'TRIPODE',
  'MICROFONO',
  'PANEL_SONIDO',
  'CABLE',
  'PANEL_SWITCH',
  'OTRO',
];

const maximoPrecio = 999999999999;

function errorDeValidacion(mensaje) {
  const error = new Error(mensaje);
  error.statusCode = 400;
  return error;
}

async function crearEquipo(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    throw errorDeValidacion('Envía los datos del artefacto.');
  }

  const { nombre, modelo, anio, precioCompra, tipo } = datos;

  if (typeof nombre !== 'string' || !nombre.trim()) {
    throw errorDeValidacion('El nombre es obligatorio.');
  }

  if (typeof modelo !== 'string' || !modelo.trim()) {
    throw errorDeValidacion('El modelo es obligatorio.');
  }

  if (
    !Number.isSafeInteger(precioCompra) ||
    precioCompra < 0 ||
    precioCompra > maximoPrecio
  ) {
    throw errorDeValidacion('El precio debe ser un monto en CLP igual o mayor a $0.');
  }

  if (!tiposPermitidos.includes(tipo)) {
    throw errorDeValidacion('Selecciona un tipo válido.');
  }

  if (anio !== undefined && anio !== null) {
    if (!Number.isInteger(anio) || anio <= 0 || anio > new Date().getFullYear()) {
      throw errorDeValidacion('El año debe ser válido y no puede estar en el futuro.');
    }
  }

  return prisma.equipo.create({
    data: {
      nombre: nombre.trim(),
      modelo: modelo.trim(),
      anio: anio ?? null,
      precioCompra: String(precioCompra),
      tipo,
    },
  });
}

module.exports = { crearEquipo };
