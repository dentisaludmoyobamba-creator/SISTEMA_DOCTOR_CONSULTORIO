import React, { useState, useEffect, useCallback } from 'react';
import AddOptionModal from '../components/AddOptionModal';
import DeleteCategoriaModal from '../components/DeleteCategoriaModal';
import DeleteTipoModal from '../components/DeleteTipoModal';
import DetallesOrdenModal from '../components/DetallesOrdenModal';
import inventarioService from '../services/inventarioService';
import authService from '../services/authService';

const Inventario = () => {
  const [activeTab, setActiveTab] = useState('productos');
  const [activeSubTab, setActiveSubTab] = useState('ordenes');
  const [filters, setFilters] = useState({
    tipo: 'Ver todos',
    categoria: 'Ver todos',
    alertaStock: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para UI de Productos
  const [isNuevoProductoOpen, setIsNuevoProductoOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isAddCategoriaOpen, setIsAddCategoriaOpen] = useState(false);
  const [isDeleteCategoriaOpen, setIsDeleteCategoriaOpen] = useState(false);
  const [isAddTipoOpen, setIsAddTipoOpen] = useState(false);
  const [isDeleteTipoOpen, setIsDeleteTipoOpen] = useState(false);

  // Estado para tipos y categorías
  const [tipos, setTipos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Estado para datos de la API
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Estado para formulario de nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    stock: 0,
    stock_minimo: 0,
    proveedor: '',
    costo_unitario: 0,
    id_tipo: '',
    id_categoria: ''
  });

  // Estado para datos de Compras
  const [compras, setCompras] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(true);
  const [errorCompras, setErrorCompras] = useState(null);
  const [paginationCompras, setPaginationCompras] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Estado para formulario de nueva compra
  const [nuevaCompra, setNuevaCompra] = useState({
    nombre_interno: '',
    proveedor: '',
    estado: 'Orden ingresada a almacén',
    monto_total: 0,
    fecha_entrega: '',
    fecha_pago: '',
    nota_interna: ''
  });

  // Estado para items de la orden de compra
  const [itemsOrden, setItemsOrden] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    id_producto: '',
    nombre_producto: '',
    cantidad: 1,
    lote: '',
    precio_unitario: 0,
    fecha_vencimiento: ''
  });
  const [searchProducto, setSearchProducto] = useState('');
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [showProductosList, setShowProductosList] = useState(false);

  // Estado para datos de Consumo
  const [consumos, setConsumos] = useState([]);
  const [loadingConsumos, setLoadingConsumos] = useState(true);
  const [errorConsumos, setErrorConsumos] = useState(null);
  const [paginationConsumos, setPaginationConsumos] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Estado para formulario de nuevo consumo
  const [nuevoConsumo, setNuevoConsumo] = useState({
    id_producto: '',
    fuente: '',
    tipo: '',
    lote: '',
    cantidad: 0,
    almacen: 'Principal',
    paciente: '',
    servicio: '',
    comentario: '',
    estado: 'Confirmada'
  });

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
  
  // Estado para modal de Detalles de Orden
  const [isDetallesOrdenOpen, setIsDetallesOrdenOpen] = useState(false);
  const [selectedOrdenId, setSelectedOrdenId] = useState(null);
  
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

  // Abrir modal de detalles de orden
  const handleOpenDetallesOrden = (ordenId) => {
    setSelectedOrdenId(ordenId);
    setIsDetallesOrdenOpen(true);
  };

  // Cargar tipos y categorías
  const loadTiposYCategorias = useCallback(async () => {
    try {
      inventarioService.setAuthService(authService);
      
      const [resultTipos, resultCategorias] = await Promise.all([
        inventarioService.getTipos(),
        inventarioService.getCategorias()
      ]);

      if (resultTipos.success) {
        setTipos(resultTipos.tipos);
      }
      
      if (resultCategorias.success) {
        setCategorias(resultCategorias.categorias);
      }
    } catch (err) {
      console.error('Error al cargar tipos y categorías:', err);
    }
  }, []);

  // Cargar productos desde la API
  const loadProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      inventarioService.setAuthService(authService);
      const result = await inventarioService.getProductos({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        tipo: filters.tipo !== 'Ver todos' ? filters.tipo : '',
        categoria: filters.categoria !== 'Ver todos' ? filters.categoria : '',
        alerta_stock: filters.alertaStock
      });

      if (result.success) {
        setProductos(result.productos);
        setPagination(prev => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        }));
      } else {
        setError(result.error);
        setProductos([]);
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  // Manejar guardado de nuevo producto
  const handleSaveProducto = async () => {
    try {
      const result = await inventarioService.createProducto(nuevoProducto);
      if (result.success) {
        setIsNuevoProductoOpen(false);
        setNuevoProducto({
          nombre: '',
          descripcion: '',
          stock: 0,
          stock_minimo: 0,
          proveedor: '',
          costo_unitario: 0,
          id_tipo: '',
          id_categoria: ''
        });
        loadProductos();
      } else {
        alert(`Error al crear producto: ${result.error}`);
      }
    } catch (err) {
      alert('Error de conexión al crear producto.');
    }
  };

  // Manejar adición de categoría
  const handleAddCategoria = async (nombre) => {
    try {
      const result = await inventarioService.createCategoria({ nombre, descripcion: '' });
      if (result.success) {
        loadTiposYCategorias();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Error de conexión al crear categoría.' };
    }
  };

  // Manejar eliminación de categoría
  const handleDeleteCategoria = async (categoriaId) => {
    try {
      const result = await inventarioService.deleteCategoria(categoriaId);
      if (result.success) {
        loadTiposYCategorias();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Error de conexión al eliminar categoría.' };
    }
  };

  // Manejar adición de tipo
  const handleAddTipo = async (nombre) => {
    try {
      const result = await inventarioService.createTipo({ nombre, descripcion: '' });
      if (result.success) {
        loadTiposYCategorias();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Error de conexión al crear tipo.' };
    }
  };

  // Manejar eliminación de tipo
  const handleDeleteTipo = async (tipoId) => {
    try {
      const result = await inventarioService.deleteTipo(tipoId);
      if (result.success) {
        loadTiposYCategorias();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Error de conexión al eliminar tipo.' };
    }
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Manejar cambio de límite
  const handleLimitChange = (e) => {
    setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }));
  };

  // ===== FUNCIONES PARA COMPRAS =====
  const loadCompras = useCallback(async () => {
    setLoadingCompras(true);
    setErrorCompras(null);
    try {
      inventarioService.setAuthService(authService);
      const result = await inventarioService.getCompras({
        page: paginationCompras.page,
        limit: paginationCompras.limit,
        search: searchTerm
      });

      if (result.success) {
        setCompras(result.compras);
        setPaginationCompras(prev => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        }));
      } else {
        setErrorCompras(result.error);
        setCompras([]);
      }
    } catch (err) {
      setErrorCompras('Error de conexión con el servidor.');
      setCompras([]);
    } finally {
      setLoadingCompras(false);
    }
  }, [paginationCompras.page, paginationCompras.limit, searchTerm]);

  // Buscar productos para agregar a la orden
  const handleSearchProducto = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setProductosDisponibles([]);
      setShowProductosList(false);
      return;
    }

    try {
      inventarioService.setAuthService(authService);
      const result = await inventarioService.getProductos({
        search: searchTerm,
        page: 1,
        limit: 10
      });

      if (result.success) {
        setProductosDisponibles(result.productos);
        setShowProductosList(true);
      }
    } catch (err) {
      console.error('Error al buscar productos:', err);
    }
  };

  // Seleccionar producto de la lista
  const handleSelectProducto = (producto) => {
    setCurrentItem(prev => ({
      ...prev,
      id_producto: producto.id,
      nombre_producto: producto.nombre,
      precio_unitario: producto.costo_unitario || 0
    }));
    setSearchProducto(producto.nombre);
    setShowProductosList(false);
  };

  // Agregar item a la orden
  const handleAgregarItem = () => {
    if (!currentItem.id_producto || currentItem.cantidad <= 0 || currentItem.precio_unitario <= 0) {
      alert('Complete todos los campos requeridos del producto');
      return;
    }

    const subtotal = currentItem.cantidad * currentItem.precio_unitario;
    const nuevoItem = {
      ...currentItem,
      subtotal,
      id_temp: Date.now() // ID temporal para manejar en frontend
    };

    setItemsOrden(prev => [...prev, nuevoItem]);
    
    // Limpiar formulario de item
    setCurrentItem({
      id_producto: '',
      nombre_producto: '',
      cantidad: 1,
      lote: '',
      precio_unitario: 0,
      fecha_vencimiento: ''
    });
    setSearchProducto('');
    
    // Actualizar monto total
    actualizarMontoTotal([...itemsOrden, nuevoItem]);
  };

  // Eliminar item de la orden
  const handleEliminarItem = (idTemp) => {
    const nuevosItems = itemsOrden.filter(item => item.id_temp !== idTemp);
    setItemsOrden(nuevosItems);
    actualizarMontoTotal(nuevosItems);
  };

  // Calcular monto total de la orden
  const actualizarMontoTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    setNuevaCompra(prev => ({ ...prev, monto_total: total }));
  };

  // Manejar guardado de nueva compra
  const handleSaveCompra = async () => {
    try {
      const compraData = {
        ...nuevaCompra,
        items: itemsOrden.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          lote: item.lote,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal,
          fecha_vencimiento: item.fecha_vencimiento
        }))
      };

      const result = await inventarioService.createCompra(compraData);
      if (result.success) {
        setIsNuevaCompraOpen(false);
        setNuevaCompra({
          nombre_interno: '',
          proveedor: '',
          estado: 'Orden ingresada a almacén',
          monto_total: 0,
          fecha_entrega: '',
          fecha_pago: '',
          nota_interna: ''
        });
        setItemsOrden([]);
        setCurrentItem({
          id_producto: '',
          nombre_producto: '',
          cantidad: 1,
          lote: '',
          precio_unitario: 0,
          fecha_vencimiento: ''
        });
        loadCompras();
      } else {
        alert(`Error al crear compra: ${result.error}`);
      }
    } catch (err) {
      alert('Error de conexión al crear compra.');
    }
  };

  // Manejar cambio de página para compras
  const handlePageChangeCompras = (newPage) => {
    if (newPage > 0 && newPage <= paginationCompras.totalPages) {
      setPaginationCompras(prev => ({ ...prev, page: newPage }));
    }
  };

  // Manejar cambio de límite para compras
  const handleLimitChangeCompras = (e) => {
    setPaginationCompras(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }));
  };

  // ===== FUNCIONES PARA CONSUMO =====
  const loadConsumos = useCallback(async () => {
    setLoadingConsumos(true);
    setErrorConsumos(null);
    try {
      inventarioService.setAuthService(authService);
      const result = await inventarioService.getConsumos({
        page: paginationConsumos.page,
        limit: paginationConsumos.limit,
        search: searchTerm,
        almacen: filters.almacen !== 'Ver todos' ? filters.almacen : ''
      });

      if (result.success) {
        setConsumos(result.consumos);
        setPaginationConsumos(prev => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        }));
      } else {
        setErrorConsumos(result.error);
        setConsumos([]);
      }
    } catch (err) {
      setErrorConsumos('Error de conexión con el servidor.');
      setConsumos([]);
    } finally {
      setLoadingConsumos(false);
    }
  }, [paginationConsumos.page, paginationConsumos.limit, searchTerm, filters.almacen]);

  // Manejar guardado de nuevo consumo
  const handleSaveConsumo = async () => {
    try {
      const result = await inventarioService.createConsumo(nuevoConsumo);
      if (result.success) {
        setIsNuevoConsumoOpen(false);
        setNuevoConsumo({
          id_producto: '',
          fuente: '',
          tipo: '',
          lote: '',
          cantidad: 0,
          almacen: 'Principal',
          paciente: '',
          servicio: '',
          comentario: '',
          estado: 'Confirmada'
        });
        loadConsumos();
      } else {
        alert(`Error al crear consumo: ${result.error}`);
      }
    } catch (err) {
      alert('Error de conexión al crear consumo.');
    }
  };

  // Manejar cambio de página para consumos
  const handlePageChangeConsumos = (newPage) => {
    if (newPage > 0 && newPage <= paginationConsumos.totalPages) {
      setPaginationConsumos(prev => ({ ...prev, page: newPage }));
    }
  };

  // Manejar cambio de límite para consumos
  const handleLimitChangeConsumos = (e) => {
    setPaginationConsumos(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }));
  };

  // Cargar tipos y categorías al inicio
  useEffect(() => {
    loadTiposYCategorias();
  }, [loadTiposYCategorias]);

  // Efectos para cargar datos
  useEffect(() => {
    if (activeTab === 'productos') {
      loadProductos();
    } else if (activeTab === 'compras') {
      loadCompras();
    } else if (activeTab === 'consumo') {
      loadConsumos();
    }
  }, [activeTab, loadProductos, loadCompras, loadConsumos]);

  // Manejar búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === 'productos') {
        setPagination(prev => ({ ...prev, page: 1 }));
        loadProductos();
      } else if (activeTab === 'compras') {
        setPaginationCompras(prev => ({ ...prev, page: 1 }));
        loadCompras();
      } else if (activeTab === 'consumo') {
        setPaginationConsumos(prev => ({ ...prev, page: 1 }));
        loadConsumos();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters, loadProductos, loadCompras, loadConsumos]);

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
              <option value="Ver todos">Ver todos</option>
              {tipos.map(tipo => (
                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Categoría</label>
            <select 
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="Ver todos">Ver todos</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
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
                  onClick={() => { setIsAddTipoOpen(true); setIsOptionsOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b"
                >
                  Agregar tipo
                </button>
                <button
                  onClick={() => { setIsDeleteTipoOpen(true); setIsOptionsOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b"
                >
                  Eliminar tipo
                </button>
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
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-t"
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

          {error && (
            <div className="p-4 text-red-700 bg-red-50 border-b">{error}</div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-gray-600">Cargando productos...</span>
            </div>
          ) : productos.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {productos.map((producto, index) => (
                <div key={producto.id} className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="grid grid-cols-7 gap-4 items-center">
                    <div>
                      <div className="font-medium text-gray-900">{producto.nombre}</div>
                      <div className="text-sm text-gray-500">{producto.descripcion}</div>
                    </div>
                    <div className="text-sm text-gray-700">Unidad</div>
                    <div className="text-sm text-gray-700">-</div>
                    <div className="text-sm text-gray-700">S/ {producto.costo_unitario.toFixed(2)}</div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        producto.alerta_stock 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {producto.stock}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">{producto.stock_minimo}</div>
                    <div className="text-sm text-gray-700">{producto.proveedor || '-'}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-96 flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No se encontró ninguna información</p>
            </div>
          )}
        </div>
      </div>

      {/* Controles de paginación */}
      {productos.length > 0 && (
        <div className="bg-white border-t px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} productos
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Mostrar</span>
              <select 
                value={pagination.limit} 
                onChange={handleLimitChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-cyan-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">por página</span>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {/* Nombre del producto */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nombre del producto *</label>
                <input 
                  type="text" 
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" 
                  placeholder="Ingrese el nombre del producto"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                <input 
                  type="text" 
                  value={nuevoProducto.descripcion}
                  onChange={(e) => setNuevoProducto(prev => ({ ...prev, descripcion: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" 
                  placeholder="Descripción del producto"
                />
              </div>

              {/* Tipo y Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tipo</label>
                  <select 
                    value={nuevoProducto.id_tipo}
                    onChange={(e) => setNuevoProducto(prev => ({ ...prev, id_tipo: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    {tipos.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Categoría</label>
                  <select 
                    value={nuevoProducto.id_categoria}
                    onChange={(e) => setNuevoProducto(prev => ({ ...prev, id_categoria: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock inicial y stock mínimo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Stock inicial</label>
                  <input 
                    type="number" 
                    min="0"
                    value={nuevoProducto.stock}
                    onChange={(e) => setNuevoProducto(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Stock mínimo</label>
                  <input 
                    type="number" 
                    min="0"
                    value={nuevoProducto.stock_minimo}
                    onChange={(e) => setNuevoProducto(prev => ({ ...prev, stock_minimo: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" 
                  />
                </div>
              </div>

              {/* Proveedor y costo unitario */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Proveedor</label>
                  <input 
                    type="text" 
                    value={nuevoProducto.proveedor}
                    onChange={(e) => setNuevoProducto(prev => ({ ...prev, proveedor: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" 
                    placeholder="Nombre del proveedor"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Costo unitario (S/)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={nuevoProducto.costo_unitario}
                    onChange={(e) => setNuevoProducto(prev => ({ ...prev, costo_unitario: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500" 
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button onClick={() => setIsNuevoProductoOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button 
                onClick={handleSaveProducto}
                disabled={!nuevoProducto.nombre.trim()}
                className="px-4 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modales de tipos */}
      <AddOptionModal
        title="Agregar tipo de producto"
        placeholder="Nombre del tipo"
        isOpen={isAddTipoOpen}
        onClose={() => setIsAddTipoOpen(false)}
        onAdd={async (nombre) => {
          const result = await handleAddTipo(nombre);
          if (!result.success) {
            alert(`Error: ${result.error}`);
          }
        }}
      />
      <DeleteTipoModal
        isOpen={isDeleteTipoOpen}
        onClose={() => setIsDeleteTipoOpen(false)}
        tipos={tipos}
        onDelete={handleDeleteTipo}
      />

      {/* Modales de categoría */}
      <AddOptionModal
        title="Agregar categoría"
        placeholder="Nombre de la categoría"
        isOpen={isAddCategoriaOpen}
        onClose={() => setIsAddCategoriaOpen(false)}
        onAdd={async (nombre) => {
          const result = await handleAddCategoria(nombre);
          if (!result.success) {
            alert(`Error: ${result.error}`);
          }
        }}
      />
      <DeleteCategoriaModal
        isOpen={isDeleteCategoriaOpen}
        onClose={() => setIsDeleteCategoriaOpen(false)}
        categorias={categorias}
        onDelete={handleDeleteCategoria}
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

                {errorCompras && (
                  <div className="p-4 text-red-700 bg-red-50 border-b">{errorCompras}</div>
                )}
                {loadingCompras ? (
                  <div className="flex items-center justify-center py-12">
                    <svg className="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-2 text-gray-600">Cargando compras...</span>
                  </div>
                ) : compras.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {compras.map((compra, index) => (
                      <div 
                        key={compra.id} 
                        onClick={() => handleOpenDetallesOrden(compra.id)}
                        className={`p-4 hover:bg-cyan-50 hover:shadow-md cursor-pointer transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <div className="grid grid-cols-9 gap-4 items-center">
                          <div className="text-sm font-medium text-cyan-700">#{compra.id}</div>
                          <div className="text-sm font-semibold text-gray-900">{compra.nombre_interno}</div>
                          <div className="text-sm text-gray-700">
                            {compra.fecha_creacion ? new Date(compra.fecha_creacion).toLocaleDateString('es-PE') : '-'}
                          </div>
                          <div className="text-sm text-gray-700">
                            {compra.fecha_entrega ? new Date(compra.fecha_entrega).toLocaleDateString('es-PE') : '-'}
                          </div>
                          <div className="text-sm text-gray-700">
                            {compra.fecha_pago ? new Date(compra.fecha_pago).toLocaleDateString('es-PE') : '-'}
                          </div>
                          <div className="text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              compra.estado === 'Orden ingresada a almacén' 
                                ? 'bg-green-100 text-green-800'
                                : compra.estado === 'En proceso'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {compra.estado}
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-gray-900">S/ {compra.monto_total.toFixed(2)}</div>
                          <div className="text-sm text-gray-700">{compra.proveedor || '-'}</div>
                          <div className="text-sm text-gray-500 truncate" title={compra.nota_interna}>
                            {compra.nota_interna || '-'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="min-h-96 flex flex-col items-center justify-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No se encontró ninguna información</p>
                  </div>
                )}
              </div>
          </div>

          {/* Controles de paginación para compras */}
          {compras.length > 0 && (
            <div className="bg-white border-t px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Mostrando {((paginationCompras.page - 1) * paginationCompras.limit) + 1} a {Math.min(paginationCompras.page * paginationCompras.limit, paginationCompras.total)} de {paginationCompras.total} compras
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Mostrar</span>
                  <select 
                    value={paginationCompras.limit} 
                    onChange={handleLimitChangeCompras}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-700">por página</span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChangeCompras(paginationCompras.page - 1)}
                      disabled={paginationCompras.page <= 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-gray-700">
                      Página {paginationCompras.page} de {paginationCompras.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChangeCompras(paginationCompras.page + 1)}
                      disabled={paginationCompras.page >= paginationCompras.totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsNuevaCompraOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[1200px] bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-cyan-600 to-cyan-700 border-b border-cyan-800 shadow-md">
              <div className="px-8 py-5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">Nueva Orden de Compra</h3>
                    <p className="text-cyan-100 text-sm">Complete los datos de la orden</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsNuevaCompraOpen(false)} 
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form principal */}
            <div className="p-8 space-y-6 bg-gray-50">
              
              {/* Sección: Información General */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información General
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre interno <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={nuevaCompra.nombre_interno}
                      onChange={(e) => setNuevaCompra(prev => ({ ...prev, nombre_interno: e.target.value }))}
                      placeholder="Ej: Compra de Insumos Enero 2024" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
                    <input 
                      type="text" 
                      value={nuevaCompra.proveedor}
                      onChange={(e) => setNuevaCompra(prev => ({ ...prev, proveedor: e.target.value }))}
                      placeholder="Nombre del proveedor" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" 
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Fechas y Estado */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Fechas y Estado
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select 
                      value={nuevaCompra.estado}
                      onChange={(e) => setNuevaCompra(prev => ({ ...prev, estado: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                    >
                      <option value="Orden ingresada a almacén">Orden ingresada a almacén</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Emitida">Emitida</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de entrega</label>
                    <input 
                      type="date" 
                      value={nuevaCompra.fecha_entrega}
                      onChange={(e) => setNuevaCompra(prev => ({ ...prev, fecha_entrega: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de pago</label>
                    <input 
                      type="date" 
                      value={nuevaCompra.fecha_pago}
                      onChange={(e) => setNuevaCompra(prev => ({ ...prev, fecha_pago: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" 
                    />
                  </div>
                </div>

                {/* Alerta informativa */}
                <div className="mt-4 flex items-start space-x-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 px-4 py-3 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Importante:</span> Solo al seleccionar el estado "Orden ingresada a almacén" las nuevas compras serán sumadas al stock.
                  </p>
                </div>
              </div>

              {/* Sección: Monto y Notas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Monto y Observaciones
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monto total (S/)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={nuevaCompra.monto_total}
                        onChange={(e) => setNuevaCompra(prev => ({ ...prev, monto_total: parseFloat(e.target.value) || 0 }))}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" 
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nota interna</label>
                    <textarea 
                      value={nuevaCompra.nota_interna}
                      onChange={(e) => setNuevaCompra(prev => ({ ...prev, nota_interna: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" 
                      rows="3" 
                      placeholder="Escribe una nota para uso interno (opcional)" 
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Detalles de Items */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Productos de la Orden
                </h4>
                
                {/* Buscador de productos */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buscar producto</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchProducto}
                      onChange={(e) => {
                        setSearchProducto(e.target.value);
                        handleSearchProducto(e.target.value);
                      }}
                      onFocus={() => {
                        if (searchProducto.length >= 2) {
                          handleSearchProducto(searchProducto);
                        }
                      }}
                      placeholder="Escribe para buscar producto..." 
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" 
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    {/* Lista de productos encontrados */}
                    {showProductosList && productosDisponibles.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {productosDisponibles.map(producto => (
                          <button
                            key={producto.id}
                            onClick={() => handleSelectProducto(producto)}
                            className="w-full text-left px-4 py-3 hover:bg-cyan-50 border-b last:border-b-0 transition-colors"
                          >
                            <div className="font-medium text-gray-900">{producto.nombre}</div>
                            <div className="text-sm text-gray-500">
                              Stock: {producto.stock} | Costo: S/ {producto.costo_unitario?.toFixed(2) || '0.00'}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Formulario para agregar item */}
                {currentItem.id_producto && (
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-3">
                      Producto seleccionado: <span className="text-cyan-700">{currentItem.nombre_producto}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          min="1"
                          step="0.01"
                          value={currentItem.cantidad}
                          onChange={(e) => setCurrentItem(prev => ({ ...prev, cantidad: parseFloat(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Lote</label>
                        <input 
                          type="text" 
                          value={currentItem.lote}
                          onChange={(e) => setCurrentItem(prev => ({ ...prev, lote: e.target.value }))}
                          placeholder="Nº Lote"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Precio Unit. <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/</span>
                          <input 
                            type="number" 
                            step="0.01"
                            min="0"
                            value={currentItem.precio_unitario}
                            onChange={(e) => setCurrentItem(prev => ({ ...prev, precio_unitario: parseFloat(e.target.value) || 0 }))}
                            className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:ring-2 focus:ring-cyan-500 text-sm" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">F. Vencimiento</label>
                        <input 
                          type="date" 
                          value={currentItem.fecha_vencimiento}
                          onChange={(e) => setCurrentItem(prev => ({ ...prev, fecha_vencimiento: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 text-sm" 
                        />
                      </div>
                      <div className="flex items-end">
                        <button 
                          onClick={handleAgregarItem}
                          className="w-full px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 text-sm font-medium transition-colors"
                        >
                          + Agregar
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-cyan-700">
                      Subtotal: S/ {(currentItem.cantidad * currentItem.precio_unitario).toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Tabla de items agregados */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                    <div className="grid grid-cols-7 gap-4 px-6 py-3 text-sm font-medium">
                      <div>Producto</div>
                      <div>Cantidad</div>
                      <div>Lote</div>
                      <div>Precio Unit.</div>
                      <div>F. Vencimiento</div>
                      <div>Subtotal</div>
                      <div className="text-right">Acción</div>
                    </div>
                  </div>
                  
                  {itemsOrden.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-3">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">No hay productos agregados a esta orden</p>
                      <p className="text-xs text-gray-400 mt-1">Busca y selecciona productos para agregarlos</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {itemsOrden.map((item) => (
                        <div key={item.id_temp} className="grid grid-cols-7 gap-4 px-6 py-3 items-center hover:bg-gray-100 transition-colors">
                          <div className="text-sm text-gray-900 font-medium">{item.nombre_producto}</div>
                          <div className="text-sm text-gray-700">{item.cantidad}</div>
                          <div className="text-sm text-gray-700">{item.lote || '-'}</div>
                          <div className="text-sm text-gray-700">S/ {item.precio_unitario.toFixed(2)}</div>
                          <div className="text-sm text-gray-700">
                            {item.fecha_vencimiento ? new Date(item.fecha_vencimiento).toLocaleDateString('es-PE') : '-'}
                          </div>
                          <div className="text-sm text-gray-900 font-semibold">S/ {item.subtotal.toFixed(2)}</div>
                          <div className="text-right">
                            <button
                              onClick={() => handleEliminarItem(item.id_temp)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
                    <span className="text-sm text-gray-600">Total de items: <span className="font-semibold">{itemsOrden.length}</span></span>
                    <div className="text-right">
                      <span className="text-sm text-gray-600 mr-3">Monto total:</span>
                      <span className="text-2xl font-bold text-cyan-700">S/ {nuevaCompra.monto_total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 bg-white px-8 py-5 border-t shadow-lg">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Campos requeridos:</span> <span className="text-red-500">*</span>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsNuevaCompraOpen(false)} 
                    className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveCompra}
                    disabled={!nuevaCompra.nombre_interno.trim()}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 text-white hover:from-cyan-700 hover:to-cyan-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-medium shadow-lg transition-all transform hover:scale-105 disabled:transform-none"
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar Orden
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles de Orden */}
      <DetallesOrdenModal
        isOpen={isDetallesOrdenOpen}
        onClose={() => setIsDetallesOrdenOpen(false)}
        ordenId={selectedOrdenId}
      />
    </>
  );

  const renderConsumoContent = () => (
    <div className="p-6">
      {/* Filtros y acciones */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
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

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Mes</label>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
            <option>Todos</option>
            <option>Enero</option>
            <option>Febrero</option>
            <option>Marzo</option>
            <option>Abril</option>
            <option>Mayo</option>
            <option>Junio</option>
            <option>Julio</option>
            <option>Agosto</option>
            <option>Septiembre</option>
            <option>Octubre</option>
            <option>Noviembre</option>
            <option>Diciembre</option>
          </select>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
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

          {errorConsumos && (
            <div className="p-4 text-red-700 bg-red-50 border-b">{errorConsumos}</div>
          )}
          {loadingConsumos ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-gray-600">Cargando consumos...</span>
            </div>
          ) : consumos.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {consumos.map((consumo, index) => (
                <div key={consumo.id} className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="grid grid-cols-10 gap-4 items-center">
                    <div className="text-sm text-gray-700">
                      {consumo.fecha_consumo ? new Date(consumo.fecha_consumo).toLocaleDateString('es-PE') : '-'}
                    </div>
                    <div className="text-sm text-gray-700">{consumo.producto || '-'}</div>
                    <div className="text-sm text-gray-700">{consumo.fuente || '-'}</div>
                    <div className="text-sm text-gray-700">{consumo.tipo || '-'}</div>
                    <div className="text-sm text-gray-700">{consumo.lote || '-'}</div>
                    <div className="text-sm text-gray-700">{consumo.cantidad}</div>
                    <div className="text-sm text-gray-700">{consumo.paciente || '-'}</div>
                    <div className="text-sm text-gray-700">{consumo.servicio || '-'}</div>
                    <div className="text-sm text-gray-700">{consumo.comentario || '-'}</div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        consumo.estado === 'Confirmada' 
                          ? 'bg-green-100 text-green-800'
                          : consumo.estado === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {consumo.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-96 flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No se encontró ninguna información</p>
            </div>
          )}
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
                          <input 
                            type="text" 
                            value={nuevoConsumo.id_producto}
                            onChange={(e) => setNuevoConsumo(prev => ({ ...prev, id_producto: e.target.value }))}
                            placeholder="ID del producto" 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fuente:</label>
                        <select 
                          value={nuevoConsumo.fuente}
                          onChange={(e) => setNuevoConsumo(prev => ({ ...prev, fuente: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar fuente</option>
                          <option value="Compra directa">Compra directa</option>
                          <option value="Orden de compra">Orden de compra</option>
                          <option value="Inventario existente">Inventario existente</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
                        <select 
                          value={nuevoConsumo.tipo}
                          onChange={(e) => setNuevoConsumo(prev => ({ ...prev, tipo: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar tipo</option>
                          <option value="Medicamento">Medicamento</option>
                          <option value="Material">Material</option>
                          <option value="Instrumental">Instrumental</option>
                          <option value="Insumo">Insumo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lote:</label>
                        <input 
                          type="text" 
                          value={nuevoConsumo.lote}
                          onChange={(e) => setNuevoConsumo(prev => ({ ...prev, lote: e.target.value }))}
                          placeholder="Número de lote" 
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad:*</label>
                        <input 
                          type="number" 
                          step="0.01"
                          min="0"
                          value={nuevoConsumo.cantidad}
                          onChange={(e) => setNuevoConsumo(prev => ({ ...prev, cantidad: parseFloat(e.target.value) || 0 }))}
                          placeholder="00.00" 
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Almacén:*</label>
                        <select 
                          value={nuevoConsumo.almacen}
                          onChange={(e) => setNuevoConsumo(prev => ({ ...prev, almacen: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                          <option value="Principal">Principal</option>
                          <option value="Secundario">Secundario</option>
                          <option value="Emergencia">Emergencia</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Servicio:</label>
                        <input 
                          type="text" 
                          value={nuevoConsumo.servicio}
                          onChange={(e) => setNuevoConsumo(prev => ({ ...prev, servicio: e.target.value }))}
                          placeholder="Nombre del servicio" 
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paciente:</label>
                        <input 
                          type="text" 
                          value={nuevoConsumo.paciente}
                          onChange={(e) => setNuevoConsumo(prev => ({ ...prev, paciente: e.target.value }))}
                          placeholder="Nombre del paciente" 
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                        <select 
                          value={nuevoConsumo.estado}
                          onChange={(e) => setNuevoConsumo(prev => ({ ...prev, estado: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                          <option value="Confirmada">Confirmada</option>
                          <option value="Pendiente">Pendiente</option>
                          <option value="Cancelada">Cancelada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comentario:</label>
                        <input 
                          type="text" 
                          value={nuevoConsumo.comentario}
                          onChange={(e) => setNuevoConsumo(prev => ({ ...prev, comentario: e.target.value }))}
                          placeholder="Comentario adicional" 
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                        />
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
                  <button 
                    onClick={handleSaveConsumo}
                    disabled={!nuevoConsumo.id_producto.trim() || nuevoConsumo.cantidad <= 0}
                    className="px-4 py-2 rounded-md bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controles de paginación para consumos */}
      {consumos.length > 0 && (
        <div className="bg-white border-t px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Mostrando {((paginationConsumos.page - 1) * paginationConsumos.limit) + 1} a {Math.min(paginationConsumos.page * paginationConsumos.limit, paginationConsumos.total)} de {paginationConsumos.total} consumos
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Mostrar</span>
              <select 
                value={paginationConsumos.limit} 
                onChange={handleLimitChangeConsumos}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-cyan-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">por página</span>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChangeConsumos(paginationConsumos.page - 1)}
                  disabled={paginationConsumos.page <= 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-700">
                  Página {paginationConsumos.page} de {paginationConsumos.totalPages}
                </span>
                <button
                  onClick={() => handlePageChangeConsumos(paginationConsumos.page + 1)}
                  disabled={paginationConsumos.page >= paginationConsumos.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventario;
