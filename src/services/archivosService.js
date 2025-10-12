import authService from './authService';

const API_URL = 'https://gestorarchivos-1090334808863.us-central1.run.app';

const archivosService = {
  /**
   * Subir archivo
   * @param {File} archivo - Archivo a subir
   * @param {object} metadata - Metadata del archivo
   * @param {number} metadata.id_paciente - ID del paciente
   * @param {number} metadata.id_doctor - ID del doctor (opcional)
   * @param {string} metadata.categoria - Categoría del archivo
   * @param {string} metadata.descripcion - Descripción
   * @param {string} metadata.notas - Notas adicionales
   * @param {boolean} metadata.compartir_con_paciente - Compartir con paciente
   */
  subirArchivo: async (archivo, metadata) => {
    try {
      const token = authService.getToken();
      const formData = new FormData();
      
      formData.append('archivo', archivo);
      formData.append('id_paciente', metadata.id_paciente);
      
      if (metadata.id_doctor) {
        formData.append('id_doctor', metadata.id_doctor);
      }
      if (metadata.categoria) {
        formData.append('categoria', metadata.categoria);
      }
      if (metadata.descripcion) {
        formData.append('descripcion', metadata.descripcion);
      }
      if (metadata.notas) {
        formData.append('notas', metadata.notas);
      }
      formData.append('compartir_con_paciente', metadata.compartir_con_paciente || false);

      const response = await fetch(`${API_URL}?action=subir`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al subir archivo');
      }

      return data;
    } catch (error) {
      console.error('Error en subirArchivo:', error);
      throw error;
    }
  },

  /**
   * Listar archivos de un paciente
   * @param {number} idPaciente - ID del paciente
   * @param {string} categoria - Categoría opcional para filtrar
   */
  listarArchivos: async (idPaciente, categoria = null) => {
    try {
      const token = authService.getToken();
      let url = `${API_URL}?action=listar&id_paciente=${idPaciente}`;
      
      if (categoria) {
        url += `&categoria=${categoria}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al listar archivos');
      }

      return data;
    } catch (error) {
      console.error('Error en listarArchivos:', error);
      throw error;
    }
  },

  /**
   * Obtener categorías disponibles
   */
  obtenerCategorias: async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}?action=categorias`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener categorías');
      }

      return data;
    } catch (error) {
      console.error('Error en obtenerCategorias:', error);
      throw error;
    }
  },

  /**
   * Actualizar metadata de un archivo
   * @param {number} idArchivo - ID del archivo
   * @param {object} metadata - Metadata a actualizar
   */
  actualizarArchivo: async (idArchivo, metadata) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}?action=actualizar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_archivo: idArchivo,
          ...metadata
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar archivo');
      }

      return data;
    } catch (error) {
      console.error('Error en actualizarArchivo:', error);
      throw error;
    }
  },

  /**
   * Eliminar archivo
   * @param {number} idArchivo - ID del archivo
   */
  eliminarArchivo: async (idArchivo) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}?action=eliminar&id_archivo=${idArchivo}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar archivo');
      }

      return data;
    } catch (error) {
      console.error('Error en eliminarArchivo:', error);
      throw error;
    }
  },

  /**
   * Obtener URL de descarga
   * @param {number} idArchivo - ID del archivo
   */
  obtenerUrlDescarga: async (idArchivo) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}?action=descargar&id_archivo=${idArchivo}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener URL de descarga');
      }

      return data;
    } catch (error) {
      console.error('Error en obtenerUrlDescarga:', error);
      throw error;
    }
  },

  /**
   * Descargar archivo directamente
   * @param {number} idArchivo - ID del archivo
   * @param {string} nombreArchivo - Nombre del archivo
   */
  descargarArchivo: async (idArchivo, nombreArchivo) => {
    try {
      const urlData = await archivosService.obtenerUrlDescarga(idArchivo);
      
      if (urlData.success && urlData.url_descarga) {
        // Abrir en nueva pestaña o descargar
        const link = document.createElement('a');
        link.href = urlData.url_descarga;
        link.download = nombreArchivo;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
      }
      
      throw new Error('No se pudo obtener URL de descarga');
    } catch (error) {
      console.error('Error en descargarArchivo:', error);
      throw error;
    }
  },

  /**
   * Formatear tamaño de archivo
   * @param {number} bytes - Tamaño en bytes
   */
  formatearTamano: (bytes) => {
    if (!bytes) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  },

  /**
   * Obtener icono según tipo de archivo
   * @param {string} tipo - Extensión del archivo
   */
  obtenerIcono: (tipo) => {
    const iconos = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'xls': '📊',
      'xlsx': '📊',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
      'zip': '🗜️',
      'txt': '📃'
    };
    
    return iconos[tipo] || '📎';
  }
};

export default archivosService;

