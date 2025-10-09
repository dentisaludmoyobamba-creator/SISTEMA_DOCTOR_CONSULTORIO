// Servicio para gestión de citas médicas
const API_URL = 'https://citasmedicas-1090334808863.us-central1.run.app';

class CitasService {
  constructor() {
    this.authService = null;
  }

  setAuthService(authService) {
    this.authService = authService;
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.authService) {
      const token = this.authService.getToken?.() || null;
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Obtener citas con filtros
  async getCitas({ fecha_inicio, fecha_fin, id_doctor, estado, search } = {}) {
    try {
      const params = new URLSearchParams({ action: 'list' });
      if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
      if (fecha_fin) params.append('fecha_fin', fecha_fin);
      if (id_doctor) params.append('id_doctor', id_doctor);
      if (estado) params.append('estado', estado);
      if (search) params.append('search', search);

      console.log('CitasService.getCitas - URL:', `${API_URL}?${params.toString()}`);
      console.log('CitasService.getCitas - Headers:', this.getHeaders());

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      console.log('CitasService.getCitas - Response status:', res.status);
      const data = await res.json();
      console.log('CitasService.getCitas - Response data:', data);

      if (res.ok && data.success) {
        return { success: true, citas: data.citas };
      }
      return { success: false, error: data.error || 'Error al obtener citas' };
    } catch (e) {
      console.error('CitasService.getCitas - Error:', e);
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  // Crear nueva cita
  async createCita(citaData) {
    try {
      const params = new URLSearchParams({ action: 'create' });
      
      console.log('CitasService.createCita - Data:', citaData);
      console.log('CitasService.createCita - Headers:', this.getHeaders());

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(citaData)
      });

      console.log('CitasService.createCita - Response status:', res.status);
      const data = await res.json();
      console.log('CitasService.createCita - Response data:', data);

      if (res.ok && data.success) {
        return { success: true, message: data.message, cita_id: data.cita_id };
      }
      return { success: false, error: data.error || 'Error al crear cita' };
    } catch (e) {
      console.error('CitasService.createCita - Error:', e);
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  // Actualizar cita existente
  async updateCita(citaData) {
    try {
      const params = new URLSearchParams({ action: 'update' });
      
      console.log('CitasService.updateCita - Data:', citaData);

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(citaData)
      });

      console.log('CitasService.updateCita - Response status:', res.status);
      const data = await res.json();
      console.log('CitasService.updateCita - Response data:', data);

      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Error al actualizar cita' };
    } catch (e) {
      console.error('CitasService.updateCita - Error:', e);
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  // Eliminar cita
  async deleteCita(citaId) {
    try {
      const params = new URLSearchParams({ action: 'delete', id: citaId });
      
      console.log('CitasService.deleteCita - ID:', citaId);

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      console.log('CitasService.deleteCita - Response status:', res.status);
      const data = await res.json();
      console.log('CitasService.deleteCita - Response data:', data);

      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Error al eliminar cita' };
    } catch (e) {
      console.error('CitasService.deleteCita - Error:', e);
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  // Obtener doctores disponibles
  async getDoctores() {
    try {
      const params = new URLSearchParams({ action: 'doctores' });
      
      console.log('CitasService.getDoctores - URL:', `${API_URL}?${params.toString()}`);

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      console.log('CitasService.getDoctores - Response status:', res.status);
      const data = await res.json();
      console.log('CitasService.getDoctores - Response data:', data);

      if (res.ok && data.success) {
        return { success: true, doctores: data.doctores };
      }
      return { success: false, error: data.error || 'Error al obtener doctores' };
    } catch (e) {
      console.error('CitasService.getDoctores - Error:', e);
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  // Buscar pacientes
  async searchPacientes(searchTerm, limit = 10) {
    try {
      const params = new URLSearchParams({ action: 'pacientes', search: searchTerm, limit: limit });
      
      console.log('CitasService.searchPacientes - Search:', searchTerm);

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      console.log('CitasService.searchPacientes - Response status:', res.status);
      const data = await res.json();
      console.log('CitasService.searchPacientes - Response data:', data);

      if (res.ok && data.success) {
        return { success: true, pacientes: data.pacientes };
      }
      return { success: false, error: data.error || 'Error al buscar pacientes' };
    } catch (e) {
      console.error('CitasService.searchPacientes - Error:', e);
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  // Obtener citas de una semana específica
  async getCitasSemana(fechaInicio) {
    const fecha = new Date(fechaInicio);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fecha.getDate() + 6); // 7 días (lunes a domingo)

    return this.getCitas({
      fecha_inicio: fecha.toISOString().split('T')[0],
      fecha_fin: fechaFin.toISOString().split('T')[0]
    });
  }

  // Obtener citas de un mes específico
  async getCitasMes(year, month) {
    const fechaInicio = new Date(year, month - 1, 1);
    const fechaFin = new Date(year, month, 0); // Último día del mes

    return this.getCitas({
      fecha_inicio: fechaInicio.toISOString().split('T')[0],
      fecha_fin: fechaFin.toISOString().split('T')[0]
    });
  }

  // Obtener citas de un día específico
  async getCitasDia(fecha) {
    return this.getCitas({
      fecha_inicio: fecha,
      fecha_fin: fecha
    });
  }

  // Obtener citas eliminadas
  async getDeletedCitas() {
    try {
      const params = new URLSearchParams({ action: 'deleted' });
      
      console.log('CitasService.getDeletedCitas - URL:', `${API_URL}?${params.toString()}`);

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      console.log('CitasService.getDeletedCitas - Response status:', res.status);
      const data = await res.json();
      console.log('CitasService.getDeletedCitas - Response data:', data);

      if (res.ok && data.success) {
        return { success: true, citas: data.citas };
      }
      return { success: false, error: data.error || 'Error al obtener citas eliminadas' };
    } catch (e) {
      console.error('CitasService.getDeletedCitas - Error:', e);
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  // Restaurar cita eliminada
  async restoreCita(citaId) {
    try {
      const params = new URLSearchParams({ action: 'restore', id: citaId });
      
      console.log('CitasService.restoreCita - ID:', citaId);

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'PUT',
        headers: this.getHeaders()
      });

      console.log('CitasService.restoreCita - Response status:', res.status);
      const data = await res.json();
      console.log('CitasService.restoreCita - Response data:', data);

      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Error al restaurar cita' };
    } catch (e) {
      console.error('CitasService.restoreCita - Error:', e);
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }
}

const citasService = new CitasService();
export default citasService;
