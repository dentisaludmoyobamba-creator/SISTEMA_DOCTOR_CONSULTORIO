import React, { useState } from 'react';
import CalendarGrid from '../components/CalendarGrid';
import MonthlyView from '../components/MonthlyView';
import DailyDetailView from '../components/DailyDetailView';
import Sidebar from '../components/Sidebar';
import AppointmentModal from '../components/AppointmentModal';
import DetailsModal from '../components/DetailsModal';
import { citas as citasIniciales, diasSemana } from '../data/mockData';

const Agenda = () => {
  const [citas, setCitas] = useState(citasIniciales);
  const [filtroDoctor, setFiltroDoctor] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [vistaActual, setVistaActual] = useState('semana');
  const [estadosSeleccionados, setEstadosSeleccionados] = useState(['todos']);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  // Estados para modales
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [editingCita, setEditingCita] = useState(null);
  const [newAppointmentSlot, setNewAppointmentSlot] = useState(null);

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
  const handleAppointmentDelete = (cita) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la cita de ${cita.paciente}?`)) {
      setCitas(prev => prev.filter(c => c.id !== cita.id));
    }
  };

  // Manejar click en slot vacío para crear nueva cita
  const handleSlotClick = (slot) => {
    setNewAppointmentSlot(slot);
    setEditingCita(null);
    setShowAppointmentModal(true);
  };

  // Guardar cita (crear o editar)
  const handleSaveCita = (citaData) => {
    if (editingCita) {
      // Editar cita existente
      setCitas(prev => prev.map(c => 
        c.id === editingCita.id ? citaData : c
      ));
    } else {
      // Crear nueva cita
      setCitas(prev => [...prev, citaData]);
    }
    
    // Limpiar estados
    setEditingCita(null);
    setNewAppointmentSlot(null);
  };

  // Función placeholder para agregar doctor
  const handleAddDoctor = () => {
    alert('Funcionalidad de agregar doctor próximamente');
  };

  // Manejar cambio de vista
  const handleVistaChange = (nuevaVista) => {
    setVistaActual(nuevaVista);
  };

  // Manejar toggle del sidebar
  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
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

  // Obtener fecha actual formateada
  const getCurrentWeekRange = () => {
    const firstDay = diasSemana[0];
    const lastDay = diasSemana[diasSemana.length - 1];
    
    return `${firstDay.dia} - ${lastDay.dia} ${new Date(lastDay.fecha).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}`;
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
              <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              
              <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="bg-gradient-to-r from-[#30B0B0] to-[#4A3C7B] text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg">
                Hoy
              </div>
              
              <div className="text-sm text-[#4A3C7B] font-medium">
                {getCurrentWeekRange()}
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
              
              <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200" title="Más opciones">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
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
          {vistaActual === 'semana' && (
            <CalendarGrid
              citas={citas}
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
        </div>
      </div>

      {/* Sidebar */}
      <div className={`hidden lg:block transition-all duration-300 ease-in-out ${
        isSidebarVisible ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'
      }`}>
        <Sidebar
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
        fechaInicial={newAppointmentSlot?.fecha}
        horaInicial={newAppointmentSlot?.hora}
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
    </div>
  );
};

export default Agenda;
