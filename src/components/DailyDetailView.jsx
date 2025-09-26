import React from 'react';

const DailyDetailView = ({ citas = [], onAppointmentClick }) => {
  // Obtener fecha actual
  const currentDate = new Date();
  const dateStr = currentDate.toISOString().split('T')[0];
  
  // Filtrar citas del día actual
  const citasDelDia = citas.filter(cita => cita.fecha === dateStr);
  
  // Horarios del día
  const horarios = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // Obtener citas para una hora específica
  const getCitasForHour = (hora) => {
    return citasDelDia.filter(cita => cita.hora === hora);
  };

  // Formatear fecha
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69]">
        <h2 className="text-xl font-bold text-white text-center">
          {formatDate(currentDate)}
        </h2>
        <p className="text-white/80 text-center mt-1">
          {citasDelDia.length} cita{citasDelDia.length !== 1 ? 's' : ''} programada{citasDelDia.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tabla de citas */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white">
              <th className="text-left p-4 font-semibold">Hora</th>
              <th className="text-left p-4 font-semibold">Paciente</th>
              <th className="text-left p-4 font-semibold">Motivo</th>
              <th className="text-left p-4 font-semibold">Estado</th>
              <th className="text-left p-4 font-semibold">Últ. nota de evolución</th>
              <th className="text-left p-4 font-semibold">Nota de la cita</th>
            </tr>
          </thead>
          <tbody>
            {citasDelDia.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#4A3C7B]">No se encontró ninguna información</h3>
                      <p className="text-gray-500 mt-1">No hay citas programadas para hoy</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              citasDelDia.map((cita, index) => (
                <tr
                  key={cita.id}
                  onClick={() => onAppointmentClick && onAppointmentClick(cita)}
                  className="border-b hover:bg-[#30B0B0]/5 cursor-pointer transition-colors duration-200"
                >
                  <td className="p-4">
                    <span className="font-semibold text-[#4A3C7B]">{cita.hora}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4A3C7B] to-[#2D1B69] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {cita.paciente.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{cita.paciente}</div>
                        <div className="text-sm text-gray-500">DNI: {cita.documento || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700">{cita.motivo || 'Consulta general'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      cita.estado === 'confirmada' 
                        ? 'bg-emerald-100 text-emerald-700'
                        : cita.estado === 'pendiente'
                        ? 'bg-amber-100 text-amber-700'
                        : cita.estado === 'cancelada'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {cita.estado || 'Pendiente'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-500 text-sm">
                      {cita.ultimaNota || 'Sin notas'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-500 text-sm">
                      {cita.notaCita || 'Sin notas'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyDetailView;
