import os
import sys
import psycopg2

def test_connection():
    try:
        conn = psycopg2.connect(
            host="127.0.0.1",
            port=5432,
            user="smartbed_user",
            password="smartbed_password",
            dbname="smartbed_db"
        )
        print("SUCCESS: Connected to PostgreSQL.")
        conn.close()
        sys.exit(0)
    except psycopg2.OperationalError as e:
        print(f"FAILED: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_connection()
