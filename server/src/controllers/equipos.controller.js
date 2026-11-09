const equiposService = require('../services/equipos.service');

async function crear(req, res) {
  try {
    const equipo = await equiposService.crearEquipo(req.body);
    return res.status(201).json(equipo);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: 'No se pudo crear el artefacto.' });
  }
}

module.exports = { crear };
