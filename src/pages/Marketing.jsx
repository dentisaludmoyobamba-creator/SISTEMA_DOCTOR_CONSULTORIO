import React from 'react';

const Marketing = () => {
  return (
    <div className="flex h-screen bg-gray-50 pt-16">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing</h1>
          <p className="text-gray-600 mb-6">
            Módulo en desarrollo - Próximamente disponible
          </p>
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <p className="text-gray-500">
              Esta sección permitirá gestionar campañas de marketing, 
              seguimiento de leads y análisis de captación de pacientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
