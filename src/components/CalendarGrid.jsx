import React from 'react';
import AppointmentCard from './AppointmentCard';
import { diasSemana, horarios } from '../data/mockData';

const CalendarGrid = ({ 
  citas = [], 
  filtroDoctor = null, 
  filtroEstado = 'todos',
  onAppointmentClick,
  onAppointmentEdit,
  onAppointmentDelete,
  onSlotClick 
}) => {
  
  // Filtrar citas según los filtros activos
  const citasFiltradas = citas.filter(cita => {
    if (filtroDoctor && cita.doctorId !== filtroDoctor) return false;
    if (filtroEstado !== 'todos' && cita.estado !== filtroEstado) return false;
    return true;
  });

  // Obtener citas para una fecha y hora específica
  const getCitasParaSlot = (fecha, hora) => {
    return citasFiltradas.filter(cita => cita.fecha === fecha && cita.hora === hora);
  };

  // Manejar click en slot vacío
  const handleSlotClick = (fecha, hora) => {
    if (onSlotClick) {
      onSlotClick({ fecha, hora });
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-white rounded-lg shadow-sm border">
      {/* Header del calendario */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="grid grid-cols-7 gap-0 min-w-[800px]">
          {/* Columna de horas */}
          <div className="p-2 sm:p-4 bg-gray-50 border-r">
            <div className="text-xs sm:text-sm font-medium text-gray-700">Hora</div>
          </div>
          
          {/* Columnas de días */}
          {diasSemana.map((dia) => (
            <div key={dia.fecha} className="p-2 sm:p-4 text-center border-r last:border-r-0">
              <div className="text-xs sm:text-sm font-medium text-gray-900">{dia.nombre}</div>
              <div className="text-base sm:text-lg font-bold text-gray-700 mt-1">{dia.dia}</div>
              <div className="text-xs text-gray-500 hidden sm:block">
                {new Date(dia.fecha).toLocaleDateString('es-ES', { month: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cuerpo del calendario */}
      <div className="grid grid-cols-7 gap-0 min-w-[800px]">
        {/* Columna de horas */}
        <div className="bg-gray-50 border-r">
          {horarios.map((hora) => (
            <div key={hora} className="h-16 sm:h-20 p-1 sm:p-2 border-b flex items-center justify-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                {new Date(`2000-01-01T${hora}:00`).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
          ))}
        </div>

        {/* Columnas de días */}
        {diasSemana.map((dia) => (
          <div key={dia.fecha} className="border-r last:border-r-0">
            {horarios.map((hora) => {
              const citasEnSlot = getCitasParaSlot(dia.fecha, hora);
              const isEmpty = citasEnSlot.length === 0;
              
              return (
                <div
                  key={`${dia.fecha}-${hora}`}
                  className={`h-16 sm:h-20 p-1 border-b relative transition-colors duration-150 ${
                    isEmpty 
                      ? 'hover:bg-blue-50 cursor-pointer' 
                      : 'bg-gray-25'
                  }`}
                  onClick={() => isEmpty && handleSlotClick(dia.fecha, hora)}
                >
                  {/* Indicador de slot vacío */}
                  {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Citas en este slot */}
                  <div className="space-y-1 h-full overflow-y-auto">
                    {citasEnSlot.map((cita) => (
                      <AppointmentCard
                        key={cita.id}
                        cita={cita}
                        onClick={onAppointmentClick}
                        onEdit={onAppointmentEdit}
                        onDelete={onAppointmentDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
