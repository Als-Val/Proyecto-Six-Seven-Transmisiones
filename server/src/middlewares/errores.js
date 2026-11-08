const crearError = require('../utils/crearError');

const ERRORES_PRISMA = {
  P2002: [409, 'DUPLICADO', 'Ya existe un registro con ese valor'],
  P2003: [409, 'REFERENCIA_INVALIDA', 'El registro está relacionado con otros datos'],
  P2025: [404, 'NO_ENCONTRADO', 'El registro no existe'],
};

function noEncontrado(req, _res, next) {
  next(crearError(404, 'RUTA_NO_ENCONTRADA', `La ruta ${req.method} ${req.originalUrl} no existe`));
}

// Único lugar que responde errores, para que el cliente reciba siempre la misma forma.
// Express reconoce este middleware por sus cuatro parámetros.
// eslint-disable-next-line no-unused-vars
function manejadorErrores(error, req, res, next) {
  const prisma = ERRORES_PRISMA[error.code];
  let statusCode = prisma?.[0] ?? error.statusCode ?? error.status ?? 500;
  const codigo = prisma?.[1] ?? error.codigo ?? (statusCode === 400 ? 'PETICION_INVALIDA' : 'ERROR_INTERNO');
  if (statusCode < 400 || statusCode > 599) statusCode = 500;

  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, error);
  }

  const mensaje = statusCode >= 500 ? 'Ocurrió un error interno' : prisma?.[2] ?? error.message;
  res.status(statusCode).json({
    error: { codigo, mensaje, ...(error.detalle ? { detalle: error.detalle } : {}) },
  });
}

module.exports = { noEncontrado, manejadorErrores };
