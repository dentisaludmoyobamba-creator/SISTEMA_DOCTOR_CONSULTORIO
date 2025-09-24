import { apiRequest } from './apiClient';
import { API_CONFIG } from '../config/api';

export const doctorsService = {
  // Obtener todos los doctores
  getDoctors: async () => {
    try {
      const response = await apiRequest.get(API_CONFIG.ENDPOINTS.DOCTORS);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener un doctor por ID
  getDoctorById: async (id) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.DOCTORS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo doctor
  createDoctor: async (doctorData) => {
    try {
      const response = await apiRequest.post(API_CONFIG.ENDPOINTS.DOCTORS, doctorData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un doctor
  updateDoctor: async (id, doctorData) => {
    try {
      const response = await apiRequest.put(`${API_CONFIG.ENDPOINTS.DOCTORS}/${id}`, doctorData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un doctor
  deleteDoctor: async (id) => {
    try {
      const response = await apiRequest.delete(`${API_CONFIG.ENDPOINTS.DOCTORS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener horarios de un doctor
  getDoctorSchedule: async (id, date) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.DOCTORS}/${id}/schedule`, {
        date: date
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};
