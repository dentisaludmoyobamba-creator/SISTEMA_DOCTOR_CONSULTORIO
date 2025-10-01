import React from 'react';

const AppointmentCard = ({ cita, doctores = [], onClick, onEdit, onDelete }) => {
  const doctor = doctores.find(d => d.id === cita.doctorId);
  
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmado':
        return 'border-l-green-500 bg-green-50';
      case 'pendiente':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'cancelado':
        return 'border-l-red-500 bg-red-50';
      case 'atendida':
        return 'border-l-blue-500 bg-blue-50';
      case 'en-consulta':
        return 'border-l-purple-500 bg-purple-50';
      case 'ausente':
        return 'border-l-gray-500 bg-gray-50';
      case 'reprogramada':
        return 'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'confirmado':
        return (
          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'pendiente':
        return (
          <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'cancelado':
        return (
          <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'atendida':
        return (
          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'en-consulta':
        return (
          <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative p-2 mb-1 rounded-md border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md ${getEstadoColor(cita.estado)}`}
      onClick={() => onClick && onClick(cita)}
    >
      {/* Indicador de doctor */}
      <div className={`w-2 h-2 rounded-full ${doctor?.color} absolute top-1 right-1`}></div>
      
      {/* Contenido principal */}
      <div className="pr-6">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {cita.paciente}
          </h4>
          <div className="flex items-center">
            {getEstadoIcon(cita.estado)}
          </div>
        </div>
        
        <div className="text-xs text-gray-600 mb-1">
          {cita.hora} - {new Date(`2000-01-01T${cita.hora}:00`).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          })}
        </div>
        
        {cita.motivo && (
          <div className="text-xs text-gray-500 truncate">
            {cita.motivo}
          </div>
        )}
        
        {doctor && (
          <div className="text-xs text-gray-400 mt-1">
            {doctor.nombre}
          </div>
        )}
      </div>

      {/* Menú de acciones (aparece en hover) */}
      <div className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(cita);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded"
            title="Editar cita"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(cita);
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
            title="Eliminar cita"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
