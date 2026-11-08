import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    // Se fuerza el Flexbox horizontal para asegurar que la barra quede a la izquierda
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      <Sidebar />
      
      {/* Contenedor derecho para el contenido dinámico */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: '#f9fafb' }}>
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;