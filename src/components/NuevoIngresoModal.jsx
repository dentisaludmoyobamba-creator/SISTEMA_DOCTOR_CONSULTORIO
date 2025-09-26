import React, { useState } from 'react';

const NuevoIngresoModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    tipo: 'servicios',
    itemSeleccionado: '',
    items: [],
    comprobante: 'boleta',
    medioPago: 'efectivo',
    paciente: '',
    doctor: 'Eduardo Carmin',
    notaAdministrativa: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    // Lógica para agregar item
    console.log('Agregar item');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(formData);
      setFormData({
        tipo: 'servicios',
        itemSeleccionado: '',
        items: [],
        comprobante: 'boleta',
        medioPago: 'efectivo',
        paciente: '',
        doctor: 'Eduardo Carmin',
        notaAdministrativa: ''
      });
      onClose();
    } catch (error) {
      console.error('Error al crear ingreso:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50">
      <div className="bg-white w-full max-w-4xl h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69]">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-white/80 mb-1">
                <span className="text-white/60">&lt; Caja &gt;</span> Nuevo Ingreso
              </div>
              <h2 className="text-2xl font-bold text-white">NUEVO INGRESO</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white/80 mt-2 text-sm">
            Agrega uno o varios ítems. Puede ser un servicio o producto de venta que tienes en el inventario.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selección de ítems */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
                >
                  <option value="servicios">Servicios</option>
                  <option value="productos">Productos</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
                  Selecciona ítem
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar producto/servicio"
                    className="w-full p-3 pl-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
                  />
                  <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-gradient-to-r from-[#30B0B0] to-[#4A3C7B] text-white px-4 py-3 rounded-lg hover:from-[#4A3C7B] hover:to-[#2D1B69] transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Nuevo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabla de ítems agregados */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-[#4A3C7B]">Item</th>
                  <th className="text-left p-3 font-semibold text-[#4A3C7B]">Cantidad</th>
                  <th className="text-left p-3 font-semibold text-[#4A3C7B]">Precio Unit.</th>
                  <th className="text-left p-3 font-semibold text-[#4A3C7B]">Laboratorio</th>
                  <th className="text-left p-3 font-semibold text-[#4A3C7B]">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No hay ningún item agregado.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Comprobante */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-3">
              Comprobante
            </label>
            <div className="flex space-x-4">
              {['boleta', 'factura', 'otro', 'recibo'].map((tipo) => (
                <label key={tipo} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="comprobante"
                    value={tipo}
                    checked={formData.comprobante === tipo}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#30B0B0] focus:ring-[#30B0B0]"
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {tipo === 'otro' ? 'Otro' : tipo}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Medio de pago */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              Medio de pago
            </label>
            <div className="flex items-center space-x-3">
              <select
                name="medioPago"
                value={formData.medioPago}
                onChange={handleInputChange}
                className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
              </select>
              <button
                type="button"
                className="text-[#30B0B0] hover:text-[#2A9A9A] font-medium flex items-center space-x-1"
              >
                <span>Dividir Pago</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Paciente */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              Paciente
            </label>
            <div className="relative">
              <input
                type="text"
                name="paciente"
                value={formData.paciente}
                onChange={handleInputChange}
                placeholder="Buscar paciente"
                className="w-full p-3 pl-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
              />
              <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Doctor relacionado */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              Doctor relacionado a la venta
            </label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
            >
              <option value="Eduardo Carmin">Eduardo Carmin</option>
              <option value="Dr. García">Dr. García</option>
              <option value="Dra. López">Dra. López</option>
            </select>
          </div>

          {/* Nota administrativa */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              Nota administrativa
            </label>
            <textarea
              name="notaAdministrativa"
              value={formData.notaAdministrativa}
              onChange={handleInputChange}
              placeholder="Escribe aquí..."
              rows={3}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200 resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#30B0B0] text-white rounded-lg hover:bg-[#2A9A9A] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Confirmando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoIngresoModal;
