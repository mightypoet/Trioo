const fs = require('fs');
let code = fs.readFileSync('src/pages/GoSolo.tsx', 'utf8');

const oldHotelState = `  // Hotels State
  const [hotelCity, setHotelCity] = useState('');
  
  // Trains State`;

const newHotelState = `  // Hotels State
  const [hotelCity, setHotelCity] = useState('');
  const [hotels, setHotels] = useState<any[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [errorHotels, setErrorHotels] = useState('');
  
  // Trains State`;

code = code.replace(oldHotelState, newHotelState);

const oldSearchFlights = `  const searchFlights = async (e: React.FormEvent) => {`;
const newSearchHotels = `  const searchHotels = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelCity) return;
    setLoadingHotels(true);
    setErrorHotels('');
    try {
      const res = await fetch(\`/api/hotels?city=\${encodeURIComponent(hotelCity)}\`);
      if (!res.ok) throw new Error('Failed to fetch hotels');
      const data = await res.json();
      setHotels(data);
    } catch (err: any) {
      console.error(err);
      setErrorHotels(err.message || 'Error fetching hotels.');
    } finally {
      setLoadingHotels(false);
    }
  };

  const searchFlights = async (e: React.FormEvent) => {`;

code = code.replace(oldSearchFlights, newSearchHotels);

const oldHotelTab = `            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Where are you heading?" 
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  className="w-full bg-gray-100 border-4 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
              <a 
                href={\`https://www.google.com/travel/hotels?q=hotels+in+\${hotelCity || 'Goa'}\`}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto bg-[#0A0A0A] text-white border-4 border-[#0A0A0A] rounded-xl px-8 py-3 font-black shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:bg-gray-800 hover:-translate-y-1 transition-all flex items-center gap-2 justify-center"
              >
                <Search className="w-5 h-5" /> Search Hotels
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'The Solo Backpacker Hostel', price: '₹800/night', amenities: 'Free Wi-Fi, Solo Safety Certified' },
                { name: 'Zen City Boutique', price: '₹2,500/night', amenities: 'Breakfast, Central Location' },
                { name: 'Wanderer Homestay', price: '₹1,200/night', amenities: 'Community Events, Safe Zone' },
              ].map((h, i) => (
                <div key={i} className="bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
                  <Hotel className="w-8 h-8 mb-4 text-cyan-600" />
                  <h3 className="font-black text-lg mb-2">{h.name}</h3>
                  <p className="text-gray-500 font-bold text-sm mb-4">{h.amenities}</p>
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
                    <span className="font-black text-xl">{h.price}</span>
                    <a href={\`https://www.google.com/travel/hotels?q=\${encodeURIComponent(h.name)}\`} target="_blank" rel="noreferrer" className="text-sm font-black underline hover:text-cyan-600">View Stay</a>
                  </div>
                </div>
              ))}
            </div>`;

const newHotelTab = `            <form onSubmit={searchHotels} className="flex flex-col md:flex-row gap-4 mb-8">
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

code = code.replace(oldHotelTab, newHotelTab);
fs.writeFileSync('src/pages/GoSolo.tsx', code);
