// Servicio para gestión de doctores
const BASE_URL = 'https://usuarios-1090334808863.us-central1.run.app';

class DoctorsService {
  constructor() {
    this.authService = null;
  }

  setAuthService(authService) {
    this.authService = authService;
  }

  async registerDoctor(userId, doctorData) {
    try {
      const token = this.authService?.getToken();
      if (!token) {
        return { success: false, error: 'No hay sesión activa' };
      }

      console.log('🔵 Iniciando registro de doctor...');
      console.log('URL:', `${BASE_URL}?action=register_doctor`);
      console.log('Data:', { user_id: parseInt(userId), nombres: doctorData.nombres, apellidos: doctorData.apellidos });

      // Llamar al endpoint para registrar doctor
      const response = await fetch(`${BASE_URL}?action=register_doctor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          nombres: doctorData.nombres,
          apellidos: doctorData.apellidos,
          telefono: doctorData.telefono || ''
        })
      });

      console.log('🔵 Response status:', response.status);
      console.log('🔵 Response ok:', response.ok);

      // Intentar leer la respuesta como texto primero
      const responseText = await response.text();
      console.log('🔵 Response text:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Error al parsear JSON:', parseError);
        return { 
          success: false, 
          error: `Error en la respuesta del servidor. Status: ${response.status}. Respuesta: ${responseText.substring(0, 200)}` 
        };
      }

      if (response.ok && result.success) {
        console.log('✅ Doctor registrado exitosamente');
        return { 
          success: true, 
          message: result.message || 'Doctor registrado exitosamente',
          warning: result.warning,
          id_doctor: result.id_doctor
        };
      } else {
        console.error('❌ Error en la respuesta:', result);
        return { success: false, error: result.error || 'Error al registrar doctor' };
      }
    } catch (error) {
      console.error('❌ Error en registerDoctor:', error);
      console.error('Error completo:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return { 
        success: false, 
        error: `Error de conexión: ${error.message}. Verifica que el backend esté desplegado y accesible.` 
      };
    }
  }

  async getUsersWithoutDoctorProfile() {
    try {
      const token = this.authService?.getToken();
      if (!token) {
        return { success: false, error: 'No hay sesión activa' };
      }

      console.log('🔵 Obteniendo usuarios sin perfil de doctor...');
      console.log('URL:', `${BASE_URL}?action=users&role=Doctor&page=1&limit=100`);

      // Obtener usuarios con rol Doctor
      const response = await fetch(`${BASE_URL}?action=users&role=Doctor&page=1&limit=100`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔵 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error en la respuesta:', errorData);
        return { success: false, error: errorData.error || 'Error al obtener usuarios' };
      }

      const result = await response.json();
      console.log('🔵 Resultado:', result);

      if (result.success) {
        // Filtrar solo usuarios que NO tienen perfil de doctor
        const usersWithoutDoctorProfile = result.users.filter(user => !user.is_doctor);
        
        console.log(`✅ Encontrados ${usersWithoutDoctorProfile.length} usuarios sin perfil de doctor`);
        
        return { 
          success: true, 
          users: usersWithoutDoctorProfile,
          count: usersWithoutDoctorProfile.length
        };
      } else {
        console.error('❌ Error en result:', result);
        return { success: false, error: result.error || 'Error al obtener usuarios' };
      }
    } catch (error) {
      console.error('❌ Error en getUsersWithoutDoctorProfile:', error);
      console.error('Error completo:', {
        message: error.message,
        stack: error.stack
      });
      return { 
        success: false, 
        error: `Error de conexión: ${error.message}. Verifica la URL del backend.` 
      };
    }
  }

  async getDoctors() {
    try {
      const token = this.authService?.getToken();
      if (!token) {
        return { success: false, error: 'No hay sesión activa' };
      }

      // Obtener usuarios con rol Doctor que ya tienen perfil de doctor
      const response = await fetch(`${BASE_URL}?action=users&role=Doctor&page=1&limit=100`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Error al obtener doctores' };
      }

      const result = await response.json();

      if (result.success) {
        // Filtrar solo usuarios que SÍ tienen perfil de doctor
        const doctors = result.users.filter(user => user.is_doctor);
        
        return { 
          success: true, 
          doctors: doctors,
          count: doctors.length
        };
      } else {
        return { success: false, error: result.error || 'Error al obtener doctores' };
      }
    } catch (error) {
      console.error('Error en getDoctors:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  }

  async updateDoctor(userId, doctorData) {
    try {
      const token = this.authService?.getToken();
      if (!token) {
        return { success: false, error: 'No hay sesión activa' };
      }

      console.log('🔵 Actualizando datos del doctor...');
      console.log('User ID:', userId);
      console.log('Data:', doctorData);

      const response = await fetch(`${BASE_URL}?action=update_user&user_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctor_info: {
            nombres: doctorData.nombres,
            apellidos: doctorData.apellidos,
            dni: doctorData.dni,
            colegiatura: doctorData.colegiatura,
            telefono: doctorData.telefono || ''
          }
        })
      });

      console.log('🔵 Response status:', response.status);

      const responseText = await response.text();
      console.log('🔵 Response text:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Error al parsear JSON:', parseError);
        return { 
          success: false, 
          error: `Error en la respuesta del servidor. Status: ${response.status}` 
        };
      }

      if (response.ok && result.success) {
        console.log('✅ Doctor actualizado exitosamente');
        return { 
          success: true, 
          message: result.message || 'Doctor actualizado exitosamente'
        };
      } else {
        console.error('❌ Error en la respuesta:', result);
        return { success: false, error: result.error || 'Error al actualizar doctor' };
      }
    } catch (error) {
      console.error('❌ Error en updateDoctor:', error);
      return { 
        success: false, 
        error: `Error de conexión: ${error.message}` 
      };
    }
  }
}

const doctorsService = new DoctorsService();
export default doctorsService;

