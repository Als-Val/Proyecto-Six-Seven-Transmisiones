import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import EnConstruccion from '../components/ui/EnConstruccion'; // O tu tabla real

const Resumen = () => {
  return (
    <div className="p-2">
      <PageHeader 
        title="Resumen del Mes"
        description="Aquí puedes ver un resumen de las actividades y métricas del mes." 
      />
      <EnConstruccion />
    </div>
  );
};

export default Resumen;