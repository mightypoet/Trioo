const fs = require('fs');
let code = fs.readFileSync('src/pages/GoSolo.tsx', 'utf8');

// 1. Add useEffect import if not exists
if (code.includes("import React, { useState } from 'react';")) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");
} else if (code.includes("import { useState } from 'react';")) {
  code = code.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
}

// 2. Replace Hotels State
const oldHotelState = `  // Hotels State
  const [hotelCity, setHotelCity] = useState('');
  const [hotels, setHotels] = useState<any[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [errorHotels, setErrorHotels] = useState('');`;
  
const newHotelState = `  // Hotels State
  const [hotelCity, setHotelCity] = useState<string>('Goa');
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState<boolean>(false);
  const [hotelError, setHotelError] = useState<string | null>(null);`;

code = code.replace(oldHotelState, newHotelState);

// 3. Replace searchHotels with handleHotelSearch and add useEffect
const oldSearchHotelsRegex = /  const searchHotels = async \(e: React\.FormEvent\) => \{[\s\S]*?  \};\n/m;

const newSearchHotels = `  const handleHotelSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!hotelCity.trim()) return;
    setIsLoadingHotels(true);
    setHotelError(null);
    try {
      const res = await fetch(\`/api/hotels?city=\${encodeURIComponent(hotelCity.trim())}\`);
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid non-JSON response.");
      }
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || data.error || "Failed to fetch hotels");
      }
      setHotels(data);
    } catch (err: any) {
      console.error("Hotel Search Error:", err);
      setHotelError(err.message || 'Error fetching hotels.');
      setHotels([]);
    } finally {
      setIsLoadingHotels(false);
    }
  };

  useEffect(() => {
    if (hotels.length === 0) {
      handleHotelSearch();
    }
  }, []);
\n`;

code = code.replace(oldSearchHotelsRegex, newSearchHotels);

// 4. Update the UI
const oldUI = `            <form onSubmit={searchHotels} className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Where are you heading?" 
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  className="w-full bg-gray-100 border-4 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={loadingHotels}
                className="w-full md:w-auto bg-[#0A0A0A] text-white border-4 border-[#0A0A0A] rounded-xl px-8 py-3 font-black shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:bg-gray-800 hover:-translate-y-1 transition-all disabled:opacity-70 flex items-center gap-2 justify-center"
              >
                {loadingHotels ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />} Search Hotels
              </button>
            </form>

            {errorHotels && (
              <div className="bg-red-200 border-4 border-black p-4 rounded-xl font-bold text-[#0A0A0A] mb-4">
                {errorHotels}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotels.length === 0 && !loadingHotels && !errorHotels && (
                <div className="col-span-full text-center py-12 bg-gray-50 border-4 border-dashed border-gray-300 rounded-xl">
                  <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-bold">Search a city to find solo-friendly stays.</p>
                </div>
              )}
              {hotels.map((h, i) => (
                <div key={i} className="bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <Hotel className="w-8 h-8 mb-4 text-cyan-600" />
                  <h3 className="font-black text-lg mb-2">{h.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {h.amenities?.map((amenity: string, i: number) => (
                      <span key={i} className="bg-gray-100 border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded font-bold">{amenity}</span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-black text-xl">{h.price}</span>
                      <p className="text-xs font-bold text-gray-500">{h.rating}</p>
                    </div>
                    <a href={h.bookingUrl} target="_blank" rel="noreferrer" className="text-sm font-black text-white bg-blue-600 px-4 py-2 rounded-xl border-2 border-black hover:bg-blue-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">View</a>
                  </div>
                </div>
              ))}
            </div>`;

const newUI = `            <form onSubmit={handleHotelSearch} className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Where are you heading?" 
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  className="w-full bg-gray-100 border-4 border-black rounded-xl px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isLoadingHotels}
                className="w-full md:w-auto bg-yellow-300 border-4 border-black font-black px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-transform hover:bg-yellow-400 disabled:opacity-50 flex items-center gap-2 justify-center text-black"
              >
                {isLoadingHotels ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />} 
                {isLoadingHotels ? 'Searching...' : 'Search Hotels'}
              </button>
            </form>

            {hotelError && (
              <div className="bg-red-200 border-4 border-black p-4 rounded-xl font-bold text-red-900 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {hotelError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotels.length === 0 && !isLoadingHotels && !hotelError && (
                <div className="col-span-full text-center py-12 bg-gray-50 border-4 border-dashed border-gray-300 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-bold">Search a city to find solo-friendly stays.</p>
                </div>
              )}
              {hotels.map((h, i) => (
                <div key={i} className="bg-white border-4 border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <Hotel className="w-8 h-8 mb-4 text-cyan-600" />
                  <h3 className="font-black text-lg mb-2">{h.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {h.amenities?.map((amenity: string, idx: number) => (
                      <span key={idx} className="bg-yellow-200 border-2 border-black text-xs font-bold px-2 py-1 rounded-md">{amenity}</span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-black text-xl text-black">{h.price}</span>
                      <p className="text-xs font-bold text-gray-500">{h.rating}</p>
                    </div>
                    <a href={h.bookingUrl} target="_blank" rel="noreferrer" className="text-sm font-black text-white bg-blue-600 px-4 py-2 rounded-xl border-2 border-black hover:bg-blue-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-transform">View Stay</a>
                  </div>
                </div>
              ))}
            </div>`;

code = code.replace(oldUI, newUI);
fs.writeFileSync('src/pages/GoSolo.tsx', code);
