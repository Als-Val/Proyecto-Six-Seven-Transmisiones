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

          <Route index element={<Navigate to="/inicio" replace />} />
          
          <Route path="inicio" element={<EnConstruccion />} />
          
          <Route path="agenda" element={<EnConstruccion />} />

          <Route path="inventario/equipos" element={<EnConstruccion />} />
          <Route path="inventario/mermas" element={<EnConstruccion />} />
    
          <Route path="auspicios/marcas" element={<EnConstruccion />} />

          <Route path="finanzas/costos" element={<EnConstruccion />} />
          <Route path="finanzas/resumen" element={<EnConstruccion />} />

        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;