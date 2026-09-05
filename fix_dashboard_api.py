import os
import re

path = "c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/api/dashboardApi.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix flow analytics
content = content.replace(
    "`${API_BASE}/dashboard/flow-analytics?days=${days}`",
    "`${API_BASE}/dashboard/flow?days=${days}`"
)

# Fix predictions beds
content = content.replace(
    "`${API_BASE}/predictions/beds`",
    "`${API_BASE}/predictions/bed-availability`"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed API endpoints in dashboardApi.ts")
