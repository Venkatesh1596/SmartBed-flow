import os

directory = "c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src"
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith((".tsx", ".ts", ".js", ".jsx")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            if r"\'" in content:
                print(f"Found in {path}")
            if r'\"' in content:
                print(f"Found double quote escape in {path}")
