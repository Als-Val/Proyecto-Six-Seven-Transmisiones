import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/ui/Layout';
import EnConstruccion from './components/ui/EnConstruccion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

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
  );
}

export default App;