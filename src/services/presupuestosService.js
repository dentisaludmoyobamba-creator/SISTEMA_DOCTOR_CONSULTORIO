const API_BASE_URL = 'https://presupuestos-1090334808863.us-central1.run.app';
const PACIENTES_API_URL = 'https://pacientes-1090334808863.us-central1.run.app';
const USUARIOS_API_URL = 'https://usuarios-1090334808863.us-central1.run.app';

// Modo debug (cambiar a false en producción)
const DEBUG_MODE = true;

// Función de debug
const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log('[PresupuestosService]', ...args);
  }
};

// Obtener token del localStorage
const getAuthToken = () => {
  // Intentar obtener el token de diferentes posibles ubicaciones
  const token = localStorage.getItem('authToken') || 
                localStorage.getItem('token') || 
                sessionStorage.getItem('authToken') ||
                sessionStorage.getItem('token');
  
  debugLog('Token encontrado:', token ? `${token.substring(0, 20)}...` : 'NO ENCONTRADO');
  debugLog('localStorage.authToken:', localStorage.getItem('authToken') ? 'Existe' : 'No existe');
  debugLog('localStorage.token:', localStorage.getItem('token') ? 'Existe' : 'No existe');
  
  return token;
};

// Verificar si el token es válido
const isTokenValid = (token) => {
  if (!token) {
    debugLog('isTokenValid: Token no proporcionado');
    return false;
  }
  
  try {
    // Decodificar el payload del JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    debugLog('Token payload:', payload);
    debugLog('Token exp:', payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No tiene exp');
    debugLog('Current time:', new Date(currentTime * 1000).toISOString());
    
    // Verificar si el token ha expirado
    if (payload.exp && payload.exp < currentTime) {
      debugLog('❌ Token JWT ha expirado');
      return false;
    }
    
    debugLog('✅ Token válido');
    return true;
  } catch (error) {
    console.error('Error al validar token:', error);
    debugLog('❌ Error al decodificar token');
    return false;
  }
};

// Headers con autenticación
const getHeaders = () => {
  const token = getAuthToken();
  
  if (!token) {
    console.error('No se encontró token de autenticación en localStorage');
    throw new Error('Token de autenticación no disponible. Por favor, inicia sesión nuevamente.');
  }
  
  if (!isTokenValid(token)) {
    console.error('Token JWT inválido o expirado');
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// ===== PRESUPUESTOS =====

export const listarPresupuestos = async (params = {}) => {
  try {
    const { page = 1, limit = 10, search = '', paciente_id = '', doctor_id = '', estado = '' } = params;
    
    const queryParams = new URLSearchParams({
      action: 'list',
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(paciente_id && { paciente_id }),
      ...(doctor_id && { doctor_id }),
      ...(estado && { estado })
    });

    const response = await fetch(`${API_BASE_URL}?${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al obtener presupuestos');
    }

    return data;
  } catch (error) {
    console.error('Error en listarPresupuestos:', error);
    throw error;
  }
};

export const crearPresupuesto = async (presupuestoData) => {
  try {
    debugLog('=== CREAR PRESUPUESTO ===');
    debugLog('URL:', `${API_BASE_URL}?action=create`);
    debugLog('Datos a enviar:', presupuestoData);
    
    const headers = getHeaders();
    debugLog('Headers:', headers);
    
    const response = await fetch(`${API_BASE_URL}?action=create`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(presupuestoData)
    });

    debugLog('Response status:', response.status);
    debugLog('Response ok:', response.ok);

    const data = await response.json();
    debugLog('Response data:', data);
    
    if (!response.ok) {
      debugLog('❌ Error en la respuesta:', data.error);
      throw new Error(data.error || 'Error al crear presupuesto');
    }

    debugLog('✅ Presupuesto creado exitosamente');
    return data;
  } catch (error) {
    console.error('❌ Error en crearPresupuesto:', error);
    debugLog('Error completo:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};

export const actualizarPresupuesto = async (presupuestoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=update`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(presupuestoData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar presupuesto');
    }

    return data;
  } catch (error) {
    console.error('Error en actualizarPresupuesto:', error);
    throw error;
  }
};

export const eliminarPresupuesto = async (presupuestoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=delete&id=${presupuestoId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al eliminar presupuesto');
    }

    return data;
  } catch (error) {
    console.error('Error en eliminarPresupuesto:', error);
    throw error;
  }
};

// ===== BÚSQUEDA DE SERVICIOS/PRODUCTOS =====

export const buscarServicios = async (termino, tipo = 'Servicio', limit = 20) => {
  try {
    const queryParams = new URLSearchParams({
      action: 'buscar_servicios',
      q: termino,
      tipo: tipo,
      limit: limit.toString()
    });

    const response = await fetch(`${API_BASE_URL}?${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al buscar servicios');
    }

    return data.servicios || [];
  } catch (error) {
    console.error('Error en buscarServicios:', error);
    throw error;
  }
};

// ===== BÚSQUEDA DE PACIENTES (desde API de pacientes) =====

export const buscarPacientes = async (search = '', limit = 10) => {
  try {
    const queryParams = new URLSearchParams({
      action: 'list',
      page: '1',
      limit: limit.toString(),
      ...(search && { search })
    });

    const response = await fetch(`${PACIENTES_API_URL}?${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Si es error 401, significa que el token es inválido
      if (response.status === 401) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      throw new Error(data.error || 'Error al buscar pacientes');
    }

    return data.patients || [];
  } catch (error) {
    console.error('Error en buscarPacientes:', error);
    
    // Si el error es de autenticación, redirigir al login
    if (error.message.includes('sesión') || error.message.includes('Token')) {
      // Limpiar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    
    throw error;
  }
};

// ===== BÚSQUEDA DE DOCTORES (desde API de usuarios) =====

export const buscarDoctores = async (search = '', limit = 50) => {
  try {
    const queryParams = new URLSearchParams({
      action: 'users',
      page: '1',
      limit: limit.toString(),
      role: 'Doctor',
      ...(search && { search })
    });

    const response = await fetch(`${USUARIOS_API_URL}?${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al buscar doctores');
    }

    // Filtrar solo doctores activos con información de doctor
    const doctores = (data.users || [])
      .filter(user => user.is_doctor && user.active && user.doctor_info)
      .map(user => ({
        id: user.doctor_info.id,
        nombres: user.doctor_info.nombres,
        apellidos: user.doctor_info.apellidos,
        nombre_completo: `${user.doctor_info.nombres} ${user.doctor_info.apellidos}`,
        dni: user.doctor_info.dni,
        colegiatura: user.doctor_info.colegiatura,
        telefono: user.doctor_info.telefono
      }));

    return doctores;
  } catch (error) {
    console.error('Error en buscarDoctores:', error);
    throw error;
  }
};

// Función de debugging para verificar usuarios
export const verificarUsuarios = async () => {
  try {
    debugLog('=== VERIFICANDO USUARIOS ===');
    
    const response = await fetch(`${USUARIOS_API_URL}?action=users&limit=10`, {
      method: 'GET',
      headers: getHeaders()
    });

    const data = await response.json();
    debugLog('Usuarios encontrados:', data);
    
    return data;
  } catch (error) {
    console.error('Error al verificar usuarios:', error);
    throw error;
  }
};

export const list = async (params = {}) => {
  try {
    debugLog('=== LISTAR PRESUPUESTOS ===');
    
    const queryParams = new URLSearchParams();
    if (params.paciente_id) queryParams.append('paciente_id', params.paciente_id);
    if (params.doctor_id) queryParams.append('doctor_id', params.doctor_id);
    if (params.estado) queryParams.append('estado', params.estado);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `${API_BASE_URL}?action=list&${queryParams.toString()}`;
    debugLog('URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    debugLog('Response status:', response.status);
    debugLog('Response ok:', response.ok);

    const data = await response.json();
    debugLog('Response data:', data);
    
    if (!response.ok) {
      debugLog('❌ Error en la respuesta:', data.error);
      throw new Error(data.error || 'Error al listar presupuestos');
    }

    debugLog('✅ Presupuestos listados exitosamente');
    return data;
  } catch (error) {
    console.error('❌ Error en list:', error);
    debugLog('Error completo:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};

export default {
  listarPresupuestos,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
  buscarServicios,
  buscarPacientes,
  buscarDoctores,
  verificarUsuarios,
  list
};
