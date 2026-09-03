import os

path = "c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/AdminDashboard.tsx"
with open(path, "r") as f:
    content = f.read()

content = content.replace(r"\'", "'")

with open(path, "w") as f:
    f.write(content)
print("Fixed escaping in AdminDashboard.tsx")
