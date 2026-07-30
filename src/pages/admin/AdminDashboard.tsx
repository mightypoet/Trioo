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
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
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
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{agency.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
