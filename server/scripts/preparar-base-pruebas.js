/** Aplica las migraciones a la base de pruebas antes de `npm test`. */
require('dotenv').config();
const { spawnSync } = require('node:child_process');

const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.includes('test')) {
  console.error('Define TEST_DATABASE_URL en server/.env, con una base cuyo nombre contenga "test".');
  process.exit(1);
}

const { status } = spawnSync('npx', ['prisma', 'migrate', 'deploy'], {
  env: { ...process.env, DATABASE_URL: url },
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
process.exit(status ?? 1);
