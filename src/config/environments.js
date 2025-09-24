// Configuración de entornos
export const environments = {
  development: {
    API_BASE_URL: 'http://localhost:8000',
    API_VERSION: 'v1',
    DEBUG: true
  },
  production: {
    API_BASE_URL: 'https://tu-app-name.onrender.com', // Reemplaza con tu URL de Render
    API_VERSION: 'v1',
    DEBUG: false
  }
};

// Función para obtener la configuración según el entorno
export const getEnvironmentConfig = () => {
  const env = process.env.REACT_APP_ENVIRONMENT || 'development';
  return environments[env] || environments.development;
};

export default environments;
