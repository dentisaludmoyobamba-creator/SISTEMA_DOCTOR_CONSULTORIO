import authService from './authService';

class PresupuestosService {
  constructor() {
    this.baseURL = 'https://presupuestos-1090334808863.us-central1.run.app';
    this.authService = null;
  }

  setAuthService(authService) {
    this.authService = authService;
  }

  async getHeaders() {
    const token = this.authService?.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getPresupuestos(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.paciente_id) queryParams.append('paciente_id', params.paciente_id);
      if (params.doctor_id) queryParams.append('doctor_id', params.doctor_id);
      if (params.estado) queryParams.append('estado', params.estado);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);

      const response = await fetch(`${this.baseURL}/presupuestos?${queryParams}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting presupuestos:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createPresupuesto(presupuestoData) {
    try {
      const response = await fetch(`${this.baseURL}/presupuestos`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(presupuestoData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating presupuesto:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updatePresupuesto(presupuestoData) {
    try {
      const response = await fetch(`${this.baseURL}/presupuestos`, {
        method: 'PUT',
        headers: await this.getHeaders(),
        body: JSON.stringify(presupuestoData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating presupuesto:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deletePresupuesto(presupuestoId) {
    try {
      const response = await fetch(`${this.baseURL}/presupuestos?id=${presupuestoId}`, {
        method: 'DELETE',
        headers: await this.getHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting presupuesto:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async buscarServicios(termino, tipo = 'Servicio') {
    try {
      const response = await fetch(`${this.baseURL}/buscar_servicios?q=${encodeURIComponent(termino)}&tipo=${tipo}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching servicios:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }
}

export default new PresupuestosService();
