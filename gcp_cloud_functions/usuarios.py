import functions_framework
import psycopg2
import json

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
        sslmode=PGSSLMODE
    )
    return conn

def insertar(request,headers):
    pass
    #aquí se escriribirá el código

def obtener(request,headers):
    pass
    #aquí se escribirá el código

def actualizar(request,headers):
    pass
    #código

@functions_framework.http
def hello_http(request):

    headers={
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Methods":"GET,POST,PUT,OPTIONS",
        "Access-Control-Allow-Headers":"Content-Type"
    }

    if request.method == "OPTIONS":
            return("",400,headers)
    
    try:
        if request.method == "POST":
            return insertar(request,headers)
        elif request.method == "GET":
            return obtener(request,headers)
        elif request.method == "PUT":
            return actualizar(request,headers)
        else:
            return (json.dumps({"error":"method unsupported"}),404,headers)
    except Exception as e:
        return (json.dumps({"error":str(e)}),500,headers)