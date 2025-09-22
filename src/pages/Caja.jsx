import React, { useState } from 'react';

const Caja = () => {
  const [activeTab, setActiveTab] = useState('ingresos-egresos');
  const [periodo, setPeriodo] = useState('Esta semana');
  const [doctor, setDoctor] = useState('Todos');
  
  // Datos de ejemplo basados en la imagen
  const transacciones = [
    {
      id: 1,
      hora: '09:30 a. m.',
      doctor: 'Eduardo Carmin',
      paciente: 'Homero Prueba',
      concepto: 'Consulta general',
      medioPago: 'Efectivo',
      comentario: 'Pago completo',
      monto: 80.00,
      tipo: 'ingreso',
      estado: 'completado'
    },
    {
      id: 2,
      hora: '11:15 a. m.',
      doctor: 'Eduardo Carmin',
      paciente: 'Julieta Prueba',
      concepto: 'Limpieza dental',
      medioPago: 'Tarjeta',
      comentario: 'Tratamiento completo',
      monto: 120.00,
      tipo: 'ingreso',
      estado: 'completado'
    },
    {
      id: 3,
      hora: '02:00 p. m.',
      doctor: 'Eduardo Carmin',
      paciente: '--',
      concepto: 'Materiales dentales',
      medioPago: 'Transferencia',
      comentario: 'Compra de insumos',
      monto: 250.00,
      tipo: 'egreso',
      estado: 'completado'
    }
  ];

  // Resumen financiero basado en la imagen
  const resumenFinanciero = {
    ingresoHoy: 200.00,
    egresoHoy: 250.00,
    balanceHoy: -50.00,
    balanceMes: 5300.00
  };

  const formatearMonto = (monto, tipo) => {
    const signo = tipo === 'ingreso' ? '+' : '-';
    const color = tipo === 'ingreso' ? 'text-green-600' : 'text-red-600';
    return (
      <span className={color}>
        {signo} S/ {monto.toFixed(2)}
      </span>
    );
  };

  const formatearHora = (hora) => {
    return hora; // Ya viene formateada desde los datos
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
            <div className="text-sm text-gray-600">Ingreso</div>
            <div className="text-2xl font-bold text-green-600">
              S/ {resumenFinanciero.ingresoHoy.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">US$ {(resumenFinanciero.ingresoHoy / 3.8).toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Egreso</div>
            <div className="text-2xl font-bold text-red-600">
              S/ -{resumenFinanciero.egresoHoy.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">US$ -{(resumenFinanciero.egresoHoy / 3.8).toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Balance Hoy</div>
            <div className={`text-2xl font-bold ${resumenFinanciero.balanceHoy >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              S/ {resumenFinanciero.balanceHoy.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">US$ {(resumenFinanciero.balanceHoy / 3.8).toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Balance Mes</div>
            <div className="text-2xl font-bold text-green-600">
              S/ {resumenFinanciero.balanceMes.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">US$ {(resumenFinanciero.balanceMes / 3.8).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Controles de fecha y vista */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium">
                Hoy
              </div>
              
              <span className="text-gray-700 font-medium">
                21 sept 2025
              </span>
              
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded px-3 py-2">
              <option>Ver todo</option>
              <option>Solo ingresos</option>
              <option>Solo egresos</option>
            </select>
            
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de transacciones */}
      <div className="flex-1 overflow-auto bg-white">
        {transacciones.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-700 text-white sticky top-0">
              <tr>
                <th className="text-left p-4 font-medium">Hora</th>
                <th className="text-left p-4 font-medium">Doctor</th>
                <th className="text-left p-4 font-medium">Paciente</th>
                <th className="text-left p-4 font-medium">Concepto</th>
                <th className="text-left p-4 font-medium">Medio de pago</th>
                <th className="text-left p-4 font-medium">Comentario</th>
                <th className="text-left p-4 font-medium">Monto</th>
                <th className="text-left p-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {transacciones.map((transaccion, index) => (
                <tr 
                  key={transaccion.id} 
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="p-4 text-gray-700">
                    {formatearHora(transaccion.hora)}
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
                  <td className="p-4 font-medium">
                    {formatearMonto(transaccion.monto, transaccion.tipo)}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {transaccion.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg font-medium mb-2">No se encontró ninguna información</p>
            <p className="text-sm">No hay transacciones para la fecha seleccionada</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Caja</h1>
            <div className="flex items-center space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>+ Nuevo ingreso</span>
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                Egreso
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b">
            <button
              onClick={() => setActiveTab('ingresos-egresos')}
              className={`pb-3 px-1 relative ${
                activeTab === 'ingresos-egresos'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ingresos y egresos
            </button>
            <button
              onClick={() => setActiveTab('comisiones')}
              className={`pb-3 px-1 relative ${
                activeTab === 'comisiones'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
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
              <div className="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                <span>😊</span>
                <span>¡Comienza aquí!</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Mostrar</span>
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="text-gray-600">resultados por página</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caja;
