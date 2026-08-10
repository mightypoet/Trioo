const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add Imports
if (!code.includes('PinkDevilBot')) {
  code = code.replace(
    /import \{ Link, useNavigate \} from 'react-router-dom';/,
    `import { Link, useNavigate } from 'react-router-dom';\nimport { PinkDevilBot } from './PinkDevilBot';\nimport { Navigation } from 'lucide-react';`
  );
}

// Add state variables and handleGenerate function
const stateAndFunctions = `
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [plan, setPlan] = useState<any | null>(null);
  const [tripDetails, setTripDetails] = useState<any | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  
  const generatePlan = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoadingPlan(true);
    setPlan(null);
    setTripDetails(null);

    const fullPrompt = \`\${queryText}. \${startDate && endDate ? 'Dates: ' + startDate + ' to ' + endDate + '.' : ''} \${budget ? 'Budget: ' + budget + '.' : ''}\`;

    try {
      const { data: trips, error } = await supabase.from('trips').select('*, agencies(name)');
      if (error) throw error;

      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userRequest: fullPrompt,
          availableTrips: trips,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const generatedPlan = await response.json();
      setPlan(generatedPlan);

      if (generatedPlan.recommended_trip_id) {
        const { data: recommendedTrip } = await supabase
          .from('trips')
          .select('*')
          .eq('id', generatedPlan.recommended_trip_id)
          .single();
        
        if (recommendedTrip) {
          setTripDetails(recommendedTrip);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error generating trip plan. Please try again.');
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      generatePlan(searchQuery);
    }
  };
`;

code = code.replace(
  /const handleSearch = \(e: React\.FormEvent\) => \{\s*e\.preventDefault\(\);\s*if \(searchQuery\.trim\(\)\) \{\s*navigate\('\/ai-planner\?prompt=' \+ encodeURIComponent\(searchQuery\)\);\s*\} else \{\s*navigate\('\/ai-planner'\);\s*\}\s*\};/,
  stateAndFunctions
);


// Replace the old form with the new MakeMyTrip style grid layout
const newForm = `
          <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto mt-8 relative z-10">
            <form onSubmit={handleSearch} className="bg-white border-4 border-[#0A0A0A] rounded-[32px] p-6 flex flex-col gap-4 w-full shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]">
              
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-[#0A0A0A]" strokeWidth={3} />
                <h3 className="text-xl font-black text-[#0A0A0A] uppercase tracking-wide">AI Trip Planner</h3>
              </div>

              {/* Grid for Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Destination / Prompt */}
                <div className="md:col-span-5 bg-gray-50 border-4 border-[#0A0A0A] rounded-2xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] focus-within:bg-white focus-within:ring-4 focus-within:ring-yellow-300 transition-all">
                  <MapPin className="w-5 h-5 text-gray-500" strokeWidth={3} />
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Where to? (e.g., 5-day Meghalaya)" 
                    className="w-full bg-transparent border-none outline-none text-base md:text-lg font-bold placeholder:font-semibold placeholder:text-gray-400 text-[#0A0A0A]" 
                    required
                  />
                </div>

                {/* Dates */}
                <div className="md:col-span-4 bg-gray-50 border-4 border-[#0A0A0A] rounded-2xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] focus-within:bg-white transition-all">
                  <Calendar className="w-5 h-5 text-gray-500" strokeWidth={3} />
                  <div className="flex-1 flex gap-2 items-center">
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)} 
                      className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#0A0A0A]" 
                    />
                    <span className="font-black text-gray-400">-</span>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)} 
                      className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#0A0A0A]" 
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="md:col-span-3 bg-gray-50 border-4 border-[#0A0A0A] rounded-2xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] focus-within:bg-white transition-all">
                  <Wallet className="w-5 h-5 text-gray-500" strokeWidth={3} />
                  <select 
                    value={budget} 
                    onChange={(e) => setBudget(e.target.value)} 
                    className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#0A0A0A] appearance-none"
                  >
                    <option value="">Budget (Any)</option>
                    <option value="Economy (Under ₹10k)">Economy (Under ₹10k)</option>
                    <option value="Standard (₹10k - ₹30k)">Standard (₹10k - ₹30k)</option>
                    <option value="Luxury (₹30k+)">Luxury (₹30k+)</option>
                  </select>
                </div>

              </div>

              {/* Action Button */}
              <div className="flex justify-end mt-2">
                <button 
                  type="submit" 
                  disabled={loadingPlan}
                  className="bg-yellow-400 text-[#0A0A0A] font-black border-4 border-[#0A0A0A] rounded-[24px] px-8 py-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] transition-all whitespace-nowrap disabled:opacity-70 flex items-center gap-2"
                >
                  {loadingPlan ? (
                    <div className="w-5 h-5 border-4 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate AI Itinerary
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Results Section directly under form */}
            {loadingPlan && (
              <div className="w-full mt-8 flex flex-col items-center justify-center p-8 bg-white border-4 border-[#0A0A0A] rounded-[32px] shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]">
                 <PinkDevilBot isThinking={true} />
                 <p className="mt-4 font-black text-xl text-[#0A0A0A]">Crafting your perfect trip...</p>
              </div>
            )}

            {!loadingPlan && plan && (
              <div className="w-full mt-8 bg-white border-4 border-[#0A0A0A] rounded-[32px] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] animate-in fade-in slide-in-from-top-4 duration-500 text-left">
                
                {/* Recommended Trip Card */}
                {tripDetails && (
                  <div className="bg-white border-4 border-[#0A0A0A] rounded-[2rem] overflow-hidden shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] flex flex-col sm:flex-row mb-8">
                    <div className="sm:w-1/3 h-48 sm:h-auto border-b-4 sm:border-b-0 sm:border-r-4 border-[#0A0A0A] relative">
                      <img src={tripDetails.cover_image || 'https://images.unsplash.com/photo-1593693397690-362bb9a11866'} alt={tripDetails.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-black border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {tripDetails.destination}
                      </div>
                    </div>
                    <div className="sm:w-2/3 p-6 flex flex-col">
                      <h2 className="text-xl font-bold text-gray-500 uppercase tracking-wider mb-1">Recommended Package</h2>
                      <h3 className="text-3xl font-black text-[#0A0A0A] mb-2 leading-tight">{tripDetails.title}</h3>
                      <p className="text-gray-600 font-bold mb-4">By {plan.agency_name}</p>
                      
                      <div className="mt-auto flex items-end justify-between">
                        <div>
                          <p className="text-sm font-black text-gray-500 uppercase tracking-widest mb-1">Base Price</p>
                          <p className="text-2xl font-black text-[#0A0A0A]">₹{tripDetails.base_price?.toLocaleString()}</p>
                        </div>
                        <Link 
                          to={\`/package/\${tripDetails.id}\`}
                          className="bg-[#0A0A0A] text-white px-6 py-3 rounded-xl font-bold border-2 border-[#0A0A0A] hover:bg-[var(--color-primary)] hover:text-[#0A0A0A] transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Itinerary */}
                  <div className="md:col-span-2 bg-gray-50 border-4 border-[#0A0A0A] rounded-[2rem] p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                      <Map className="w-6 h-6 text-[var(--color-primary)]" strokeWidth={3} />
                      Custom Itinerary
                    </h3>
                    <div className="space-y-6">
                      {plan?.itinerary?.map((day: any, idx: number) => (
                        <div key={idx} className="relative pl-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-[-24px] last:before:bottom-0 before:w-1 before:bg-gray-300">
                          <div className="absolute left-0 top-1 w-6 h-6 bg-yellow-400 border-2 border-[#0A0A0A] rounded-full flex items-center justify-center font-black text-xs">
                            {day.day}
                          </div>
                          <h4 className="text-xl font-bold text-[#0A0A0A] mb-2">{day.title}</h4>
                          <p className="text-gray-700 font-medium leading-relaxed bg-white p-4 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
                            {day.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transportation */}
                  <div className="bg-white border-4 border-[#0A0A0A] rounded-[2rem] p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] h-fit">
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                      <Navigation className="w-6 h-6 text-blue-500" strokeWidth={3} />
                      Transport
                    </h3>
                    <div className="space-y-4">
                      {plan?.transportation?.train_link && (
                        <a href={plan?.transportation?.train_link} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-yellow-50 transition-colors flex justify-between items-center group">
                          Train Options <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </a>
                      )}
                      {plan?.transportation?.flight_link && (
                        <a href={plan?.transportation?.flight_link} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-yellow-50 transition-colors flex justify-between items-center group">
                          Flight Options <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </a>
                      )}
                      {plan?.transportation?.irctc_portal && (
                        <a href={plan?.transportation?.irctc_portal} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-yellow-50 transition-colors flex justify-between items-center group">
                          IRCTC Portal <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </a>
                      )}
                      {!plan?.transportation?.train_link && !plan?.transportation?.flight_link && !plan?.transportation?.irctc_portal && (
                        <p className="text-gray-500 font-medium italic">No transport links generated.</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}
`;

code = code.replace(
  /<div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto mt-8">\s*<form onSubmit=\{handleSearch\}[\s\S]*?<\/form>/,
  newForm
);

fs.writeFileSync('src/pages/Home.tsx', code);
