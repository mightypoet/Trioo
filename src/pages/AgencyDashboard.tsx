import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Edit, Plus } from 'lucide-react';

export default function AgencyDashboard() {
  const { user } = useAuth();
  const [agency, setAgency] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ base_price: 0, start_date: '', end_date: '' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ title: '', destination: '', base_price: 0, cover_image: '', start_date: '', end_date: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAgencyData = async () => {
      if (!user?.email) return;

      try {
        // 1. Fetch agency by contact_email
        const { data: agencyData, error: agencyError } = await supabase
          .from('agencies')
          .select('*')
          .eq('contact_email', user.email)
          .single();

        if (agencyError || !agencyData) {
          console.error("Agency not found for this email", agencyError);
          setLoading(false);
          return;
        }

        setAgency(agencyData);

        // 2. Fetch trips for this agency
        const { data: tripsData, error: tripsError } = await supabase
          .from('trips')
          .select('*')
          .eq('agency_id', agencyData.id);

        if (!tripsError && tripsData) {
          setTrips(tripsData);
        }
      } catch (error) {
        console.error("Error fetching agency data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencyData();
  }, [user]);

  const handleEditClick = (trip: any) => {
    setEditingTrip(trip);
    setEditForm({
      base_price: trip.base_price || 0,
      start_date: trip.start_date || '',
      end_date: trip.end_date || '',
    });
    setIsModalOpen(true);
  };

  
  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([{
          ...newTrip,
          agency_id: agency.id
        }])
        .select()
        .single();

      if (error) throw error;

      setTrips([data, ...trips]);
      setIsAddModalOpen(false);
      setNewTrip({ title: '', destination: '', base_price: 0, cover_image: '', start_date: '', end_date: '' });
      alert('Trip listed successfully!');
    } catch (error: any) {
      console.error('Create trip failed:', error);
      alert('Failed to list trip: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrip) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('trips')
        .update({
          base_price: editForm.base_price,
          start_date: editForm.start_date,
          end_date: editForm.end_date
        })
        .eq('id', editingTrip.id);

      if (error) throw error;

      // Update local state
      setTrips(trips.map(t => t.id === editingTrip.id ? { ...t, ...editForm } : t));
      setIsModalOpen(false);
      alert('Trip updated successfully');
    } catch (error: any) {
      console.error('Update failed:', error);
      alert('Failed to update trip. The date columns might not exist in the database yet.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-[#f8f9fa]">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center bg-[#f8f9fa] px-4">
        <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-md">
          <h2 className="text-3xl font-black mb-4">Agency Not Found</h2>
          <p className="font-bold text-gray-600 mb-6">We couldn't find an agency registered with your email ({user?.email}). Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
              Welcome back,
            </h1>
            <h2 className="text-3xl font-bold text-black border-b-4 border-black inline-block mt-2">
              {agency.name}
            </h2>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-yellow-300 text-black border-4 border-black font-black px-6 py-4 rounded-xl flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Plus className="w-6 h-6" strokeWidth={3} />
            CREATE NEW TRIP
          </button>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {trips.length === 0 ? (
            <div className="col-span-full bg-white border-4 border-black rounded-2xl p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black mb-2">No Active Trips</h3>
              <p className="font-bold text-gray-500">You haven't created any trips yet.</p>
            </div>
          ) : (
            trips.map(trip => (
              <div key={trip.id} className="bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all flex flex-col group">
                {/* Image Area */}
                <div className="h-48 border-b-4 border-black relative overflow-hidden">
                  <img 
                    src={trip.cover_image || 'https://via.placeholder.com/400x300'} 
                    alt={trip.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white border-2 border-black font-black text-xs px-3 py-1 rounded-full uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {trip.destination}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black mb-4 leading-tight uppercase line-clamp-2">{trip.title}</h3>
                  
                  <div className="mt-auto space-y-3 mb-6">
                    <div className="flex items-center gap-3 bg-pink-100 border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Calendar className="w-5 h-5 text-black" strokeWidth={3} />
                      <span className="font-black">
                        {trip.start_date && trip.end_date 
                          ? `${new Date(trip.start_date).toLocaleDateString('en-US', {month:'short', day:'numeric'})} - ${new Date(trip.end_date).toLocaleDateString('en-US', {month:'short', day:'numeric'})}`
                          : trip.start_date || 'Date TBD'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-green-100 border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <DollarSign className="w-5 h-5 text-black" strokeWidth={3} />
                      <span className="font-black text-xl">₹{(trip.base_price || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleEditClick(trip)}
                    className="w-full bg-black text-white font-black py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    EDIT DETAILS
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Modal */}
        
        {/* Create Trip Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-black mb-6 uppercase">List a New Adventure</h2>
              <form onSubmit={handleCreateTrip}>
                <div className="space-y-4">
                  <div>
                    <label className="block font-black text-sm mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newTrip.title}
                      onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                      className="w-full border-4 border-black rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-pink-300 mb-4"
                      placeholder="e.g., Bali Gateway"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-black text-sm mb-1">Destination</label>
                    <input
                      type="text"
                      required
                      value={newTrip.destination}
                      onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                      className="w-full border-4 border-black rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-pink-300 mb-4"
                      placeholder="e.g., Bali, Indonesia"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-sm mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newTrip.base_price}
                      onChange={(e) => setNewTrip({ ...newTrip, base_price: Number(e.target.value) })}
                      className="w-full border-4 border-black rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-pink-300 mb-4"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-black text-sm mb-1">Start Date</label>
                      <input
                        type="date"
                        value={newTrip.start_date}
                        onChange={(e) => setNewTrip({ ...newTrip, start_date: e.target.value })}
                        className="w-full border-4 border-black rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-pink-300 mb-4"
                      />
                    </div>
                    <div>
                      <label className="block font-black text-sm mb-1">End Date</label>
                      <input
                        type="date"
                        value={newTrip.end_date}
                        onChange={(e) => setNewTrip({ ...newTrip, end_date: e.target.value })}
                        className="w-full border-4 border-black rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-pink-300 mb-4"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-sm mb-1">Image URL</label>
                    <input
                      type="url"
                      value={newTrip.cover_image}
                      onChange={(e) => setNewTrip({ ...newTrip, cover_image: e.target.value })}
                      className="w-full border-4 border-black rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-pink-300 mb-4"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="bg-rose-400 border-2 border-black rounded-xl px-4 py-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-rose-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="bg-green-400 border-2 border-black rounded-xl px-6 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-green-500 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
                  >
                    {isCreating ? 'Listing...' : 'List Trip'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative rotate-1">
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-red-400 border-4 border-black rounded-full font-black flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform"
              >
                ✕
              </button>

              <h2 className="text-3xl font-black mb-6 uppercase border-b-4 border-black pb-4 inline-block">
                Edit Trip
              </h2>

              <p className="font-bold text-gray-600 mb-6 line-clamp-1">{editingTrip?.title}</p>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block font-black uppercase text-sm mb-2">Base Price (₹)</label>
                  <input 
                    type="number" 
                    value={editForm.base_price}
                    onChange={(e) => setEditForm({...editForm, base_price: Number(e.target.value)})}
                    className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 font-bold text-lg outline-none focus:bg-white focus:ring-4 focus:ring-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black uppercase text-sm mb-2">Start Date</label>
                    <input 
                      type="date" 
                      value={editForm.start_date}
                      onChange={(e) => setEditForm({...editForm, start_date: e.target.value})}
                      className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-sm mb-2">End Date</label>
                    <input 
                      type="date" 
                      value={editForm.end_date}
                      onChange={(e) => setEditForm({...editForm, end_date: e.target.value})}
                      className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full bg-green-400 text-black border-4 border-black font-black uppercase text-xl py-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
