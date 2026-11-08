const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const validar = require('../middlewares/validar');
const { autenticar } = require('../middlewares/auth');
const { loginSchema } = require('../schemas/auth.schema');
const { login, perfil } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', validar(loginSchema), asyncHandler(login));
router.get('/me', autenticar, perfil);

module.exports = router;
