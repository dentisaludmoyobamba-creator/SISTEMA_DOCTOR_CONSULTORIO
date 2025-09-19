import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Agenda from './pages/Agenda';
import Pacientes from './pages/Pacientes';
import Caja from './pages/Caja';
import Marketing from './pages/Marketing';
import Productividad from './pages/Productividad';
import Inventario from './pages/Inventario';
import Laboratorio from './pages/Laboratorio';
import Chat from './pages/Chat';
import IconPage from './components/IconPage';

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
  const location = useLocation();

  // Verificar si hay una sesión guardada al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('doctocliq_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
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
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('doctocliq_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('doctocliq_user');
    setActiveTab('agenda');
  };

  return (
    <div className="App">
      {isAuthenticated && (
        <Navbar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          user={user}
          onLogout={handleLogout}
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
