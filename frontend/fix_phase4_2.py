import re

with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/SimulationCenter.tsx", "r", encoding="utf-8") as f:
    code = f.read()
code = code.replace("import React, { Play", "import { Play")
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/SimulationCenter.tsx", "w", encoding="utf-8") as f:
    f.write(code)

with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Let's fix Phase24Evaluation
code = code.replace("<StatusBadge status={data.'ON_TRACK'} />", "<StatusBadge status={'ON_TRACK'} />")
code = code.replace("<StatusBadge status={data. === 'SUCCESS' ? 'ON_TRACK' : data.overall_status} />", "<StatusBadge status={'ON_TRACK'} />")
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx", "w", encoding="utf-8") as f:
    f.write(code)

