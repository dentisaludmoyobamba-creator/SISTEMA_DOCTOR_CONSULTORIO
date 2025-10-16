import functions_framework
import psycopg2
import json
import jwt
import datetime
from psycopg2.extras import RealDictCursor

# Clave secreta para JWT (en producción debería estar en variables de entorno)
JWT_SECRET = 'dental_clinic_secret_key_2024'

def get_connection():
    # Configuración
    PGHOST = 'ep-plain-mountain-aelv7gf4-pooler.c-2.us-east-2.aws.neon.tech'
    PGDATABASE = 'neondb'
    PGUSER = 'neondb_owner'
    PGPASSWORD = 'npg_qX6DcMlHk8vE'
    PGSSLMODE = 'require'

    # Conexión
    conn = psycopg2.connect(
        host=PGHOST,
        dbname=PGDATABASE,
        user=PGUSER,
        password=PGPASSWORD,
        sslmode=PGSSLMODE,
        cursor_factory=RealDictCursor
    )
    return conn


def verify_token(token):
    """Verificar y decodificar el token JWT"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def login_usuario(request, headers):
    """Función para login de usuario"""
    try:
        # Obtener datos del request
        data = request.get_json()
        if not data:
            return (json.dumps({"error": "No se enviaron datos"}), 400, headers)
        
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        # Log temporal para debug
        print(f"DEBUG login: Username: '{username}', Password: '{password}'")
        
        if not username or not password:
            return (json.dumps({"error": "Username y password son requeridos"}), 400, headers)
        
        # Conectar a la base de datos
        conn = get_connection()
        cursor = conn.cursor()
        
        # Buscar usuario por username o email
        query = """
            SELECT u.id_usuario, u.nombre_usuario, u.email, u.id_rol, u.activo,
                   r.nombre_rol, r.descripcion as rol_descripcion,
                   d.id_doctor, d.nombres as doctor_nombres, d.apellidos as doctor_apellidos
            FROM usuarios u
            LEFT JOIN roles r ON u.id_rol = r.id_rol
            LEFT JOIN doctores d ON u.id_usuario = d.id_usuario
            WHERE (u.nombre_usuario = %s OR u.email = %s) 
            AND u.contrasena_hash = %s 
            AND u.activo = true
        """
        
        cursor.execute(query, (username, username, password))
        user = cursor.fetchone()
        
        # Log temporal para debug
        print(f"DEBUG login: Usuario encontrado: {user is not None}")
        
        if not user:
            return (json.dumps({"error": "Credenciales inválidas"}), 401, headers)
        
        # Actualizar último login
        update_query = "UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id_usuario = %s"
        cursor.execute(update_query, (user['id_usuario'],))
        conn.commit()
        
        # Crear token JWT
        payload = {
            'user_id': user['id_usuario'],
            'username': user['nombre_usuario'],
            'role': user['nombre_rol'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
        
        # Preparar respuesta
        response_data = {
            "success": True,
            "message": "Login exitoso",
            "token": token,
            "user": {
                "id": user['id_usuario'],
                "username": user['nombre_usuario'],
                "email": user['email'],
                "role": user['nombre_rol'],
                "role_description": user['rol_descripcion'],
                "is_doctor": user['id_doctor'] is not None,
                "doctor_info": {
                    "id": user['id_doctor'],
                    "nombres": user['doctor_nombres'],
                    "apellidos": user['doctor_apellidos']
                } if user['id_doctor'] else None
            }
        }
        
        cursor.close()
        conn.close()
        
        return (json.dumps(response_data), 200, headers)
        
    except Exception as e:
        return (json.dumps({"error": f"Error en login: {str(e)}"}), 500, headers)

def obtener_perfil(request, headers):
    """Función para obtener perfil del usuario"""
    try:
        # Verificar token de autorización
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return (json.dumps({"error": "Token de autorización requerido"}), 401, headers)
        
        token = auth_header.replace('Bearer ', '')
        payload = verify_token(token)
        
        if not payload:
            return (json.dumps({"error": "Token inválido o expirado"}), 401, headers)
        
        user_id = payload.get('user_id')
        
        # Conectar a la base de datos
        conn = get_connection()
        cursor = conn.cursor()
        
        # Obtener datos completos del usuario
        query = """
            SELECT u.id_usuario, u.nombre_usuario, u.email, u.id_rol, u.activo,
                   u.ultimo_login, u.fecha_creacion,
                   r.nombre_rol, r.descripcion as rol_descripcion,
                   d.id_doctor, d.nombres as doctor_nombres, d.apellidos as doctor_apellidos,
                   d.dni as doctor_dni, d.colegiatura, d.telefono as doctor_telefono
            FROM usuarios u
            LEFT JOIN roles r ON u.id_rol = r.id_rol
            LEFT JOIN doctores d ON u.id_usuario = d.id_usuario
            WHERE u.id_usuario = %s
        """
        
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()
        
        if not user:
            return (json.dumps({"error": "Usuario no encontrado"}), 404, headers)
        
        # Preparar respuesta
        response_data = {
            "success": True,
            "user": {
                "id": user['id_usuario'],
                "username": user['nombre_usuario'],
                "email": user['email'],
                "role": user['nombre_rol'],
                "role_description": user['rol_descripcion'],
                "active": user['activo'],
                "last_login": user['ultimo_login'].isoformat() if user['ultimo_login'] else None,
                "created_at": user['fecha_creacion'].isoformat() if user['fecha_creacion'] else None,
                "is_doctor": user['id_doctor'] is not None,
                "doctor_info": {
                    "id": user['id_doctor'],
                    "nombres": user['doctor_nombres'],
                    "apellidos": user['doctor_apellidos'],
                    "dni": user['doctor_dni'],
                    "colegiatura": user['colegiatura'],
                    "telefono": user['doctor_telefono']
                } if user['id_doctor'] else None
            }
        }
        
        cursor.close()
        conn.close()
        
        return (json.dumps(response_data), 200, headers)
        
    except Exception as e:
        return (json.dumps({"error": f"Error al obtener perfil: {str(e)}"}), 500, headers)

def actualizar_perfil(request, headers):
    """Función para actualizar perfil del usuario"""
    try:
        # Verificar token de autorización
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return (json.dumps({"error": "Token de autorización requerido"}), 401, headers)
        
        token = auth_header.replace('Bearer ', '')
        payload = verify_token(token)
        
        if not payload:
            return (json.dumps({"error": "Token inválido o expirado"}), 401, headers)
        
        user_id = payload.get('user_id')
        
        # Obtener datos del request
        data = request.get_json()
        if not data:
            return (json.dumps({"error": "No se enviaron datos"}), 400, headers)
        
        # Conectar a la base de datos
        conn = get_connection()
        cursor = conn.cursor()
        
        # Campos que se pueden actualizar
        updates = []
        params = []
        
        if 'email' in data and data['email'].strip():
            updates.append("email = %s")
            params.append(data['email'].strip())
        
        if 'password' in data and data['password'].strip():
            # Log temporal para debug
            print(f"DEBUG: Contraseña recibida: '{data['password'].strip()}'")
            updates.append("contrasena_hash = %s")
            params.append(data['password'].strip())
        
        if not updates:
            return (json.dumps({"error": "No hay campos para actualizar"}), 400, headers)
        
        # Verificar que el email no esté en uso por otro usuario
        if 'email' in data:
            check_query = "SELECT id_usuario FROM usuarios WHERE email = %s AND id_usuario != %s"
            cursor.execute(check_query, (data['email'].strip(), user_id))
            if cursor.fetchone():
                return (json.dumps({"error": "El email ya está en uso"}), 400, headers)
        
        # Actualizar usuario
        params.append(user_id)
        update_query = f"UPDATE usuarios SET {', '.join(updates)} WHERE id_usuario = %s"
        cursor.execute(update_query, params)
        
        # Si es doctor, actualizar datos de doctor si se proporcionan
        if any(field in data for field in ['doctor_nombres', 'doctor_apellidos', 'doctor_telefono']):
            doctor_updates = []
            doctor_params = []
            
            if 'doctor_nombres' in data and data['doctor_nombres'].strip():
                doctor_updates.append("nombres = %s")
                doctor_params.append(data['doctor_nombres'].strip())
            
            if 'doctor_apellidos' in data and data['doctor_apellidos'].strip():
                doctor_updates.append("apellidos = %s")
                doctor_params.append(data['doctor_apellidos'].strip())
            
            if 'doctor_telefono' in data and data['doctor_telefono'].strip():
                doctor_updates.append("telefono = %s")
                doctor_params.append(data['doctor_telefono'].strip())
            
            if doctor_updates:
                doctor_params.append(user_id)
                doctor_query = f"UPDATE doctores SET {', '.join(doctor_updates)} WHERE id_usuario = %s"
                cursor.execute(doctor_query, doctor_params)
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return (json.dumps({"success": True, "message": "Perfil actualizado exitosamente"}), 200, headers)
        
    except Exception as e:
        conn.rollback()
        return (json.dumps({"error": f"Error al actualizar perfil: {str(e)}"}), 500, headers)

def crear_usuario(request, headers):
    """Función para crear un nuevo usuario"""
    try:
        # Verificar token de autorización
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return (json.dumps({"error": "Token de autorización requerido"}), 401, headers)
        
        token = auth_header.replace('Bearer ', '')
        payload = verify_token(token)
        
        if not payload:
            return (json.dumps({"error": "Token inválido o expirado"}), 401, headers)
        
        # Verificar que sea administrador
        user_role = payload.get('role')
        if user_role != 'Administrador':
            return (json.dumps({"error": "Solo administradores pueden crear usuarios"}), 403, headers)
        
        # Obtener datos del request
        data = request.get_json()
        if not data:
            return (json.dumps({"error": "No se enviaron datos"}), 400, headers)
        
        # Validar campos requeridos
        required_fields = ['username', 'email', 'password', 'role_id']
        for field in required_fields:
            if field not in data or not data[field]:
                return (json.dumps({"error": f"Campo {field} es requerido"}), 400, headers)
        
        username = data['username'].strip()
        email = data['email'].strip()
        password = data['password'].strip()
        role_id = data['role_id']
        
        # Datos opcionales para doctor
        doctor_data = {}
        if 'doctor_info' in data and data['doctor_info']:
            doctor_info = data['doctor_info']
            required_doctor_fields = ['nombres', 'apellidos', 'dni', 'colegiatura']
            for field in required_doctor_fields:
                if field not in doctor_info or not doctor_info[field]:
                    return (json.dumps({"error": f"Campo doctor {field} es requerido para doctores"}), 400, headers)
            doctor_data = doctor_info
        
        # Conectar a la base de datos
        conn = get_connection()
        cursor = conn.cursor()
        
        # Verificar que el username y email no existan
        check_query = "SELECT id_usuario FROM usuarios WHERE nombre_usuario = %s OR email = %s"
        cursor.execute(check_query, (username, email))
        if cursor.fetchone():
            return (json.dumps({"error": "El username o email ya están en uso"}), 400, headers)
        
        # Verificar que el rol existe
        role_check = "SELECT nombre_rol FROM roles WHERE id_rol = %s"
        cursor.execute(role_check, (role_id,))
        role_result = cursor.fetchone()
        if not role_result:
            return (json.dumps({"error": "Rol no válido"}), 400, headers)
        
        # Guardar contraseña sin hash
        password_plain = password
        
        # Insertar usuario
        user_query = """
            INSERT INTO usuarios (nombre_usuario, contrasena_hash, email, id_rol, activo, fecha_creacion)
            VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
            RETURNING id_usuario
        """
        cursor.execute(user_query, (username, password_plain, email, role_id, True))
        user_id = cursor.fetchone()['id_usuario']
        
        # Si es doctor, insertar datos del doctor
        if doctor_data and role_result['nombre_rol'] == 'Doctor':
            doctor_query = """
                INSERT INTO doctores (nombres, apellidos, dni, colegiatura, telefono, id_usuario)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(doctor_query, (
                doctor_data['nombres'], 
                doctor_data['apellidos'], 
                doctor_data['dni'], 
                doctor_data['colegiatura'], 
                doctor_data.get('telefono', ''), 
                user_id
            ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return (json.dumps({
            "success": True, 
            "message": "Usuario creado exitosamente",
            "user_id": user_id
        }), 200, headers)
        
    except Exception as e:
        conn.rollback()
        return (json.dumps({"error": f"Error al crear usuario: {str(e)}"}), 500, headers)

def obtener_usuarios(request, headers):
    """Función para obtener lista de usuarios"""
    try:
        # Verificar token de autorización
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return (json.dumps({"error": "Token de autorización requerido"}), 401, headers)
        
        token = auth_header.replace('Bearer ', '')
        payload = verify_token(token)
        
        if not payload:
            return (json.dumps({"error": "Token inválido o expirado"}), 401, headers)
        
        # Conectar a la base de datos
        conn = get_connection()
        cursor = conn.cursor()
        
        # Obtener parámetros de consulta
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        search = request.args.get('search', '')
        role_filter = request.args.get('role', '')
        
        # Construir consulta base
        base_query = """
            SELECT u.id_usuario, u.nombre_usuario, u.email, u.id_rol, u.activo,
                   u.ultimo_login, u.fecha_creacion,
                   r.nombre_rol, r.descripcion as rol_descripcion,
                   d.id_doctor, d.nombres as doctor_nombres, d.apellidos as doctor_apellidos,
                   d.dni as doctor_dni, d.colegiatura, d.telefono as doctor_telefono
            FROM usuarios u
            LEFT JOIN roles r ON u.id_rol = r.id_rol
            LEFT JOIN doctores d ON u.id_usuario = d.id_usuario
            WHERE 1=1
        """
        
        params = []
        
        # Filtros
        if search:
            base_query += " AND (u.nombre_usuario ILIKE %s OR u.email ILIKE %s OR d.nombres ILIKE %s OR d.apellidos ILIKE %s)"
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param, search_param])
        
        if role_filter:
            base_query += " AND r.nombre_rol = %s"
            params.append(role_filter)
        
        # Contar total de registros
        count_query = f"SELECT COUNT(*) as total FROM ({base_query}) as subquery"
        cursor.execute(count_query, params)
        total_count = cursor.fetchone()['total']
        
        # Agregar paginación
        offset = (page - 1) * limit
        base_query += " ORDER BY u.fecha_creacion DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        cursor.execute(base_query, params)
        usuarios = cursor.fetchall()
        
        # Formatear respuesta
        usuarios_formateados = []
        for usuario in usuarios:
            usuarios_formateados.append({
                "id": usuario['id_usuario'],
                "username": usuario['nombre_usuario'],
                "email": usuario['email'],
                "role": usuario['nombre_rol'],
                "role_description": usuario['rol_descripcion'],
                "active": usuario['activo'],
                "last_login": usuario['ultimo_login'].isoformat() if usuario['ultimo_login'] else None,
                "created_at": usuario['fecha_creacion'].isoformat() if usuario['fecha_creacion'] else None,
                "is_doctor": usuario['id_doctor'] is not None,
                "doctor_info": {
                    "id": usuario['id_doctor'],
                    "nombres": usuario['doctor_nombres'],
                    "apellidos": usuario['doctor_apellidos'],
                    "dni": usuario['doctor_dni'],
                    "colegiatura": usuario['colegiatura'],
                    "telefono": usuario['doctor_telefono']
                } if usuario['id_doctor'] else None
            })
        
        cursor.close()
        conn.close()
        
        return (json.dumps({
            "success": True,
            "users": usuarios_formateados,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": (total_count + limit - 1) // limit
            }
        }), 200, headers)
        
    except Exception as e:
        return (json.dumps({"error": f"Error al obtener usuarios: {str(e)}"}), 500, headers)

def actualizar_usuario(request, headers):
    """Función para actualizar un usuario (por administrador)"""
    try:
        # Verificar token de autorización
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return (json.dumps({"error": "Token de autorización requerido"}), 401, headers)
        
        token = auth_header.replace('Bearer ', '')
        payload = verify_token(token)
        
        if not payload:
            return (json.dumps({"error": "Token inválido o expirado"}), 401, headers)
        
        # Verificar que sea administrador
        user_role = payload.get('role')
        if user_role != 'Administrador':
            return (json.dumps({"error": "Solo administradores pueden actualizar usuarios"}), 403, headers)
        
        # Obtener ID del usuario a actualizar
        user_id = request.args.get('user_id')
        if not user_id:
            return (json.dumps({"error": "ID de usuario requerido"}), 400, headers)
        
        # Obtener datos del request
        data = request.get_json()
        if not data:
            return (json.dumps({"error": "No se enviaron datos"}), 400, headers)
        
        # Conectar a la base de datos
        conn = get_connection()
        cursor = conn.cursor()
        
        # Verificar que el usuario existe
        check_query = "SELECT id_usuario FROM usuarios WHERE id_usuario = %s"
        cursor.execute(check_query, (user_id,))
        if not cursor.fetchone():
            return (json.dumps({"error": "Usuario no encontrado"}), 404, headers)
        
        # Campos que se pueden actualizar
        updates = []
        params = []
        
        if 'email' in data and data['email'].strip():
            # Verificar que el email no esté en uso por otro usuario
            email_check = "SELECT id_usuario FROM usuarios WHERE email = %s AND id_usuario != %s"
            cursor.execute(email_check, (data['email'].strip(), user_id))
            if cursor.fetchone():
                return (json.dumps({"error": "El email ya está en uso"}), 400, headers)
            
            updates.append("email = %s")
            params.append(data['email'].strip())
        
        if 'password' in data and data['password'].strip():
            # Log temporal para debug
            print(f"DEBUG actualizar_usuario: Contraseña recibida: '{data['password'].strip()}'")
            updates.append("contrasena_hash = %s")
            params.append(data['password'].strip())
        
        if 'role_id' in data:
            # Verificar que el rol existe
            role_check = "SELECT id_rol FROM roles WHERE id_rol = %s"
            cursor.execute(role_check, (data['role_id'],))
            if not cursor.fetchone():
                return (json.dumps({"error": "Rol no válido"}), 400, headers)
            
            updates.append("id_rol = %s")
            params.append(data['role_id'])
        
        if 'active' in data:
            updates.append("activo = %s")
            params.append(data['active'])
        
        if updates:
            params.append(user_id)
            update_query = f"UPDATE usuarios SET {', '.join(updates)} WHERE id_usuario = %s"
            cursor.execute(update_query, params)
        
        # Actualizar datos del doctor si se proporcionan y es doctor
        if 'doctor_info' in data and data['doctor_info']:
            doctor_info = data['doctor_info']
            doctor_updates = []
            doctor_params = []
            
            if 'nombres' in doctor_info and doctor_info['nombres'].strip():
                doctor_updates.append("nombres = %s")
                doctor_params.append(doctor_info['nombres'].strip())
            
            if 'apellidos' in doctor_info and doctor_info['apellidos'].strip():
                doctor_updates.append("apellidos = %s")
                doctor_params.append(doctor_info['apellidos'].strip())
            
            if 'telefono' in doctor_info:
                doctor_updates.append("telefono = %s")
                doctor_params.append(doctor_info['telefono'] or '')
            
            if doctor_updates:
                doctor_params.append(user_id)
                doctor_query = f"UPDATE doctores SET {', '.join(doctor_updates)} WHERE id_usuario = %s"
                cursor.execute(doctor_query, doctor_params)
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return (json.dumps({"success": True, "message": "Usuario actualizado exitosamente"}), 200, headers)
        
    except Exception as e:
        conn.rollback()
        return (json.dumps({"error": f"Error al actualizar usuario: {str(e)}"}), 500, headers)

def eliminar_usuario(request, headers):
    """Función para eliminar (desactivar) un usuario"""
    try:
        # Verificar token de autorización
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return (json.dumps({"error": "Token de autorización requerido"}), 401, headers)
        
        token = auth_header.replace('Bearer ', '')
        payload = verify_token(token)
        
        if not payload:
            return (json.dumps({"error": "Token inválido o expirado"}), 401, headers)
        
        # Verificar que sea administrador
        user_role = payload.get('role')
        if user_role != 'Administrador':
            return (json.dumps({"error": "Solo administradores pueden eliminar usuarios"}), 403, headers)
        
        # Obtener ID del usuario a eliminar
        user_id = request.args.get('user_id')
        if not user_id:
            return (json.dumps({"error": "ID de usuario requerido"}), 400, headers)
        
        # No permitir eliminar al propio usuario
        current_user_id = payload.get('user_id')
        if str(user_id) == str(current_user_id):
            return (json.dumps({"error": "No puedes eliminar tu propio usuario"}), 400, headers)
        
        # Conectar a la base de datos
        conn = get_connection()
        cursor = conn.cursor()
        
        # Verificar que el usuario existe
        check_query = "SELECT id_usuario FROM usuarios WHERE id_usuario = %s"
        cursor.execute(check_query, (user_id,))
        if not cursor.fetchone():
            return (json.dumps({"error": "Usuario no encontrado"}), 404, headers)
        
        # Desactivar usuario en lugar de eliminarlo
        update_query = "UPDATE usuarios SET activo = FALSE WHERE id_usuario = %s"
        cursor.execute(update_query, (user_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return (json.dumps({"success": True, "message": "Usuario desactivado exitosamente"}), 200, headers)
        
    except Exception as e:
        conn.rollback()
        return (json.dumps({"error": f"Error al eliminar usuario: {str(e)}"}), 500, headers)

def obtener_roles(request, headers):
    """Función para obtener lista de roles disponibles"""
    try:
        # Verificar token de autorización
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return (json.dumps({"error": "Token de autorización requerido"}), 401, headers)
        
        token = auth_header.replace('Bearer ', '')
        payload = verify_token(token)
        
        if not payload:
            return (json.dumps({"error": "Token inválido o expirado"}), 401, headers)
        
        # Conectar a la base de datos
        conn = get_connection()
        cursor = conn.cursor()
        
        # Obtener roles
        query = "SELECT id_rol, nombre_rol, descripcion FROM roles ORDER BY nombre_rol"
        cursor.execute(query)
        roles = cursor.fetchall()
        
        # Formatear respuesta
        roles_formateados = []
        for rol in roles:
            roles_formateados.append({
                "id": rol['id_rol'],
                "name": rol['nombre_rol'],
                "description": rol['descripcion']
            })
        
        cursor.close()
        conn.close()
        
        return (json.dumps({
            "success": True,
            "roles": roles_formateados
        }), 200, headers)
        
    except Exception as e:
        return (json.dumps({"error": f"Error al obtener roles: {str(e)}"}), 500, headers)

def registrar_doctor(request, headers):
    """Función para registrar un usuario como doctor en la tabla doctores"""
    try:
        # Verificar token de autorización
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return (json.dumps({"error": "Token de autorización requerido"}), 401, headers)
        
        token = auth_header.replace('Bearer ', '')
        payload = verify_token(token)
        
        if not payload:
            return (json.dumps({"error": "Token inválido o expirado"}), 401, headers)
        
        # Verificar que sea administrador
        user_role = payload.get('role')
        if user_role != 'Administrador':
            return (json.dumps({"error": "Solo administradores pueden registrar doctores"}), 403, headers)
        
        # Obtener datos del request
        data = request.get_json()
        if not data:
            return (json.dumps({"error": "No se enviaron datos"}), 400, headers)
        
        # Validar campos requeridos
        user_id = data.get('user_id')
        nombres = data.get('nombres', '').strip()
        apellidos = data.get('apellidos', '').strip()
        telefono = data.get('telefono', '').strip()
        
        if not user_id:
            return (json.dumps({"error": "user_id es requerido"}), 400, headers)
        
        if not nombres or not apellidos:
            return (json.dumps({"error": "Nombres y apellidos son requeridos"}), 400, headers)
        
        # Conectar a la base de datos
        conn = get_connection()
        cursor = conn.cursor()
        
        # Verificar que el usuario existe y tiene rol de Doctor
        user_query = """
            SELECT u.id_usuario, u.id_rol, r.nombre_rol 
            FROM usuarios u
            LEFT JOIN roles r ON u.id_rol = r.id_rol
            WHERE u.id_usuario = %s
        """
        cursor.execute(user_query, (user_id,))
        user = cursor.fetchone()
        
        if not user:
            conn.close()
            return (json.dumps({"error": "Usuario no encontrado"}), 404, headers)
        
        if user['nombre_rol'] != 'Doctor':
            conn.close()
            return (json.dumps({"error": "El usuario no tiene rol de Doctor"}), 400, headers)
        
        # Verificar si ya existe un doctor para este usuario
        check_doctor = "SELECT id_doctor FROM doctores WHERE id_usuario = %s"
        cursor.execute(check_doctor, (user_id,))
        existing_doctor = cursor.fetchone()
        
        if existing_doctor:
            conn.close()
            return (json.dumps({"error": "Este usuario ya tiene un perfil de doctor registrado"}), 400, headers)
        
        # Generar DNI y colegiatura temporales únicos
        import time
        timestamp = int(time.time())
        dni_temp = f"TEMP_DNI_{user_id}_{timestamp}"
        colegiatura_temp = f"TEMP_COL_{user_id}_{timestamp}"
        
        # Insertar el nuevo doctor
        insert_query = """
            INSERT INTO doctores (nombres, apellidos, dni, colegiatura, telefono, id_usuario)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id_doctor
        """
        cursor.execute(insert_query, (nombres, apellidos, dni_temp, colegiatura_temp, telefono, user_id))
        result = cursor.fetchone()
        nuevo_id_doctor = result['id_doctor']
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return (json.dumps({
            "success": True,
            "message": f"Doctor registrado exitosamente. IMPORTANTE: Debe actualizar el DNI ({dni_temp}) y la colegiatura ({colegiatura_temp}) en la base de datos.",
            "id_doctor": nuevo_id_doctor,
            "warning": "Los valores de DNI y colegiatura son temporales y deben ser actualizados manualmente en la base de datos."
        }), 200, headers)
        
    except Exception as e:
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return (json.dumps({"error": f"Error al registrar doctor: {str(e)}"}), 500, headers)

@functions_framework.http
def hello_http(request):

    headers={
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers":"Content-Type,Authorization"
    }

    if request.method == "OPTIONS":
            return("",200,headers)
    
    try:
        # Obtener la acción del query parameter o path
        action = request.args.get('action', '')
        path = request.path.strip('/')
        
        if request.method == "POST":
            if action == "login" or "login" in path:
                return login_usuario(request, headers)
            elif action == "create_user" or "create_user" in path:
                return crear_usuario(request, headers)
            elif action == "register_doctor" or "register_doctor" in path:
                return registrar_doctor(request, headers)
            else:
                return (json.dumps({"error": "Acción no válida para POST. Use ?action=login, ?action=create_user o ?action=register_doctor"}), 400, headers)
        
        elif request.method == "GET":
            if action == "profile" or "profile" in path:
                return obtener_perfil(request, headers)
            elif action == "users" or "users" in path:
                return obtener_usuarios(request, headers)
            elif action == "roles" or "roles" in path:
                return obtener_roles(request, headers)
            else:
                return (json.dumps({"error": "Acción no válida para GET. Use ?action=profile, ?action=users o ?action=roles"}), 400, headers)
        
        elif request.method == "PUT":
            if action == "profile" or "profile" in path:
                return actualizar_perfil(request, headers)
            elif action == "update_user" or "update_user" in path:
                return actualizar_usuario(request, headers)
            else:
                return (json.dumps({"error": "Acción no válida para PUT. Use ?action=profile o ?action=update_user"}), 400, headers)
        
        elif request.method == "DELETE":
            if action == "delete_user" or "delete_user" in path:
                return eliminar_usuario(request, headers)
            else:
                return (json.dumps({"error": "Acción no válida para DELETE. Use ?action=delete_user"}), 400, headers)
        
        else:
            return (json.dumps({"error":"Método HTTP no soportado"}), 405, headers)
    
    except Exception as e:
        return (json.dumps({"error": f"Error interno del servidor: {str(e)}"}), 500, headers)