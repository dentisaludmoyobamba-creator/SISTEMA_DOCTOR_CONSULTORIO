import React, { useState, useEffect } from 'react';
import usersService from '../services/usersService';

const UserModal = ({ isOpen, onClose, onUserSaved, editingUser = null }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role_id: '',
    doctorInfo: {
      nombres: '',
      apellidos: '',
      dni: '',
      colegiatura: '',
      telefono: ''
    }
  });
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar roles al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadRoles();
      if (editingUser) {
        // Prellenar formulario para edición
        setFormData({
          username: editingUser.username || '',
          email: editingUser.email || '',
          password: '',
          confirmPassword: '',
          role_id: '',
          doctorInfo: {
            nombres: editingUser.doctorInfo?.nombres || '',
            apellidos: editingUser.doctorInfo?.apellidos || '',
            dni: editingUser.doctorInfo?.dni || '',
            colegiatura: editingUser.doctorInfo?.colegiatura || '',
            telefono: editingUser.doctorInfo?.telefono || ''
          }
        });
      } else {
        // Limpiar formulario para nuevo usuario
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          role_id: '',
          doctorInfo: {
            nombres: '',
            apellidos: '',
            dni: '',
            colegiatura: '',
            telefono: ''
          }
        });
      }
      setError('');
      setSuccess('');
    }
  }, [isOpen, editingUser]);

  const loadRoles = async () => {
    const result = await usersService.getRoles();
    if (result.success) {
      setRoles(result.roles);
      // Si estamos editando, buscar el rol actual
      if (editingUser) {
        const currentRole = result.roles.find(role => role.name === editingUser.role);
        if (currentRole) {
          setSelectedRole(currentRole);
          setFormData(prev => ({ ...prev, role_id: currentRole.id }));
        }
      }
    } else {
      setError(result.error || 'Error al cargar roles');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('doctor_')) {
      const doctorField = name.replace('doctor_', '');
      setFormData(prev => ({
        ...prev,
        doctorInfo: { ...prev.doctorInfo, [doctorField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar mensajes
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleRoleChange = (e) => {
    const roleId = parseInt(e.target.value);
    const role = roles.find(r => r.id === roleId);
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role_id: roleId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!editingUser && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Preparar datos según si es creación o edición
    let userData;
    if (editingUser) {
      // Para edición, solo enviar campos que han cambiado
      userData = {};
      if (formData.email !== editingUser.email) userData.email = formData.email;
      if (formData.password) userData.password = formData.password;
      if (formData.role_id && selectedRole && selectedRole.name !== editingUser.role) {
        userData.role_id = formData.role_id;
      }
      
      // Datos del doctor si es necesario
      if (selectedRole?.name === 'Doctor' || editingUser.isDoctor) {
        const doctorInfo = {};
        let hasDoctorChanges = false;
        
        if (formData.doctorInfo.nombres !== (editingUser.doctorInfo?.nombres || '')) {
          doctorInfo.nombres = formData.doctorInfo.nombres;
          hasDoctorChanges = true;
        }
        if (formData.doctorInfo.apellidos !== (editingUser.doctorInfo?.apellidos || '')) {
          doctorInfo.apellidos = formData.doctorInfo.apellidos;
          hasDoctorChanges = true;
        }
        if (formData.doctorInfo.telefono !== (editingUser.doctorInfo?.telefono || '')) {
          doctorInfo.telefono = formData.doctorInfo.telefono;
          hasDoctorChanges = true;
        }
        
        if (hasDoctorChanges) {
          userData.doctor_info = doctorInfo;
        }
      }
    } else {
      // Para creación, usar todos los datos
      userData = usersService.prepareUserDataForCreation(formData, selectedRole);
    }

    // Validar datos
    const validation = usersService.validateUserData(userData, !!editingUser);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (editingUser) {
        result = await usersService.updateUser(editingUser.id, userData);
      } else {
        result = await usersService.createUser(userData);
      }

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          onUserSaved();
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Error al guardar usuario');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isDoctor = selectedRole?.name === 'Doctor';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4A3C7B] to-[#2D1B69] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#4A3C7B]">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica del usuario */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información del Usuario</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                    placeholder="Ingresa el username"
                    required={!editingUser}
                    disabled={editingUser} // Username no se puede cambiar
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                    placeholder="Ingresa el email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                    placeholder={editingUser ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"}
                    required={!editingUser}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña {!editingUser && '*'}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                    placeholder="Repetir contraseña"
                    required={!editingUser && formData.password}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleRoleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                  required
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Información del doctor (solo si el rol es Doctor) */}
            {isDoctor && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900">Información del Doctor</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      name="doctor_nombres"
                      value={formData.doctorInfo.nombres}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                      placeholder="Nombres del doctor"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      name="doctor_apellidos"
                      value={formData.doctorInfo.apellidos}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                      placeholder="Apellidos del doctor"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DNI *
                    </label>
                    <input
                      type="text"
                      name="doctor_dni"
                      value={formData.doctorInfo.dni}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                      placeholder="DNI del doctor"
                      required
                      disabled={editingUser} // DNI no se puede cambiar en edición
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colegiatura *
                    </label>
                    <input
                      type="text"
                      name="doctor_colegiatura"
                      value={formData.doctorInfo.colegiatura}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                      placeholder="Número de colegiatura"
                      required
                      disabled={editingUser} // Colegiatura no se puede cambiar en edición
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="doctor_telefono"
                    value={formData.doctorInfo.telefono}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
                    placeholder="Teléfono del doctor"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white py-3 px-4 rounded-lg font-medium hover:from-[#2D1B69] hover:to-[#1A0F3D] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editingUser ? 'Actualizando...' : 'Creando...'}
              </div>
            ) : (
              editingUser ? 'Actualizar Usuario' : 'Crear Usuario'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
