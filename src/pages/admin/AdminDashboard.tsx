import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart3, Users, MapPin, DollarSign, Activity, Settings, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalAgencies: 0,
    totalBookings: 0,
    revenue: 0,
    footprints: 0
  });
  
  const [trips, setTrips] = useState<any[]>([]);
  const [footprints, setFootprints] = useState<any[]>([]);
  const [agencyPerformance, setAgencyPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<'trip' | 'agency' | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  
  
  const handleEditClick = async (item: any, type: 'trip' | 'agency') => {
    try {
      const { data, error } = await supabase.from(type === 'trip' ? 'trips' : 'agencies').select('*').eq('id', item.id).single();
      if (error) throw error;
      setEditingItem(data);
      setEditType(type);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error('Error fetching details:', err);
      alert('Failed to fetch details');
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editType) return;
    setIsSaving(true);
    try {
      const { id, created_at, updated_at, ...updateData } = editingItem;
      const { error } = await supabase.from(editType === 'trip' ? 'trips' : 'agencies').update(updateData).eq('id', id);
      if (error) throw error;
      
      if (editType === 'trip') {
        setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updateData } : t));
      } else {
        setAgencyPerformance(prev => prev.map(a => a.id === id ? { ...a, ...updateData } : a));
      }
      
      setIsEditModalOpen(false);
      setEditingItem(null);
      alert('Updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update');
    } finally {
      setIsSaving(false);
    }
  };


  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure? This will delete the trip and all associated bookings.')) return;
    try {
      const { error } = await supabase.from('trips').delete().eq('id', tripId);
      if (error) throw error;
      setTrips(prev => prev.filter(t => t.id !== tripId));
      alert('Trip deleted successfully.');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete: Make sure no active bookings are preventing deletion.');
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const { count: tripsCount } = await supabase.from('trips').select('*', { count: 'exact', head: true });
        const { count: agenciesCount } = await supabase.from('agencies').select('*', { count: 'exact', head: true });
        const { data: bookingsData } = await supabase.from('bookings').select('total_price, trip_id');
        
        const totalRevenue = bookingsData?.reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0;
        const bookingsCount = bookingsData?.length || 0;

        setStats({
          totalTrips: tripsCount || 0,
          totalAgencies: agenciesCount || 0,
          totalBookings: bookingsCount,
          revenue: totalRevenue,
          footprints: 1245 // Mocked for UI if table doesn't exist
        });

        // Fetch recent trips
        const { data: tripsData } = await supabase
          .from('trips')
          .select('*, agencies(name)')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (tripsData) setTrips(tripsData);

        // Fetch agency performance
        const { data: allTrips } = await supabase.from('trips').select('id, agency_id, agencies(name)');
        if (allTrips && bookingsData) {
          const agencyStats: Record<string, { name: string; revenue: number; bookings: number }> = {};
          
          allTrips.forEach(trip => {
            if (!trip.agency_id) return;
            if (!agencyStats[trip.agency_id]) {
              agencyStats[trip.agency_id] = {
                id: trip.agency_id, 
                name: (trip.agencies as any)?.name || 'Unknown', 
                revenue: 0, 
                bookings: 0 
              };
            }
          });

          bookingsData.forEach(booking => {
            const trip = allTrips.find(t => t.id === booking.trip_id);
            if (trip && trip.agency_id && agencyStats[trip.agency_id]) {
              agencyStats[trip.agency_id].revenue += (booking.total_price || 0);
              agencyStats[trip.agency_id].bookings += 1;
            }
          });

          const performanceArray = Object.values(agencyStats).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
          setAgencyPerformance(performanceArray);
        }

        // Fetch user footprints (mock data fallback if table missing)
        const { data: fpData, error: fpError } = await supabase
          .from('user_footprints')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (fpError) {
          // Mock data
          setFootprints([
            { id: 1, user_id: 'user-1', page_url: '/package/123', created_at: new Date().toISOString(), user_agent: 'Chrome/Mac' },
            { id: 2, user_id: 'user-2', page_url: '/search?q=bali', created_at: new Date(Date.now() - 3600000).toISOString(), user_agent: 'Safari/iOS' },
            { id: 3, user_id: 'user-3', page_url: '/', created_at: new Date(Date.now() - 7200000).toISOString(), user_agent: 'Firefox/Windows' }
          ]);
        } else if (fpData) {
          setFootprints(fpData);
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Total Trips</p>
            <p className="text-2xl font-black text-gray-900">{stats.totalTrips}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Agencies</p>
            <p className="text-2xl font-black text-gray-900">{stats.totalAgencies}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Revenue</p>
            <p className="text-2xl font-black text-gray-900">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Page Views</p>
            <p className="text-2xl font-black text-gray-900">{stats.footprints.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Trips Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Recent Trips</h3>
            <Link to="/admin/trips" className="text-sm text-primary font-bold hover:underline">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-bold">Trip Title</th>
                  <th className="pb-3 font-bold">Agency</th>
                  <th className="pb-3 font-bold">Price</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {trips.map((trip) => (
                  <tr key={trip.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-gray-900">{trip.title}</td>
                    <td className="py-4 font-medium text-gray-500">{trip.agencies?.name || 'Unknown'}</td>
                    <td className="py-4 font-bold text-gray-900">₹{trip.base_price?.toLocaleString()}</td>
                    <td className="py-4 flex items-center justify-end gap-2">
                      <button onClick={() => handleEditClick(trip, 'trip')} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteTrip(trip.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 font-medium">No trips found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agency Performance */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Top Agencies</h3>
          <div className="space-y-6">
            {agencyPerformance.length === 0 ? (
              <p className="text-sm text-gray-500 font-medium">No agency data available.</p>
            ) : (
              agencyPerformance.map((agency, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {agency.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 truncate max-w-[120px]">{agency.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{agency.bookings} Bookings</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <p className="font-bold text-gray-900">₹{agency.revenue.toLocaleString()}</p>
                    <button onClick={() => handleEditClick(agency, 'agency')} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md relative">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
              <Trash2 className="w-5 h-5 hidden" />
              X
            </button>
            <h3 className="text-2xl font-black mb-6">Edit {editType === 'trip' ? 'Trip' : 'Agency'}</h3>
            <form onSubmit={handleSaveChanges} className="space-y-4">
              {editType === 'trip' ? (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-1">Title</label>
                    <input type="text" value={editingItem?.title || ''} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} className="w-full border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-4 focus:ring-cyan-300" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Destination</label>
                    <input type="text" value={editingItem?.destination || ''} onChange={(e) => setEditingItem({...editingItem, destination: e.target.value})} className="w-full border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-4 focus:ring-cyan-300" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Price</label>
                    <input type="number" value={editingItem?.base_price || 0} onChange={(e) => setEditingItem({...editingItem, base_price: Number(e.target.value)})} className="w-full border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-4 focus:ring-cyan-300" required />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-1">Name</label>
                    <input type="text" value={editingItem?.name || ''} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} className="w-full border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-4 focus:ring-cyan-300" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Contact Email</label>
                    <input type="email" value={editingItem?.contact_email || ''} onChange={(e) => setEditingItem({...editingItem, contact_email: e.target.value})} className="w-full border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-4 focus:ring-cyan-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Status</label>
                    <select value={editingItem?.verification_status || 'pending'} onChange={(e) => setEditingItem({...editingItem, verification_status: e.target.value})} className="w-full border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-4 focus:ring-cyan-300">
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                    </select>
                  </div>
                </>
              )}
              <div className="pt-4 flex justify-end">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="mr-3 font-bold text-gray-500 hover:text-black">Cancel</button>
                <button type="submit" disabled={isSaving} className="bg-yellow-300 border-2 border-black rounded-xl px-6 py-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-transform disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
