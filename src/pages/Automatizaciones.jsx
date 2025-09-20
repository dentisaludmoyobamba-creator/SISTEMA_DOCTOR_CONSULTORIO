import React from 'react';

const Automatizaciones = () => {
  return (
    <div className="flex h-screen bg-gray-50 pt-14 sm:pt-16">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Automatizaciones</h1>
          <p className="text-gray-600 mb-6">
            Módulo en desarrollo - Próximamente disponible
          </p>
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <p className="text-gray-500">
              Esta sección permitirá configurar automatizaciones de marketing 
              y comunicación con pacientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automatizaciones;
