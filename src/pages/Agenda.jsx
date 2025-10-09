import React, { useState, useEffect, useCallback, useRef } from 'react';
import CalendarGrid from '../components/CalendarGrid';
import MonthlyView from '../components/MonthlyView';
import DailyDetailView from '../components/DailyDetailView';
import Sidebar from '../components/Sidebar';
import AppointmentModal from '../components/AppointmentModal';
import DetailsModal from '../components/DetailsModal';
import CalendarModal from '../components/CalendarModal';
import UserModal from '../components/UserModal';
import DownloadCitasModal from '../components/DownloadCitasModal';
import DeletedCitasModal from '../components/DeletedCitasModal';
import citasService from '../services/citasService';
import authService from '../services/authService';
import usersService from '../services/usersService';

const Agenda = () => {
  const [citas, setCitas] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroDoctor, setFiltroDoctor] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [vistaActual, setVistaActual] = useState('semana');
  const [estadosSeleccionados, setEstadosSeleccionados] = useState(['todos']);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
  // Estados para modales
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [editingCita, setEditingCita] = useState(null);
  const [newAppointmentSlot, setNewAppointmentSlot] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showDeletedCitasModal, setShowDeletedCitasModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  
  const optionsMenuRef = useRef(null);
  
  // Configurar servicios
  useEffect(() => {
    citasService.setAuthService(authService);
    usersService.setAuthService(authService);
  }, []);

  // Cerrar menú de opciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cargar doctores
  const loadDoctores = useCallback(async () => {
    try {
      const result = await citasService.getDoctores();
      if (result.success) {
        // Mapear doctores para compatibilidad con el frontend
        const doctoresMapped = result.doctores.map((doctor, index) => ({
          id: doctor.id,
          nombre: doctor.nombre,
          nombres: doctor.nombres,
          apellidos: doctor.apellidos,
          color: `bg-${['blue', 'red', 'green', 'purple', 'yellow', 'pink'][index % 6]}-500`,
          colorLight: `bg-${['blue', 'red', 'green', 'purple', 'yellow', 'pink'][index % 6]}-100`,
          textColor: `text-${['blue', 'red', 'green', 'purple', 'yellow', 'pink'][index % 6]}-700`
        }));
        setDoctores(doctoresMapped);
      } else {
        console.error('Error al cargar doctores:', result.error);
        setError('Error al cargar doctores');
      }
    } catch (e) {
      console.error('Error de conexión al cargar doctores:', e);
      setError('Error de conexión al cargar doctores');
    }
  }, []);

  // Cargar citas según la vista actual
  const loadCitas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      const today = new Date(fechaActual);
      
      switch (vistaActual) {
        case 'semana':
          // Calcular inicio de semana (lunes)
          const startOfWeek = new Date(today);
          const day = startOfWeek.getDay();
          const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
          startOfWeek.setDate(diff);
          result = await citasService.getCitasSemana(startOfWeek.toISOString().split('T')[0]);
          break;
        case 'mes':
          result = await citasService.getCitasMes(today.getFullYear(), today.getMonth() + 1);
          break;
        case 'detallado-diario':
          result = await citasService.getCitasDia(today.toISOString().split('T')[0]);
          break;
        default:
          result = await citasService.getCitasSemana(today.toISOString().split('T')[0]);
      }

      if (result.success) {
        // Mapear citas para compatibilidad con el frontend
        const citasMapped = result.citas.map(cita => ({
          id: cita.id,
          paciente: cita.paciente,
          paciente_id: cita.paciente_id,
          doctorId: cita.doctor_id,
          doctor: cita.doctor,
          fecha: cita.fecha,
          hora: cita.hora,
          duracion: cita.duracion,
          estado: mapEstadoFromAPI(cita.estado),
          telefono: cita.telefono,
          motivo: cita.motivo,
          notas: cita.notas,
          fecha_hora: cita.fecha_hora
        }));
        setCitas(citasMapped);
      } else {
        console.error('Error al cargar citas:', result.error);
        setError('Error al cargar citas');
        setCitas([]);
      }
    } catch (e) {
      console.error('Error de conexión al cargar citas:', e);
      setError('Error de conexión al cargar citas');
      setCitas([]);
    } finally {
      setLoading(false);
    }
  }, [fechaActual, vistaActual, filtroDoctor, filtroEstado]);

  // Mapear estados de la API al frontend
  const mapEstadoFromAPI = (estado) => {
    const estadoMap = {
      'Programada': 'confirmado',
      'Confirmada': 'confirmado',
      'Realizada': 'atendida',
      'Cancelada': 'cancelado',
      'Pendiente': 'pendiente',
      'En consulta': 'en-consulta',
      'Ausente': 'ausente',
      'Reprogramada': 'reprogramada'
    };
    return estadoMap[estado] || 'pendiente';
  };

  // Mapear estados del frontend a la API
  const mapEstadoToAPI = (estado) => {
    const estadoMap = {
      'confirmado': 'Confirmada',
      'atendida': 'Realizada',
      'cancelado': 'Cancelada',
      'pendiente': 'Pendiente',
      'en-consulta': 'En consulta',
      'ausente': 'Ausente',
      'reprogramada': 'Reprogramada'
    };
    return estadoMap[estado] || 'Programada';
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadDoctores();
  }, [loadDoctores]);

  useEffect(() => {
    loadCitas();
  }, [loadCitas]);

  // Generar días de la semana basados en fechaActual
  const getDiasSemana = useCallback(() => {
    const today = new Date(fechaActual);
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
    startOfWeek.setDate(diff);
    
    const diasSemana = [];
    const nombresDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    for (let i = 0; i < 6; i++) {
      const fecha = new Date(startOfWeek);
      fecha.setDate(startOfWeek.getDate() + i);
      diasSemana.push({
        nombre: nombresDias[i],
        fecha: fecha.toISOString().split('T')[0],
        dia: fecha.getDate()
      });
    }
    
    return diasSemana;
  }, [fechaActual]);

  // Manejar click en cita para ver detalles
  const handleAppointmentClick = (cita) => {
    setSelectedCita(cita);
    setShowDetailsModal(true);
  };

  // Manejar edición de cita
  const handleAppointmentEdit = (cita) => {
    setEditingCita(cita);
    setShowAppointmentModal(true);
  };

  // Manejar eliminación de cita
  const handleAppointmentDelete = async (cita) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la cita de ${cita.paciente}?`)) {
      try {
        const result = await citasService.deleteCita(cita.id);
        if (result.success) {
          // Recargar las citas después de eliminar
          loadCitas();
        } else {
          alert(`Error al eliminar cita: ${result.error}`);
        }
      } catch (e) {
        alert('Error de conexión al eliminar cita');
      }
    }
  };

  // Manejar click en slot vacío para crear nueva cita
  const handleSlotClick = (slot) => {
    setNewAppointmentSlot(slot);
    setEditingCita(null);
    setShowAppointmentModal(true);
  };

  // Guardar cita (crear o editar)
  const handleSaveCita = async (citaData) => {
    try {
      if (editingCita) {
        // Editar cita existente
        const dataToUpdate = {
          id: editingCita.id,
          id_paciente: citaData.paciente_id,
          id_doctor: citaData.doctorId,
          fecha_hora: `${citaData.fecha}T${citaData.hora}:00`,
          motivo: citaData.motivo,
          estado: mapEstadoToAPI(citaData.estado),
          duracion: citaData.duracion,
          notas: citaData.notas || ''
        };
        
        const result = await citasService.updateCita(dataToUpdate);
        if (result.success) {
          // Recargar las citas después de actualizar
          loadCitas();
        } else {
          alert(`Error al actualizar cita: ${result.error}`);
          return; // No cerrar el modal si hay error
        }
      } else {
        // Crear nueva cita
        const dataToCreate = {
          id_paciente: citaData.paciente_id,
          id_doctor: citaData.doctorId,
          fecha_hora: `${citaData.fecha}T${citaData.hora}:00`,
          motivo: citaData.motivo,
          estado: mapEstadoToAPI(citaData.estado),
          duracion: citaData.duracion,
          notas: citaData.notas || ''
        };
        
        const result = await citasService.createCita(dataToCreate);
        if (result.success) {
          // Recargar las citas después de crear
          loadCitas();
        } else {
          alert(`Error al crear cita: ${result.error}`);
          return; // No cerrar el modal si hay error
        }
      }
      
      // Limpiar estados solo si la operación fue exitosa
      setEditingCita(null);
      setNewAppointmentSlot(null);
    } catch (e) {
      alert('Error de conexión al guardar cita');
    }
  };

  // Función para agregar doctor usando UserModal
  const handleAddDoctor = () => {
    setShowUserModal(true);
  };

  // Handler para cuando se guarda un usuario
  const handleUserSaved = async () => {
    setShowUserModal(false);
    // Recargar la lista de doctores
    await loadDoctores();
  };

  // Manejar cambio de vista
  const handleVistaChange = (nuevaVista) => {
    setVistaActual(nuevaVista);
  };

  // Manejar toggle del sidebar
  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Manejar navegación de fechas
  const handlePreviousPeriod = () => {
    const nuevaFecha = new Date(fechaActual);
    switch (vistaActual) {
      case 'semana':
        nuevaFecha.setDate(nuevaFecha.getDate() - 7);
        break;
      case 'mes':
        nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
        break;
      case 'detallado-diario':
        nuevaFecha.setDate(nuevaFecha.getDate() - 1);
        break;
      default:
        nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    }
    setFechaActual(nuevaFecha);
  };

  const handleNextPeriod = () => {
    const nuevaFecha = new Date(fechaActual);
    switch (vistaActual) {
      case 'semana':
        nuevaFecha.setDate(nuevaFecha.getDate() + 7);
        break;
      case 'mes':
        nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
        break;
      case 'detallado-diario':
        nuevaFecha.setDate(nuevaFecha.getDate() + 1);
        break;
      default:
        nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    }
    setFechaActual(nuevaFecha);
  };

  const handleGoToToday = () => {
    setFechaActual(new Date());
  };

  const handleCalendarOpen = () => {
    setShowCalendarModal(true);
  };

  const handleDateSelect = (selectedDate) => {
    setFechaActual(selectedDate);
    setShowCalendarModal(false);
  };

  // Manejar selección de estados (checkboxes)
  const handleEstadoToggle = (estado) => {
    if (estado === 'todos') {
      setEstadosSeleccionados(['todos']);
    } else {
      setEstadosSeleccionados(prev => {
        const nuevosEstados = prev.filter(e => e !== 'todos');
        if (nuevosEstados.includes(estado)) {
          const filtrados = nuevosEstados.filter(e => e !== estado);
          return filtrados.length === 0 ? ['todos'] : filtrados;
        } else {
          return [...nuevosEstados, estado];
        }
      });
    }
  };

  // Formatear fecha según el tipo de vista
  const getFormattedDate = () => {
    const date = fechaActual;
    
    switch (vistaActual) {
      case 'semana':
        // Calcular inicio y fin de semana
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
        startOfWeek.setDate(diff);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const startDay = startOfWeek.getDate();
        const endDay = endOfWeek.getDate();
        const month = startOfWeek.toLocaleDateString('es-ES', { month: 'short' });
        const year = startOfWeek.getFullYear();
        
        return `${startDay} ${month} - ${endDay} ${month} ${year}`;
        
      case 'mes':
        return date.toLocaleDateString('es-ES', { 
          month: 'long', 
          year: 'numeric' 
        });
        
      case 'detallado-diario':
        return date.toLocaleDateString('es-ES', { 
          weekday: 'long',
          day: 'numeric',
          month: 'short'
        });
        
      default:
        return date.toLocaleDateString('es-ES', { 
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
    }
  };

  // Opciones de vista
  const opcionesVista = [
    { value: 'semana', label: 'Por semana' },
    { value: 'mes', label: 'Por mes' },
    { value: 'detallado-diario', label: 'Detallado diario' },
    { value: 'detallado-doctor', label: 'Detallado por doctor' }
  ];

  // Opciones de estado
  const opcionesEstado = [
    { value: 'todos', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en-espera', label: 'En Espera' },
    { value: 'ausente', label: 'Ausente' },
    { value: 'confirmada', label: 'Confirmada' },
    { value: 'cancelada', label: 'Cancelada' },
    { value: 'en-consulta', label: 'En consulta' },
    { value: 'atendida', label: 'Atendida' },
    { value: 'reprogramada', label: 'Reprogramada' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 pt-24 sm:pt-28">
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header de la agenda */}
        <div className="bg-white shadow-sm border-b px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            {/* Sección izquierda: Navegación de fechas */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={handlePreviousPeriod}
                className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200"
                title="Período anterior"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={handleCalendarOpen}
                className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200"
                title="Abrir calendario"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              
              <button 
                onClick={handleNextPeriod}
                className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200"
                title="Siguiente período"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                onClick={handleGoToToday}
                className="bg-gradient-to-r from-[#30B0B0] to-[#4A3C7B] text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg hover:from-[#4A3C7B] hover:to-[#2D1B69] transition-all duration-300"
                title="Ir a hoy"
              >
                Hoy
              </button>
              
              <div className="text-sm text-[#4A3C7B] font-medium">
                {getFormattedDate()}
              </div>
            </div>

            {/* Sección central: Filtros */}
            <div className="flex items-center space-x-4">
              {/* Combo Estado */}
              <div className="relative">
                <select
                  value={estadosSeleccionados[0] || 'todos'}
                  onChange={(e) => handleEstadoToggle(e.target.value)}
                  className="bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200 min-w-[120px]"
                >
                  {opcionesEstado.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Combo Vista */}
              <div className="relative">
                <select
                  value={vistaActual}
                  onChange={(e) => handleVistaChange(e.target.value)}
                  className="bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200 min-w-[140px]"
                >
                  {opcionesVista.map((vista) => (
                    <option key={vista.value} value={vista.value}>
                      {vista.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sección derecha: Acciones */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200" title="Configuración">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200" title="Verificar">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <div className="relative" ref={optionsMenuRef}>
                <button 
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200" 
                  title="Más opciones"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {showOptionsMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowDownloadModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                    >
                      <svg className="w-4 h-4 text-[#30B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Descargar historial</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowDeletedCitasModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Citas eliminadas</span>
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleToggleSidebar}
                className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white p-2 rounded-lg hover:from-[#2D1B69] hover:to-[#1A0F3D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                title={isSidebarVisible ? "Ocultar barra lateral" : "Mostrar barra lateral"}
              >
                {isSidebarVisible ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Calendario */}
        <div className="flex-1 p-1 sm:p-2 lg:p-4 xl:p-6 overflow-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-[#4A3C7B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-gray-600">Cargando citas...</span>
            </div>
          ) : (
            <>
              {vistaActual === 'semana' && (
                <CalendarGrid
                  citas={citas}
                  doctores={doctores}
                  diasSemana={getDiasSemana()}
                  filtroDoctor={filtroDoctor}
                  filtroEstado={filtroEstado}
                  onAppointmentClick={handleAppointmentClick}
                  onAppointmentEdit={handleAppointmentEdit}
                  onAppointmentDelete={handleAppointmentDelete}
                  onSlotClick={handleSlotClick}
                />
              )}
          
              {vistaActual === 'mes' && (
                <MonthlyView
                  citas={citas}
                  onAppointmentClick={handleAppointmentClick}
                />
              )}
              
              {vistaActual === 'detallado-diario' && (
                <DailyDetailView
                  citas={citas}
                  fechaActual={fechaActual}
                  onAppointmentClick={handleAppointmentClick}
                />
              )}
              
              {vistaActual === 'detallado-doctor' && (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <div className="w-16 h-16 bg-[#30B0B0]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#30B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#4A3C7B] mb-2">Vista por Doctor</h3>
                  <p className="text-gray-500">Esta funcionalidad estará disponible próximamente</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className={`hidden lg:block transition-all duration-300 ease-in-out ${
        isSidebarVisible ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'
      }`}>
        <Sidebar
          doctores={doctores}
          filtroDoctor={filtroDoctor}
          setFiltroDoctor={setFiltroDoctor}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          onAddDoctor={handleAddDoctor}
        />
      </div>

      {/* Modales */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false);
          setEditingCita(null);
          setNewAppointmentSlot(null);
        }}
        onSave={handleSaveCita}
        cita={editingCita}
        doctores={doctores}
        fechaInicial={newAppointmentSlot?.fecha}
        horaInicial={newAppointmentSlot?.hora}
        citasService={citasService}
      />

      <DetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCita(null);
        }}
        cita={selectedCita}
        onEdit={handleAppointmentEdit}
        onDelete={handleAppointmentDelete}
      />

      <CalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        onDateSelect={handleDateSelect}
        currentDate={fechaActual}
      />

      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onUserSaved={handleUserSaved}
        editingUser={null}
      />

      <DownloadCitasModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        citasService={citasService}
      />

      <DeletedCitasModal
        isOpen={showDeletedCitasModal}
        onClose={() => setShowDeletedCitasModal(false)}
        citasService={citasService}
      />
    </div>
  );
};

export default Agenda;
