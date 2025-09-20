import React from 'react';

const SoylaIA = () => {
  return (
    <div className="flex h-screen bg-gray-50 pt-14 sm:pt-16">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Soyla IA</h1>
          <div className="mb-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
              PRONTO
            </span>
          </div>
          <p className="text-gray-600 mb-6">
            Asistente de IA para consultorios médicos
          </p>
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <p className="text-gray-500">
              Soyla IA será tu asistente inteligente para automatizar tareas, 
              responder consultas y mejorar la experiencia del paciente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoylaIA;
