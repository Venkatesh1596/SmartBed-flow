import glob

files = glob.glob('**/test_*.py', recursive=True)
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'app.dependency_overrides' in content:
        if 'cleanup_overrides_for_module' not in content:
            cleanup_fixture = "\n\nimport pytest\n@pytest.fixture(autouse=True, scope='module')\ndef cleanup_overrides_for_module():\n    yield\n    from app.main import app\n    app.dependency_overrides.clear()\n"
            with open(f, 'a', encoding='utf-8') as file:
                file.write(cleanup_fixture)
