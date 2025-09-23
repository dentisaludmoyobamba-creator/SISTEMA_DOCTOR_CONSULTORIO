import React, { useState } from 'react';

const Inventario = () => {
  const [activeTab, setActiveTab] = useState('productos');
  const [activeSubTab, setActiveSubTab] = useState('ordenes');
  const [filters, setFilters] = useState({
    tipo: 'Ver todos',
    categoria: 'Ver todos',
    almacen: 'Ver todos',
    alertaStock: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'productos', label: 'Productos', active: true },
    { id: 'compras', label: 'Compras', active: false },
    { id: 'consumo', label: 'Consumo', active: false }
  ];

  const comprasSubTabs = [
    { id: 'ordenes', label: 'Órdenes de compra', active: true },
    { id: 'items', label: 'Items', active: false }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'compras') {
      setActiveSubTab('ordenes');
    }
  };

  const handleSubTabClick = (subTabId) => {
    setActiveSubTab(subTabId);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const renderProductosContent = () => (
    <>
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Tipo</label>
            <select 
              value={filters.tipo}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option>Ver todos</option>
              <option>Medicamentos</option>
              <option>Instrumental</option>
              <option>Materiales</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Categoría</label>
            <select 
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option>Ver todos</option>
              <option>Odontología</option>
              <option>Cirugía</option>
              <option>Diagnóstico</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Almacén</label>
            <select 
              value={filters.almacen}
              onChange={(e) => handleFilterChange('almacen', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option>Ver todos</option>
              <option>Principal</option>
              <option>Secundario</option>
              <option>Emergencia</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="alertaStock"
              checked={filters.alertaStock}
              onChange={(e) => handleFilterChange('alertaStock', e.target.checked)}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <label htmlFor="alertaStock" className="ml-2 text-sm text-gray-600">
              Alerta de stock
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar producto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <button className="ml-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200">
            Nuevo producto
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-hidden">
          <div className="bg-slate-700 text-white">
            <div className="grid grid-cols-7 gap-4 px-6 py-4 text-sm font-medium">
              <div>Producto</div>
              <div>Presentación</div>
              <div>Capacidad de uso</div>
              <div>Precio unit. venta</div>
              <div>Stock Actual</div>
              <div>Stock Mínimo</div>
              <div>Comentario</div>
            </div>
          </div>

          <div className="min-h-96 flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No se encontró ninguna información</p>
          </div>
        </div>
      </div>
    </>
  );

  const renderComprasContent = () => (
    <>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {comprasSubTabs.map((subTab) => (
            <button
              key={subTab.id}
              onClick={() => handleSubTabClick(subTab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeSubTab === subTab.id
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {subTab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeSubTab === 'ordenes' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar orden de compra"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <button className="ml-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200">
                Nueva Compra
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="overflow-hidden">
                <div className="bg-slate-700 text-white">
                  <div className="grid grid-cols-9 gap-4 px-6 py-4 text-sm font-medium">
                    <div>ID</div>
                    <div>Nombre interno</div>
                    <div>F. creación</div>
                    <div>F. Entrega</div>
                    <div>F. pago</div>
                    <div>Estado</div>
                    <div>Monto</div>
                    <div>Proveedor</div>
                    <div>Nota interna</div>
                  </div>
                </div>

                <div className="min-h-96 flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No se encontró ninguna información</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSubTab === 'items' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="min-h-96 flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Sección Items en desarrollo</p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderConsumoContent = () => (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="min-h-96 flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">Sección Consumo en desarrollo</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 pt-24 sm:pt-28">
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-cyan-500 text-cyan-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div className="ml-auto flex items-center">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 text-sm">
                  <span>▶️</span>
                  <span>Ver tutorial</span>
                </button>
              </div>
            </nav>
          </div>

          {activeTab === 'productos' && renderProductosContent()}
          {activeTab === 'compras' && renderComprasContent()}
          {activeTab === 'consumo' && renderConsumoContent()}
        </div>
      </div>
    </div>
  );
};

export default Inventario;
