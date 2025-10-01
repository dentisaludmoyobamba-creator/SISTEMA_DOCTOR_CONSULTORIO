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
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
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

def handle_list(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    date_str = (request.args.get('date') or datetime.date.today().isoformat())
    tx_type = (request.args.get('type') or 'all').lower()
    try:
        target_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
    except Exception:
        return json_response({"error": "Parámetro date inválido (YYYY-MM-DD)"}, 400)

    start_dt = datetime.datetime.combine(target_date, datetime.time.min)
    end_dt = datetime.datetime.combine(target_date, datetime.time.max)

    try:
        conn = get_connection()
        cur = conn.cursor()

        base = (
            "SELECT tf.id_transaccion, tf.tipo_transaccion, tf.concepto, tf.monto, tf.medio_pago, tf.referencia_pago, "
            "tf.fecha_transaccion, tf.comentario, tf.estado, d.nombres as doctor_nombres, d.apellidos as doctor_apellidos, "
            "p.nombres as paciente_nombres, p.apellidos as paciente_apellidos "
            "FROM transacciones_financieras tf "
            "LEFT JOIN doctores d ON tf.id_doctor = d.id_doctor "
            "LEFT JOIN pacientes p ON tf.id_paciente = p.id_paciente "
            "WHERE tf.fecha_transaccion BETWEEN %s AND %s "
        )
        params = [start_dt, end_dt]
        if tx_type in ('ingreso', 'egreso'):
            base += "AND tf.tipo_transaccion = %s "
            params.append(tx_type)
        base += "ORDER BY tf.fecha_transaccion ASC"

        cur.execute(base, params)
        rows = cur.fetchall()

        def map_row(r):
            doctor_name = None
            if r['doctor_nombres']:
                doctor_name = f"{r['doctor_nombres']} {r['doctor_apellidos'] or ''}".strip()
            paciente_name = None
            if r['paciente_nombres']:
                paciente_name = f"{r['paciente_nombres']} {r['paciente_apellidos'] or ''}".strip()
            return {
                "id": r['id_transaccion'],
                "hora": r['fecha_transaccion'].strftime('%H:%M'),
                "doctor": doctor_name or '--',
                "paciente": paciente_name or '--',
                "concepto": r['concepto'],
                "medioPago": r['medio_pago'],
                "comentario": r['comentario'],
                "monto": float(r['monto']),
                "tipo": r['tipo_transaccion'],
                "estado": r['estado'] or 'completado'
            }

        data = [map_row(r) for r in rows]
        cur.close()
        conn.close()
        return json_response({"success": True, "transactions": data})
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al listar: {str(e)}"}, 500)

def handle_summary(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    date_str = (request.args.get('date') or datetime.date.today().isoformat())
    try:
        target_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
    except Exception:
        return json_response({"error": "Parámetro date inválido (YYYY-MM-DD)"}, 400)

    month_start = target_date.replace(day=1)
    day_start = datetime.datetime.combine(target_date, datetime.time.min)
    day_end = datetime.datetime.combine(target_date, datetime.time.max)
    month_start_dt = datetime.datetime.combine(month_start, datetime.time.min)
    month_end_dt = day_end

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            "SELECT COALESCE(SUM(monto),0) as total FROM transacciones_financieras WHERE fecha_transaccion BETWEEN %s AND %s AND tipo_transaccion='ingreso'",
            (day_start, day_end)
        )
        ingreso_hoy = float(cur.fetchone()['total'])
        cur.execute(
            "SELECT COALESCE(SUM(monto),0) as total FROM transacciones_financieras WHERE fecha_transaccion BETWEEN %s AND %s AND tipo_transaccion='egreso'",
            (day_start, day_end)
        )
        egreso_hoy = float(cur.fetchone()['total'])

        cur.execute(
            "SELECT COALESCE(SUM(CASE WHEN tipo_transaccion='ingreso' THEN monto ELSE -monto END),0) as balance FROM transacciones_financieras WHERE fecha_transaccion BETWEEN %s AND %s",
            (month_start_dt, month_end_dt)
        )
        balance_mes = float(cur.fetchone()['balance'])

        cur.close()
        conn.close()
        return json_response({
            "success": True,
            "summary": {
                "ingresoHoy": ingreso_hoy,
                "egresoHoy": egreso_hoy,
                "balanceHoy": ingreso_hoy - egreso_hoy,
                "balanceMes": balance_mes
            }
        })
    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al obtener resumen: {str(e)}"}, 500)

def handle_create(request):
    payload = require_auth(request)
    if not payload:
        return json_response({"error": "Token inválido o faltante"}, 401)

    try:
        data = request.get_json(silent=True) or {}
        tipo = (data.get('tipo_transaccion') or '').lower()
        if tipo not in ('ingreso', 'egreso'):
            return json_response({"error": "tipo_transaccion debe ser 'ingreso' o 'egreso'"}, 400)

        concepto = (data.get('concepto') or '').strip() or ('Ingreso' if tipo=='ingreso' else 'Egreso')
        monto = float(data.get('monto') or 0)
        medio_pago = (data.get('medio_pago') or '').strip() or 'efectivo'
        referencia_pago = (data.get('referencia_pago') or '').strip() or None
        comentario = (data.get('comentario') or '').strip() or None
        id_doctor = data.get('id_doctor')
        id_paciente = data.get('id_paciente')
        estado = (data.get('estado') or 'completado')
        fecha_transaccion = None
        if data.get('fecha_transaccion'):
            try:
                fecha_transaccion = datetime.datetime.fromisoformat(data['fecha_transaccion'])
            except Exception:
                fecha_transaccion = None

        conn = get_connection()
        cur = conn.cursor()
        sql = (
            "INSERT INTO transacciones_financieras (tipo_transaccion, id_doctor, id_paciente, concepto, monto, medio_pago, referencia_pago, fecha_transaccion, id_usuario_registro, comentario, estado) "
            "VALUES (%s,%s,%s,%s,%s,%s,%s,COALESCE(%s, CURRENT_TIMESTAMP),%s,%s,%s) RETURNING id_transaccion, fecha_transaccion"
        )
        cur.execute(sql, (
            tipo,
            id_doctor,
            id_paciente,
            concepto,
            monto,
            medio_pago,
            referencia_pago,
            fecha_transaccion,
            payload.get('user_id'),
            comentario,
            estado
        ))
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return json_response({"success": True, "transaction_id": row['id_transaccion'], "fecha_transaccion": row['fecha_transaccion'].isoformat()})
    except Exception as e:
        try:
            conn.rollback()
            conn.close()
        except Exception:
            pass
        return json_response({"error": f"Error al crear: {str(e)}"}, 500)

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
        action = (request.args.get('action') or '').lower()
        if request.method == 'GET':
            if action == 'list':
                return handle_list(request)
            if action == 'summary':
                return handle_summary(request)
            return json_response({"error": "Acción GET no válida. Use action=list o action=summary"}, 400)
        if request.method == 'POST':
            if action == 'create':
                return handle_create(request)
            return json_response({"error": "Acción POST no válida. Use action=create"}, 400)
        return json_response({"error": "Método no soportado"}, 405)
    except Exception as e:
        return json_response({"error": f"Error interno: {str(e)}"}, 500)
