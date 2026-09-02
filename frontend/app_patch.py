import os

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '''import SimulationCenter from './components/SimulationCenter';''',
    '''import SimulationCenter from './components/SimulationCenter';\nimport ControlTower from './components/ControlTower';'''
)

content = content.replace(
    '''<Link to=\"/command-center\"''',
    '''<Link to=\"/control-tower\" className=\"inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium\">\n                                Control Tower\n                            </Link>\n                            <Link to=\"/command-center\"'''
)

content = content.replace(
    '''<Route path=\"/command-center\"''',
    '''<Route path=\"/control-tower\" element={\n            <ProtectedRoute>\n              <Layout>\n                  <ControlTower />\n              </Layout>\n            </ProtectedRoute>\n          } />\n          <Route path=\"/command-center\"'''
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
