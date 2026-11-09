/**
 * Crea un error que el middleware final convierte en respuesta HTTP.
 * `detalle` es opcional y sirve para indicar errores por campo: { email: 'mensaje' }.
 */
function crearError(statusCode, codigo, mensaje, detalle) {
  return Object.assign(new Error(mensaje), { statusCode, codigo, detalle });
}

module.exports = crearError;
