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

# ===== OBTENER ODONTOGRAMA =====
def obtener_odontograma(request):
    """Obtener odontograma por paciente y tipo"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        id_paciente = request.args.get('id_paciente')
        tipo_odontograma = request.args.get('tipo', 'inicial')  # inicial, evolucion, alta
        
        if not id_paciente:
            return json_response({"error": "id_paciente es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Obtener odontograma principal
        cur.execute("""
            SELECT o.id_odontograma, o.id_paciente, o.id_doctor, o.tipo_odontograma,
                   o.fecha_creacion, o.fecha_modificacion, o.observaciones, o.activo,
                   d.nombres as doctor_nombres, d.apellidos as doctor_apellidos
            FROM odontogramas o
            LEFT JOIN doctores d ON o.id_doctor = d.id_doctor
            WHERE o.id_paciente = %s AND o.tipo_odontograma = %s AND o.activo = TRUE
            ORDER BY o.fecha_modificacion DESC
            LIMIT 1
        """, (id_paciente, tipo_odontograma))
        
        odontograma = cur.fetchone()

        if not odontograma:
            # Si no existe, devolver estructura vacía
            cur.close()
            conn.close()
            return json_response({
                "success": True,
                "existe": False,
                "odontograma": None,
                "dientes": [],
                "plan_tratamiento": []
            })

        id_odontograma = odontograma['id_odontograma']

        # Obtener detalles de cada diente
        cur.execute("""
            SELECT numero_diente, estado_general, 
                   superficie_oclusal, superficie_vestibular, superficie_lingual,
                   superficie_mesial, superficie_distal,
                   tiene_caries, tiene_obturacion, tiene_corona, necesita_extraccion,
                   codigo_tratamiento, color_marcador, notas, fecha_registro
            FROM odontograma_dientes
            WHERE id_odontograma = %s
            ORDER BY numero_diente
        """, (id_odontograma,))
        
        dientes = []
        for row in cur.fetchall():
            dientes.append({
                "numero": row['numero_diente'],
                "estado_general": row['estado_general'],
                "superficies": {
                    "oclusal": row['superficie_oclusal'],
                    "vestibular": row['superficie_vestibular'],
                    "lingual": row['superficie_lingual'],
                    "mesial": row['superficie_mesial'],
                    "distal": row['superficie_distal']
                },
                "tiene_caries": row['tiene_caries'],
                "tiene_obturacion": row['tiene_obturacion'],
                "tiene_corona": row['tiene_corona'],
                "necesita_extraccion": row['necesita_extraccion'],
                "codigo_tratamiento": row['codigo_tratamiento'],
                "color_marcador": row['color_marcador'],
                "notas": row['notas'],
                "fecha_registro": row['fecha_registro']
            })

        # Obtener plan de tratamiento
        cur.execute("""
            SELECT id_plan, numero_diente, tratamiento_planificado, descripcion,
                   prioridad, estado, costo_estimado, fecha_planificado, 
                   fecha_completado, observaciones, fecha_creacion
            FROM odontograma_plan_tratamiento
            WHERE id_odontograma = %s
            ORDER BY 
                CASE prioridad 
                    WHEN 'urgente' THEN 1 
                    WHEN 'alta' THEN 2 
                    WHEN 'media' THEN 3 
                    ELSE 4 
                END,
                fecha_planificado
        """, (id_odontograma,))
        
        plan_tratamiento = []
        for row in cur.fetchall():
            plan_tratamiento.append({
                "id": row['id_plan'],
                "numero_diente": row['numero_diente'],
                "tratamiento": row['tratamiento_planificado'],
                "descripcion": row['descripcion'],
                "prioridad": row['prioridad'],
                "estado": row['estado'],
                "costo_estimado": float(row['costo_estimado']) if row['costo_estimado'] else None,
                "fecha_planificado": row['fecha_planificado'],
                "fecha_completado": row['fecha_completado'],
                "observaciones": row['observaciones'],
                "fecha_creacion": row['fecha_creacion']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "existe": True,
            "odontograma": {
                "id": odontograma['id_odontograma'],
                "id_paciente": odontograma['id_paciente'],
                "id_doctor": odontograma['id_doctor'],
                "doctor": f"{odontograma['doctor_nombres']} {odontograma['doctor_apellidos']}" if odontograma['doctor_nombres'] else None,
                "tipo": odontograma['tipo_odontograma'],
                "fecha_creacion": odontograma['fecha_creacion'],
                "fecha_modificacion": odontograma['fecha_modificacion'],
                "observaciones": odontograma['observaciones']
            },
            "dientes": dientes,
            "plan_tratamiento": plan_tratamiento
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener odontograma: {str(e)}"}, 500)

# ===== CREAR O ACTUALIZAR ODONTOGRAMA =====
def guardar_odontograma(request):
    """Crear o actualizar un odontograma completo"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        
        id_paciente = data.get('id_paciente')
        tipo_odontograma = data.get('tipo', 'inicial')
        id_doctor = data.get('id_doctor')
        observaciones = data.get('observaciones', '')
        dientes = data.get('dientes', [])  # Array de objetos con info de cada diente
        
        if not id_paciente:
            return json_response({"error": "id_paciente es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Verificar si ya existe un odontograma activo de este tipo para este paciente
        cur.execute("""
            SELECT id_odontograma FROM odontogramas
            WHERE id_paciente = %s AND tipo_odontograma = %s AND activo = TRUE
        """, (id_paciente, tipo_odontograma))
        
        existing = cur.fetchone()
        
        if existing:
            # Actualizar odontograma existente
            id_odontograma = existing['id_odontograma']
            cur.execute("""
                UPDATE odontogramas
                SET id_doctor = %s, observaciones = %s, 
                    fecha_modificacion = CURRENT_TIMESTAMP
                WHERE id_odontograma = %s
            """, (id_doctor, observaciones, id_odontograma))
        else:
            # Crear nuevo odontograma
            cur.execute("""
                INSERT INTO odontogramas (id_paciente, id_doctor, tipo_odontograma, observaciones)
                VALUES (%s, %s, %s, %s)
                RETURNING id_odontograma
            """, (id_paciente, id_doctor, tipo_odontograma, observaciones))
            
            id_odontograma = cur.fetchone()['id_odontograma']

        # Guardar o actualizar detalles de cada diente
        for diente in dientes:
            numero = diente.get('numero')
            if not numero:
                continue
            
            estado_general = diente.get('estado_general', 'sano')
            superficies = diente.get('superficies', {})
            
            # Usar UPSERT (INSERT ... ON CONFLICT UPDATE)
            cur.execute("""
                INSERT INTO odontograma_dientes (
                    id_odontograma, numero_diente, estado_general,
                    superficie_oclusal, superficie_vestibular, superficie_lingual,
                    superficie_mesial, superficie_distal,
                    tiene_caries, tiene_obturacion, tiene_corona, necesita_extraccion,
                    codigo_tratamiento, color_marcador, notas
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id_odontograma, numero_diente) 
                DO UPDATE SET
                    estado_general = EXCLUDED.estado_general,
                    superficie_oclusal = EXCLUDED.superficie_oclusal,
                    superficie_vestibular = EXCLUDED.superficie_vestibular,
                    superficie_lingual = EXCLUDED.superficie_lingual,
                    superficie_mesial = EXCLUDED.superficie_mesial,
                    superficie_distal = EXCLUDED.superficie_distal,
                    tiene_caries = EXCLUDED.tiene_caries,
                    tiene_obturacion = EXCLUDED.tiene_obturacion,
                    tiene_corona = EXCLUDED.tiene_corona,
                    necesita_extraccion = EXCLUDED.necesita_extraccion,
                    codigo_tratamiento = EXCLUDED.codigo_tratamiento,
                    color_marcador = EXCLUDED.color_marcador,
                    notas = EXCLUDED.notas,
                    fecha_registro = CURRENT_TIMESTAMP
            """, (
                id_odontograma, numero, estado_general,
                superficies.get('oclusal', 'sano'),
                superficies.get('vestibular', 'sano'),
                superficies.get('lingual', 'sano'),
                superficies.get('mesial', 'sano'),
                superficies.get('distal', 'sano'),
                diente.get('tiene_caries', False),
                diente.get('tiene_obturacion', False),
                diente.get('tiene_corona', False),
                diente.get('necesita_extraccion', False),
                diente.get('codigo_tratamiento'),
                diente.get('color_marcador'),
                diente.get('notas')
            ))

            # Registrar en historial
            cur.execute("""
                INSERT INTO odontograma_historial (
                    id_odontograma, numero_diente, campo_modificado, 
                    valor_nuevo, id_usuario, observaciones
                ) VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                id_odontograma, numero, 'estado_diente',
                json.dumps(diente, default=str), 
                payload.get('user_id'),
                f"Actualización de diente {numero}"
            ))

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Odontograma guardado exitosamente",
            "id_odontograma": id_odontograma
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al guardar odontograma: {str(e)}"}, 500)

# ===== ACTUALIZAR DIENTE INDIVIDUAL =====
def actualizar_diente(request):
    """Actualizar el estado de un diente específico"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        
        id_paciente = data.get('id_paciente')
        tipo_odontograma = data.get('tipo', 'inicial')
        numero_diente = data.get('numero_diente')
        
        if not all([id_paciente, numero_diente]):
            return json_response({"error": "id_paciente y numero_diente son requeridos"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Obtener o crear odontograma
        cur.execute("""
            SELECT id_odontograma FROM odontogramas
            WHERE id_paciente = %s AND tipo_odontograma = %s AND activo = TRUE
        """, (id_paciente, tipo_odontograma))
        
        result = cur.fetchone()
        
        if not result:
            # Crear odontograma si no existe
            cur.execute("""
                INSERT INTO odontogramas (id_paciente, tipo_odontograma)
                VALUES (%s, %s)
                RETURNING id_odontograma
            """, (id_paciente, tipo_odontograma))
            id_odontograma = cur.fetchone()['id_odontograma']
        else:
            id_odontograma = result['id_odontograma']

        # Actualizar fecha de modificación del odontograma
        cur.execute("""
            UPDATE odontogramas 
            SET fecha_modificacion = CURRENT_TIMESTAMP 
            WHERE id_odontograma = %s
        """, (id_odontograma,))

        # Preparar campos para actualizar
        superficies = data.get('superficies', {})
        
        # UPSERT del diente
        cur.execute("""
            INSERT INTO odontograma_dientes (
                id_odontograma, numero_diente, estado_general,
                superficie_oclusal, superficie_vestibular, superficie_lingual,
                superficie_mesial, superficie_distal,
                tiene_caries, tiene_obturacion, tiene_corona, necesita_extraccion,
                codigo_tratamiento, color_marcador, notas
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id_odontograma, numero_diente) 
            DO UPDATE SET
                estado_general = EXCLUDED.estado_general,
                superficie_oclusal = EXCLUDED.superficie_oclusal,
                superficie_vestibular = EXCLUDED.superficie_vestibular,
                superficie_lingual = EXCLUDED.superficie_lingual,
                superficie_mesial = EXCLUDED.superficie_mesial,
                superficie_distal = EXCLUDED.superficie_distal,
                tiene_caries = EXCLUDED.tiene_caries,
                tiene_obturacion = EXCLUDED.tiene_obturacion,
                tiene_corona = EXCLUDED.tiene_corona,
                necesita_extraccion = EXCLUDED.necesita_extraccion,
                codigo_tratamiento = EXCLUDED.codigo_tratamiento,
                color_marcador = EXCLUDED.color_marcador,
                notas = EXCLUDED.notas,
                fecha_registro = CURRENT_TIMESTAMP
        """, (
            id_odontograma, numero_diente, data.get('estado_general', 'sano'),
            superficies.get('oclusal', 'sano'),
            superficies.get('vestibular', 'sano'),
            superficies.get('lingual', 'sano'),
            superficies.get('mesial', 'sano'),
            superficies.get('distal', 'sano'),
            data.get('tiene_caries', False),
            data.get('tiene_obturacion', False),
            data.get('tiene_corona', False),
            data.get('necesita_extraccion', False),
            data.get('codigo_tratamiento'),
            data.get('color_marcador'),
            data.get('notas')
        ))

        # Registrar en historial
        cur.execute("""
            INSERT INTO odontograma_historial (
                id_odontograma, numero_diente, campo_modificado, 
                valor_nuevo, id_usuario
            ) VALUES (%s, %s, %s, %s, %s)
        """, (
            id_odontograma, numero_diente, 'actualizacion_diente',
            json.dumps(data, default=str), 
            payload.get('user_id')
        ))

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": f"Diente {numero_diente} actualizado exitosamente"
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al actualizar diente: {str(e)}"}, 500)

# ===== AGREGAR TRATAMIENTO AL PLAN =====
def agregar_tratamiento_plan(request):
    """Agregar un tratamiento al plan de tratamiento"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        
        id_odontograma = data.get('id_odontograma')
        numero_diente = data.get('numero_diente')
        tratamiento = data.get('tratamiento')
        
        if not all([id_odontograma, numero_diente, tratamiento]):
            return json_response({"error": "id_odontograma, numero_diente y tratamiento son requeridos"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO odontograma_plan_tratamiento (
                id_odontograma, numero_diente, tratamiento_planificado,
                descripcion, prioridad, estado, costo_estimado,
                fecha_planificado, observaciones
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id_plan
        """, (
            id_odontograma, numero_diente, tratamiento,
            data.get('descripcion'),
            data.get('prioridad', 'media'),
            data.get('estado', 'pendiente'),
            data.get('costo_estimado'),
            data.get('fecha_planificado'),
            data.get('observaciones')
        ))

        id_plan = cur.fetchone()['id_plan']
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Tratamiento agregado al plan exitosamente",
            "id_plan": id_plan
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al agregar tratamiento: {str(e)}"}, 500)

# ===== ACTUALIZAR TRATAMIENTO DEL PLAN =====
def actualizar_tratamiento_plan(request):
    """Actualizar un tratamiento del plan"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        
        id_plan = data.get('id_plan')
        if not id_plan:
            return json_response({"error": "id_plan es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Construir query dinámicamente
        update_fields = []
        params = []

        campos_permitidos = {
            'tratamiento_planificado': 'tratamiento',
            'descripcion': 'descripcion',
            'prioridad': 'prioridad',
            'estado': 'estado',
            'costo_estimado': 'costo_estimado',
            'fecha_planificado': 'fecha_planificado',
            'fecha_completado': 'fecha_completado',
            'observaciones': 'observaciones'
        }

        for campo_db, campo_json in campos_permitidos.items():
            if campo_json in data:
                update_fields.append(f"{campo_db} = %s")
                params.append(data[campo_json])

        if not update_fields:
            return json_response({"error": "No hay campos para actualizar"}, 400)

        params.append(id_plan)
        query = f"""
            UPDATE odontograma_plan_tratamiento
            SET {', '.join(update_fields)}
            WHERE id_plan = %s
        """

        cur.execute(query, params)
        
        if cur.rowcount == 0:
            return json_response({"error": "Tratamiento no encontrado"}, 404)

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
        except Exception:
            pass
        return json_response({"error": f"Error al actualizar tratamiento: {str(e)}"}, 500)

# ===== ELIMINAR TRATAMIENTO DEL PLAN =====
def eliminar_tratamiento_plan(request):
    """Eliminar un tratamiento del plan"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        id_plan = request.args.get('id_plan')
        if not id_plan:
            return json_response({"error": "id_plan es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM odontograma_plan_tratamiento WHERE id_plan = %s", (id_plan,))
        
        if cur.rowcount == 0:
            return json_response({"error": "Tratamiento no encontrado"}, 404)

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
        except Exception:
            pass
        return json_response({"error": f"Error al eliminar tratamiento: {str(e)}"}, 500)

# ===== OBTENER CÓDIGOS ODONTOLÓGICOS =====
def obtener_codigos(request):
    """Obtener catálogo de códigos odontológicos"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        conn = get_connection()
        cur = conn.cursor()

        categoria = request.args.get('categoria')
        
        if categoria:
            cur.execute("""
                SELECT codigo, nombre, descripcion, color_sugerido, categoria
                FROM codigos_odontologicos
                WHERE activo = TRUE AND categoria = %s
                ORDER BY nombre
            """, (categoria,))
        else:
            cur.execute("""
                SELECT codigo, nombre, descripcion, color_sugerido, categoria
                FROM codigos_odontologicos
                WHERE activo = TRUE
                ORDER BY categoria, nombre
            """)

        codigos = []
        for row in cur.fetchall():
            codigos.append({
                "codigo": row['codigo'],
                "nombre": row['nombre'],
                "descripcion": row['descripcion'],
                "color": row['color_sugerido'],
                "categoria": row['categoria']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "codigos": codigos
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener códigos: {str(e)}"}, 500)

# ===== OBTENER HISTORIAL DE CAMBIOS =====
def obtener_historial(request):
    """Obtener historial de cambios de un odontograma"""
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        id_odontograma = request.args.get('id_odontograma')
        if not id_odontograma:
            return json_response({"error": "id_odontograma es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT h.id_historial, h.numero_diente, h.campo_modificado,
                   h.valor_anterior, h.valor_nuevo, h.fecha_cambio, h.observaciones,
                   u.nombre_usuario
            FROM odontograma_historial h
            LEFT JOIN usuarios u ON h.id_usuario = u.id_usuario
            WHERE h.id_odontograma = %s
            ORDER BY h.fecha_cambio DESC
            LIMIT 100
        """, (id_odontograma,))

        historial = []
        for row in cur.fetchall():
            historial.append({
                "id": row['id_historial'],
                "numero_diente": row['numero_diente'],
                "campo": row['campo_modificado'],
                "valor_anterior": row['valor_anterior'],
                "valor_nuevo": row['valor_nuevo'],
                "fecha": row['fecha_cambio'],
                "usuario": row['nombre_usuario'],
                "observaciones": row['observaciones']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "historial": historial
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener historial: {str(e)}"}, 500)

# ===== FUNCIÓN PRINCIPAL HTTP =====
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
            if action in ('obtener', 'get'):
                return obtener_odontograma(request)
            elif action in ('codigos', 'codes'):
                return obtener_codigos(request)
            elif action in ('historial', 'history'):
                return obtener_historial(request)
            else:
                return json_response({"error": "Acción GET no válida. Use action=obtener, codigos, o historial"}, 400)

        elif request.method == 'POST':
            if action in ('guardar', 'save'):
                return guardar_odontograma(request)
            elif action in ('diente', 'tooth'):
                return actualizar_diente(request)
            elif action in ('plan', 'treatment'):
                return agregar_tratamiento_plan(request)
            else:
                return json_response({"error": "Acción POST no válida. Use action=guardar, diente, o plan"}, 400)

        elif request.method == 'PUT':
            if action in ('plan', 'treatment'):
                return actualizar_tratamiento_plan(request)
            else:
                return json_response({"error": "Acción PUT no válida. Use action=plan"}, 400)

        elif request.method == 'DELETE':
            if action in ('plan', 'treatment'):
                return eliminar_tratamiento_plan(request)
            else:
                return json_response({"error": "Acción DELETE no válida. Use action=plan"}, 400)

        else:
            return json_response({"error": "Método no soportado"}, 405)

    except Exception as e:
        return json_response({"error": f"Error interno: {str(e)}"}, 500)

