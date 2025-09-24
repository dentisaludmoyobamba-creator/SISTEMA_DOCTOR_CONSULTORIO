import { apiRequest } from './apiClient';
import { API_CONFIG } from '../config/api';

export const authService = {
  // Iniciar sesión
  login: async (credentials) => {
    try {
      const response = await apiRequest.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Guardar token en localStorage
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await apiRequest.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar datos locales independientemente del resultado
      localStorage.removeItem('auth_token');
      localStorage.removeItem('doctocliq_user');
    }
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const response = await apiRequest.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Refrescar token
  refreshToken: async () => {
    try {
      const response = await apiRequest.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
      
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  // Obtener token actual
  getToken: () => {
    return localStorage.getItem('auth_token');
  }
};
