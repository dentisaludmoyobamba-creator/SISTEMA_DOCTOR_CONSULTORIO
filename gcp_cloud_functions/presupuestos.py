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

def handle_list_presupuestos(request):
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
    paciente_id = request.args.get('paciente_id')
    doctor_id = request.args.get('doctor_id')
    estado = request.args.get('estado')

    offset = (page - 1) * limit

    try:
        conn = get_connection()
        cur = conn.cursor()

        base_query = """
            SELECT p.id_presupuesto, p.nombre_presupuesto, p.estado, p.fecha_creacion, 
                   p.fecha_vencimiento, p.monto_total, p.monto_final, p.nota_paciente, p.nota_interna,
                   pa.id_paciente, pa.nombres as paciente_nombres, pa.apellidos as paciente_apellidos, pa.dni as paciente_dni,
                   d.id_doctor, d.nombres as doctor_nombres, d.apellidos as doctor_apellidos
            FROM presupuestos p
            JOIN pacientes pa ON p.id_paciente = pa.id_paciente
            JOIN doctores d ON p.id_doctor = d.id_doctor
            WHERE p.activo = TRUE
        """

        params = []
        if search:
            base_query += " AND (p.nombre_presupuesto ILIKE %s OR pa.nombres ILIKE %s OR pa.apellidos ILIKE %s)"
            like = f"%{search}%"
            params.extend([like, like, like])
        
        if paciente_id:
            base_query += " AND p.id_paciente = %s"
            params.append(paciente_id)
        
        if doctor_id:
            base_query += " AND p.id_doctor = %s"
            params.append(doctor_id)
        
        if estado:
            base_query += " AND p.estado = %s"
            params.append(estado)

        count_query = f"SELECT COUNT(*) as total FROM ({base_query}) as sub"
        cur.execute(count_query, params)
        total = cur.fetchone()['total']

        base_query += " ORDER BY p.fecha_creacion DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        cur.execute(base_query, params)
        rows = cur.fetchall()

        presupuestos = []
        for r in rows:
            presupuestos.append({
                "id": r['id_presupuesto'],
                "nombre_presupuesto": r['nombre_presupuesto'],
                "estado": r['estado'],
                "fecha_creacion": r['fecha_creacion'].isoformat() if r['fecha_creacion'] else None,
                "fecha_vencimiento": r['fecha_vencimiento'].isoformat() if r['fecha_vencimiento'] else None,
                "monto_total": float(r['monto_total']) if r['monto_total'] else 0,
                "monto_final": float(r['monto_final']) if r['monto_final'] else 0,
                "nota_paciente": r['nota_paciente'],
                "nota_interna": r['nota_interna'],
                "paciente": {
                    "id": r['id_paciente'],
                    "nombres": r['paciente_nombres'],
                    "apellidos": r['paciente_apellidos'],
                    "dni": r['paciente_dni']
                },
                "doctor": {
                    "id": r['id_doctor'],
                    "nombres": r['doctor_nombres'],
                    "apellidos": r['doctor_apellidos']
                }
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "presupuestos": presupuestos,
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
        return json_response({"error": f"Error al listar presupuestos: {str(e)}"}, 500)

def handle_create_presupuesto(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        id_paciente = data.get('id_paciente')
        id_doctor = data.get('id_doctor')
        nombre_presupuesto = (data.get('nombre_presupuesto') or '').strip()
        estado = (data.get('estado') or 'Borrador').strip()
        fecha_vencimiento = data.get('fecha_vencimiento')
        nota_paciente = (data.get('nota_paciente') or '').strip()
        nota_interna = (data.get('nota_interna') or '').strip()
        items = data.get('items', [])

        if not id_paciente or not id_doctor:
            return json_response({"error": "ID de paciente y doctor son requeridos"}, 400)

        if not items:
            return json_response({"error": "Debe agregar al menos un item al presupuesto"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Insertar presupuesto
        fecha_venc = None
        if fecha_vencimiento:
            try:
                fecha_venc = datetime.datetime.strptime(fecha_vencimiento, '%Y-%m-%d').date()
            except Exception:
                fecha_venc = None

        cur.execute("""
            INSERT INTO presupuestos (id_paciente, id_doctor, nombre_presupuesto, estado, 
                                    fecha_vencimiento, nota_paciente, nota_interna, id_usuario_creador)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id_presupuesto
        """, (id_paciente, id_doctor, nombre_presupuesto, estado, fecha_venc, nota_paciente, nota_interna, 1))

        presupuesto_id = cur.fetchone()['id_presupuesto']

        # Insertar items
        for i, item in enumerate(items):
            cur.execute("""
                INSERT INTO presupuesto_items (id_presupuesto, tipo_item, id_tratamiento, id_producto,
                                             nombre_item, descripcion, cantidad, precio_unitario,
                                             descuento_porcentaje, descuento_monto, subtotal,
                                             diente, comentario, orden_item)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                presupuesto_id,
                item.get('tipo_item'),
                item.get('id_tratamiento'),
                item.get('id_producto'),
                item.get('nombre_item'),
                item.get('descripcion'),
                item.get('cantidad', 1),
                item.get('precio_unitario', 0),
                item.get('descuento_porcentaje', 0),
                item.get('descuento_monto', 0),
                item.get('subtotal', 0),
                item.get('diente'),
                item.get('comentario'),
                i
            ))

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Presupuesto creado exitosamente",
            "id_presupuesto": presupuesto_id
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear presupuesto: {str(e)}"}, 500)

def handle_update_presupuesto(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        presupuesto_id = data.get('id_presupuesto')
        
        if not presupuesto_id:
            return json_response({"error": "ID de presupuesto requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Actualizar presupuesto
        fecha_venc = None
        if data.get('fecha_vencimiento'):
            try:
                fecha_venc = datetime.datetime.strptime(data.get('fecha_vencimiento'), '%Y-%m-%d').date()
            except Exception:
                fecha_venc = None

        cur.execute("""
            UPDATE presupuestos SET
                nombre_presupuesto = %s,
                estado = %s,
                fecha_vencimiento = %s,
                nota_paciente = %s,
                nota_interna = %s,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_presupuesto = %s
        """, (
            data.get('nombre_presupuesto'),
            data.get('estado'),
            fecha_venc,
            data.get('nota_paciente'),
            data.get('nota_interna'),
            presupuesto_id
        ))

        # Eliminar items existentes y agregar nuevos
        cur.execute("DELETE FROM presupuesto_items WHERE id_presupuesto = %s", (presupuesto_id,))
        
        # Insertar nuevos items
        items = data.get('items', [])
        for i, item in enumerate(items):
            cur.execute("""
                INSERT INTO presupuesto_items (id_presupuesto, tipo_item, id_tratamiento, id_producto,
                                             nombre_item, descripcion, cantidad, precio_unitario,
                                             descuento_porcentaje, descuento_monto, subtotal,
                                             diente, comentario, orden_item)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                presupuesto_id,
                item.get('tipo_item'),
                item.get('id_tratamiento'),
                item.get('id_producto'),
                item.get('nombre_item'),
                item.get('descripcion'),
                item.get('cantidad', 1),
                item.get('precio_unitario', 0),
                item.get('descuento_porcentaje', 0),
                item.get('descuento_monto', 0),
                item.get('subtotal', 0),
                item.get('diente'),
                item.get('comentario'),
                i
            ))

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Presupuesto actualizado exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al actualizar presupuesto: {str(e)}"}, 500)

def handle_delete_presupuesto(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        presupuesto_id = request.args.get('id')
        if not presupuesto_id:
            return json_response({"error": "ID de presupuesto requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Soft delete del presupuesto
        cur.execute("""
            UPDATE presupuestos SET activo = FALSE, fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_presupuesto = %s
        """, (presupuesto_id,))

        # Soft delete de los items
        cur.execute("""
            UPDATE presupuesto_items SET activo = FALSE
            WHERE id_presupuesto = %s
        """, (presupuesto_id,))

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Presupuesto eliminado exitosamente"
        })
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al eliminar presupuesto: {str(e)}"}, 500)

def handle_buscar_servicios(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return json_response({"error": "Token de autorización requerido"}, 401)

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return json_response({"error": "Token inválido o expirado"}, 401)

    try:
        termino = request.args.get('q', '').strip()
        tipo = request.args.get('tipo', 'Servicio')
        limit = int(request.args.get('limit', 20))

        conn = get_connection()
        cur = conn.cursor()

        resultados = []
        
        if tipo == 'Servicio':
            # Buscar tratamientos
            cur.execute("""
                SELECT id_tratamiento as id, nombre_tratamiento as nombre, descripcion, costo_base as precio
                FROM tratamientos
                WHERE nombre_tratamiento ILIKE %s
                ORDER BY nombre_tratamiento
                LIMIT %s
            """, (f'%{termino}%', limit))
            
            tratamientos = cur.fetchall()
            for t in tratamientos:
                resultados.append({
                    'id': t['id'],
                    'nombre': t['nombre'],
                    'descripcion': t['descripcion'],
                    'precio': float(t['precio']) if t['precio'] else 0,
                    'tipo': 'Servicio'
                })
        
        elif tipo == 'Producto':
            # Buscar productos
            cur.execute("""
                SELECT id_producto as id, nombre_producto as nombre, descripcion, costo_unitario as precio
                FROM productos
                WHERE nombre_producto ILIKE %s AND stock > 0
                ORDER BY nombre_producto
                LIMIT %s
            """, (f'%{termino}%', limit))
            
            productos = cur.fetchall()
            for p in productos:
                resultados.append({
                    'id': p['id'],
                    'nombre': p['nombre'],
                    'descripcion': p['descripcion'],
                    'precio': float(p['precio']) if p['precio'] else 0,
                    'tipo': 'Producto'
                })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "servicios": resultados,
            "total": len(resultados)
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al buscar servicios: {str(e)}"}, 500)

@functions_framework.http
def presupuestos(request):
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
            if action in ('list', 'presupuestos'):
                return handle_list_presupuestos(request)
            elif action in ('buscar_servicios', 'search_services'):
                return handle_buscar_servicios(request)
            else:
                return json_response({"error": "Acción GET no válida. Use action=list o buscar_servicios"}, 400)

        if request.method == 'POST':
            if action in ('create', 'crear'):
                return handle_create_presupuesto(request)
            else:
                return json_response({"error": "Acción POST no válida. Use action=create"}, 400)

        if request.method == 'PUT':
            if action in ('update', 'actualizar'):
                return handle_update_presupuesto(request)
            else:
                return json_response({"error": "Acción PUT no válida. Use action=update"}, 400)

        if request.method == 'DELETE':
            if action in ('delete', 'eliminar'):
                return handle_delete_presupuesto(request)
            else:
                return json_response({"error": "Acción DELETE no válida. Use action=delete"}, 400)

        return json_response({"error": "Método no soportado"}, 405)
    except Exception as e:
        return json_response({"error": f"Error interno: {str(e)}"}, 500)
