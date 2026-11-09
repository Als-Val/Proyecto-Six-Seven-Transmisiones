import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/ui/Layout';

import Login from './pages/Login';
import {
  Agenda, ControlPagos, GastosOperativos, Equipos, Inicio,
  Marcas, Mermas, Resumen, TrabajadoresCargos
} from './pages';

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

          <Route index element={<Navigate to="/inicio" replace />} />
          
          <Route path="inicio" element={<Inicio />} />
          
          <Route path="agenda" element={<Agenda />} />

          <Route path="personal/trabajadores-cargos" element={<TrabajadoresCargos />} />
          <Route path="personal/control-pagos" element={<ControlPagos />} />

          <Route path="inventario/equipos" element={<Equipos />} />
          <Route path="inventario/mermas" element={<Mermas />} />
    
          <Route path="auspicios/marcas" element={<Marcas />} />

          <Route path="finanzas/gastos" element={<GastosOperativos />} />
          <Route path="finanzas/resumen" element={<Resumen />} />

        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;