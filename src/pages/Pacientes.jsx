import React, { useState, useRef, useEffect } from 'react';
import { pacientes as pacientesData } from '../data/mockData';
import NewPatientModal from '../components/NewPatientModal';
import HistoriaClinica from '../components/HistoriaClinica';

const Pacientes = () => {
  const [activeTab, setActiveTab] = useState('mis-pacientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes] = useState(pacientesData);
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [isPatientProfileOpen, setIsPatientProfileOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('citas');
  const [isHistoriaClinicaOpen, setIsHistoriaClinicaOpen] = useState(false);
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

  const handlePatientClick = (paciente) => {
    setSelectedPatient(paciente);
    setIsPatientProfileOpen(true);
    setActiveProfileTab('citas');
  };

  const handleOpenHistoriaClinica = () => {
    setIsHistoriaClinicaOpen(true);
    setIsPatientProfileOpen(false);
  };

  const handleCloseHistoriaClinica = () => {
    setIsHistoriaClinicaOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 pt-24 sm:pt-28">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[#4A3C7B]">Pacientes</h1>
            <button onClick={() => setIsNewPatientOpen(true)} className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white px-4 sm:px-6 py-2 rounded-xl hover:from-[#2D1B69] hover:to-[#1A0F3D] transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
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
              className={`pb-3 px-1 relative font-semibold transition-all duration-200 ${
                activeTab === 'mis-pacientes'
                  ? 'text-[#30B0B0] border-b-3 border-[#30B0B0]'
                  : 'text-gray-500 hover:text-[#4A3C7B] hover:border-b-2 hover:border-gray-300'
              }`}
            >
              Mis pacientes
            </button>
            <button
              onClick={() => setActiveTab('asistencias')}
              className={`pb-3 px-1 relative font-semibold transition-all duration-200 ${
                activeTab === 'asistencias'
                  ? 'text-[#30B0B0] border-b-3 border-[#30B0B0]'
                  : 'text-gray-500 hover:text-[#4A3C7B] hover:border-b-2 hover:border-gray-300'
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
                <span className="text-sm sm:text-base text-[#4A3C7B] font-semibold">Todos los pacientes</span>
                <span className="text-sm text-[#30B0B0] font-medium bg-[#30B0B0]/10 px-2 py-1 rounded-full">{pacientesFiltrados.length} pacientes</span>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative flex-1 lg:flex-none">
                  <input
                    type="text"
                    placeholder="Buscar paciente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full lg:w-80 pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] text-sm transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                  <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200">
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
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-3 text-slate-700 z-50 border border-gray-200">
                    <div className="text-sm mb-2 font-medium text-slate-800">El número dentro de cada círculo indica el día en la que se agendó la cita</div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-[11px] text-white font-medium">10</span>
                        <span className="text-slate-600">El día 10 hubo/hay una cita en estado pendiente</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-400 text-[11px] text-white font-medium">15</span>
                        <span className="text-slate-600">El día 15 hubo una cita y fue cancelada</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-400 text-[11px] text-white font-medium">20</span>
                        <span className="text-slate-600">El día 20 hubo una cita y fue atendido</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-200 text-sky-700 font-medium">$</span>
                        <span className="text-slate-600">En el mes hubo un pago registrado en caja</span>
                      </div>
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
              <thead className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white sticky top-0">
                <tr>
                  <th className="text-left p-3 sm:p-4 font-semibold">Paciente</th>
                  <th className="text-left p-3 sm:p-4 font-semibold hidden sm:table-cell">Última cita</th>
                  <th className="text-left p-3 sm:p-4 font-semibold hidden md:table-cell">Próxima cita</th>
                  <th className="text-left p-3 sm:p-4 font-semibold hidden lg:table-cell">Tarea</th>
                  <th className="text-left p-3 sm:p-4 font-semibold hidden lg:table-cell">Presupuesto</th>
                  <th className="text-left p-3 sm:p-4 font-semibold hidden xl:table-cell">Fuente de captación</th>
                  <th className="text-left p-3 sm:p-4 font-semibold hidden xl:table-cell">Comentario</th>
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map((paciente, index) => (
                  <tr key={paciente.id} onClick={() => handlePatientClick(paciente)} className={`border-b hover:bg-[#30B0B0]/5 cursor-pointer transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#4A3C7B] to-[#2D1B69] rounded-full flex items-center justify-center text-sm sm:text-lg text-white font-medium shadow-sm">{paciente.avatar}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <span className="font-semibold text-[#4A3C7B] truncate">{paciente.nombre} {paciente.apellido}</span>
                            {paciente.etiqueta && (<span className={`px-2 py-1 text-xs font-semibold rounded-full ${paciente.etiquetaColor} flex-shrink-0`}>{paciente.etiqueta}</span>)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">DNI: {paciente.documento}</div>
                          <div className="sm:hidden mt-1">
                            <div className="text-xs text-gray-600">Última: {formatearFecha(paciente.ultimaCita)}</div>
                            {paciente.presupuesto > 0 && (<div className="text-xs text-[#30B0B0] font-medium">S/ {paciente.presupuesto}</div>)}
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
                  <th className="text-left p-3 sm:p-4 font-semibold bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white">Paciente</th>
                  {["mayo","junio","julio","agosto","septiembre","octubre"].map((m,idx)=> (
                    <th key={m} className={`text-left p-3 sm:p-4 font-semibold ${m==='septiembre' ? 'bg-gradient-to-r from-[#30B0B0] to-[#2A9A9A] text-white' : 'bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white'}`}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map((p, idxRow) => (
                  <tr key={p.id} onClick={() => handlePatientClick(p)} className="border-b hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#4A3C7B] to-[#2D1B69] rounded-full flex items-center justify-center text-white font-medium">{p.avatar}</div>
                        <div className="text-slate-700 font-medium">{p.nombre} {p.apellido}</div>
                      </div>
                    </td>
                    {Array.from({length:6}).map((_, i) => (
                      <td key={i} className="p-3 sm:p-4">
                        {i===4 && idxRow===0 && (
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-400 text-[11px] text-white font-semibold shadow-sm">15</span>
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-[11px] text-white font-semibold shadow-sm">16</span>
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#30B0B0] text-white font-semibold shadow-sm">$</span>
                          </div>
                        )}
                        {i===4 && idxRow===2 && (
                          <div className="text-slate-500 text-sm font-medium">varias citas</div>
                        )}
                        {i===4 && idxRow===3 && (
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-[11px] text-white font-semibold shadow-sm">15</span>
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-500 text-[11px] text-white font-semibold shadow-sm">16</span>
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
              <div className="bg-gradient-to-r from-[#30B0B0] to-[#4A3C7B] text-white px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg">
                <span>😊</span>
                <span className="font-semibold">¡Comienza aquí!</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-[#4A3C7B] font-medium">{pacientesFiltrados.length} resultados</span>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <span className="px-3 py-1 bg-[#4A3C7B] text-white rounded-lg font-medium">1</span>
                
                <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Mostrar</span>
                <select className="border-2 border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200">
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

      {/* Modal: Perfil de Paciente */}
      {isPatientProfileOpen && selectedPatient && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPatientProfileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[800px] lg:w-[900px] bg-white shadow-2xl overflow-y-auto denti-animate-slide-in">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white">
              <div className="px-8 py-6 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedPatient.nombre} {selectedPatient.apellido}</h3>
                      <p className="text-sm text-white/80">Paciente desde el 22 sep 2025</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleOpenHistoriaClinica}
                    className="bg-[#30B0B0] hover:bg-[#2A9A9A] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Historia Clínica</span>
                  </button>
                </div>
                <button onClick={() => setIsPatientProfileOpen(false)} className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Información del paciente */}
            <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4A3C7B] to-[#2D1B69] rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg">
                  {selectedPatient.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-2xl font-bold text-[#4A3C7B] mb-2">{selectedPatient.nombre} {selectedPatient.apellido}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="w-5 h-5 text-[#30B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">22 años</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="w-5 h-5 text-[#30B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="font-medium">956224010</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Satisfacción:</span>
                            <div className="flex items-center space-x-1">
                              {[1,2,3,4,5].map((star) => (
                                <svg key={star} className={`w-4 h-4 ${star <= 3 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-sm text-gray-600 ml-1">(3/5)</span>
                            </div>
                          </div>
                          {selectedPatient.etiqueta && (
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${selectedPatient.etiquetaColor}`}>
                              {selectedPatient.etiqueta}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="bg-[#30B0B0] hover:bg-[#2A9A9A] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Agregar</span>
                      </button>
                      <button className="bg-white border-2 border-[#4A3C7B] text-[#4A3C7B] hover:bg-[#4A3C7B] hover:text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nota general */}
            <div className="p-8 border-b bg-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-[#30B0B0] rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-[#4A3C7B]">Nota general</h4>
              </div>
              <textarea 
                className="w-full h-24 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] resize-none transition-all duration-300 bg-gray-50 focus:bg-white" 
                placeholder="Escribe aquí observaciones importantes sobre el paciente..."
              />
            </div>

            {/* Tabs */}
            <div className="border-b bg-white">
              <nav className="flex space-x-8 px-8">
                {[
                  { id: 'citas', label: 'Citas', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { id: 'filiacion', label: 'Filiación', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                  { id: 'presupuestos', label: 'Presupuestos', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
                  { id: 'tareas', label: 'Tareas', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProfileTab(tab.id)}
                    className={`py-4 px-2 border-b-3 font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${
                      activeProfileTab === tab.id
                        ? 'border-[#30B0B0] text-[#30B0B0]'
                        : 'border-transparent text-gray-500 hover:text-[#4A3C7B] hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Contenido de tabs */}
            <div className="flex-1 p-8 bg-gray-50">
              {activeProfileTab === 'citas' && (
                <div>
                  {/* Header de la tabla */}
                  <div className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white rounded-t-xl">
                    <div className="grid grid-cols-5 gap-4 px-6 py-4 text-sm font-semibold">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Fecha</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Doctor</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Motivo</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Estado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span>Comentario</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Estado vacío mejorado */}
                  <div className="bg-white rounded-b-xl border border-gray-200 min-h-96 flex flex-col items-center justify-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#30B0B0] to-[#4A3C7B] rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-[#4A3C7B] mb-2">No hay citas registradas</h3>
                    <p className="text-gray-500 text-center mb-6 max-w-md">
                      Este paciente aún no tiene citas programadas. Puedes agregar una nueva cita desde la agenda.
                    </p>
                    <button className="bg-[#30B0B0] hover:bg-[#2A9A9A] text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Agregar Cita</span>
                    </button>
                  </div>

                  {/* Paginación mejorada */}
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-600">
                      Mostrando 0 de 0 registros
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="px-3 py-1 bg-[#4A3C7B] text-white rounded-lg text-sm font-medium">1</span>
                      <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeProfileTab === 'filiacion' && (
                <div className="bg-white rounded-xl border border-gray-200 min-h-96 flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#30B0B0] to-[#4A3C7B] rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#4A3C7B] mb-2">Información de Filiación</h3>
                  <p className="text-gray-500 text-center mb-6 max-w-md">
                    Aquí se mostrará la información personal y de contacto del paciente.
                  </p>
                  <button className="bg-[#30B0B0] hover:bg-[#2A9A9A] text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Agregar Información</span>
                  </button>
                </div>
              )}

              {activeProfileTab === 'presupuestos' && (
                <div className="bg-white rounded-xl border border-gray-200 min-h-96 flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#30B0B0] to-[#4A3C7B] rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#4A3C7B] mb-2">Presupuestos del Paciente</h3>
                  <p className="text-gray-500 text-center mb-6 max-w-md">
                    Gestiona los presupuestos y tratamientos propuestos para este paciente.
                  </p>
                  <button className="bg-[#30B0B0] hover:bg-[#2A9A9A] text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Crear Presupuesto</span>
                  </button>
                </div>
              )}

              {activeProfileTab === 'tareas' && (
                <div className="bg-white rounded-xl border border-gray-200 min-h-96 flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#30B0B0] to-[#4A3C7B] rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#4A3C7B] mb-2">Tareas Pendientes</h3>
                  <p className="text-gray-500 text-center mb-6 max-w-md">
                    Organiza y gestiona las tareas relacionadas con este paciente.
                  </p>
                  <button className="bg-[#30B0B0] hover:bg-[#2A9A9A] text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Agregar Tarea</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Historia Clínica */}
      {isHistoriaClinicaOpen && selectedPatient && (
        <HistoriaClinica
          paciente={selectedPatient}
          onClose={handleCloseHistoriaClinica}
        />
      )}
    </div>
  );
};

export default Pacientes;
