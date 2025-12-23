"""
Remove duplicate lowercase columns from user table
"""

import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:razaib@localhost:5432/fishera")

def fix_columns():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # Drop duplicate lowercase columns
        columns_to_drop = [
            "isbuyer",
            "isseller",
            "sellerverified"
        ]

        for column_name in columns_to_drop:
            try:
                cursor.execute(f'ALTER TABLE "user" DROP COLUMN "{column_name}";')
                print(f"[OK] Dropped duplicate column: {column_name}")
            except psycopg2.errors.UndefinedColumn:
                print(f"[SKIP] Column doesn't exist: {column_name}")
            except Exception as e:
                print(f"[ERROR] Error dropping column {column_name}: {e}")

        conn.commit()
        cursor.close()
        conn.close()

        print("\n[SUCCESS] Duplicate columns removed!")

    except Exception as e:
        print(f"[ERROR] Database error: {e}")

if __name__ == "__main__":
    fix_columns()
