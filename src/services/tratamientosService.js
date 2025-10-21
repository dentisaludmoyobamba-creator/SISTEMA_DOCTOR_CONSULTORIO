const API_BASE_URL = 'https://tratamientos-1090334808863.us-central1.run.app';

const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

const getHeaders = () => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Token de autenticación no disponible. Por favor, inicia sesión nuevamente.');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const listarTratamientos = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    
    const response = await fetch(`${API_BASE_URL}?action=list&${queryParams.toString()}`, {
      method: 'GET',
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al listar tratamientos');
    }

    return data;
  } catch (error) {
    console.error('Error en listarTratamientos:', error);
    throw error;
  }
};

export const crearTratamiento = async (tratamientoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(tratamientoData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al crear tratamiento');
    }

    return data;
  } catch (error) {
    console.error('Error en crearTratamiento:', error);
    throw error;
  }
};

export const actualizarTratamiento = async (tratamientoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=update`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(tratamientoData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar tratamiento');
    }

    return data;
  } catch (error) {
    console.error('Error en actualizarTratamiento:', error);
    throw error;
  }
};

export const eliminarTratamiento = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=delete&id=${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al eliminar tratamiento');
    }

    return data;
  } catch (error) {
    console.error('Error en eliminarTratamiento:', error);
    throw error;
  }
};

export default {
  listarTratamientos,
  crearTratamiento,
  actualizarTratamiento,
  eliminarTratamiento
};

