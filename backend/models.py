# https://github.com/musikito/python/blob/main/fastAPI/fastAPI_React/backend/models.py
from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    DateTime,
    Date,
    Time,
    Float,
)
from sqlalchemy.orm import relationship
from datetime import datetime

# Importamos desde database.py la clase Base
from database import Base

class Transaction(Base):
    __tablename__ = "transacciones"
    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(
        String(255), ForeignKey("cajeros.rut_cajero")
    )  # id de la tabla cajeros
    fecha = Column(Date)
    hora = Column(Time)
    fechahora = Column(DateTime, unique=True)
    idconsulta = Column(Integer)  # id de la tabla consultas
    tipoconsulta = Column(String(255))
    medico = Column(
        String(255), ForeignKey("medicos.rut_medico")
    )  # id de la tabla medicos
    idpaciente = Column(Integer)  # id de la tabla pacientes
    prevision = Column(String(255))
    iddetalle = Column(Integer)  # id de la tabla detalle
    detalle = Column(String(255))
    abono = Column(Float)
    devolucion = Column(Float)
    mpago = Column(Float)
    tbono = Column(String(255))
    pagacon = Column(String(255))
    isapre = Column(String(255))
    numbono = Column(String(255))
    voucher = Column(String(255))
    numboleta = Column(String(255))
    notadecredito = Column(Integer)
    monto = Column(Integer)
    fechagarantia = Column(Date)
    estado = Column(Integer)
    totalPago = Column(Integer)
    totalBonif = Column(Integer)
    totalSeg = Column(Integer)
    totalCopago = Column(Integer)
    numero_mes = Column(Integer)
    nombre_mes = Column(String(255))
    trimestre = Column(Integer)
    semestre = Column(Integer)
    anio = Column(Integer)
    
    medico_rel = relationship("Medicos", backref="transacciones")
    cajero_rel = relationship("Cajeros", backref="transacciones")


class Cajeros(Base):
    __tablename__ = "cajeros"
    rut_cajero = Column(String(255), primary_key=True)
    nombre_cajero = Column(String(255))
    
class Medicos(Base):
    __tablename__ = "medicos"
    rut_medico = Column(String(255), primary_key=True)
    nombre_medico = Column(String(255))
