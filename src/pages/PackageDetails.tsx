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
            <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
            <div className="space-y-6">
              {trip.itineraries?.map((itinerary: any) => (
                <details key={itinerary.id} className="group flex gap-6 cursor-pointer marker:content-['']">
                  <summary className="flex gap-6 w-full items-start outline-none">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                        D{itinerary.day_number}
                      </div>
                    </div>
                    <div className="clay-card p-6 flex-1 shadow-sm border border-gray-100 group-open:rounded-b-none transition-all">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-lg">{itinerary.title}</h4>
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-open:rotate-180 transition-transform">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </div>
                    </div>
                  </summary>
                  <div className="pl-16">
                    <div className="clay-card p-6 rounded-t-none border-t-0 border border-gray-100 shadow-sm mt-0 relative top-[-4px] bg-gray-50/50">
                      <p className="text-gray-600 text-sm leading-relaxed">{itinerary.detailed_description}</p>
                    </div>
                  </div>
                </details>
              ))}
              {(!trip.itineraries || trip.itineraries.length === 0) && (
                <p className="text-gray-500">No itinerary details provided.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="lg:w-1/3 space-y-6">
          <div className="sticky top-32 clay-card p-8 border border-gray-100">
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

          <div className="clay-card p-8 border border-gray-100 mt-6 sticky top-[420px]">
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
  );
}
