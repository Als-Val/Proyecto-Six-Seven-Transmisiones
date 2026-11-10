import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  // Estilo básico de columna a la izquierda
  const estiloBarra = {
    width: '250px',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #ddd',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };

  const estiloEnlace = {
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px',
    padding: '10px',
    borderRadius: '5px'
  };

  return (
    <nav style={estiloBarra}>
      <Link style={estiloEnlace} to="/tablero">📋Tablero</Link>
      <Link style={estiloEnlace} to="/agenda">📅Agenda</Link>
      <Link style={estiloEnlace} to="/personal">💼Personal</Link>
      <Link style={estiloEnlace} to="/inventario">📦Inventario</Link>
      <Link style={estiloEnlace} to="/financiero">🏦Financiero</Link>
      <Link style={estiloEnlace} to="/auspicios">📢Auspicios</Link>
      <Link style={estiloEnlace} to="/usuarios">👥Usuarios</Link>
    </nav>
  );
}

export default Sidebar;