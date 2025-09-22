import React, { useState } from 'react';
import CalendarGrid from '../components/CalendarGrid';
import Sidebar from '../components/Sidebar';
import AppointmentModal from '../components/AppointmentModal';
import DetailsModal from '../components/DetailsModal';
import { citas as citasIniciales, diasSemana } from '../data/mockData';

const Agenda = () => {
  const [citas, setCitas] = useState(citasIniciales);
  const [filtroDoctor, setFiltroDoctor] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  
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

  // Obtener fecha actual formateada
  const getCurrentWeekRange = () => {
    const firstDay = diasSemana[0];
    const lastDay = diasSemana[diasSemana.length - 1];
    
    return `${firstDay.dia} - ${lastDay.dia} ${new Date(lastDay.fecha).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}`;
  };

  return (
    <div className="flex h-screen bg-gray-50 pt-24 sm:pt-28">
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header de la agenda */}
        <div className="bg-white shadow-sm border-b px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Agenda</h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Semana del {getCurrentWeekRange()}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Navegación de semana */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                  Hoy
                </div>
                
                <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Botón de nueva cita */}
              <button
                onClick={() => {
                  setNewAppointmentSlot({ fecha: diasSemana[0].fecha, hora: '09:00' });
                  setEditingCita(null);
                  setShowAppointmentModal(true);
                }}
                className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1 text-xs sm:text-sm"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Nueva Cita</span>
                <span className="sm:hidden">Nueva</span>
              </button>

              {/* Opciones adicionales */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" title="Configuración">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" title="Más opciones">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendario */}
        <div className="flex-1 p-1 sm:p-2 lg:p-4 xl:p-6 overflow-auto">
          <CalendarGrid
            citas={citas}
            filtroDoctor={filtroDoctor}
            filtroEstado={filtroEstado}
            onAppointmentClick={handleAppointmentClick}
            onAppointmentEdit={handleAppointmentEdit}
            onAppointmentDelete={handleAppointmentDelete}
            onSlotClick={handleSlotClick}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block">
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
