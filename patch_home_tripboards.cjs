const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const anchor = `            )}
          </div>
        </div>
      </section>
      
      {/* Impact Metrics Bar */}`;

const newSection = `            )}
          </div>
        </div>
      </section>

      {/* Featured Tripboards Section */}
      <section className="px-6 py-20 relative bg-pink-100 border-t-4 border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#0A0A0A]" style={{ textShadow: '2px 2px 0px var(--color-card)' }}>Creator Tripboards 🗺️</h2>
              <p className="text-[#0A0A0A] font-bold text-lg bg-white inline-block px-3 py-1 border-2 border-[#0A0A0A] transform -rotate-1" style={{ boxShadow: '2px 2px 0px 0px rgba(10,10,10,1)' }}>Explore day-by-day logs, authentic stays, food discoveries, and photos from real travelers.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/create-tripboard" className="inline-flex items-center justify-center gap-2 text-white font-black bg-blue-600 px-6 py-3 border-4 border-[#0A0A0A] rounded-xl hover:-translate-y-1 hover:translate-x-1 transition-transform shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
                Upload Your Tripboard
              </Link>
              <Link to="/tripboards" className="inline-flex items-center justify-center gap-2 text-[#0A0A0A] font-black bg-yellow-300 px-6 py-3 border-4 border-[#0A0A0A] rounded-xl hover:-translate-y-1 hover:translate-x-1 transition-transform shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
                Explore All <ArrowRight className="w-5 h-5" strokeWidth={3} />
              </Link>
            </div>
          </div>
          
          {/* Horizontal Scroll Grid */}
          <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {[
              { title: 'South Korea Explorer: Seoul to Jeju', duration: '10 Days', image: 'https://images.unsplash.com/photo-1546874177-9e664ce025b0?auto=format&fit=crop&q=80&w=600', path: 'Seoul (2n) → Gyeongju (2n) → Busan (4n) → Jeju (1n)', avatar: 'https://i.pravatar.cc/150?img=32', name: 'Sarah Explorer', handle: '@pathandpassports', stats: '25 Activities · 24 Food Spots · 4 Stays', color: 'bg-green-200' },
              { title: 'Meghalaya Monsoon Magic', duration: '7 Days', image: 'https://images.unsplash.com/photo-1629831969299-fb93cc2267f7?auto=format&fit=crop&q=80&w=600', path: 'Shillong (2n) → Cherrapunji (3n) → Dawki (1n)', avatar: 'https://i.pravatar.cc/150?img=12', name: 'Rahul Hikes', handle: '@himalayanrahul', stats: '12 Activities · 15 Food Spots · 3 Stays', color: 'bg-cyan-200' },
              { title: 'Bali Budget Backpacker Guide', duration: '14 Days', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600', path: 'Canggu (4n) → Ubud (5n) → Nusa Penida (4n)', avatar: 'https://i.pravatar.cc/150?img=41', name: 'Aussie Nomad', handle: '@budgetbali', stats: '40 Activities · 30 Food Spots · 5 Stays', color: 'bg-yellow-200' },
              { title: 'Swiss Alps Luxury Honeymoon', duration: '8 Days', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=600', path: 'Zurich (1n) → Zermatt (3n) → St. Moritz (3n)', avatar: 'https://i.pravatar.cc/150?img=25', name: 'Luxury Escapes', handle: '@luxuryswiss', stats: '10 Activities · 18 Food Spots · 3 Stays', color: 'bg-pink-200' }
            ].map((item, i) => (
              <Link key={i} to="/tripboards/1" className={\`min-w-[320px] md:min-w-[400px] snap-start \${item.color} border-4 border-[#0A0A0A] rounded-[2rem] p-4 shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] transition-all flex flex-col group\`}>
                <div className="relative w-full h-[200px] rounded-xl border-4 border-[#0A0A0A] overflow-hidden mb-4 bg-white">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Trip Cover" />
                  <div className="absolute top-3 left-3 bg-white border-2 border-[#0A0A0A] px-3 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
                    {item.duration}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#0A0A0A] overflow-hidden">
                    <img src={item.avatar} className="w-full h-full object-cover" alt="Creator" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-[#0A0A0A] leading-tight">{item.name}</p>
                    <p className="text-xs font-bold text-gray-700">{item.handle}</p>
                  </div>
                </div>
                
                <h3 className="font-black text-xl mb-3 line-clamp-2">{item.title}</h3>
                
                <div className="bg-white border-2 border-black rounded-lg p-2 mb-4">
                  <p className="text-xs font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">{item.path}</p>
                </div>
                
                <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-black/30 pt-3">
                  <p className="text-[11px] font-black text-black uppercase tracking-wider">{item.stats}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Impact Metrics Bar */}`;

if (code.includes(anchor)) {
    code = code.replace(anchor, newSection);
    fs.writeFileSync('src/pages/Home.tsx', code);
    console.log("Tripboards section added to Home");
} else {
    console.log("Anchor not found in Home");
}
