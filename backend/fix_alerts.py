import os

filepath = 'app/services/alerts.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the literal backslashes
text = text.replace('\\"\\"\\"', '"""')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
