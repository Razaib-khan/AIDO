"""
Check what tables exist in the database
"""

import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:razaib@localhost:5432/fishera")

def check_tables():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # Get all table names
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
        """)

        tables = cursor.fetchall()
        print("Tables in 'fishera' database:")
        print("-" * 40)
        for table in tables:
            print(f"  - {table[0]}")

        # Check user table schema
        print("\nUser table columns:")
        print("-" * 40)
        cursor.execute("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'user'
            ORDER BY ordinal_position
        """)

        columns = cursor.fetchall()
        for col in columns:
            nullable = "NULL" if col[2] == "YES" else "NOT NULL"
            print(f"  - {col[0]}: {col[1]} ({nullable})")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_tables()
