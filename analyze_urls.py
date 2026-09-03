import re
import os

api_file = "c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/api/dashboardApi.ts"
with open(api_file, "r") as f:
    api_content = f.read()

# find all fetch URLs
urls = re.findall(r"fetch\(\s*[`'\"]([^`'\"]*)[`'\"]", api_content)
for u in urls:
    print(f"API FETCH: {u}")
