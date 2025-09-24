import { apiRequest } from './apiClient';
import { API_CONFIG } from '../config/api';

export const transactionsService = {
  // Obtener todas las transacciones
  getTransactions: async (params = {}) => {
    try {
      const response = await apiRequest.get(API_CONFIG.ENDPOINTS.TRANSACTIONS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener una transacción por ID
  getTransactionById: async (id) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear una nueva transacción
  createTransaction: async (transactionData) => {
    try {
      const response = await apiRequest.post(API_CONFIG.ENDPOINTS.TRANSACTIONS, transactionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar una transacción
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await apiRequest.put(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`, transactionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar una transacción
  deleteTransaction: async (id) => {
    try {
      const response = await apiRequest.delete(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener resumen financiero
  getFinancialSummary: async (params = {}) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/summary`, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener transacciones por fecha
  getTransactionsByDate: async (date) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/date/${date}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener transacciones por rango de fechas
  getTransactionsByDateRange: async (startDate, endDate) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/date-range`, {
        start_date: startDate,
        end_date: endDate
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener transacciones por doctor
  getTransactionsByDoctor: async (doctorId, params = {}) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/doctor/${doctorId}`, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener transacciones por tipo
  getTransactionsByType: async (type, params = {}) => {
    try {
      const response = await apiRequest.get(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/type/${type}`, params);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
