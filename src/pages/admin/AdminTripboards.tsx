import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Loader2, ExternalLink, Trash2, Plus } from 'lucide-react';

export default function AdminTripboards() {
  const [adminTripboards, setAdminTripboards] = useState<any[]>([]);
  const [isLoadingTripboards, setIsLoadingTripboards] = useState(false);

  useEffect(() => {
    fetchAdminTripboards();
  }, []);

  const fetchAdminTripboards = async () => {
    setIsLoadingTripboards(true);
    try {
      const { data, error } = await supabase
        .from('tripboards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tripboards:', error);
      } else {
        setAdminTripboards(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsLoadingTripboards(false);
    }
  };

  const handleDeleteTripboard = async (tripboardId: string) => {
    if (!window.confirm("Are you sure you want to delete this tripboard?")) return;
    
    try {
      const { error } = await supabase
        .from('tripboards')
        .delete()
        .eq('id', tripboardId);
        
      if (error) throw error;
      
      setAdminTripboards(prev => prev.filter(t => t.id !== tripboardId));
      alert('Tripboard deleted successfully.');
    } catch (err) {
      console.error('Error deleting tripboard:', err);
      alert('Failed to delete tripboard.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-[#0A0A0A] uppercase tracking-wider">Manage Tripboards</h2>
        <Link 
          to="/create-tripboard" 
          className="flex items-center gap-2 bg-green-300 border-4 border-black px-4 py-2 font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Tripboard
        </Link>
      </div>

      {isLoadingTripboards ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : adminTripboards.length === 0 ? (
        <div className="bg-white border-4 border-black rounded-2xl p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-gray-500 font-bold text-lg">No tripboards found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {adminTripboards.map(tripboard => (
            <div key={tripboard.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] gap-4">
              <div className="flex-1">
                <h3 className="font-black text-xl mb-1">{tripboard.title}</h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-bold bg-pink-100 border-2 border-black px-2 py-0.5 rounded-lg">
                    {tripboard.creator_name || 'Anonymous'}
                  </span>
                  <span className="font-bold text-gray-600 flex items-center gap-1">
                    {tripboard.destination && `📍 ${tripboard.destination}`}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link 
                  to={`/tripboards/${tripboard.id}`} 
                  target="_blank"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-yellow-300 border-2 border-black font-bold px-4 py-2 rounded-lg hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> View
                </Link>
                <button 
                  onClick={() => handleDeleteTripboard(tripboard.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-400 border-2 border-black font-bold px-4 py-2 rounded-lg text-white hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:scale-95"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
