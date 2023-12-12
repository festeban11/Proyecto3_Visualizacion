from sqlalchemy.orm import Session

import models
import schemas


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
