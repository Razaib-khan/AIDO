#!/usr/bin/env python3
import psycopg2

DATABASE_URL = "postgresql://postgres:razaib@localhost:5432/fishera"

try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    print("[CHECK] Checking user table...")

    # Get column information
    cursor.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'user'
        ORDER BY ordinal_position
    """)

    columns = cursor.fetchall()

    if not columns:
        print("[CHECK] ERROR: User table has no columns!")
    else:
        print("[CHECK] User table columns:")
        for col in columns:
            nullable = "NULL" if col[2] == 'YES' else 'NOT NULL'
            print(f"  - {col[0]}: {col[1]} ({nullable})")

    # Count rows
    cursor.execute('SELECT COUNT(*) FROM "user"')
    count = cursor.fetchone()[0]
    print(f"\n[CHECK] User table row count: {count}")

    cursor.close()
    conn.close()

except Exception as e:
    print(f"[CHECK] Error: {e}")
    import traceback
    traceback.print_exc()
