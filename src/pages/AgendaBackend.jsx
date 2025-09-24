import React, { useState, useEffect } from 'react';
import CalendarGrid from '../components/CalendarGrid';
import Sidebar from '../components/Sidebar';
import AppointmentModal from '../components/AppointmentModal';
import DetailsModal from '../components/DetailsModal';
import { appointmentsService, doctorsService } from '../services';
import { diasSemana } from '../data/mockData';

const AgendaBackend = () => {
  const [citas, setCitas] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [filtroDoctor, setFiltroDoctor] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para modales
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [editingCita, setEditingCita] = useState(null);
  const [newAppointmentSlot, setNewAppointmentSlot] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Cargar doctores y citas en paralelo
      const [doctorsData, appointmentsData] = await Promise.all([
        doctorsService.getDoctors(),
        appointmentsService.getAppointments()
      ]);
      
      setDoctores(doctorsData);
      setCitas(appointmentsData);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos. Verifica la conexión con el backend.');
    } finally {
      setIsLoading(false);
    }
  };

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
        await appointmentsService.deleteAppointment(cita.id);
        setCitas(prev => prev.filter(c => c.id !== cita.id));
      } catch (error) {
        console.error('Error eliminando cita:', error);
        alert('Error al eliminar la cita. Inténtalo de nuevo.');
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
        const updatedCita = await appointmentsService.updateAppointment(editingCita.id, citaData);
        setCitas(prev => prev.map(c => 
          c.id === editingCita.id ? updatedCita : c
        ));
      } else {
        // Crear nueva cita
        const newCita = await appointmentsService.createAppointment(citaData);
        setCitas(prev => [...prev, newCita]);
      }
      
      setShowAppointmentModal(false);
      setEditingCita(null);
      setNewAppointmentSlot(null);
      
    } catch (error) {
      console.error('Error guardando cita:', error);
      alert('Error al guardar la cita. Inténtalo de nuevo.');
    }
  };

  // Cambiar estado de cita
  const handleStatusChange = async (cita, newStatus) => {
    try {
      const updatedCita = await appointmentsService.updateAppointmentStatus(cita.id, newStatus);
      setCitas(prev => prev.map(c => 
        c.id === cita.id ? updatedCita : c
      ));
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar el estado. Inténtalo de nuevo.');
    }
  };

  // Filtrar citas
  const citasFiltradas = citas.filter(cita => {
    const matchDoctor = !filtroDoctor || cita.doctorId === filtroDoctor;
    const matchEstado = filtroEstado === 'todos' || cita.estado === filtroEstado;
    return matchDoctor && matchEstado;
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 pt-16">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando agenda...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 pt-16">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Error de conexión</span>
              </div>
              <p className="text-sm">{error}</p>
              <button 
                onClick={loadInitialData}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 pt-16">
      {/* Sidebar */}
      <Sidebar 
        doctores={doctores}
        filtroDoctor={filtroDoctor}
        filtroEstado={filtroEstado}
        onDoctorFilterChange={setFiltroDoctor}
        onEstadoFilterChange={setFiltroEstado}
      />
      
      {/* Contenido principal */}
      <div className="flex-1 overflow-hidden">
        <CalendarGrid 
          citas={citasFiltradas}
          diasSemana={diasSemana}
          onAppointmentClick={handleAppointmentClick}
          onAppointmentEdit={handleAppointmentEdit}
          onAppointmentDelete={handleAppointmentDelete}
          onSlotClick={handleSlotClick}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Modales */}
      {showAppointmentModal && (
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => {
            setShowAppointmentModal(false);
            setEditingCita(null);
            setNewAppointmentSlot(null);
          }}
          onSave={handleSaveCita}
          cita={editingCita}
          slot={newAppointmentSlot}
          doctores={doctores}
        />
      )}

      {showDetailsModal && selectedCita && (
        <DetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedCita(null);
          }}
          cita={selectedCita}
          onEdit={handleAppointmentEdit}
          onDelete={handleAppointmentDelete}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default AgendaBackend;
