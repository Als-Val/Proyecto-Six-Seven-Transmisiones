const crearError = require('../utils/crearError');

/**
 * Valida una parte de la petición con un esquema de Zod y deja los datos normalizados.
 * Uso: router.post('/ruta', validar(esquema), controlador)
 */
const validar = (esquema, fuente = 'body') => (req, _res, next) => {
  const resultado = esquema.safeParse(req[fuente]);
  if (resultado.success) {
    req[fuente] = resultado.data;
    return next();
  }

  const detalle = {};
  for (const problema of resultado.error.issues) {
    const campo = problema.path.join('.') || 'general';
    detalle[campo] ??= problema.message;
  }
  return next(crearError(422, 'VALIDACION', 'Revisa los datos ingresados', detalle));
};

module.exports = validar;
