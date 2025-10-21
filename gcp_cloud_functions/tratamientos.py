import functions_framework
import psycopg2
import json
import jwt
import datetime
from psycopg2.extras import RealDictCursor

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

def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def json_response(body, status=200, headers=None):
    base_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
    }
    if headers:
        base_headers.update(headers)
    return (json.dumps(body), status, base_headers)

def handle_list_tratamientos(request):
    """Listar tratamientos/servicios"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        search = request.args.get('search', '').strip()

        offset = (page - 1) * limit

        conn = get_connection()
        cur = conn.cursor()

        # Construir query base
        base_query = """
            SELECT id_tratamiento, nombre_tratamiento, descripcion, costo_base
            FROM tratamientos
            WHERE 1=1
        """
        
        params = []
        if search:
            base_query += " AND nombre_tratamiento ILIKE %s"
            params.append(f"%{search}%")

        # Contar total
        count_query = f"SELECT COUNT(*) as total FROM ({base_query}) as sub"
        cur.execute(count_query, params)
        total = cur.fetchone()['total']

        # Obtener registros paginados
        base_query += " ORDER BY nombre_tratamiento ASC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        cur.execute(base_query, params)
        rows = cur.fetchall()

        tratamientos = []
        for r in rows:
            tratamientos.append({
                "id": r['id_tratamiento'],
                "nombre": r['nombre_tratamiento'],
                "descripcion": r['descripcion'],
                "costo_base": float(r['costo_base']) if r['costo_base'] else 0
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "tratamientos": tratamientos,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        })
    except Exception as e:
        try:
            conn.close()
        except:
            pass
        return json_response({"error": f"Error al listar tratamientos: {str(e)}"}, 500)

def handle_create_tratamiento(request):
    """Crear un nuevo tratamiento/servicio"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        nombre = (data.get('nombre_tratamiento') or '').strip()
        descripcion = (data.get('descripcion') or '').strip()
        costo_base = data.get('costo_base', 0)

        if not nombre:
            return json_response({"error": "El nombre del tratamiento es requerido"}, 400)

        if not costo_base or float(costo_base) <= 0:
            return json_response({"error": "El costo base debe ser mayor a 0"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Verificar si ya existe
        cur.execute("SELECT id_tratamiento FROM tratamientos WHERE nombre_tratamiento = %s", (nombre,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return json_response({"error": "Ya existe un tratamiento con ese nombre"}, 400)

        # Insertar tratamiento
        cur.execute("""
            INSERT INTO tratamientos (nombre_tratamiento, descripcion, costo_base)
            VALUES (%s, %s, %s)
            RETURNING id_tratamiento
        """, (nombre, descripcion, float(costo_base)))

        tratamiento_id = cur.fetchone()['id_tratamiento']

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Tratamiento creado exitosamente",
            "id_tratamiento": tratamiento_id
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except:
            pass
        return json_response({"error": f"Error al crear tratamiento: {str(e)}"}, 500)

def handle_update_tratamiento(request):
    """Actualizar un tratamiento/servicio"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        tratamiento_id = data.get('id_tratamiento')
        nombre = (data.get('nombre_tratamiento') or '').strip()
        descripcion = (data.get('descripcion') or '').strip()
        costo_base = data.get('costo_base')

        if not tratamiento_id:
            return json_response({"error": "ID de tratamiento requerido"}, 400)

        if not nombre:
            return json_response({"error": "El nombre del tratamiento es requerido"}, 400)

        if not costo_base or float(costo_base) <= 0:
            return json_response({"error": "El costo base debe ser mayor a 0"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Verificar que el tratamiento existe
        cur.execute("SELECT id_tratamiento FROM tratamientos WHERE id_tratamiento = %s", (tratamiento_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return json_response({"error": "Tratamiento no encontrado"}, 404)

        # Verificar si ya existe otro con el mismo nombre
        cur.execute(
            "SELECT id_tratamiento FROM tratamientos WHERE nombre_tratamiento = %s AND id_tratamiento != %s",
            (nombre, tratamiento_id)
        )
        if cur.fetchone():
            cur.close()
            conn.close()
            return json_response({"error": "Ya existe otro tratamiento con ese nombre"}, 400)

        # Actualizar tratamiento
        cur.execute("""
            UPDATE tratamientos 
            SET nombre_tratamiento = %s, descripcion = %s, costo_base = %s
            WHERE id_tratamiento = %s
        """, (nombre, descripcion, float(costo_base), tratamiento_id))

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Tratamiento actualizado exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except:
            pass
        return json_response({"error": f"Error al actualizar tratamiento: {str(e)}"}, 500)

def handle_delete_tratamiento(request):
    """Eliminar un tratamiento/servicio"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        tratamiento_id = request.args.get('id')
        if not tratamiento_id:
            return json_response({"error": "ID de tratamiento requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Verificar que el tratamiento existe
        cur.execute("SELECT id_tratamiento FROM tratamientos WHERE id_tratamiento = %s", (tratamiento_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return json_response({"error": "Tratamiento no encontrado"}, 404)

        # Verificar si está siendo usado en presupuestos o historial
        cur.execute("""
            SELECT COUNT(*) as count FROM presupuesto_items WHERE id_tratamiento = %s
        """, (tratamiento_id,))
        count_presupuestos = cur.fetchone()['count']

        cur.execute("""
            SELECT COUNT(*) as count FROM historial_tratamientos WHERE id_tratamiento = %s
        """, (tratamiento_id,))
        count_historial = cur.fetchone()['count']

        if count_presupuestos > 0 or count_historial > 0:
            cur.close()
            conn.close()
            return json_response({
                "error": "No se puede eliminar el tratamiento porque está siendo usado en presupuestos o historiales clínicos"
            }, 400)

        # Eliminar tratamiento
        cur.execute("DELETE FROM tratamientos WHERE id_tratamiento = %s", (tratamiento_id,))

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Tratamiento eliminado exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except:
            pass
        return json_response({"error": f"Error al eliminar tratamiento: {str(e)}"}, 500)

@functions_framework.http
def tratamientos(request):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
    }

    if request.method == 'OPTIONS':
        return ('', 200, headers)

    try:
        action = (request.args.get('action') or '').strip().lower()

        if request.method == 'GET':
            if action in ('list', 'tratamientos'):
                return handle_list_tratamientos(request)
            else:
                return json_response({"error": "Acción GET no válida. Use action=list"}, 400)

        if request.method == 'POST':
            if action in ('create', 'crear'):
                return handle_create_tratamiento(request)
            else:
                return json_response({"error": "Acción POST no válida. Use action=create"}, 400)

        if request.method == 'PUT':
            if action in ('update', 'actualizar'):
                return handle_update_tratamiento(request)
            else:
                return json_response({"error": "Acción PUT no válida. Use action=update"}, 400)

        if request.method == 'DELETE':
            if action in ('delete', 'eliminar'):
                return handle_delete_tratamiento(request)
            else:
                return json_response({"error": "Acción DELETE no válida. Use action=delete"}, 400)

        return json_response({"error": "Método no soportado"}, 405)
    except Exception as e:
        return json_response({"error": f"Error interno: {str(e)}"}, 500)

