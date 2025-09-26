import React from 'react';

const MonthlyView = ({ citas = [], onAppointmentClick }) => {
  // Generar días del mes actual
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  // Días del mes anterior
  const prevMonth = new Date(year, month - 1, 0);
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonth.getDate() - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonth.getDate() - i)
    });
  }
  
  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day)
    });
  }
  
  // Días del mes siguiente
  const remainingDays = 42 - days.length; // 6 semanas * 7 días
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day)
    });
  }

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Obtener citas para una fecha específica
  const getCitasForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return citas.filter(cita => cita.fecha === dateStr);
  };

  // Verificar si es hoy
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Verificar si es fin de semana
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Domingo o Sábado
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header del calendario mensual */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-[#4A3C7B] text-center">
          {monthNames[month]} {year}
        </h2>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 border-b">
        {dayNames.map((dayName) => (
          <div key={dayName} className="p-3 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-r last:border-r-0">
            <span className="text-sm font-semibold text-[#4A3C7B]">{dayName}</span>
          </div>
        ))}
      </div>

      {/* Grid del calendario */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const citasDelDia = getCitasForDate(day.date);
          const esHoy = isToday(day.date);
          const esFinDeSemana = isWeekend(day.date);
          
          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-b border-r last:border-r-0 cursor-pointer transition-all duration-200 ${
                day.isCurrentMonth 
                  ? 'bg-white hover:bg-[#30B0B0]/5' 
                  : 'bg-gray-50 text-gray-400'
              } ${esHoy ? 'bg-[#30B0B0]/10' : ''}`}
              onClick={() => citasDelDia.length > 0 && onAppointmentClick && onAppointmentClick(citasDelDia[0])}
            >
              {/* Número del día */}
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium ${
                  esHoy 
                    ? 'bg-[#30B0B0] text-white rounded-full w-6 h-6 flex items-center justify-center' 
                    : esFinDeSemana && day.isCurrentMonth
                    ? 'text-red-500'
                    : day.isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}>
                  {day.day}
                </span>
                
                {/* Contador de citas */}
                {citasDelDia.length > 0 && (
                  <span className="text-xs bg-[#4A3C7B] text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {citasDelDia.length}
                  </span>
                )}
              </div>

              {/* Indicadores de citas */}
              <div className="space-y-1">
                {citasDelDia.slice(0, 3).map((cita, citaIndex) => (
                  <div
                    key={citaIndex}
                    className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                    title={`${cita.hora} - ${cita.paciente}`}
                  >
                    {cita.hora} {cita.paciente}
                  </div>
                ))}
                {citasDelDia.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{citasDelDia.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyView;
