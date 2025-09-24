import { apiRequest } from './apiClient';
import { API_CONFIG } from '../config/api';

export const appointmentsService = {
  // Obtener todas las citas
  getAppointments: async (params = {}) => {
    try {
      const response = await apiRequest.get(API_CONFIG.ENDPOINTS.APPOINTMENTS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener una cita por ID
  getAppointmentById: async (id) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear una nueva cita
  createAppointment: async (appointmentData) => {
    try {
      const response = await apiRequest.post(API_CONFIG.ENDPOINTS.APPOINTMENTS, appointmentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar una cita
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await apiRequest.put(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`, appointmentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar una cita
  deleteAppointment: async (id) => {
    try {
      const response = await apiRequest.delete(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener citas por fecha
  getAppointmentsByDate: async (date) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/date/${date}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener citas por doctor
  getAppointmentsByDoctor: async (doctorId, params = {}) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/doctor/${doctorId}`, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener citas por paciente
  getAppointmentsByPatient: async (patientId) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/patient/${patientId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar estado de una cita
  updateAppointmentStatus: async (id, status) => {
    try {
      const response = await apiRequest.patch(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}/status`, {
        status: status
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener horarios disponibles
  getAvailableSlots: async (doctorId, date) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/available-slots`, {
        doctor_id: doctorId,
        date: date
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};
