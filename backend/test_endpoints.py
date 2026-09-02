import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

def test_routes():
    client = TestClient(app)
    
    print("\nTesting /health...")
    resp = client.get("/health")
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")

    print("\nTesting /api/dashboard/summary...")
    resp = client.get("/api/dashboard/summary")
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")

    print("\nTesting /api/beds...")
    resp = client.get("/api/beds")
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")
    
    print("\nTesting /api/events...")
    resp = client.get("/api/events")
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")

if __name__ == "__main__":
    test_routes()
