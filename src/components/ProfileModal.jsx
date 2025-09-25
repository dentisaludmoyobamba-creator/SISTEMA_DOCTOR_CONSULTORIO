import React, { useState } from 'react';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    nombres: user?.nombre || '',
    apellidos: user?.apellido || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Mi perfil</h2>
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
        <div className="p-6 space-y-4">
          {/* Tipo de usuario */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tipo de usuario:</span>
            <span className="text-sm font-medium text-gray-900">Superadmin</span>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Email:</span>
            <span className="text-sm font-medium text-gray-900">{user?.email || 'eduardo.carmin@tecsup.edu.pe'}</span>
          </div>

          {/* Creado */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Creado:</span>
            <span className="text-sm font-medium text-gray-900">14 de septiembre del 2025</span>
          </div>

          {/* Nombres */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">
              Nombres:<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa tus nombres"
            />
          </div>

          {/* Apellidos */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">
              Apellidos:<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa tus apellidos"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
