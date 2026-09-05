import json
import re

with open('openapi.json', 'r', encoding='utf-8') as f:
    api = json.load(f)

with open('frontend/src/api/dashboardApi.ts', 'r', encoding='utf-8') as f:
    ts_code = f.read()

matches = re.finditer(r'export async function fetch(\w+)\(.*?\)\s*:\s*Promise<([^>]+)>.*?fetch\(`\$\{API_BASE\}([^`]+)`', ts_code, re.DOTALL)
for m in matches:
    name, ret_type, path = m.groups()
    path = '/api' + path.split('?')[0].replace('${', '{')
    path = re.sub(r'\{[^\}]+\}', '{id}', path)
    
    oapi_path = None
    for p in api['paths']:
        norm_p = re.sub(r'\{[^\}]+\}', '{id}', p)
        if norm_p == path or norm_p == path + '/':
            oapi_path = p
            break
            
    if oapi_path:
        get_info = api['paths'][oapi_path].get('get', {})
        res_200 = get_info.get('responses', {}).get('200', {}).get('content', {}).get('application/json', {}).get('schema', {})
        if '$ref' in res_200:
            ref = res_200['$ref'].split('/')[-1]
            print(f'{name} -> TS: {ret_type.strip()} | Backend: Model({ref})')
        elif 'type' in res_200 and res_200['type'] == 'array':
            items = res_200.get('items', {})
            if '$ref' in items:
                ref = items['$ref'].split('/')[-1]
                print(f'{name} -> TS: {ret_type.strip()} | Backend: Array[{ref}]')
            else:
                print(f'{name} -> TS: {ret_type.strip()} | Backend: Array[{items.get("type")}]')
        elif 'additionalProperties' in res_200:
            ap = res_200['additionalProperties']
            print(f'{name} -> TS: {ret_type.strip()} | Backend: Dict[{ap.get("$ref", ap).split("/")[-1] if isinstance(ap.get("$ref", ap), str) else ap}]')
        else:
            print(f'{name} -> TS: {ret_type.strip()} | Backend: {res_200}')
    else:
        print(f'{name} -> Path not found in OpenAPI: {path}')
