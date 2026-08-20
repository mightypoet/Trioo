import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# Replace Creator Tripboards Container
pattern_container = re.compile(
    r'<div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory" style={{ scrollbarWidth: \'none\' }}>',
    re.DOTALL
)
new_container = '<div className="flex overflow-x-auto gap-6 pb-8 pt-4 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory hide-scrollbar">'
content = pattern_container.sub(new_container, content, count=1)

# Replace Creator Tripboards Card
pattern_card = re.compile(
    r'<Link key=\{i\} to="/tripboards/1" className={`min-w-\[320px\] md:min-w-\[400px\] snap-start \$\{item\.color\} border-4 border-\[#0A0A0A\] rounded-\[2rem\] p-4 shadow-\[6px_6px_0px_0px_rgba\(10,10,10,1\)\] hover:-translate-y-1 hover:shadow-\[8px_8px_0px_0px_rgba\(10,10,10,1\)\] transition-all flex flex-col group`}>',
    re.DOTALL
)
new_card = '<Link key={i} to="/tripboards/1" className={`w-[85vw] sm:w-80 md:w-96 flex-shrink-0 snap-center ${item.color} border-4 border-[#0A0A0A] rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] transition-transform flex flex-col group`}>'
content = pattern_card.sub(new_card, content, count=1)

# Replace Path truncation
pattern_path = re.compile(
    r'<p className="text-xs font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">\{item\.path\}</p>',
    re.DOTALL
)
new_path = '<p className="text-xs font-bold text-gray-800 truncate w-full">{item.path}</p>'
content = pattern_path.sub(new_path, content, count=1)

# Replace Stats truncation
pattern_stats = re.compile(
    r'<p className="text-\[11px\] font-black text-black uppercase tracking-wider">\{item\.stats\}</p>',
    re.DOTALL
)
new_stats = '<p className="text-[11px] font-black text-black uppercase tracking-wider truncate w-full">{item.stats}</p>'
content = pattern_stats.sub(new_stats, content, count=1)

# Fix typography and paddings
# Hero h1
pattern_hero_h1 = re.compile(
    r'<h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-\[1\.1\] text-\[#0A0A0A\] text-center">',
    re.DOTALL
)
new_hero_h1 = '<h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] text-[#0A0A0A] text-center">'
content = pattern_hero_h1.sub(new_hero_h1, content, count=1)

# Section Headers - Creator Tripboards
pattern_creator_h2 = re.compile(
    r'<h2 className="text-4xl md:text-5xl font-black mb-4 text-\[#0A0A0A\]"',
    re.DOTALL
)
new_creator_h2 = '<h2 className="text-3xl md:text-5xl font-black mb-4 text-[#0A0A0A]"'
content = pattern_creator_h2.sub(new_creator_h2, content)

# Section padding hero
pattern_hero_section = re.compile(
    r'<section className="relative px-6 pt-20 pb-32 z-10 flex flex-col items-center justify-center text-center w-full max-w-7xl mx-auto">',
    re.DOTALL
)
new_hero_section = '<section className="relative px-4 md:px-8 pt-10 md:pt-20 pb-16 md:pb-32 z-10 flex flex-col items-center justify-center text-center w-full max-w-7xl mx-auto">'
content = pattern_hero_section.sub(new_hero_section, content, count=1)

# Section padding Trusted Travel Partners
pattern_trusted = re.compile(
    r'<section className="py-12 bg-\[var\(--color-card\)\] border-y-4 border-\[#0A0A0A\] relative z-10 overflow-hidden">',
    re.DOTALL
)
new_trusted = '<section className="py-10 md:py-20 bg-[var(--color-card)] border-y-4 border-[#0A0A0A] relative z-10 overflow-hidden">'
content = pattern_trusted.sub(new_trusted, content, count=1)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)

print("Applied patch 2")
