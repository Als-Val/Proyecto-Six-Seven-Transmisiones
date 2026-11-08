import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/ui/Layout';
import EnConstruccion from './components/ui/EnConstruccion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta padre que envuelve todo el sistema con el Layout (Sidebar + Contenido) */}
        <Route path="/" element={<Layout />}>
          
          {/* Si entras a localhost:5173 pelado, te redirige a tu módulo de finanzas */}
          <Route index element={<Navigate to="/finanzas/costos" replace />} />
          
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
  );
}

export default App;