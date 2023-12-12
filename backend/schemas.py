from pydantic import BaseModel
from datetime import date, time, datetime


class TransactionCreate(BaseModel):
    id: int
    usuario: str
    fecha: date
    hora: time
    fechahora: datetime
    idconsulta: int
    tipoconsulta: str
    medico_id: str
    idpaciente: int
    prevision: str
    iddetalle: int
    detalle: str
    abono: float
    devolucion: float
    mpago: float
    tbono: str
    pagacon: str
    isapre: str
    numbono: str
    voucher: str
    numboleta: str
    notadecredito: int
    monto: int
    fechagarantia: date
    estado: int
    totalPago: int
    totalBonif: int
    totalSeg: int
    totalCopago: int
    numero_mes: int
    nombre_mes: str
    trimestre: int
    semestre: int


class Transaction(TransactionCreate):
    id: int

    class Config:
        orm_mode = True


class MedicosBase(BaseModel):
    rut_medico: str
    nombre_medico: str


class CajerosBase(BaseModel):
    rut_cajero: str
    nombre_cajero: str


class Medicos(MedicosBase):
    class Config:
        orm_mode = True


class Cajeros(CajerosBase):
    class Config:
        orm_mode = True
