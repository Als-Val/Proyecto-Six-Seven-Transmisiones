
const express = require('express');
const equiposController = require('../controllers/equipos.controller');

const router = express.Router();

router.post('/', equiposController.crear);

module.exports = router;
