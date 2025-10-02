import React, { useState, useRef, useEffect } from 'react';
import patientsService from '../services/patientsService';
import authService from '../services/authService';
import NewPatientModal from '../components/NewPatientModal';
import HistoriaClinica from '../components/HistoriaClinica';

const Pacientes = () => {
  const [activeTab, setActiveTab] = useState('mis-pacientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [isPatientProfileOpen, setIsPatientProfileOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('citas');
  const [isHistoriaClinicaOpen, setIsHistoriaClinicaOpen] = useState(false);
  const [patientCitas, setPatientCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(false);
  const [patientFiliacion, setPatientFiliacion] = useState(null);
  const [loadingFiliacion, setLoadingFiliacion] = useState(false);
  const [editingFiliacion, setEditingFiliacion] = useState(false);
  const [filiacionForm, setFiliacionForm] = useState({});
  const [tareasManuales, setTareasManuales] = useState([]);
  const [tareasAutomaticas, setTareasAutomaticas] = useState([]);
  const [loadingTareas, setLoadingTareas] = useState(false);
  const [expandedManuales, setExpandedManuales] = useState(true);
  const [expandedAutomaticas, setExpandedAutomaticas] = useState(true);
  const [editingNota, setEditingNota] = useState(false);
  const [tempNota, setTempNota] = useState('');
  const [savingNota, setSavingNota] = useState(false);
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

  // Cargar pacientes desde API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        patientsService.setAuthService(authService);
        const result = await patientsService.list({ page: pagination.page, limit: pagination.limit, search: searchTerm });
        if (result.success) {
          const mapped = result.patients.map(p => ({
            id: p.id,
            nombre: p.nombres,
            apellido: p.apellidos,
            documento: p.documento || '',
            ultimaCita: p.ultima_cita,
            proximaCita: p.proxima_cita,
            tarea: p.tarea || '',
            presupuesto: p.presupuesto || 0,
            fuenteCaptacion: p.fuente_captacion || '',
            comentario: p.comentario || '',
            avatar: (p.nombres && p.nombres[0]) ? p.nombres[0].toUpperCase() : 'P',
            etiqueta: null,
            etiquetaColor: 'bg-slate-200'
          }));
          setPacientes(mapped);
          setPagination(result.pagination);
        } else {
          setError(result.error || 'Error al cargar pacientes');
        }
      } catch (e) {
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pagination.page, pagination.limit, searchTerm]);

  // Lista ya viene filtrada desde backend
  const pacientesFiltrados = pacientes;

  const formatearFecha = (fecha) => {
    if (!fecha || fecha === null || fecha === 'null') return '--';
    
    const hoy = new Date();
    const fechaCita = new Date(fecha);
    
    // Verificar si la fecha es válida
    if (isNaN(fechaCita.getTime())) return '--';
    
    const diffTime = Math.abs(hoy - fechaCita);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    
    return fechaCita.toLocaleDateString('es-ES');
  };

  const getIconoEstado = (ultimaCita) => {
    if (!ultimaCita || ultimaCita === null || ultimaCita === 'null') {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    }
    
    const hoy = new Date();
    const fechaCita = new Date(ultimaCita);
    
    // Verificar si la fecha es válida
    if (isNaN(fechaCita.getTime())) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    }
    
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

  const handlePatientClick = async (paciente) => {
    setSelectedPatient(paciente);
    setIsPatientProfileOpen(true);
    setActiveProfileTab('citas');
    
    // Cargar citas del paciente
    setLoadingCitas(true);
    try {
      const result = await patientsService.getCitas(paciente.id);
      if (result.success) {
        setPatientCitas(result.citas);
      } else {
        console.error('Error al cargar citas:', result.error);
        setPatientCitas([]);
      }
    } catch (e) {
      console.error('Error de conexión al cargar citas:', e);
      setPatientCitas([]);
    } finally {
      setLoadingCitas(false);
    }

    // Cargar filiación del paciente
    setLoadingFiliacion(true);
    try {
      const result = await patientsService.getFiliacion(paciente.id);
      if (result.success) {
        setPatientFiliacion(result.filiacion);
        setFiliacionForm(result.filiacion);
      } else {
        console.error('Error al cargar filiación:', result.error);
        setPatientFiliacion(null);
      }
    } catch (e) {
      console.error('Error de conexión al cargar filiación:', e);
      setPatientFiliacion(null);
    } finally {
      setLoadingFiliacion(false);
    }

    // Cargar tareas del paciente
    setLoadingTareas(true);
    try {
      const result = await patientsService.getTareas(paciente.id);
      if (result.success) {
        setTareasManuales(result.tareas_manuales || []);
        setTareasAutomaticas(result.tareas_automaticas || []);
      } else {
        console.error('Error al cargar tareas:', result.error);
        setTareasManuales([]);
        setTareasAutomaticas([]);
      }
    } catch (e) {
      console.error('Error de conexión al cargar tareas:', e);
      setTareasManuales([]);
      setTareasAutomaticas([]);
    } finally {
      setLoadingTareas(false);
    }
  };

  const handleOpenHistoriaClinica = () => {
    setIsHistoriaClinicaOpen(true);
    setIsPatientProfileOpen(false);
  };

  const handleEditFiliacion = () => {
    setEditingFiliacion(true);
  };

  const handleCancelEditFiliacion = () => {
    setEditingFiliacion(false);
    setFiliacionForm(patientFiliacion || {});
  };

  const handleFiliacionFormChange = (field, value) => {
    setFiliacionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveFiliacion = async () => {
    try {
      setLoadingFiliacion(true);
      const result = await patientsService.updateFiliacion(filiacionForm);
      if (result.success) {
        setPatientFiliacion(filiacionForm);
        setEditingFiliacion(false);
        // Recargar la lista de pacientes para reflejar cambios
        setPagination(p => ({ ...p }));
      } else {
        alert(result.error || 'Error al actualizar filiación');
      }
    } catch (e) {
      alert('Error de conexión con el servidor');
    } finally {
      setLoadingFiliacion(false);
    }
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
                <span className="text-sm text-[#30B0B0] font-medium bg-[#30B0B0]/10 px-2 py-1 rounded-full">{pagination.total} pacientes</span>
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
            {error && (
              <div className="p-4 text-red-700 bg-red-50 border-b">{error}</div>
            )}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-[#4A3C7B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2 text-gray-600">Cargando pacientes...</span>
              </div>
            ) : (
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
            )}
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
              <span className="text-[#4A3C7B] font-medium">{pagination.total} resultados</span>
              
              <div className="flex items-center space-x-2">
                <button disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))} className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200 disabled:opacity-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <span className="px-3 py-1 bg-[#4A3C7B] text-white rounded-lg font-medium">{pagination.page}</span>
                
                <button disabled={pagination.page >= pagination.pages} onClick={() => setPagination(p => ({ ...p, page: Math.min(p.pages, p.page + 1) }))} className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200 disabled:opacity-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Mostrar</span>
                <select value={pagination.limit} onChange={(e) => setPagination(p => ({ ...p, limit: Number(e.target.value), page: 1 }))} className="border-2 border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200">
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
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
        onCreate={async (form) => {
          try {
            patientsService.setAuthService(authService);
            const payload = {
              documento: form.documento,
              nombres: form.nombres,
              apellidos: form.apellidos,
              telefono: form.telefono,
              email: form.email,
              nacimiento: form.nacimiento,
              fuente: form.fuente,
              aseguradora: form.aseguradora,
              linea_negocio: form.linea_negocio,
              genero: 'Hombre'
            };
            const res = await patientsService.create(payload);
            if (res.success) {
              setIsNewPatientOpen(false);
              // recargar lista
              setPagination(p => ({ ...p }));
            } else {
              alert(res.error || 'Error al crear paciente');
            }
          } catch (e) {
            alert('Error de conexión con el servidor');
          }
        }}
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#30B0B0] rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-[#4A3C7B]">Nota general</h4>
                </div>
                {!editingNota && (
                  <button
                    onClick={() => { setEditingNota(true); setTempNota(patientFiliacion?.comentario || ''); }}
                    className="bg-[#30B0B0] hover:bg-[#2A9A9A] text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Editar</span>
                  </button>
                )}
              </div>

              {editingNota ? (
                <div>
                  <textarea
                    value={tempNota}
                    onChange={(e) => setTempNota(e.target.value)}
                    className="w-full h-28 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] resize-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Escribe aquí observaciones importantes sobre el paciente..."
                  />
                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={async () => {
                        try {
                          setSavingNota(true);
                          patientsService.setAuthService(authService);
                          const res = await patientsService.updateFiliacion({ id: selectedPatient.id, comentario: tempNota });
                          if (res.success) {
                            setPatientFiliacion((prev) => prev ? { ...prev, comentario: tempNota } : prev);
                            setEditingNota(false);
                            // refrescar lista
                            setPagination(p => ({ ...p }));
                          } else {
                            alert(res.error || 'Error al guardar nota');
                          }
                        } catch (e) {
                          alert('Error de conexión con el servidor');
                        } finally {
                          setSavingNota(false);
                        }
                      }}
                      disabled={savingNota}
                      className="bg-[#4A3C7B] hover:bg-[#3A2C6B] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                    >
                      {savingNota ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={() => { setEditingNota(false); setTempNota(patientFiliacion?.comentario || ''); }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-xl text-gray-900 min-h-[80px]">
                  {patientFiliacion?.comentario ? (
                    <p className="whitespace-pre-wrap text-sm">{patientFiliacion.comentario}</p>
                  ) : (
                    <span className="text-sm text-gray-500">Sin notas registradas</span>
                  )}
                </div>
              )}
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
                  
                  {/* Tabla de citas */}
                  {loadingCitas ? (
                    <div className="bg-white rounded-b-xl border border-gray-200 min-h-96 flex items-center justify-center py-16">
                      <div className="flex items-center space-x-3">
                        <svg className="animate-spin h-6 w-6 text-[#4A3C7B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-600">Cargando citas...</span>
                      </div>
                    </div>
                  ) : patientCitas.length > 0 ? (
                    <div className="bg-white rounded-b-xl border border-gray-200">
                      <div className="divide-y divide-gray-200">
                        {patientCitas.map((cita) => (
                          <div key={cita.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                            <div className="grid grid-cols-5 gap-4 items-center">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#30B0B0] to-[#4A3C7B] rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div>
                                  <div className="font-medium text-[#4A3C7B]">
                                    {cita.fecha_hora ? new Date(cita.fecha_hora).toLocaleDateString('es-PE') : '--'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {cita.fecha_hora ? new Date(cita.fecha_hora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '--'}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{cita.doctor || '--'}</div>
                              </div>
                              <div>
                                <div className="text-gray-700">{cita.motivo || '--'}</div>
                              </div>
                              <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  cita.estado === 'Realizada' 
                                    ? 'bg-green-100 text-green-800'
                                    : cita.estado === 'Programada'
                                    ? 'bg-blue-100 text-blue-800'
                                    : cita.estado === 'Cancelada'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {cita.estado || '--'}
                                </span>
                              </div>
                              <div>
                                <div className="text-gray-700 text-sm">{cita.comentario || '--'}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
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
                  )}

                  {/* Paginación mejorada */}
                  {patientCitas.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-600">
                        Mostrando {patientCitas.length} de {patientCitas.length} citas
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
                  )}
                </div>
              )}

              {activeProfileTab === 'filiacion' && (
                <div>
                  {loadingFiliacion ? (
                    <div className="bg-white rounded-xl border border-gray-200 min-h-96 flex items-center justify-center py-16">
                      <div className="flex items-center space-x-3">
                        <svg className="animate-spin h-6 w-6 text-[#4A3C7B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-600">Cargando información...</span>
                      </div>
                    </div>
                  ) : patientFiliacion ? (
                    <div className="bg-white rounded-xl border border-gray-200">
                      {/* Header con botones de acción */}
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-[#4A3C7B]">Información de Filiación</h3>
                          <div className="flex space-x-3">
                            {!editingFiliacion ? (
                              <button
                                onClick={handleEditFiliacion}
                                className="bg-[#30B0B0] hover:bg-[#2A9A9A] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Editar</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={handleCancelEditFiliacion}
                                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={handleSaveFiliacion}
                                  disabled={loadingFiliacion}
                                  className="bg-[#4A3C7B] hover:bg-[#3A2C6B] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                  {loadingFiliacion ? (
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                  <span>Guardar</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Formulario de filiación */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Columna izquierda */}
                          <div className="space-y-6">
                            {/* Teléfono */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teléfono
                              </label>
                              {editingFiliacion ? (
                                <input
                                  type="tel"
                                  value={filiacionForm.telefono || ''}
                                  onChange={(e) => handleFiliacionFormChange('telefono', e.target.value)}
                                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-300"
                                  placeholder="Ingrese el teléfono"
                                />
                              ) : (
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                                  {patientFiliacion.telefono || '--'}
                                </div>
                              )}
                            </div>

                            {/* E-mail */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                E-mail
                              </label>
                              {editingFiliacion ? (
                                <input
                                  type="email"
                                  value={filiacionForm.email || ''}
                                  onChange={(e) => handleFiliacionFormChange('email', e.target.value)}
                                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-300"
                                  placeholder="Ingrese el email"
                                />
                              ) : (
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                                  {patientFiliacion.email || '--'}
                                </div>
                              )}
                            </div>

                            {/* Fuente de captación */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fuente de captación
                              </label>
                              {editingFiliacion ? (
                                <select
                                  value={filiacionForm.fuente_captacion || ''}
                                  onChange={(e) => handleFiliacionFormChange('fuente_captacion', e.target.value)}
                                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-300"
                                >
                                  <option value="">Seleccionar fuente</option>
                                  <option value="Facebook">Facebook</option>
                                  <option value="Instagram">Instagram</option>
                                  <option value="Recomendación">Recomendación</option>
                                  <option value="Google">Google</option>
                                  <option value="Otros">Otros</option>
                                </select>
                              ) : (
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                                  {patientFiliacion.fuente_captacion || '--'}
                                </div>
                              )}
                            </div>

                            {/* Adicional */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Adicional
                              </label>
                              {editingFiliacion ? (
                                <input
                                  type="text"
                                  value={filiacionForm.direccion || ''}
                                  onChange={(e) => handleFiliacionFormChange('direccion', e.target.value)}
                                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-300"
                                  placeholder="Ingrese información adicional"
                                />
                              ) : (
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                                  {patientFiliacion.direccion || '--'}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Columna derecha */}
                          <div className="space-y-6">
                            {/* N° HC */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                N° HC
                              </label>
                              <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                                {patientFiliacion.id || '--'}
                              </div>
                            </div>

                            {/* Grupo */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Grupo
                              </label>
                              {editingFiliacion ? (
                                <select
                                  value={filiacionForm.aseguradora || ''}
                                  onChange={(e) => handleFiliacionFormChange('aseguradora', e.target.value)}
                                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-300"
                                >
                                  <option value="">Seleccionar aseguradora</option>
                                  <option value="Rimac">Rimac</option>
                                  <option value="Pacífico">Pacífico</option>
                                  <option value="La Positiva">La Positiva</option>
                                  <option value="Mapfre">Mapfre</option>
                                  <option value="Otros">Otros</option>
                                </select>
                              ) : (
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                                  {patientFiliacion.aseguradora || '--'}
                                </div>
                              )}
                            </div>

                            {/* Línea de negocio */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Línea de negocio
                              </label>
                              {editingFiliacion ? (
                                <select
                                  value={filiacionForm.linea_negocio || ''}
                                  onChange={(e) => handleFiliacionFormChange('linea_negocio', e.target.value)}
                                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-300"
                                >
                                  <option value="">Seleccionar línea</option>
                                  <option value="Ortodoncia">Ortodoncia</option>
                                  <option value="Estética">Estética</option>
                                  <option value="General">General</option>
                                  <option value="Endodoncia">Endodoncia</option>
                                  <option value="Cirugía">Cirugía</option>
                                </select>
                              ) : (
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                                  {patientFiliacion.linea_negocio || '--'}
                                </div>
                              )}
                            </div>

                            {/* Comentario */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comentario
                              </label>
                              {editingFiliacion ? (
                                <textarea
                                  value={filiacionForm.comentario || ''}
                                  onChange={(e) => handleFiliacionFormChange('comentario', e.target.value)}
                                  rows={3}
                                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-300 resize-none"
                                  placeholder="Ingrese comentarios adicionales"
                                />
                              ) : (
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-900 min-h-[80px]">
                                  {patientFiliacion.comentario || '--'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 min-h-96 flex flex-col items-center justify-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#30B0B0] to-[#4A3C7B] rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-[#4A3C7B] mb-2">No se pudo cargar la información</h3>
                      <p className="text-gray-500 text-center mb-6 max-w-md">
                        Hubo un error al cargar la información de filiación del paciente.
                      </p>
                    </div>
                  )}
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
                <div className="space-y-6">
                  {loadingTareas ? (
                    <div className="bg-white rounded-xl border border-gray-200 min-h-96 flex items-center justify-center py-16">
                      <div className="flex items-center space-x-3">
                        <svg className="animate-spin h-6 w-6 text-[#4A3C7B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-600">Cargando tareas...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Tareas Manuales */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white px-6 py-4 cursor-pointer flex items-center justify-between"
                          onClick={() => setExpandedManuales(!expandedManuales)}
                        >
                          <h3 className="text-lg font-semibold">Manuales</h3>
                          <svg 
                            className={`w-5 h-5 transition-transform duration-200 ${expandedManuales ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        {expandedManuales && (
                          <div>
                            {/* Header de la tabla */}
                            <div className="bg-gray-50 border-b">
                              <div className="grid grid-cols-5 gap-4 px-6 py-3 text-sm font-semibold text-gray-700">
                                <div>Nombre de la tarea</div>
                                <div>F. creación</div>
                                <div>Estado</div>
                                <div>Responsable</div>
                                <div>Descripción</div>
                              </div>
                            </div>
                            
                            {/* Contenido de la tabla */}
                            {tareasManuales.length > 0 ? (
                              <div className="divide-y divide-gray-200">
                                {tareasManuales.map((tarea) => (
                                  <div key={tarea.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                    <div className="grid grid-cols-5 gap-4 items-center">
                                      <div className="font-medium text-[#4A3C7B]">{tarea.nombre}</div>
                                      <div className="text-gray-700">{tarea.fecha_creacion}</div>
                                      <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          tarea.estado === 'Completada' 
                                            ? 'bg-green-100 text-green-800'
                                            : tarea.estado === 'Pendiente'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {tarea.estado}
                                        </span>
                                      </div>
                                      <div className="text-gray-700">{tarea.responsable}</div>
                                      <div className="text-gray-700 text-sm">{tarea.descripcion}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-12 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </div>
                                <p className="text-gray-500 text-center">No se encontró ninguna información</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Tareas Automáticas */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white px-6 py-4 cursor-pointer flex items-center justify-between"
                          onClick={() => setExpandedAutomaticas(!expandedAutomaticas)}
                        >
                          <h3 className="text-lg font-semibold">Automáticas</h3>
                          <svg 
                            className={`w-5 h-5 transition-transform duration-200 ${expandedAutomaticas ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        {expandedAutomaticas && (
                          <div>
                            {/* Header de la tabla */}
                            <div className="bg-gray-50 border-b">
                              <div className="grid grid-cols-6 gap-4 px-6 py-3 text-sm font-semibold text-gray-700">
                                <div>Tipo de mensaje</div>
                                <div>Plantilla enviada</div>
                                <div>Enviado por</div>
                                <div>F. envío</div>
                                <div>Hora envío</div>
                                <div>Estado</div>
                              </div>
                            </div>
                            
                            {/* Contenido de la tabla */}
                            {tareasAutomaticas.length > 0 ? (
                              <div className="divide-y divide-gray-200">
                                {tareasAutomaticas.map((tarea) => (
                                  <div key={tarea.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                    <div className="grid grid-cols-6 gap-4 items-center">
                                      <div className="font-medium text-[#4A3C7B]">{tarea.tipo_mensaje}</div>
                                      <div className="text-gray-700">{tarea.plantilla}</div>
                                      <div className="text-gray-700">{tarea.enviado_por}</div>
                                      <div className="text-gray-700">{tarea.fecha_envio}</div>
                                      <div className="text-gray-700">{tarea.hora_envio}</div>
                                      <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          tarea.estado === 'Enviado' 
                                            ? 'bg-green-100 text-green-800'
                                            : tarea.estado === 'Pendiente'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {tarea.estado}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-12 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </div>
                                <p className="text-gray-500 text-center">No se encontró ninguna información</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
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
