with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx", "r", encoding="utf-8") as f:
    code = f.read()
code = code.replace("data.'ON_TRACK'", "'ON_TRACK'")
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx", "w", encoding="utf-8") as f:
    f.write(code)

with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/SimulationCenter.tsx", "r", encoding="utf-8") as f:
    code = f.read()
code = code.replace("import React, { Play", "import { Play")
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/SimulationCenter.tsx", "w", encoding="utf-8") as f:
    f.write(code)
