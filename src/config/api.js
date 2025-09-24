// Configuración de la API
const API_CONFIG = {
  // URL base del backend FastAPI
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000',
  VERSION: process.env.REACT_APP_API_VERSION || 'v1',
  
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
