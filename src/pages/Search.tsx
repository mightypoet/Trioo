import { useState } from 'react';
import { Search as SearchIcon, Filter, MapPin, Star, Clock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const PACKAGES = [
  { id: 1, title: 'Kyoto Cherry Blossom Special', agency: 'Zen Tours', duration: '7 Days', rating: 4.9, price: 85000, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', tags: ['Nature', 'Couples'] },
  { id: 2, title: 'Santorini Luxury Getaway', agency: 'Aegean Dreams', duration: '5 Days', rating: 5.0, price: 112000, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop', tags: ['Luxury', 'Honeymoon'] },
  { id: 3, title: 'Bali Adventure & Surf', agency: 'Island Explorers', duration: '10 Days', rating: 4.8, price: 45000, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop', tags: ['Adventure', 'Beach'] },
  { id: 4, title: 'Swiss Alps Ski Retreat', agency: 'Alpine Adventures', duration: '6 Days', rating: 4.9, price: 150000, image: 'https://images.unsplash.com/photo-1531366936337-77b5a83ab825?q=80&w=800&auto=format&fit=crop', tags: ['Snow', 'Luxury'] },
  { id: 5, title: 'Kerala Backwaters Tour', agency: 'Incredible India', duration: '4 Days', rating: 4.7, price: 25000, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop', tags: ['Nature', 'Family'] },
  { id: 6, title: 'Dubai City & Desert Safari', agency: 'Desert Oasis Tours', duration: '5 Days', rating: 4.8, price: 65000, image: 'https://images.unsplash.com/photo-1512453979436-5a5338098f94?q=80&w=800&auto=format&fit=crop', tags: ['City', 'Adventure'] },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('dest') || '';
  const [query, setQuery] = useState(initialQuery);

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
            <p className="text-gray-500 font-medium">Found <span className="text-gray-900 font-bold">{PACKAGES.length}</span> packages</p>
            <select className="bg-transparent border-none outline-none font-medium text-gray-900 cursor-pointer">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
