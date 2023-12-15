from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
import models
from sqlalchemy import and_


def create_transactions_bulk(db: Session, transactions_list):
    try:
        for transaction_data in transactions_list:
            db_transaction = models.Transaction(**transaction_data)
            db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return True
    except Exception as e:
        db.rollback()
        print(f"Error creating transaction: {str(e)}")
        return False


def get_doctors(db: Session):
    return db.query(models.Medicos).all()


def get_cajeros(db: Session):
    return db.query(models.Cajeros).all()


def get_payments(db: Session):
    return (
        db.query(models.Transaction)
        .filter(
            models.Transaction.estado != 1,
            models.Transaction.detalle == "Pago",
        )
        .options(joinedload(models.Transaction.medico_rel))
    )


def get_transactions_all(db: Session):
    return (
        db.query(models.Transaction)
        .filter(
            models.Transaction.estado != 1,
        )
        .options(joinedload(models.Transaction.cajero_rel))
    )


def get_transactions_particulares_doc(db: Session):
    return (
        db.query(models.Transaction)
        .filter(
            models.Transaction.estado != 1,
            models.Transaction.prevision == "Particular",
        )
        .options(joinedload(models.Transaction.medico_rel))
    )


def get_atentions(db: Session):
    detalles = ["Pago", "Garantia"]
    return (
        db.query(models.Transaction)
        .filter(
            models.Transaction.estado != 1, models.Transaction.detalle.in_(detalles)
        )
        .options(joinedload(models.Transaction.medico_rel))
    )


def get_transactions_particulares_fonasa(db: Session):
    previsiones = ["Particular", "Fonasa"]
    return db.query(models.Transaction).filter(
        models.Transaction.estado != 1,
        models.Transaction.prevision.in_(previsiones),
    )


def get_venta_insumos(db: Session):
    return (
        db.query(models.Transaction)
        .filter(
            models.Transaction.estado == 0,
            models.Transaction.detalle == "Venta Insumos",
        )
        .options(joinedload(models.Transaction.cajero_rel))
    )
