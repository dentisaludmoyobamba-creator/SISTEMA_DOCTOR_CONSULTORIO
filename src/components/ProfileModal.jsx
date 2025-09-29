import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const ProfileModal = ({ isOpen, onClose, user, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    doctor_nombres: '',
    doctor_apellidos: '',
    doctor_telefono: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  // Cargar datos del perfil cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    setIsLoading(true);
    const result = await authService.getProfile();
    
    if (result.success) {
      setUserProfile(result.user);
      setFormData({
        email: result.user.email || '',
        password: '',
        confirmPassword: '',
        doctor_nombres: result.user.doctor_info?.nombres || '',
        doctor_apellidos: result.user.doctor_info?.apellidos || '',
        doctor_telefono: result.user.doctor_info?.telefono || ''
      });
    } else {
      setError(result.error || 'Error al cargar perfil');
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar mensajes cuando el usuario edita
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    // Validaciones
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    // Preparar datos para enviar
    const updateData = {};
    
    if (formData.email && formData.email !== userProfile?.email) {
      updateData.email = formData.email;
    }

    if (formData.password) {
      updateData.password = formData.password;
    }

    if (userProfile?.is_doctor) {
      if (formData.doctor_nombres && formData.doctor_nombres !== userProfile?.doctor_info?.nombres) {
        updateData.doctor_nombres = formData.doctor_nombres;
      }
      if (formData.doctor_apellidos && formData.doctor_apellidos !== userProfile?.doctor_info?.apellidos) {
        updateData.doctor_apellidos = formData.doctor_apellidos;
      }
      if (formData.doctor_telefono && formData.doctor_telefono !== userProfile?.doctor_info?.telefono) {
        updateData.doctor_telefono = formData.doctor_telefono;
      }
    }

    if (Object.keys(updateData).length === 0) {
      setError('No hay cambios para guardar');
      setIsLoading(false);
      return;
    }

    const result = await authService.updateProfile(updateData);
    
    if (result.success) {
      setSuccess('Perfil actualizado exitosamente');
      // Actualizar datos locales
      await loadProfile();
      // Notificar al componente padre si hay callback
      if (onUserUpdate) {
        const currentUser = authService.getCurrentUser();
        onUserUpdate(currentUser);
      }
      // Limpiar contraseñas
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    } else {
      setError(result.error || 'Error al actualizar perfil');
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4A3C7B] to-[#2D1B69] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#4A3C7B]">Mi Perfil</h2>
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
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-[#4A3C7B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-[#4A3C7B]">Cargando perfil...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mensajes de error y éxito */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
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
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
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

              {/* Información de solo lectura */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#4A3C7B] mb-3">Información del Sistema</h3>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Usuario:</span>
                  <span className="text-sm font-medium text-gray-900">{userProfile?.username}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tipo de usuario:</span>
                  <span className="text-sm font-medium text-[#4A3C7B]">{userProfile?.role}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span className={`text-sm font-medium ${userProfile?.active ? 'text-green-600' : 'text-red-600'}`}>
                    {userProfile?.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {userProfile?.created_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Creado:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(userProfile.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}

                {userProfile?.last_login && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Último acceso:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(userProfile.last_login).toLocaleString('es-ES')}
                    </span>
                  </div>
                )}
              </div>

              {/* Campos editables */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#4A3C7B]">Información Editable</h3>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                    placeholder="Ingresa tu email"
                  />
                </div>

                {/* Cambiar contraseña */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Cambiar Contraseña (opcional)</h4>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Nueva contraseña:
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                      placeholder="Dejar en blanco para no cambiar"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Confirmar contraseña:
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                      placeholder="Confirmar nueva contraseña"
                    />
                  </div>
                </div>

                {/* Campos específicos para doctores */}
                {userProfile?.is_doctor && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Información del Doctor</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Nombres:
                        </label>
                        <input
                          type="text"
                          name="doctor_nombres"
                          value={formData.doctor_nombres}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                          placeholder="Nombres del doctor"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Apellidos:
                        </label>
                        <input
                          type="text"
                          name="doctor_apellidos"
                          value={formData.doctor_apellidos}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                          placeholder="Apellidos del doctor"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Teléfono:
                      </label>
                      <input
                        type="tel"
                        name="doctor_telefono"
                        value={formData.doctor_telefono}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                        placeholder="Teléfono del doctor"
                      />
                    </div>

                    {/* Información de solo lectura del doctor */}
                    {userProfile.doctor_info && (
                      <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                        <h5 className="text-sm font-medium text-blue-800">Información Adicional</h5>
                        {userProfile.doctor_info.dni && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-blue-600">DNI:</span>
                            <span className="text-xs font-medium text-blue-800">{userProfile.doctor_info.dni}</span>
                          </div>
                        )}
                        {userProfile.doctor_info.colegiatura && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-blue-600">Colegiatura:</span>
                            <span className="text-xs font-medium text-blue-800">{userProfile.doctor_info.colegiatura}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white py-3 px-4 rounded-lg font-medium hover:from-[#2D1B69] hover:to-[#1A0F3D] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </div>
            ) : (
              'Guardar cambios'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
