// Servicio para gestión de pacientes (listar, crear)
const API_URL = 'https://pacientes-1090334808863.us-central1.run.app';

class PatientsService {
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

  async list({ page = 1, limit = 20, search = '' } = {}) {
    try {
      const params = new URLSearchParams({ action: 'patients', page: String(page), limit: String(limit) });
      if (search) params.append('search', search);

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, patients: data.patients, pagination: data.pagination };
      }
      return { success: false, error: data.error || 'Error al listar pacientes' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async create(payload) {
    try {
      const params = new URLSearchParams({ action: 'create' });
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message, patient_id: data.patient_id };
      }
      return { success: false, error: data.error || 'Error al crear paciente' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async getCitas(patientId) {
    try {
      const params = new URLSearchParams({ action: 'citas', patient_id: String(patientId) });
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, citas: data.citas };
      }
      return { success: false, error: data.error || 'Error al obtener citas' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }
}

const patientsService = new PatientsService();
export default patientsService;
