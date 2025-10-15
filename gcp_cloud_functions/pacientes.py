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
            "p.ultima_cita, p.proxima_cita, p.foto_perfil_url "
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
            # Obtener etiquetas del paciente
            cur.execute("""
                SELECT e.id_etiqueta, e.nombre, e.color
                FROM paciente_etiquetas pe
                JOIN etiquetas_paciente e ON pe.id_etiqueta = e.id_etiqueta
                WHERE pe.id_paciente = %s AND e.activa = true
                ORDER BY e.nombre
            """, (r['id_paciente'],))
            etiquetas = [{"id": row['id_etiqueta'], "nombre": row['nombre'], "color": row['color']} for row in cur.fetchall()]
            
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
                "comentario": r['comentario'],
                "etiquetas": etiquetas,
                "foto_perfil_url": r['foto_perfil_url']
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
        linea_negocio = (data.get('linea_negocio') or '').strip() or None
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
        id_linea_negocio = resolve_lookup_id(cur, 'linea_negocio', linea_negocio) if linea_negocio else None

        insert_sql = (
            "INSERT INTO pacientes (nombres, apellidos, fecha_nacimiento, genero, dni, telefono, email, "
            "id_fuente_captacion, id_aseguradora, id_linea_negocio) "
            "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id_paciente"
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
            id_aseguradora,
            id_linea_negocio
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
        # Buscar por nombre
        if tabla == 'fuente_captacion':
            cursor.execute("SELECT id FROM fuente_captacion WHERE nombre = %s", (nombre,))
        elif tabla == 'aseguradora':
            cursor.execute("SELECT id FROM aseguradora WHERE nombre = %s", (nombre,))
        elif tabla == 'linea_negocio':
            cursor.execute("SELECT id FROM linea_negocio WHERE nombre = %s", (nombre,))

        result = cursor.fetchone()
        if result and 'id' in result:
            return result['id']

        # Si no existe, crear y devolver el ID
        if tabla == 'fuente_captacion':
            cursor.execute("INSERT INTO fuente_captacion (nombre) VALUES (%s) RETURNING id", (nombre,))
        elif tabla == 'aseguradora':
            cursor.execute("INSERT INTO aseguradora (nombre) VALUES (%s) RETURNING id", (nombre,))
        elif tabla == 'linea_negocio':
            cursor.execute("INSERT INTO linea_negocio (nombre) VALUES (%s) RETURNING id", (nombre,))

        nuevo = cursor.fetchone()
        return nuevo['id'] if nuevo else None
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

def handle_get_patient_notas_alergias(request):
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

        # Obtener notas y alergias del paciente
        notas_alergias_query = """
            SELECT p.id_paciente, p.notas, p.alergias
            FROM pacientes p
            WHERE p.id_paciente = %s
        """
        
        cur.execute(notas_alergias_query, (patient_id,))
        paciente_row = cur.fetchone()

        if not paciente_row:
            return json_response({"error": "Paciente no encontrado"}, 404)

        notas_alergias = {
            "id": paciente_row['id_paciente'],
            "notas": paciente_row['notas'] or '',
            "alergias": paciente_row['alergias'] or ''
        }

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "notas_alergias": notas_alergias
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener notas y alergias: {str(e)}"}, 500)

def handle_get_etiquetas(request):
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

        # Obtener todas las etiquetas activas
        cur.execute("""
            SELECT id_etiqueta, nombre, color, descripcion
            FROM etiquetas_paciente
            WHERE activa = true
            ORDER BY nombre
        """)
        
        etiquetas = []
        for row in cur.fetchall():
            etiquetas.append({
                "id": row['id_etiqueta'],
                "nombre": row['nombre'],
                "color": row['color'],
                "descripcion": row['descripcion']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "etiquetas": etiquetas
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener etiquetas: {str(e)}"}, 500)

def handle_add_etiqueta_to_patient(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        patient_id = data.get('id_paciente')
        etiqueta_id = data.get('id_etiqueta')
        
        if not patient_id or not etiqueta_id:
            return json_response({"error": "ID de paciente y etiqueta requeridos"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Insertar relación (ignora si ya existe por UNIQUE constraint)
        try:
            cur.execute("""
                INSERT INTO paciente_etiquetas (id_paciente, id_etiqueta)
                VALUES (%s, %s)
                ON CONFLICT (id_paciente, id_etiqueta) DO NOTHING
            """, (patient_id, etiqueta_id))
            
            conn.commit()
        except Exception as e:
            conn.rollback()
            return json_response({"error": f"Error al asignar etiqueta: {str(e)}"}, 400)

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Etiqueta agregada exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al agregar etiqueta: {str(e)}"}, 500)

def handle_remove_etiqueta_from_patient(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        patient_id = request.args.get('id_paciente')
        etiqueta_id = request.args.get('id_etiqueta')
        
        if not patient_id or not etiqueta_id:
            return json_response({"error": "ID de paciente y etiqueta requeridos"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Eliminar relación
        cur.execute("""
            DELETE FROM paciente_etiquetas
            WHERE id_paciente = %s AND id_etiqueta = %s
        """, (patient_id, etiqueta_id))
        
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Etiqueta removida exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al remover etiqueta: {str(e)}"}, 500)

def handle_update_patient_foto(request):
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
        foto_url = data.get('foto_perfil_url', '')
        
        if not patient_id:
            return json_response({"error": "ID de paciente requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        update_query = """
            UPDATE pacientes 
            SET foto_perfil_url = %s
            WHERE id_paciente = %s
        """

        cur.execute(update_query, (foto_url, patient_id))
        
        if cur.rowcount == 0:
            return json_response({"error": "Paciente no encontrado"}, 404)

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Foto de perfil actualizada exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al actualizar foto: {str(e)}"}, 500)

def handle_update_patient_notas_alergias(request):
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
        campo = data.get('campo')  # 'notas' o 'alergias'
        valor = data.get('valor', '')
        
        if not patient_id or not campo:
            return json_response({"error": "ID de paciente y campo requeridos"}, 400)

        if campo not in ['notas', 'alergias']:
            return json_response({"error": "Campo debe ser 'notas' o 'alergias'"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        update_query = f"""
            UPDATE pacientes 
            SET {campo} = %s
            WHERE id_paciente = %s
        """

        cur.execute(update_query, (valor, patient_id))
        
        if cur.rowcount == 0:
            return json_response({"error": "Paciente no encontrado"}, 404)

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": f"{campo.capitalize()} actualizada exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al actualizar {campo}: {str(e)}"}, 500)

# ===== DATOS FISCALES =====
def handle_get_datos_fiscales(request):
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

        cur.execute("""
            SELECT id_dato_fiscal, razon_social, numero_fiscal, direccion, 
                   departamento, provincia, distrito, fecha_creacion
            FROM datos_fiscales_paciente
            WHERE id_paciente = %s AND activo = true
            ORDER BY fecha_creacion DESC
        """, (patient_id,))
        
        datos = []
        for row in cur.fetchall():
            datos.append({
                "id": row['id_dato_fiscal'],
                "razonSocial": row['razon_social'],
                "numeroFiscal": row['numero_fiscal'],
                "direccion": row['direccion'],
                "departamento": row['departamento'],
                "provincia": row['provincia'],
                "distrito": row['distrito'],
                "fechaCreacion": row['fecha_creacion'].isoformat() if row['fecha_creacion'] else None
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "datos_fiscales": datos
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener datos fiscales: {str(e)}"}, 500)

def handle_create_dato_fiscal(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        patient_id = data.get('id_paciente')
        razon_social = data.get('razon_social', '').strip()
        numero_fiscal = data.get('numero_fiscal', '').strip()
        direccion = data.get('direccion', '').strip()
        departamento = data.get('departamento', '').strip()
        provincia = data.get('provincia', '').strip()
        distrito = data.get('distrito', '').strip()
        
        if not patient_id or not razon_social or not numero_fiscal:
            return json_response({"error": "ID de paciente, razón social y número fiscal son requeridos"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO datos_fiscales_paciente 
            (id_paciente, razon_social, numero_fiscal, direccion, departamento, provincia, distrito)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id_dato_fiscal
        """, (patient_id, razon_social, numero_fiscal, direccion, departamento, provincia, distrito))
        
        new_id = cur.fetchone()['id_dato_fiscal']
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Dato fiscal creado exitosamente",
            "id": new_id
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear dato fiscal: {str(e)}"}, 500)

def handle_update_dato_fiscal(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        dato_fiscal_id = data.get('id')
        
        if not dato_fiscal_id:
            return json_response({"error": "ID de dato fiscal requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        update_fields = []
        params = []

        if 'razon_social' in data:
            update_fields.append("razon_social = %s")
            params.append(data['razon_social'])
        
        if 'numero_fiscal' in data:
            update_fields.append("numero_fiscal = %s")
            params.append(data['numero_fiscal'])
        
        if 'direccion' in data:
            update_fields.append("direccion = %s")
            params.append(data['direccion'])
        
        if 'departamento' in data:
            update_fields.append("departamento = %s")
            params.append(data['departamento'])
        
        if 'provincia' in data:
            update_fields.append("provincia = %s")
            params.append(data['provincia'])
        
        if 'distrito' in data:
            update_fields.append("distrito = %s")
            params.append(data['distrito'])

        if not update_fields:
            return json_response({"error": "No hay campos para actualizar"}, 400)

        params.append(dato_fiscal_id)
        update_query = f"""
            UPDATE datos_fiscales_paciente 
            SET {', '.join(update_fields)}
            WHERE id_dato_fiscal = %s AND activo = true
        """

        cur.execute(update_query, params)
        
        if cur.rowcount == 0:
            return json_response({"error": "Dato fiscal no encontrado"}, 404)

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Dato fiscal actualizado exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al actualizar dato fiscal: {str(e)}"}, 500)

def handle_delete_dato_fiscal(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        dato_fiscal_id = request.args.get('id')
        if not dato_fiscal_id:
            return json_response({"error": "ID de dato fiscal requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE datos_fiscales_paciente 
            SET activo = false
            WHERE id_dato_fiscal = %s
        """, (dato_fiscal_id,))
        
        if cur.rowcount == 0:
            return json_response({"error": "Dato fiscal no encontrado"}, 404)

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Dato fiscal eliminado exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al eliminar dato fiscal: {str(e)}"}, 500)

# ===== FAMILIARES =====
def handle_get_familiares(request):
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

        cur.execute("""
            SELECT id_familiar, nombre_completo, documento, telefono, email, 
                   es_apoderado, parentesco, fecha_creacion
            FROM familiares_paciente
            WHERE id_paciente = %s AND activo = true
            ORDER BY fecha_creacion DESC
        """, (patient_id,))
        
        familiares = []
        for row in cur.fetchall():
            familiares.append({
                "id": row['id_familiar'],
                "nombreCompleto": row['nombre_completo'],
                "documento": row['documento'],
                "telefono": row['telefono'],
                "email": row['email'],
                "esApoderado": row['es_apoderado'],
                "parentesco": row['parentesco'],
                "fechaCreacion": row['fecha_creacion'].isoformat() if row['fecha_creacion'] else None
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "familiares": familiares
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener familiares: {str(e)}"}, 500)

def handle_create_familiar(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        patient_id = data.get('id_paciente')
        nombre_completo = data.get('nombre_completo', '').strip()
        documento = data.get('documento', '').strip()
        telefono = data.get('telefono', '').strip()
        email = data.get('email', '').strip()
        es_apoderado = data.get('es_apoderado', False)
        parentesco = data.get('parentesco', '').strip()
        
        if not patient_id or not nombre_completo:
            return json_response({"error": "ID de paciente y nombre completo son requeridos"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO familiares_paciente 
            (id_paciente, nombre_completo, documento, telefono, email, es_apoderado, parentesco)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id_familiar
        """, (patient_id, nombre_completo, documento, telefono, email, es_apoderado, parentesco))
        
        new_id = cur.fetchone()['id_familiar']
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Familiar creado exitosamente",
            "id": new_id
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear familiar: {str(e)}"}, 500)

def handle_update_familiar(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        familiar_id = data.get('id')
        
        if not familiar_id:
            return json_response({"error": "ID de familiar requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        update_fields = []
        params = []

        if 'nombre_completo' in data:
            update_fields.append("nombre_completo = %s")
            params.append(data['nombre_completo'])
        
        if 'documento' in data:
            update_fields.append("documento = %s")
            params.append(data['documento'])
        
        if 'telefono' in data:
            update_fields.append("telefono = %s")
            params.append(data['telefono'])
        
        if 'email' in data:
            update_fields.append("email = %s")
            params.append(data['email'])
        
        if 'es_apoderado' in data:
            update_fields.append("es_apoderado = %s")
            params.append(data['es_apoderado'])
        
        if 'parentesco' in data:
            update_fields.append("parentesco = %s")
            params.append(data['parentesco'])

        if not update_fields:
            return json_response({"error": "No hay campos para actualizar"}, 400)

        params.append(familiar_id)
        update_query = f"""
            UPDATE familiares_paciente 
            SET {', '.join(update_fields)}
            WHERE id_familiar = %s AND activo = true
        """

        cur.execute(update_query, params)
        
        if cur.rowcount == 0:
            return json_response({"error": "Familiar no encontrado"}, 404)

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Familiar actualizado exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al actualizar familiar: {str(e)}"}, 500)

def handle_delete_familiar(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        familiar_id = request.args.get('id')
        if not familiar_id:
            return json_response({"error": "ID de familiar requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE familiares_paciente 
            SET activo = false
            WHERE id_familiar = %s
        """, (familiar_id,))
        
        if cur.rowcount == 0:
            return json_response({"error": "Familiar no encontrado"}, 404)

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Familiar eliminado exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al eliminar familiar: {str(e)}"}, 500)

# ===== NOTAS DE EVOLUCIÓN =====
def handle_get_notas_evolucion(request):
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

        cur.execute("""
            SELECT n.id_nota_evolucion, n.evolucion, n.observacion, n.fecha_creacion,
                   d.nombres as doctor_nombres, d.apellidos as doctor_apellidos
            FROM notas_evolucion_paciente n
            LEFT JOIN doctores d ON n.id_doctor = d.id_doctor
            WHERE n.id_paciente = %s AND n.activo = true
            ORDER BY n.fecha_creacion DESC
        """, (patient_id,))
        
        notas = []
        for row in cur.fetchall():
            notas.append({
                "id": row['id_nota_evolucion'],
                "evolucion": row['evolucion'],
                "observacion": row['observacion'],
                "doctor": f"{row['doctor_nombres']} {row['doctor_apellidos']}" if row['doctor_nombres'] else 'Doctor no asignado',
                "fecha": row['fecha_creacion'].isoformat() if row['fecha_creacion'] else None
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "notas_evolucion": notas
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener notas de evolución: {str(e)}"}, 500)

def handle_create_nota_evolucion(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        patient_id = data.get('id_paciente')
        doctor_nombre = data.get('doctor', '')
        evolucion = data.get('evolucion', '').strip()
        observacion = data.get('observacion', '').strip()
        
        if not patient_id:
            return json_response({"error": "ID de paciente requerido"}, 400)
        
        if not evolucion and not observacion:
            return json_response({"error": "Debe ingresar evolución u observación"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Buscar el ID del doctor por nombre (simplificado)
        id_doctor = None
        if doctor_nombre:
            cur.execute("""
                SELECT id_doctor FROM doctores 
                WHERE CONCAT(nombres, ' ', apellidos) ILIKE %s
                LIMIT 1
            """, (f"%{doctor_nombre}%",))
            doctor_row = cur.fetchone()
            if doctor_row:
                id_doctor = doctor_row['id_doctor']

        cur.execute("""
            INSERT INTO notas_evolucion_paciente 
            (id_paciente, id_doctor, evolucion, observacion)
            VALUES (%s, %s, %s, %s)
            RETURNING id_nota_evolucion
        """, (patient_id, id_doctor, evolucion, observacion))
        
        new_id = cur.fetchone()['id_nota_evolucion']
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Nota de evolución creada exitosamente",
            "id": new_id
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear nota de evolución: {str(e)}"}, 500)

def handle_delete_nota_evolucion(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        nota_id = request.args.get('id')
        if not nota_id:
            return json_response({"error": "ID de nota requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE notas_evolucion_paciente 
            SET activo = false
            WHERE id_nota_evolucion = %s
        """, (nota_id,))
        
        if cur.rowcount == 0:
            return json_response({"error": "Nota no encontrada"}, 404)

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Nota eliminada exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al eliminar nota: {str(e)}"}, 500)

# ===== ANAMNESIS ODONTOLOGÍA =====
def handle_get_anamnesis_odontologia(request):
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

        cur.execute("""
            SELECT a.id_anamnesis, a.motivo_consulta, a.tiempo_enfermedad, 
                   a.signos_sintomas_principales, a.relato_cronologico, a.funciones_biologicas,
                   a.antecedentes_familiares, a.antecedentes_personales, a.comentario_adicional,
                   a.condiciones_medicas, a.preguntas_adicionales,
                   a.presion_arterial, a.temperatura, a.frecuencia_cardiaca, a.frecuencia_respiratoria,
                   a.examen_extraoral, a.examen_intraoral, a.resultado_examenes_auxiliares,
                   a.observaciones_clinicas, a.fecha_creacion,
                   d.nombres as doctor_nombres, d.apellidos as doctor_apellidos
            FROM anamnesis_odontologia a
            LEFT JOIN doctores d ON a.id_doctor = d.id_doctor
            WHERE a.id_paciente = %s AND a.activo = true
            ORDER BY a.fecha_creacion DESC
            LIMIT 1
        """, (patient_id,))
        
        row = cur.fetchone()
        
        if row:
            anamnesis = {
                "id": row['id_anamnesis'],
                "motivo_consulta": row['motivo_consulta'],
                "tiempo_enfermedad": row['tiempo_enfermedad'],
                "signos_sintomas_principales": row['signos_sintomas_principales'],
                "relato_cronologico": row['relato_cronologico'],
                "funciones_biologicas": row['funciones_biologicas'],
                "antecedentes_familiares": row['antecedentes_familiares'],
                "antecedentes_personales": row['antecedentes_personales'],
                "comentario_adicional": row['comentario_adicional'],
                "condiciones_medicas": row['condiciones_medicas'] or {},
                "preguntas_adicionales": row['preguntas_adicionales'] or {},
                "presion_arterial": row['presion_arterial'],
                "temperatura": row['temperatura'],
                "frecuencia_cardiaca": row['frecuencia_cardiaca'],
                "frecuencia_respiratoria": row['frecuencia_respiratoria'],
                "examen_extraoral": row['examen_extraoral'],
                "examen_intraoral": row['examen_intraoral'],
                "resultado_examenes_auxiliares": row['resultado_examenes_auxiliares'],
                "observaciones_clinicas": row['observaciones_clinicas'],
                "doctor": f"{row['doctor_nombres']} {row['doctor_apellidos']}" if row['doctor_nombres'] else None,
                "fecha": row['fecha_creacion'].isoformat() if row['fecha_creacion'] else None
            }
        else:
            anamnesis = None

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "anamnesis": anamnesis
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener anamnesis: {str(e)}"}, 500)

def handle_save_anamnesis_odontologia(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        patient_id = data.get('id_paciente')
        anamnesis_id = data.get('id_anamnesis')
        
        if not patient_id:
            return json_response({"error": "ID de paciente requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Buscar ID del doctor por nombre (si viene)
        id_doctor = None
        doctor_nombre = data.get('doctor', '')
        if doctor_nombre:
            cur.execute("""
                SELECT id_doctor FROM doctores 
                WHERE CONCAT(nombres, ' ', apellidos) ILIKE %s
                LIMIT 1
            """, (f"%{doctor_nombre}%",))
            doctor_row = cur.fetchone()
            if doctor_row:
                id_doctor = doctor_row['id_doctor']

        # Convertir a JSON los campos complejos
        import json as json_lib
        condiciones_medicas = json_lib.dumps(data.get('condiciones_medicas', {}))
        preguntas_adicionales = json_lib.dumps(data.get('preguntas_adicionales', {}))

        if anamnesis_id:
            # Actualizar anamnesis existente
            cur.execute("""
                UPDATE anamnesis_odontologia
                SET id_doctor = %s, motivo_consulta = %s, tiempo_enfermedad = %s,
                    signos_sintomas_principales = %s, relato_cronologico = %s, funciones_biologicas = %s,
                    antecedentes_familiares = %s, antecedentes_personales = %s, comentario_adicional = %s,
                    condiciones_medicas = %s, preguntas_adicionales = %s,
                    presion_arterial = %s, temperatura = %s, frecuencia_cardiaca = %s, frecuencia_respiratoria = %s,
                    examen_extraoral = %s, examen_intraoral = %s, resultado_examenes_auxiliares = %s,
                    observaciones_clinicas = %s, fecha_modificacion = CURRENT_TIMESTAMP
                WHERE id_anamnesis = %s AND id_paciente = %s
                RETURNING id_anamnesis
            """, (
                id_doctor, data.get('motivo_consulta'), data.get('tiempo_enfermedad'),
                data.get('signos_sintomas_principales'), data.get('relato_cronologico'), data.get('funciones_biologicas'),
                data.get('antecedentes_familiares'), data.get('antecedentes_personales'), data.get('comentario_adicional'),
                condiciones_medicas, preguntas_adicionales,
                data.get('presion_arterial'), data.get('temperatura'), data.get('frecuencia_cardiaca'), data.get('frecuencia_respiratoria'),
                data.get('examen_extraoral'), data.get('examen_intraoral'), data.get('resultado_examenes_auxiliares'),
                data.get('observaciones_clinicas'), anamnesis_id, patient_id
            ))
            result = cur.fetchone()
            if not result:
                return json_response({"error": "Anamnesis no encontrada"}, 404)
            saved_id = result['id_anamnesis']
        else:
            # Crear nueva anamnesis
            cur.execute("""
                INSERT INTO anamnesis_odontologia 
                (id_paciente, id_doctor, motivo_consulta, tiempo_enfermedad,
                 signos_sintomas_principales, relato_cronologico, funciones_biologicas,
                 antecedentes_familiares, antecedentes_personales, comentario_adicional,
                 condiciones_medicas, preguntas_adicionales,
                 presion_arterial, temperatura, frecuencia_cardiaca, frecuencia_respiratoria,
                 examen_extraoral, examen_intraoral, resultado_examenes_auxiliares, observaciones_clinicas)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id_anamnesis
            """, (
                patient_id, id_doctor, data.get('motivo_consulta'), data.get('tiempo_enfermedad'),
                data.get('signos_sintomas_principales'), data.get('relato_cronologico'), data.get('funciones_biologicas'),
                data.get('antecedentes_familiares'), data.get('antecedentes_personales'), data.get('comentario_adicional'),
                condiciones_medicas, preguntas_adicionales,
                data.get('presion_arterial'), data.get('temperatura'), data.get('frecuencia_cardiaca'), data.get('frecuencia_respiratoria'),
                data.get('examen_extraoral'), data.get('examen_intraoral'), data.get('resultado_examenes_auxiliares'),
                data.get('observaciones_clinicas')
            ))
            saved_id = cur.fetchone()['id_anamnesis']

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Anamnesis guardada exitosamente",
            "id": saved_id
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al guardar anamnesis: {str(e)}"}, 500)

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
            elif action in ('notas_alergias', 'notas-y-alergias'):
                return handle_get_patient_notas_alergias(request)
            elif action in ('etiquetas', 'tags'):
                return handle_get_etiquetas(request)
            elif action in ('datos_fiscales', 'fiscal_data'):
                return handle_get_datos_fiscales(request)
            elif action in ('familiares', 'relatives'):
                return handle_get_familiares(request)
            elif action in ('notas_evolucion', 'evolution_notes'):
                return handle_get_notas_evolucion(request)
            elif action in ('anamnesis_odontologia', 'anamnesis'):
                return handle_get_anamnesis_odontologia(request)
            else:
                return json_response({"error": "Acción GET no válida. Use action=list, citas, filiacion, tareas, lookup_options, notas_alergias, etiquetas, datos_fiscales, familiares, notas_evolucion o anamnesis_odontologia"}, 400)

        if request.method == 'POST':
            if action in ('create', 'crear'):
                return handle_create_paciente(request)
            elif action in ('add_etiqueta', 'agregar_etiqueta'):
                return handle_add_etiqueta_to_patient(request)
            elif action in ('create_dato_fiscal', 'crear_dato_fiscal'):
                return handle_create_dato_fiscal(request)
            elif action in ('create_familiar', 'crear_familiar'):
                return handle_create_familiar(request)
            elif action in ('create_nota_evolucion', 'crear_nota_evolucion'):
                return handle_create_nota_evolucion(request)
            elif action in ('save_anamnesis_odontologia', 'guardar_anamnesis'):
                return handle_save_anamnesis_odontologia(request)
            else:
                return json_response({"error": "Acción POST no válida. Use action=create, add_etiqueta, create_dato_fiscal, create_familiar, create_nota_evolucion o save_anamnesis_odontologia"}, 400)

        if request.method == 'PUT':
            if action in ('update_filiacion', 'actualizar_filiacion'):
                return handle_update_patient_filiacion(request)
            elif action in ('update_notas_alergias', 'actualizar_notas_alergias'):
                return handle_update_patient_notas_alergias(request)
            elif action in ('update_foto', 'actualizar_foto'):
                return handle_update_patient_foto(request)
            elif action in ('update_dato_fiscal', 'actualizar_dato_fiscal'):
                return handle_update_dato_fiscal(request)
            elif action in ('update_familiar', 'actualizar_familiar'):
                return handle_update_familiar(request)
            else:
                return json_response({"error": "Acción PUT no válida. Use action=update_filiacion, update_notas_alergias, update_foto, update_dato_fiscal o update_familiar"}, 400)

        if request.method == 'DELETE':
            if action in ('remove_etiqueta', 'remover_etiqueta'):
                return handle_remove_etiqueta_from_patient(request)
            elif action in ('delete_dato_fiscal', 'eliminar_dato_fiscal'):
                return handle_delete_dato_fiscal(request)
            elif action in ('delete_familiar', 'eliminar_familiar'):
                return handle_delete_familiar(request)
            elif action in ('delete_nota_evolucion', 'eliminar_nota_evolucion'):
                return handle_delete_nota_evolucion(request)
            else:
                return json_response({"error": "Acción DELETE no válida. Use action=remove_etiqueta, delete_dato_fiscal, delete_familiar o delete_nota_evolucion"}, 400)

        return json_response({"error": "Método no soportado"}, 405)
    except Exception as e:
        return json_response({"error": f"Error interno: {str(e)}"}, 500)
