import re
import os

api_file = "frontend/src/api/dashboardApi.ts"
with open(api_file, "r") as f:
    api_content = f.read()

# find all URLs
urls = re.findall(r"api\.(get|post|put|delete)\(['\"](.*?)['\"]", api_content)
for method, u in urls:
    print(f"API {method.upper()}: {u}")
