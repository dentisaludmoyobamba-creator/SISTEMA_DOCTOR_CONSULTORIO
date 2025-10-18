// Servicio para gestión de inventario (productos, compras, consumo)
const API_URL = 'https://inventario-1090334808863.us-central1.run.app'; // Reemplazar con la URL real de tu Cloud Function de Inventario

class InventarioService {
  constructor() {
    this.authService = null;
  }

  setAuthService(authService) {
    this.authService = authService;
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (includeAuth && this.authService) {
      const token = this.authService.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  // ===== PRODUCTOS =====
  async getProductos(filters = {}) {
    try {
      const params = new URLSearchParams({
        section: 'productos',
        page: filters.page || 1,
        limit: filters.limit || 20
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.categoria) params.append('categoria', filters.categoria);
      if (filters.almacen) params.append('almacen', filters.almacen);
      if (filters.alerta_stock) params.append('alerta_stock', filters.alerta_stock);

      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: headers
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, productos: data.productos, pagination: data.pagination };
      } else {
        return { success: false, error: data.error || 'Error al obtener productos' };
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  async createProducto(productoData) {
    try {
      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?section=productos`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(productoData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, producto: data.producto };
      } else {
        return { success: false, error: data.error || 'Error al crear producto' };
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  // ===== COMPRAS =====
  async getCompras(filters = {}) {
    try {
      const params = new URLSearchParams({
        section: 'compras',
        page: filters.page || 1,
        limit: filters.limit || 20
      });

      if (filters.search) params.append('search', filters.search);

      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: headers
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, compras: data.compras, pagination: data.pagination };
      } else {
        return { success: false, error: data.error || 'Error al obtener compras' };
      }
    } catch (error) {
      console.error('Error al obtener compras:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  async createCompra(compraData) {
    try {
      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?section=compras`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(compraData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, compra: data.compra };
      } else {
        return { success: false, error: data.error || 'Error al crear compra' };
      }
    } catch (error) {
      console.error('Error al crear compra:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  async getOrdenDetalles(ordenId) {
    try {
      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?section=orden_detalles&id=${ordenId}`, {
        method: 'GET',
        headers: headers
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, orden: data.orden };
      } else {
        return { success: false, error: data.error || 'Error al obtener detalles de orden' };
      }
    } catch (error) {
      console.error('Error al obtener detalles de orden:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  // ===== CONSUMO =====
  async getConsumos(filters = {}) {
    try {
      const params = new URLSearchParams({
        section: 'consumo',
        page: filters.page || 1,
        limit: filters.limit || 20
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.almacen) params.append('almacen', filters.almacen);
      if (filters.mes) params.append('mes', filters.mes);

      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: headers
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, consumos: data.consumos, pagination: data.pagination };
      } else {
        return { success: false, error: data.error || 'Error al obtener consumos' };
      }
    } catch (error) {
      console.error('Error al obtener consumos:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  async createConsumo(consumoData) {
    try {
      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?section=consumo`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(consumoData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, consumo: data.consumo };
      } else {
        return { success: false, error: data.error || 'Error al crear consumo' };
      }
    } catch (error) {
      console.error('Error al crear consumo:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  // ===== TIPOS DE PRODUCTO =====
  async getTipos() {
    try {
      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?section=tipos`, {
        method: 'GET',
        headers: headers
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, tipos: data.tipos };
      } else {
        return { success: false, error: data.error || 'Error al obtener tipos' };
      }
    } catch (error) {
      console.error('Error al obtener tipos:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  // ===== CATEGORÍAS DE PRODUCTO =====
  async getCategorias() {
    try {
      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?section=categorias`, {
        method: 'GET',
        headers: headers
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, categorias: data.categorias };
      } else {
        return { success: false, error: data.error || 'Error al obtener categorías' };
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  async createCategoria(categoriaData) {
    try {
      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?section=categorias`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(categoriaData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, categoria: data.categoria };
      } else {
        return { success: false, error: data.error || 'Error al crear categoría' };
      }
    } catch (error) {
      console.error('Error al crear categoría:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  async deleteCategoria(categoriaId) {
    try {
      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?section=categorias&id=${categoriaId}`, {
        method: 'DELETE',
        headers: headers
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Error al eliminar categoría' };
      }
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  // ===== GESTIÓN DE TIPOS =====
  async createTipo(tipoData) {
    try {
      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?section=tipos`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(tipoData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, tipo: data.tipo };
      } else {
        return { success: false, error: data.error || 'Error al crear tipo' };
      }
    } catch (error) {
      console.error('Error al crear tipo:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }

  async deleteTipo(tipoId) {
    try {
      const headers = this.getHeaders();
      const response = await fetch(`${API_URL}?section=tipos&id=${tipoId}`, {
        method: 'DELETE',
        headers: headers
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Error al eliminar tipo' };
      }
    } catch (error) {
      console.error('Error al eliminar tipo:', error);
      return { success: false, error: 'Error de conexión con el servidor: ' + error.message };
    }
  }
}

const inventarioService = new InventarioService();
export default inventarioService;
