import React, { useState, useEffect } from 'react';
import doctorsService from '../services/doctorsService';
import authService from '../services/authService';

const EditDoctorModal = ({ isOpen, onClose, doctor, onDoctorUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    colegiatura: '',
    telefono: ''
  });

  useEffect(() => {
    if (isOpen && doctor?.doctor_info) {
      setFormData({
        nombres: doctor.doctor_info.nombres || '',
        apellidos: doctor.doctor_info.apellidos || '',
        dni: doctor.doctor_info.dni || '',
        colegiatura: doctor.doctor_info.colegiatura || '',
        telefono: doctor.doctor_info.telefono || ''
      });
      setError('');
      setSuccess('');
    }
  }, [isOpen, doctor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.nombres.trim()) {
      setError('Los nombres son requeridos');
      return;
    }

    if (!formData.apellidos.trim()) {
      setError('Los apellidos son requeridos');
      return;
    }

    if (!formData.dni.trim()) {
      setError('El DNI es requerido');
      return;
    }

    if (!formData.colegiatura.trim()) {
      setError('La colegiatura es requerida');
      return;
    }

    setLoading(true);

    try {
      // Configurar el servicio con authService
      doctorsService.setAuthService(authService);
      
      // Actualizar el doctor
      const result = await doctorsService.updateDoctor(doctor.id, {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        dni: formData.dni.trim(),
        colegiatura: formData.colegiatura.trim(),
        telefono: formData.telefono.trim()
      });
      
      if (result.success) {
        setSuccess(result.message || 'Datos del doctor actualizados exitosamente');
        setTimeout(() => {
          if (onDoctorUpdated) {
            onDoctorUpdated();
          }
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Error al actualizar los datos del doctor');
      }
    } catch (error) {
      console.error('Error al actualizar doctor:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isDniTemporal = formData.dni?.startsWith('TMP');
  const isColegiaturaTemporal = formData.colegiatura?.startsWith('COL') && formData.colegiatura?.length > 10;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4A3C7B] to-[#2D1B69] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#4A3C7B]">Editar Datos del Doctor</h2>
              <p className="text-sm text-gray-500">Usuario: {doctor?.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Alertas de datos temporales */}
          {(isDniTemporal || isColegiaturaTemporal) && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-yellow-800">Datos Temporales Detectados</h4>
                  <div className="mt-2 text-xs text-yellow-700 space-y-1">
                    {isDniTemporal && (
                      <p>• <strong>DNI temporal:</strong> Este doctor fue registrado con un DNI temporal. Actualízalo con el DNI real.</p>
                    )}
                    {isColegiaturaTemporal && (
                      <p>• <strong>Colegiatura temporal:</strong> Este doctor fue registrado con una colegiatura temporal. Actualízala con la colegiatura real.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Información del doctor */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Información del Usuario</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium text-gray-900">{doctor?.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Rol:</span>
                  <span className="ml-2 font-medium text-[#4A3C7B]">{doctor?.role}</span>
                </div>
              </div>
            </div>

            {/* Nombres y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                  placeholder="Nombres del doctor"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                  placeholder="Apellidos del doctor"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* DNI y Colegiatura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  DNI <span className="text-red-500">*</span>
                  {isDniTemporal && (
                    <span className="ml-2 text-xs text-yellow-600 font-normal">(Temporal - Actualizar)</span>
                  )}
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] ${
                    isDniTemporal ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 12345678"
                  maxLength="15"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500">Máximo 15 caracteres</p>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Colegiatura <span className="text-red-500">*</span>
                  {isColegiaturaTemporal && (
                    <span className="ml-2 text-xs text-yellow-600 font-normal">(Temporal - Actualizar)</span>
                  )}
                </label>
                <input
                  type="text"
                  name="colegiatura"
                  value={formData.colegiatura}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] ${
                    isColegiaturaTemporal ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
                  }`}
                  placeholder="Ej: COP12345"
                  maxLength="20"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500">Máximo 20 caracteres</p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                placeholder="Ej: +51 999 888 777"
                disabled={loading}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex space-x-3">
          <button
            onClick={onClose}
            type="button"
            disabled={loading}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white py-3 px-4 rounded-lg font-medium hover:from-[#2D1B69] hover:to-[#1A0F3D] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </div>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorModal;

