#!/usr/bin/env python3
"""
Add password column to user table if it doesn't exist
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:razaib@localhost:5432/fishera")

try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    print("[MIGRATION] Checking if password column exists...")

    # Check if column exists
    cursor.execute("""
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'user' AND column_name = 'password'
    """)

    if cursor.fetchone():
        print("[MIGRATION] Password column already exists")
    else:
        print("[MIGRATION] Adding password column...")
        cursor.execute("""
            ALTER TABLE "user" ADD COLUMN password VARCHAR(255) DEFAULT NULL
        """)
        conn.commit()
        print("[MIGRATION] Password column added successfully")

    cursor.close()
    conn.close()

except Exception as e:
    print(f"[MIGRATION] Error: {e}")
    import traceback
    traceback.print_exc()
