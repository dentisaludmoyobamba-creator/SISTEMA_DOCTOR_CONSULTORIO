import React, { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import usersService from '../services/usersService';
import tratamientosService from '../services/tratamientosService';
import UserModal from '../components/UserModal';
import AddDoctorModal from '../components/AddDoctorModal';
import EditDoctorModal from '../components/EditDoctorModal';
import ServicioModal from '../components/ServicioModal';

const Configuracion = () => {
  const [activeSection, setActiveSection] = useState('usuarios');
  
  // Verificar si hay un parámetro en la URL para activar una sección específica
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section && ['usuarios', 'administracion'].includes(section)) {
      setActiveSection(section);
    }
  }, []);

  // Escuchar eventos personalizados para cambiar sección
  useEffect(() => {
    const handleSectionChange = (event) => {
      const { section } = event.detail;
      if (['usuarios', 'administracion'].includes(section)) {
        setActiveSection(section);
      }
    };

    window.addEventListener('configSectionChange', handleSectionChange);
    return () => {
      window.removeEventListener('configSectionChange', handleSectionChange);
    };
  }, []);

  const sections = [
    { id: 'usuarios', name: 'Usuarios' },
    { id: 'administracion', name: 'Administración' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'usuarios':
        return <Usuarios />;
      case 'administracion':
        return <Administracion />;
      default:
        return <Usuarios />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 pt-24 sm:pt-28">
      {/* Navegación horizontal bajo el header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto">
        {renderSection()}
      </div>
    </div>
  );
};

// Componente Mi Perfil
const MiPerfil = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona la información de tu consultorio</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Comercial *
                </label>
                <input
                  type="text"
                  defaultValue="Denti Salud"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tél. celular *
                </label>
                <div className="flex">
                  <div className="flex items-center bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg px-3">
                    <span className="text-sm">🇵🇪</span>
                    <select className="bg-transparent border-0 focus:ring-0 text-sm">
                      <option>+51</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    defaultValue="964891544"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tél. fijo
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <div className="flex">
                  <input
                    type="text"
                    defaultValue=", Lima, Lima, Ancón"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-3 py-3 border border-gray-300 border-l-0 rounded-r-lg bg-gray-50 hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de recepción
                </label>
                <input
                  type="email"
                  defaultValue="eduardo.carmin@tecsup.edu.pe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horarios
                </label>
                <input
                  type="text"
                  placeholder="Ej: Lunes a Viernes 8:00 - 18:00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medio de pago
                </label>
                <input
                  type="text"
                  placeholder="Ej: Efectivo, Tarjeta, Transferencia"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona horaria
                </label>
                <input
                  type="text"
                  defaultValue="GMT-05:00 America/Lima"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breve presentación
                </label>
                <textarea
                  rows={6}
                  defaultValue="Somos un equipo con 10 años de experiencia en..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación en Google Maps
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Cambiar ubicación
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Página web
                </label>
                <input
                  type="url"
                  placeholder="https://tu-sitio-web.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium">
                    Subir
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link de registro en línea
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    defaultValue="https://app.doctocliq.com/clinic/14021/registro/historia-c..."
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-600"
                  />
                  <button className="px-3 py-3 border border-gray-300 border-l-0 bg-gray-50 hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button className="px-3 py-3 border border-gray-300 border-l-0 bg-gray-50 hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="px-3 py-3 border border-gray-300 border-l-0 rounded-r-lg bg-gray-50 hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link de citas en línea
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    defaultValue="https://app.doctocliq.com/clinic/14021/"
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-600"
                  />
                  <button className="px-3 py-3 border border-gray-300 border-l-0 bg-gray-50 hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button className="px-3 py-3 border border-gray-300 border-l-0 bg-gray-50 hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="px-3 py-3 border border-gray-300 border-l-0 rounded-r-lg bg-gray-50 hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botón guardar */}
          <div className="mt-8 flex justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Usuarios
const Usuarios = () => {
  const [activeSubTab, setActiveSubTab] = useState('todos');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const subTabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'staff-medico', label: 'Staff médico' }
  ];

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Configurar el servicio de usuarios con authService
      usersService.setAuthService(authService);
      
      const roleFilter = activeSubTab === 'staff-medico' ? 'Doctor' : '';
      console.log('Cargando usuarios con filtros:', { page: pagination.page, limit: pagination.limit, search: searchTerm, role: roleFilter });
      
      const result = await usersService.getUsers(
        pagination.page,
        pagination.limit,
        searchTerm,
        roleFilter
      );

      console.log('Resultado de getUsers:', result);

      if (result.success) {
        const formattedUsers = result.users.map(user => usersService.formatUserForDisplay(user));
        setUsuarios(formattedUsers);
        setPagination(result.pagination);
        console.log('Usuarios cargados exitosamente:', formattedUsers);
      } else {
        console.error('Error al cargar usuarios:', result.error);
        setError(result.error || 'Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error en loadUsers:', error);
      setError('Error de conexión con el servidor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Cargar usuarios cuando cambien los filtros
  useEffect(() => {
    if (activeSubTab || searchTerm) {
      setPagination(prev => ({ ...prev, page: 1 })); // Reset a página 1
      loadUsers();
    }
  }, [activeSubTab, searchTerm]);

  // Cargar usuarios cuando cambie la página
  useEffect(() => {
    if (pagination.page > 1) {
      loadUsers();
    }
  }, [pagination.page]);

  const handleNewUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleEditDoctor = (user) => {
    setEditingDoctor(user);
    setIsEditDoctorModalOpen(true);
  };

  const handleDoctorUpdated = () => {
    loadUsers(); // Recargar lista después de actualizar doctor
    setIsEditDoctorModalOpen(false);
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`¿Estás seguro de que deseas desactivar al usuario ${user.displayName}?`)) {
      try {
        const result = await usersService.deleteUser(user.id);
        if (result.success) {
          loadUsers(); // Recargar lista
        } else {
          alert(result.error || 'Error al desactivar usuario');
        }
      } catch (error) {
        alert('Error de conexión con el servidor');
      }
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      const result = await usersService.toggleUserStatus(user.id, !user.active);
      if (result.success) {
        loadUsers(); // Recargar lista
      } else {
        alert(result.error || 'Error al cambiar estado del usuario');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  const handleUserSaved = () => {
    loadUsers(); // Recargar lista después de guardar
  };

  const handleDoctorAdded = () => {
    loadUsers(); // Recargar lista después de agregar doctor
    setIsAddDoctorModalOpen(false);
  };

  const handleOpenAddDoctor = () => {
    setIsAddDoctorModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset a página 1
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-2">
        {/* Sub-navegación de Usuarios */}
        <div className="flex space-x-8 border-b mb-2">
          {subTabs.map((subTab) => (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id)}
              className={`pb-2 px-1 relative ${
                activeSubTab === subTab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {subTab.label}
            </button>
          ))}
        </div>

        {/* User Summary and New User Button */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-4 text-sm text-gray-700">
            <span>Total usuarios: <span className="font-semibold">{pagination.total}</span></span>
            <span>Página: <span className="font-semibold">{pagination.page} de {pagination.pages}</span></span>
            {error && (
              <div className="text-red-600 text-sm">
                <span>{error}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {activeSubTab === 'staff-medico' && (
              <button 
                onClick={handleOpenAddDoctor}
                className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white px-4 py-2 rounded-md hover:from-[#2D1B69] hover:to-[#1A0F3D] transition-all flex items-center space-x-2 text-sm"
                title="Registrar doctor desde usuarios existentes"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Registrar como doctor</span>
              </button>
            )}
            <button 
              onClick={handleNewUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Nuevo usuario</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">Cargando usuarios...</span>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No se encontraron usuarios con ese criterio de búsqueda.' : 'Comienza creando un nuevo usuario.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={handleNewUser}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Nuevo Usuario
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-visible">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Usuario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    E-mail
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Tipo usuario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Último acceso
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.displayName)}&background=4A3C7B&color=fff`}
                            alt="Avatar"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-gray-900">{usuario.displayName}</div>
                            {usuario.isDoctor && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Doctor
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">@{usuario.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{usuario.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{usuario.role}</div>
                      <div className="text-sm text-gray-500">{usuario.roleDescription}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usuario.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(usuario)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            usuario.active ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              usuario.active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`text-sm font-medium ${usuario.active ? 'text-green-800' : 'text-gray-500'}`}>
                          {usuario.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {/* Dropdown de opciones de edición para doctores */}
                        {usuario.isDoctor ? (
                          <div className="relative group">
                            <button
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 flex items-center space-x-1"
                              title="Editar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {/* Dropdown menu - Opens upward to avoid table overflow */}
                            <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                              <button
                                onClick={() => handleEditDoctor(usuario)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 rounded-t-lg"
                              >
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">Editar Doctor</div>
                                  <div className="text-xs text-gray-500">DNI, colegiatura, teléfono</div>
                                </div>
                              </button>
                              <button
                                onClick={() => handleEditUser(usuario)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 rounded-b-lg"
                              >
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">Editar Usuario</div>
                                  <div className="text-xs text-gray-500">Email, contraseña, rol</div>
                                </div>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditUser(usuario)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="Editar usuario"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteUser(usuario)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="Desactivar usuario"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                      Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} resultados
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-700">
                      Página {pagination.page} de {pagination.pages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Usuario */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onUserSaved={handleUserSaved}
        editingUser={editingUser}
      />

      {/* Modal para Agregar Doctor */}
      <AddDoctorModal
        isOpen={isAddDoctorModalOpen}
        onClose={() => setIsAddDoctorModalOpen(false)}
        onDoctorAdded={handleDoctorAdded}
      />

      {/* Modal para Editar Doctor */}
      <EditDoctorModal
        isOpen={isEditDoctorModalOpen}
        onClose={() => setIsEditDoctorModalOpen(false)}
        doctor={editingDoctor}
        onDoctorUpdated={handleDoctorUpdated}
      />
    </div>
  );
};

// Componente Historia Clínica
const HistoriaClinica = () => {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Historia Clínica</h1>
          <p className="text-gray-600">Configuración de plantillas y formatos de historia clínica</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Configuración de Historia Clínica</h3>
            <p className="text-gray-600 mb-6">
              Personaliza las plantillas, campos y formatos para las historias clínicas de tus pacientes.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Configurar Plantillas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Administración
const Administracion = () => {
  const [activeAdminSection, setActiveAdminSection] = useState('servicios');

  const adminSections = [
    { id: 'servicios', name: 'Servicios', icon: '🦷' },
    { id: 'propiedades', name: 'Propiedades', icon: '⚙️' },
    { id: 'proveedores', name: 'Proveedores', icon: '🚚' }
  ];

  const renderAdminSection = () => {
    switch (activeAdminSection) {
      case 'servicios':
        return <Servicios />;
      case 'propiedades':
        return <Propiedades />;
      case 'proveedores':
        return <Proveedores />;
      default:
        return <Servicios />;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administración</h1>
          <p className="text-gray-600">Configuraciones avanzadas del sistema</p>
        </div>

        {/* Navegación de subsecciones de Administración */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {adminSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveAdminSection(section.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeAdminSection === section.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido de la subsección activa */}
        {renderAdminSection()}
      </div>
    </div>
  );
};

// Componente Servicios
const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);

  // Cargar servicios
  const cargarServicios = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await tratamientosService.listarTratamientos({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      });
      if (result.success) {
        setServicios(result.tratamientos || []);
        setPagination(result.pagination);
      } else {
        setError(result.error || 'Error al cargar servicios');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, [pagination.page, pagination.limit, searchTerm]);

  const handleNuevoServicio = () => {
    setSelectedServicio(null);
    setIsModalOpen(true);
  };

  const handleEditarServicio = (servicio) => {
    setSelectedServicio(servicio);
    setIsModalOpen(true);
  };

  const handleGuardarServicio = async (data) => {
    try {
      if (selectedServicio) {
        await tratamientosService.actualizarTratamiento(data);
      } else {
        await tratamientosService.crearTratamiento(data);
      }
      await cargarServicios();
    } catch (err) {
      throw err;
    }
  };

  const handleEliminarServicio = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.')) {
      try {
        await tratamientosService.eliminarTratamiento(id);
        await cargarServicios();
      } catch (err) {
        alert(err.message || 'Error al eliminar el servicio');
      }
    }
  };

  return (
    <>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* Filtros y acciones */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <button 
            onClick={handleNuevoServicio}
            className="px-4 py-2 bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white rounded-md hover:from-[#3A2C6B] hover:to-[#1D0B59] text-sm font-medium flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Servicio</span>
          </button>
        </div>
      </div>

      {/* Tabla de servicios */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="animate-spin h-8 w-8 text-[#4A3C7B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-gray-600">Cargando servicios...</span>
        </div>
      ) : servicios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron servicios</h3>
          <p className="text-gray-500 mb-4">Comienza agregando un nuevo servicio</p>
          <button 
            onClick={handleNuevoServicio}
            className="px-4 py-2 bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white rounded-md hover:from-[#3A2C6B] hover:to-[#1D0B59] text-sm font-medium"
          >
            Nuevo Servicio
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicios.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{servicio.nombre}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {servicio.descripcion || '--'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-[#4A3C7B]">
                      S/ {parseFloat(servicio.costo_base).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditarServicio(servicio)}
                        className="text-gray-400 hover:text-[#30B0B0] transition-colors"
                        title="Editar servicio"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleEliminarServicio(servicio.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar servicio"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {!loading && servicios.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Mostrar</span>
              <select 
                value={pagination.limit}
                onChange={(e) => setPagination(p => ({ ...p, limit: Number(e.target.value), page: 1 }))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">{pagination.total} resultados</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                disabled={pagination.page <= 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm text-gray-700">Página {pagination.page} de {pagination.pages}</span>
              <button 
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Modal de servicio */}
    <ServicioModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setSelectedServicio(null);
      }}
      onSave={handleGuardarServicio}
      servicio={selectedServicio}
    />
    </>
  );
};

// Componente Etiquetas
const Etiquetas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [etiquetas, setEtiquetas] = useState([
    {
      id: 1,
      nombre: 'Nuevo',
      lugarUso: 'Agenda, CRM e Historia clínica',
      color: '#26A151',
      estado: true
    },
    {
      id: 2,
      nombre: 'VIP',
      lugarUso: 'Agenda, CRM e Historia clínica',
      color: '#0E13A4',
      estado: true
    },
    {
      id: 3,
      nombre: 'Impuntual',
      lugarUso: 'Agenda, CRM e Historia clínica',
      color: '#E42F2F',
      estado: true
    },
    {
      id: 4,
      nombre: 'Fidelizado',
      lugarUso: 'Agenda, CRM e Historia clínica',
      color: '#61D6E6',
      estado: true
    },
    {
      id: 5,
      nombre: 'VIP',
      lugarUso: 'Agenda, CRM e Historia clínica',
      color: '#0E13A4',
      estado: true
    }
  ]);

  const toggleEstado = (id) => {
    setEtiquetas(etiquetas.map(etiqueta => 
      etiqueta.id === id ? { ...etiqueta, estado: !etiqueta.estado } : etiqueta
    ));
  };

  const eliminarEtiqueta = (id) => {
    setEtiquetas(etiquetas.filter(etiqueta => etiqueta.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header con descripción y botón */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Las etiquetas te permitirá distinguir mejor a tus pacientes. Puedes usarlo de manera independiente en agenda, ficha médica y CRM.
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver más.
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Tabla de etiquetas */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre de la etiqueta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lugar de uso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {etiquetas.map((etiqueta) => (
              <tr key={etiqueta.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => eliminarEtiqueta(etiqueta.id)}
                        className="text-pink-400 hover:text-pink-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{etiqueta.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {etiqueta.lugarUso}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {etiqueta.color}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleEstado(etiqueta.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      etiqueta.estado ? 'bg-pink-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        etiqueta.estado ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    >
                      {etiqueta.estado && (
                        <svg className="h-3 w-3 text-pink-500 m-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para nueva etiqueta */}
      {isModalOpen && (
        <NuevaEtiquetaModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(nuevaEtiqueta) => {
            setEtiquetas([...etiquetas, { ...nuevaEtiqueta, id: Date.now() }]);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Componente Propiedades
const Propiedades = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Configuración de Propiedades</h3>
        <p className="text-gray-600 mb-6">
          Configura las propiedades y configuraciones específicas de tu consultorio.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Configurar Propiedades
        </button>
      </div>
    </div>
  );
};

// Componente Caja Admin
const CajaAdmin = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Configuración de Caja</h3>
        <p className="text-gray-600">Configura los métodos de pago, monedas y configuraciones financieras del sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Métodos de Pago */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pago</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="font-medium">Efectivo</span>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="font-medium">Tarjeta</span>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <span className="font-medium">Transferencia</span>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuraciones Generales */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Configuraciones Generales</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Moneda Principal</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Soles Peruanos (PEN)</option>
                <option>Dólares Americanos (USD)</option>
                <option>Euros (EUR)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Cambio USD</label>
              <input 
                type="number" 
                step="0.01"
                defaultValue="3.80"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formato de Fecha</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-8 flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
          Cancelar
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};


// Componente Proveedores
const Proveedores = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Proveedores</h3>
        <p className="text-gray-600 mb-6">
          Administra tus proveedores de insumos y servicios médicos.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Agregar Proveedor
        </button>
      </div>
    </div>
  );
};

// Modal para nueva etiqueta
const NuevaEtiquetaModal = ({ isOpen, onClose, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('#32cfc9');
  const [lugaresUso, setLugaresUso] = useState({
    agenda: false,
    crm: false,
    historiaClinica: false
  });

  const handleSave = () => {
    const lugaresSeleccionados = [];
    if (lugaresUso.agenda) lugaresSeleccionados.push('Agenda');
    if (lugaresUso.crm) lugaresSeleccionados.push('CRM');
    if (lugaresUso.historiaClinica) lugaresSeleccionados.push('Historia clínica');
    
    const lugarUsoTexto = lugaresSeleccionados.length > 0 
      ? lugaresSeleccionados.join(', ') 
      : 'Agenda, CRM e Historia clínica';

    onSave({
      nombre,
      color,
      lugarUso: lugarUsoTexto,
      estado: true
    });
    
    // Reset form
    setNombre('');
    setColor('#32cfc9');
    setLugaresUso({ agenda: false, crm: false, historiaClinica: false });
  };

  const toggleLugarUso = (lugar) => {
    setLugaresUso(prev => ({
      ...prev,
      [lugar]: !prev[lugar]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-blue-600">NUEVA ETIQUETA</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 space-y-6">
          {/* Campo Nombre */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 w-16">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el nombre de la etiqueta"
            />
          </div>

          {/* Campo Color */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 w-16">Color</label>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'color';
                  input.value = color;
                  input.onchange = (e) => setColor(e.target.value);
                  input.click();
                }}
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                placeholder="#32cfc9"
              />
            </div>
          </div>

          {/* Lugares de uso */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              ¿En qué lugares usarás esta etiqueta?
            </p>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="lugarUso"
                  checked={lugaresUso.agenda}
                  onChange={() => toggleLugarUso('agenda')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Agenda</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="lugarUso"
                  checked={lugaresUso.crm}
                  onChange={() => toggleLugarUso('crm')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">CRM</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="lugarUso"
                  checked={lugaresUso.historiaClinica}
                  onChange={() => toggleLugarUso('historiaClinica')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Historia clínica</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer del modal */}
        <div className="flex justify-center p-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={!nombre.trim()}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
