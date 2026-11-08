const { z } = require('zod');

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Ingresa tu correo' })
    .trim()
    .toLowerCase()
    .email('Ingresa un correo válido'),
  // Solo se limita el largo: bcrypt ignora lo que pase de 72 bytes.
  password: z
    .string({ required_error: 'Ingresa tu contraseña' })
    .min(1, 'Ingresa tu contraseña')
    .max(72, 'La contraseña no es válida'),
});

module.exports = { loginSchema };
