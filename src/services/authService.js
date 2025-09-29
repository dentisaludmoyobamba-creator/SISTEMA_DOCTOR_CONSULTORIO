// Servicio para manejar la autenticación y perfil de usuario
const API_URL = 'https://usuarios-1090334808863.us-central1.run.app';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('userData') || 'null');
  }

  // Obtener el token actual
  getToken() {
    return this.token || localStorage.getItem('authToken');
  }

  // Headers base para las peticiones
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Función para login
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}?action=login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardar token y datos del usuario
        this.token = data.token;
        this.user = data.user;
        
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('userData', JSON.stringify(this.user));

        return {
          success: true,
          user: this.user,
          message: data.message
        };
      } else {
        return {
          success: false,
          error: data.error || 'Error en el login'
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Función para obtener perfil
  async getProfile() {
    try {
      if (!this.token) {
        return {
          success: false,
          error: 'No hay token de autenticación'
        };
      }

      const response = await fetch(`${API_URL}?action=profile`, {
        method: 'GET',
        headers: this.getHeaders(true)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.user = data.user;
        localStorage.setItem('userData', JSON.stringify(this.user));
        
        return {
          success: true,
          user: this.user
        };
      } else {
        if (response.status === 401) {
          this.logout();
        }
        return {
          success: false,
          error: data.error || 'Error al obtener perfil'
        };
      }
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Función para actualizar perfil
  async updateProfile(profileData) {
    try {
      if (!this.token) {
        return {
          success: false,
          error: 'No hay token de autenticación'
        };
      }

      const response = await fetch(`${API_URL}?action=profile`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Actualizar datos del usuario local
        await this.getProfile();
        
        return {
          success: true,
          message: data.message
        };
      } else {
        if (response.status === 401) {
          this.logout();
        }
        return {
          success: false,
          error: data.error || 'Error al actualizar perfil'
        };
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Función para logout
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return this.token !== null && this.user !== null;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.user;
  }

  // Verificar si el token ha expirado (básico)
  isTokenExpired() {
    if (!this.token) return true;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Verificar rol del usuario
  hasRole(role) {
    return this.user && this.user.role === role;
  }

  // Verificar si es doctor
  isDoctor() {
    return this.user && this.user.is_doctor;
  }
}

// Exportar una instancia única del servicio
const authService = new AuthService();
export default authService;
