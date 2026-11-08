/**
 * Módulos del menú que ve cada perfil (RF01). Las rutas de cada módulo validan además
 * sus acciones con `requierePerfil`: ocultar una opción del menú no protege los datos.
 */
const MODULOS_POR_PERFIL = {
  DUENO: ['AGENDA', 'PERSONAL', 'INVENTARIO', 'AUSPICIOS', 'FINANZAS'],
  CONTADOR: ['AGENDA', 'AUSPICIOS', 'FINANZAS'],
  JEFE_TECNICO: ['AGENDA', 'INVENTARIO'],
};

const modulosDe = (perfil) => MODULOS_POR_PERFIL[perfil] ?? [];

module.exports = { modulosDe };
