import React from 'react';
import { doctores } from '../data/mockData';

const DetailsModal = ({ isOpen, onClose, cita, onEdit, onDelete }) => {
  if (!isOpen || !cita) return null;

  const doctor = doctores.find(d => d.id === cita.doctorId);
  
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'confirmado':
        return (
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'pendiente':
        return (
          <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'cancelado':
        return (
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHora = (hora) => {
    return new Date(`2000-01-01T${hora}:00`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${doctor?.color}`}></div>
            <h2 className="text-xl font-semibold text-gray-900">Detalles de la Cita</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Estado */}
          <div className="mb-6">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(cita.estado)}`}>
              {getEstadoIcon(cita.estado)}
              <span className="ml-2 capitalize">{cita.estado}</span>
            </div>
          </div>

          {/* Información principal */}
          <div className="space-y-6">
            {/* Paciente */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {cita.paciente}
              </h3>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {cita.telefono}
              </div>
            </div>

            {/* Fecha y hora */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Fecha</h4>
                  <div className="flex items-center text-gray-900">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatFecha(cita.fecha)}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Hora</h4>
                  <div className="flex items-center text-gray-900">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatHora(cita.hora)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Duración</h4>
                <div className="text-gray-900">
                  {cita.duracion} minutos
                </div>
              </div>
            </div>

            {/* Doctor */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Doctor asignado</h4>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                <div className={`w-8 h-8 rounded-full ${doctor?.color} flex items-center justify-center`}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{doctor?.nombre}</div>
                  <div className="text-sm text-gray-600">
                    {doctor?.id === 1 ? 'Médico General' : 
                     doctor?.id === 2 ? 'Área Especializada' : 'Especialista'}
                  </div>
                </div>
              </div>
            </div>

            {/* Motivo */}
            {cita.motivo && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Motivo de la consulta</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-900">{cita.motivo}</p>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Información adicional</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div>ID de la cita: #{cita.id}</div>
                <div>Creada: {new Date().toLocaleDateString('es-ES')}</div>
                <div>Última modificación: {new Date().toLocaleDateString('es-ES')}</div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
            <button
              onClick={() => {
                onDelete(cita);
                onClose();
              }}
              className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
            >
              Eliminar
            </button>
            <button
              onClick={() => {
                onEdit(cita);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Editar Cita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
