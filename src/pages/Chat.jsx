import React from 'react';

const Chat = () => {
  return (
    <div className="flex h-screen bg-gray-50 pt-24 sm:pt-28">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat</h1>
          <p className="text-gray-600 mb-6">
            Módulo en desarrollo - Próximamente disponible
          </p>
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <p className="text-gray-500">
              Esta sección incluirá chat interno para el equipo médico 
              y comunicación con pacientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
