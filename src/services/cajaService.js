const API_URL = 'https://caja-1090334808863.us-central1.run.app';

class CajaService {
  constructor() {
    this.authService = null;
  }

  setAuthService(authService) {
    this.authService = authService;
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.authService) {
      const token = this.authService.getToken?.();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async list({ date, type = 'all' } = {}) {
    const params = new URLSearchParams({ action: 'list' });
    if (date) params.append('date', date);
    if (type && type !== 'all') params.append('type', type);

    try {
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) return { success: true, transactions: data.transactions };
      return { success: false, error: data.error || 'Error al listar transacciones' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async summary({ date } = {}) {
    const params = new URLSearchParams({ action: 'summary' });
    if (date) params.append('date', date);

    try {
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) return { success: true, summary: data.summary };
      return { success: false, error: data.error || 'Error al obtener resumen' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }

  async create({ tipo_transaccion, concepto, monto, medio_pago, referencia_pago, comentario, id_doctor, id_paciente, fecha_transaccion, estado }) {
    const params = new URLSearchParams({ action: 'create' });

    try {
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ tipo_transaccion, concepto, monto, medio_pago, referencia_pago, comentario, id_doctor, id_paciente, fecha_transaccion, estado })
      });
      const data = await res.json();
      if (res.ok && data.success) return { success: true, transaction_id: data.transaction_id };
      return { success: false, error: data.error || 'Error al crear transacción' };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor: ' + e.message };
    }
  }
}

const cajaService = new CajaService();
export default cajaService;
