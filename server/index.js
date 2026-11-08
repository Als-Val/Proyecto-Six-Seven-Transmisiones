require('dotenv').config();

// Sin secreto no se pueden firmar sesiones: mejor fallar al arrancar que en el primer login.
if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET en server/.env. Revisa server/.env.example.');
  process.exit(1);
}

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
