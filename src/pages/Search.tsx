import React, { useState } from 'react';
import { Search as SearchIcon, ArrowRight, Frown, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const MOCK_TRIPS = [
  {
    id: '1',
    title: 'Meghalaya Backpacking Adventure',
    destination: 'Meghalaya',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1593693397690-362bb9a11866?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Kolkata Heritage & Culture Tour',
    destination: 'Kolkata',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Ranthambore Jungle Safari',
    destination: 'Safari',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1589578135898-3571d4cb4342?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Cherrapunji Monsoons Retreat',
    destination: 'Meghalaya',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'Budget Darjeeling Getaway',
    destination: 'Darjeeling',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000&auto=format&fit=crop'
  }
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<typeof MOCK_TRIPS>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent | string) => {
    if (e && typeof e !== 'string' && 'preventDefault' in e) {
      e.preventDefault();
    }
    
    const queryToUse = typeof e === 'string' ? e : searchQuery;
    const cleanQuery = queryToUse.trim();
    if (!cleanQuery) return;

    if (typeof e === 'string') {
      setSearchQuery(e);
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .or(`title.ilike.%${cleanQuery}%,destination.ilike.%${cleanQuery}%`);
      
      if (error) throw error;
      
      const mapped = (data || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        destination: t.destination,
        price: t.base_price || 0,
        image: t.cover_image || 'https://images.unsplash.com/photo-1593693397690-362bb9a11866?q=80&w=1000&auto=format&fit=crop'
      }));

      setResults(mapped as any);

    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrendingClick = (tag: string) => {
    handleSearch(tag);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Search Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#0A0A0A]">Find Your Next Adventure</h1>
          <p className="text-lg text-gray-600 font-bold">Search destinations, themes, or budgets.</p>
        </div>

        {/* Big Search Form */}
        <form 
          onSubmit={handleSearch}
          className="bg-white border-4 border-[#0A0A0A] rounded-[2rem] p-3 flex flex-col md:flex-row gap-3 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] relative z-10 mx-auto max-w-3xl mb-12"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-2">
            <SearchIcon className="w-6 h-6 text-[#0A0A0A]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='e.g. "Meghalaya" or "Under ₹10,000"' 
              className="w-full bg-transparent border-none outline-none text-xl font-bold placeholder:font-semibold placeholder:text-gray-400 text-[#0A0A0A]"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSearching}
            className="bg-[var(--color-primary)] text-[#0A0A0A] font-black border-4 border-[#0A0A0A] rounded-2xl px-10 py-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] transition-all flex items-center justify-center min-w-[140px]"
          >
            {isSearching ? (
              <div className="w-6 h-6 border-4 border-[#0A0A0A] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Search'
            )}
          </button>
        </form>

        {/* Pre-Search State (Trending) */}
        {!hasSearched && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-black mb-4 text-[#0A0A0A]">Trending Searches 🔥</h2>
            <div className="flex flex-wrap gap-3">
              {['Meghalaya', 'Kolkata', 'Safari', 'Under ₹10,000'].map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTrendingClick(tag)}
                  className="bg-white text-[#0A0A0A] font-bold border-4 border-[#0A0A0A] rounded-xl px-5 py-2 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && !isSearching && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-[#0A0A0A]">Results for "{searchQuery}"</h2>
              <p className="text-gray-500 font-bold">{results.length} trips found</p>
            </div>

            {results.length === 0 ? (
              /* Empty State */
              <div className="bg-white border-4 border-[#0A0A0A] rounded-[2rem] p-12 text-center shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] flex flex-col items-center">
                <div className="w-20 h-20 bg-[var(--color-primary)] rounded-full border-4 border-[#0A0A0A] flex items-center justify-center mb-6 rotate-12 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
                  <Frown className="w-10 h-10 text-[#0A0A0A]" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black text-[#0A0A0A] mb-2">No trips found!</h3>
                <p className="text-lg text-gray-600 font-bold max-w-md">We couldn't find any trips matching your search. Try adjusting your keywords or checking out our trending destinations.</p>
                <button 
                  onClick={() => { setHasSearched(false); setSearchQuery(''); }}
                  className="mt-8 bg-white text-[#0A0A0A] font-black border-4 border-[#0A0A0A] rounded-xl px-6 py-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] transition-all"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              /* Results List */
              <div className="space-y-6">
                {results.map(trip => (
                  <div key={trip.id} className="group bg-white border-4 border-[#0A0A0A] rounded-[2rem] overflow-hidden shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] transition-all flex flex-col sm:flex-row">
                    
                    {/* Image */}
                    <div className="sm:w-2/5 h-48 sm:h-auto border-b-4 sm:border-b-0 sm:border-r-4 border-[#0A0A0A] overflow-hidden relative">
                      <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-black border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {trip.destination}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="sm:w-3/5 p-6 flex flex-col">
                      <h3 className="text-2xl font-black text-[#0A0A0A] mb-2 leading-tight group-hover:text-[var(--color-primary)] transition-colors">{trip.title}</h3>
                      <p className="text-gray-600 font-bold text-sm mb-6 flex-1">Explore the best of {trip.destination} with this curated experience.</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Price</p>
                          <p className="text-2xl font-black text-[#0A0A0A]">₹{trip.price.toLocaleString()}</p>
                        </div>
                        <Link 
                          to={`/package/${trip.id}`}
                          className="bg-[#0A0A0A] text-white w-12 h-12 rounded-xl flex items-center justify-center border-2 border-[#0A0A0A] hover:bg-[var(--color-primary)] hover:text-[#0A0A0A] transition-colors"
                        >
                          <ArrowRight className="w-6 h-6" strokeWidth={3} />
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
