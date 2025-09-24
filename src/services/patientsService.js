import { apiRequest } from './apiClient';
import { API_CONFIG } from '../config/api';

export const patientsService = {
  // Obtener todos los pacientes
  getPatients: async (params = {}) => {
    try {
      const response = await apiRequest.get(API_CONFIG.ENDPOINTS.PATIENTS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener un paciente por ID
  getPatientById: async (id) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.PATIENTS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo paciente
  createPatient: async (patientData) => {
    try {
      const response = await apiRequest.post(API_CONFIG.ENDPOINTS.PATIENTS, patientData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un paciente
  updatePatient: async (id, patientData) => {
    try {
      const response = await apiRequest.put(`${API_CONFIG.ENDPOINTS.PATIENTS}/${id}`, patientData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un paciente
  deletePatient: async (id) => {
    try {
      const response = await apiRequest.delete(`${API_CONFIG.ENDPOINTS.PATIENTS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Buscar pacientes
  searchPatients: async (query) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.PATIENTS}/search`, {
        q: query
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener historial médico de un paciente
  getPatientHistory: async (id) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.PATIENTS}/${id}/history`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener próximas citas de un paciente
  getPatientUpcomingAppointments: async (id) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.PATIENTS}/${id}/appointments`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
