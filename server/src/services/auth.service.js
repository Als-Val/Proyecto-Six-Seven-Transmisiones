const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const crearError = require('../utils/crearError');

// passwordHash queda fuera a propósito: así no puede salir en una respuesta por descuido.
const CAMPOS_PUBLICOS = { id: true, email: true, name: true, perfil: true, activo: true };
const ALGORITMO = 'HS256';

// Se compara contra este hash cuando el correo no existe, para que el tiempo de respuesta
// no revele qué correos están registrados.
const HASH_FICTICIO = bcrypt.hashSync('cuenta-inexistente', 10);

const hashearPassword = (password) => bcrypt.hash(password, 10);

function firmarToken(usuario) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    algorithm: ALGORITMO,
    subject: String(usuario.id),
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });
}

function verificarToken(token) {
  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET, { algorithms: [ALGORITMO] });
    return Number(sub);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw crearError(401, 'SESION_EXPIRADA', 'Tu sesión expiró. Ingresa nuevamente');
    }
    throw crearError(401, 'SESION_INVALIDA', 'La sesión no es válida');
  }
}

async function login({ email, password }) {
  const encontrado = await prisma.user.findUnique({
    where: { email },
    select: { ...CAMPOS_PUBLICOS, passwordHash: true },
  });
  const correcta = await bcrypt.compare(password, encontrado?.passwordHash ?? HASH_FICTICIO);

  if (!encontrado || !correcta) {
    throw crearError(401, 'CREDENCIALES_INVALIDAS', 'El correo o la contraseña son incorrectos');
  }
  if (!encontrado.activo) {
    throw crearError(401, 'CUENTA_INACTIVA', 'Tu cuenta está desactivada');
  }

  const { passwordHash: _omitido, ...usuario } = encontrado;
  return { token: firmarToken(usuario), usuario };
}

module.exports = { CAMPOS_PUBLICOS, hashearPassword, firmarToken, verificarToken, login };
