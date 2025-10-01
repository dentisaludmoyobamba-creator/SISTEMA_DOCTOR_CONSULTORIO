import functions_framework
import psycopg2
import json
import datetime
import jwt
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

def json_response(body, status=200, headers=None):
    base_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
    }
    if headers:
        base_headers.update(headers)
    return (json.dumps(body), status, base_headers)

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

# ===== OBTENER CITAS =====
def obtener_citas(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        conn = get_connection()
        cur = conn.cursor()

        # Parámetros de filtrado
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        id_doctor = request.args.get('id_doctor')
        estado = request.args.get('estado')
        search = request.args.get('search', '')

        # Query base
        base_query = """
            SELECT c.id_cita, c.fecha_hora, c.motivo_consulta, c.estado, c.notas_recepcion,
                   c.duracion_minutos,
                   p.id_paciente, p.nombres as paciente_nombres, p.apellidos as paciente_apellidos, 
                   p.telefono as paciente_telefono,
                   d.id_doctor, d.nombres as doctor_nombres, d.apellidos as doctor_apellidos
            FROM citas_medicas c
            LEFT JOIN pacientes p ON c.id_paciente = p.id_paciente
            LEFT JOIN doctores d ON c.id_doctor = d.id_doctor
            WHERE 1=1
        """
        params = []

        # Filtros
        if fecha_inicio and fecha_fin:
            base_query += " AND c.fecha_hora::date BETWEEN %s AND %s"
            params.extend([fecha_inicio, fecha_fin])
        elif fecha_inicio:
            base_query += " AND c.fecha_hora::date >= %s"
            params.append(fecha_inicio)
        elif fecha_fin:
            base_query += " AND c.fecha_hora::date <= %s"
            params.append(fecha_fin)

        if id_doctor:
            base_query += " AND c.id_doctor = %s"
            params.append(id_doctor)

        if estado and estado != 'todos':
            base_query += " AND c.estado = %s"
            params.append(estado)

        if search:
            base_query += " AND (p.nombres ILIKE %s OR p.apellidos ILIKE %s OR c.motivo_consulta ILIKE %s)"
            like_term = f'%{search}%'
            params.extend([like_term, like_term, like_term])

        base_query += " ORDER BY c.fecha_hora ASC"

        cur.execute(base_query, params)
        rows = cur.fetchall()

        citas = []
        for row in rows:
            citas.append({
                "id": row['id_cita'],
                "paciente": f"{row['paciente_nombres']} {row['paciente_apellidos']}" if row['paciente_nombres'] else None,
                "paciente_id": row['id_paciente'],
                "doctor": f"{row['doctor_nombres']} {row['doctor_apellidos']}" if row['doctor_nombres'] else None,
                "doctor_id": row['id_doctor'],
                "fecha_hora": row['fecha_hora'].isoformat() if row['fecha_hora'] else None,
                "fecha": row['fecha_hora'].date().isoformat() if row['fecha_hora'] else None,
                "hora": row['fecha_hora'].time().strftime('%H:%M') if row['fecha_hora'] else None,
                "duracion": row['duracion_minutos'] or 60,
                "motivo": row['motivo_consulta'],
                "estado": row['estado'],
                "telefono": row['paciente_telefono'],
                "notas": row['notas_recepcion']
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

# ===== CREAR CITA =====
def crear_cita(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        
        id_paciente = data.get('id_paciente')
        id_doctor = data.get('id_doctor')
        fecha_hora = data.get('fecha_hora')
        motivo_consulta = data.get('motivo', '')
        estado = data.get('estado', 'Programada')
        duracion_minutos = int(data.get('duracion', 60))
        notas_recepcion = data.get('notas', '')

        if not all([id_paciente, id_doctor, fecha_hora]):
            return json_response({"error": "Paciente, doctor y fecha_hora son requeridos"}, 400)

        # Convertir fecha_hora string a datetime
        try:
            fecha_hora_dt = datetime.datetime.fromisoformat(fecha_hora.replace('Z', '+00:00'))
        except Exception:
            return json_response({"error": "Formato de fecha_hora inválido. Use ISO format"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Verificar disponibilidad del doctor
        check_query = """
            SELECT COUNT(*) as conflictos
            FROM citas_medicas
            WHERE id_doctor = %s
            AND estado NOT IN ('Cancelada')
            AND fecha_hora <= %s
            AND fecha_hora + INTERVAL '1 minute' * COALESCE(duracion_minutos, 60) > %s
        """
        cur.execute(check_query, (id_doctor, fecha_hora_dt, fecha_hora_dt))
        conflictos = cur.fetchone()['conflictos']

        if conflictos > 0:
            return json_response({"error": "El doctor no está disponible en ese horario"}, 409)

        # Crear la cita
        insert_query = """
            INSERT INTO citas_medicas (id_paciente, id_doctor, fecha_hora, motivo_consulta, 
                                     estado, duracion_minutos, notas_recepcion)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id_cita
        """
        cur.execute(insert_query, (id_paciente, id_doctor, fecha_hora_dt, motivo_consulta, 
                                 estado, duracion_minutos, notas_recepcion))
        
        cita_id = cur.fetchone()['id_cita']
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Cita creada exitosamente",
            "cita_id": cita_id
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear cita: {str(e)}"}, 500)

# ===== ACTUALIZAR CITA =====
def actualizar_cita(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        cita_id = data.get('id')

        if not cita_id:
            return json_response({"error": "ID de cita es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Construir query de actualización dinámicamente
        update_fields = []
        params = []

        if 'id_paciente' in data:
            update_fields.append("id_paciente = %s")
            params.append(data['id_paciente'])

        if 'id_doctor' in data:
            update_fields.append("id_doctor = %s")
            params.append(data['id_doctor'])

        if 'fecha_hora' in data:
            try:
                fecha_hora_dt = datetime.datetime.fromisoformat(data['fecha_hora'].replace('Z', '+00:00'))
                update_fields.append("fecha_hora = %s")
                params.append(fecha_hora_dt)
            except Exception:
                return json_response({"error": "Formato de fecha_hora inválido"}, 400)

        if 'motivo' in data:
            update_fields.append("motivo_consulta = %s")
            params.append(data['motivo'])

        if 'estado' in data:
            update_fields.append("estado = %s")
            params.append(data['estado'])

        if 'duracion' in data:
            update_fields.append("duracion_minutos = %s")
            params.append(int(data['duracion']))

        if 'notas' in data:
            update_fields.append("notas_recepcion = %s")
            params.append(data['notas'])

        if not update_fields:
            return json_response({"error": "No hay campos para actualizar"}, 400)

        params.append(cita_id)
        update_query = f"""
            UPDATE citas_medicas 
            SET {', '.join(update_fields)}
            WHERE id_cita = %s
        """

        cur.execute(update_query, params)
        
        if cur.rowcount == 0:
            return json_response({"error": "Cita no encontrada"}, 404)

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Cita actualizada exitosamente"
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al actualizar cita: {str(e)}"}, 500)

# ===== ELIMINAR CITA =====
def eliminar_cita(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        cita_id = request.args.get('id')
        if not cita_id:
            return json_response({"error": "ID de cita es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Eliminar la cita
        cur.execute("DELETE FROM citas_medicas WHERE id_cita = %s", (cita_id,))
        
        if cur.rowcount == 0:
            return json_response({"error": "Cita no encontrada"}, 404)

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Cita eliminada exitosamente"
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al eliminar cita: {str(e)}"}, 500)

# ===== OBTENER DOCTORES =====
def obtener_doctores(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT d.id_doctor, d.nombres, d.apellidos, d.dni, d.colegiatura, d.telefono
            FROM doctores d
            ORDER BY d.nombres, d.apellidos
        """)
        rows = cur.fetchall()

        doctores = []
        for row in rows:
            doctores.append({
                "id": row['id_doctor'],
                "nombre": f"{row['nombres']} {row['apellidos']}",
                "nombres": row['nombres'],
                "apellidos": row['apellidos'],
                "dni": row['dni'],
                "colegiatura": row['colegiatura'],
                "telefono": row['telefono']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "doctores": doctores
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener doctores: {str(e)}"}, 500)

# ===== OBTENER PACIENTES PARA BÚSQUEDA =====
def buscar_pacientes(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        search = request.args.get('search', '').strip()
        limit = int(request.args.get('limit', 10))

        if not search:
            return json_response({"success": True, "pacientes": []})

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT id_paciente, nombres, apellidos, dni, telefono
            FROM pacientes
            WHERE (nombres ILIKE %s OR apellidos ILIKE %s OR dni ILIKE %s)
            AND estado_paciente = 'activo'
            ORDER BY nombres, apellidos
            LIMIT %s
        """, (f'%{search}%', f'%{search}%', f'%{search}%', limit))
        
        rows = cur.fetchall()

        pacientes = []
        for row in rows:
            pacientes.append({
                "id": row['id_paciente'],
                "nombre": f"{row['nombres']} {row['apellidos']}",
                "nombres": row['nombres'],
                "apellidos": row['apellidos'],
                "dni": row['dni'],
                "telefono": row['telefono']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "pacientes": pacientes
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al buscar pacientes: {str(e)}"}, 500)

@functions_framework.http
def hello_http(request):
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
            if action in ('list', 'citas'):
                return obtener_citas(request)
            elif action in ('doctores', 'doctors'):
                return obtener_doctores(request)
            elif action in ('pacientes', 'patients', 'search_patients'):
                return buscar_pacientes(request)
            else:
                return json_response({"error": "Acción GET no válida. Use action=list, doctores o pacientes"}, 400)

        elif request.method == 'POST':
            if action in ('create', 'crear'):
                return crear_cita(request)
            else:
                return json_response({"error": "Acción POST no válida. Use action=create"}, 400)

        elif request.method == 'PUT':
            if action in ('update', 'actualizar'):
                return actualizar_cita(request)
            else:
                return json_response({"error": "Acción PUT no válida. Use action=update"}, 400)

        elif request.method == 'DELETE':
            if action in ('delete', 'eliminar'):
                return eliminar_cita(request)
            else:
                return json_response({"error": "Acción DELETE no válida. Use action=delete"}, 400)

        else:
            return json_response({"error": "Método no soportado"}, 405)

    except Exception as e:
        return json_response({"error": f"Error interno: {str(e)}"}, 500)
