import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, CheckCircle2, Shield, Calendar, Users, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getTripImageUrl } from '../lib/utils';

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

  const handleWhatsAppBooking = () => {
    if (!trip) return;
    const message = `Hello! I am interested in booking the trip: *${trip.title}* hosted by *${trip.agencies?.name || 'TRAVY Partner'}*. Could you provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918961339702?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
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

      {/* Swipeable Photo Album */}
      <div className="mb-12 relative group">
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {trip.images && trip.images.length > 0 ? (
            trip.images.map((imgUrl: string, idx: number) => (
              <div key={idx} className="flex-none w-full sm:w-[85%] snap-center relative">
                <img 
                  src={getTripImageUrl(imgUrl)} 
                  alt={`Trip image ${idx + 1}`} 
                  className="w-full h-64 md:h-96 object-cover rounded-2xl border-4 border-[#0A0A0A]" 
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
                  {idx + 1} / {trip.images.length}
                </div>
              </div>
            ))
          ) : (
            <div className="flex-none w-full sm:w-[85%] snap-center relative">
              <img 
                src={getTripImageUrl(trip)} 
                alt="Main" 
                className="w-full h-64 md:h-96 object-cover rounded-2xl border-4 border-[#0A0A0A]" 
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-12">
          
          <section className="bg-white border-4 border-black rounded-2xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black mb-6 uppercase">Agency Specs</h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Key Features */}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-3">Highlights</h3>
                {(trip.key_features && trip.key_features.length > 0) ? (
                  <ul className="space-y-2">
                    {trip.key_features.map((feature: string, idx: number) => (
                      feature ? (
                        <li key={idx} className="flex items-start gap-2 font-bold text-gray-800">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-black shrink-0"></span>
                          <span>{feature}</span>
                        </li>
                      ) : null
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 font-bold">Standard features included. Ask the agency for more details.</p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-col gap-3 justify-center md:min-w-[200px]">
                <div className={`px-4 py-3 border-4 border-black font-black uppercase text-sm text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl ${trip.food_included ? 'bg-green-400' : 'bg-gray-200 text-gray-500'}`}>
                  {trip.food_included ? '✓ Meals Included' : '✕ Meals Not Included'}
                </div>
                <div className={`px-4 py-3 border-4 border-black font-black uppercase text-sm text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl ${trip.transit_included ? 'bg-green-400' : 'bg-gray-200 text-gray-500'}`}>
                  {trip.transit_included ? '✓ Transit Included' : '✕ Transit Not Included'}
                </div>
              </div>
            </div>
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
            
            <div className="relative py-12 px-4 md:px-10 bg-[#F9F5EE] border-4 border-[#0A0A0A] rounded-[3rem] overflow-hidden" style={{ boxShadow: '8px 8px 0px 0px rgba(10,10,10,1)' }}>
              
              {/* Map Background grid */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#0A0A0A 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
              
              <div className="relative z-10">
                {(() => {
                  const parsedItinerary = typeof trip.itinerary === 'string' ? JSON.parse(trip.itinerary) : (trip.itinerary || trip.itineraries);
                  const safeItinerary = Array.isArray(parsedItinerary) ? parsedItinerary : [];
                  
                  if (safeItinerary.length === 0) {
                    return (
                      <div className="flex justify-center items-center py-10">
                        <div className="bg-yellow-200 border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] aspect-square max-w-sm flex flex-col items-center justify-center rotate-3 relative">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-black/80 rotate-[-5deg]"></div>
                          <h3 className="text-2xl font-black text-black mb-2 text-center">:(</h3>
                          <p className="text-lg font-bold text-center">Details coming soon</p>
                        </div>
                      </div>
                    );
                  }

                  const colors = ['bg-yellow-200', 'bg-pink-200', 'bg-cyan-200', 'bg-green-200'];
                  
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-10">
                      {safeItinerary.map((stop: any, index: number) => {
                        const dayNumber = stop.day || stop.day_number || (index + 1);
                        const title = stop.title || stop.name || '';
                        const description = stop.description || stop.detailed_description || '';
                        const color = colors[index % colors.length];
                        
                        // Random rotation between -3 and 3 degrees
                        // Using a deterministic approach based on index so it doesn't jump on re-renders
                        const rotClasses = ['-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3', 'rotate-1'];
                        const rotationClass = rotClasses[index % rotClasses.length];
                        
                        return (
                          <div 
                            key={dayNumber} 
                            className={`${color} border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:rotate-0 transition-all duration-300 relative aspect-square flex flex-col justify-between group ${rotationClass}`}
                          >
                            {/* Pushpin / Tape */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 bg-black/80 rotate-[-3deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"></div>
                            
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <span className="font-black text-2xl uppercase tracking-wider border-b-4 border-black pb-1">Day {dayNumber}</span>
                              </div>
                              <h3 className="text-xl md:text-2xl font-black leading-tight uppercase mb-3 break-words group-hover:text-black/80 transition-colors">
                                {title}
                              </h3>
                            </div>
                            
                            <p className="text-black/80 font-bold text-sm md:text-base leading-relaxed overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                              {description}
                            </p>

                            {/* Google Maps Link */}
                            {stop.googleMapsLink && (
                              <a 
                                href={stop.googleMapsLink}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-4 self-start inline-block bg-white text-black border-2 border-black font-black px-4 py-2 text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors"
                              >
                                Maps
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
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
              
              <button onClick={handleWhatsAppBooking} className="clay-btn-primary w-full py-4 text-lg mb-4 disabled:opacity-50">
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
