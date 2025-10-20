import React, { useState, useEffect } from 'react';
import presupuestosService from '../services/presupuestosService';

const PresupuestosPaciente = ({ pacienteId }) => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPresupuesto, setSelectedPresupuesto] = useState(null);
  const [showDetalleModal, setShowDetalleModal] = useState(false);

  // Cargar presupuestos del paciente
  useEffect(() => {
    const cargarPresupuestos = async () => {
      try {
        setLoading(true);
        setError('');
        
        const result = await presupuestosService.list({ 
          paciente_id: pacienteId,
          limit: 50 
        });
        
        if (result.success) {
          setPresupuestos(result.presupuestos || []);
        } else {
          setError(result.error || 'Error al cargar presupuestos');
        }
      } catch (e) {
        console.error('Error al cargar presupuestos:', e);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    if (pacienteId) {
      cargarPresupuestos();
    }
  }, [pacienteId]);

  const handleVerDetalle = (presupuesto) => {
    setSelectedPresupuesto(presupuesto);
    setShowDetalleModal(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Borrador':
        return 'bg-gray-100 text-gray-800';
      case 'Enviado':
        return 'bg-blue-100 text-blue-800';
      case 'Aceptado':
        return 'bg-green-100 text-green-800';
      case 'Rechazado':
        return 'bg-red-100 text-red-800';
      case 'Facturado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '--';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatearMonto = (monto) => {
    if (!monto || monto === 0) return 'S/ 0.00';
    return `S/ ${parseFloat(monto).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 min-h-96 flex items-center justify-center py-16">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-[#4A3C7B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Cargando presupuestos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 min-h-96 flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar presupuestos</h3>
        <p className="text-gray-500 text-center mb-4 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (presupuestos.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 min-h-96 flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-[#30B0B0] to-[#4A3C7B] rounded-full flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#4A3C7B] mb-2">No hay presupuestos registrados</h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          Este paciente aún no tiene presupuestos creados. Puedes crear uno desde el botón "Crear presupuesto" en el header.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white rounded-t-xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Presupuestos del Paciente</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{presupuestos.length}</div>
              <div className="text-sm text-white/80">Total Presupuestos</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">
                {presupuestos.filter(p => p.estado === 'Aceptado').length}
              </div>
              <div className="text-sm text-white/80">Aceptados</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">
                {formatearMonto(presupuestos.reduce((sum, p) => sum + (p.monto_final || 0), 0))}
              </div>
              <div className="text-sm text-white/80">Valor Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de presupuestos */}
      <div className="bg-white rounded-b-xl border border-gray-200">
        <div className="divide-y divide-gray-200">
          {presupuestos.map((presupuesto) => (
            <div key={presupuesto.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-[#4A3C7B]">
                        {presupuesto.nombre_presupuesto || `Presupuesto #${presupuesto.id}`}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Dr. {presupuesto.doctor?.nombres} {presupuesto.doctor?.apellidos}</span>
                        <span>•</span>
                        <span>{formatearFecha(presupuesto.fecha_creacion)}</span>
                        {presupuesto.fecha_vencimiento && (
                          <>
                            <span>•</span>
                            <span>Vence: {formatearFecha(presupuesto.fecha_vencimiento)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div>
                      <span className="text-sm text-gray-500">Monto Total:</span>
                      <div className="text-lg font-semibold text-[#4A3C7B]">
                        {formatearMonto(presupuesto.monto_final)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500">Estado:</span>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(presupuesto.estado)}`}>
                          {presupuesto.estado}
                        </span>
                      </div>
                    </div>
                    
                    {presupuesto.nota_paciente && (
                      <div className="flex-1">
                        <span className="text-sm text-gray-500">Nota:</span>
                        <div className="text-sm text-gray-700 truncate max-w-xs">
                          {presupuesto.nota_paciente}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleVerDetalle(presupuesto)}
                    className="bg-[#30B0B0] hover:bg-[#2A9A9A] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Ver Detalle</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de detalle */}
      {showDetalleModal && selectedPresupuesto && (
        <DetallePresupuestoModal
          presupuesto={selectedPresupuesto}
          onClose={() => {
            setShowDetalleModal(false);
            setSelectedPresupuesto(null);
          }}
        />
      )}
    </div>
  );
};

// Componente para mostrar el detalle del presupuesto
const DetallePresupuestoModal = ({ presupuesto, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-4 bg-white rounded-xl shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                {presupuesto.nombre_presupuesto || `Presupuesto #${presupuesto.id}`}
              </h3>
              <p className="text-sm text-white/80">
                Dr. {presupuesto.doctor?.nombres} {presupuesto.doctor?.apellidos} • 
                {new Date(presupuesto.fecha_creacion).toLocaleDateString('es-ES')}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información general */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-[#4A3C7B] mb-4">Información General</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Estado:</span>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    presupuesto.estado === 'Borrador' ? 'bg-gray-100 text-gray-800' :
                    presupuesto.estado === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                    presupuesto.estado === 'Aceptado' ? 'bg-green-100 text-green-800' :
                    presupuesto.estado === 'Rechazado' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {presupuesto.estado}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Monto Total:</span>
                <div className="text-lg font-semibold text-[#4A3C7B]">
                  S/ {parseFloat(presupuesto.monto_final || 0).toFixed(2)}
                </div>
              </div>
              {presupuesto.fecha_vencimiento && (
                <div>
                  <span className="text-sm text-gray-500">Fecha de Vencimiento:</span>
                  <div className="text-sm text-gray-700">
                    {new Date(presupuesto.fecha_vencimiento).toLocaleDateString('es-ES')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notas */}
          {(presupuesto.nota_paciente || presupuesto.nota_interna) && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-[#4A3C7B] mb-4">Notas</h4>
              {presupuesto.nota_paciente && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Nota para el paciente:</span>
                  <div className="text-sm text-gray-600 mt-1 p-3 bg-white rounded-lg">
                    {presupuesto.nota_paciente}
                  </div>
                </div>
              )}
              {presupuesto.nota_interna && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Nota interna:</span>
                  <div className="text-sm text-gray-600 mt-1 p-3 bg-white rounded-lg">
                    {presupuesto.nota_interna}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Información del paciente */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-[#4A3C7B] mb-4">Información del Paciente</h4>
            <div className="text-sm text-gray-700">
              <div className="font-medium">
                {presupuesto.paciente?.nombres} {presupuesto.paciente?.apellidos}
              </div>
              <div className="text-gray-600">
                DNI: {presupuesto.paciente?.dni || 'No disponible'}
              </div>
            </div>
          </div>

          {/* Placeholder para items del presupuesto */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-[#4A3C7B] mb-4">Items del Presupuesto</h4>
            <div className="text-sm text-gray-600">
              <p>Los detalles de los items del presupuesto se mostrarán aquí cuando se implemente la funcionalidad completa.</p>
              <p className="mt-2 text-xs text-gray-500">
                Esta información se obtendrá de la tabla presupuesto_items en la base de datos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresupuestosPaciente;
