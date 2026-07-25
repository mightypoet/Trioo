import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Calendar, Users, ArrowRight, Star, Wallet, PlayCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DestinationCard } from '../components/ui/card-21';
import { Marquee } from '../components/ui/Marquee';
import { supabase } from '../lib/supabase';
import LandingAuthModal from '../components/auth/LandingAuthModal';

export default function Home() {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      const { data } = await supabase
        .from('agencies')
        .select('id, name, logo_url')
        .eq('verification_status', 'verified');
      if (data) {
        setAgencies(data);
      }
    };
    fetchAgencies();
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoadingTrips(true);
      const { data } = await supabase
        .from('trips')
        .select('*, agencies(name), packages(price)')
        .order('created_at', { ascending: false })
        .limit(4);

      if (data) {
        const formatted = data.map((trip: any) => {
          const minPrice = trip.packages && trip.packages.length > 0 
            ? Math.min(...trip.packages.map((p: any) => p.price)) 
            : trip.base_price;
          
          return {
            id: trip.id,
            name: `${trip.destination}`,
            image: trip.cover_image || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
            price: `₹${minPrice.toLocaleString()}`,
            themeColor: '210 100% 60%',
            stats: `Packages from ₹${minPrice.toLocaleString()}`
          };
        });
        setDestinations(formatted);
      }
      setLoadingTrips(false);
    };
    fetchTrips();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search');
  };

  return (
    <div className="w-full">
      <LandingAuthModal />
      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-32 z-10">

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:w-1/2"
            >
              <div className="inline-block px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white mb-6 shadow-sm">
                <span className="text-sm font-semibold text-primary">✨ The Modern Travel Marketplace</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] text-text-main">
                Travel Together.<br />
                <span className="text-gradient">Travel Smarter.</span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 max-w-lg leading-relaxed">
                Compare verified agency packages, save for your goals in the Trioo Wallet, and earn rewards for sharing your journey.
              </p>

              {/* Search Box - Claymorphism style */}
              <form onSubmit={handleSearch} className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg rounded-[32px] p-4 flex flex-col md:flex-row gap-4 max-w-2xl relative z-10">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/50 rounded-2xl border border-white/60 focus-within:bg-white/80 transition-all">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Where</p>
                    <input type="text" placeholder="Search destinations" className="w-full bg-transparent border-none outline-none text-sm font-semibold placeholder:font-normal placeholder:text-gray-400" />
                  </div>
                </div>
                
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/50 rounded-2xl border border-white/60 focus-within:bg-white/80 transition-all">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Dates</p>
                    <input type="text" placeholder="Add dates" className="w-full bg-transparent border-none outline-none text-sm font-semibold placeholder:font-normal placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/50 rounded-2xl border border-white/60 focus-within:bg-white/80 transition-all">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Who</p>
                    <input type="text" placeholder="Add guests" className="w-full bg-transparent border-none outline-none text-sm font-semibold placeholder:font-normal placeholder:text-gray-400" />
                  </div>
                </div>

                <button type="submit" className="bg-gradient-to-tr from-[var(--color-secondary)] via-[var(--color-purple)] to-[var(--color-pink)] text-white rounded-full font-bold transition-all duration-300 shadow-[0_0_20px_rgba(138,43,226,0.5)] hover:shadow-[0_0_30px_rgba(138,43,226,0.8)] animate-pulse px-8 flex items-center justify-center shrink-0 w-full md:w-auto mt-2 md:mt-0 py-4 md:py-0 active:scale-95 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 blur-md group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                  <Search className="w-5 h-5 relative z-10" />
                </button>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="lg:w-1/2 relative"
            >
              {/* Image composition simulating floating polaroids/cards */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-[2rem] overflow-hidden shadow-2xl z-10 transform rotate-3">
                  <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800&auto=format&fit=crop" alt="Travel" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-10 left-0 w-3/5 h-3/5 rounded-[2rem] overflow-hidden shadow-2xl z-20 transform -rotate-6 border-8 border-white">
                  <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop" alt="Travel" className="w-full h-full object-cover" />
                </div>
                {/* Floating elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-20 -left-10 glass-panel p-4 flex items-center gap-3 z-30"
                >
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-success fill-success" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Top Rated</p>
                    <p className="text-sm font-bold">4.9/5 Average</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted Travel Partners */}
      <section className="py-12 bg-gray-50/50 backdrop-blur-md border-b border-white/50 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Trusted Travel Partners</p>
        </div>
        {agencies.length > 0 ? (
          <Marquee items={agencies} />
        ) : (
          <div className="flex justify-center">
            <div className="animate-pulse flex gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 w-48 bg-white/20 rounded-full border border-white/30"></div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Featured Destinations */}
      <section className="px-6 py-20 bg-white/40 backdrop-blur-xl border-y border-white/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Trending Destinations</h2>
              <p className="text-gray-500 text-lg">Most searched places right now</p>
            </div>
            <Link to="/search" className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              See all <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingTrips ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-[400px] bg-white/20 animate-pulse rounded-[2rem]"></div>
              ))
            ) : destinations.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">No trips available right now.</p>
            ) : (
              destinations.map((dest, i) => (
                <motion.div 
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="h-[400px]"
                >
                  <DestinationCard
                    imageUrl={dest.image}
                    location={dest.name}
                    stats={dest.stats}
                    href={`/package/${dest.id}`}
                    themeColor={dest.themeColor}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trioo Wallet Promo */}
      <section className="px-6 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="clay-card bg-gradient-to-br from-[var(--color-secondary)] via-[var(--color-purple)] to-[var(--color-pink)] p-8 md:p-16 rounded-[3rem] text-white relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm font-semibold">Trioo Wallet</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">Save seamlessly.<br />Travel limitlessly.</h2>
                <p className="text-white/80 text-lg mb-8 max-w-md">
                  Set auto-save goals for your dream trips. Unlock exclusive milestones, earn cashback, and get priority booking when you use your Trioo Wallet.
                </p>
                <Link to="/wallet" className="clay-btn-white inline-flex items-center gap-2 px-8 py-4">
                  Start Saving <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="md:w-1/2 flex justify-center">
                {/* Simulated Wallet App UI */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2.5rem] p-6 shadow-2xl"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Pro</span>
                  </div>
                  <p className="text-white/70 text-sm mb-1">Total Balance</p>
                  <p className="text-4xl font-bold mb-8 tracking-tight">₹82,000</p>
                  
                  <div className="space-y-4">
                    <div className="bg-white/20 rounded-2xl p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Japan Trip Goal</span>
                        <span className="font-bold">65%</span>
                      </div>
                      <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: '65%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-white rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Program */}
      <section className="px-6 py-20 bg-white/40 backdrop-blur-xl border-y border-white/50 relative z-10 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <img src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=600&auto=format&fit=crop" className="rounded-3xl object-cover h-64 w-full" alt="Creator" />
                <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop" className="rounded-3xl object-cover h-48 w-full" alt="Creator" />
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop" className="rounded-3xl object-cover h-48 w-full" alt="Creator" />
                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop" className="rounded-3xl object-cover h-64 w-full" alt="Creator" />
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold mb-6">Upload Reels. Earn Rewards.</h2>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Join the Trioo Creator Program. Upload your travel reels and stories, get them verified, and earn instant wallet cashback, travel coins, and exclusive discounts for your next trip.
            </p>
            <ul className="space-y-4 mb-10">
              {['Upload high-quality travel vlogs', 'Get verified by the Trioo team', 'Earn up to ₹5,000 in Wallet Credits per video', 'Unlock "Top Creator" badges'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink/10 flex items-center justify-center shrink-0">
                    <Star className="w-3 h-3 text-pink fill-pink" />
                  </div>
                  <span className="font-medium text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/creators" className="clay-btn-primary bg-gradient-to-r from-pink to-purple px-8 py-4 inline-flex items-center gap-2">
              <PlayCircle className="w-5 h-5" /> Become a Creator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
