
import React from 'react';
import { Link } from 'react-router-dom';

function Tablero() {
  const estiloCuadricula = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  };

  const estiloTarjeta = {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    padding: '20px',
    textDecoration: 'none', 
    color: 'inherit',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Tablero Principal</h1>
      <p style={{ color: '#666' }}>Selecciona un módulo para gestionar Six Seven Transmisiones.</p>

      <div style={estiloCuadricula}>
        {/* Atajo a tu módulo de Agenda */}
        <Link to="/agenda" style={estiloTarjeta}>
          <h3 style={{ margin: 0, color: '#0056b3' }}>📅 Agenda</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Programación semanal de transmisiones</p>
        </Link>

        {/* Atajo al módulo de Inventario de Alonso */}
        <Link to="/inventario" style={estiloTarjeta}>
          <h3 style={{ margin: 0, color: '#0056b3' }}>📦 Inventario</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Equipos y disponibilidad</p>
        </Link>

        {/* Atajo al módulo Financiero */}
        <Link to="/financiero" style={estiloTarjeta}>
          <h3 style={{ margin: 0, color: '#0056b3' }}>🏦 Financiero</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Ingresos, gastos y balances</p>
        </Link>

        {/* Atajo al módulo de Auspicios */}
        <Link to="/auspicios" style={estiloTarjeta}>
          <h3 style={{ margin: 0, color: '#0056b3' }}>📢 Auspicios</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Gestión de canjes y pagos</p>
        </Link>
      </div>
    </div>
  );
}

export default Tablero;