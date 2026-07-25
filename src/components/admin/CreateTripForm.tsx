import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Save, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface ItineraryDay {
  day_number: number;
  title: string;
  detailed_description: string;
}

export default function CreateTripForm() {
  const { role, agencyId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [tripData, setTripData] = useState({
    agency_id: '',
    title: '',
    destination: '',
    base_price: '',
    cover_image: '' // URL fallback
  });

  const [itineraries, setItineraries] = useState<ItineraryDay[]>([
    { day_number: 1, title: '', detailed_description: '' }
  ]);

  const [agencies, setAgencies] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (role === 'admin') {
      const fetchAgencies = async () => {
        const { data } = await supabase.from('agencies').select('id, name');
        if (data) {
          setAgencies(data);
        }
      };
      fetchAgencies();
    }
  }, [role]);

  const handleTripChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleItineraryChange = (index: number, field: keyof ItineraryDay, value: string) => {
    const newItineraries = [...itineraries];
    newItineraries[index] = { ...newItineraries[index], [field]: value };
    setItineraries(newItineraries);
  };

  const addDay = () => {
    setItineraries([
      ...itineraries,
      { day_number: itineraries.length + 1, title: '', detailed_description: '' }
    ]);
  };

  const removeDay = (index: number) => {
    const newItineraries = itineraries.filter((_, i) => i !== index);
    // Re-index days
    setItineraries(newItineraries.map((it, i) => ({ ...it, day_number: i + 1 })));
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return tripData.cover_image;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `trips/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('trioo-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      throw new Error('Failed to upload image.');
    }

    const { data: publicUrlData } = supabase.storage
      .from('trioo-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalAgencyId = role === 'agency' ? agencyId : tripData.agency_id;
      if (!finalAgencyId) {
        throw new Error('Please select an agency.');
      }

      const coverUrl = await uploadImage();

      if (!coverUrl) {
        throw new Error('Please provide a cover image or URL.');
      }

      // 1. Insert Trip
      const { data: tripResult, error: tripError } = await supabase
        .from('trips')
        .insert({
          agency_id: finalAgencyId,
          title: tripData.title,
          destination: tripData.destination,
          base_price: parseFloat(tripData.base_price),
          cover_image: coverUrl,
        })
        .select()
        .single();

      if (tripError) throw tripError;

      // 2. Insert Itineraries
      const formattedItineraries = itineraries.map(it => ({
        trip_id: tripResult.id,
        day_number: it.day_number,
        title: it.title,
        detailed_description: it.detailed_description
      }));

      const { error: itError } = await supabase
        .from('itineraries')
        .insert(formattedItineraries);

      if (itError) throw itError;

      alert('Trip created successfully!');
      
      // Reset form (partial reset for demo)
      setTripData({ ...tripData, title: '', destination: '', base_price: '', cover_image: '' });
      setImageFile(null);
      setItineraries([{ day_number: 1, title: '', detailed_description: '' }]);
      
    } catch (error: any) {
      console.error('Submission Error:', error);
      alert(error.message || 'An error occurred while creating the trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Trip</h2>
          <p className="text-gray-500">Add a new trip with daily itineraries and pricing packages.</p>
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[var(--color-primary-hover)] transition-all shadow-md disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saving...' : 'Save Trip'}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">1</span>
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {role === 'admin' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Agency</label>
              <select
                name="agency_id"
                value={tripData.agency_id}
                onChange={handleTripChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-medium"
              >
                <option value="">Select an Agency</option>
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>{agency.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className={role === 'admin' ? '' : 'md:col-span-2'}>
            <label className="block text-sm font-bold text-gray-700 mb-2">Trip Title</label>
            <input
              type="text"
              name="title"
              value={tripData.title}
              onChange={handleTripChange}
              placeholder="e.g., Magical Bali Retreat"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Destination</label>
            <input
              type="text"
              name="destination"
              value={tripData.destination}
              onChange={handleTripChange}
              placeholder="e.g., Bali, Indonesia"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Base Price (₹)</label>
            <input
              type="number"
              name="base_price"
              value={tripData.base_price}
              onChange={handleTripChange}
              placeholder="e.g., 45000"
              required
              min="0"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-medium"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Click to upload image file</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageFileChange} />
                </label>
                {imageFile && <p className="text-xs text-green-600 mt-2 font-medium">Selected: {imageFile.name}</p>}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-center text-gray-400 text-sm font-bold mb-2">OR</span>
                <input
                  type="url"
                  name="cover_image"
                  value={tripData.cover_image}
                  onChange={handleTripChange}
                  disabled={!!imageFile}
                  placeholder="Paste an external image URL"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-medium disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-8">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">2</span>
          Day-to-Day Itinerary
        </h3>
        
        <div className="space-y-6">
          {itineraries.map((itinerary, index) => (
            <div key={index} className="p-6 border border-gray-100 bg-gray-50/50 rounded-2xl relative group">
              <div className="absolute -left-3 top-6 bg-white border border-gray-200 text-gray-700 font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
                {itinerary.day_number}
              </div>
              <div className="pl-6 flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Day Title</label>
                    <input
                      type="text"
                      value={itinerary.title}
                      onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                      placeholder="e.g., Arrival in Denpasar & Check-in"
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
                    <textarea
                      value={itinerary.detailed_description}
                      onChange={(e) => handleItineraryChange(index, 'detailed_description', e.target.value)}
                      placeholder="Describe the day's activities in detail..."
                      required
                      rows={3}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all font-medium resize-y"
                    />
                  </div>
                </div>
                {itineraries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDay(index)}
                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Remove Day"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addDay}
          className="mt-6 flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50/50 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Another Day
        </button>
      </div>
    </form>
  );
}

