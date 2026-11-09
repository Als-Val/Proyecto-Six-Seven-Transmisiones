const { PrismaClient } = require('@prisma/client');

// Única instancia del proyecto: cada PrismaClient abre su propio pool de conexiones.
const prisma = new PrismaClient();

module.exports = prisma;
