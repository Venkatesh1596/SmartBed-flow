def fix_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for o, n in replacements:
        content = content.replace(o, n)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/layout/Sidebar.tsx', [('const userRole = user?.role;', 'const userRole = user?.role?.name;')])
fix_file('c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/layout/TopHeader.tsx', [("{user?.role || 'Staff'}", "{user?.role?.name || 'Staff'}")])
