const express = require('express');
const cors = require('cors');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const { noEncontrado, manejadorErrores } = require('./middlewares/errores');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/auth', authRouter);

app.use(noEncontrado);
app.use(manejadorErrores);

module.exports = app;
