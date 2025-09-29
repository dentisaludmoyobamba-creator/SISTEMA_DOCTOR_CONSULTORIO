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
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
    }
    if headers:
        base_headers.update(headers)
    return (json.dumps(body), status, base_headers)

def handle_list_pacientes(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    search = request.args.get('search', '').strip()

    offset = (page - 1) * limit

    try:
        conn = get_connection()
        cur = conn.cursor()

        base_query = (
            "SELECT p.id_paciente, p.nombres, p.apellidos, p.dni, p.telefono, p.email, "
            "p.fecha_registro, p.estado_paciente, p.presupuesto, p.comentario, "
            "fc.nombre as fuente_captacion, a.nombre as aseguradora "
            "FROM pacientes p "
            "LEFT JOIN fuente_captacion fc ON p.id_fuente_captacion = fc.id "
            "LEFT JOIN aseguradora a ON p.id_aseguradora = a.id "
            "WHERE 1=1 "
        )

        params = []
        if search:
            base_query += "AND (p.nombres ILIKE %s OR p.apellidos ILIKE %s OR p.dni ILIKE %s OR p.email ILIKE %s) "
            like = f"%{search}%"
            params.extend([like, like, like, like])

        count_query = f"SELECT COUNT(*) as total FROM ({base_query}) as sub"
        cur.execute(count_query, params)
        total = cur.fetchone()['total']

        base_query += "ORDER BY p.fecha_registro DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        cur.execute(base_query, params)
        rows = cur.fetchall()

        pacientes = []
        for r in rows:
            pacientes.append({
                "id": r['id_paciente'],
                "nombres": r['nombres'],
                "apellidos": r['apellidos'],
                "documento": r['dni'],
                "telefono": r['telefono'],
                "email": r['email'],
                "estado": r['estado_paciente'],
                "presupuesto": float(r['presupuesto']) if r['presupuesto'] is not None else 0,
                "fuente_captacion": r['fuente_captacion'],
                "aseguradora": r['aseguradora'],
                "fecha_registro": r['fecha_registro'].isoformat() if r['fecha_registro'] else None,
                # Estos campos no están aún calculados en backend
                "ultima_cita": None,
                "proxima_cita": None,
                "comentario": r['comentario']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "patients": pacientes,
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
        except Exception:
            pass
        return json_response({"error": f"Error al listar pacientes: {str(e)}"}, 500)

def resolve_lookup_id(cur, table, name):
    if not name:
        return None
    sel = f"SELECT id FROM {table} WHERE nombre = %s"
    cur.execute(sel, (name,))
    row = cur.fetchone()
    if row:
        return row['id']
    ins = f"INSERT INTO {table} (nombre) VALUES (%s) RETURNING id"
    cur.execute(ins, (name,))
    return cur.fetchone()['id']

def handle_create_paciente(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        nombres = (data.get('nombres') or '').strip()
        apellidos = (data.get('apellidos') or '').strip()
        documento = (data.get('documento') or '').strip() or None
        telefono = (data.get('telefono') or '').strip() or None
        email = (data.get('email') or '').strip() or None
        nacimiento = (data.get('nacimiento') or '').strip() or None
        fuente = (data.get('fuente') or '').strip() or None
        aseguradora = (data.get('aseguradora') or '').strip() or None
        genero_txt = (data.get('genero') or '').strip()  # 'Hombre' | 'Mujer' | 'Otro'

        if not nombres or not apellidos:
            return json_response({"error": "Nombres y apellidos son requeridos"}, 400)

        genero = None
        if genero_txt:
            genero = 'M' if genero_txt.lower().startswith('h') else ('F' if genero_txt.lower().startswith('m') else 'O')

        conn = get_connection()
        cur = conn.cursor()

        id_fuente = resolve_lookup_id(cur, 'fuente_captacion', fuente) if fuente else None
        id_aseguradora = resolve_lookup_id(cur, 'aseguradora', aseguradora) if aseguradora else None

        insert_sql = (
            "INSERT INTO pacientes (nombres, apellidos, fecha_nacimiento, genero, dni, telefono, email, "
            "id_fuente_captacion, id_aseguradora) "
            "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id_paciente"
        )

        fecha_nac = None
        if nacimiento:
            try:
                fecha_nac = datetime.datetime.strptime(nacimiento, '%Y-%m-%d').date()
            except Exception:
                fecha_nac = None

        cur.execute(insert_sql, (
            nombres,
            apellidos,
            fecha_nac,
            genero,
            documento,
            telefono,
            email,
            id_fuente,
            id_aseguradora
        ))

        new_id = cur.fetchone()['id_paciente']
        conn.commit()
        cur.close()
        conn.close()

        return json_response({"success": True, "message": "Paciente creado", "patient_id": new_id})
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear paciente: {str(e)}"}, 500)

@functions_framework.http
def hello_http(request):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
    }

    if request.method == 'OPTIONS':
        return ('', 200, headers)

    try:
        action = (request.args.get('action') or '').strip().lower()

        if request.method == 'GET':
            if action in ('list', 'patients', 'pacientes'):
                return handle_list_pacientes(request)
            else:
                return json_response({"error": "Acción GET no válida. Use action=list"}, 400)

        if request.method == 'POST':
            if action in ('create', 'crear'):
                return handle_create_paciente(request)
            else:
                return json_response({"error": "Acción POST no válida. Use action=create"}, 400)

        return json_response({"error": "Método no soportado"}, 405)
    except Exception as e:
        return json_response({"error": f"Error interno: {str(e)}"}, 500)
