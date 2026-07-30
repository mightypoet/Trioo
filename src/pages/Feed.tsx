import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { MapPin, Star, Flame, Plus, X, Video } from 'lucide-react';
import { getTripImageUrl } from '../lib/utils';
import WishlistButton from '../components/ui/WishlistButton';

export default function Feed() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [creatorUsername, setCreatorUsername] = useState('');
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFeed = async () => {
    setLoading(true);
    
    // Fetch trips
    const { data: tripsData } = await supabase
      .from('trips')
      .select('*, agencies(name), packages(price), bookings(count)');
      
    // Fetch reels (ignore errors if table doesn't exist yet, we'll just get null)
    const { data: reelsData, error: reelsError } = await supabase
      .from('creator_reels')
      .select('*')
      .order('created_at', { ascending: false });

    if (reelsError && reelsError.code !== '42P01') {
      console.warn('Error fetching reels:', reelsError);
    }

    let tripsFormatted: any[] = [];
    if (tripsData) {
      tripsFormatted = tripsData.map((trip: any) => {
        const minPrice = trip.packages && trip.packages.length > 0 
           ? Math.min(...trip.packages.map((p: any) => p.price)) 
           : trip.base_price;
           
        return {
          type: 'trip',
          id: trip.id,
          title: trip.title,
          agency: trip.agencies?.name || 'TRAVY Partner',
          image: getTripImageUrl(trip),
          price: minPrice,
          rating: 4.9,
          bookingsCount: trip.bookings?.[0]?.count || Math.floor(Math.random() * 50) + 10 // Fallback for UI if count fails
        };
      });
      // Sort trips by popularity
      tripsFormatted.sort((a, b) => b.bookingsCount - a.bookingsCount);
    }

    let reelsFormatted: any[] = [];
    if (reelsData) {
      reelsFormatted = reelsData.map((reel: any) => ({
        type: 'reel',
        id: `reel-${reel.id}`,
        url: reel.url,
        creatorUsername: reel.creator_username,
        caption: reel.caption,
        created_at: reel.created_at
      }));
    }

    // Interleave reels and trips
    const combined = [];
    let reelIndex = 0;
    let tripIndex = 0;
    
    while (tripIndex < tripsFormatted.length || reelIndex < reelsFormatted.length) {
      if (reelIndex < reelsFormatted.length) {
        combined.push(reelsFormatted[reelIndex]);
        reelIndex++;
      }
      if (tripIndex < tripsFormatted.length) {
        combined.push(tripsFormatted[tripIndex]);
        tripIndex++;
      }
      if (tripIndex < tripsFormatted.length) {
        combined.push(tripsFormatted[tripIndex]);
        tripIndex++;
      }
    }

    setFeedItems(combined);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleShareReel = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // ensure Instagram URLs have /embed
    let formattedUrl = url;
    if (formattedUrl.includes('instagram.com') && !formattedUrl.includes('/embed')) {
      formattedUrl = `${formattedUrl.replace(/\/$/, '')}/embed`;
    }
    
    const { error } = await supabase
      .from('creator_reels')
      .insert([
        { url: formattedUrl, creator_username: creatorUsername, caption }
      ]);
      
    setSubmitting(false);
    if (!error) {
      setIsModalOpen(false);
      setUrl('');
      setCreatorUsername('');
      setCaption('');
      fetchFeed();
    } else {
      console.error(error);
      alert('Failed to share reel. Make sure the creator_reels table exists.');
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-20 md:pb-8 pt-4 md:pt-12">
      <div className="max-w-xl mx-auto px-4 md:px-0">
        
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black mb-1">Trending Feed 🔥</h1>
            <p className="text-gray-500 font-medium text-sm">See where everyone is traveling right now.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--color-primary)] text-[#0A0A0A] font-black border-4 border-[#0A0A0A] rounded-[16px] px-4 py-2 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] transition-all flex items-center gap-2 text-sm shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> <span className="hidden sm:inline">Share Reel</span><span className="sm:hidden">Reel</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-[32px] border-4 border-[#0A0A0A]"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {feedItems.map((item) => (
              item.type === 'trip' ? (
                <div key={`trip-${item.id}`} className="relative group block">
                  <Link to={`/package/${item.id}`} className="block w-full bg-white rounded-[32px] overflow-hidden border-4 border-[#0A0A0A] hover:-translate-y-1 hover:translate-x-1 transition-transform" style={{ boxShadow: '8px 8px 0px 0px rgba(10, 10, 10, 1)' }}>
                    
                    {/* Image container */}
                    <div className="relative h-72 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover block" />
                      
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 border-2 border-[#0A0A0A]">
                        <Star className="w-3 h-3 text-[var(--color-primary)] fill-[var(--color-primary)]" /> {item.rating}
                      </div>
                      <div className="absolute bottom-4 left-4 bg-[#FF4500] text-white px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
                        <Flame className="w-3 h-3 fill-white" /> {item.bookingsCount} people are going
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-bold uppercase tracking-wider">
                          <MapPin className="w-3 h-3" /> {item.agency}
                        </div>
                        <WishlistButton tripId={item.id} />
                      </div>
                      <h3 className="font-bold text-xl leading-tight mb-3">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 font-bold">Packages from</p>
                          <p className="font-black text-lg text-gray-900">₹{item.price?.toLocaleString()}</p>
                        </div>
                        <div className="bg-[var(--color-primary)] text-[#0A0A0A] px-4 py-2 rounded-xl font-bold text-sm border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(10,10,10,1)] transition-all">
                          View Details
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ) : (
                <div key={item.id} className="relative group block bg-white rounded-[32px] overflow-hidden border-4 border-[#0A0A0A]" style={{ boxShadow: '8px 8px 0px 0px rgba(10, 10, 10, 1)' }}>
                  <div className="p-4 border-b-2 border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FF90E8] rounded-full flex items-center justify-center border-2 border-[#0A0A0A] font-black text-lg">
                        {item.creatorUsername?.charAt(0)?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0A0A0A]">{item.creatorUsername}</p>
                        <p className="text-xs text-gray-500 font-bold">Shared a Reel</p>
                      </div>
                    </div>
                    <div className="bg-[var(--color-primary)] text-[#0A0A0A] text-[10px] font-black px-2 py-1 rounded border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] uppercase tracking-wider">
                      Reel
                    </div>
                  </div>
                  
                  <div className="relative w-full aspect-[9/16] bg-black">
                     <iframe 
                       src={item.url} 
                       className="w-full h-full border-none"
                       allowFullScreen
                       title={item.caption}
                       scrolling="no"
                     ></iframe>
                  </div>
                  
                  <div className="p-5">
                    <p className="font-bold text-gray-800 text-sm md:text-base leading-relaxed">{item.caption}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* Share Reel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-4 border-[#0A0A0A] rounded-[32px] p-6 w-full max-w-md relative animate-in fade-in zoom-in duration-200" style={{ boxShadow: '8px 8px 0px 0px rgba(10,10,10,1)' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full border-2 border-[#0A0A0A] hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-4 h-4 text-[#0A0A0A]" strokeWidth={3} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FF90E8] rounded-xl border-2 border-[#0A0A0A] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
                <Video className="w-5 h-5 text-[#0A0A0A]" />
              </div>
              <h2 className="text-xl font-black text-[#0A0A0A]">Share a Reel</h2>
            </div>
            
            <form onSubmit={handleShareReel} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-[#0A0A0A] mb-1">Video / Instagram Reel URL *</label>
                <input 
                  type="url" 
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/..."
                  className="w-full bg-white border-2 border-[#0A0A0A] rounded-xl px-4 py-3 font-bold text-[#0A0A0A] placeholder:font-medium placeholder:text-gray-400 outline-none focus:shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] transition-shadow"
                />
              </div>
              
              <div>
                <label className="block text-sm font-black text-[#0A0A0A] mb-1">Creator Username *</label>
                <input 
                  type="text"
                  required
                  value={creatorUsername}
                  onChange={e => setCreatorUsername(e.target.value)}
                  placeholder="@travy.in"
                  className="w-full bg-white border-2 border-[#0A0A0A] rounded-xl px-4 py-3 font-bold text-[#0A0A0A] placeholder:font-medium placeholder:text-gray-400 outline-none focus:shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] transition-shadow"
                />
              </div>
              
              <div>
                <label className="block text-sm font-black text-[#0A0A0A] mb-1">Caption</label>
                <textarea 
                  required
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Tell us about this destination..."
                  rows={3}
                  className="w-full bg-white border-2 border-[#0A0A0A] rounded-xl px-4 py-3 font-bold text-[#0A0A0A] placeholder:font-medium placeholder:text-gray-400 outline-none focus:shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] transition-shadow resize-none"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[var(--color-primary)] text-[#0A0A0A] font-black border-4 border-[#0A0A0A] rounded-xl px-4 py-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-lg"
              >
                {submitting ? 'Publishing...' : 'Publish Reel'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
