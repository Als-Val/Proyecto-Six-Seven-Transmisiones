import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import EnConstruccion from '../components/ui/EnConstruccion'; // O tu tabla real

const Equipos = () => {
  return (
    <div className="p-2">
      <PageHeader 
        title="Equipos"
        description="Aquí puedes gestionar y revisar los equipos disponibles." 
      />
      <EnConstruccion />
    </div>
  );
};

export default Equipos;