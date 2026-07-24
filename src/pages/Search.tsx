import { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, MapPin, Star, Clock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('dest') || '';
  const [query, setQuery] = useState(initialQuery);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      let queryBuilder = supabase
        .from('trips')
        .select('*, agencies(name), packages(price)');

      if (query) {
        queryBuilder = queryBuilder.ilike('destination', `%${query}%`);
      }

      const { data } = await queryBuilder;
      
      if (data) {
        const formatted = data.map((trip: any) => {
          const minPrice = trip.packages && trip.packages.length > 0 
            ? Math.min(...trip.packages.map((p: any) => p.price)) 
            : trip.base_price;
          
          return {
            id: trip.id,
            title: trip.title,
            agency: trip.agencies?.name || 'Trioo Partner',
            duration: 'Flexible',
            rating: 4.9,
            price: minPrice,
            image: trip.cover_image || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
          };
        });
        setTrips(formatted);
      }
      setLoading(false);
    };

    fetchTrips();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 clay-card p-2 flex items-center gap-3">
          <div className="pl-4 text-gray-400"><SearchIcon className="w-5 h-5" /></div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, agencies, or themes..." 
            className="w-full bg-transparent border-none outline-none py-3 pr-4 font-medium"
          />
        </div>
        <button className="clay-btn-white px-6 py-4 flex items-center justify-center gap-2 md:w-auto w-full">
          <Filter className="w-5 h-5" /> Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="clay-card p-6">
            <h3 className="font-bold mb-4">Price Range</h3>
            <div className="space-y-4">
              <input type="range" className="w-full accent-primary" min="0" max="200000" />
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>₹0</span>
                <span>₹2,00,000+</span>
              </div>
            </div>
          </div>

          <div className="clay-card p-6">
            <h3 className="font-bold mb-4">Themes</h3>
            <div className="space-y-3">
              {['Adventure', 'Luxury', 'Nature', 'Snow', 'Beach', 'Honeymoon'].map(theme => (
                <label key={theme} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border-2 border-gray-200 group-hover:border-primary flex items-center justify-center transition-colors">
                    {/* Checkbox styling would go here */}
                  </div>
                  <span className="text-gray-600 font-medium select-none group-hover:text-gray-900">{theme}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-500 font-medium">
              {loading ? 'Searching...' : `Found `}
              {!loading && <span className="text-gray-900 font-bold">{trips.length}</span>}
              {!loading && ` packages`}
            </p>
            <select className="bg-transparent border-none outline-none font-medium text-gray-900 cursor-pointer">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map(i => (
                 <div key={i} className="h-72 bg-white/20 animate-pulse rounded-[2rem]"></div>
              ))
            ) : trips.length === 0 ? (
              <p className="text-gray-500 col-span-full">No trips found for "{query}".</p>
            ) : (
              trips.map((pkg) => (
                <Link to={`/package/${pkg.id}`} key={pkg.id} className="clay-card-interactive group flex flex-col overflow-hidden">
                  <div className="relative h-56 overflow-hidden">
                    <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 text-accent fill-accent" /> {pkg.rating}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1 text-xs text-primary font-bold uppercase tracking-wider mb-2">
                      <MapPin className="w-3 h-3" /> {pkg.agency}
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 mt-auto pt-4">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {pkg.duration}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400">Starting from</p>
                        <p className="font-bold text-xl">₹{pkg.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
