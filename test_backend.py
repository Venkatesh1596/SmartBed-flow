import urllib.request
import urllib.parse
import json

API_BASE = "http://127.0.0.1:8000/api"
ENDPOINTS = [
    "/dashboard/summary",
    "/beds",
    "/events",
    "/command-center/summary",
    "/admin/summary",
    "/capacity/summary",
    "/orchestration/summary",
    "/predictive-operations/summary",
    "/simulation/scenario",
    "/validation/phase24/summary",
    "/executive/summary",
    "/reports/summary"
]

def check_endpoints():
    # Attempt login to get token
    try:
        data = urllib.parse.urlencode({"username": "admin", "password": "password"}).encode("utf-8")
        req = urllib.request.Request(API_BASE + "/auth/login", data=data)
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode())
            token = res_data.get("access_token")
            headers = {"Authorization": f"Bearer {token}"}
    except Exception as e:
        print("Login failed", e)
        headers = {}

    for ep in ENDPOINTS:
        url = API_BASE + ep
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as res:
                print(f"{ep}: {res.status}")
                print(f"  OK (len={len(res.read())})")
        except urllib.error.HTTPError as e:
            print(f"{ep}: {e.code}")
            if e.code in [307, 308]:
                print(f"  Redirect to: {e.headers.get('Location')}")
            if e.code == 500:
                print(f"  Error: {e.read().decode()}")
        except Exception as e:
            print(f"{ep}: ERROR {e}")

check_endpoints()
