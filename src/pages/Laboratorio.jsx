import React from 'react';

const Laboratorio = () => {
  return (
    <div className="flex h-screen bg-gray-50 pt-14 sm:pt-16">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Laboratorio</h1>
          <p className="text-gray-600 mb-6">
            Módulo en desarrollo - Próximamente disponible
          </p>
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <p className="text-gray-500">
              Esta sección permitirá gestionar resultados de laboratorio, 
              seguimiento de exámenes y reportes médicos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laboratorio;
