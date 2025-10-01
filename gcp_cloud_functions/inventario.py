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

# ===== PRODUCTOS =====
def obtener_productos(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        conn = get_connection()
        cur = conn.cursor()

        # Filtros
        tipo = request.args.get('tipo', '')
        categoria = request.args.get('categoria', '')
        almacen = request.args.get('almacen', '')
        alerta_stock = request.args.get('alerta_stock', 'false').lower() == 'true'
        search = request.args.get('search', '')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))

        # Query base
        base_query = """
            SELECT p.id_producto, p.nombre_producto, p.descripcion, p.stock, 
                   p.proveedor, p.costo_unitario, p.stock_minimo
            FROM productos p
            WHERE 1=1
        """
        params = []

        # Aplicar filtros
        if search:
            base_query += " AND (p.nombre_producto ILIKE %s OR p.descripcion ILIKE %s)"
            params.extend([f'%{search}%', f'%{search}%'])

        if alerta_stock:
            base_query += " AND p.stock <= p.stock_minimo"

        # Contar total
        count_query = f"SELECT COUNT(*) as total FROM ({base_query}) as filtered"
        cur.execute(count_query, params)
        total = cur.fetchone()['total']

        # Aplicar paginación
        offset = (page - 1) * limit
        base_query += " ORDER BY p.nombre_producto ASC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cur.execute(base_query, params)
        rows = cur.fetchall()

        productos = []
        for row in rows:
            productos.append({
                "id": row['id_producto'],
                "nombre": row['nombre_producto'],
                "descripcion": row['descripcion'] or '',
                "stock": row['stock'],
                "stock_minimo": row['stock_minimo'] or 0,
                "proveedor": row['proveedor'] or '',
                "costo_unitario": float(row['costo_unitario']) if row['costo_unitario'] else 0,
                "alerta_stock": row['stock'] <= (row['stock_minimo'] or 0)
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "productos": productos,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "totalPages": (total + limit - 1) // limit
            }
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener productos: {str(e)}"}, 500)

def crear_producto(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        
        nombre = data.get('nombre', '').strip()
        if not nombre:
            return json_response({"error": "El nombre del producto es requerido"}, 400)

        descripcion = data.get('descripcion', '').strip()
        stock = int(data.get('stock', 0))
        stock_minimo = int(data.get('stock_minimo', 0))
        proveedor = data.get('proveedor', '').strip()
        costo_unitario = float(data.get('costo_unitario', 0))

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO productos (nombre_producto, descripcion, stock, stock_minimo, proveedor, costo_unitario)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id_producto, nombre_producto
        """, (nombre, descripcion, stock, stock_minimo, proveedor, costo_unitario))

        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "producto": {
                "id": result['id_producto'],
                "nombre": result['nombre_producto']
            }
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear producto: {str(e)}"}, 500)

# ===== COMPRAS =====
def obtener_compras(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        conn = get_connection()
        cur = conn.cursor()

        search = request.args.get('search', '')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))

        # Query base para órdenes de compra
        base_query = """
            SELECT oc.id_orden, oc.nombre_interno, oc.fecha_creacion, oc.fecha_entrega,
                   oc.fecha_pago, oc.estado, oc.monto_total, oc.proveedor, oc.nota_interna
            FROM ordenes_compra oc
            WHERE 1=1
        """
        params = []

        if search:
            base_query += " AND (oc.nombre_interno ILIKE %s OR oc.proveedor ILIKE %s)"
            params.extend([f'%{search}%', f'%{search}%'])

        # Contar total
        count_query = f"SELECT COUNT(*) as total FROM ({base_query}) as filtered"
        cur.execute(count_query, params)
        total = cur.fetchone()['total']

        # Aplicar paginación
        offset = (page - 1) * limit
        base_query += " ORDER BY oc.fecha_creacion DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cur.execute(base_query, params)
        rows = cur.fetchall()

        compras = []
        for row in rows:
            compras.append({
                "id": row['id_orden'],
                "nombre_interno": row['nombre_interno'],
                "fecha_creacion": row['fecha_creacion'].isoformat() if row['fecha_creacion'] else None,
                "fecha_entrega": row['fecha_entrega'].isoformat() if row['fecha_entrega'] else None,
                "fecha_pago": row['fecha_pago'].isoformat() if row['fecha_pago'] else None,
                "estado": row['estado'],
                "monto_total": float(row['monto_total']) if row['monto_total'] else 0,
                "proveedor": row['proveedor'],
                "nota_interna": row['nota_interna']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "compras": compras,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "totalPages": (total + limit - 1) // limit
            }
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener compras: {str(e)}"}, 500)

def crear_compra(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        
        nombre_interno = data.get('nombre_interno', '').strip()
        if not nombre_interno:
            return json_response({"error": "El nombre interno es requerido"}, 400)

        proveedor = data.get('proveedor', '').strip()
        estado = data.get('estado', 'Orden ingresada a almacén')
        monto_total = float(data.get('monto_total', 0))
        nota_interna = data.get('nota_interna', '').strip()

        # Fechas
        fecha_creacion = datetime.datetime.now()
        fecha_entrega = None
        fecha_pago = None
        
        if data.get('fecha_entrega'):
            try:
                fecha_entrega = datetime.datetime.fromisoformat(data['fecha_entrega'].replace('Z', '+00:00'))
            except Exception:
                pass

        if data.get('fecha_pago'):
            try:
                fecha_pago = datetime.datetime.fromisoformat(data['fecha_pago'].replace('Z', '+00:00'))
            except Exception:
                pass

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO ordenes_compra (nombre_interno, proveedor, estado, monto_total, 
                                      fecha_creacion, fecha_entrega, fecha_pago, nota_interna)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id_orden, nombre_interno
        """, (nombre_interno, proveedor, estado, monto_total, fecha_creacion, fecha_entrega, fecha_pago, nota_interna))

        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "compra": {
                "id": result['id_orden'],
                "nombre_interno": result['nombre_interno']
            }
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear compra: {str(e)}"}, 500)

# ===== CONSUMO =====
def obtener_consumos(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        conn = get_connection()
        cur = conn.cursor()

        almacen = request.args.get('almacen', '')
        mes = request.args.get('mes', '')
        search = request.args.get('search', '')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))

        # Query base para consumos
        base_query = """
            SELECT c.id_consumo, c.fecha_consumo, p.nombre_producto, c.fuente, c.tipo,
                   c.lote, c.cantidad, c.paciente, c.servicio, c.comentario, c.estado
            FROM consumos c
            LEFT JOIN productos p ON c.id_producto = p.id_producto
            WHERE 1=1
        """
        params = []

        if search:
            base_query += " AND (p.nombre_producto ILIKE %s OR c.paciente ILIKE %s)"
            params.extend([f'%{search}%', f'%{search}%'])

        if almacen and almacen != 'Todos':
            base_query += " AND c.almacen = %s"
            params.append(almacen)

        # Contar total
        count_query = f"SELECT COUNT(*) as total FROM ({base_query}) as filtered"
        cur.execute(count_query, params)
        total = cur.fetchone()['total']

        # Aplicar paginación
        offset = (page - 1) * limit
        base_query += " ORDER BY c.fecha_consumo DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cur.execute(base_query, params)
        rows = cur.fetchall()

        consumos = []
        for row in rows:
            consumos.append({
                "id": row['id_consumo'],
                "fecha_consumo": row['fecha_consumo'].isoformat() if row['fecha_consumo'] else None,
                "producto": row['nombre_producto'],
                "fuente": row['fuente'],
                "tipo": row['tipo'],
                "lote": row['lote'],
                "cantidad": float(row['cantidad']) if row['cantidad'] else 0,
                "paciente": row['paciente'],
                "servicio": row['servicio'],
                "comentario": row['comentario'],
                "estado": row['estado']
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "consumos": consumos,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "totalPages": (total + limit - 1) // limit
            }
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener consumos: {str(e)}"}, 500)

def crear_consumo(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        
        id_producto = data.get('id_producto')
        if not id_producto:
            return json_response({"error": "El producto es requerido"}, 400)

        cantidad = float(data.get('cantidad', 0))
        if cantidad <= 0:
            return json_response({"error": "La cantidad debe ser mayor a 0"}, 400)

        lote = data.get('lote', '').strip()
        almacen = data.get('almacen', 'Principal')
        paciente = data.get('paciente', '').strip()
        servicio = data.get('servicio', '').strip()
        comentario = data.get('comentario', '').strip()
        estado = data.get('estado', 'Confirmada')

        conn = get_connection()
        cur = conn.cursor()

        # Crear el consumo
        cur.execute("""
            INSERT INTO consumos (id_producto, lote, cantidad, almacen, paciente, servicio, comentario, estado, fecha_consumo)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id_consumo
        """, (id_producto, lote, cantidad, almacen, paciente, servicio, comentario, estado, datetime.datetime.now()))

        result = cur.fetchone()

        # Actualizar stock del producto
        cur.execute("""
            UPDATE productos 
            SET stock = stock - %s 
            WHERE id_producto = %s
        """, (cantidad, id_producto))

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "consumo": {
                "id": result['id_consumo']
            }
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear consumo: {str(e)}"}, 500)

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
        section = (request.args.get('section') or '').lower()

        if request.method == 'GET':
            if section == 'productos' or action == 'productos':
                return obtener_productos(request)
            elif section == 'compras' or action == 'compras':
                return obtener_compras(request)
            elif section == 'consumo' or action == 'consumo':
                return obtener_consumos(request)
            else:
                return json_response({"error": "Sección no válida. Use section=productos, compras o consumo"}, 400)

        elif request.method == 'POST':
            if section == 'productos' or action == 'productos':
                return crear_producto(request)
            elif section == 'compras' or action == 'compras':
                return crear_compra(request)
            elif section == 'consumo' or action == 'consumo':
                return crear_consumo(request)
            else:
                return json_response({"error": "Sección no válida para POST. Use section=productos, compras o consumo"}, 400)

        else:
            return json_response({"error": "Método no soportado"}, 405)

    except Exception as e:
        return json_response({"error": f"Error interno: {str(e)}"}, 500)
