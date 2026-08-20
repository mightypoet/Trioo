import React, { useState } from 'react';
import { Share, Wand2, MapPin, Map, Calendar, Hotel, Flame, Star, Plane, Train, Camera, Navigation, Wallet } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';

const MOCK_DATA = {
  title: 'South Korea Explorer: Seoul to Jeju',
  creator: { name: 'Sarah Explorer', handle: '@pathandpassports', avatar: 'https://i.pravatar.cc/150?img=32', followers: '12.4k' },
  duration: '10 Days',
  cities: ['Seoul (2n)', 'Gyeongju (2n)', 'Busan (4n)', 'Jeju (1n)'],
  stats: { countries: 1, cities: 4, activities: 25, food: 24 },
  photos: [
    'https://images.unsplash.com/photo-1546874177-9e664ce025b0?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1538669715315-1311e0e84b72?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1580221376518-e21586a117b3?auto=format&fit=crop&q=80&w=600'
  ],
  itinerary: [
    { day: 1, title: 'Arrival in Seoul & Myeongdong', description: 'Landed at Incheon, took AREX to Seoul Station. Evening street food in Myeongdong.', transport: 'AREX Train', map: 'https://maps.google.com' },
    { day: 2, title: 'Palaces & Hanok Village', description: 'Gyeongbokgung Palace wearing Hanbok, Bukchon Hanok Village walk, and sunset at Namsan Tower.', transport: 'Subway', map: 'https://maps.google.com' }
  ],
  stays: [
    { name: 'Moxy Seoul Myeongdong', room: 'Queen Room', price: '₹7,500/night', tags: ['Central', 'Hip Vibe'], image: 'https://images.unsplash.com/photo-1551882547-ff40c0dfe09a?auto=format&fit=crop&q=80&w=400', link: 'https://google.com/travel/hotels' }
  ],
  food: [
    { name: 'Gwangjang Market', city: 'Seoul', dish: 'Mung Bean Pancakes, Tteokbokki', rating: '5.0 ★', review: 'Amazing vibe! Highly recommend the netflix lady stall.', image: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?auto=format&fit=crop&q=80&w=400' }
  ],
  activities: [
    { name: 'Gyeongbokgung Palace', tip: 'Rent a Hanbok for free entry!', image: 'https://images.unsplash.com/photo-1570196238356-9a57db9709d7?auto=format&fit=crop&q=80&w=400' }
  ],
  budget: {
    total: '₹85,000', perPerson: '₹42,500', breakdown: { flights: '₹35k', stays: '₹25k', food: '₹15k', activities: '₹10k' }
  }
};

const tabs = ['Overview', 'Itinerary', 'Stays', 'Activities', 'Food', 'Budget'];

export default function TripboardDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <img src={MOCK_DATA.creator.avatar} className="w-full h-full object-cover" alt="Avatar"/>
              </div>
              <div>
                <p className="font-black text-lg text-black">{MOCK_DATA.creator.name}</p>
                <p className="font-bold text-sm text-gray-600">{MOCK_DATA.creator.handle} · {MOCK_DATA.creator.followers} followers</p>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-black leading-tight max-w-3xl">
              {MOCK_DATA.title}
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
          {MOCK_DATA.cities.map((city, i) => (
            <React.Fragment key={i}>
              <span className="text-black bg-white px-2 py-0.5 rounded border-2 border-black text-sm">{city}</span>
              {i < MOCK_DATA.cities.length - 1 && <span className="font-black">→</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 h-[300px] md:h-[400px]">
          <div className="col-span-2 row-span-2 border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
            <img src={MOCK_DATA.photos[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Main" />
            <div className="absolute top-3 left-3 bg-white border-2 border-black px-3 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {MOCK_DATA.duration}
            </div>
          </div>
          {MOCK_DATA.photos.slice(1, 4).map((url, i) => (
            <div key={i} className={`border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative ${i === 2 ? 'hidden md:block' : ''}`}>
              <img src={url} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt={`Gallery ${i}`} />
              {i === 2 && (
                 <button className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-black hover:bg-black/50 transition-colors">
                   + View All
                 </button>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-white border-4 border-black rounded-2xl p-4 md:p-6 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-wrap justify-between md:justify-around gap-4 text-center">
          <div><p className="font-black text-2xl text-black">{MOCK_DATA.stats.countries}</p><p className="font-bold text-gray-500 uppercase text-xs">Countries</p></div>
          <div><p className="font-black text-2xl text-black">{MOCK_DATA.stats.cities}</p><p className="font-bold text-gray-500 uppercase text-xs">Cities</p></div>
          <div><p className="font-black text-2xl text-black">{MOCK_DATA.stats.activities}</p><p className="font-bold text-gray-500 uppercase text-xs">Activities</p></div>
          <div><p className="font-black text-2xl text-black">{MOCK_DATA.stats.food}</p><p className="font-bold text-gray-500 uppercase text-xs">Restaurants</p></div>
        </div>

        {/* Tabs Sticky */}
        <div className="sticky top-20 z-40 bg-gray-50/90 backdrop-blur-md pb-4 mb-6 pt-2">
          <div className="flex overflow-x-auto gap-2 hide-scrollbar">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full border-4 border-black font-black whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[#0A0A0A] text-white shadow-[4px_4px_0px_0px_rgba(200,200,200,1)]' : 'bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
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
                   A perfect mix of traditional culture and modern city life. Started in Seoul enjoying palaces and street food, took the KTX to Gyeongju for history, then Busan for beaches, and ended with a flight to Jeju island for nature!
                 </p>
               </div>
               <div className="bg-green-100 border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                 <h3 className="font-black text-2xl mb-4 flex items-center gap-2"><Calendar /> Best Time to Go</h3>
                 <p className="font-bold text-gray-800 leading-relaxed">
                   We went in early October. The weather was crisp, perfect for walking, and the autumn foliage was just starting to turn beautiful colors. Highly recommend Spring (Cherry Blossoms) or Autumn.
                 </p>
               </div>
            </div>
          )}

          {activeTab === 'Itinerary' && (
            <div className="space-y-6">
              {MOCK_DATA.itinerary.map((day, i) => (
                <div key={i} className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-4 border-black pb-4 mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-black text-white font-black px-4 py-2 rounded-xl text-lg">DAY {day.day}</span>
                      <h3 className="font-black text-xl sm:text-2xl">{day.title}</h3>
                    </div>
                    <a href={day.map} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-yellow-300 border-2 border-black font-black px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-sm self-start sm:self-auto">
                      📍 View Map
                    </a>
                  </div>
                  <p className="font-bold text-gray-700 mb-4">{day.description}</p>
                  <div className="bg-gray-100 border-2 border-dashed border-black rounded-xl p-3 inline-flex items-center gap-2">
                    <Train className="w-5 h-5" /> <span className="font-bold text-sm">Transport: {day.transport}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Stays' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_DATA.stays.map((stay, i) => (
                <div key={i} className="bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:-translate-y-1 transition-all">
                  <div className="w-full h-48 border-4 border-black rounded-xl overflow-hidden mb-4">
                     <img src={stay.image} className="w-full h-full object-cover" alt="Hotel" />
                  </div>
                  <h3 className="font-black text-xl mb-1">{stay.name}</h3>
                  <p className="font-bold text-gray-600 text-sm mb-3">{stay.room}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stay.tags.map((t, j) => <span key={j} className="bg-blue-100 border-2 border-black text-xs font-black px-2 py-1 rounded">{t}</span>)}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-300">
                    <span className="font-black text-lg">{stay.price}</span>
                    <a href={stay.link} target="_blank" rel="noreferrer" className="bg-black text-white font-black text-sm px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-800 transition-colors">Book</a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Food' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {MOCK_DATA.food.map((f, i) => (
                <div key={i} className="bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                  <div className="w-full h-40 border-4 border-black rounded-xl overflow-hidden mb-4 relative">
                     <img src={f.image} className="w-full h-full object-cover" alt="Food" />
                     <div className="absolute top-2 right-2 bg-yellow-300 border-2 border-black px-2 py-0.5 rounded-lg font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{f.rating}</div>
                  </div>
                  <h3 className="font-black text-xl mb-1">{f.name}</h3>
                  <p className="font-bold text-gray-500 text-sm mb-2">📍 {f.city}</p>
                  <div className="bg-pink-100 border-2 border-black rounded-lg p-2 mb-3">
                    <p className="font-bold text-sm">🍽️ Ordered: {f.dish}</p>
                  </div>
                  <p className="font-medium text-gray-700 text-sm italic">"{f.review}"</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Activities' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {MOCK_DATA.activities.map((a, i) => (
                <div key={i} className="bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex gap-4 items-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 border-4 border-black rounded-xl overflow-hidden">
                    <img src={a.image} className="w-full h-full object-cover" alt="Activity" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg sm:text-xl mb-2">{a.name}</h3>
                    <div className="bg-yellow-100 border-2 border-black rounded-lg p-2 text-sm font-bold flex items-start gap-2">
                      <span>💡</span> <span>{a.tip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Budget' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border-4 border-black rounded-[2xl] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-center mb-8 pb-8 border-b-4 border-black">
                  <Wallet className="w-12 h-12 mx-auto mb-4 text-green-500" strokeWidth={2.5} />
                  <h3 className="font-black text-xl text-gray-500 mb-1 uppercase tracking-wider">Total Group Spend</h3>
                  <p className="font-black text-5xl text-black">{MOCK_DATA.budget.total}</p>
                  <p className="font-bold text-gray-600 mt-2 bg-gray-100 inline-block px-3 py-1 rounded-full border-2 border-black">{MOCK_DATA.budget.perPerson} per person</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { l: 'Flights & Transport', v: MOCK_DATA.budget.breakdown.flights, c: 'bg-blue-200' },
                    { l: 'Accommodation', v: MOCK_DATA.budget.breakdown.stays, c: 'bg-pink-200' },
                    { l: 'Food & Dining', v: MOCK_DATA.budget.breakdown.food, c: 'bg-yellow-200' },
                    { l: 'Activities & Entry', v: MOCK_DATA.budget.breakdown.activities, c: 'bg-green-200' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border-4 border-black rounded-xl bg-gray-50 hover:bg-white transition-colors">
                      <div className="flex items-center gap-3">
                         <div className={`w-4 h-4 rounded-full border-2 border-black ${item.c}`}></div>
                         <span className="font-black text-lg">{item.l}</span>
                      </div>
                      <span className="font-black text-xl">{item.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
