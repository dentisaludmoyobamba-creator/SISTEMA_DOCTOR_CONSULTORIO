import React from 'react';

const Campanas = () => {
  return (
    <div className="flex h-screen bg-gray-50 pt-14 sm:pt-16">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campañas</h1>
          <p className="text-gray-600 mb-6">
            Módulo en desarrollo - Próximamente disponible
          </p>
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <p className="text-gray-500">
              Esta sección permitirá crear y gestionar campañas de marketing 
              dirigidas a diferentes segmentos de pacientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campanas;
