import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import EnConstruccion from '../components/ui/EnConstruccion'; // O tu tabla real

const GastosOperativos = () => {
  return (
    <div className="p-2">
      <PageHeader 
        title="Gastos Operativos"
        description="Aquí puedes gestionar y revisar los gastos operativos de la empresa." 
      />
      <EnConstruccion />
    </div>
  );
};

export default GastosOperativos;