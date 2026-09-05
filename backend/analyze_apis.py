import json
import re

with open('../../openapi.json', 'r', encoding='utf-8') as f:
    api = json.load(f)

with open('../../frontend/src/api/dashboardApi.ts', 'r', encoding='utf-8') as f:
    ts_code = f.read()

# Very basic inspection of TS functions
matches = re.finditer(r'export async function fetch(\w+)\(.*?\)\s*:\s*Promise<([^>]+)>.*?fetch\(`\$\{API_BASE\}([^`]+)`', ts_code, re.DOTALL)
print('TS APIs detected:')
for m in matches:
    name, ret_type, path = m.groups()
    path = path.split('?')[0].replace('${', '{')
    path = re.sub(r'\{[^\}]+\}', '{id}', path)  # normalize variable names to {id} for simple matching
    
    # Try to find matching OpenAPI path
    oapi_path = None
    for p in api['paths']:
        # normalize p as well
        norm_p = re.sub(r'\{[^\}]+\}', '{id}', p)
        if norm_p == path or norm_p == path + '/':
            oapi_path = p
            break
            
    if oapi_path:
        get_info = api['paths'][oapi_path].get('get', {})
        res_200 = get_info.get('responses', {}).get('200', {}).get('content', {}).get('application/json', {}).get('schema', {})
        if '$ref' in res_200:
            ref = res_200['$ref'].split('/')[-1]
            print(f'MATCH: {name} -> {path} | TS returns: {ret_type.strip()} | OpenAPI returns model: {ref}')
        elif 'type' in res_200 and res_200['type'] == 'array':
            items = res_200.get('items', {})
            if '$ref' in items:
                ref = items['$ref'].split('/')[-1]
                print(f'MATCH: {name} -> {path} | TS returns: {ret_type.strip()} | OpenAPI returns array of: {ref}')
            else:
                print(f'MATCH: {name} -> {path} | TS returns: {ret_type.strip()} | OpenAPI returns array of type {items.get("type")}')
        elif 'additionalProperties' in res_200:
            ap = res_200['additionalProperties']
            print(f'MATCH: {name} -> {path} | TS returns: {ret_type.strip()} | OpenAPI returns dict/map of: {ap.get("$ref", ap).split("/")[-1] if isinstance(ap.get("$ref", ap), str) else ap}')
        else:
            print(f'MATCH: {name} -> {path} | TS returns: {ret_type.strip()} | OpenAPI returns: {res_200}')
    else:
        print(f'NO OPENAPI MATCH: {name} -> {path}')
