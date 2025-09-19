import React, { useState } from 'react';
import { transacciones as transaccionesData, resumenFinanciero } from '../data/mockData';

const Caja = () => {
  const [activeTab, setActiveTab] = useState('ingresos-egresos');
  const [transacciones] = useState(transaccionesData);
  const [filtroFecha] = useState(new Date().toISOString().split('T')[0]);

  // Filtrar transacciones por fecha
  const transaccionesFiltradas = transacciones.filter(t => t.fecha === filtroFecha);

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
    return new Date(`2000-01-01T${hora}:00`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 pt-16">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Caja</h1>
            <div className="flex items-center space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Nuevo ingreso</span>
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
            <button
              onClick={() => setActiveTab('links-pago')}
              className={`pb-3 px-1 relative ${
                activeTab === 'links-pago'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Links de pago
            </button>
          </div>
        </div>

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
                  {new Date(filtroFecha).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
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
          {transaccionesFiltradas.length > 0 ? (
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
                {transaccionesFiltradas.map((transaccion, index) => (
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
                      {transaccion.paciente || '--'}
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
