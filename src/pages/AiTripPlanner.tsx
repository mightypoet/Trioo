import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Bot, Send, MapPin, Map, Navigation } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

interface GeneratedPlan {
  recommended_trip_id: string;
  agency_name: string;
  itinerary: { day: number; title: string; description: string }[];
  transportation: {
    train_link?: string;
    flight_link?: string;
    irctc_portal?: string;
  };
}

export default function AiTripPlanner() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [tripDetails, setTripDetails] = useState<any | null>(null);
  const [searchParams] = useSearchParams();
  const hasTriggeredRef = useRef(false);

  
  const executePlan = async (queryToUse: string) => {
    if (!queryToUse.trim()) return;

    setLoading(true);
    setPlan(null);
    setTripDetails(null);

    try {
      const { data: trips, error } = await supabase.from('trips').select('*, agencies(name)');
      if (error) throw error;

      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userRequest: queryToUse,
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
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    executePlan(prompt);
  };

  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      setPrompt(promptParam);
      executePlan(promptParam);
    }
  }, [searchParams]);


  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#0A0A0A] rounded-2xl mx-auto flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_rgba(200,200,200,1)]">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0A0A0A]">Travy AI Planner</h1>
          <p className="text-lg text-gray-600 font-bold max-w-2xl mx-auto">
            Describe your dream trip. Our AI will match you with the perfect package, craft a custom day-by-day itinerary, and find transportation options.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="bg-white border-4 border-[#0A0A0A] rounded-3xl p-4 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] relative z-10 flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Plan a 3 days trip of dooars for 5 people under 2999 each from kolkata"
            className="flex-1 bg-transparent border-none outline-none text-lg font-bold placeholder:text-gray-400 px-4 py-2"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[var(--color-primary)] text-[#0A0A0A] font-black border-4 border-[#0A0A0A] rounded-2xl px-8 py-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Plan It
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {plan && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Recommended Trip Card */}
            {tripDetails && (
              <div className="bg-white border-4 border-[#0A0A0A] rounded-[2rem] overflow-hidden shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] flex flex-col sm:flex-row">
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
              <div className="md:col-span-2 bg-white border-4 border-[#0A0A0A] rounded-[2rem] p-8 shadow-[6px_6px_0px_0px_rgba(10,10,10,1)]">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <Map className="w-6 h-6 text-[var(--color-primary)]" />
                  Custom Itinerary
                </h3>
                <div className="space-y-6">
                  {plan.itinerary.map((day, idx) => (
                    <div key={idx} className="relative pl-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-[-24px] last:before:bottom-0 before:w-1 before:bg-gray-200">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-[var(--color-primary)] border-2 border-[#0A0A0A] rounded-full flex items-center justify-center font-black text-xs">
                        {day.day}
                      </div>
                      <h4 className="text-xl font-bold text-[#0A0A0A] mb-2">{day.title}</h4>
                      <p className="text-gray-600 font-medium leading-relaxed bg-gray-50 p-4 rounded-xl border-2 border-gray-100">
                        {day.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transportation */}
              <div className="bg-white border-4 border-[#0A0A0A] rounded-[2rem] p-8 shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] h-fit">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <Navigation className="w-6 h-6 text-blue-500" />
                  Transport
                </h3>
                <div className="space-y-4">
                  {plan.transportation.train_link && (
                    <a href={plan.transportation.train_link} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-gray-50 transition-colors flex justify-between items-center group">
                      Train Options <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  )}
                  {plan.transportation.flight_link && (
                    <a href={plan.transportation.flight_link} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-gray-50 transition-colors flex justify-between items-center group">
                      Flight Options <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  )}
                  {plan.transportation.irctc_portal && (
                    <a href={plan.transportation.irctc_portal} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-gray-50 transition-colors flex justify-between items-center group">
                      IRCTC Portal <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  )}
                  {!plan.transportation.train_link && !plan.transportation.flight_link && !plan.transportation.irctc_portal && (
                    <p className="text-gray-500 font-medium italic">No transport links generated.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple icon for arrow
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
