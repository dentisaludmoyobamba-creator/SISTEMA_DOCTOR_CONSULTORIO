import React, { useState, useEffect } from 'react';
import { buscarPacientes, buscarDoctores, buscarServicios, crearPresupuesto } from '../services/presupuestosService';

const CrearPresupuestoModal = ({ isOpen, onClose, onSave }) => {
  const [paciente, setPaciente] = useState(null);
  const [busquedaPaciente, setBusquedaPaciente] = useState('');
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [mostrarListaPacientes, setMostrarListaPacientes] = useState(false);
  const [nombrePresupuesto, setNombrePresupuesto] = useState('');
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
  const [doctores, setDoctores] = useState([]);
  const [tipo, setTipo] = useState('Servicio');
  const [busquedaServicio, setBusquedaServicio] = useState('');
  const [servicios, setServicios] = useState([]);
  const [serviciosAgregados, setServiciosAgregados] = useState([]);
  const [notaPaciente, setNotaPaciente] = useState('');
  const [notaInterna, setNotaInterna] = useState('');
  const [total, setTotal] = useState(0);

  // Cargar doctores disponibles
  useEffect(() => {
    const cargarDoctores = async () => {
      try {
        const doctoresData = await buscarDoctores('', 50);
        setDoctores(doctoresData);
        if (doctoresData.length > 0) {
          setDoctorSeleccionado(doctoresData[0]);
        }
      } catch (error) {
        console.error('Error al cargar doctores:', error);
      }
    };
    cargarDoctores();
  }, []);

  // Buscar pacientes en tiempo real
  const handleBuscarPacientes = async (termino) => {
    setBusquedaPaciente(termino);
    
    if (termino.length < 2) {
      setPacientesFiltrados([]);
      setMostrarListaPacientes(false);
      return;
    }

    try {
      const pacientes = await buscarPacientes(termino, 10);
      setPacientesFiltrados(pacientes);
      setMostrarListaPacientes(true);
    } catch (error) {
      console.error('Error al buscar pacientes:', error);
      setPacientesFiltrados([]);
      
      // Mostrar mensaje de error al usuario
      if (error.message.includes('sesión') || error.message.includes('Token')) {
        alert(error.message + '\n\nSerás redirigido al login.');
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        alert('Error al buscar pacientes: ' + error.message);
      }
    }
  };

  // Seleccionar paciente
  const seleccionarPaciente = (pacienteSeleccionado) => {
    setPaciente(pacienteSeleccionado);
    setBusquedaPaciente(`${pacienteSeleccionado.nombres} ${pacienteSeleccionado.apellidos}`);
    setMostrarListaPacientes(false);
  };

  // Buscar servicios/productos en tiempo real
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
  
  useEffect(() => {
    const handleBuscarServicios = async () => {
      if (busquedaServicio.length < 2) {
        setServiciosFiltrados([]);
        return;
      }

      try {
        const serviciosData = await buscarServicios(busquedaServicio, tipo, 20);
        setServiciosFiltrados(serviciosData);
      } catch (error) {
        console.error('Error al buscar servicios:', error);
        setServiciosFiltrados([]);
      }
    };

    const timeoutId = setTimeout(handleBuscarServicios, 300);
    return () => clearTimeout(timeoutId);
  }, [busquedaServicio, tipo]);

  // Agregar servicio al presupuesto
  const agregarServicio = (servicio) => {
    const nuevoServicio = {
      id: Date.now(),
      nombre: servicio.nombre,
      cantidad: 1,
      precio: servicio.precio,
      descuento: 0,
      subtotal: servicio.precio,
      diente: '',
      comentario: ''
    };
    setServiciosAgregados([...serviciosAgregados, nuevoServicio]);
    setBusquedaServicio('');
    calcularTotal();
  };

  // Actualizar cantidad
  const actualizarCantidad = (id, nuevaCantidad) => {
    const serviciosActualizados = serviciosAgregados.map(servicio => {
      if (servicio.id === id) {
        const subtotal = nuevaCantidad * servicio.precio * (1 - servicio.descuento / 100);
        return { ...servicio, cantidad: nuevaCantidad, subtotal };
      }
      return servicio;
    });
    setServiciosAgregados(serviciosActualizados);
    calcularTotal();
  };

  // Actualizar descuento
  const actualizarDescuento = (id, nuevoDescuento) => {
    const serviciosActualizados = serviciosAgregados.map(servicio => {
      if (servicio.id === id) {
        const subtotal = servicio.cantidad * servicio.precio * (1 - nuevoDescuento / 100);
        return { ...servicio, descuento: nuevoDescuento, subtotal };
      }
      return servicio;
    });
    setServiciosAgregados(serviciosActualizados);
    calcularTotal();
  };

  // Eliminar servicio
  const eliminarServicio = (id) => {
    const serviciosActualizados = serviciosAgregados.filter(servicio => servicio.id !== id);
    setServiciosAgregados(serviciosActualizados);
    calcularTotal();
  };

  // Calcular total
  const calcularTotal = () => {
    const totalCalculado = serviciosAgregados.reduce((sum, servicio) => sum + servicio.subtotal, 0);
    setTotal(totalCalculado);
  };

  // Guardar presupuesto
  const handleGuardar = async () => {
    if (!paciente) {
      alert('Por favor selecciona un paciente');
      return;
    }

    if (!doctorSeleccionado) {
      alert('Por favor selecciona un doctor responsable');
      return;
    }

    if (serviciosAgregados.length === 0) {
      alert('Por favor agrega al menos un servicio o producto');
      return;
    }

    try {
      const presupuestoData = {
        id_paciente: paciente.id,
        id_doctor: doctorSeleccionado.id,
        nombre_presupuesto: nombrePresupuesto || `Presupuesto ${paciente.nombres} ${paciente.apellidos}`,
        estado: 'Borrador',
        nota_paciente: notaPaciente,
        nota_interna: notaInterna,
        items: serviciosAgregados.map(item => ({
          tipo_item: item.tipo,
          id_tratamiento: item.tipo === 'Servicio' ? item.id_servicio : null,
          id_producto: item.tipo === 'Producto' ? item.id_producto : null,
          nombre_item: item.nombre,
          descripcion: item.descripcion || '',
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          descuento_porcentaje: item.descuento,
          descuento_monto: (item.precio * item.cantidad * item.descuento) / 100,
          subtotal: item.subtotal,
          diente: item.diente || '',
          comentario: item.comentario || ''
        }))
      };

      const result = await crearPresupuesto(presupuestoData);
      
      if (result.success) {
        alert('Presupuesto creado exitosamente');
        onSave(result);
        handleCerrar();
      } else {
        alert(`Error al crear presupuesto: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al guardar presupuesto:', error);
      alert('Error de conexión al guardar presupuesto');
    }
  };

  // Cerrar modal
  const handleCerrar = () => {
    setPaciente(null);
    setBusquedaPaciente('');
    setNombrePresupuesto('');
    setServiciosAgregados([]);
    setNotaPaciente('');
    setNotaInterna('');
    setTotal(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-4xl h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Crear presupuesto</h2>
          <button
            onClick={handleCerrar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Campos superiores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Paciente */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Paciente</label>
              <div className="relative">
                <input
                  type="text"
                  value={busquedaPaciente}
                  onChange={(e) => handleBuscarPacientes(e.target.value)}
                  onFocus={() => setMostrarListaPacientes(pacientesFiltrados.length > 0)}
                  placeholder="Buscar paciente"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Lista de pacientes */}
              {mostrarListaPacientes && pacientesFiltrados.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {pacientesFiltrados.map((paciente) => (
                    <button
                      key={paciente.id}
                      onClick={() => seleccionarPaciente(paciente)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{paciente.nombres} {paciente.apellidos}</div>
                      <div className="text-sm text-gray-500">{paciente.documento}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nombre de presupuesto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de presupuesto (opcional)</label>
              <input
                type="text"
                value={nombrePresupuesto}
                onChange={(e) => setNombrePresupuesto(e.target.value)}
                placeholder="presupuesto de prueba"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Doctor responsable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor responsable</label>
              <select
                value={doctorSeleccionado ? doctorSeleccionado.id : ''}
                onChange={(e) => {
                  const doctor = doctores.find(d => d.id === parseInt(e.target.value));
                  setDoctorSeleccionado(doctor);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {doctores.length === 0 && <option value="">Cargando doctores...</option>}
                {doctores.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.nombre_completo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Agregar servicios/productos */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Agregar servicios/productos</h3>
              <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Servicio">Servicio</option>
                  <option value="Producto">Producto</option>
                </select>
              </div>

              {/* Seleccionar servicio/producto */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona un servicio/producto</label>
                <div className="relative">
                  <input
                    type="text"
                    value={busquedaServicio}
                    onChange={(e) => setBusquedaServicio(e.target.value)}
                    placeholder="Buscar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Lista de servicios filtrados */}
                {busquedaServicio && serviciosFiltrados.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {serviciosFiltrados.map((servicio) => (
                      <button
                        key={servicio.id}
                        onClick={() => agregarServicio(servicio)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium">{servicio.nombre}</div>
                        <div className="text-sm text-gray-500">S/ {servicio.precio.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón Nuevo */}
              <div className="flex items-end">
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  + Nuevo
                </button>
              </div>
            </div>
          </div>

          {/* Tabla de servicios agregados */}
          {serviciosAgregados.length > 0 && (
            <div className="mb-6">
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Item</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Diente</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Cant.</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Precio Unit.</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Dcto.</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Subtotal</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Comentario</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviciosAgregados.map((servicio, index) => (
                      <tr key={servicio.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mr-2 cursor-move" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                            {servicio.nombre}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={servicio.diente}
                            onChange={(e) => {
                              const serviciosActualizados = serviciosAgregados.map(s => 
                                s.id === servicio.id ? { ...s, diente: e.target.value } : s
                              );
                              setServiciosAgregados(serviciosActualizados);
                            }}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder=""
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={servicio.cantidad}
                            onChange={(e) => actualizarCantidad(servicio.id, parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">S/ {servicio.precio.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={servicio.descuento}
                            onChange={(e) => actualizarDescuento(servicio.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <span className="ml-1 text-sm">%</span>
                        </td>
                        <td className="px-4 py-3 font-medium">S/ {servicio.subtotal.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={servicio.comentario}
                            onChange={(e) => {
                              const serviciosActualizados = serviciosAgregados.map(s => 
                                s.id === servicio.id ? { ...s, comentario: e.target.value } : s
                              );
                              setServiciosAgregados(serviciosActualizados);
                            }}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder=""
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => eliminarServicio(servicio.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notas y Total */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Notas */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nota para el paciente</label>
                <textarea
                  value={notaPaciente}
                  onChange={(e) => setNotaPaciente(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Escribe una nota para el paciente..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nota interna</label>
                <textarea
                  value={notaInterna}
                  onChange={(e) => setNotaInterna(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Nota interna (solo visible para el equipo)..."
                />
              </div>
            </div>

            {/* Total */}
            <div className="flex flex-col justify-center">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-gray-800">
                  Total: S/ {total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between items-center">
            <button className="text-blue-500 hover:text-blue-700 font-medium">
              Guardar como template
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCerrar}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearPresupuestoModal;
