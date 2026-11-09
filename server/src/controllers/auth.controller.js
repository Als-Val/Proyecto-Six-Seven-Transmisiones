const authService = require('../services/auth.service');
const { modulosDe } = require('../services/permisos.service');

const conModulos = (usuario) => ({ ...usuario, modulos: modulosDe(usuario.perfil) });

async function login(req, res) {
  const { token, usuario } = await authService.login(req.body);
  res.json({ token, usuario: conModulos(usuario) });
}

function perfil(req, res) {
  res.json(conModulos(req.usuario));
}

module.exports = { login, perfil };
