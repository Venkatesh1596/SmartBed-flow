import urllib.request
import urllib.parse
import json

API_BASE = "http://127.0.0.1:8000/api"

def get_token():
    try:
        data = json.dumps({"username": "admin", "password": "password"}).encode("utf-8")
        req = urllib.request.Request(API_BASE + "/auth/login", data=data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode())
            return res_data.get("access_token")
    except Exception as e:
        print("Login with JSON failed:", e)

    # Let's try form data
    try:
        data = urllib.parse.urlencode({"username": "admin", "password": "password"}).encode("utf-8")
        req = urllib.request.Request(API_BASE + "/auth/login", data=data)
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode())
            return res_data.get("access_token")
    except Exception as e:
        print("Login with form data failed:", e)

token = get_token()
print("Token:", token[:10] if token else None)

def test_ep(ep):
    url = API_BASE + ep
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as res:
            print(f"{ep}: {res.status} OK")
    except urllib.error.HTTPError as e:
        print(f"{ep}: {e.code} (Location: {e.headers.get('Location')})")
    except Exception as e:
        print(f"{ep}: ERROR {e}")

for ep in [
    "/events",
    "/events/",
    "/capacity/summary",
    "/orchestration/summary",
    "/predictive-operations/summary",
    "/validation/phase24/summary",
    "/admin/summary",
    "/admin/config"
]:
    test_ep(ep)
