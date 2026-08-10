import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Calendar, Users, ArrowRight, Star, Wallet, PlayCircle, Zap, Map, ShieldCheck, Quote, ExternalLink, IndianRupee, CheckCircle2, Home as HomeIcon, Flame } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PinkDevilBot } from './PinkDevilBot';
import { Navigation } from 'lucide-react';
import { DestinationCard } from '../components/ui/card-21';
import { Marquee } from '../components/ui/Marquee';
import { supabase } from '../lib/supabase';
import AuthModal from '../components/auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';
import heroImage1 from '../assets/images/regenerated_image_1785007937394.png';
import { getTripImageUrl } from '../lib/utils';

export default function Home() {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user && !localStorage.getItem('travy_has_visited')) {
      const timer = setTimeout(() => {
        setIsWelcomeModalOpen(true);
        localStorage.setItem('travy_has_visited', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const navigate = useNavigate();
  const [agencies, setAgencies] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

    const fullPrompt = `${queryText}. ${startDate && endDate ? 'Dates: ' + startDate + ' to ' + endDate + '.' : ''} ${budget ? 'Budget: ' + budget + '.' : ''}`;

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


  return (
    <div className="w-full overflow-x-hidden">
      <AuthModal isOpen={isWelcomeModalOpen} onClose={() => setIsWelcomeModalOpen(false)} />
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 z-10 flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col items-center justify-center"
        >
          <div className="inline-block bg-[#0A0A0A] text-[var(--color-primary)] px-4 py-1.5 border-4 border-[#0A0A0A] rounded-full text-xs font-black tracking-widest uppercase mb-6" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}>
            AI-POWERED TRAVEL PLANNING
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] text-[#0A0A0A] text-center">
            Just tell us where.<br />
            <span className="text-gradient">We'll handle everything else.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#0A0A0A]/80 font-bold mb-10 max-w-2xl leading-relaxed text-center mx-auto">
            Travy's AI plans your itinerary, compares hotels and homestays, books adventures, and manages tickets - from one conversation.
          </p>

          
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
                          to={`/package/${tripDetails.id}`}
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
                    <div className="space-y-8">
                      {plan?.itinerary?.map((day: any, idx: number) => (
                        <div key={idx} className="relative pl-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-[-24px] last:before:bottom-0 before:w-1 before:bg-[#0A0A0A]">
                          <div className="absolute left-0 top-1 w-6 h-6 bg-yellow-400 border-2 border-[#0A0A0A] rounded-full flex items-center justify-center font-black text-xs z-10">
                            {day.day}
                          </div>
                          <h4 className="text-2xl font-black text-[#0A0A0A] mb-2">{day.title}</h4>
                          <p className="text-gray-700 font-medium leading-relaxed mb-6">
                            {day.description}
                          </p>
                          
                          {day.spots && day.spots.length > 0 && (
                            <div className="space-y-6 mt-4">
                              {day.spots.map((spot: any, spotIdx: number) => (
                                <div key={spotIdx}>
                                  {/* Spot Card */}
                                  <div className="bg-white p-5 rounded-2xl border-4 border-[#0A0A0A] shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="text-xl font-black text-[#0A0A0A] pr-4">{spot.spotName}</h5>
                                      {spot.spotMapUrl && (
                                        <a 
                                          href={spot.spotMapUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="flex-shrink-0 bg-green-400 p-2 rounded-lg border-2 border-[#0A0A0A] hover:bg-green-300 transition-colors shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]"
                                          title="View on Google Maps"
                                        >
                                          <ExternalLink className="w-4 h-4 text-[#0A0A0A]" />
                                        </a>
                                      )}
                                    </div>
                                    <p className="text-gray-600 font-medium text-sm leading-relaxed">
                                      {spot.description}
                                    </p>
                                  </div>
                                  
                                  {/* Transit Card (if not the last spot) */}
                                  {spot.transitToNext && spotIdx < day.spots.length - 1 && (
                                    <div className="ml-8 my-4 relative">
                                      {/* Vertical connection line */}
                                      <div className="absolute -left-8 top-1/2 -mt-px w-8 h-[2px] bg-[#0A0A0A] border-dashed border-t-2" />
                                      
                                      <div className="bg-blue-100 p-3 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div className="bg-blue-400 p-2 rounded-lg border-2 border-[#0A0A0A]">
                                            <Navigation className="w-4 h-4 text-[#0A0A0A]" />
                                          </div>
                                          <div>
                                            <p className="text-xs font-black text-blue-900 uppercase tracking-wider">{spot.transitToNext.travelMode}</p>
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                              <span>{spot.transitToNext.estimatedDuration}</span>
                                              {spot.transitToNext.estimatedFare && (
                                                <>
                                                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                                                  <span className="text-green-700">{spot.transitToNext.estimatedFare}</span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        {spot.transitToNext.routeMapUrl && (
                                          <a 
                                            href={spot.transitToNext.routeMapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hidden sm:flex items-center gap-1 text-xs font-black bg-white px-3 py-2 rounded-lg border-2 border-[#0A0A0A] hover:bg-gray-50 transition-colors shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]"
                                          >
                                            View Route <ArrowRight className="w-3 h-3" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-8">
                    {/* Transportation */}
                    <div className="bg-white border-4 border-[#0A0A0A] rounded-[2rem] p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] h-fit">
                      <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                        <Navigation className="w-6 h-6 text-blue-500" strokeWidth={3} />
                        Transport Links
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

                    {/* Budget Breakdown */}
                    {plan?.budgetBreakdown && (
                      <div className="bg-yellow-300 border-4 border-[#0A0A0A] rounded-[2rem] p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] h-fit">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-2 text-[#0A0A0A]">
                          <IndianRupee className="w-6 h-6" strokeWidth={3} />
                          Budget Estimate
                        </h3>
                        <div className="flex flex-col">
                          {[
                            { label: 'Accommodation', desc: 'Hotel or hostel stay', value: plan.budgetBreakdown.accommodation, icon: HomeIcon },
                            { label: 'Local Transport', desc: 'Cabs, metros, autos', value: plan.budgetBreakdown.localTransport, icon: Navigation },
                            { label: 'Food & Dining', desc: 'Meals and snacks', value: plan.budgetBreakdown.foodAndDining, icon: Flame },
                            { label: 'Activities', desc: 'Entry fees and tours', value: plan.budgetBreakdown.entryFeesAndActivities, icon: Star },
                            { label: 'Miscellaneous', desc: 'Shopping and tips', value: plan.budgetBreakdown.miscellaneous, icon: ShieldCheck }
                          ].map((item, idx) => (
                            item.value && (
                              <div key={idx} className="flex justify-between items-start py-3 border-b border-black/20 last:border-0">
                                <div className="flex flex-col">
                                  <div className="font-bold text-lg flex items-center gap-2 text-[#0A0A0A]">
                                    {item.icon && <item.icon className="w-5 h-5" strokeWidth={2.5} />}
                                    {item.label}
                                  </div>
                                  <span className="text-sm text-gray-800/80 mt-1 max-w-[70%]">{item.desc}</span>
                                </div>
                                <div className="font-extrabold text-lg text-right whitespace-nowrap text-[#0A0A0A] mt-0.5">
                                  {item.value}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                        {plan.budgetBreakdown.totalEstimatedCost && (
                          <div className="mt-4 pt-4 border-t-4 border-[#0A0A0A] flex justify-between items-center gap-2">
                            <span className="font-black text-[#0A0A0A] uppercase tracking-wider text-xl">Est. Total (PP)</span>
                            <span className="font-black text-3xl text-[#0A0A0A]">{plan.budgetBreakdown.totalEstimatedCost}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            
            <div className="flex items-center gap-4 justify-center">
              <button type="button" className="bg-white text-[#0A0A0A] font-black border-4 border-[#0A0A0A] rounded-2xl px-6 py-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] transition-all flex items-center gap-2">
                 <PlayCircle className="w-5 h-5" strokeWidth={2.5} /> See How It Works
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-black text-[#0A0A0A]/70 w-full">
              <span>2.5B+ trips planned yearly in India</span>
              <span className="hidden md:inline text-xl leading-none -mt-1">·</span>
              <span>10,000+ verified stays & operators</span>
              <span className="hidden md:inline text-xl leading-none -mt-1">·</span>
              <span>AI that never sleeps</span>
            </div>
          </div>
        </motion.div>
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

      
      {/* What can you do with Travy AI? */}
      <section className="px-6 py-24 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-[#0A0A0A]" style={{ textShadow: '2px 2px 0px var(--color-primary)' }}>
              What can you do with Travy AI?
            </h2>
            <p className="text-xl font-bold text-[#0A0A0A]/80 max-w-2xl mx-auto">
              Everything you need to plan, budget, and book your dream trip—powered by our intelligent travel engine.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FFE5E5] p-8 rounded-[2rem] border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-14 h-14 bg-white rounded-full border-4 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Zap className="w-7 h-7 text-[#0A0A0A]" />
              </div>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">AI Itinerary Generation</h3>
              <p className="text-[#0A0A0A] font-bold text-lg">Generate detailed, day-by-day plans in seconds based on your unique travel style and preferences.</p>
            </div>
            
            <div className="bg-[#E5F4FF] p-8 rounded-[2rem] border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-14 h-14 bg-white rounded-full border-4 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Wallet className="w-7 h-7 text-[#0A0A0A]" />
              </div>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">Smart Budgeting</h3>
              <p className="text-[#0A0A0A] font-bold text-lg">Find packages and experiences that strictly fit your wallet. Say goodbye to hidden costs.</p>
            </div>

            <div className="bg-[#E5FFE9] p-8 rounded-[2rem] border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-14 h-14 bg-white rounded-full border-4 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <ShieldCheck className="w-7 h-7 text-[#0A0A0A]" />
              </div>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">Verified Agencies</h3>
              <p className="text-[#0A0A0A] font-bold text-lg">Book confidently with vetted local experts and travel operators who know the destination best.</p>
            </div>

            <div className="bg-[#FFF4E5] p-8 rounded-[2rem] border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-14 h-14 bg-white rounded-full border-4 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Map className="w-7 h-7 text-[#0A0A0A]" />
              </div>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">Live Journey Maps</h3>
              <p className="text-[#0A0A0A] font-bold text-lg">Interactive 3D treasure maps for your routes. Visualize your entire journey before you even pack.</p>
            </div>
          </div>
        </div>
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

      
      {/* Impact Metrics Bar */}
      <section className="py-12 bg-cyan-400 border-y-4 border-[#0A0A0A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 text-center">
            <div className="flex-1">
              <p className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-2" style={{ textShadow: '2px 2px 0px #fff' }}>2.5M+</p>
              <p className="text-xl font-bold text-[#0A0A0A]">Trips Planned</p>
            </div>
            <div className="hidden md:block w-1 h-16 bg-[#0A0A0A] rounded-full"></div>
            <div className="flex-1">
              <p className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-2" style={{ textShadow: '2px 2px 0px #fff' }}>10,000+</p>
              <p className="text-xl font-bold text-[#0A0A0A]">Verified Stays</p>
            </div>
            <div className="hidden md:block w-1 h-16 bg-[#0A0A0A] rounded-full"></div>
            <div className="flex-1">
              <p className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-2" style={{ textShadow: '2px 2px 0px #fff' }}>100k+</p>
              <p className="text-xl font-bold text-[#0A0A0A]">Planning Hours Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonial Wall */}
      <section className="px-6 py-24 relative bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-[#0A0A0A]" style={{ textShadow: '2px 2px 0px #FFD700' }}>
              Don't just take our word for it.
            </h2>
            <p className="text-xl font-bold text-[#0A0A0A]/80 max-w-2xl mx-auto">
              Real travelers saving real time and money with Travy AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FFFACD] p-8 rounded-none border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-0 transition-transform">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-5 h-5 text-[#0A0A0A] fill-[#0A0A0A]" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-[#0A0A0A]/20 mb-4" />
              <p className="text-[#0A0A0A] font-bold text-lg mb-6 leading-relaxed">
                "It literally built a 7-day Thailand itinerary for me in 10 seconds. What usually takes me weeks of reading blogs was done instantly. Unbelievable!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#0A0A0A] bg-gray-200 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=1" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-[#0A0A0A]">Sarah Jenkins</p>
                  <p className="font-bold text-[#0A0A0A]/70 text-sm">Saved 14 hours of planning</p>
                </div>
              </div>
            </div>

            <div className="bg-[#E0FFFF] p-8 rounded-none border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 transition-transform mt-4 md:mt-8">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-5 h-5 text-[#0A0A0A] fill-[#0A0A0A]" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-[#0A0A0A]/20 mb-4" />
              <p className="text-[#0A0A0A] font-bold text-lg mb-6 leading-relaxed">
                "The smart budgeting feature is a lifesaver. We had a strict budget for our honeymoon, and Travy found us verified agencies that perfectly matched it."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#0A0A0A] bg-gray-200 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-[#0A0A0A]">David & Emma</p>
                  <p className="font-bold text-[#0A0A0A]/70 text-sm">Saved ₹25,000 on bookings</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FFC0CB] p-8 rounded-none border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform mt-2 md:-mt-4">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-5 h-5 text-[#0A0A0A] fill-[#0A0A0A]" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-[#0A0A0A]/20 mb-4" />
              <p className="text-[#0A0A0A] font-bold text-lg mb-6 leading-relaxed">
                "As someone who hates planning but loves traveling, this app is exactly what I needed. The agencies are legit, and the itineraries are spot on."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#0A0A0A] bg-gray-200 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=33" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-[#0A0A0A]">Marcus Lee</p>
                  <p className="font-bold text-[#0A0A0A]/70 text-sm">Booked 3 trips this year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Audience CTA */}
      <section className="px-6 py-24 relative bg-white border-t-4 border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 text-[#0A0A0A]" style={{ textShadow: '2px 2px 0px var(--color-primary)' }}>
              One Platform.<br/>Boundless Adventures.
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Left Card: Explorers */}
            <div className="flex-1 bg-[var(--color-primary)] p-10 md:p-14 rounded-[3rem] border-4 border-[#0A0A0A] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between group">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#0A0A0A] mb-8" style={{ boxShadow: '2px 2px 0px 0px rgba(10,10,10,1)' }}>
                  <MapPin className="w-4 h-4 text-[#0A0A0A]" />
                  <span className="text-sm font-black text-[#0A0A0A]">For Explorers</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-6 leading-tight">Start your next adventure.<br/>AI plans, you pack.</h3>
                <p className="text-[#0A0A0A] font-bold text-xl mb-10 max-w-md">Stop wasting time juggling a dozen tabs. Let our AI build the perfect itinerary and find the best local operators for you.</p>
              </div>
              <Link to="/" className="bg-white text-[#0A0A0A] border-4 border-[#0A0A0A] rounded-full px-8 py-5 text-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors w-fit flex items-center gap-3">
                Start Planning <ArrowRight className="w-6 h-6" />
              </Link>
            </div>

            {/* Right Card: Agencies */}
            <div className="flex-1 bg-[#D8B4E2] p-10 md:p-14 rounded-[3rem] border-4 border-[#0A0A0A] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between group">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#0A0A0A] mb-8" style={{ boxShadow: '2px 2px 0px 0px rgba(10,10,10,1)' }}>
                  <Users className="w-4 h-4 text-[#0A0A0A]" />
                  <span className="text-sm font-black text-[#0A0A0A]">For Agencies</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-6 leading-tight">Grow your travel business.<br/>Reach 2M+ travelers.</h3>
                <p className="text-[#0A0A0A] font-bold text-xl mb-10 max-w-md">Join our network of verified travel operators. Access high-intent travelers and manage bookings effortlessly through our portal.</p>
              </div>
              <Link to="/agency-portal" className="bg-white text-[#0A0A0A] border-4 border-[#0A0A0A] rounded-full px-8 py-5 text-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors w-fit flex items-center gap-3">
                Partner With Us <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
