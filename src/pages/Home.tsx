import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Calendar, Users, ArrowRight, Star, Wallet, PlayCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DestinationCard } from '../components/ui/card-21';
import { Marquee } from '../components/ui/Marquee';
import { supabase } from '../lib/supabase';
import LandingAuthModal from '../components/auth/LandingAuthModal';
import heroImage1 from '../assets/images/regenerated_image_1785007937394.png';
import { getTripImageUrl } from '../lib/utils';

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
            image: getTripImageUrl(trip),
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
    <div className="w-full overflow-x-hidden">
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
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] text-[#0A0A0A]">
                Travel Together.<br />
                <span className="text-gradient">Travel Smarter.</span>
              </h1>
              <p className="text-lg md:text-xl text-[#0A0A0A]/80 font-bold mb-10 max-w-lg leading-relaxed">
                Compare verified agency packages, save for your goals in the TRAVY Wallet, and earn rewards for sharing your journey.
              </p>

              {/* Search Box - Neo-brutalism style */}
              <form onSubmit={handleSearch} className="bg-[var(--color-card)] border-4 border-[#0A0A0A] rounded-[32px] p-4 flex flex-col md:flex-row gap-4 max-w-2xl relative z-10" style={{ boxShadow: '8px 8px 0px 0px rgba(10, 10, 10, 1)' }}>
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border-4 border-[#0A0A0A] focus-within:-translate-y-1 focus-within:translate-x-1 transition-transform" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}>
                  <MapPin className="w-5 h-5 text-gray-800" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-800 font-bold uppercase tracking-wider mb-0.5">Where</p>
                    <input type="text" placeholder="Search destinations" className="w-full bg-transparent border-none outline-none text-sm font-semibold placeholder:font-normal placeholder:text-gray-500 text-[#0A0A0A]" />
                  </div>
                </div>
                
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border-4 border-[#0A0A0A] focus-within:-translate-y-1 focus-within:translate-x-1 transition-transform" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}>
                  <Calendar className="w-5 h-5 text-gray-800" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-800 font-bold uppercase tracking-wider mb-0.5">Dates</p>
                    <input type="text" placeholder="Add dates" className="w-full bg-transparent border-none outline-none text-sm font-semibold placeholder:font-normal placeholder:text-gray-500 text-[#0A0A0A]" />
                  </div>
                </div>

                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border-4 border-[#0A0A0A] focus-within:-translate-y-1 focus-within:translate-x-1 transition-transform" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}>
                  <Users className="w-5 h-5 text-gray-800" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-800 font-bold uppercase tracking-wider mb-0.5">Who</p>
                    <input type="text" placeholder="Add guests" className="w-full bg-transparent border-none outline-none text-sm font-semibold placeholder:font-normal placeholder:text-gray-500 text-[#0A0A0A]" />
                  </div>
                </div>

                <button type="submit" className="clay-btn-primary px-8 flex items-center justify-center shrink-0 w-full md:w-auto mt-2 md:mt-0 py-4 md:py-0 relative overflow-hidden group">
                  <Search className="w-5 h-5 text-[#0A0A0A] relative z-10" strokeWidth={3} />
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
                <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-[2rem] overflow-hidden z-10 transform rotate-3 border-4 border-[#0A0A0A]" style={{ boxShadow: '12px 12px 0px 0px rgba(10, 10, 10, 1)' }}>
                  <img src={heroImage1} alt="Travel" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-10 left-0 w-3/5 h-3/5 rounded-[2rem] overflow-hidden z-20 transform -rotate-6 border-4 border-[#0A0A0A] bg-white" style={{ boxShadow: '12px 12px 0px 0px rgba(10, 10, 10, 1)', padding: '8px', paddingBottom: '32px' }}>
                  <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop" alt="Travel" className="w-full h-full object-cover rounded-xl border-2 border-[#0A0A0A]" />
                </div>
                {/* Floating elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-20 -left-10 glass-panel p-4 flex items-center gap-3 z-30"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center border-4 border-[#0A0A0A]" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}>
                    <Star className="w-6 h-6 text-[#0A0A0A] fill-[#0A0A0A]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Top Rated</p>
                    <p className="text-sm font-black text-[#0A0A0A]">4.9/5 Average</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted Travel Partners */}
      <section className="py-12 bg-[var(--color-card)] border-y-4 border-[#0A0A0A] relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-sm font-black text-[#0A0A0A] uppercase tracking-widest">Trusted Travel Partners</p>
        </div>
        {agencies.length > 0 ? (
          <Marquee items={agencies} />
        ) : (
          <div className="flex justify-center">
            <div className="animate-pulse flex gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 w-48 bg-gray-200 rounded-full border-4 border-[#0A0A0A]"></div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Featured Destinations */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#0A0A0A]" style={{ textShadow: '2px 2px 0px var(--color-card)' }}>Trending Destinations</h2>
              <p className="text-[#0A0A0A] font-bold text-lg bg-white inline-block px-3 py-1 border-2 border-[#0A0A0A] transform -rotate-1" style={{ boxShadow: '2px 2px 0px 0px rgba(10,10,10,1)' }}>Most searched places right now</p>
            </div>
            <Link to="/search" className="inline-flex items-center gap-2 text-[#0A0A0A] font-black bg-white px-6 py-3 border-4 border-[#0A0A0A] rounded-full hover:-translate-y-1 hover:translate-x-1 transition-transform" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}>
              See all <ArrowRight className="w-5 h-5" strokeWidth={3} />
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
                    tripId={dest.id}
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

      {/* TRAVY Wallet Promo */}
      <section className="px-6 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="clay-card bg-[var(--color-primary)] text-[#0A0A0A] p-8 md:p-16 rounded-[3rem] relative overflow-hidden border-4 border-[#0A0A0A]" style={{ boxShadow: '12px 12px 0px 0px rgba(10,10,10,1)' }}>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#0A0A0A] mb-6" style={{ boxShadow: '2px 2px 0px 0px rgba(10,10,10,1)' }}>
                  <Wallet className="w-4 h-4 text-[#0A0A0A]" />
                  <span className="text-sm font-black text-[#0A0A0A]">TRAVY Wallet</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight text-[#0A0A0A]" style={{ textShadow: '2px 2px 0px var(--color-card)' }}>Save seamlessly.<br />Travel limitlessly.</h2>
                <p className="text-[#0A0A0A] font-bold text-lg mb-8 max-w-md bg-white/60 p-4 border-2 border-[#0A0A0A] rounded-xl" style={{ boxShadow: '4px 4px 0px 0px rgba(10,10,10,1)' }}>
                  Set auto-save goals for your dream trips. Unlock exclusive milestones, earn cashback, and get priority booking when you use your TRAVY Wallet.
                </p>
                <Link to="/wallet" className="clay-btn-white inline-flex items-center gap-2 px-8 py-4 text-xl">
                  Start Saving <ArrowRight className="w-6 h-6" strokeWidth={3} />
                </Link>
              </div>
              <div className="md:w-1/2 flex justify-center">
                {/* Simulated Wallet App UI */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="w-full max-w-sm bg-white border-4 border-[#0A0A0A] rounded-[2.5rem] p-6"
                  style={{ boxShadow: '8px 8px 0px 0px rgba(10,10,10,1)' }}
                >
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-12 h-12 bg-[#0A0A0A] text-[var(--color-primary)] rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black bg-[var(--color-primary)] text-[#0A0A0A] px-3 py-1 rounded-full border-2 border-[#0A0A0A]">Pro</span>
                  </div>
                  <p className="text-[#0A0A0A]/70 font-bold text-sm mb-1">Total Balance</p>
                  <p className="text-4xl md:text-5xl text-[#0A0A0A] font-black mb-8 tracking-tighter">₹82,000</p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-2xl p-4 border-2 border-[#0A0A0A]" style={{ boxShadow: '4px 4px 0px 0px rgba(10,10,10,1)' }}>
                      <div className="flex justify-between text-sm mb-2 text-[#0A0A0A]">
                        <span className="font-black">Japan Trip Goal</span>
                        <span className="font-black text-[var(--color-primary)] bg-[#0A0A0A] px-2 py-0.5 rounded-md">65%</span>
                      </div>
                      <div className="h-4 bg-white border-2 border-[#0A0A0A] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: '65%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-[#0A0A0A]"
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
      <section className="px-6 py-20 relative z-10 mt-20 border-t-4 border-[#0A0A0A] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <img src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=600&auto=format&fit=crop" className="rounded-3xl object-cover h-64 w-full border-4 border-[#0A0A0A]" style={{ boxShadow: '4px 4px 0px 0px rgba(10,10,10,1)' }} alt="Creator" />
                <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop" className="rounded-3xl object-cover h-48 w-full border-4 border-[#0A0A0A]" style={{ boxShadow: '4px 4px 0px 0px rgba(10,10,10,1)' }} alt="Creator" />
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop" className="rounded-3xl object-cover h-48 w-full border-4 border-[#0A0A0A]" style={{ boxShadow: '4px 4px 0px 0px rgba(10,10,10,1)' }} alt="Creator" />
                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop" className="rounded-3xl object-cover h-64 w-full border-4 border-[#0A0A0A]" style={{ boxShadow: '4px 4px 0px 0px rgba(10,10,10,1)' }} alt="Creator" />
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-[#0A0A0A] leading-[1.1]" style={{ textShadow: '2px 2px 0px var(--color-primary)' }}>Upload Reels.<br />Earn Rewards.</h2>
            <p className="text-xl font-bold text-[#0A0A0A]/80 mb-8 leading-relaxed">
              Join the TRAVY Creator Program. Upload your travel reels and stories, get them verified, and earn instant wallet cashback, travel coins, and exclusive discounts for your next trip.
            </p>
            <ul className="space-y-4 mb-10">
              {['Upload high-quality travel vlogs', 'Get verified by the TRAVY team', 'Earn up to ₹5,000 in Wallet Credits per video', 'Unlock "Top Creator" badges'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 bg-[var(--color-card)] p-3 rounded-xl border-2 border-[#0A0A0A]" style={{ boxShadow: '2px 2px 0px 0px rgba(10,10,10,1)' }}>
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0 border-2 border-[#0A0A0A]">
                    <Star className="w-4 h-4 text-[#0A0A0A] fill-[#0A0A0A]" />
                  </div>
                  <span className="font-black text-[#0A0A0A]">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/creators" className="clay-btn-primary px-8 py-4 inline-flex items-center gap-2 text-xl">
              <PlayCircle className="w-6 h-6" strokeWidth={3} /> Become a Creator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
