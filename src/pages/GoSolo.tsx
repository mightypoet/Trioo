import React, { useState } from 'react';
import { Plane, Hotel, Train, Search, ArrowRight, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function GoSolo() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'trains'>('flights');
  
  // Flights State
  const [originIata, setOriginIata] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [flights, setFlights] = useState<any[]>([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [errorFlights, setErrorFlights] = useState('');

  // Hotels State
  const [hotelCity, setHotelCity] = useState('');
  
  // Trains State
  const [trainOrigin, setTrainOrigin] = useState('');
  const [trainDestination, setTrainDestination] = useState('');

  const searchFlights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originIata) return;
    setLoadingFlights(true);
    setErrorFlights('');
    try {
      const res = await fetch(`/api/flights?dep_iata=${encodeURIComponent(originIata)}`);
      const contentType = res.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please check server/API setup.");
      }
      
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || data.error || "Failed to load flights.");
      }
      
      setFlights(data.data || []);
    } catch (error: any) {
      console.error("Flight Search Error:", error);
      setErrorFlights(error.message || "Unable to fetch live flight data.");
      setFlights([]);
    } finally {
      setLoadingFlights(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Banner */}
      <div className="bg-cyan-200 border-4 border-black rounded-[2rem] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between animate-in fade-in slide-in-from-top-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-4">Go Solo. <br/>Travel On Your Terms.</h1>
          <p className="text-xl md:text-2xl font-bold text-black/80 max-w-xl">Live flights, solo-friendly stays, and train connections.</p>
        </div>
        <div className="mt-8 md:mt-0 hidden md:block">
          <Plane className="w-48 h-48 text-[#0A0A0A] opacity-20" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('flights')}
          className={cn(
            "px-6 py-3 rounded-full font-bold border-4 transition-all duration-200 flex items-center gap-2",
            activeTab === 'flights' 
              ? "bg-[#0A0A0A] border-[#0A0A0A] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] -translate-y-1 translate-x-1"
              : "bg-white border-[#0A0A0A] text-[#0A0A0A] hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          )}
        >
          <Plane className="w-5 h-5" /> ✈️ Flights
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className={cn(
            "px-6 py-3 rounded-full font-bold border-4 transition-all duration-200 flex items-center gap-2",
            activeTab === 'hotels' 
              ? "bg-[#0A0A0A] border-[#0A0A0A] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] -translate-y-1 translate-x-1"
              : "bg-white border-[#0A0A0A] text-[#0A0A0A] hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          )}
        >
          <Hotel className="w-5 h-5" /> 🏨 Hotels
        </button>
        <button
          onClick={() => setActiveTab('trains')}
          className={cn(
            "px-6 py-3 rounded-full font-bold border-4 transition-all duration-200 flex items-center gap-2",
            activeTab === 'trains' 
              ? "bg-[#0A0A0A] border-[#0A0A0A] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] -translate-y-1 translate-x-1"
              : "bg-white border-[#0A0A0A] text-[#0A0A0A] hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          )}
        >
          <Train className="w-5 h-5" /> 🚆 Trains
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white border-4 border-black rounded-[2rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[500px]">
        
        {/* FLIGHTS */}
        {activeTab === 'flights' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">Flight Departures</h2>
            <form onSubmit={searchFlights} className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <label className="block text-sm font-bold uppercase mb-2">Origin (IATA / City)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. DEL, BOM, LHR" 
                  value={originIata}
                  onChange={(e) => setOriginIata(e.target.value.toUpperCase())}
                  className="w-full bg-gray-100 border-4 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold uppercase mb-2">Departure Date (Optional)</label>
                <input 
                  type="date" 
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="w-full bg-gray-100 border-4 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
              <div className="flex items-end">
                <button type="submit" disabled={loadingFlights} className="w-full md:w-auto bg-[#0A0A0A] text-white border-4 border-[#0A0A0A] rounded-xl px-8 py-3 font-black shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:bg-gray-800 hover:-translate-y-1 transition-all disabled:opacity-70 flex items-center gap-2 justify-center">
                  {loadingFlights ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Search
                </button>
              </div>
            </form>

            {errorFlights && (
              <div className="bg-red-200 border-4 border-black p-4 rounded-xl font-bold text-[#0A0A0A] mb-4">
                {errorFlights}
              </div>
            )}

            <div className="space-y-4">
              {flights.length === 0 && !loadingFlights && !errorFlights && (
                <div className="text-center py-12 bg-gray-50 border-4 border-dashed border-gray-300 rounded-xl">
                  <Plane className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-bold">Search an origin to see live departures.</p>
                </div>
              )}
              
              {flights.map((flight: any, i: number) => {
                const dest = flight.arrival?.iata || flight.arrival?.airport || 'Anywhere';
                const gFlightsUrl = `https://www.google.com/travel/flights?q=Flights+from+${originIata}+to+${dest}`;
                
                return (
                  <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 transition-colors">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-yellow-300 text-black px-2 py-0.5 rounded font-black text-xs uppercase border-2 border-black">
                          {flight.flight_status || 'Scheduled'}
                        </span>
                        <h3 className="text-xl font-black">{flight.airline?.name || 'Unknown Airline'} {flight.flight?.iata}</h3>
                      </div>
                      <p className="font-bold text-gray-600 flex items-center gap-2">
                        {flight.departure?.iata} <ArrowRight className="w-4 h-4" /> {flight.arrival?.iata || 'TBD'}
                      </p>
                      <p className="text-sm font-bold text-gray-500 mt-2">
                        Time: {flight.departure?.estimated ? new Date(flight.departure.estimated).toLocaleString() : 'Check Board'} 
                        {flight.departure?.terminal && ` • Terminal ${flight.departure.terminal}`}
                      </p>
                    </div>
                    <div>
                      <a 
                        href={gFlightsUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-pink-300 border-4 border-black rounded-xl px-6 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-400 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        Book Flight <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* HOTELS */}
        {activeTab === 'hotels' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">Solo-Friendly Stays</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Where are you heading?" 
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  className="w-full bg-gray-100 border-4 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
              <a 
                href={`https://www.google.com/travel/hotels?q=hotels+in+${hotelCity || 'Goa'}`}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto bg-[#0A0A0A] text-white border-4 border-[#0A0A0A] rounded-xl px-8 py-3 font-black shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:bg-gray-800 hover:-translate-y-1 transition-all flex items-center gap-2 justify-center"
              >
                <Search className="w-5 h-5" /> Search Hotels
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'The Solo Backpacker Hostel', price: '₹800/night', amenities: 'Free Wi-Fi, Solo Safety Certified' },
                { name: 'Zen City Boutique', price: '₹2,500/night', amenities: 'Breakfast, Central Location' },
                { name: 'Wanderer Homestay', price: '₹1,200/night', amenities: 'Community Events, Safe Zone' },
              ].map((h, i) => (
                <div key={i} className="bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
                  <Hotel className="w-8 h-8 mb-4 text-cyan-600" />
                  <h3 className="font-black text-lg mb-2">{h.name}</h3>
                  <p className="text-gray-500 font-bold text-sm mb-4">{h.amenities}</p>
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
                    <span className="font-black text-xl">{h.price}</span>
                    <a href={`https://www.google.com/travel/hotels?q=${encodeURIComponent(h.name)}`} target="_blank" rel="noreferrer" className="text-sm font-black underline hover:text-cyan-600">View Stay</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRAINS */}
        {activeTab === 'trains' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">Train Connections</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="From (e.g. NDLS)" 
                  value={trainOrigin}
                  onChange={(e) => setTrainOrigin(e.target.value)}
                  className="w-full bg-gray-100 border-4 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="To (e.g. BCT)" 
                  value={trainDestination}
                  onChange={(e) => setTrainDestination(e.target.value)}
                  className="w-full bg-gray-100 border-4 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <a 
                href="https://www.irctc.co.in/nget/train-search" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-orange-300 border-4 border-black rounded-xl px-6 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-400 hover:-translate-y-1 transition-all"
              >
                Book on IRCTC <ExternalLink className="w-4 h-4" />
              </a>
              <a 
                href="https://www.makemytrip.com/railways/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-blue-300 border-4 border-black rounded-xl px-6 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400 hover:-translate-y-1 transition-all"
              >
                Book on MakeMyTrip <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Vande Bharat Express', time: '06:00 AM - 02:00 PM', route: 'Origin → Destination', type: 'Premium' },
                { name: 'Rajdhani Express', time: '04:30 PM - 08:30 AM', route: 'Origin → Destination', type: 'Overnight' },
              ].map((t, i) => (
                <div key={i} className="bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-black text-xl">{t.name}</h3>
                    <span className="bg-yellow-300 border-2 border-black px-2 py-0.5 rounded font-black text-xs uppercase">{t.type}</span>
                  </div>
                  <p className="font-bold text-gray-500 mb-1">{t.route}</p>
                  <p className="font-black text-gray-800">{t.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
