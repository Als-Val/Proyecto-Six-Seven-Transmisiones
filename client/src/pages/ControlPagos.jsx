import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import EnConstruccion from '../components/ui/EnConstruccion'; // O tu tabla real

const ControlPagos= () => {
  return (
    <div className="p-2">
      <PageHeader 
        title="Control de Pagos" 
        description="Aquí puedes gestionar y revisar los pagos realizados y pendientes." 
      />
      <EnConstruccion />
    </div>
  );
};

export default ControlPagos;