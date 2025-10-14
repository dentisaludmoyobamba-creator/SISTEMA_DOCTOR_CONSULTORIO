import React, { useState } from 'react';

const AgregarFamiliarModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    opcion: 'existente', // 'existente' o 'nuevo'
    filtro: 'Activos',
    busqueda: '',
    nombre: '',
    documento: '',
    telefono: '',
    email: '',
    apoderado: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.opcion === 'nuevo' && !formData.nombre) {
      alert('El nombre completo es obligatorio');
      return;
    }
    onSave(formData);
    setFormData({
      opcion: 'existente',
      filtro: 'Activos',
      busqueda: '',
      nombre: '',
      documento: '',
      telefono: '',
      email: '',
      apoderado: false
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold text-blue-600 uppercase">AGREGAR FAMILIAR</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-gray-600 text-sm mb-4">Elige una opción.</p>

          {/* Opción 1: El apoderado ya existe */}
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="opcion"
                value="existente"
                checked={formData.opcion === 'existente'}
                onChange={handleChange}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">El apoderado ya existe</span>
            </label>

            {formData.opcion === 'existente' && (
              <div className="ml-6 space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Buscar un paciente que ya existe</h4>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <select
                        name="filtro"
                        value={formData.filtro}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
                      >
                        <option value="Activos">Activos</option>
                        <option value="Inactivos">Inactivos</option>
                        <option value="Todos">Todos</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                      </div>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="busqueda"
                        value={formData.busqueda}
                        onChange={handleChange}
                        className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Busca por nombre, apellido, N° documento o p..."
                      />
                      <svg className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Opción 2: Crear un nuevo apoderado */}
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="opcion"
                value="nuevo"
                checked={formData.opcion === 'nuevo'}
                onChange={handleChange}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">Crear un nuevo apoderado</span>
            </label>

            {formData.opcion === 'nuevo' && (
              <div className="ml-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                  <input
                    type="text"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="apoderado"
                      checked={formData.apoderado}
                      onChange={handleChange}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Es apoderado</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Botón Continuar */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-teal-500 text-white px-8 py-2 rounded-md hover:bg-teal-600 transition-colors"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarFamiliarModal;
