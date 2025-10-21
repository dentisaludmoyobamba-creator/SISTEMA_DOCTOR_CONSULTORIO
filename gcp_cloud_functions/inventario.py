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
        tipo_id = request.args.get('tipo', '')
        categoria_id = request.args.get('categoria', '')
        alerta_stock = request.args.get('alerta_stock', 'false').lower() == 'true'
        search = request.args.get('search', '')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))

        # Query base con JOIN a tipos y categorías
        base_query = """
            SELECT p.id_producto, p.nombre_producto, p.descripcion, p.stock, 
                   p.proveedor, p.costo_unitario, p.stock_minimo,
                   p.id_tipo, p.id_categoria,
                   t.nombre as tipo_nombre, c.nombre as categoria_nombre
            FROM productos p
            LEFT JOIN tipos_producto t ON p.id_tipo = t.id_tipo
            LEFT JOIN categorias_producto c ON p.id_categoria = c.id_categoria
            WHERE 1=1
        """
        params = []

        # Aplicar filtros
        if search:
            base_query += " AND (p.nombre_producto ILIKE %s OR p.descripcion ILIKE %s)"
            params.extend([f'%{search}%', f'%{search}%'])

        if tipo_id and tipo_id != 'Ver todos':
            base_query += " AND p.id_tipo = %s"
            params.append(int(tipo_id))

        if categoria_id and categoria_id != 'Ver todos':
            base_query += " AND p.id_categoria = %s"
            params.append(int(categoria_id))

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
                "id_tipo": row['id_tipo'],
                "tipo": row['tipo_nombre'],
                "id_categoria": row['id_categoria'],
                "categoria": row['categoria_nombre'],
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
        id_tipo = data.get('id_tipo')
        id_categoria = data.get('id_categoria')

        conn = get_connection()
        cur = conn.cursor()

        # Insertar el producto con stock = 0 (el trigger lo actualizará)
        cur.execute("""
            INSERT INTO productos (nombre_producto, descripcion, stock, stock_minimo, proveedor, costo_unitario, id_tipo, id_categoria)
            VALUES (%s, %s, 0, %s, %s, %s, %s, %s)
            RETURNING id_producto, nombre_producto
        """, (nombre, descripcion, stock_minimo, proveedor, costo_unitario, id_tipo, id_categoria))

        result = cur.fetchone()
        id_producto_nuevo = result['id_producto']
        nombre_producto = result['nombre_producto']

        # Si el stock inicial es mayor a 0, registrar movimiento de entrada
        # El trigger actualizar_stock_producto() se encargará de sumar el stock automáticamente
        if stock > 0:
            id_usuario = payload.get('user_id', 1)  # Obtener ID del usuario del token
            
            cur.execute("""
                INSERT INTO movimientos_inventario 
                (id_producto, tipo_movimiento, cantidad, motivo, id_usuario, costo_unitario, proveedor)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                id_producto_nuevo,
                'entrada',
                stock,
                f'Stock inicial del producto "{nombre_producto}"',
                id_usuario,
                costo_unitario if costo_unitario > 0 else None,
                proveedor if proveedor else None
            ))

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "producto": {
                "id": id_producto_nuevo,
                "nombre": nombre_producto
            },
            "movimiento_registrado": stock > 0,
            "stock_final": stock
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

def obtener_detalles_orden(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        orden_id = request.args.get('id')
        if not orden_id:
            return json_response({"error": "ID de orden requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Obtener datos de la orden
        cur.execute("""
            SELECT id_orden, nombre_interno, proveedor, estado, monto_total,
                   fecha_creacion, fecha_entrega, fecha_pago, nota_interna
            FROM ordenes_compra
            WHERE id_orden = %s
        """, (orden_id,))
        
        orden_row = cur.fetchone()
        if not orden_row:
            return json_response({"error": "Orden no encontrada"}, 404)

        # Obtener items de la orden
        cur.execute("""
            SELECT i.id_item, i.cantidad, i.lote, i.precio_unitario, i.subtotal,
                   i.fecha_vencimiento, i.fecha_creacion,
                   p.nombre_producto, p.id_producto
            FROM items_orden_compra i
            JOIN productos p ON i.id_producto = p.id_producto
            WHERE i.id_orden = %s
            ORDER BY i.fecha_creacion ASC
        """, (orden_id,))
        
        items_rows = cur.fetchall()
        
        items = []
        for item in items_rows:
            items.append({
                "id": item['id_item'],
                "id_producto": item['id_producto'],
                "nombre_producto": item['nombre_producto'],
                "cantidad": float(item['cantidad']),
                "lote": item['lote'],
                "precio_unitario": float(item['precio_unitario']),
                "subtotal": float(item['subtotal']),
                "fecha_vencimiento": item['fecha_vencimiento'].isoformat() if item['fecha_vencimiento'] else None,
                "fecha_creacion": item['fecha_creacion'].isoformat() if item['fecha_creacion'] else None
            })

        orden = {
            "id": orden_row['id_orden'],
            "nombre_interno": orden_row['nombre_interno'],
            "proveedor": orden_row['proveedor'],
            "estado": orden_row['estado'],
            "monto_total": float(orden_row['monto_total']) if orden_row['monto_total'] else 0,
            "fecha_creacion": orden_row['fecha_creacion'].isoformat() if orden_row['fecha_creacion'] else None,
            "fecha_entrega": orden_row['fecha_entrega'].isoformat() if orden_row['fecha_entrega'] else None,
            "fecha_pago": orden_row['fecha_pago'].isoformat() if orden_row['fecha_pago'] else None,
            "nota_interna": orden_row['nota_interna'],
            "items": items
        }

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "orden": orden
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener detalles de orden: {str(e)}"}, 500)

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
        items = data.get('items', [])  # Lista de items de la orden

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

        # Insertar la orden de compra
        cur.execute("""
            INSERT INTO ordenes_compra (nombre_interno, proveedor, estado, monto_total, 
                                      fecha_creacion, fecha_entrega, fecha_pago, nota_interna)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id_orden, nombre_interno
        """, (nombre_interno, proveedor, estado, monto_total, fecha_creacion, fecha_entrega, fecha_pago, nota_interna))

        result = cur.fetchone()
        id_orden = result['id_orden']
        nombre_orden = result['nombre_interno']

        # Insertar los items de la orden y crear movimientos de inventario
        items_creados = 0
        movimientos_creados = 0
        id_usuario = payload.get('user_id', 1)

        for item in items:
            id_producto = item.get('id_producto')
            cantidad = float(item.get('cantidad', 0))
            lote = item.get('lote', '').strip() or None
            precio_unitario = float(item.get('precio_unitario', 0))
            subtotal = float(item.get('subtotal', 0))
            fecha_venc = item.get('fecha_vencimiento')

            if not id_producto or cantidad <= 0 or precio_unitario <= 0:
                continue  # Saltar items inválidos

            # Insertar item de la orden
            cur.execute("""
                INSERT INTO items_orden_compra 
                (id_orden, id_producto, cantidad, lote, precio_unitario, subtotal, fecha_vencimiento)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (id_orden, id_producto, cantidad, lote, precio_unitario, subtotal, fecha_venc))
            items_creados += 1

            # Si el estado es "Orden ingresada a almacén", crear movimiento de entrada
            if estado == 'Orden ingresada a almacén':
                # Obtener nombre del producto
                cur.execute("SELECT nombre_producto FROM productos WHERE id_producto = %s", (id_producto,))
                producto_row = cur.fetchone()
                nombre_producto = producto_row['nombre_producto'] if producto_row else f'Producto {id_producto}'

                cur.execute("""
                    INSERT INTO movimientos_inventario 
                    (id_producto, tipo_movimiento, cantidad, motivo, id_usuario, costo_unitario, proveedor, numero_factura)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    id_producto,
                    'entrada',
                    cantidad,
                    f'Ingreso por orden de compra "{nombre_orden}" - Lote: {lote or "N/A"}',
                    id_usuario,
                    precio_unitario,
                    proveedor,
                    f'OC-{id_orden}'
                ))
                movimientos_creados += 1

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "compra": {
                "id": id_orden,
                "nombre_interno": nombre_orden
            },
            "items_creados": items_creados,
            "movimientos_creados": movimientos_creados
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
            SELECT c.id_consumo, c.fecha_consumo, c.id_producto, p.nombre_producto, 
                   c.fuente, c.tipo, c.lote, c.cantidad, c.almacen, c.paciente, 
                   c.servicio, c.comentario, c.estado
            FROM consumos c
            LEFT JOIN productos p ON c.id_producto = p.id_producto
            WHERE 1=1
        """
        params = []

        if search:
            base_query += " AND (p.nombre_producto ILIKE %s OR c.paciente ILIKE %s)"
            params.extend([f'%{search}%', f'%{search}%'])

        if almacen and almacen not in ('Todos', 'Ver todos'):
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
                "id_producto": row['id_producto'],
                "fecha_consumo": row['fecha_consumo'].isoformat() if row['fecha_consumo'] else None,
                "producto": row['nombre_producto'],
                "fuente": row['fuente'],
                "tipo": row['tipo'],
                "lote": row['lote'],
                "cantidad": float(row['cantidad']) if row['cantidad'] else 0,
                "almacen": row['almacen'],
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

        fuente = data.get('fuente', '').strip()
        tipo = data.get('tipo', '').strip()
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
            INSERT INTO consumos (id_producto, fuente, tipo, lote, cantidad, almacen, paciente, servicio, comentario, estado, fecha_consumo)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id_consumo
        """, (id_producto, fuente, tipo, lote, cantidad, almacen, paciente, servicio, comentario, estado, datetime.datetime.now()))

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

def actualizar_consumo(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        
        id_consumo = data.get('id_consumo')
        if not id_consumo:
            return json_response({"error": "El ID del consumo es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Obtener consumo actual para calcular diferencia de stock
        cur.execute("""
            SELECT id_producto, cantidad 
            FROM consumos 
            WHERE id_consumo = %s
        """, (id_consumo,))
        consumo_actual = cur.fetchone()

        if not consumo_actual:
            cur.close()
            conn.close()
            return json_response({"error": "Consumo no encontrado"}, 404)

        # Calcular nueva cantidad y diferencia
        cantidad_anterior = float(consumo_actual['cantidad'])
        cantidad_nueva = float(data.get('cantidad', cantidad_anterior))
        diferencia = cantidad_nueva - cantidad_anterior

        # Actualizar consumo
        cur.execute("""
            UPDATE consumos 
            SET fuente = %s, tipo = %s, lote = %s, cantidad = %s, 
                paciente = %s, servicio = %s, comentario = %s, estado = %s
            WHERE id_consumo = %s
        """, (
            data.get('fuente', '').strip(),
            data.get('tipo', '').strip(),
            data.get('lote', '').strip(),
            cantidad_nueva,
            data.get('paciente', '').strip(),
            data.get('servicio', '').strip(),
            data.get('comentario', '').strip(),
            data.get('estado', 'Confirmada'),
            id_consumo
        ))

        # Ajustar stock del producto si cambió la cantidad
        if diferencia != 0:
            cur.execute("""
                UPDATE productos 
                SET stock = stock - %s 
                WHERE id_producto = %s
            """, (diferencia, consumo_actual['id_producto']))

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Consumo actualizado exitosamente"
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al actualizar consumo: {str(e)}"}, 500)

def eliminar_consumo(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        id_consumo = request.args.get('id')
        if not id_consumo:
            return json_response({"error": "El ID del consumo es requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Obtener datos del consumo antes de eliminar
        cur.execute("""
            SELECT id_producto, cantidad 
            FROM consumos 
            WHERE id_consumo = %s
        """, (id_consumo,))
        consumo = cur.fetchone()

        if not consumo:
            cur.close()
            conn.close()
            return json_response({"error": "Consumo no encontrado"}, 404)

        # Devolver stock al producto
        cur.execute("""
            UPDATE productos 
            SET stock = stock + %s 
            WHERE id_producto = %s
        """, (consumo['cantidad'], consumo['id_producto']))

        # Eliminar consumo
        cur.execute("DELETE FROM consumos WHERE id_consumo = %s", (id_consumo,))

        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Consumo eliminado exitosamente"
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al eliminar consumo: {str(e)}"}, 500)

# ===== TIPOS DE PRODUCTO =====
def obtener_tipos(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT id_tipo, nombre, descripcion
            FROM tipos_producto
            WHERE activo = true
            ORDER BY nombre ASC
        """)
        
        tipos = []
        for row in cur.fetchall():
            tipos.append({
                "id": row['id_tipo'],
                "nombre": row['nombre'],
                "descripcion": row['descripcion'] or ''
            })

        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "tipos": tipos
        })

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener tipos: {str(e)}"}, 500)

# ===== CATEGORÍAS DE PRODUCTO =====
def obtener_categorias(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT id_categoria, nombre, descripcion
            FROM categorias_producto
            WHERE activo = true
            ORDER BY nombre ASC
        """)
        
        categorias = []
        for row in cur.fetchall():
            categorias.append({
                "id": row['id_categoria'],
                "nombre": row['nombre'],
                "descripcion": row['descripcion'] or ''
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

def crear_categoria(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        
        nombre = data.get('nombre', '').strip()
        if not nombre:
            return json_response({"error": "El nombre de la categoría es requerido"}, 400)

        descripcion = data.get('descripcion', '').strip()

        conn = get_connection()
        cur = conn.cursor()

        # Verificar si ya existe
        cur.execute("SELECT id_categoria FROM categorias_producto WHERE nombre = %s", (nombre,))
        if cur.fetchone():
            return json_response({"error": "Ya existe una categoría con ese nombre"}, 400)

        cur.execute("""
            INSERT INTO categorias_producto (nombre, descripcion)
            VALUES (%s, %s)
            RETURNING id_categoria, nombre
        """, (nombre, descripcion))

        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "categoria": {
                "id": result['id_categoria'],
                "nombre": result['nombre']
            }
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear categoría: {str(e)}"}, 500)

def eliminar_categoria(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        categoria_id = request.args.get('id')
        if not categoria_id:
            return json_response({"error": "ID de categoría requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Verificar si hay productos con esta categoría
        cur.execute("SELECT COUNT(*) as total FROM productos WHERE id_categoria = %s", (categoria_id,))
        count = cur.fetchone()['total']
        
        if count > 0:
            return json_response({"error": f"No se puede eliminar. Hay {count} producto(s) con esta categoría"}, 400)

        # Marcar como inactiva en lugar de eliminar
        cur.execute("""
            UPDATE categorias_producto 
            SET activo = false
            WHERE id_categoria = %s
        """, (categoria_id,))
        
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Categoría eliminada exitosamente"
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al eliminar categoría: {str(e)}"}, 500)

def crear_tipo(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        
        nombre = data.get('nombre', '').strip()
        if not nombre:
            return json_response({"error": "El nombre del tipo es requerido"}, 400)

        descripcion = data.get('descripcion', '').strip()

        conn = get_connection()
        cur = conn.cursor()

        # Verificar si ya existe
        cur.execute("SELECT id_tipo FROM tipos_producto WHERE nombre = %s", (nombre,))
        if cur.fetchone():
            return json_response({"error": "Ya existe un tipo con ese nombre"}, 400)

        cur.execute("""
            INSERT INTO tipos_producto (nombre, descripcion)
            VALUES (%s, %s)
            RETURNING id_tipo, nombre
        """, (nombre, descripcion))

        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "tipo": {
                "id": result['id_tipo'],
                "nombre": result['nombre']
            }
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear tipo: {str(e)}"}, 500)

def eliminar_tipo(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        tipo_id = request.args.get('id')
        if not tipo_id:
            return json_response({"error": "ID de tipo requerido"}, 400)

        conn = get_connection()
        cur = conn.cursor()

        # Verificar si hay productos con este tipo
        cur.execute("SELECT COUNT(*) as total FROM productos WHERE id_tipo = %s", (tipo_id,))
        count = cur.fetchone()['total']
        
        if count > 0:
            return json_response({"error": f"No se puede eliminar. Hay {count} producto(s) con este tipo"}, 400)

        # Marcar como inactivo en lugar de eliminar
        cur.execute("""
            UPDATE tipos_producto 
            SET activo = false
            WHERE id_tipo = %s
        """, (tipo_id,))
        
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "success": True,
            "message": "Tipo eliminado exitosamente"
        })

    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al eliminar tipo: {str(e)}"}, 500)

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
            elif section == 'orden_detalles' or action == 'orden_detalles':
                return obtener_detalles_orden(request)
            elif section == 'consumo' or action == 'consumo':
                return obtener_consumos(request)
            elif section == 'tipos' or action == 'tipos':
                return obtener_tipos(request)
            elif section == 'categorias' or action == 'categorias':
                return obtener_categorias(request)
            else:
                return json_response({"error": "Sección no válida. Use section=productos, compras, orden_detalles, consumo, tipos o categorias"}, 400)

        elif request.method == 'POST':
            if section == 'productos' or action == 'productos':
                return crear_producto(request)
            elif section == 'compras' or action == 'compras':
                return crear_compra(request)
            elif section == 'consumo' or action == 'consumo':
                return crear_consumo(request)
            elif section == 'categorias' or action == 'categorias':
                return crear_categoria(request)
            elif section == 'tipos' or action == 'tipos':
                return crear_tipo(request)
            else:
                return json_response({"error": "Sección no válida para POST. Use section=productos, compras, consumo, categorias o tipos"}, 400)

        elif request.method == 'PUT':
            if section == 'consumo' or action == 'consumo':
                return actualizar_consumo(request)
            else:
                return json_response({"error": "Sección no válida para PUT. Use section=consumo"}, 400)

        elif request.method == 'DELETE':
            if section == 'categorias' or action == 'categorias':
                return eliminar_categoria(request)
            elif section == 'tipos' or action == 'tipos':
                return eliminar_tipo(request)
            elif section == 'consumo' or action == 'consumo':
                return eliminar_consumo(request)
            else:
                return json_response({"error": "Sección no válida para DELETE. Use section=categorias, tipos o consumo"}, 400)

        else:
            return json_response({"error": "Método no soportado"}, 405)

    except Exception as e:
        return json_response({"error": f"Error interno: {str(e)}"}, 500)
