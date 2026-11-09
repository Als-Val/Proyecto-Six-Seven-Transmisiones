import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import EnConstruccion from '../components/ui/EnConstruccion'; // O tu tabla real

const Inicio = () => {
  return (
    <div className="p-2">
      <PageHeader 
        title="Bienvenido a la Aplicación de Gestión de Transmisiones"
        description="Aquí puedes gestionar y revisar todas las funcionalidades de la aplicación." 
      />
      <EnConstruccion />
    </div>
  );
};

export default Inicio;