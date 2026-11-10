import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 

function Layout() {
  const estiloContenedor = {
    display: 'flex',
    minHeight: '100vh', // Asegura que ocupe toda la altura de la pantalla
    backgroundColor: '#f5f6fa'
  };

  const estiloContenidoPrincipal = {
    flex: 1, // Toma todo el espacio sobrante a la derecha
    padding: '30px',
    overflowY: 'auto' // Permite hacer scroll solo en el contenido, sin mover el menú
  };

  return (
    <div style={estiloContenedor}>
      {/* El menú se queda fijo a la izquierda */}
      <Sidebar />
      
      {/* El espacio de la derecha donde el enrutador inyectará las páginas */}
      <main style={estiloContenidoPrincipal}>
        <Outlet /> 
      </main>
    </div>
  );
}

export default Layout;