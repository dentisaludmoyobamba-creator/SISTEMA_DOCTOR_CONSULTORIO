import React, { useState, useEffect } from 'react';

const AppointmentModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  cita = null,
  doctores = [],
  fechaInicial = null,
  horaInicial = null,
  citasService = null
}) => {
  const [formData, setFormData] = useState({
    paciente: '',
    paciente_id: null,
    doctorId: 1,
    fecha: '',
    hora: '',
    duracion: 60,
    estado: 'confirmado',
    telefono: '',
    motivo: '',
    notas: ''
  });

  const [errors, setErrors] = useState({});
  const [pacientesSugeridos, setPacientesSugeridos] = useState([]);
  const [showPacientesSugeridos, setShowPacientesSugeridos] = useState(false);
  const [searchingPacientes, setSearchingPacientes] = useState(false);

  const estadosCita = [
    { value: "confirmado", label: "Confirmado", color: "bg-green-100" },
    { value: "pendiente", label: "Pendiente", color: "bg-yellow-100" },
    { value: "cancelado", label: "Cancelado", color: "bg-red-100" },
    { value: "atendida", label: "Atendida", color: "bg-blue-100" },
    { value: "en-consulta", label: "En consulta", color: "bg-purple-100" },
    { value: "ausente", label: "Ausente", color: "bg-gray-100" },
    { value: "reprogramada", label: "Reprogramada", color: "bg-orange-100" }
  ];

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (cita) {
        // Modo edición
        setFormData({
          paciente: cita.paciente || '',
          paciente_id: cita.paciente_id || null,
          doctorId: cita.doctorId || (doctores[0]?.id || 1),
          fecha: cita.fecha || '',
          hora: cita.hora || '',
          duracion: cita.duracion || 60,
          estado: cita.estado || 'confirmado',
          telefono: cita.telefono || '',
          motivo: cita.motivo || '',
          notas: cita.notas || ''
        });
      } else {
        // Modo creación
        setFormData({
          paciente: '',
          paciente_id: null,
          doctorId: doctores[0]?.id || 1,
          fecha: fechaInicial || '',
          hora: horaInicial || '',
          duracion: 60,
          estado: 'confirmado',
          telefono: '',
          motivo: '',
          notas: ''
        });
      }
      setErrors({});
      setPacientesSugeridos([]);
      setShowPacientesSugeridos(false);
    }
  }, [isOpen, cita, fechaInicial, horaInicial, doctores]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Buscar pacientes cuando se escriba en el campo paciente
    if (name === 'paciente' && value.length >= 2 && citasService) {
      searchPacientes(value);
    } else if (name === 'paciente' && value.length < 2) {
      setPacientesSugeridos([]);
      setShowPacientesSugeridos(false);
    }
  };

  // Buscar pacientes
  const searchPacientes = async (searchTerm) => {
    setSearchingPacientes(true);
    try {
      const result = await citasService.searchPacientes(searchTerm);
      if (result.success) {
        setPacientesSugeridos(result.pacientes);
        setShowPacientesSugeridos(result.pacientes.length > 0);
      } else {
        setPacientesSugeridos([]);
        setShowPacientesSugeridos(false);
      }
    } catch (e) {
      console.error('Error al buscar pacientes:', e);
      setPacientesSugeridos([]);
      setShowPacientesSugeridos(false);
    } finally {
      setSearchingPacientes(false);
    }
  };

  // Seleccionar paciente de la lista de sugeridos
  const handleSelectPaciente = (paciente) => {
    setFormData(prev => ({
      ...prev,
      paciente: paciente.nombre,
      paciente_id: paciente.id,
      telefono: paciente.telefono || ''
    }));
    setShowPacientesSugeridos(false);
    setPacientesSugeridos([]);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.paciente.trim()) {
      newErrors.paciente = 'El nombre del paciente es obligatorio';
    }
    
    if (!formData.paciente_id) {
      newErrors.paciente = 'Debe seleccionar un paciente válido de la lista';
    }
    
    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es obligatoria';
    }
    
    if (!formData.hora) {
      newErrors.hora = 'La hora es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const citaData = {
      ...formData,
      id: cita?.id || Date.now(), // Generar ID temporal si es nueva
      doctorId: parseInt(formData.doctorId),
      duracion: parseInt(formData.duracion)
    };

    onSave(citaData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {cita ? 'Editar Cita' : 'Nueva Cita'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nombre del paciente */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Paciente *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="paciente"
                  value={formData.paciente}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.paciente ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Escriba para buscar paciente..."
                  autoComplete="off"
                />
                {searchingPacientes && (
                  <div className="absolute right-3 top-3">
                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Lista de pacientes sugeridos */}
              {showPacientesSugeridos && pacientesSugeridos.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {pacientesSugeridos.map((paciente) => (
                    <button
                      key={paciente.id}
                      type="button"
                      onClick={() => handleSelectPaciente(paciente)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{paciente.nombre}</div>
                      <div className="text-sm text-gray-500">DNI: {paciente.dni} | Tel: {paciente.telefono}</div>
                    </button>
                  ))}
                </div>
              )}
              
              {errors.paciente && (
                <p className="text-red-500 text-sm mt-1">{errors.paciente}</p>
              )}
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {doctores.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fecha && (
                  <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora *
                </label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.hora ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.hora && (
                  <p className="text-red-500 text-sm mt-1">{errors.hora}</p>
                )}
              </div>
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (minutos)
              </label>
              <select
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={30}>30 minutos</option>
                <option value={60}>1 hora</option>
                <option value={90}>1.5 horas</option>
                <option value={120}>2 horas</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {estadosCita.filter(e => e.value !== 'todos').map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="999-123-456"
              />
            </div>

            {/* Motivo */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de la consulta
              </label>
              <textarea
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe el motivo de la consulta..."
              />
            </div>

            {/* Notas adicionales */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Notas internas o recordatorios..."
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {cita ? 'Actualizar' : 'Crear'} Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
