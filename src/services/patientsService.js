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

  async getFiliacion(patientId) {
    try {
      const params = new URLSearchParams({ action: 'filiacion', patient_id: String(patientId) });
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, filiacion: data.filiacion };
      }
      return { success: false, error: data.error || 'Error al obtener filiación' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async updateFiliacion(filiacionData) {
    try {
      const res = await fetch(`${API_URL}?action=update_filiacion`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(filiacionData)
      });
      const data = await res.json();
      return data;
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async getTareas(patientId) {
    try {
      const params = new URLSearchParams({ action: 'tareas', patient_id: String(patientId) });
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, tareas_manuales: data.tareas_manuales, tareas_automaticas: data.tareas_automaticas };
      }
      return { success: false, error: data.error || 'Error al obtener tareas' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async getLookupOptions() {
    try {
      const params = new URLSearchParams({ action: 'lookup_options' });
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { 
          success: true, 
          fuentes_captacion: data.fuentes_captacion,
          aseguradoras: data.aseguradoras,
          lineas_negocio: data.lineas_negocio
        };
      }
      return { success: false, error: data.error || 'Error al obtener opciones' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async getNotasAlergias(patientId) {
    try {
      const params = new URLSearchParams({ action: 'notas_alergias', patient_id: String(patientId) });
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, notas_alergias: data.notas_alergias };
      }
      return { success: false, error: data.error || 'Error al obtener notas y alergias' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async updateNotasAlergias(patientId, campo, valor) {
    try {
      const res = await fetch(`${API_URL}?action=update_notas_alergias`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          id: patientId,
          campo: campo,
          valor: valor
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Error al actualizar notas y alergias' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async getEtiquetas() {
    try {
      const params = new URLSearchParams({ action: 'etiquetas' });
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, etiquetas: data.etiquetas };
      }
      return { success: false, error: data.error || 'Error al obtener etiquetas' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async addEtiqueta(patientId, etiquetaId) {
    try {
      const res = await fetch(`${API_URL}?action=add_etiqueta`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          id_paciente: patientId,
          id_etiqueta: etiquetaId
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Error al agregar etiqueta' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async removeEtiqueta(patientId, etiquetaId) {
    try {
      const params = new URLSearchParams({ 
        action: 'remove_etiqueta',
        id_paciente: String(patientId),
        id_etiqueta: String(etiquetaId)
      });
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Error al remover etiqueta' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }
}

const patientsService = new PatientsService();
export default patientsService;
