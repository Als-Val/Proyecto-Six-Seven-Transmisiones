const prisma = require('../config/prisma');
const crearError = require('../utils/crearError');
const asyncHandler = require('./asyncHandler');
const { verificarToken, CAMPOS_PUBLICOS } = require('../services/auth.service');

/**
 * Exige `Authorization: Bearer <token>` y deja al usuario en req.usuario.
 * Lee la cuenta en cada petición para que desactivarla o cambiar su perfil rija de inmediato.
 */
const autenticar = asyncHandler(async (req, _res, next) => {
  const [esquema, token] = (req.headers.authorization ?? '').split(' ');
  if (esquema !== 'Bearer' || !token) {
    throw crearError(401, 'SIN_SESION', 'Debes iniciar sesión');
  }

  const id = verificarToken(token);
  const usuario = await prisma.user.findUnique({ where: { id }, select: CAMPOS_PUBLICOS });
  if (!usuario) throw crearError(401, 'SESION_INVALIDA', 'La sesión no es válida');
  if (!usuario.activo) throw crearError(401, 'CUENTA_INACTIVA', 'Tu cuenta está desactivada');

  req.usuario = usuario;
  next();
});

/** Exige uno de los perfiles indicados. Debe usarse después de `autenticar`. */
const requierePerfil = (...perfiles) => (req, _res, next) => {
  if (perfiles.includes(req.usuario.perfil)) return next();
  return next(crearError(403, 'ACCESO_DENEGADO', 'Tu perfil no tiene permiso para esta acción'));
};

module.exports = { autenticar, requierePerfil };
