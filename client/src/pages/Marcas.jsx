import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import EnConstruccion from '../components/ui/EnConstruccion'; // O tu tabla real

const Marcas = () => {
  return (
    <div className="p-2">
      <PageHeader 
        title="Marcas"
        description="Aquí puedes gestionar y revisar las marcas disponibles." 
      />
      <EnConstruccion />
    </div>
  );
};

export default Marcas;