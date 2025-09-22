import React, { useState, useRef, useEffect } from 'react';
import { pacientes as pacientesData } from '../data/mockData';
import NewPatientModal from '../components/NewPatientModal';

const Pacientes = () => {
  const [activeTab, setActiveTab] = useState('mis-pacientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes] = useState(pacientesData);
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  // Asistencias - filtros y popovers
  const [lineaNegocio, setLineaNegocio] = useState('Todos los pacientes');
  const [estadoFiltro, setEstadoFiltro] = useState('Selecciona una opción');
  const [showLinea, setShowLinea] = useState(false);
  const [showEstado, setShowEstado] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const legendRef = useRef(null);
  const lineaRef = useRef(null);
  const estadoRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (legendRef.current && !legendRef.current.contains(e.target)) setShowLegend(false);
      if (lineaRef.current && !lineaRef.current.contains(e.target)) setShowLinea(false);
      if (estadoRef.current && !estadoRef.current.contains(e.target)) setShowEstado(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Filtrar pacientes según búsqueda
  const pacientesFiltrados = pacientes.filter(paciente => 
    paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.documento.includes(searchTerm)
  );

  const formatearFecha = (fecha) => {
    const hoy = new Date();
    const fechaCita = new Date(fecha);
    const diffTime = Math.abs(hoy - fechaCita);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    
    return fechaCita.toLocaleDateString('es-ES');
  };

  const getIconoEstado = (ultimaCita) => {
    const hoy = new Date();
    const fechaCita = new Date(ultimaCita);
    const diffTime = hoy - fechaCita;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      return (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 pt-24 sm:pt-28">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pacientes</h1>
            <button onClick={() => setIsNewPatientOpen(true)} className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Nuevo Paciente</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b">
            <button
              onClick={() => setActiveTab('mis-pacientes')}
              className={`pb-3 px-1 relative ${
                activeTab === 'mis-pacientes'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mis pacientes
            </button>
            <button
              onClick={() => setActiveTab('asistencias')}
              className={`pb-3 px-1 relative ${
                activeTab === 'asistencias'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Asistencias
            </button>
          </div>
        </div>

        {/* Filtros y búsqueda / barra superior dependiente de tab */}
        {activeTab === 'mis-pacientes' && (
          <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-3 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm sm:text-base text-gray-700 font-medium">Todos los pacientes</span>
                <span className="text-sm text-gray-500">{pacientesFiltrados.length} pacientes</span>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative flex-1 lg:flex-none">
                  <input
                    type="text"
                    placeholder="Buscar paciente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'asistencias' && (
          <div className="bg-sky-50/70 px-4 sm:px-6 py-3 sm:py-4 border-b">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-3 lg:space-y-0">
              <div className="flex items-center space-x-4">
                {/* Línea de negocio */}
                <div className="text-sm text-slate-600">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">Línea de negocio</div>
                  <div className="relative inline-block" ref={lineaRef}>
                    <button onClick={() => setShowLinea(!showLinea)} className="inline-flex items-center space-x-2 border rounded-md px-3 py-2 bg-white hover:bg-slate-50">
                      <span>{lineaNegocio}</span>
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    {showLinea && (
                      <div className="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg p-1">
                        {['Todos los pacientes','Ortodoncia','Estética','Rehabilitación'].map(opt => (
                          <button key={opt} onClick={() => { setLineaNegocio(opt); setShowLinea(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-700">
                            {opt}
                          </button>
                        ))}
                        <div className="border-t my-1" />
                        <button className="w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-slate-100 text-slate-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          <span>Configurar línea de negocio</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Estado */}
                <div className="text-sm text-slate-600">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">Estado</div>
                  <div className="relative inline-block" ref={estadoRef}>
                    <button onClick={() => setShowEstado(!showEstado)} className="inline-flex items-center space-x-2 border rounded-md px-3 py-2 bg-white hover:bg-slate-50 min-w-[220px] justify-between">
                      <span className="truncate mr-2">{estadoFiltro}</span>
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    {showEstado && (
                      <div className="absolute z-10 mt-1 w-[320px] bg-white rounded-md shadow-lg py-2">
                        {[{t:'Deudores',d:'Pacientes que no han realizado un pago en el mes a filtrar'},{t:'Sin cita programada',d:'Pacientes que no tienen una cita agendada en el mes a filtrar'},{t:'Ausentes',d:'Pacientes que tienen una cita con estado cancelado, reprogramado, ausente.'}].map(opt => (
                          <button key={opt.t} onClick={() => { setEstadoFiltro(opt.t); setShowEstado(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100">
                            <div className="text-slate-800">{opt.t}</div>
                            <div className="text-xs text-slate-500">{opt.d}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* leyenda colores */}
              <div className="relative" ref={legendRef}>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-300 text-[10px] text-white">10</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-400 text-[10px] text-white">15</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-400 text-[10px] text-white">20</span>
                  </div>
                  <button onClick={() => setShowLegend(!showLegend)} className="ml-1 p-2 rounded-md bg-white border hover:bg-slate-50">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v.01M12 12v.01M12 16v.01M12 20.5a8.5 8.5 0 100-17 8.5 8.5 0 000 17z"/></svg>
                  </button>
                </div>
                {showLegend && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-3 text-slate-700">
                    <div className="text-sm mb-2">El número dentro de cada círculo indica el día en la que se agendó la cita</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-3"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-[11px] text-white">10</span><span>El día 10 hubo/hay una cita en estado pendiente</span></div>
                      <div className="flex items-center space-x-3"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-400 text-[11px] text-white">15</span><span>El día 15 hubo una cita y fue cancelada</span></div>
                      <div className="flex items-center space-x-3"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-400 text-[11px] text-white">20</span><span>El día 20 hubo una cita y fue atendido</span></div>
                      <div className="flex items-center space-x-3"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-200 text-sky-700">$</span><span>En el mes hubo un pago registrado en caja</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabla de pacientes / contenido por tab */}
        {activeTab === 'mis-pacientes' && (
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-700 text-white sticky top-0">
                <tr>
                  <th className="text-left p-3 sm:p-4 font-medium">Paciente</th>
                  <th className="text-left p-3 sm:p-4 font-medium hidden sm:table-cell">Última cita</th>
                  <th className="text-left p-3 sm:p-4 font-medium hidden md:table-cell">Próxima cita</th>
                  <th className="text-left p-3 sm:p-4 font-medium hidden lg:table-cell">Tarea</th>
                  <th className="text-left p-3 sm:p-4 font-medium hidden lg:table-cell">Presupuesto</th>
                  <th className="text-left p-3 sm:p-4 font-medium hidden xl:table-cell">Fuente de captación</th>
                  <th className="text-left p-3 sm:p-4 font-medium hidden xl:table-cell">Comentario</th>
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map((paciente, index) => (
                  <tr key={paciente.id} className={`border-b hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm sm:text-lg">{paciente.avatar}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <span className="font-medium text-blue-600 truncate">{paciente.nombre} {paciente.apellido}</span>
                            {paciente.etiqueta && (<span className={`px-2 py-1 text-xs font-medium rounded-full ${paciente.etiquetaColor} flex-shrink-0`}>{paciente.etiqueta}</span>)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">DNI: {paciente.documento}</div>
                          <div className="sm:hidden mt-1">
                            <div className="text-xs text-gray-600">Última: {formatearFecha(paciente.ultimaCita)}</div>
                            {paciente.presupuesto > 0 && (<div className="text-xs text-green-600">S/ {paciente.presupuesto}</div>)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell"><div className="flex items-center space-x-2">{getIconoEstado(paciente.ultimaCita)}<span className="text-gray-700 text-sm">{formatearFecha(paciente.ultimaCita)}</span></div></td>
                    <td className="p-3 sm:p-4 hidden md:table-cell"><span className="text-gray-700 text-sm">{paciente.proximaCita ? formatearFecha(paciente.proximaCita) : '--'}</span></td>
                    <td className="p-3 sm:p-4 hidden lg:table-cell"><span className="text-gray-700 text-sm">{paciente.tarea || '--'}</span></td>
                    <td className="p-3 sm:p-4 hidden lg:table-cell"><span className="text-gray-700 text-sm">{paciente.presupuesto > 0 ? `S/ ${paciente.presupuesto}` : '--'}</span></td>
                    <td className="p-3 sm:p-4 hidden xl:table-cell"><span className="text-gray-700 text-sm">{paciente.fuenteCaptacion || '--'}</span></td>
                    <td className="p-3 sm:p-4 hidden xl:table-cell"><span className="text-gray-700 text-sm truncate max-w-xs block">{paciente.comentario || '--'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'asistencias' && (
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full min-w-[1000px]">
              <thead className="sticky top-0">
                <tr>
                  <th className="text-left p-3 sm:p-4 font-semibold bg-slate-700 text-white">Paciente</th>
                  {["mayo","junio","julio","agosto","septiembre","octubre"].map((m,idx)=> (
                    <th key={m} className={`text-left p-3 sm:p-4 font-semibold ${m==='septiembre' ? 'bg-teal-700 text-white' : 'bg-slate-700 text-white'}`}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map((p, idxRow) => (
                  <tr key={p.id} className="border-b">
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">{p.avatar}</div>
                        <div className="text-slate-700">{p.nombre} {p.apellido}</div>
                      </div>
                    </td>
                    {Array.from({length:6}).map((_, i) => (
                      <td key={i} className="p-3 sm:p-4">
                        {i===4 && idxRow===0 && (
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-400 text-[11px] text-white">15</span>
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-400 text-[11px] text-white">16</span>
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-100 text-sky-600">$</span>
                          </div>
                        )}
                        {i===4 && idxRow===2 && (
                          <div className="text-slate-500 text-sm">varias citas</div>
                        )}
                        {i===4 && idxRow===3 && (
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-400 text-[11px] text-white">15</span>
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-400 text-[11px] text-white">16</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer con paginación */}
        <div className="bg-white border-t px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                <span>😊</span>
                <span>¡Comienza aquí!</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{pacientesFiltrados.length} resultados</span>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <span className="px-3 py-1 bg-blue-600 text-white rounded">1</span>
                
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Mostrar</span>
                <select className="border border-gray-300 rounded px-2 py-1">
                  <option>20</option>
                  <option>50</option>
                  <option>100</option>
                </select>
                <span className="text-gray-600">resultados por página</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Nuevo Paciente */}
      <NewPatientModal
        isOpen={isNewPatientOpen}
        onClose={() => setIsNewPatientOpen(false)}
        onCreate={() => setIsNewPatientOpen(false)}
      />
    </div>
  );
};

export default Pacientes;
