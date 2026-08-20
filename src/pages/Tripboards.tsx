import React, { useState } from 'react';
import { Compass, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';


import { motion } from 'motion/react';

const categories = ["All", "South East Asia", "Europe", "Mountains", "Solo & Budget", "Luxury"];

const tripboards = [
  { id: 1, title: 'South Korea Explorer: Seoul to Jeju', duration: '10 Days', image: 'https://images.unsplash.com/photo-1546874177-9e664ce025b0?auto=format&fit=crop&q=80&w=600', path: 'Seoul (2n) → Gyeongju (2n) → Busan (4n) → Jeju (1n)', avatar: 'https://i.pravatar.cc/150?img=32', name: 'Sarah Explorer', handle: '@pathandpassports', stats: '25 Activities · 24 Food Spots · 4 Stays', color: 'bg-green-200' },
  { id: 2, title: 'Meghalaya Monsoon Magic', duration: '7 Days', image: 'https://images.unsplash.com/photo-1629831969299-fb93cc2267f7?auto=format&fit=crop&q=80&w=600', path: 'Shillong (2n) → Cherrapunji (3n) → Dawki (1n)', avatar: 'https://i.pravatar.cc/150?img=12', name: 'Rahul Hikes', handle: '@himalayanrahul', stats: '12 Activities · 15 Food Spots · 3 Stays', color: 'bg-cyan-200' },
  { id: 3, title: 'Bali Budget Backpacker Guide', duration: '14 Days', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600', path: 'Canggu (4n) → Ubud (5n) → Nusa Penida (4n)', avatar: 'https://i.pravatar.cc/150?img=41', name: 'Aussie Nomad', handle: '@budgetbali', stats: '40 Activities · 30 Food Spots · 5 Stays', color: 'bg-yellow-200' },
  { id: 4, title: 'Swiss Alps Luxury Honeymoon', duration: '8 Days', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=600', path: 'Zurich (1n) → Zermatt (3n) → St. Moritz (3n)', avatar: 'https://i.pravatar.cc/150?img=25', name: 'Luxury Escapes', handle: '@luxuryswiss', stats: '10 Activities · 18 Food Spots · 3 Stays', color: 'bg-white' },
  { id: 5, title: 'Thailand Food & Culture Tour', duration: '12 Days', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=600', path: 'Bangkok (4n) → Chiang Mai (4n) → Phuket (4n)', avatar: 'https://i.pravatar.cc/150?img=61', name: 'Foodie Travel', handle: '@thai_tastes', stats: '30 Activities · 45 Food Spots · 3 Stays', color: 'bg-pink-200' },
  { id: 6, title: 'Himachal Spiti Circuit', duration: '9 Days', image: 'https://images.unsplash.com/photo-1626243867623-01369f95701c?auto=format&fit=crop&q=80&w=600', path: 'Shimla (1n) → Kalpa (1n) → Kaza (3n) → Manali (2n)', avatar: 'https://i.pravatar.cc/150?img=11', name: 'Mountain Rider', handle: '@spitiexplorer', stats: '15 Activities · 10 Food Spots · 6 Stays', color: 'bg-blue-200' }
];

export default function Tripboards() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { requireAuth, setAuthModalOpen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === 'required') {
      setAuthModalOpen(true);
    }
  }, [location, setAuthModalOpen]);


  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3 text-[#0A0A0A]">
              <Compass className="w-8 h-8 text-blue-600" strokeWidth={3} />
              Creator Tripboards
            </h1>
            <p className="font-bold text-gray-600 mt-2">Discover curated itineraries from real travelers.</p>
          </div>
          <button onClick={() => requireAuth(() => navigate('/create-tripboard'))} className="bg-[#0A0A0A] text-white px-6 py-3 rounded-xl border-4 border-[#0A0A0A] font-black hover:-translate-y-1 hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap cursor-pointer">
            + Create Tripboard
          </button>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-3 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full border-2 border-black font-black whitespace-nowrap">
            <Filter className="w-4 h-4" /> Filters:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full border-2 border-black font-black whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5' : 'bg-white hover:bg-gray-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tripboards.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={item.id}
            >
              <Link to={`/tripboards/${item.id}`} className={`${item.color} block border-4 border-[#0A0A0A] rounded-[2rem] p-4 shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] transition-all flex flex-col h-full group`}>
                <div className="relative w-full h-[240px] rounded-xl border-4 border-[#0A0A0A] overflow-hidden mb-4 bg-white">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Trip Cover" />
                  <div className="absolute top-3 left-3 bg-white border-2 border-[#0A0A0A] px-3 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
                    {item.duration}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#0A0A0A] overflow-hidden">
                    <img src={item.avatar} className="w-full h-full object-cover" alt="Creator" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-[#0A0A0A] leading-tight">{item.name}</p>
                    <p className="text-xs font-bold text-gray-700">{item.handle}</p>
                  </div>
                </div>
                
                <h3 className="font-black text-xl mb-3 line-clamp-2">{item.title}</h3>
                
                <div className="bg-white border-2 border-black rounded-lg p-2 mb-4 mt-auto">
                  <p className="text-xs font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">{item.path}</p>
                </div>
                
                <div className="flex items-center justify-between border-t-2 border-dashed border-black/30 pt-3">
                  <p className="text-[11px] font-black text-black uppercase tracking-wider">{item.stats}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
