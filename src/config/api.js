import { getEnvironmentConfig } from './environments';

// Obtener configuración según el entorno
const envConfig = getEnvironmentConfig();

// Configuración de la API
const API_CONFIG = {
  // URL base del backend FastAPI
  // localmente: http://localhost:8000
  // en producción: https://tu-app-name.onrender.com (o la URL que te dé Render)
  BASE_URL: process.env.REACT_APP_API_BASE_URL || envConfig.API_BASE_URL,
  VERSION: process.env.REACT_APP_API_VERSION || envConfig.API_VERSION,
  
  // Endpoints principales
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile'
    },
    
    // Doctores
    DOCTORS: '/doctors',
    
    // Pacientes
    PATIENTS: '/patients',
    
    // Citas
    APPOINTMENTS: '/appointments',
    
    // Transacciones
    TRANSACTIONS: '/transactions',
    
    // Configuración
    CONFIG: '/config'
  },
  
  // Configuración de headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: 10000
};

// Función para construir la URL completa
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}${endpoint}`;
};

// Función para obtener headers con autenticación
export const getAuthHeaders = (token) => {
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    'Authorization': `Bearer ${token}`
  };
};

export { API_CONFIG };
export default API_CONFIG;
