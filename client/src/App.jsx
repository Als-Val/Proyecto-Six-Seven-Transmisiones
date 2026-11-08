import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/ui/Layout';
import EnConstruccion from './components/ui/EnConstruccion';
import Login from './pages/Login';

function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) return <Spin fullscreen />;
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  return children;
}

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Ruta padre que envuelve todo el sistema con el Layout (Sidebar + Contenido) */}
        <Route path="/" element={<RutaProtegida><Layout /></RutaProtegida>}>

          {/* Agenda es el único módulo que ven los tres perfiles */}
          <Route index element={<Navigate to="/agenda/transmisiones" replace />} />

          {/* --- RUTAS DE AGENDA --- */}
          <Route path="agenda/transmisiones" element={<EnConstruccion />} />
          <Route path="agenda/staff" element={<EnConstruccion />} />

          {/* --- RUTAS DE INVENTARIO --- */}
          <Route path="inventario/equipos" element={<EnConstruccion />} />
          <Route path="inventario/mermas" element={<EnConstruccion />} />

          {/* --- RUTAS DE AUSPICIOS --- */}
          <Route path="auspicios/marcas" element={<EnConstruccion />} />

          {/* --- RUTAS DE FINANZAS (TU MÓDULO) --- */}
          <Route path="finanzas/costos" element={<EnConstruccion />} />
          <Route path="finanzas/resumen" element={<EnConstruccion />} />

        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;