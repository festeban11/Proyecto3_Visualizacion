from fastapi import FastAPI, Depends, HTTPException
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from fastapi import File, UploadFile
from io import BytesIO
from sqlalchemy.orm import Session

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

    # Convertir a entero los valores de las columnas idconsulta e idpaciente
    df["idconsulta"] = df["idconsulta"].fillna(0)
    df["idpaciente"] = df["idpaciente"].fillna(0)
    df["idconsulta"] = df["idconsulta"].astype(int)
    df["idpaciente"] = df["idpaciente"].astype(int)
    df["fechagarantia"] = pd.to_datetime(df["fechagarantia"], errors="coerce")
    df = df.fillna(0)
    return df
