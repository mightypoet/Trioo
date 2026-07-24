import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AgencyFormModal from '../../components/admin/AgencyFormModal';

interface Agency {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  verification_status: string;
  logo_url: string;
}

export default function Agencies() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);

  const fetchAgencies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agencies:', error);
    } else {
      setAgencies(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this agency?')) {
      const { error } = await supabase.from('agencies').delete().eq('id', id);
      if (error) {
        alert('Failed to delete agency.');
      } else {
        fetchAgencies();
      }
    }
  };

  const openAddModal = () => {
    setEditingAgency(null);
    setIsModalOpen(true);
  };

  const openEditModal = (agency: Agency) => {
    setEditingAgency(agency);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agencies</h2>
          <p className="text-gray-500 mt-1">Manage onboarded travel agencies</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[var(--color-primary-hover)] transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Agency
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-sm uppercase font-bold text-gray-500">
              <tr>
                <th className="px-6 py-4">Agency</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Loading agencies...
                  </td>
                </tr>
              ) : agencies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No agencies found. Add your first travel partner!
                  </td>
                </tr>
              ) : (
                agencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {agency.logo_url ? (
                          <img
                            src={agency.logo_url}
                            alt={agency.name}
                            className="w-12 h-12 rounded-xl object-contain bg-white border border-gray-100 p-1 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold border border-gray-200">
                            {agency.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{agency.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 font-medium">{agency.contact_email}</p>
                      <p className="text-gray-400 text-sm">{agency.contact_phone || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {agency.verification_status === 'verified' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold text-sm border border-green-200">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 font-semibold text-sm border border-yellow-200">
                          <XCircle className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(agency)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Agency"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(agency.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Agency"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AgencyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agencyToEdit={editingAgency}
        onSuccess={fetchAgencies}
      />
    </div>
  );
}
