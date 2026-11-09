import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ApiError, apiFetch, guardarToken, obtenerToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // Si hay un token guardado, hay que validarlo antes de decidir qué pantalla mostrar.
  const [cargando, setCargando] = useState(Boolean(obtenerToken()));

  const salir = useCallback(() => {
    guardarToken(null);
    setUsuario(null);
  }, []);

  const entrar = useCallback(async (credenciales) => {
    const { token, usuario: datos } = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credenciales),
    });
    guardarToken(token);
    setUsuario(datos);
  }, []);

  useEffect(() => {
    if (!obtenerToken()) return;
    apiFetch('/auth/me')
      .then(setUsuario)
      .catch((error) => {
        // Una falla de red no cierra la sesión; solo lo hace un token rechazado.
        if (error instanceof ApiError && error.status === 401) salir();
      })
      .finally(() => setCargando(false));
  }, [salir]);

  useEffect(() => {
    window.addEventListener('sesion-expirada', salir);
    return () => window.removeEventListener('sesion-expirada', salir);
  }, [salir]);

  const valor = useMemo(() => ({ usuario, cargando, entrar, salir }), [usuario, cargando, entrar, salir]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
