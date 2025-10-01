import React from 'react';
import AppointmentCard from './AppointmentCard';

const CalendarGrid = ({ 
  citas = [], 
  doctores = [],
  diasSemana = [],
  filtroDoctor = null, 
  filtroEstado = 'todos',
  onAppointmentClick,
  onAppointmentEdit,
  onAppointmentDelete,
  onSlotClick 
}) => {
  
  const horarios = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];
  
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
          <div className="p-2 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-r">
            <div className="text-xs sm:text-sm font-semibold text-[#4A3C7B]">Hora</div>
          </div>
          
          {/* Columnas de días */}
          {diasSemana.map((dia, index) => (
            <div key={dia.fecha} className={`p-2 sm:p-4 text-center border-r last:border-r-0 ${
              index === 3 ? 'bg-gradient-to-br from-[#30B0B0] to-[#2A9A9A]' : 'bg-gradient-to-br from-[#4A3C7B] to-[#2D1B69]'
            }`}>
              <div className={`text-xs sm:text-sm font-semibold ${index === 3 ? 'text-white' : 'text-white'}`}>{dia.nombre}</div>
              <div className={`text-base sm:text-lg font-bold mt-1 ${
                index === 3 
                  ? 'text-white bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mx-auto' 
                  : 'text-white'
              }`}>
                {dia.dia}
              </div>
              <div className={`text-xs hidden sm:block ${index === 3 ? 'text-white/80' : 'text-white/80'}`}>
                {new Date(dia.fecha).toLocaleDateString('es-ES', { month: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cuerpo del calendario */}
      <div className="grid grid-cols-7 gap-0 min-w-[800px]">
        {/* Columna de horas */}
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 border-r">
          {horarios.map((hora) => (
            <div key={hora} className="h-16 sm:h-20 p-1 sm:p-2 border-b flex items-center justify-center">
              <span className="text-xs sm:text-sm font-semibold text-[#4A3C7B]">
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
                  className={`h-16 sm:h-20 p-1 border-b relative transition-all duration-200 ${
                    isEmpty 
                      ? 'hover:bg-[#30B0B0]/5 cursor-pointer' 
                      : 'bg-gray-25'
                  }`}
                  onClick={() => isEmpty && handleSlotClick(dia.fecha, hora)}
                >
                  {/* Indicador de slot vacío */}
                  {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-gradient-to-r from-[#30B0B0] to-[#4A3C7B] text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
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
                        doctores={doctores}
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
