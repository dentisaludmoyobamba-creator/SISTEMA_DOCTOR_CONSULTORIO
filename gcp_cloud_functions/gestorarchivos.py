import functions_framework
from google.cloud import storage
import psycopg2
import json
import jwt
import datetime
import os
from psycopg2.extras import RealDictCursor
from werkzeug.utils import secure_filename

JWT_SECRET = 'dental_clinic_secret_key_2024'

# Configuración Cloud Storage
# El cliente se inicializa automáticamente con las credenciales de GCP
try:
    storage_client = storage.Client()
    BUCKET_NAME = "archivos_sistema_consultorio_moyobamba"
except Exception as e:
    print(f"Error al inicializar Cloud Storage: {e}")
    storage_client = None

def get_connection():
    # Configuración PostgreSQL
    PGHOST = 'ep-plain-mountain-aelv7gf4-pooler.c-2.us-east-2.aws.neon.tech'
    PGDATABASE = 'neondb'
    PGUSER = 'neondb_owner'
    PGPASSWORD = 'npg_qX6DcMlHk8vE'
    PGSSLMODE = 'require'

    conn = psycopg2.connect(
        host=PGHOST,
        dbname=PGDATABASE,
        user=PGUSER,
        password=PGPASSWORD,
        sslmode=PGSSLMODE,
        cursor_factory=RealDictCursor
    )
    return conn

def json_response(body, status=200, headers=None):
    base_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
    }
    if headers:
        base_headers.update(headers)
    return (json.dumps(body, default=str), status, base_headers)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except Exception:
        return None

def require_auth(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    token = auth_header.replace('Bearer ', '')
    return verify_token(token)

def get_file_extension(filename):
    """Obtener extensión del archivo"""
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''

def get_mime_type(extension):
    """Obtener MIME type basado en extensión"""
    mime_types = {
        'pdf': 'application/pdf',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'txt': 'text/plain',
        'zip': 'application/zip'
    }
    return mime_types.get(extension, 'application/octet-stream')

# ===== SUBIR ARCHIVO =====
def subir_archivo(request):
    """Subir archivo a Cloud Storage y registrar en BD"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    # Verificar que Cloud Storage esté disponible
    if not storage_client:
        return json_response({"error": "Servicio de almacenamiento no disponible"}, 500)

    try:
        # Validar que se envió un archivo
        if not request.files or 'archivo' not in request.files:
            return json_response({"error": "No se envió ningún archivo"}, 400)

        # Obtener datos del formulario
        archivo = request.files['archivo']
        id_paciente = request.form.get('id_paciente')
        id_doctor = request.form.get('id_doctor')
        categoria = request.form.get('categoria', 'Otro')
        descripcion = request.form.get('descripcion', '')
        notas = request.form.get('notas', '')
        compartir_con_paciente = request.form.get('compartir_con_paciente', 'false').lower() == 'true'

        print(f"DEBUG - Subiendo archivo: {archivo.filename}, paciente: {id_paciente}, categoria: {categoria}")

        if not id_paciente:
            return json_response({"error": "id_paciente es requerido"}, 400)

        if not archivo.filename:
            return json_response({"error": "Archivo sin nombre"}, 400)

        # Generar nombre seguro y único
        nombre_original = secure_filename(archivo.filename)
        extension = get_file_extension(nombre_original)
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        nombre_storage = f"paciente_{id_paciente}/{timestamp}_{nombre_original}"

        # Subir a Cloud Storage
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(nombre_storage)
        
        # Configurar metadata
        blob.metadata = {
            'id_paciente': str(id_paciente),
            'categoria': categoria,
            'uploaded_by': str(payload.get('user_id'))
        }

        # Subir archivo
        archivo.seek(0, os.SEEK_END)
        tamano = archivo.tell()
        archivo.seek(0)
        
        blob.upload_from_file(archivo, content_type=get_mime_type(extension))
        
        # Hacer el archivo público para facilitar descargas
        try:
            blob.make_public()
            url_publica = blob.public_url
            print(f"DEBUG - Archivo público: {url_publica}")
        except Exception as public_error:
            print(f"ADVERTENCIA - No se pudo hacer público: {public_error}")
            url_publica = blob.public_url

        # Registrar en base de datos
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO archivos_paciente (
                id_paciente, id_doctor, id_usuario_subida,
                nombre_archivo, nombre_original, ruta_storage, url_publica,
                tipo_archivo, tamano_bytes, mime_type,
                categoria, descripcion, notas, compartir_con_paciente
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id_archivo
        """, (
            id_paciente, id_doctor, payload.get('user_id'),
            nombre_storage, nombre_original, nombre_storage, url_publica,
            extension, tamano, get_mime_type(extension),
            categoria, descripcion, notas, compartir_con_paciente
        ))

        id_archivo = cur.fetchone()['id_archivo']
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": f"Archivo '{nombre_original}' subido exitosamente",
            "id_archivo": id_archivo,
            "url_publica": url_publica,
            "tamano_bytes": tamano
        })

    except Exception as e:
        import traceback
        print(f"ERROR al subir archivo: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al subir archivo: {str(e)}"}, 500)

# ===== LISTAR ARCHIVOS DE UN PACIENTE =====
def listar_archivos(request):
    """Listar archivos de un paciente"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        id_paciente = request.args.get('id_paciente')
        categoria = request.args.get('categoria')
        
        if not id_paciente:
            return json_response({"error": "id_paciente es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Query base
        query = """
            SELECT 
                a.id_archivo, a.nombre_archivo, a.nombre_original,
                a.ruta_storage, a.url_publica, a.tipo_archivo,
                a.tamano_bytes, a.mime_type, a.categoria,
                a.descripcion, a.notas, a.compartir_con_paciente,
                a.fecha_subida, a.fecha_modificacion,
                d.nombres as doctor_nombres, d.apellidos as doctor_apellidos,
                u.nombre_usuario as subido_por
            FROM archivos_paciente a
            LEFT JOIN doctores d ON a.id_doctor = d.id_doctor
            LEFT JOIN usuarios u ON a.id_usuario_subida = u.id_usuario
            WHERE a.id_paciente = %s AND a.activo = TRUE
        """
        params = [id_paciente]

        if categoria:
            query += " AND a.categoria = %s"
            params.append(categoria)

        query += " ORDER BY a.fecha_subida DESC"

        cur.execute(query, params)
        rows = cur.fetchall()

        archivos = []
        total_bytes = 0
        
        for row in rows:
            total_bytes += row['tamano_bytes'] or 0
            archivos.append({
                "id": row['id_archivo'],
                "nombre": row['nombre_original'],
                "nombre_storage": row['nombre_archivo'],
                "url": row['url_publica'],
                "tipo": row['tipo_archivo'],
                "tamano": row['tamano_bytes'],
                "tamano_formateado": format_file_size(row['tamano_bytes']),
                "mime_type": row['mime_type'],
                "categoria": row['categoria'],
                "descripcion": row['descripcion'],
                "notas": row['notas'],
                "compartido": row['compartir_con_paciente'],
                "fecha": row['fecha_subida'],
                "doctor": f"{row['doctor_nombres']} {row['doctor_apellidos']}" if row['doctor_nombres'] else None,
                "subido_por": row['subido_por']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "archivos": archivos,
            "total_archivos": len(archivos),
            "espacio_usado": total_bytes,
            "espacio_usado_formateado": format_file_size(total_bytes)
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al listar archivos: {str(e)}"}, 500)

# ===== OBTENER CATEGORÍAS =====
def obtener_categorias(request):
    """Obtener catálogo de categorías"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT nombre, descripcion, icono, color
            FROM categorias_archivo
            WHERE activa = TRUE
            ORDER BY nombre
        """)

        categorias = []
        for row in cur.fetchall():
            categorias.append({
                "nombre": row['nombre'],
                "descripcion": row['descripcion'],
                "icono": row['icono'],
                "color": row['color']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "categorias": categorias
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener categorías: {str(e)}"}, 500)

# ===== ELIMINAR ARCHIVO =====
def eliminar_archivo(request):
    """Eliminar archivo (soft delete en BD y hard delete en Storage)"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        id_archivo = request.args.get('id_archivo')
        
        if not id_archivo:
            return json_response({"error": "id_archivo es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Obtener información del archivo
        cur.execute("""
            SELECT ruta_storage, nombre_original
            FROM archivos_paciente
            WHERE id_archivo = %s AND activo = TRUE
        """, (id_archivo,))

        archivo = cur.fetchone()
        
        if not archivo:
            return json_response({"error": "Archivo no encontrado"}, 404)

        # Soft delete en BD
        cur.execute("""
            UPDATE archivos_paciente
            SET activo = FALSE, fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_archivo = %s
        """, (id_archivo,))

        # Eliminar de Cloud Storage
        try:
            bucket = storage_client.bucket(BUCKET_NAME)
            blob = bucket.blob(archivo['ruta_storage'])
            if blob.exists():
                blob.delete()
        except Exception as storage_error:
            print(f"Error al eliminar de Storage: {storage_error}")
            # Continuar aunque falle el delete en storage

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": f"Archivo '{archivo['nombre_original']}' eliminado exitosamente"
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al eliminar archivo: {str(e)}"}, 500)

# ===== ACTUALIZAR METADATA =====
def actualizar_archivo(request):
    """Actualizar metadata del archivo"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        id_archivo = data.get('id_archivo')

        if not id_archivo:
            return json_response({"error": "id_archivo es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Construir query dinámicamente
        update_fields = []
        params = []

        campos_permitidos = {
            'categoria': 'categoria',
            'descripcion': 'descripcion',
            'notas': 'notas',
            'compartir_con_paciente': 'compartir_con_paciente'
        }

        for campo_db, campo_json in campos_permitidos.items():
            if campo_json in data:
                update_fields.append(f"{campo_db} = %s")
                params.append(data[campo_json])

        if not update_fields:
            return json_response({"error": "No hay campos para actualizar"}, 400)

        update_fields.append("fecha_modificacion = CURRENT_TIMESTAMP")
        params.append(id_archivo)

        query = f"""
            UPDATE archivos_paciente
            SET {', '.join(update_fields)}
            WHERE id_archivo = %s AND activo = TRUE
        """

        cur.execute(query, params)

        if cur.rowcount == 0:
            return json_response({"error": "Archivo no encontrado"}, 404)

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Archivo actualizado exitosamente"
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al actualizar archivo: {str(e)}"}, 500)

# ===== DESCARGAR ARCHIVO =====
def obtener_url_descarga(request):
    """Obtener URL firmada para descarga"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        id_archivo = request.args.get('id_archivo')
        
        if not id_archivo:
            return json_response({"error": "id_archivo es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT ruta_storage, nombre_original
            FROM archivos_paciente
            WHERE id_archivo = %s AND activo = TRUE
        """, (id_archivo,))

        archivo = cur.fetchone()
        
        if not archivo:
            return json_response({"error": "Archivo no encontrado"}, 404)

        # Intentar generar URL firmada, si falla usar URL pública
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(archivo['ruta_storage'])
        
        url_descarga = None
        metodo_descarga = "firmada"
        
        try:
            # Intentar generar URL firmada (válida por 1 hora)
            url_descarga = blob.generate_signed_url(
                version="v4",
                expiration=datetime.timedelta(hours=1),
                method="GET"
            )
        except Exception as sign_error:
            print(f"ADVERTENCIA - No se pudo generar URL firmada: {sign_error}")
            # Fallback: usar URL pública
            blob.make_public()
            url_descarga = blob.public_url
            metodo_descarga = "publica"

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "url_descarga": url_descarga,
            "nombre_archivo": archivo['nombre_original'],
            "expira_en": "1 hora" if metodo_descarga == "firmada" else "permanente",
            "metodo": metodo_descarga
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al generar URL de descarga: {str(e)}"}, 500)

def format_file_size(bytes):
    """Formatear tamaño de archivo"""
    if bytes is None:
        return "0 B"
    
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024.0:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024.0
    return f"{bytes:.2f} TB"

# ===== FUNCIÓN PRINCIPAL HTTP =====
@functions_framework.http
def hello_http(request):
    """
    API REST para gestión de archivos de pacientes
    """
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
    }

    if request.method == 'OPTIONS':
        return ('', 200, headers)

    try:
        action = (request.args.get('action') or '').lower()

        if request.method == 'GET':
            if action in ('list', 'listar'):
                return listar_archivos(request)
            elif action in ('categorias', 'categories'):
                return obtener_categorias(request)
            elif action in ('download', 'descargar'):
                return obtener_url_descarga(request)
            else:
                return json_response({"error": "Acción GET no válida. Use action=listar, categorias, o descargar"}, 400)

        elif request.method == 'POST':
            if action in ('upload', 'subir'):
                return subir_archivo(request)
            else:
                return json_response({"error": "Acción POST no válida. Use action=subir"}, 400)

        elif request.method == 'PUT':
            if action in ('update', 'actualizar'):
                return actualizar_archivo(request)
            else:
                return json_response({"error": "Acción PUT no válida. Use action=actualizar"}, 400)

        elif request.method == 'DELETE':
            if action in ('delete', 'eliminar'):
                return eliminar_archivo(request)
            else:
                return json_response({"error": "Acción DELETE no válida. Use action=eliminar"}, 400)

        else:
            return json_response({"error": "Método no soportado"}, 405)

    except Exception as e:
        return json_response({"error": f"Error interno: {str(e)}"}, 500)
