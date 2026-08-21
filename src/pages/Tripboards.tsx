import React, { useState, useEffect } from 'react';
import { Compass, Filter, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

const categories = ["All", "South East Asia", "Europe", "Mountains", "Solo & Budget", "Luxury"];

export default function Tripboards() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { requireAuth, setAuthModalOpen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tripboards, setTripboards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === 'required') {
      setAuthModalOpen(true);
    }
  }, [location, setAuthModalOpen]);

  useEffect(() => {
    fetchTripboards();
  }, []);

  const fetchTripboards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tripboards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTripboards(data || []);
    } catch (error) {
      console.error('Error fetching tripboards:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
          </div>
        ) : tripboards.length === 0 ? (
          <div className="bg-white border-4 border-black rounded-[2rem] p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black mb-2">No Tripboards Yet</h3>
            <p className="font-bold text-gray-500 mb-6">Be the first to share your journey!</p>
            <button onClick={() => requireAuth(() => navigate('/create-tripboard'))} className="bg-yellow-300 px-6 py-3 rounded-xl border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
              Create Tripboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tripboards.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={item.id}
              >
                <Link to={`/tripboards/${item.id}`} className={`${item.color || 'bg-white'} block border-4 border-[#0A0A0A] rounded-[2rem] p-4 shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] transition-all flex flex-col h-full group`}>
                  <div className="relative w-full h-[240px] rounded-xl border-4 border-[#0A0A0A] overflow-hidden mb-4 bg-white">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Trip Cover" />
                    <div className="absolute top-3 left-3 bg-white border-2 border-[#0A0A0A] px-3 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
                      {item.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-[#0A0A0A] overflow-hidden flex-shrink-0">
                      <img src={item.avatar} className="w-full h-full object-cover" alt="Creator" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-[#0A0A0A] leading-tight truncate">{item.creator_name}</p>
                      <p className="text-xs font-bold text-gray-700 truncate">{item.handle}</p>
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
        )}
      </div>
    </div>
  );
}
