import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, User, LogOut } from 'lucide-react';
import { cn, getTripImageUrl } from '../lib/utils';

import WishlistButton from '../components/ui/WishlistButton';

export default function UserProfile() {
  const { session, user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'going' | 'wishlist' | 'recommended'>('going');
  const [tripsGoing, setTripsGoing] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const userId = user?.id;
      if (!userId) return;

      try {
        // Fetch Trips Going
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('trips(*, agencies(name), packages(price))')
          .eq('user_id', userId);
          
        const going = (bookingsData || []).map((b: any) => formatTrip(b.trips)).filter(Boolean);
        setTripsGoing(going);

        // Fetch Wishlist
        const { data: wishlistData } = await supabase
          .from('user_wishlist')
          .select('trips(*, agencies(name), packages(price))')
          .eq('user_id', userId);
          
        const saved = (wishlistData || []).map((w: any) => formatTrip(w.trips)).filter(Boolean);
        setWishlist(saved);

        // Fetch Recommended
        const goingIds = going.map((t: any) => t.id);
        const savedIds = saved.map((t: any) => t.id);
        const excludeIds = [...goingIds, ...savedIds];
        
        let query = supabase
          .from('trips')
          .select('*, agencies(name), packages(price)')
          .limit(4);
          
        if (excludeIds.length > 0) {
          query = query.not('id', 'in', `(${excludeIds.join(',')})`);
        }

        const { data: recs } = await query;
        setRecommended((recs || []).map((t: any) => formatTrip(t)).filter(Boolean));

      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, user, navigate]);

  const formatTrip = (trip: any) => {
    if (!trip) return null;
    const minPrice = trip.packages && trip.packages.length > 0 
      ? Math.min(...trip.packages.map((p: any) => p.price)) 
      : trip.base_price || 0;
      
    return {
      id: trip.id,
      title: trip.title || trip.destination,
      agency: trip.agencies?.name || 'TRAVY Partner',
      duration: 'Flexible',
      rating: 4.9,
      price: minPrice,
      image: getTripImageUrl(trip),
    };
  };

  const metadata = session?.user?.user_metadata || {};
  const avatarUrl = metadata.avatar_url;
  const fullName = metadata.full_name || 'Traveler';
  const email = session?.user?.email;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const renderTrips = (trips: any[], emptyMessage: string) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-[32px] border-4 border-[#0A0A0A]" style={{ boxShadow: '8px 8px 0px 0px rgba(10, 10, 10, 1)' }}></div>
          ))}
        </div>
      );
    }

    if (trips.length === 0) {
      return (
        <div className="p-12 text-center clay-card">
          <p className="text-xl text-gray-500 font-bold">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {trips.map((pkg) => (
          <div key={pkg.id} className="relative group block h-full">
            <div className="absolute top-4 left-4 z-20 group-hover:-translate-y-1 group-hover:-translate-x-1 transition-all duration-200">
              <WishlistButton tripId={pkg.id} />
            </div>
            <Link to={`/package/${pkg.id}`} className="clay-card-interactive group-card flex flex-col overflow-hidden h-full">
              <div className="relative h-56 overflow-hidden">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 border-2 border-[#0A0A0A]">
                  <Star className="w-3 h-3 text-[var(--color-primary)] fill-[var(--color-primary)]" /> {pkg.rating}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 bg-white">
                <div className="flex items-center gap-1 text-xs text-[var(--color-primary)] font-bold uppercase tracking-wider mb-2">
                  <MapPin className="w-3 h-3" /> {pkg.agency}
                </div>
                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                  {pkg.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 mt-auto pt-4">
                  <span className="flex items-center gap-1 font-bold text-[#0A0A0A]/70"><Clock className="w-4 h-4" /> {pkg.duration}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Starting from</p>
                    <p className="font-black text-xl text-[#0A0A0A]">₹{pkg.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Profile Header */}
      <div className="clay-card p-4 md:p-8 mb-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#0A0A0A] shrink-0" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl text-gray-400 font-black">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-4xl font-black text-[#0A0A0A] mb-2">{fullName}</h1>
          <p className="text-xl text-gray-600 font-medium mb-4">{email}</p>
          <button 
            onClick={handleSignOut}
            className="clay-btn-white px-6 py-2.5 inline-flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-32 w-64 h-64 bg-[var(--color-pink)]/10 rounded-full blur-3xl -z-0" />
      </div>


      {/* TRAVY Wallet & Rewards Neo-Brutalist Card */}
      <div className="bg-yellow-300 border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#0A0A0A] mb-1 flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>
              TRAVY Wallet & Rewards
            </h2>
            <p className="text-black/80 font-bold">Available Balance</p>
            <p className="text-4xl font-black text-black mt-2">₹2,500</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-bold text-gray-500 uppercase">Referral Credits</p>
              <p className="font-black text-lg">₹500</p>
            </div>
            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-bold text-gray-500 uppercase">Creator Earnings</p>
              <p className="font-black text-lg">₹4,500</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full text-left text-sm font-bold">
            <thead className="bg-gray-100 border-b-2 border-black">
              <tr>
                <th className="py-2 px-4 text-black uppercase tracking-wider">Transaction</th>
                <th className="py-2 px-4 text-black uppercase tracking-wider">Date</th>
                <th className="py-2 px-4 text-black text-right uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 border-black/10">
                <td className="py-3 px-4">Creator Reel Cashback</td>
                <td className="py-3 px-4 text-gray-600">Jun 28, 2026</td>
                <td className="py-3 px-4 text-right text-green-600">+₹2,500</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Flight Booking (Goa)</td>
                <td className="py-3 px-4 text-gray-600">Jun 15, 2026</td>
                <td className="py-3 px-4 text-right text-red-600">-₹12,400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('going')}
          className={cn(
            "px-6 py-3 rounded-full font-bold border-4 transition-all duration-200",
            activeTab === 'going' 
              ? "bg-[var(--color-primary)] border-[#0A0A0A] text-[#0A0A0A] shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] -translate-y-1 translate-x-1"
              : "bg-[var(--color-card)] border-transparent text-[#0A0A0A]/70 hover:opacity-80"
          )}
        >
          Trips Going
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={cn(
            "px-6 py-3 rounded-full font-bold border-4 transition-all duration-200",
            activeTab === 'wishlist' 
              ? "bg-[var(--color-primary)] border-[#0A0A0A] text-[#0A0A0A] shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] -translate-y-1 translate-x-1"
              : "bg-[var(--color-card)] border-transparent text-[#0A0A0A]/70 hover:opacity-80"
          )}
        >
          Wishlist
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={cn(
            "px-6 py-3 rounded-full font-bold border-4 transition-all duration-200",
            activeTab === 'recommended' 
              ? "bg-[var(--color-primary)] border-[#0A0A0A] text-[#0A0A0A] shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] -translate-y-1 translate-x-1"
              : "bg-[var(--color-card)] border-transparent text-[#0A0A0A]/70 hover:opacity-80"
          )}
        >
          Recommended for You
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'going' && renderTrips(tripsGoing, "You don't have any upcoming trips yet.")}
        {activeTab === 'wishlist' && renderTrips(wishlist, "Your wishlist is empty. Start exploring!")}
        {activeTab === 'recommended' && renderTrips(recommended, "No recommendations available at the moment.")}
      </div>
    </div>
  );
}
