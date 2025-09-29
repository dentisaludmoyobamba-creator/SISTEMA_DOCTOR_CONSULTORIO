// Servicio para gestión de usuarios (CRUD)
const API_URL = 'https://usuarios-1090334808863.us-central1.run.app';

class UsersService {
  constructor() {
    this.authService = null;
  }

  // Inyectar authService para obtener token
  setAuthService(authService) {
    this.authService = authService;
  }

  // Headers base para las peticiones
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (includeAuth && this.authService) {
      const token = this.authService.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Obtener lista de usuarios
  async getUsers(page = 1, limit = 10, search = '', role = '') {
    try {
      const params = new URLSearchParams({
        action: 'users',
        page: page.toString(),
        limit: limit.toString()
      });

      if (search) params.append('search', search);
      if (role) params.append('role', role);

      const response = await fetch(`${API_URL}?${params}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          users: data.users,
          pagination: data.pagination
        };
      } else {
        return {
          success: false,
          error: data.error || 'Error al obtener usuarios'
        };
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Crear nuevo usuario
  async createUser(userData) {
    try {
      const response = await fetch(`${API_URL}?action=create_user`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message,
          user_id: data.user_id
        };
      } else {
        return {
          success: false,
          error: data.error || 'Error al crear usuario'
        };
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Actualizar usuario
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_URL}?action=update_user&user_id=${userId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message
        };
      } else {
        return {
          success: false,
          error: data.error || 'Error al actualizar usuario'
        };
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Eliminar (desactivar) usuario
  async deleteUser(userId) {
    try {
      const response = await fetch(`${API_URL}?action=delete_user&user_id=${userId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message
        };
      } else {
        return {
          success: false,
          error: data.error || 'Error al eliminar usuario'
        };
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Obtener roles disponibles
  async getRoles() {
    try {
      const response = await fetch(`${API_URL}?action=roles`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          roles: data.roles
        };
      } else {
        return {
          success: false,
          error: data.error || 'Error al obtener roles'
        };
      }
    } catch (error) {
      console.error('Error al obtener roles:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Cambiar estado de usuario (activar/desactivar)
  async toggleUserStatus(userId, active) {
    try {
      return await this.updateUser(userId, { active });
    } catch (error) {
      console.error('Error al cambiar estado de usuario:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Validar datos de usuario
  validateUserData(userData, isUpdate = false) {
    const errors = [];

    if (!isUpdate || userData.username) {
      if (!userData.username || userData.username.trim().length < 3) {
        errors.push('El nombre de usuario debe tener al menos 3 caracteres');
      }
    }

    if (!isUpdate || userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!userData.email || !emailRegex.test(userData.email)) {
        errors.push('Email inválido');
      }
    }

    if (!isUpdate || userData.password) {
      if (!isUpdate && (!userData.password || userData.password.length < 6)) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
      } else if (isUpdate && userData.password && userData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
      }
    }

    if (!isUpdate && (!userData.role_id || !Number.isInteger(userData.role_id))) {
      errors.push('Debe seleccionar un rol válido');
    }

    // Validaciones específicas para doctores
    if (userData.doctor_info) {
      const doctorInfo = userData.doctor_info;
      
      if (!doctorInfo.nombres || doctorInfo.nombres.trim().length < 2) {
        errors.push('Los nombres del doctor deben tener al menos 2 caracteres');
      }
      
      if (!doctorInfo.apellidos || doctorInfo.apellidos.trim().length < 2) {
        errors.push('Los apellidos del doctor deben tener al menos 2 caracteres');
      }
      
      if (!doctorInfo.dni || doctorInfo.dni.trim().length < 8) {
        errors.push('El DNI del doctor debe tener al menos 8 caracteres');
      }
      
      if (!doctorInfo.colegiatura || doctorInfo.colegiatura.trim().length < 3) {
        errors.push('La colegiatura del doctor debe tener al menos 3 caracteres');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Formatear usuario para mostrar
  formatUserForDisplay(user) {
    return {
      id: user.id,
      displayName: user.is_doctor && user.doctor_info ? 
        `${user.doctor_info.nombres} ${user.doctor_info.apellidos}` : 
        user.username,
      username: user.username,
      email: user.email,
      role: user.role,
      roleDescription: user.role_description,
      active: user.active,
      lastLogin: user.last_login ? new Date(user.last_login).toLocaleString('es-ES') : 'Nunca',
      createdAt: user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : '',
      isDoctor: user.is_doctor,
      doctorInfo: user.doctor_info
    };
  }

  // Preparar datos para crear usuario
  prepareUserDataForCreation(formData, selectedRole) {
    const userData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role_id: selectedRole.id
    };

    // Si es doctor, agregar información del doctor
    if (selectedRole.name === 'Doctor' && formData.doctorInfo) {
      userData.doctor_info = {
        nombres: formData.doctorInfo.nombres.trim(),
        apellidos: formData.doctorInfo.apellidos.trim(),
        dni: formData.doctorInfo.dni.trim(),
        colegiatura: formData.doctorInfo.colegiatura.trim(),
        telefono: formData.doctorInfo.telefono?.trim() || ''
      };
    }

    return userData;
  }
}

// Exportar una instancia única del servicio
const usersService = new UsersService();
export default usersService;
