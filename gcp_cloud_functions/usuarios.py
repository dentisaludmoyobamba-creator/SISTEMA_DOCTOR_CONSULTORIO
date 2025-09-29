import functions_framework
import psycopg2
import json
import hashlib
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

def hash_password(password):
    """Hash de la contraseña usando SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

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
            updates.append("contrasena_hash = %s")
            params.append(hash_password(data['password'].strip()))
        
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

@functions_framework.http
def hello_http(request):

    headers={
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Methods":"GET,POST,PUT,OPTIONS",
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
            else:
                return (json.dumps({"error": "Acción no válida para POST. Use ?action=login"}), 400, headers)
        
        elif request.method == "GET":
            if action == "profile" or "profile" in path:
                return obtener_perfil(request, headers)
            else:
                return (json.dumps({"error": "Acción no válida para GET. Use ?action=profile"}), 400, headers)
        
        elif request.method == "PUT":
            if action == "profile" or "profile" in path:
                return actualizar_perfil(request, headers)
            else:
                return (json.dumps({"error": "Acción no válida para PUT. Use ?action=profile"}), 400, headers)
        
        else:
            return (json.dumps({"error":"Método HTTP no soportado"}), 405, headers)
    
    except Exception as e:
        return (json.dumps({"error": f"Error interno del servidor: {str(e)}"}), 500, headers)