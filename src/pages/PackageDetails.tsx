import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, CheckCircle2, Shield, Calendar, Users, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  
  useEffect(() => {
    const fetchTrip = async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*, agencies(name), packages(*), itineraries(*)')
        .eq('id', id)
        .single();
        
      if (data) {
        // Sort itineraries
        if (data.itineraries) {
          data.itineraries.sort((a: any, b: any) => a.day_number - b.day_number);
        }
        setTrip(data);
        if (data.packages && data.packages.length > 0) {
          setSelectedPackage(data.packages[0]); // Default to first package
        }
      }
      setLoading(false);
    };
    
    if (id) fetchTrip();
  }, [id]);

  const handleBook = () => {
    if (!selectedPackage) return;
    requireAuth(() => {
      // Pass the selected package ID via URL params
      navigate(`/book/${selectedPackage.id}`, { state: { tripId: id } });
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold">Loading Trip Details...</div>;
  if (!trip) return <div className="p-8 text-center text-red-500 font-bold">Trip not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium">
        <ChevronLeft className="w-5 h-5" /> Back to Search
      </button>

      {/* Title & Meta */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase mb-2">
          <MapPin className="w-4 h-4" /> {trip.destination} • By {trip.agencies?.name}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{trip.title}</h1>
        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-600">
          <span className="flex items-center gap-1.5"><Star className="w-5 h-5 text-accent fill-accent" /> 4.9 (128 reviews)</span>
          <span className="flex items-center gap-1.5"><Clock className="w-5 h-5 text-gray-400" /> {trip.itineraries?.length || 1} Days</span>
          <span className="flex items-center gap-1.5"><Shield className="w-5 h-5 text-success" /> Verified Agency</span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px] mb-12 rounded-[2rem] overflow-hidden">
        <div className={`h-full ${trip.images && trip.images.length > 1 ? 'md:col-span-3' : 'md:col-span-4'}`}>
          <img src={trip.cover_image} alt="Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
        {trip.images && trip.images.length > 1 && (
          <div className="hidden md:grid grid-rows-2 gap-4 h-full">
            {trip.images.slice(1, 3).map((imgUrl: string, idx: number) => (
              <div key={idx} className="h-full overflow-hidden rounded-2xl relative">
                <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                {idx === 1 && trip.images.length > 3 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">+{trip.images.length - 3}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">About this trip</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Enjoy this premium travel experience to {trip.destination}. Managed by {trip.agencies?.name}, ensuring high quality and comfort.
            </p>
          </section>

          {selectedPackage && selectedPackage.inclusions && (
            <div className="grid md:grid-cols-2 gap-8">
              <section className="clay-card p-6 bg-success/5 border border-success/10 shadow-none md:col-span-2">
                <h3 className="text-lg font-bold mb-4 text-success flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> What's Included in {selectedPackage.tier_name}
                </h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {selectedPackage.inclusions.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          <section>
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <span className="bg-[var(--color-primary)] text-[#0A0A0A] px-3 py-1 border-4 border-[#0A0A0A] rounded-lg shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] -rotate-3">The</span>
              Journey Map
            </h2>
            <div className="relative py-12 px-4 md:px-12 bg-[#F9F5EE] border-4 border-[#0A0A0A] rounded-[3rem] overflow-hidden" style={{ boxShadow: '8px 8px 0px 0px rgba(10,10,10,1)' }}>
              
              {/* Map Background grid */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#0A0A0A 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
              
              {/* Prompt instruction for user */}
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 border-4 border-[#0A0A0A] rounded-xl text-xs font-bold shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] max-w-[200px] z-30 hidden lg:block">
                🎨 <span className="text-[var(--color-pink)]">Image Prompts:</span><br/>
                Generate these assets with: "3D isometric [map pin / compass / treasure chest], bright colors, bold black outlines, neo-brutalist style, solid background"
              </div>

              <div className="relative z-10 pt-8 pb-12">
                {/* Dotted path connecting the days */}
                <div className="absolute left-12 md:left-1/2 top-0 bottom-0 w-1 md:w-2 border-l-4 md:border-l-8 border-dashed border-[#0A0A0A] -translate-x-1/2 opacity-30"></div>
                
                {trip.itineraries?.map((itinerary: any, index: number) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div key={itinerary.id} className={`relative flex items-center mb-16 md:mb-24 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
                      
                      {/* Timeline Node */}
                      <div className="absolute left-12 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                         <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] border-4 border-[#0A0A0A] flex flex-col items-center justify-center rotate-3 transition-transform hover:scale-110" style={{ boxShadow: '4px 4px 0px 0px rgba(10,10,10,1)' }}>
                            <span className="text-xs font-black uppercase leading-none">Day</span>
                            <span className="text-2xl font-black leading-none">{itinerary.day_number}</span>
                         </div>
                      </div>

                      {/* Card */}
                      <div className={`w-full pl-28 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-16 text-left' : 'md:pl-16 md:text-right'}`}>
                        <div className="bg-white p-6 md:p-8 border-4 border-[#0A0A0A] rounded-2xl relative group hover:-translate-y-2 hover:translate-x-2 transition-all duration-300" style={{ boxShadow: '8px 8px 0px 0px rgba(10,10,10,1)' }}>
                           {/* 3D Asset Placeholder */}
                           {isEven ? (
                             <div className="absolute -top-12 -left-6 md:-left-12 w-24 h-24 md:w-32 md:h-32 rotate-[-15deg] transition-transform group-hover:rotate-0 group-hover:scale-110 z-10 hidden md:block">
                               <img 
                                 src="https://placehold.co/400x400/FF90E8/0A0A0A.png?text=3D+Map+Pin&font=montserrat" 
                                 alt="3D isometric map pin"
                                 className="w-full h-full object-cover rounded-xl border-4 border-[#0A0A0A] shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
                               />
                             </div>
                           ) : (
                             <div className="absolute -top-12 -right-6 md:-right-12 w-24 h-24 md:w-32 md:h-32 rotate-[15deg] transition-transform group-hover:rotate-0 group-hover:scale-110 z-10 hidden md:block">
                               <img 
                                 src="https://placehold.co/400x400/F4D03F/0A0A0A.png?text=3D+Compass&font=montserrat" 
                                 alt="3D isometric compass"
                                 className="w-full h-full object-cover rounded-full border-4 border-[#0A0A0A] shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
                               />
                             </div>
                           )}
                           
                           {/* Mobile Asset */}
                           <div className="md:hidden w-16 h-16 mb-4 rounded-xl border-4 border-[#0A0A0A] shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] overflow-hidden">
                             <img 
                               src={isEven ? "https://placehold.co/400x400/FF90E8/0A0A0A.png?text=3D+Pin" : "https://placehold.co/400x400/F4D03F/0A0A0A.png?text=3D+Compass"} 
                               alt="3D Asset"
                               className="w-full h-full object-cover"
                             />
                           </div>

                           <h4 className="font-black text-xl md:text-2xl mb-3 leading-tight text-gray-900">{itinerary.title}</h4>
                           <p className="text-gray-700 font-medium leading-relaxed">{itinerary.detailed_description}</p>
                        </div>
                      </div>
                      
                    </div>
                  );
                })}

                {/* X marks the spot */}
                {trip.itineraries && trip.itineraries.length > 0 && (
                  <div className="relative flex items-center justify-center mt-20 md:mt-24">
                     <div className="w-24 h-24 md:w-32 md:h-32 rotate-6 hover:rotate-0 hover:scale-110 transition-transform cursor-pointer z-20">
                        <img 
                          src="https://placehold.co/400x400/4ADE80/0A0A0A.png?text=3D+Treasure+Chest&font=montserrat" 
                          alt="3D isometric treasure chest"
                          className="w-full h-full object-cover rounded-2xl border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]"
                        />
                     </div>
                  </div>
                )}

                {(!trip.itineraries || trip.itineraries.length === 0) && (
                  <p className="text-gray-500 font-bold text-center mt-12">No treasure map details provided yet.</p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-32 space-y-6">
            <div className="clay-card p-8 border border-gray-100">
              {trip.packages && trip.packages.length > 0 && (
                 <div className="mb-6 space-y-3">
                    <label className="text-sm font-bold text-gray-700">Select Package Tier</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none"
                      value={selectedPackage?.id || ''}
                      onChange={(e) => setSelectedPackage(trip.packages.find((p: any) => p.id === e.target.value))}
                    >
                      {trip.packages.map((pkg: any) => (
                        <option key={pkg.id} value={pkg.id}>{pkg.tier_name}</option>
                      ))}
                    </select>
                 </div>
              )}

              <div className="mb-6 flex items-end gap-3">
                <span className="text-4xl font-bold text-gray-900">₹{selectedPackage ? selectedPackage.price.toLocaleString() : trip.base_price.toLocaleString()}</span>
                <span className="text-gray-400 text-sm font-bold mb-1">per person</span>
              </div>
              
              <button onClick={handleBook} disabled={!selectedPackage} className="clay-btn-primary w-full py-4 text-lg mb-4 disabled:opacity-50">
                Book Now
              </button>
              <p className="text-center text-sm text-gray-500 font-medium">You won't be charged yet.</p>
            </div>

            <div className="clay-card p-8 border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Hosted by</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl uppercase">
                {trip.agencies?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 flex items-center gap-1">
                  {trip.agencies?.name}
                  <Shield className="w-4 h-4 text-success" />
                </h4>
                <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                  <Star className="w-4 h-4 text-accent fill-accent" /> 4.9 Rating
                </div>
              </div>
            </div>
            <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition-colors">
              Contact Agency
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
