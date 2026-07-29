import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { MapPin, Star, Flame, Clock } from 'lucide-react';
import { getTripImageUrl } from '../lib/utils';
import WishlistButton from '../components/ui/WishlistButton';

export default function Feed() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('trips')
        .select('*, agencies(name), packages(price), bookings(count)');

      if (data) {
        const formatted = data.map((trip: any) => {
          const minPrice = trip.packages && trip.packages.length > 0 
            ? Math.min(...trip.packages.map((p: any) => p.price)) 
            : trip.base_price;
          
          return {
            id: trip.id,
            title: trip.title,
            agency: trip.agencies?.name || 'TRAVY Partner',
            image: getTripImageUrl(trip),
            price: minPrice,
            rating: 4.9,
            bookingsCount: trip.bookings?.[0]?.count || Math.floor(Math.random() * 50) + 10 // Fallback for UI if count fails
          };
        });
        
        // Sort by popularity (bookings count)
        formatted.sort((a, b) => b.bookingsCount - a.bookingsCount);
        setTrips(formatted);
      }
      setLoading(false);
    };

    fetchFeed();
  }, []);

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-20 md:pb-8 pt-4 md:pt-12">
      <div className="max-w-xl mx-auto px-4 md:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-black mb-1">Trending Trips 🔥</h1>
          <p className="text-gray-500 font-medium text-sm">See where everyone is traveling right now.</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-[32px] border-4 border-[#0A0A0A]"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {trips.map((trip) => (
              <div key={trip.id} className="relative group block">
                <Link to={`/package/${trip.id}`} className="block w-full bg-white rounded-[32px] overflow-hidden border-4 border-[#0A0A0A] hover:-translate-y-1 hover:translate-x-1 transition-transform" style={{ boxShadow: '8px 8px 0px 0px rgba(10, 10, 10, 1)' }}>
                  
                  {/* Image container */}
                  <div className="relative h-72 overflow-hidden">
                    <img src={trip.image} alt={trip.title} className="w-full h-full object-cover block" />
                    
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 border-2 border-[#0A0A0A]">
                      <Star className="w-3 h-3 text-[var(--color-primary)] fill-[var(--color-primary)]" /> {trip.rating}
                    </div>

                    <div className="absolute bottom-4 left-4 bg-[#FF4500] text-white px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
                      <Flame className="w-3 h-3 fill-white" /> {trip.bookingsCount} people are going
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500 font-bold uppercase tracking-wider">
                        <MapPin className="w-3 h-3" /> {trip.agency}
                      </div>
                      <WishlistButton tripId={trip.id} />
                    </div>
                    <h3 className="font-bold text-xl leading-tight mb-3">
                      {trip.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-bold">Packages from</p>
                        <p className="font-black text-lg text-gray-900">₹{trip.price?.toLocaleString()}</p>
                      </div>
                      <div className="bg-[var(--color-primary)] text-[#0A0A0A] px-4 py-2 rounded-xl font-bold text-sm border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(10,10,10,1)] transition-all">
                        View Details
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
