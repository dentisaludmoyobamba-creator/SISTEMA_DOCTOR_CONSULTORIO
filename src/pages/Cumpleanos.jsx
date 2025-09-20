import React, { useState } from 'react';

const Cumpleanos = () => {
  const [activeTab, setActiveTab] = useState('cumpleanos');
  const [filtroFecha, setFiltroFecha] = useState('este-mes');
  const [filtroGrupo, setFiltroGrupo] = useState('ver-todos');
  const [filtroPlan, setFiltroPlan] = useState('ver-todos');
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);

  const pacientes = [
    {
      id: 1,
      nombre: 'Jeff Test apellido',
      fechaNacimiento: '1990-09-30',
      edad: 34,
      grupo: 'Adultos',
      plan: 'Sin plan de tratamiento',
      avatar: '👨‍💼',
      comentario: ''
    },
    {
      id: 2,
      nombre: 'Víctor Torres',
      fechaNacimiento: '1985-09-27',
      edad: 39,
      grupo: 'Adultos',
      plan: 'En curso',
      avatar: '👨‍⚕️',
      comentario: ''
    },
    {
      id: 3,
      nombre: 'Demo Gema',
      fechaNacimiento: '2023-09-26',
      edad: 1,
      grupo: 'Niños',
      plan: 'No iniciado',
      avatar: '👶',
      comentario: ''
    },
    {
      id: 4,
      nombre: 'Lupita Morales',
      fechaNacimiento: '1997-09-24',
      edad: 27,
      grupo: 'Adultos',
      plan: 'Terminado',
      avatar: '👩‍🎓',
      comentario: ''
    },
    {
      id: 5,
      nombre: 'Prueba Telefono registro',
      fechaNacimiento: '1992-09-23',
      edad: 32,
      grupo: 'Adultos',
      plan: 'En curso',
      avatar: '👨‍💻',
      comentario: ''
    },
    {
      id: 6,
      nombre: 'Alejandro DoctocliqH',
      fechaNacimiento: '1990-09-11',
      edad: 34,
      grupo: 'Adultos',
      plan: 'En curso',
      avatar: '👨‍🔬',
      comentario: 'GNP'
    }
  ];

  const formatearFecha = (fecha) => {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = meses[fechaObj.getMonth()];
    
    return `${dia} ${mes}`;
  };

  const obtenerDiasRestantes = (fecha) => {
    const hoy = new Date();
    const fechaCumple = new Date(fecha);
    
    // Establecer año actual para el cumpleaños
    fechaCumple.setFullYear(hoy.getFullYear());
    
    // Si el cumpleaños ya pasó este año, usar el próximo año
    if (fechaCumple < hoy) {
      fechaCumple.setFullYear(hoy.getFullYear() + 1);
    }
    
    const diffTime = fechaCumple - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="flex h-screen bg-gray-50 pt-14 sm:pt-16">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Cumpleaños</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Enviar Mensaje</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b">
            <button
              onClick={() => setActiveTab('cumpleanos')}
              className={`pb-3 px-1 relative ${
                activeTab === 'cumpleanos'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cumpleaños
            </button>
            <button
              onClick={() => setActiveTab('recordatorios')}
              className={`pb-3 px-1 relative ${
                activeTab === 'recordatorios'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Recordatorios
            </button>
            <button
              onClick={() => setActiveTab('campañas')}
              className={`pb-3 px-1 relative ${
                activeTab === 'campañas'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Campañas
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white px-6 py-4 border-b">
          <div className="flex items-center space-x-6">
            {/* Filtro por fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Por fecha</label>
              <select
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="este-mes">Este mes</option>
                <option value="proximo-mes">Próximo mes</option>
                <option value="este-trimestre">Este trimestre</option>
                <option value="este-año">Este año</option>
              </select>
            </div>

            {/* Filtro por grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
              <select
                value={filtroGrupo}
                onChange={(e) => setFiltroGrupo(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ver-todos">Ver Todos</option>
                <option value="adultos">Adultos</option>
                <option value="niños">Niños</option>
                <option value="adolescentes">Adolescentes</option>
              </select>
            </div>

            {/* Filtro por plan de tratamiento */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan de tratamiento</label>
              <button
                onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between w-48"
              >
                <span>
                  {filtroPlan === 'ver-todos' && 'Ver Todos'}
                  {filtroPlan === 'terminado' && 'Terminado'}
                  {filtroPlan === 'en-curso' && 'En curso'}
                  {filtroPlan === 'no-iniciado' && 'No iniciado'}
                  {filtroPlan === 'sin-plan' && 'Sin plan de tratamiento'}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isPlanDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      setFiltroPlan('ver-todos');
                      setIsPlanDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>Ver Todos</span>
                    {filtroPlan === 'ver-todos' && (
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setFiltroPlan('terminado');
                      setIsPlanDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>Terminado</span>
                  </button>
                  <button
                    onClick={() => {
                      setFiltroPlan('en-curso');
                      setIsPlanDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>En curso</span>
                  </button>
                  <button
                    onClick={() => {
                      setFiltroPlan('no-iniciado');
                      setIsPlanDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>No iniciado</span>
                  </button>
                  <button
                    onClick={() => {
                      setFiltroPlan('sin-plan');
                      setIsPlanDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>Sin plan de tratamiento</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabla de pacientes */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full">
            <thead className="bg-slate-700 text-white sticky top-0">
              <tr>
                <th className="text-left p-4 font-medium">Paciente</th>
                <th className="text-left p-4 font-medium">Fecha</th>
                <th className="text-left p-4 font-medium">Grupo</th>
                <th className="text-left p-4 font-medium">Comentario</th>
                <th className="text-left p-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente, index) => (
                <tr 
                  key={paciente.id} 
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                        {paciente.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{paciente.nombre}</div>
                        <div className="text-sm text-gray-500">
                          {paciente.edad} años • {obtenerDiasRestantes(paciente.fechaNacimiento)} días
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-700">
                      {formatearFecha(paciente.fechaNacimiento)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700">{paciente.grupo}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700">{paciente.comentario || '--'}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors" title="Enviar mensaje">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors" title="Programar cita">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-white border-t px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                <span>🎂</span>
                <span>¡Comienza aquí!</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{pacientes.length} pacientes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cumpleanos;
