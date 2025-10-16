import React, { useState, useEffect } from 'react';
import doctorsService from '../services/doctorsService';
import authService from '../services/authService';

const AddDoctorModal = ({ isOpen, onClose, onDoctorAdded }) => {
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usersWithoutDoctor, setUsersWithoutDoctor] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    telefono: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadUsersWithoutDoctorProfile();
      resetForm();
    }
  }, [isOpen]);

  const loadUsersWithoutDoctorProfile = async () => {
    setLoadingUsers(true);
    setError('');
    
    try {
      doctorsService.setAuthService(authService);
      const result = await doctorsService.getUsersWithoutDoctorProfile();
      
      if (result.success) {
        setUsersWithoutDoctor(result.users);
        if (result.users.length === 0) {
          setError('No hay usuarios con rol de Doctor sin perfil médico registrado');
        }
      } else {
        setError(result.error || 'Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    
    if (userId) {
      const user = usersWithoutDoctor.find(u => u.id === parseInt(userId));
      setSelectedUser(user);
      
      // Pre-llenar campos si hay información disponible
      if (user) {
        setFormData({
          nombres: user.doctor_info?.nombres || '',
          apellidos: user.doctor_info?.apellidos || '',
          telefono: user.doctor_info?.telefono || ''
        });
      }
    } else {
      setSelectedUser(null);
      setFormData({
        nombres: '',
        apellidos: '',
        telefono: ''
      });
    }
    
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setSelectedUserId('');
    setSelectedUser(null);
    setFormData({
      nombres: '',
      apellidos: '',
      telefono: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!selectedUserId) {
      setError('Debe seleccionar un usuario');
      return;
    }

    if (!formData.nombres.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!formData.apellidos.trim()) {
      setError('Los apellidos son requeridos');
      return;
    }

    setLoading(true);

    try {
      const result = await doctorsService.registerDoctor(selectedUserId, {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        telefono: formData.telefono.trim()
      });

      if (result.success) {
        const successMessage = result.message || 'Doctor registrado exitosamente';
        const warningMessage = result.warning ? `\n\n⚠️ ${result.warning}` : '';
        setSuccess(successMessage + warningMessage);
        
        setTimeout(() => {
          if (onDoctorAdded) {
            onDoctorAdded();
          }
          onClose();
        }, 3000);
      } else {
        setError(result.error || 'Error al registrar doctor');
      }
    } catch (error) {
      console.error('Error al registrar doctor:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4A3C7B] to-[#2D1B69] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#4A3C7B]">Registrar Doctor</h2>
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

          {/* Información explicativa */}
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Registra a un usuario con rol de Doctor en la tabla de doctores para que pueda atender citas médicas.
                  Solo se mostrarán usuarios con rol de Doctor que aún no tienen perfil médico.
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-[#4A3C7B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-[#4A3C7B]">Cargando usuarios...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selector de usuario */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Seleccionar Usuario con Rol Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedUserId}
                  onChange={handleUserSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                  disabled={loading || usersWithoutDoctor.length === 0}
                >
                  <option value="">Seleccione un usuario...</option>
                  {usersWithoutDoctor.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} - {user.email}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  Usuarios disponibles: {usersWithoutDoctor.length}
                </p>
              </div>

              {/* Información del usuario seleccionado */}
              {selectedUser && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Información del Usuario</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Usuario:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedUser.username}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedUser.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Rol:</span>
                      <span className="ml-2 font-medium text-[#4A3C7B]">{selectedUser.role}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <span className={`ml-2 font-medium ${selectedUser.active ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario de datos del doctor */}
              {selectedUserId && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 border-t pt-4">Datos del Doctor</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombres */}
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
                        placeholder="Ej: Juan Carlos"
                        disabled={loading}
                        required
                      />
                    </div>

                    {/* Apellidos */}
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
                        placeholder="Ej: Pérez García"
                        disabled={loading}
                        required
                      />
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

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-semibold text-yellow-800 mb-1">Importante - DNI y Colegiatura</h4>
                        <p className="text-xs text-yellow-700">
                          El sistema generará valores temporales para el DNI y colegiatura. Estos campos son únicos y requeridos en la base de datos.
                        </p>
                        <p className="text-xs text-yellow-700 mt-2">
                          <strong>Debe actualizar manualmente</strong> en la base de datos los valores reales del DNI y la colegiatura del doctor después del registro.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
            disabled={loading || !selectedUserId || !formData.nombres.trim() || !formData.apellidos.trim()}
            className="flex-1 bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white py-3 px-4 rounded-lg font-medium hover:from-[#2D1B69] hover:to-[#1A0F3D] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </div>
            ) : (
              'Registrar Doctor'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;

