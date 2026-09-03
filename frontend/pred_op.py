import re
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/PredictiveOperations.tsx", "r", encoding="utf-8") as f:
    code = f.read()
print(re.search(r'const PredictiveOperations = \(\) => \{.*?(?=return \()', code, re.DOTALL).group(0))
