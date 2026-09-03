import re

with open('c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the inner functions (NavBar, Sidebar, Layout) with imports
# We can just use regex to replace everything from `function NavBar` up to `function App() {`
pattern = r'function NavBar\(\).*?(?=function App\(\) \{)'
import_stmt = "import { AppShell } from './components/layout/AppShell';\n\n"

new_content = re.sub(pattern, import_stmt, content, flags=re.DOTALL)

# Now replace <Layout> with <AppShell>
new_content = new_content.replace('<Layout>', '<AppShell>').replace('</Layout>', '</AppShell>')

with open('c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated App.tsx")
