from fastapi import FastAPI, Depends, HTTPException
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from fastapi import File, UploadFile
from io import BytesIO
from sqlalchemy.orm import Session
from fastapi import Form

# Importamos nuestros paquetes/librerias que hemos creado
import crud
import models
import schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/upload")
async def upload_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        df = pd.read_excel(BytesIO(contents))
        df_processed = process_data(df)
        transactions_list = df_processed.to_dict(orient="records")
        if crud.create_transactions_bulk(db, transactions_list):
            print("Operación exitosa")
        else:
            print("Hubo un error durante la operación")

    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return {"status": "failed", "error_message": str(e)}


def process_data(df):
    # Extraer el mes de la fecha y agregarlo como columna
    df["numero_mes"] = df["fecha"].dt.month
    nombres_meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ]

    # Agregar una columna con los nombres de los meses en español
    df["nombre_mes"] = df["numero_mes"].apply(lambda x: nombres_meses[x - 1])

    # Agregar una columna con el semestre
    df["semestre"] = (df["fecha"].dt.quarter - 1) // 2 + 1

    # Agregar una columna con el trimestre
    df["trimestre"] = df["fecha"].dt.quarter

    df["anio"] = df["fecha"].dt.year

    # Convertir a entero los valores de las columnas idconsulta e idpaciente
    df["idconsulta"] = df["idconsulta"].fillna(0)
    df["idpaciente"] = df["idpaciente"].fillna(0)
    df["idconsulta"] = df["idconsulta"].astype(int)
    df["idpaciente"] = df["idpaciente"].astype(int)
    df["fechagarantia"] = pd.to_datetime(df["fechagarantia"], errors="coerce")
    columna_excluida = df["fechagarantia"]
    df_sin_columna_fechagarantia = df.drop(columns=["fechagarantia"]).apply(
        lambda x: x.fillna(0)
    )
    df = pd.concat([df_sin_columna_fechagarantia, columna_excluida], axis=1)
    return df


@app.get("/get_doctors")
def get_doctors(db: Session = Depends(get_db)):
    return crud.get_doctors(db)


@app.get("/get_cajeros")
def get_cajeros(db: Session = Depends(get_db)):
    return crud.get_cajeros(db)


@app.get("/get_payments_doc")
def get_payments(db: Session = Depends(get_db)):
    query_result = crud.get_payments(db)
    df = pd.read_sql(query_result.statement, con=engine)
    df_payments_doc = (
        df.groupby(["medico", "nombre_medico", "nombre_mes", "anio"])["monto"]
        .sum()
        .reset_index()
    )
    return df_payments_doc.to_dict(orient="records")


@app.get("/get_transactions_caj")
def get_transactions_caj(db: Session = Depends(get_db)):
    query_result = crud.get_transactions_all(db)
    df = pd.read_sql(query_result.statement, con=engine)
    df_transactions_cajero = df.groupby(
        ["usuario", "nombre_cajero", "trimestre", "anio"]
    )["usuario"].count()
    df_transactions_cajero = df_transactions_cajero.reset_index(name="conteo")
    return df_transactions_cajero.to_dict(orient="records")


@app.get("/get_transactions_particulares_doc")
def get_transactions_particulares_doc(db: Session = Depends(get_db)):
    query_result = crud.get_transactions_particulares_doc(db)
    df = pd.read_sql(query_result.statement, con=engine)
    df_transactions_particulares_doc = (
        df.groupby(["medico", "nombre_medico", "nombre_mes", "anio"])
        .agg(monto_sum=("monto", "sum"), conteo=("monto", "count"))
        .reset_index()
    )
    return df_transactions_particulares_doc.to_dict(orient="records")


@app.get("/get_atentions")
def get_atentions(db: Session = Depends(get_db)):
    query_result = crud.get_atentions(db)
    df = pd.read_sql(query_result.statement, con=engine)
    df_atentions = df.groupby(["nombre_mes", "semestre", "anio"])["nombre_mes"].count()
    df_atentions = df_atentions.reset_index(name="conteo")
    return df_atentions.to_dict(orient="records")


@app.get("/get_transactions_particulares_fonasa")
def get_transactions_particulares_fonasa(db: Session = Depends(get_db)):
    query_result = crud.get_transactions_particulares_fonasa(db)
    df = pd.read_sql(query_result.statement, con=engine)
    df_transactions_particulares_fonasa = df.groupby(
        ["prevision", "semestre", "nombre_mes", "anio"]
    )["nombre_mes"].count()
    df_transactions_particulares_fonasa = (
        df_transactions_particulares_fonasa.reset_index(name="conteo")
    )
    return df_transactions_particulares_fonasa.to_dict(orient="records")


@app.get("/get_venta_insumos_cajeros")
def get_venta_insumos(db: Session = Depends(get_db)):
    query_result = crud.get_venta_insumos(db)
    df = pd.read_sql(query_result.statement, con=engine)
    df_venta_insumos = df.groupby(["usuario", "nombre_cajero", "trimestre", "anio"])["usuario"].count()
    df_venta_insumos = df_venta_insumos.reset_index(name="conteo")
    return df_venta_insumos.to_dict(orient="records")

@app.get("/get_atentions_by_doc")
def get_atentions_by_doc(db: Session = Depends(get_db)):
    query_result = crud.get_atentions(db)
    df = pd.read_sql(query_result.statement, con=engine)
    df_atentions = df.groupby(["medico","nombre_medico","semestre","trimestre","nombre_mes","anio"])["idpaciente"].count()
    df_atentions = df_atentions.reset_index(name="conteo")
    return df_atentions.to_dict(orient="records")
