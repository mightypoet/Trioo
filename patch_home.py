import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(
    r'<div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto mt-8 relative z-10">.*?<div className="flex justify-end mt-2">.*?<\/button>\s*<\/div>\s*<\/form>\s*<\/div>',
    re.DOTALL
)

new_planner = """<div className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-6xl mx-auto w-full relative z-10 my-8">
            <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
              <Search className="w-8 h-8 text-[#0A0A0A]" strokeWidth={3} />
              <h2 className="font-black text-2xl uppercase tracking-tighter text-[#0A0A0A]">AI Trip Planner</h2>
            </div>
            
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-stretch w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">
                
                {/* Destination / Prompt */}
                <div className="relative h-full">
                  <MapPin className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={3} />
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Where to? (e.g., 5-day Meghalaya)" 
                    className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 pl-12 font-bold text-base md:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:bg-white transition-all placeholder-gray-500 h-full text-[#0A0A0A]"
                    required
                  />
                </div>

                {/* Dates */}
                <div className="relative flex items-center gap-1 w-full bg-gray-50 border-4 border-black rounded-xl p-4 pl-12 font-bold text-base md:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:outline-none focus-within:ring-4 focus-within:ring-cyan-300 focus-within:bg-white transition-all h-full">
                  <Calendar className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={3} />
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="w-full bg-transparent border-none outline-none placeholder-gray-500 text-[#0A0A0A]" 
                  />
                  <span className="font-black text-gray-400">-</span>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="w-full bg-transparent border-none outline-none placeholder-gray-500 text-[#0A0A0A]" 
                  />
                </div>

                {/* People */}
                <div className="relative h-full">
                  <input 
                    type="number" 
                    min="1" 
                    value={peopleCount} 
                    onChange={(e) => setPeopleCount(Number(e.target.value))} 
                    className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 font-bold text-base md:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:bg-white transition-all placeholder-gray-500 h-full text-[#0A0A0A]" 
                    placeholder="No. of People" 
                  />
                </div>
                
                {/* Budget */}
                <div className="relative h-full">
                  <Wallet className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={3} />
                  <select 
                    value={budget} 
                    onChange={(e) => setBudget(e.target.value)} 
                    className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 pl-12 font-bold text-base md:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:bg-white transition-all placeholder-gray-500 appearance-none h-full text-[#0A0A0A]"
                  >
                    <option value="">Budget (Any)</option>
                    <option value="Economy (Under ₹10k)">Economy (Under ₹10k)</option>
                    <option value="Standard (₹10k - ₹30k)">Standard (₹10k - ₹30k)</option>
                    <option value="Luxury (₹30k+)">Luxury (₹30k+)</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={loadingPlan}
                className="w-full lg:w-auto bg-yellow-300 border-4 border-black text-black font-black px-8 py-4 rounded-xl text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 whitespace-nowrap h-full min-h-[64px]"
              >
                {loadingPlan ? (
                  <>
                    <div className="w-5 h-5 border-4 border-[#0A0A0A] border-t-transparent rounded-full animate-spin shrink-0" />
                    {isLoadingLocation ? "Fetching location..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 shrink-0" />
                    Generate AI Itinerary
                  </>
                )}
              </button>
            </form>
          </div>"""

if pattern.search(content):
    content = pattern.sub(new_planner, content)
    with open('src/pages/Home.tsx', 'w') as f:
        f.write(content)
    print("Successfully replaced.")
else:
    print("Could not find pattern.")
