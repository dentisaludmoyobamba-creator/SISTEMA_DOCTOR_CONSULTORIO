import React, { useState } from 'react';

const EmbudoVentas = () => {
  const [activeTab, setActiveTab] = useState('embudo');

  const etapas = [
    {
      id: 1,
      nombre: 'Interesados',
      color: 'bg-blue-500',
      cantidad: 45,
      porcentaje: 100,
      pacientes: [
        { nombre: 'María García', fecha: '2024-01-15', origen: 'Google Ads' },
        { nombre: 'Carlos López', fecha: '2024-01-14', origen: 'Facebook' },
        { nombre: 'Ana Martínez', fecha: '2024-01-13', origen: 'Referido' },
        { nombre: 'Pedro Sánchez', fecha: '2024-01-12', origen: 'Instagram' },
        { nombre: 'Laura Rodríguez', fecha: '2024-01-11', origen: 'Google Ads' }
      ]
    },
    {
      id: 2,
      nombre: 'Consulta',
      color: 'bg-yellow-500',
      cantidad: 28,
      porcentaje: 62,
      pacientes: [
        { nombre: 'María García', fecha: '2024-01-16', origen: 'Google Ads' },
        { nombre: 'Carlos López', fecha: '2024-01-15', origen: 'Facebook' },
        { nombre: 'Ana Martínez', fecha: '2024-01-14', origen: 'Referido' },
        { nombre: 'Pedro Sánchez', fecha: '2024-01-13', origen: 'Instagram' }
      ]
    },
    {
      id: 3,
      nombre: 'Presupuesto',
      color: 'bg-orange-500',
      cantidad: 18,
      porcentaje: 40,
      pacientes: [
        { nombre: 'María García', fecha: '2024-01-17', origen: 'Google Ads' },
        { nombre: 'Carlos López', fecha: '2024-01-16', origen: 'Facebook' },
        { nombre: 'Ana Martínez', fecha: '2024-01-15', origen: 'Referido' }
      ]
    },
    {
      id: 4,
      nombre: 'Tratamiento',
      color: 'bg-green-500',
      cantidad: 12,
      porcentaje: 27,
      pacientes: [
        { nombre: 'María García', fecha: '2024-01-18', origen: 'Google Ads' },
        { nombre: 'Carlos López', fecha: '2024-01-17', origen: 'Facebook' }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 pt-24 sm:pt-28">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Embudo de Ventas</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nueva Campaña</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b">
            <button
              onClick={() => setActiveTab('embudo')}
              className={`pb-3 px-1 relative ${
                activeTab === 'embudo'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Embudo
            </button>
            <button
              onClick={() => setActiveTab('conversion')}
              className={`pb-3 px-1 relative ${
                activeTab === 'conversion'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Conversión
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 px-1 relative ${
                activeTab === 'analytics'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Contenido del embudo */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Estadísticas generales */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-2">Total Interesados</div>
                <div className="text-3xl font-bold text-blue-600">45</div>
                <div className="text-sm text-green-600">+12% vs mes anterior</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-2">Tasa de Conversión</div>
                <div className="text-3xl font-bold text-green-600">27%</div>
                <div className="text-sm text-green-600">+3% vs mes anterior</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-2">Valor Promedio</div>
                <div className="text-3xl font-bold text-orange-600">S/ 850</div>
                <div className="text-sm text-red-600">-5% vs mes anterior</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-2">Ingresos Totales</div>
                <div className="text-3xl font-bold text-purple-600">S/ 10,200</div>
                <div className="text-sm text-green-600">+8% vs mes anterior</div>
              </div>
            </div>

            {/* Embudo visual */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Proceso de Ventas</h2>
              
              <div className="space-y-6">
                {etapas.map((etapa, index) => (
                  <div key={etapa.id} className="relative">
                    {/* Línea conectora */}
                    {index < etapas.length - 1 && (
                      <div className="absolute left-8 top-16 w-0.5 h-6 bg-gray-300 z-0"></div>
                    )}
                    
                    <div className="flex items-center space-x-6">
                      {/* Indicador de etapa */}
                      <div className="relative z-10">
                        <div className={`w-16 h-16 ${etapa.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                          {etapa.id}
                        </div>
                        <div className="text-xs text-gray-500 text-center mt-2">{etapa.porcentaje}%</div>
                      </div>

                      {/* Contenido de la etapa */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium text-gray-900">{etapa.nombre}</h3>
                          <span className="text-2xl font-bold text-gray-700">{etapa.cantidad}</span>
                        </div>
                        
                        {/* Barra de progreso */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className={`${etapa.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${etapa.porcentaje}%` }}
                          ></div>
                        </div>

                        {/* Lista de pacientes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {etapa.pacientes.map((paciente, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {paciente.nombre.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">{paciente.nombre}</div>
                                <div className="text-xs text-gray-500">{paciente.origen}</div>
                              </div>
                              <div className="text-xs text-gray-400">{paciente.fecha}</div>
                            </div>
                          ))}
                          
                          {/* Botón para ver más */}
                          {etapa.cantidad > etapa.pacientes.length && (
                            <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors">
                              <span className="text-sm text-blue-600 font-medium">
                                +{etapa.cantidad - etapa.pacientes.length} más
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Métricas de conversión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasas de Conversión</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Interesados → Consulta</span>
                    <span className="text-sm font-medium text-blue-600">62%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Consulta → Presupuesto</span>
                    <span className="text-sm font-medium text-yellow-600">64%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Presupuesto → Tratamiento</span>
                    <span className="text-sm font-medium text-green-600">67%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuentes de Tráfico</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Google Ads</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Facebook</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Referidos</span>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Instagram</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbudoVentas;
