import React, { useEffect, useMemo, useState } from 'react';
import NuevoIngresoModal from '../components/NuevoIngresoModal';
import NuevoEgresoModal from '../components/NuevoEgresoModal';
import ContextMenu from '../components/ContextMenu';
import DetallesIngresoModal from '../components/DetallesIngresoModal';
import cajaService from '../services/cajaService';
import authService from '../services/authService';

const Caja = () => {
  const [activeTab, setActiveTab] = useState('ingresos-egresos');
  const [periodo, setPeriodo] = useState('Hoy');
  const [doctor, setDoctor] = useState('Todos');
  const [showNuevoIngresoModal, setShowNuevoIngresoModal] = useState(false);
  const [showNuevoEgresoModal, setShowNuevoEgresoModal] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ ingresoHoy: 0, egresoHoy: 0, balanceHoy: 0, balanceMes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const dateISO = useMemo(() => currentDate.toISOString().slice(0,10), [currentDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      cajaService.setAuthService(authService);
      const [listRes, sumRes] = await Promise.all([
        cajaService.list({ date: dateISO, type: filterType }),
        cajaService.summary({ date: dateISO })
      ]);
      if (listRes.success) setTransactions(listRes.transactions); else setError(listRes.error);
      if (sumRes.success) setSummary(sumRes.summary); else setError(prev => prev || sumRes.error);
    } catch (e) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [dateISO, filterType]);

  const resumenFinanciero = summary;

  const formatearMonto = (monto, tipo) => {
    const signo = tipo === 'ingreso' ? '+' : '-';
    const color = tipo === 'ingreso' ? 'text-green-600' : 'text-red-600';
    return (
      <span className={color}>
        {signo} S/ {monto.toFixed(2)}
      </span>
    );
  };

  const formatearHora = (hora) => hora;

  const handleNuevoIngreso = () => {
    setShowNuevoIngresoModal(true);
  };

  const handleSaveIngreso = async (ingresoData) => {
    cajaService.setAuthService(authService);
    const montoCalculado = Number(ingresoData.precioUnitario || 0) * Number(ingresoData.cantidad || 1);
    const res = await cajaService.create({
      tipo_transaccion: 'ingreso',
      concepto: ingresoData.servicioProducto || 'Servicio',
      monto: montoCalculado || 0,
      medio_pago: ingresoData.medioPago || 'efectivo',
      comentario: ingresoData.notaAdministrativa || '',
      id_doctor: null,
      id_paciente: null,
      referencia_pago: null,
      estado: 'completado',
      fecha_transaccion: new Date().toISOString()
    });
    if (!res.success) throw new Error(res.error);
    await loadData();
  };

  const handleNuevoEgreso = () => {
    setShowNuevoEgresoModal(true);
  };

  const handleSaveEgreso = async (egresoData) => {
    cajaService.setAuthService(authService);
    const res = await cajaService.create({
      tipo_transaccion: 'egreso',
      concepto: egresoData.concepto,
      monto: Number(egresoData.monto || 0),
      medio_pago: egresoData.medioPago,
      comentario: egresoData.comentario || '',
      id_doctor: null,
      id_paciente: null,
      referencia_pago: egresoData.numeroFactura || null,
      estado: 'completado',
      fecha_transaccion: new Date().toISOString()
    });
    if (!res.success) throw new Error(res.error);
    await loadData();
  };

  const handleContextMenu = (e, transaction) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedTransaction(transaction);
    setShowContextMenu(true);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
    setSelectedTransaction(null);
  };

  const handleEditarIngreso = () => {
    console.log('Editar ingreso:', selectedTransaction);
    handleCloseContextMenu();
  };

  const handleVerDetalles = () => {
    setShowDetallesModal(true);
    handleCloseContextMenu();
  };

  const handleImprimir = () => {
    console.log('Imprimir:', selectedTransaction);
    handleCloseContextMenu();
  };

  const handleEliminar = () => {
    console.log('Eliminar:', selectedTransaction);
    handleCloseContextMenu();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ingresos-egresos':
        return renderIngresosEgresos();
      case 'comisiones':
        return renderComisiones();
      default:
        return renderIngresosEgresos();
    }
  };

  const renderIngresosEgresos = () => (
    <>
      {/* Resumen financiero */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-sm text-[#4A3C7B] font-semibold">Ingreso</div>
            <div className="text-2xl font-bold text-emerald-600">
              S/ {resumenFinanciero.ingresoHoy.toFixed(2)}
            </div>
            <div className="text-xs text-[#30B0B0] font-medium">US$ {(resumenFinanciero.ingresoHoy / 3.8).toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-[#4A3C7B] font-semibold">Egreso</div>
            <div className="text-2xl font-bold text-rose-600">
              S/ -{resumenFinanciero.egresoHoy.toFixed(2)}
            </div>
            <div className="text-xs text-[#30B0B0] font-medium">US$ -{(resumenFinanciero.egresoHoy / 3.8).toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-[#4A3C7B] font-semibold">Balance Hoy</div>
            <div className={`text-2xl font-bold ${resumenFinanciero.balanceHoy >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              S/ {resumenFinanciero.balanceHoy.toFixed(2)}
            </div>
            <div className="text-xs text-[#30B0B0] font-medium">US$ {(resumenFinanciero.balanceHoy / 3.8).toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-[#4A3C7B] font-semibold">Balance Mes</div>
            <div className="text-2xl font-bold text-emerald-600">
              S/ {resumenFinanciero.balanceMes.toFixed(2)}
            </div>
            <div className="text-xs text-[#30B0B0] font-medium">US$ {(resumenFinanciero.balanceMes / 3.8).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Controles de fecha y vista */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1))} className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="bg-gradient-to-r from-[#30B0B0] to-[#4A3C7B] text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg">
                {dateISO}
              </div>
              
              <span className="text-[#4A3C7B] font-semibold">
                {new Date(dateISO).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              
              <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1))} className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200">
              <option value="all">Ver todo</option>
              <option value="ingreso">Solo ingresos</option>
              <option value="egreso">Solo egresos</option>
            </select>
            
            <button className="p-2 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded-lg transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de transacciones */}
      <div className="flex-1 overflow-auto bg-white">
        {error && (
          <div className="p-4 text-red-700 bg-red-50 border-b">{error}</div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-[#4A3C7B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">Cargando transacciones...</span>
          </div>
        ) : transactions.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white sticky top-0">
              <tr>
                <th className="text-left p-4 font-semibold">Hora</th>
                <th className="text-left p-4 font-semibold">Doctor</th>
                <th className="text-left p-4 font-semibold">Paciente</th>
                <th className="text-left p-4 font-semibold">Concepto</th>
                <th className="text-left p-4 font-semibold">Medio de pago</th>
                <th className="text-left p-4 font-semibold">Comentario</th>
                <th className="text-left p-4 font-semibold">Monto</th>
                <th className="text-left p-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaccion, index) => (
                <tr 
                  key={transaccion.id} 
                  className={`border-b hover:bg-[#30B0B0]/5 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="p-4 text-[#4A3C7B] font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{formatearHora(transaccion.hora)}</span>
                      <button
                        onClick={(e) => handleContextMenu(e, transaccion)}
                        className="p-1 text-gray-400 hover:text-[#30B0B0] hover:bg-[#30B0B0]/10 rounded transition-all duration-200"
                        title="Opciones"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">
                    {transaccion.doctor}
                  </td>
                  <td className="p-4 text-gray-700">
                    {transaccion.paciente}
                  </td>
                  <td className="p-4 text-gray-700">
                    {transaccion.concepto}
                  </td>
                  <td className="p-4 text-gray-700">
                    {transaccion.medioPago}
                  </td>
                  <td className="p-4 text-gray-700">
                    {transaccion.comentario}
                  </td>
                  <td className="p-4 font-semibold">
                    {formatearMonto(transaccion.monto, transaccion.tipo)}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                      {transaccion.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-[#4A3C7B] mb-2">No se encontró ninguna información</p>
            <p className="text-sm text-gray-500">No hay transacciones para la fecha seleccionada</p>
          </div>
        )}
      </div>
    </>
  );

  const renderComisiones = () => {

    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Panel de control con filtros y estadísticas */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Periodo:</label>
                <div className="relative">
                  <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option>Esta semana</option>
                    <option>Este mes</option>
                    <option>Últimos 3 meses</option>
                    <option>Este año</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Doctor:</label>
                <div className="relative">
                  <select
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option>Todos</option>
                    <option>Dr. García</option>
                    <option>Dra. López</option>
                    <option>Dr. Martínez</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Estadísticas y botón descargar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Estadísticas */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Total recaudado</div>
                  <div className="text-sm font-semibold text-gray-900">S/</div>
                  <div className="text-sm font-semibold text-gray-900">US$</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Comisión</div>
                  <div className="text-sm font-semibold text-gray-900">S/</div>
                  <div className="text-sm font-semibold text-gray-900">US$</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">N° Servicios</div>
                  <div className="text-sm font-semibold text-gray-900">-</div>
                </div>
              </div>

              {/* Botón descargar */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span>Descargar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de comisiones */}
        <div className="bg-white">
          {/* Header de la tabla */}
          <div className="bg-slate-800 text-white">
            <div className="grid grid-cols-10 gap-4 px-6 py-3 text-sm font-medium">
              <div>Paciente</div>
              <div>Medio de pago</div>
              <div>Comprobante</div>
              <div>Concepto</div>
              <div>Total</div>
              <div>Tarjeta</div>
              <div className="flex items-center space-x-1">
                <span>Dcto1</span>
                <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span>Dcto2</span>
                <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>Comisión</div>
              <div>Comentario</div>
            </div>
          </div>

          {/* Estado vacío */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No se encontró ninguna información</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 pt-24 sm:pt-28">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#4A3C7B]">Caja</h1>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleNuevoIngreso}
                className="bg-gradient-to-r from-[#30B0B0] to-[#4A3C7B] text-white px-4 py-2 rounded-xl hover:from-[#4A3C7B] hover:to-[#2D1B69] transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>+ Nuevo ingreso</span>
              </button>
              <button 
                onClick={handleNuevoEgreso}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Egreso
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b">
            <button
              onClick={() => setActiveTab('ingresos-egresos')}
              className={`pb-3 px-1 relative font-semibold transition-all duration-200 ${
                activeTab === 'ingresos-egresos'
                  ? 'text-[#30B0B0] border-b-3 border-[#30B0B0]'
                  : 'text-gray-500 hover:text-[#4A3C7B] hover:border-b-2 hover:border-gray-300'
              }`}
            >
              Ingresos y egresos
            </button>
            <button
              onClick={() => setActiveTab('comisiones')}
              className={`pb-3 px-1 relative font-semibold transition-all duration-200 ${
                activeTab === 'comisiones'
                  ? 'text-[#30B0B0] border-b-3 border-[#30B0B0]'
                  : 'text-gray-500 hover:text-[#4A3C7B] hover:border-b-2 hover:border-gray-300'
              }`}
            >
              Comisiones
            </button>
          </div>
        </div>

        {/* Contenido de la pestaña activa */}
        {renderTabContent()}

        {/* Footer */}
        <div className="bg-white border-t px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-[#30B0B0] to-[#4A3C7B] text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg">
                <span>😊</span>
                <span className="font-semibold">¡Comienza aquí!</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-[#4A3C7B] font-semibold">Mostrar</span>
              <select className="border-2 border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="text-[#4A3C7B] font-semibold">resultados por página</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nuevo Ingreso */}
      <NuevoIngresoModal
        isOpen={showNuevoIngresoModal}
        onClose={() => setShowNuevoIngresoModal(false)}
        onSave={handleSaveIngreso}
      />

      {/* Modal Nuevo Egreso */}
      <NuevoEgresoModal
        isOpen={showNuevoEgresoModal}
        onClose={() => setShowNuevoEgresoModal(false)}
        onSave={handleSaveEgreso}
      />

      {/* Menú Contextual */}
      <ContextMenu
        isOpen={showContextMenu}
        position={contextMenuPosition}
        onClose={handleCloseContextMenu}
        onEditar={handleEditarIngreso}
        onVerDetalles={handleVerDetalles}
        onImprimir={handleImprimir}
        onEliminar={handleEliminar}
        transaction={selectedTransaction}
      />

      {/* Modal Detalles */}
      <DetallesIngresoModal
        isOpen={showDetallesModal}
        onClose={() => setShowDetallesModal(false)}
        transaction={selectedTransaction}
        onSave={handleSaveIngreso}
      />
    </div>
  );
};

export default Caja;
