import axios from 'axios';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from '../config/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

// Interceptor para agregar token de autenticación automáticamente
apiClient.interceptors.request.use(
  (config) => {
    console.log('Enviando petición:', config.method?.toUpperCase(), config.url);
    console.log('Base URL:', config.baseURL);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    console.log('Respuesta exitosa:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('Error en petición:', error.config?.url, error.message);
    console.error('Detalles del error:', error);
    
    // Si el token expiró, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('doctocliq_user');
      window.location.href = '/login';
    }
    
    // Manejar errores de red
    if (!error.response) {
      console.error('Error de red:', error.message);
      console.error('Posible problema de CORS o backend no disponible');
    }
    
    return Promise.reject(error);
  }
);

// Funciones de utilidad para diferentes tipos de peticiones
export const apiRequest = {
  // GET request
  get: async (endpoint, params = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.patch(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint) => {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiClient;
