import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import authService from './services/authService';
import Agenda from './pages/Agenda';
import Pacientes from './pages/Pacientes';
import Caja from './pages/Caja';
import Marketing from './pages/Marketing';
import Productividad from './pages/Productividad';
import Inventario from './pages/Inventario';
import Laboratorio from './pages/Laboratorio';
import Chat from './pages/Chat';
import IconPage from './components/IconPage';
import EmbudoVentas from './pages/EmbudoVentas';
import Cumpleanos from './pages/Cumpleanos';
import Segmentaciones from './pages/Segmentaciones';
import Automatizaciones from './pages/Automatizaciones';
import Campanas from './pages/Campanas';
import SoylaIA from './pages/SoylaIA';
import Configuracion from './pages/Configuracion';

// Componente placeholder para páginas no implementadas (comentado temporalmente)
// const PlaceholderPage = ({ title, icon }) => {
//   return (
//     <div className="flex h-screen bg-gray-50 pt-16">
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             {icon}
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
//           <p className="text-gray-600 mb-6">
//             Esta sección estará disponible próximamente
//           </p>
//           <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
//             <p className="text-gray-500">
//               Funcionalidad en desarrollo
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// Componente protegido que requiere autenticación
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Componente interno que usa useLocation
function AppContent() {
  const [activeTab, setActiveTab] = useState('agenda');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Verificar si hay una sesión guardada al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      if (authService.isAuthenticated() && !authService.isTokenExpired()) {
        // Verificar con el servidor que el token sigue siendo válido
        const result = await authService.getProfile();
        if (result.success) {
          setUser(result.user);
          setIsAuthenticated(true);
        } else {
          // Token inválido, limpiar sesión
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No hay token o está expirado
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Sincronizar activeTab con la URL actual
  useEffect(() => {
    const path = location.pathname.substring(1); // Remover el '/' inicial
    if (path && path !== activeTab) {
      setActiveTab(path);
    }
  }, [location.pathname, activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleLogin = (userData) => {
    setUser(userData.userData || userData);
    setIsAuthenticated(true);
    // El authService ya maneja el almacenamiento del token
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setActiveTab('agenda');
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-[#4A3C7B] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-[#4A3C7B] font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated && (
        <Navbar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          user={user}
          onLogout={handleLogout}
          onUserUpdate={handleUserUpdate}
        />
      )}
      
      <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/agenda" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          
          <Route path="/" element={<Navigate to="/agenda" replace />} />

          <Route
            path="/iconos"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <IconPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agenda"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Agenda />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/pacientes" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Pacientes />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/caja" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Caja />
              </ProtectedRoute>
            } 
          />
          
          <Route
            path="/marketing"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Marketing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/productividad"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Productividad />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventario"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Inventario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/laboratorio"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Laboratorio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Marketing */}
          <Route
            path="/embudo-ventas"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <EmbudoVentas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cumpleanos"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Cumpleanos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/segmentaciones"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Segmentaciones />
              </ProtectedRoute>
            }
          />

          <Route
            path="/automatizaciones"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Automatizaciones />
              </ProtectedRoute>
            }
          />

          <Route
            path="/campanas"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Campanas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/soyla-ia"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SoylaIA />
              </ProtectedRoute>
            }
          />

          <Route
            path="/configuracion"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Configuracion />
              </ProtectedRoute>
            }
          />

      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
