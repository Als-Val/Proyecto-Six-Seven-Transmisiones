import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import EnConstruccion from '../components/ui/EnConstruccion'; // O tu tabla real

const Mermas = () => {
  return (
    <div className="p-2">
      <PageHeader 
        title="Mermas"
        description="Aquí puedes gestionar y revisar las mermas de productos o materiales." 
      />
      <EnConstruccion />
    </div>
  );
};

export default Mermas;