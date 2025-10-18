import React, { useState, useEffect } from 'react';
import inventarioService from '../services/inventarioService';
import authService from '../services/authService';

const DetallesOrdenModal = ({ isOpen, onClose, ordenId }) => {
  const [loading, setLoading] = useState(true);
  const [orden, setOrden] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && ordenId) {
      loadDetallesOrden();
    }
  }, [isOpen, ordenId]);

  const loadDetallesOrden = async () => {
    setLoading(true);
    setError(null);
    try {
      inventarioService.setAuthService(authService);
      const result = await inventarioService.getOrdenDetalles(ordenId);
      
      if (result.success) {
        setOrden(result.orden);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al cargar detalles de la orden');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[95%] max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-8 py-6 border-b border-cyan-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2.5 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Detalles de la Orden</h3>
                <p className="text-cyan-100 text-sm">Información completa de la orden de compra</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8 bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="animate-spin h-12 w-12 text-cyan-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Cargando detalles de la orden...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          ) : orden ? (
            <div className="space-y-6">
              {/* Información General */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información General
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Orden ID</label>
                    <p className="text-lg font-bold text-cyan-700">#{orden.id}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Nombre Interno</label>
                    <p className="text-base font-semibold text-gray-900">{orden.nombre_interno}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Proveedor</label>
                    <p className="text-base text-gray-700">{orden.proveedor || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Estado</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      orden.estado === 'Orden ingresada a almacén' 
                        ? 'bg-green-100 text-green-800'
                        : orden.estado === 'En proceso'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {orden.estado}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Fecha de Creación</label>
                    <p className="text-base text-gray-700">
                      {orden.fecha_creacion ? new Date(orden.fecha_creacion).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Monto Total</label>
                    <p className="text-2xl font-bold text-cyan-700">S/ {parseFloat(orden.monto_total || 0).toFixed(2)}</p>
                  </div>
                </div>

                {/* Fechas adicionales */}
                {(orden.fecha_entrega || orden.fecha_pago) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
                    {orden.fecha_entrega && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Fecha de Entrega</label>
                        <p className="text-base text-gray-700">
                          {new Date(orden.fecha_entrega).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                    )}
                    {orden.fecha_pago && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Fecha de Pago</label>
                        <p className="text-base text-gray-700">
                          {new Date(orden.fecha_pago).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Nota interna */}
                {orden.nota_interna && (
                  <div className="mt-6 pt-6 border-t">
                    <label className="text-xs font-medium text-gray-500 uppercase">Nota Interna</label>
                    <p className="text-base text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">{orden.nota_interna}</p>
                  </div>
                )}
              </div>

              {/* Productos de la Orden */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Productos de la Orden
                  <span className="ml-3 text-sm font-normal text-gray-500">
                    ({orden.items?.length || 0} items)
                  </span>
                </h4>

                {orden.items && orden.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                        <div className="grid grid-cols-7 gap-4 px-6 py-3 text-sm font-medium">
                          <div>Producto</div>
                          <div>Cantidad</div>
                          <div>Lote</div>
                          <div>Precio Unit.</div>
                          <div>F. Vencimiento</div>
                          <div>Subtotal</div>
                          <div>Fecha Registro</div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {orden.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-7 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                            <div className="text-sm font-medium text-gray-900">{item.nombre_producto}</div>
                            <div className="text-sm text-gray-700">{item.cantidad}</div>
                            <div className="text-sm text-gray-700">
                              {item.lote ? (
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{item.lote}</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-700">S/ {parseFloat(item.precio_unitario).toFixed(2)}</div>
                            <div className="text-sm text-gray-700">
                              {item.fecha_vencimiento ? (
                                <span className="text-orange-600 font-medium">
                                  {new Date(item.fecha_vencimiento).toLocaleDateString('es-PE')}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">S/ {parseFloat(item.subtotal).toFixed(2)}</div>
                            <div className="text-xs text-gray-500">
                              {item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleDateString('es-PE') : '-'}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Footer con totales */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t-2 border-gray-300">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            Total de productos: <span className="font-bold text-gray-900">{orden.items.length}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">Monto Total de la Orden:</div>
                            <div className="text-3xl font-bold text-cyan-700">
                              S/ {parseFloat(orden.monto_total || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-3">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Esta orden no tiene productos asociados</p>
                    <p className="text-sm text-gray-400 mt-1">Los items se agregan al crear la orden</p>
                  </div>
                )}
              </div>

              {/* Información adicional */}
              {orden.estado === 'Orden ingresada a almacén' && orden.items && orden.items.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-green-800 font-medium">Stock actualizado automáticamente</p>
                      <p className="text-xs text-green-700 mt-1">
                        Los {orden.items.length} productos de esta orden fueron ingresados al inventario y el stock se actualizó correctamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-white px-8 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gray-600 text-white hover:bg-gray-700 font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesOrdenModal;

