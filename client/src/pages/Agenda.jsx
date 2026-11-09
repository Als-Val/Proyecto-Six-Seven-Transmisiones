import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import EnConstruccion from '../components/ui/EnConstruccion'; 

const Agenda = () => {
  return (
    <div className="p-2">
      <PageHeader 
        title="Agenda de Transmisiones" 
        description="Consulta las próximas fechas y eventos calendarizados." 
      />
      <EnConstruccion />
    </div>
  );
};

export default Agenda;