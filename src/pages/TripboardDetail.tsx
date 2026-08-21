import React, { useState, useEffect } from 'react';
import { Share, Wand2, MapPin, Calendar, Flame, Train, Wallet, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const tabs = ['Overview', 'Itinerary', 'Stays', 'Food', 'Budget'];

export default function TripboardDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripboard = async () => {
      setLoading(true);
      try {
        const { data: tb, error } = await supabase
          .from('tripboards')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setData(tb);
      } catch (err) {
        console.error('Error fetching tripboard detail:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTripboard();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border-4 border-black p-12 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black mb-4">Tripboard Not Found</h2>
          <Link to="/tripboards" className="text-blue-500 font-bold hover:underline">← Back to Tripboards</Link>
        </div>
      </div>
    );
  }

  const citiesArray = data.path ? data.path.split('→').map((s: string) => s.trim()) : [data.destination];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <img src={data.avatar || `https://ui-avatars.com/api/?name=${data.creator_name}`} className="w-full h-full object-cover" alt="Avatar"/>
              </div>
              <div>
                <p className="font-black text-lg text-black">{data.creator_name}</p>
                <p className="font-bold text-sm text-gray-600">{data.handle}</p>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-black leading-tight max-w-3xl">
              {data.title}
            </h1>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-4 border-black px-4 py-2 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
              <Share className="w-4 h-4" /> Share
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-yellow-300 border-4 border-black px-6 py-2 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-yellow-400 transition-all">
              <Wand2 className="w-4 h-4" /> Customize for Me
            </button>
          </div>
        </div>

        {/* Cities Banner */}
        <div className="bg-cyan-200 border-4 border-black rounded-xl p-3 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex overflow-x-auto hide-scrollbar items-center gap-2 font-bold whitespace-nowrap">
          <MapPin className="w-5 h-5 text-black" />
          {citiesArray.map((city: string, i: number) => (
            <React.Fragment key={i}>
              <span className="text-black bg-white px-2 py-0.5 rounded border-2 border-black text-sm">{city}</span>
              {i < citiesArray.length - 1 && <span className="font-black">→</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-[300px] md:h-[400px]">
            <img src={data.image} className="w-full h-full object-cover" alt="Main" />
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-20 z-10 bg-gray-50 pt-4 pb-4 border-b-4 border-black mb-8">
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl border-4 border-black font-black whitespace-nowrap transition-all ${
                  activeTab === tab 
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                  : 'bg-white hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-pink-100 border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                 <h3 className="font-black text-2xl mb-4 flex items-center gap-2"><Flame /> Trip Highlights</h3>
                 <p className="font-bold text-gray-800 leading-relaxed">
                   {data.stats}
                 </p>
               </div>
            </div>
          )}

          {activeTab === 'Itinerary' && (
            <div className="space-y-6">
              {data.itinerary?.length > 0 ? data.itinerary.map((day: any, i: number) => (
                <div key={i} className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-4 border-black pb-4 mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-black text-white font-black px-4 py-2 rounded-xl text-lg">DAY {day.day}</span>
                      <h3 className="font-black text-xl sm:text-2xl">{day.title}</h3>
                    </div>
                  </div>
                  <p className="font-bold text-gray-700 mb-4">{day.description}</p>
                  
                  {day.image && (
                    <div className="mb-4 rounded-xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-2xl">
                      <img src={day.image} alt={day.title} className="w-full h-auto object-cover max-h-80" />
                    </div>
                  )}

                  {day.transport && (
                    <div className="bg-gray-100 border-2 border-dashed border-black rounded-xl p-3 inline-flex items-center gap-2 mt-2">
                      <Train className="w-5 h-5" /> <span className="font-bold text-sm">Transport: {day.transport}</span>
                    </div>
                  )}
                </div>
              )) : (
                <div className="bg-white border-4 border-black p-8 rounded-xl text-center">
                  <p className="font-bold">No itinerary details provided.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Stays' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.stays?.length > 0 ? data.stays.map((stay: any, i: number) => (
                <div key={i} className="bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:-translate-y-1 transition-all">
                  {stay.image && (
                    <div className="mb-3 rounded-lg border-2 border-black overflow-hidden w-full h-40">
                      <img src={stay.image} alt={stay.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-black text-xl mb-1">{stay.name}</h3>
                  <p className="font-bold text-gray-600 text-sm mb-3">{stay.room}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-300">
                    <span className="font-black text-lg">{stay.price}</span>
                    {stay.link && (
                      <a href={stay.link.startsWith('http') ? stay.link : `https://${stay.link}`} target="_blank" rel="noreferrer" className="bg-black text-white font-black text-sm px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-800 transition-colors">Link</a>
                    )}
                  </div>
                </div>
              )) : (
                <div className="col-span-full bg-white border-4 border-black p-8 rounded-xl text-center">
                  <p className="font-bold">No stay details provided.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Food' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {data.food?.length > 0 ? data.food.map((f: any, i: number) => (
                <div key={i} className="bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex flex-col">
                  {f.image && (
                    <div className="mb-3 rounded-lg border-2 border-black overflow-hidden w-full h-40">
                      <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-black text-xl mb-1">{f.name}</h3>
                  {f.dish && (
                    <div className="bg-pink-100 border-2 border-black rounded-lg p-2 mb-3">
                      <p className="font-bold text-sm">🍽️ Ordered: {f.dish}</p>
                    </div>
                  )}
                  {f.review && <p className="font-medium text-gray-700 text-sm italic">"{f.review}"</p>}
                </div>
              )) : (
                <div className="col-span-full bg-white border-4 border-black p-8 rounded-xl text-center">
                  <p className="font-bold">No food details provided.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Budget' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border-4 border-black rounded-[2xl] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-center mb-8 pb-8 border-b-4 border-black">
                  <Wallet className="w-12 h-12 mx-auto mb-4 text-green-500" strokeWidth={2.5} />
                  <h3 className="font-black text-xl text-gray-500 mb-1 uppercase tracking-wider">Total Group Spend</h3>
                  <p className="font-black text-5xl text-black">{data.budget?.total || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
