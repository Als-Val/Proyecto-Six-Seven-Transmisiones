import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/ui/Layout';
import { 
  Agenda, ControlPagos, GastosOperativos, Equipos, Inicio, 
  Marcas, Mermas, Resumen, TrabajadoresCargos 
} from './pages';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

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
  );
}

export default App;