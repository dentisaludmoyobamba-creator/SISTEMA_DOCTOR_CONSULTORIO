import React, { useState } from 'react';

const AddUserModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    tipoUsuario: 'doctor-temporal',
    nombre: '',
    apellido: '',
    especialidad: '',
    email: '',
    telefono: '',
    codigoPais: '+51'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(formData);
      setFormData({
        tipoUsuario: 'doctor-temporal',
        nombre: '',
        apellido: '',
        especialidad: '',
        email: '',
        telefono: '',
        codigoPais: '+51'
      });
      onClose();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Agrega nuevo usuario</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo de usuario */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tipo de usuario
            </label>
            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
            >
              <option value="doctor-temporal">Doctor temporal</option>
              <option value="doctor-permanente">Doctor permanente</option>
              <option value="administrador">Administrador</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              Este usuario es gratuito y puede tener 10 pacientes o citas al mes.{' '}
              <a href="#" className="text-[#30B0B0] hover:underline">Conoce más</a>
            </p>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
              required
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              placeholder="Apellido"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
              required
            />
          </div>

          {/* Especialidad */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Especialidad
            </label>
            <select
              name="especialidad"
              value={formData.especialidad}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
            >
              <option value="">Seleccionar</option>
              <option value="odontologia-general">Odontología General</option>
              <option value="ortodoncia">Ortodoncia</option>
              <option value="endodoncia">Endodoncia</option>
              <option value="periodoncia">Periodoncia</option>
              <option value="cirugia-oral">Cirugía Oral</option>
              <option value="prostodoncia">Prótesis Dental</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@ejemplo.com"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Teléfono (Opcional)
            </label>
            <div className="flex space-x-2">
              <select
                name="codigoPais"
                value={formData.codigoPais}
                onChange={handleInputChange}
                className="w-24 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
              >
                <option value="+51">🇵🇪 +51</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+52">🇲🇽 +52</option>
              </select>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="000000000"
                className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
              />
            </div>
          </div>

          {/* Información de usuarios gratuitos */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Usuarios gratuitos: 5 / Disponibles: 5</span>
              <a href="#" className="text-[#30B0B0] hover:underline text-sm ml-auto flex items-center">
                Gestionar usuarios
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#30B0B0] text-white rounded-lg hover:bg-[#2A9A9A] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
