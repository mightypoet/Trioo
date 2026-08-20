import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# Replace padding
content = content.replace('px-6 py-24', 'px-4 md:px-8 py-12 md:py-24')
content = content.replace('px-6 py-20', 'px-4 md:px-8 py-10 md:py-20')

# Also fix the banner padding if it's currently py-12 bg-cyan-400
content = content.replace('py-12 bg-cyan-400', 'py-8 md:py-12 bg-cyan-400')

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)

print("Applied section padding patches")
