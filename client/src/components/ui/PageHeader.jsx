import React from 'react';

const PageHeader = ({ title, description }) => {
  return (
    <div className="mb-6 font-sans"> 
      <h1 className="text-xl font-semibold text-gray-800 tracking-tight">{title}</h1>
      {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
    </div>
  );
};

export default PageHeader;