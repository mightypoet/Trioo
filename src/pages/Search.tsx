import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Frown, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const FILTER_OPTIONS = [
  "All",
  "Under ₹10,000",
  "Under ₹25,000",
  "Weekend",
  "Wildlife",
  "Mountain"
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allTrips, setAllTrips] = useState<any[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  // Initial Fetch of All Trips
  useEffect(() => {
    const fetchAllTrips = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const mapped = (data || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          destination: t.destination,
          price: t.base_price || 0,
          image: t.cover_image || 'https://images.unsplash.com/photo-1593693397690-362bb9a11866?q=80&w=1000&auto=format&fit=crop'
        }));
        
        setAllTrips(mapped);
        setFilteredTrips(mapped);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllTrips();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = allTrips;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(trip => 
        (trip.title && trip.title.toLowerCase().includes(q)) || 
        (trip.destination && trip.destination.toLowerCase().includes(q))
      );
    }

    // Filter by active filter category
    if (activeFilter !== 'All') {
      if (activeFilter === 'Under ₹10,000') {
        result = result.filter(trip => trip.price < 10000);
      } else if (activeFilter === 'Under ₹25,000') {
        result = result.filter(trip => trip.price < 25000);
      } else if (activeFilter === 'Weekend') {
        result = result.filter(trip => 
          (trip.title && trip.title.toLowerCase().includes('weekend')) ||
          (trip.destination && trip.destination.toLowerCase().includes('weekend'))
        );
      } else if (activeFilter === 'Wildlife') {
        result = result.filter(trip => 
          (trip.title && trip.title.toLowerCase().includes('wildlife')) ||
          (trip.destination && trip.destination.toLowerCase().includes('wildlife')) ||
          (trip.title && trip.title.toLowerCase().includes('safari'))
        );
      } else if (activeFilter === 'Mountain') {
        result = result.filter(trip => 
          (trip.title && trip.title.toLowerCase().includes('mountain')) ||
          (trip.destination && trip.destination.toLowerCase().includes('mountain')) ||
          (trip.title && trip.title.toLowerCase().includes('himalaya')) ||
          (trip.destination && trip.destination.toLowerCase().includes('himalaya'))
        );
      }
    }

    setFilteredTrips(result);
  }, [searchQuery, activeFilter, allTrips]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is reactive now, but we keep the form submission from refreshing the page
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Search Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#0A0A0A]">Find Your Next Adventure</h1>
          <p className="text-lg text-gray-600 font-bold">Search destinations, themes, or budgets.</p>
        </div>

        {/* Big Search Form */}
        <form 
          onSubmit={handleSearch}
          className="bg-white border-4 border-[#0A0A0A] rounded-[2rem] p-3 flex flex-col md:flex-row gap-3 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] relative z-10 mx-auto max-w-3xl mb-6"
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
            className="bg-[var(--color-primary)] text-[#0A0A0A] font-black border-4 border-[#0A0A0A] rounded-2xl px-10 py-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] transition-all flex items-center justify-center min-w-[140px]"
          >
            Search
          </button>
        </form>

        {/* Filter Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex overflow-x-auto pb-4 pt-2 px-2 gap-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {FILTER_OPTIONS.map(filter => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`snap-center shrink-0 border-2 border-black px-4 py-2 font-bold rounded-full transition-transform active:scale-95 whitespace-nowrap ${
                    isActive 
                      ? 'bg-yellow-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                      : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#0A0A0A]">
              {searchQuery || activeFilter !== 'All' ? 'Filtered Results' : 'All Trips'}
            </h2>
            <p className="text-gray-500 font-bold">{filteredTrips.length} trips found</p>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="w-12 h-12 border-4 border-[#0A0A0A] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTrips.length === 0 ? (
            /* Empty State */
            <div className="bg-white border-4 border-[#0A0A0A] rounded-[2rem] p-12 text-center shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] flex flex-col items-center mt-8">
              <div className="w-20 h-20 bg-[var(--color-primary)] rounded-full border-4 border-[#0A0A0A] flex items-center justify-center mb-6 rotate-12 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
                <Frown className="w-10 h-10 text-[#0A0A0A]" strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-black text-[#0A0A0A] mb-2">No trips found!</h3>
              <p className="text-lg text-gray-600 font-bold max-w-md">We couldn't find any trips matching your filters. Try adjusting your search or clear filters to see more.</p>
              <button 
                onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
                className="mt-8 bg-white text-[#0A0A0A] font-black border-4 border-[#0A0A0A] rounded-xl px-6 py-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* Results List */
            <div className="space-y-6">
              {filteredTrips.map(trip => (
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

      </div>
    </div>
  );
}
