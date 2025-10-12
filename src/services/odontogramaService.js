import authService from './authService';

const API_URL = 'https://odontograma-1090334808863.us-central1.run.app';

const odontogramaService = {
  /**
   * Obtener odontograma de un paciente
   * @param {number} idPaciente - ID del paciente
   * @param {string} tipo - Tipo de odontograma: 'inicial', 'evolucion', 'alta'
   */
  obtenerOdontograma: async (idPaciente, tipo = 'inicial') => {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `${API_URL}?action=obtener&id_paciente=${idPaciente}&tipo=${tipo}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener odontograma');
      }

      return data;
    } catch (error) {
      console.error('Error en obtenerOdontograma:', error);
      throw error;
    }
  },

  /**
   * Guardar odontograma completo
   * @param {object} odontogramaData - Datos del odontograma
   * @param {number} odontogramaData.id_paciente - ID del paciente
   * @param {string} odontogramaData.tipo - Tipo de odontograma
   * @param {number} odontogramaData.id_doctor - ID del doctor (opcional)
   * @param {string} odontogramaData.observaciones - Observaciones generales
   * @param {Array} odontogramaData.dientes - Array de dientes con sus estados
   */
  guardarOdontograma: async (odontogramaData) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}?action=guardar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(odontogramaData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar odontograma');
      }

      return data;
    } catch (error) {
      console.error('Error en guardarOdontograma:', error);
      throw error;
    }
  },

  /**
   * Actualizar un diente específico
   * @param {object} dienteData - Datos del diente
   * @param {number} dienteData.id_paciente - ID del paciente
   * @param {string} dienteData.tipo - Tipo de odontograma
   * @param {number} dienteData.numero_diente - Número del diente
   * @param {string} dienteData.estado_general - Estado general del diente
   * @param {object} dienteData.superficies - Estados de las superficies
   * @param {string} dienteData.codigo_tratamiento - Código de tratamiento
   * @param {string} dienteData.color_marcador - Color hex del marcador
   * @param {string} dienteData.notas - Notas adicionales
   */
  actualizarDiente: async (dienteData) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}?action=diente`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dienteData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar diente');
      }

      return data;
    } catch (error) {
      console.error('Error en actualizarDiente:', error);
      throw error;
    }
  },

  /**
   * Agregar tratamiento al plan
   * @param {object} tratamientoData - Datos del tratamiento
   * @param {number} tratamientoData.id_odontograma - ID del odontograma
   * @param {number} tratamientoData.numero_diente - Número del diente
   * @param {string} tratamientoData.tratamiento - Nombre del tratamiento
   * @param {string} tratamientoData.descripcion - Descripción
   * @param {string} tratamientoData.prioridad - Prioridad: 'baja', 'media', 'alta', 'urgente'
   * @param {string} tratamientoData.estado - Estado: 'pendiente', 'en_proceso', 'completado', 'cancelado'
   * @param {number} tratamientoData.costo_estimado - Costo estimado
   * @param {string} tratamientoData.fecha_planificado - Fecha planificada
   * @param {string} tratamientoData.observaciones - Observaciones
   */
  agregarTratamientoPlan: async (tratamientoData) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}?action=plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tratamientoData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar tratamiento');
      }

      return data;
    } catch (error) {
      console.error('Error en agregarTratamientoPlan:', error);
      throw error;
    }
  },

  /**
   * Actualizar tratamiento del plan
   * @param {object} tratamientoData - Datos del tratamiento a actualizar
   * @param {number} tratamientoData.id_plan - ID del plan de tratamiento
   */
  actualizarTratamientoPlan: async (tratamientoData) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}?action=plan`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tratamientoData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar tratamiento');
      }

      return data;
    } catch (error) {
      console.error('Error en actualizarTratamientoPlan:', error);
      throw error;
    }
  },

  /**
   * Eliminar tratamiento del plan
   * @param {number} idPlan - ID del plan de tratamiento
   */
  eliminarTratamientoPlan: async (idPlan) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}?action=plan&id_plan=${idPlan}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar tratamiento');
      }

      return data;
    } catch (error) {
      console.error('Error en eliminarTratamientoPlan:', error);
      throw error;
    }
  },

  /**
   * Obtener catálogo de códigos odontológicos
   * @param {string} categoria - Categoría opcional: 'diagnostico', 'tratamiento', 'estado'
   */
  obtenerCodigos: async (categoria = null) => {
    try {
      const token = authService.getToken();
      const url = categoria 
        ? `${API_URL}?action=codigos&categoria=${categoria}`
        : `${API_URL}?action=codigos`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener códigos');
      }

      return data;
    } catch (error) {
      console.error('Error en obtenerCodigos:', error);
      throw error;
    }
  },

  /**
   * Obtener historial de cambios de un odontograma
   * @param {number} idOdontograma - ID del odontograma
   */
  obtenerHistorial: async (idOdontograma) => {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `${API_URL}?action=historial&id_odontograma=${idOdontograma}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener historial');
      }

      return data;
    } catch (error) {
      console.error('Error en obtenerHistorial:', error);
      throw error;
    }
  }
};

export default odontogramaService;

