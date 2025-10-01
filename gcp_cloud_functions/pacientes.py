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
            "p.fecha_registro, p.estado_paciente, p.presupuesto, p.comentario, p.tarea, "
            "fc.nombre as fuente_captacion, a.nombre as aseguradora, "
            "p.ultima_cita, p.proxima_cita "
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
                "ultima_cita": r['ultima_cita'].isoformat() if r['ultima_cita'] else None,
                "proxima_cita": r['proxima_cita'].isoformat() if r['proxima_cita'] else None,
                "tarea": r['tarea'],
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

def handle_get_patient_citas(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        patient_id = request.args.get('patient_id')
        if not patient_id:
            return json_response({"error": "ID de paciente requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Obtener citas del paciente
        citas_query = """
            SELECT c.id_cita, c.fecha_hora, c.motivo_consulta, c.estado, c.notas_recepcion,
                   d.nombres as doctor_nombres, d.apellidos as doctor_apellidos
            FROM citas_medicas c
            LEFT JOIN doctores d ON c.id_doctor = d.id_doctor
            WHERE c.id_paciente = %s
            ORDER BY c.fecha_hora DESC
        """
        
        cur.execute(citas_query, (patient_id,))
        citas_rows = cur.fetchall()

        citas = []
        for c in citas_rows:
            citas.append({
                "id": c['id_cita'],
                "fecha_hora": c['fecha_hora'].isoformat() if c['fecha_hora'] else None,
                "motivo": c['motivo_consulta'],
                "estado": c['estado'],
                "doctor": f"{c['doctor_nombres']} {c['doctor_apellidos']}" if c['doctor_nombres'] else None,
                "comentario": c['notas_recepcion']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "citas": citas
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener citas: {str(e)}"}, 500)

def handle_get_patient_filiacion(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        patient_id = request.args.get('patient_id')
        if not patient_id:
            return json_response({"error": "ID de paciente requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Obtener información completa del paciente
        filiacion_query = """
            SELECT p.id_paciente, p.nombres, p.apellidos, p.dni, p.telefono, p.email, 
                   p.fecha_nacimiento, p.genero, p.direccion, p.fecha_registro,
                   p.id_fuente_captacion, p.id_aseguradora, p.id_linea_negocio,
                   p.presupuesto, p.ultima_cita, p.proxima_cita, p.tarea, p.comentario,
                   p.estado_paciente, p.avatar, p.etiqueta, p.etiqueta_color,
                   fc.nombre as fuente_captacion, a.nombre as aseguradora, ln.nombre as linea_negocio
            FROM pacientes p
            LEFT JOIN fuente_captacion fc ON p.id_fuente_captacion = fc.id
            LEFT JOIN aseguradora a ON p.id_aseguradora = a.id
            LEFT JOIN linea_negocio ln ON p.id_linea_negocio = ln.id
            WHERE p.id_paciente = %s
        """
        
        cur.execute(filiacion_query, (patient_id,))
        paciente_row = cur.fetchone()

        if not paciente_row:
            return json_response({"error": "Paciente no encontrado"}, 404)

        # Calcular edad
        edad = None
        if paciente_row['fecha_nacimiento']:
            hoy = datetime.date.today()
            edad = hoy.year - paciente_row['fecha_nacimiento'].year
            if hoy.month < paciente_row['fecha_nacimiento'].month or (hoy.month == paciente_row['fecha_nacimiento'].month and hoy.day < paciente_row['fecha_nacimiento'].day):
                edad -= 1

        filiacion = {
            "id": paciente_row['id_paciente'],
            "nombres": paciente_row['nombres'],
            "apellidos": paciente_row['apellidos'],
            "dni": paciente_row['dni'],
            "telefono": paciente_row['telefono'],
            "email": paciente_row['email'],
            "fecha_nacimiento": paciente_row['fecha_nacimiento'].isoformat() if paciente_row['fecha_nacimiento'] else None,
            "edad": edad,
            "genero": paciente_row['genero'],
            "direccion": paciente_row['direccion'],
            "fecha_registro": paciente_row['fecha_registro'].isoformat() if paciente_row['fecha_registro'] else None,
            "fuente_captacion": paciente_row['fuente_captacion'],
            "aseguradora": paciente_row['aseguradora'],
            "linea_negocio": paciente_row['linea_negocio'],
            "presupuesto": float(paciente_row['presupuesto']) if paciente_row['presupuesto'] is not None else 0,
            "ultima_cita": paciente_row['ultima_cita'].isoformat() if paciente_row['ultima_cita'] else None,
            "proxima_cita": paciente_row['proxima_cita'].isoformat() if paciente_row['proxima_cita'] else None,
            "tarea": paciente_row['tarea'],
            "comentario": paciente_row['comentario'],
            "estado_paciente": paciente_row['estado_paciente'],
            "avatar": paciente_row['avatar'],
            "etiqueta": paciente_row['etiqueta'],
            "etiqueta_color": paciente_row['etiqueta_color']
        }

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "filiacion": filiacion
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener filiación: {str(e)}"}, 500)

def handle_update_patient_filiacion(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        patient_id = data.get('id')
        
        if not patient_id:
            return json_response({"error": "ID de paciente requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Construir query de actualización dinámicamente
        update_fields = []
        params = []

        # Campos que se pueden actualizar
        campos_actualizables = {
            'telefono': 'telefono',
            'email': 'email',
            'direccion': 'direccion',
            'fuente_captacion': 'id_fuente_captacion',
            'aseguradora': 'id_aseguradora',
            'linea_negocio': 'id_linea_negocio',
            'comentario': 'comentario',
            'tarea': 'tarea',
            'presupuesto': 'presupuesto'
        }

        for campo_frontend, campo_db in campos_actualizables.items():
            if campo_frontend in data:
                if campo_frontend in ['fuente_captacion', 'aseguradora', 'linea_negocio']:
                    # Resolver IDs para campos de lookup
                    valor = data[campo_frontend]
                    if valor:
                        tabla = campo_frontend.replace('_', '_')
                        id_valor = resolve_lookup_id(cur, tabla, valor)
                        update_fields.append(f"{campo_db} = %s")
                        params.append(id_valor)
                    else:
                        update_fields.append(f"{campo_db} = NULL")
                else:
                    update_fields.append(f"{campo_db} = %s")
                    params.append(data[campo_frontend])

        if not update_fields:
            return json_response({"error": "No hay campos para actualizar"}, 400)

        params.append(patient_id)
        update_query = f"""
            UPDATE pacientes 
            SET {', '.join(update_fields)}
            WHERE id_paciente = %s
        """

        cur.execute(update_query, params)
        
        if cur.rowcount == 0:
            return json_response({"error": "Paciente no encontrado"}, 404)

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Filiación actualizada exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al actualizar filiación: {str(e)}"}, 500)

def resolve_lookup_id(cursor, tabla, nombre):
    """Resuelve el ID de una tabla de lookup por nombre"""
    try:
        if tabla == 'fuente_captacion':
            cursor.execute("SELECT id FROM fuente_captacion WHERE nombre = %s", (nombre,))
        elif tabla == 'aseguradora':
            cursor.execute("SELECT id FROM aseguradora WHERE nombre = %s", (nombre,))
        elif tabla == 'linea_negocio':
            cursor.execute("SELECT id FROM linea_negocio WHERE nombre = %s", (nombre,))
        
        result = cursor.fetchone()
        return result['id'] if result else None
    except Exception:
        return None

def handle_get_patient_tareas(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        patient_id = request.args.get('patient_id')
        if not patient_id:
            return json_response({"error": "ID de paciente requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Obtener tareas manuales (simuladas por ahora)
        tareas_manuales = [
            {
                "id": 1,
                "nombre": "Seguimiento post-operatorio",
                "fecha_creacion": "2024-12-20",
                "estado": "Pendiente",
                "responsable": "Dr. Gómez",
                "descripcion": "Llamar al paciente para verificar su recuperación"
            },
            {
                "id": 2,
                "nombre": "Recordatorio de cita",
                "fecha_creacion": "2024-12-18",
                "estado": "Completada",
                "responsable": "Recepcionista",
                "descripcion": "Enviar recordatorio de cita programada"
            }
        ]

        # Obtener tareas automáticas (simuladas por ahora)
        tareas_automaticas = [
            {
                "id": 1,
                "tipo_mensaje": "Recordatorio de cita",
                "plantilla": "Recordatorio_Cita_24h",
                "enviado_por": "Sistema",
                "fecha_envio": "2024-12-19",
                "hora_envio": "09:00",
                "estado": "Enviado"
            },
            {
                "id": 2,
                "tipo_mensaje": "Seguimiento post-tratamiento",
                "plantilla": "Seguimiento_Endodoncia",
                "enviado_por": "Sistema",
                "fecha_envio": "2024-12-17",
                "hora_envio": "14:30",
                "estado": "Enviado"
            }
        ]

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "tareas_manuales": tareas_manuales,
            "tareas_automaticas": tareas_automaticas
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener tareas: {str(e)}"}, 500)

def handle_get_lookup_options(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        conn = get_connection()
        cur = conn.cursor()

        # Obtener fuentes de captación
        cur.execute("SELECT id, nombre FROM fuente_captacion WHERE estado = '1' OR estado IS NULL ORDER BY nombre")
        fuentes_captacion = [{"id": row['id'], "nombre": row['nombre']} for row in cur.fetchall()]

        # Obtener aseguradoras
        cur.execute("SELECT id, nombre FROM aseguradora WHERE estado = '1' OR estado IS NULL ORDER BY nombre")
        aseguradoras = [{"id": row['id'], "nombre": row['nombre']} for row in cur.fetchall()]

        # Obtener líneas de negocio
        cur.execute("SELECT id, nombre FROM linea_negocio WHERE estado = '1' OR estado IS NULL ORDER BY nombre")
        lineas_negocio = [{"id": row['id'], "nombre": row['nombre']} for row in cur.fetchall()]

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "fuentes_captacion": fuentes_captacion,
            "aseguradoras": aseguradoras,
            "lineas_negocio": lineas_negocio
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener opciones: {str(e)}"}, 500)

@functions_framework.http
def hello_http(request):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
    }

    if request.method == 'OPTIONS':
        return ('', 200, headers)

    try:
        action = (request.args.get('action') or '').strip().lower()

        if request.method == 'GET':
            if action in ('list', 'patients', 'pacientes'):
                return handle_list_pacientes(request)
            elif action in ('citas', 'appointments'):
                return handle_get_patient_citas(request)
            elif action in ('filiacion', 'filiation'):
                return handle_get_patient_filiacion(request)
            elif action in ('tareas', 'tasks'):
                return handle_get_patient_tareas(request)
            elif action in ('lookup_options', 'opciones'):
                return handle_get_lookup_options(request)
            else:
                return json_response({"error": "Acción GET no válida. Use action=list, citas, filiacion, tareas o lookup_options"}, 400)

        if request.method == 'POST':
            if action in ('create', 'crear'):
                return handle_create_paciente(request)
            else:
                return json_response({"error": "Acción POST no válida. Use action=create"}, 400)

        if request.method == 'PUT':
            if action in ('update_filiacion', 'actualizar_filiacion'):
                return handle_update_patient_filiacion(request)
            else:
                return json_response({"error": "Acción PUT no válida. Use action=update_filiacion"}, 400)

        return json_response({"error": "Método no soportado"}, 405)
    except Exception as e:
        return json_response({"error": f"Error interno: {str(e)}"}, 500)
