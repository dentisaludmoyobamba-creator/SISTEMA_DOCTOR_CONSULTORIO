import React, { useState } from 'react';

const AgregarDatosFiscalesModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    tipoDocumento: 'RUC',
    documento: '',
    razonSocial: 'Elias Jesus Leandro',
    direccion: '',
    departamento: 'Lima',
    ciudad: 'Lima',
    distrito: 'Ancón'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      tipoDocumento: 'RUC',
      documento: '',
      razonSocial: 'Elias Jesus Leandro',
      direccion: '',
      departamento: 'Lima',
      ciudad: 'Lima',
      distrito: 'Ancón'
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold text-blue-600 uppercase">AGREGAR DATOS FISCALES</h2>
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
          {/* Tipo de Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Documento:
            </label>
            <div className="relative">
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="RUC">RUC</option>
                <option value="DNI">DNI</option>
                <option value="CE">CE</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documento:
            </label>
            <input
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=""
            />
          </div>

          {/* Razón Social */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razón Social:
            </label>
            <input
              type="text"
              name="razonSocial"
              value={formData.razonSocial}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=""
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección:
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=""
            />
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamento:
            </label>
            <div className="relative">
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="Lima">Lima</option>
                <option value="Arequipa">Arequipa</option>
                <option value="Cusco">Cusco</option>
                <option value="La Libertad">La Libertad</option>
                <option value="Piura">Piura</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad:
            </label>
            <div className="relative">
              <select
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="Lima">Lima</option>
                <option value="Arequipa">Arequipa</option>
                <option value="Cusco">Cusco</option>
                <option value="Trujillo">Trujillo</option>
                <option value="Piura">Piura</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Distrito */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distrito:
            </label>
            <div className="relative">
              <select
                name="distrito"
                value={formData.distrito}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="Ancón">Ancón</option>
                <option value="Miraflores">Miraflores</option>
                <option value="San Isidro">San Isidro</option>
                <option value="La Molina">La Molina</option>
                <option value="Surco">Surco</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-teal-500 text-white px-8 py-2 rounded-md hover:bg-teal-600 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarDatosFiscalesModal;
