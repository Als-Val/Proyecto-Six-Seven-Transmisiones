import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import EnConstruccion from '../components/ui/EnConstruccion'; // O tu tabla real

const TrabajadoresCargos = () => {
  return (
    <div className="p-2">
      <PageHeader 
        title="Trabajadores y Cargos"
        description="Aquí puedes gestionar y revisar los trabajadores y sus respectivos cargos dentro de la empresa." 
      />
      <EnConstruccion />
    </div>
  );
};

export default TrabajadoresCargos;