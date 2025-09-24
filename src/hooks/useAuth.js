import { useState, useEffect } from 'react';
import { authService } from '../services';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userProfile = await authService.getProfile();
          const savedUser = localStorage.getItem('doctocliq_user');
          
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            setUser(userProfile);
            localStorage.setItem('doctocliq_user', JSON.stringify(userProfile));
          }
          
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        // Si hay error, limpiar datos locales
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const userProfile = await authService.getProfile();
      
      setUser(userProfile);
      setIsAuthenticated(true);
      localStorage.setItem('doctocliq_user', JSON.stringify(userProfile));
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
        localStorage.setItem('doctocliq_user', JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser
  };
};
