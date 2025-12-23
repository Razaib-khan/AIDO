"""
Add new columns to user table if they don't exist.
Run this to update the existing user table: python migrate_user_columns.py
"""

import psycopg2
from psycopg2 import sql
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:razaib@localhost:5432/fishera")

def migrate():
    """Add new columns to user table"""
    try:
        # Parse connection string
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # Check if columns exist and add them if they don't
        columns_to_add = [
            ("isBuyer", "BOOLEAN DEFAULT TRUE NOT NULL"),
            ("isSeller", "BOOLEAN DEFAULT FALSE NOT NULL"),
            ("sellerVerified", "BOOLEAN DEFAULT FALSE NOT NULL"),
        ]

        for column_name, column_def in columns_to_add:
            try:
                cursor.execute(
                    sql.SQL(f"ALTER TABLE \"user\" ADD COLUMN {column_name} {column_def};")
                )
                print(f"[OK] Added column: {column_name}")
            except psycopg2.errors.DuplicateColumn:
                print(f"[EXISTS] Column already exists: {column_name}")
            except Exception as e:
                print(f"[ERROR] Error adding column {column_name}: {e}")

        conn.commit()
        cursor.close()
        conn.close()

        print("\n[SUCCESS] User table migration completed!")

    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")

if __name__ == "__main__":
    migrate()
