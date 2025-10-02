import React, { useState } from 'react';

const Productividad = () => {
  const [activeTab, setActiveTab] = useState('ingresos-egresos');
  const [selectedPeriod, setSelectedPeriod] = useState('esta-semana');
  const [selectedCurrency, setSelectedCurrency] = useState('PEN');

  const tabs = [
    { id: 'ingresos-egresos', label: 'Ingresos y egresos' },
    { id: 'servicios-vendidos', label: 'Servicios vendidos' },
    { id: 'servicios-terminados', label: 'Servicios Terminados' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'pacientes', label: 'Pacientes' },
    { id: 'reporte-anual', label: 'Reporte anual' }
  ];

  const periods = [
    { id: 'esta-semana', label: 'Esta semana' },
    { id: 'este-mes', label: 'Este mes' },
    { id: 'ultimos-3-meses', label: 'Últimos 3 meses' },
    { id: 'este-ano', label: 'Este año' }
  ];

  const doctors = [
    { name: 'Elias Carmin', income: 0 },
    { name: 'Karen Prueba', income: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-denti-primary text-denti-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 border-b border-gray-200 py-4 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left side - Period Selector */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-600">Elige un periodo</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-denti-primary focus:border-transparent min-w-[160px]"
                >
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Right side - Currency, Income and Download */}
              <div className="flex items-center space-x-6">
                {/* Currency Selector */}
                <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => setSelectedCurrency('PEN')}
                    className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedCurrency === 'PEN'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    S/
                  </button>
                  <button
                    onClick={() => setSelectedCurrency('USD')}
                    className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedCurrency === 'USD'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    US$
                  </button>
                </div>

                {/* Income Display */}
                <div className="flex items-center space-x-8">
                  <div className="text-sm">
                    <span className="text-gray-600">Ingreso ({selectedCurrency === 'PEN' ? 'S/' : 'US$'})</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Ingreso (US$)</span>
                  </div>
                </div>

                {/* Download Button */}
                <button className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-1.5 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors">
                  <span>DESCARGAR</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {activeTab === 'ingresos-egresos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-8">
            {/* Ingresos y Egresos Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-6">Ingresos y Egresos</h3>
              
              {/* Legend */}
              <div className="flex items-center space-x-8 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-3 bg-red-400 rounded-sm"></div>
                  <span className="text-xs text-gray-600">Egresos: {selectedCurrency === 'PEN' ? 'S/' : 'US$'} 0.00</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-3 bg-blue-400 rounded-sm"></div>
                  <span className="text-xs text-gray-600">Ingresos: {selectedCurrency === 'PEN' ? 'S/' : 'US$'} 0.00</span>
                </div>
              </div>

              {/* Chart Container */}
              <div className="relative">
                {/* Y-axis label */}
                <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-[10px] text-gray-500 whitespace-nowrap">
                  {selectedCurrency === 'PEN' ? 'PEN (S/)' : 'USD (US$)'}
                </div>

                {/* Chart Area with Grid */}
                <div className="pl-4">
                  <div className="relative h-72 border-l border-b border-gray-300">
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[1, 0.75, 0.5, 0.25, 0].map((value, index) => (
                        <div key={index} className="border-t border-gray-200 w-full"></div>
                      ))}
                    </div>
                    
                    {/* Y-axis values */}
                    <div className="absolute -left-3 top-0 h-full flex flex-col justify-between text-[10px] text-gray-500">
                      <span>1</span>
                      <span>0</span>
                    </div>

                    {/* Empty state message */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs text-gray-400">Sin datos disponibles</p>
                    </div>
                  </div>

                  {/* X-axis labels */}
                  <div className="flex justify-between mt-2 text-[10px] text-gray-500 px-4">
                    <span>Sep 29</span>
                    <span>Sep 30</span>
                    <span>Oct 01</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingreso por Doctores Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <h3 className="text-base font-semibold text-gray-800">Ingreso por Doctores</h3>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              {/* Legend */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-5 h-3 bg-blue-400 rounded-sm"></div>
                <span className="text-xs text-gray-600">Ingresos</span>
              </div>

              {/* Chart Container */}
              <div className="relative">
                {/* Y-axis label */}
                <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-[10px] text-gray-500 whitespace-nowrap">
                  {selectedCurrency === 'PEN' ? 'PEN (S/)' : 'USD (US$)'}
                </div>

                {/* Chart Area with Grid */}
                <div className="pl-4">
                  <div className="relative h-72 border-l border-b border-gray-300">
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[1, 0.75, 0.5, 0.25, 0].map((value, index) => (
                        <div key={index} className="border-t border-gray-200 w-full"></div>
                      ))}
                    </div>
                    
                    {/* Y-axis values */}
                    <div className="absolute -left-3 top-0 h-full flex flex-col justify-between text-[10px] text-gray-500">
                      <span>1</span>
                      <span>0</span>
                    </div>

                    {/* Empty state message */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs text-gray-400">Sin datos disponibles</p>
                    </div>
                  </div>

                  {/* X-axis labels */}
                  <div className="flex justify-around mt-2 text-[10px] text-gray-500">
                    {doctors.map((doctor, index) => (
                      <span key={index} className="text-center">
                        {doctor.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Servicios Vendidos */}
        {activeTab === 'servicios-vendidos' && (
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Gráfico - ocupa 2 columnas */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Servicios vendidos</h3>
                {/* Filtros superiores (placeholder) */}
                <div className="flex items-center space-x-4 mb-4">
                  <button className="text-sm px-3 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Por día</button>
                  <button className="text-sm px-3 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Por semana</button>
                  <button className="text-sm px-3 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Por mes</button>
                </div>

                {/* Leyenda alineada a la izquierda */}
                <div className="flex items-center space-x-8 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-3 bg-blue-400 rounded-sm"></div>
                    <span className="text-xs text-gray-600">Cantidad</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-3 bg-emerald-400 rounded-sm"></div>
                    <span className="text-xs text-gray-600">Ingresos</span>
                  </div>
                </div>

                {/* Contenedor del gráfico */}
                <div className="relative">
                  {/* Etiqueta eje Y */}
                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-[10px] text-gray-500 whitespace-nowrap">
                    Cantidad
                  </div>
                  <div className="pl-4">
                    <div className="relative h-72 border-l border-b border-gray-300">
                      {/* Líneas horizontales */}
                      <div className="absolute inset-0 flex flex-col justify-between">
                        {[1, 0.75, 0.5, 0.25, 0].map((value, index) => (
                          <div key={index} className="border-t border-gray-200 w-full"></div>
                        ))}
                      </div>

                      {/* Valores eje Y */}
                      <div className="absolute -left-3 top-0 h-full flex flex-col justify-between text-[10px] text-gray-500">
                        <span>1</span>
                        <span>0</span>
                      </div>

                      {/* Estado vacío */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-xs text-gray-400">Sin datos disponibles</p>
                      </div>
                    </div>

                    {/* Etiquetas eje X */}
                    <div className="flex justify-between mt-2 text-[10px] text-gray-500 px-4">
                      <span>Lun</span>
                      <span>Mar</span>
                      <span>Mié</span>
                      <span>Jue</span>
                      <span>Vie</span>
                      <span>Sáb</span>
                      <span>Dom</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla - Servicios más vendidos */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Servicios más vendidos</h3>
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {[1,2,3,4,5].map((i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">Servicio {i}</td>
                          <td className="px-4 py-2 text-sm text-gray-700 text-right">0</td>
                          <td className="px-4 py-2 text-sm text-gray-700 text-right">{selectedCurrency === 'PEN' ? 'S/' : 'US$'} 0.00</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Productividad;
