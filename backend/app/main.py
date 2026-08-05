from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.database.database import criar_tabelas



# =====================================
# IMPORT ROUTERS
# =====================================

from app.api.routes import (
    root,
    health,
    version,
    auth,
    users,
    leads,
    crm,
    dashboard,
    ranking,
    pipeline,
    followups,
    historico,
    importer
)


from app.api import jobs





# =====================================
# BANCO
# =====================================

try:

    criar_tabelas()

    print(
        "Banco inicializado com sucesso"
    )


except Exception as erro:

    print(
        "Erro ao iniciar banco:",
        erro
    )







# =====================================
# FASTAPI
# =====================================

app = FastAPI(

    title="LeadHunter Enterprise",

    version="1.0.0",

    description="Sistema CRM Comercial de Leads"

)







# =====================================
# CORS
# =====================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:5173",

        "http://127.0.0.1:5173"

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)








# =====================================
# REGISTRADOR SEGURO
# =====================================

def registrar_router(

    modulo,

    prefix=None

):


    if hasattr(

        modulo,

        "router"

    ):


        if prefix:


            app.include_router(

                modulo.router,

                prefix=prefix

            )


        else:


            app.include_router(

                modulo.router

            )



        print(

            "Router carregado:",

            modulo.__name__

        )



    else:


        print(

            "Router ignorado:",

            modulo.__name__

        )









# =====================================
# ROTAS PRINCIPAIS
# =====================================


registrar_router(

    root

)



registrar_router(

    health

)



registrar_router(

    version

)



registrar_router(

    auth,

    "/auth"

)



registrar_router(

    users,

    "/users"

)



registrar_router(

    leads,

    "/leads"

)



registrar_router(

    crm,

    "/crm"

)



# Dashboard

registrar_router(

    dashboard,

    "/dashboard"

)



# Ranking

registrar_router(

    ranking,

    "/dashboard"

)



# Pipeline CRM

registrar_router(

    pipeline,

    "/pipeline"

)



# Followups

registrar_router(

    followups

)



# Histórico

registrar_router(

    historico

)



# Importação

registrar_router(

    importer

)



# Jobs

registrar_router(

    jobs,

    "/jobs"

)







# =====================================
# HEALTH CHECK
# =====================================

@app.get("/")

def home():

    return {

        "status": "online",

        "sistema": "LeadHunter Enterprise"

    }




@app.get("/health")

def health_check():

    return {

        "status": "ok"

    }