import re

with open('src/api/dashboardApi.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('...args: any[]', '_days?: number')

with open('src/api/dashboardApi.ts', 'w', encoding='utf-8') as f:
    f.write(content)
