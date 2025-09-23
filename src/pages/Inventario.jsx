import React, { useState } from 'react';
import AddOptionModal from '../components/AddOptionModal';

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

  // Estado para UI de Productos
  const [isNuevoProductoOpen, setIsNuevoProductoOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isAddCategoriaOpen, setIsAddCategoriaOpen] = useState(false);
  const [isDeleteCategoriaOpen, setIsDeleteCategoriaOpen] = useState(false);

  const tabs = [
    { id: 'productos', label: 'Productos', active: true },
    { id: 'compras', label: 'Compras', active: false },
    { id: 'consumo', label: 'Consumo', active: false }
  ];

  const comprasSubTabs = [
    { id: 'ordenes', label: 'Órdenes de compra', active: true },
    { id: 'items', label: 'Items', active: false }
  ];

  // Estado para modal de Nueva Compra (Compras -> Órdenes de compra)
  const [isNuevaCompraOpen, setIsNuevaCompraOpen] = useState(false);
  
  // Estado para modal de Nuevo Consumo (Consumo)
  const [isNuevoConsumoOpen, setIsNuevoConsumoOpen] = useState(false);
  const [isConsumoOptionsOpen, setIsConsumoOptionsOpen] = useState(false);

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
          
          <div className="ml-4 flex items-center space-x-2 relative">
            <button
              onClick={() => setIsNuevoProductoOpen(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200"
            >
              Nuevo producto
            </button>

            <button
              onClick={() => setIsOptionsOpen((v) => !v)}
              className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </button>

            {isOptionsOpen && (
              <div className="absolute right-0 top-10 w-56 bg-white rounded-lg shadow-lg border z-20">
                <button
                  onClick={() => { setIsAddCategoriaOpen(true); setIsOptionsOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Agregar categoría
                </button>
                <button
                  onClick={() => { setIsDeleteCategoriaOpen(true); setIsOptionsOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Eliminar categoría
                </button>
                <button
                  onClick={() => { setIsOptionsOpen(false); /* implementar descarga */ }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Descargar productos
                </button>
              </div>
            )}
          </div>
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
      {/* Modal lateral: Nuevo Producto */}
      {isNuevoProductoOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsNuevoProductoOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-2xl overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">NUEVO PRODUCTO</h3>
                <button onClick={() => setIsNuevoProductoOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Tipo de producto y Agregar categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tipo de producto</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500">
                    <option>Insumos</option>
                    <option>Medicamentos</option>
                    <option>Materiales</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsAddCategoriaOpen(true)}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Agregar categoría</span>
                  </button>
                </div>
              </div>

              {/* Nombre y Presentación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nombre</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Presentación</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500">
                    <option>Unidad</option>
                    <option>Caja</option>
                    <option>Paquete</option>
                  </select>
                </div>
              </div>

              {/* Alerta de stock mínimo */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Alerta de stock mínimo</label>
                <div className="flex items-center space-x-2">
                  <input type="number" min="0" className="w-32 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
                  <span className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm">uni</span>
                </div>
              </div>

              {/* Configurar capacidad */}
              <div className="flex items-start space-x-3">
                <input type="checkbox" className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <div className="text-sm text-gray-700">Configurar capacidad por aplicación o dosis</div>
              </div>

              {/* Comentario */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Comentario</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button onClick={() => setIsNuevoProductoOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button className="px-4 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modales de categoría reutilizando AddOptionModal */}
      <AddOptionModal
        title="Agregar categoría"
        isOpen={isAddCategoriaOpen}
        onClose={() => setIsAddCategoriaOpen(false)}
        onAdd={() => {}}
      />
      <AddOptionModal
        title="Eliminar categoría"
        placeholder="Nombre de la categoría"
        isOpen={isDeleteCategoriaOpen}
        onClose={() => setIsDeleteCategoriaOpen(false)}
        onAdd={() => {}}
      />
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
              
              <button
                onClick={() => setIsNuevaCompraOpen(true)}
                className="ml-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200"
              >
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
      {/* Modal lateral: Nueva Orden de Compra */}
      {isNuevaCompraOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsNuevaCompraOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[820px] bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b">
              <div className="px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-wide">NUEVA ORDEN DE COMPRA</h3>
                <button onClick={() => setIsNuevaCompraOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form principal */}
            <div className="p-6 space-y-6">
              {/* Fila 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de creación de orden</label>
                  <input type="date" placeholder="dd/mm/aaaa" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre interno</label>
                  <input type="text" placeholder="Nombre interno" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500">
                    <option>— Seleccionar —</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nº factura</label>
                  <input type="text" placeholder="000-000" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>

              {/* Fila 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500">
                    <option>Orden ingresada a almacén</option>
                    <option>En proceso</option>
                    <option>Emitida</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha pago al proveedor</label>
                  <input type="date" placeholder="dd/mm/aaaa" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de entrega</label>
                  <input type="date" placeholder="dd/mm/aaaa" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="flex items-end">
                  <label className="inline-flex items-center space-x-2">
                    <input type="checkbox" className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                    <span className="text-sm text-gray-700">Esta orden ya fue pagada al proveedor.</span>
                  </label>
                </div>
              </div>

              {/* Alerta informativa */}
              <div className="flex items-start space-x-3 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-3 rounded">
                <span className="mt-0.5">ℹ️</span>
                <p className="text-sm">Solo al seleccionar el estado “Orden ingresada a almacén” las nuevas compras serán sumadas al stock.</p>
              </div>

              {/* Nota interna */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota interna</label>
                <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" rows="3" placeholder="Escribe una nota para uso interno" />
              </div>

              {/* Agregar producto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agregar producto</label>
                <div className="relative">
                  <input type="text" placeholder="Buscar producto" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500" />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Item editor */}
              <div className="space-y-4">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Nombre:</span> <span className="ml-1">jeringa</span>
                  <span className="mx-2">/</span>
                  <span className="font-medium">presentación:</span> <span className="ml-1">Unidad</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° Lote*</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad*</label>
                    <input type="number" min="1" defaultValue="1" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio Compra Unit.*</label>
                    <div className="flex items-center space-x-2">
                      <select className="border border-gray-300 rounded-md px-2 py-2 text-sm">
                        <option>S/</option>
                        <option>US$</option>
                      </select>
                      <input type="number" step="0.01" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Vencimiento</label>
                    <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div className="md:col-span-1 flex items-end space-x-2">
                    <button className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 text-sm">Agregar</button>
                    <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm">Descartar</button>
                  </div>
                </div>
              </div>

              {/* Items agregados */}
              <div className="bg-white rounded border">
                <div className="bg-slate-700 text-white">
                  <div className="grid grid-cols-6 md:grid-cols-7 lg:grid-cols-7 gap-4 px-6 py-3 text-sm font-medium">
                    <div>Producto</div>
                    <div>Cantidad</div>
                    <div>Presentación</div>
                    <div>Precio Unit.</div>
                    <div>Fecha vencimiento</div>
                    <div className="hidden md:block">Subtotal</div>
                    <div className="text-right">Acción</div>
                  </div>
                </div>
                <div className="px-6 py-3 text-sm text-gray-600">Sin items agregados</div>
                <div className="flex items-center justify-end px-6 py-4 border-t text-sm">
                  <div className="space-x-6">
                    <span className="font-medium">Total:</span>
                    <span className="font-semibold">S/ 0.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 bg-white px-6 py-4 border-t flex justify-end space-x-3">
              <button onClick={() => setIsNuevaCompraOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button className="px-4 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      
    </>
  );

  const renderConsumoContent = () => (
    <div className="p-6">
      {/* Filtros y acciones */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Almacén</label>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
            <option>Todos</option>
            <option>Principal</option>
            <option>Secundario</option>
            <option>Emergencia</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Mes</label>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
            <option>septiembre</option>
            <option>octubre</option>
            <option>noviembre</option>
            <option>diciembre</option>
          </select>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar producto"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsNuevoConsumoOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200"
          >
            Nuevo Consumo
          </button>
          
          <button
            onClick={() => setIsConsumoOptionsOpen(!isConsumoOptionsOpen)}
            className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>

          {isConsumoOptionsOpen && (
            <div className="absolute right-0 top-10 w-56 bg-white rounded-lg shadow-lg border z-20">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                Exportar consumo
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                Configurar alertas
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                Ver reportes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de consumo */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-hidden">
          <div className="bg-slate-700 text-white">
            <div className="grid grid-cols-10 gap-4 px-6 py-4 text-sm font-medium">
              <div>Fecha de Consumo</div>
              <div>Producto</div>
              <div>Fuente</div>
              <div>Tipo</div>
              <div>Lote</div>
              <div>Cantidad</div>
              <div>Paciente</div>
              <div>Servicio</div>
              <div>Comentario</div>
              <div>Estado</div>
            </div>
          </div>

          <div className="min-h-96 flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No se encontró ninguna información</p>
          </div>
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

          {/* Modal Crear Nuevo Consumo (siempre montado para abrir con un clic) */}
          {isNuevoConsumoOpen && (
            <div className="fixed inset-0 z-[100]">
              <div className="absolute inset-0 bg-black/30" onClick={() => setIsNuevoConsumoOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-white shadow-2xl overflow-y-auto">
                <div className="sticky top-0 z-10 bg-white border-b">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-wide">CREAR NUEVO CONSUMO</h3>
                    <button onClick={() => setIsNuevoConsumoOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Producto:*</label>
                        <div className="relative">
                          <input type="text" placeholder="Buscar producto" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lote:*</label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                          <option>— Seleccionar —</option>
                          <option>LOTE-001</option>
                          <option>LOTE-002</option>
                          <option>LOTE-003</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Servicio:</label>
                        <div className="relative">
                          <input type="text" placeholder="Buscar servicio" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad:*</label>
                        <div className="flex items-center space-x-2">
                          <input type="number" step="0.01" placeholder="00.00" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                          <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                            <option>Aplicaciones</option>
                            <option>Unidades</option>
                            <option>Gramos</option>
                            <option>Mililitros</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Almacén:*</label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                          <option>Principal</option>
                          <option>Secundario</option>
                          <option>Emergencia</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                        <div className="relative">
                          <input type="text" placeholder="Seleccione un paciente" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                          <option>Confirmada</option>
                          <option>Pendiente</option>
                          <option>Cancelada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comentario:</label>
                        <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-3 rounded">
                    <span className="mt-0.5">ℹ️</span>
                    <p className="text-sm">Cuando un servicio es terminado los insumos correspondientes pueden ser descontados automáticamente. <span className="text-blue-800 underline cursor-pointer ml-1">Ver más</span></p>
                  </div>
                </div>

                <div className="sticky bottom-0 z-10 bg-white px-6 py-4 border-t flex justify-end space-x-3">
                  <button onClick={() => setIsNuevoConsumoOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
                  <button className="px-4 py-2 rounded-md bg-cyan-500 text-white hover:bg-cyan-600">Confirmar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventario;
