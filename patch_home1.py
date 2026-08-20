import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# Replace Trending Destinations Grid
pattern = re.compile(
    r'<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">',
    re.DOTALL
)
new_grid = '<div className="flex overflow-x-auto pb-8 pt-4 px-4 -mx-4 md:px-0 md:mx-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 snap-x snap-mandatory hide-scrollbar">'
content = pattern.sub(new_grid, content, count=1)

# Modify motion.div in Trending Destinations
pattern_motion = re.compile(
    r'className="h-\[400px\]"',
    re.DOTALL
)
new_motion = 'className="h-[400px] w-[85vw] sm:w-80 md:w-auto flex-shrink-0 snap-center"'
content = pattern_motion.sub(new_motion, content, count=1)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)

print("Applied patch 1")
