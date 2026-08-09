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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [rawDescription, setRawDescription] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [formData, setFormData] = useState({
    agency_id: '',
    title: '',
    destination: '',
    base_price: '',
    cover_image: '' // URL fallback
  ,
    food_included: false,
    transit_included: false,
    key_features: ['', '', '']
  });

  const [itineraries, setItineraries] = useState<ItineraryDay[]>([
    { day_number: 1, title: '', detailed_description: '' }
  ]);

  const [agencies, setAgencies] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchAgencies = async () => {
      const { data } = await supabase.from('agencies').select('id, name');
      if (data) {
        setAgencies(data);
      }
    };
    fetchAgencies();
  }, []);

  const handleTripChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  
  const handleExtractAI = async () => {
    if (!rawDescription.trim()) return;
    setIsExtracting(true);
    try {
      const res = await fetch('/api/extract-trip-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawDescription })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setFormData(prev => ({
        ...prev,
        food_included: data.food_included || false,
        transit_included: data.transit_included || false,
        key_features: Array.isArray(data.key_features) ? 
          [...data.key_features, '', '', ''].slice(0, 3) : 
          ['', '', '']
      }));

      if (Array.isArray(data.itinerary) && data.itinerary.length > 0) {
        setItineraries(data.itinerary.map((it, idx) => ({
          day_number: it.day || idx + 1,
          title: it.title || '',
          detailed_description: it.description || ''
        })));
      }
      
      alert('Data extracted successfully!');
    } catch (err: any) {
      alert('Failed to extract data: ' + err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return formData.cover_image ? [formData.cover_image] : [];

    const uploadPromises = imageFiles.map(async (file, index) => {
      const { data, error: uploadError } = await supabase.storage
        .from('trioo-images')
        .upload(`trips/${Date.now()}_${index}_${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        throw new Error(`Failed to upload image: ${file.name}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('trioo-images')
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalAgencyId = formData.agency_id;
      if (!finalAgencyId) {
        throw new Error('Please select an agency.');
      }

      const uploadedUrls = await uploadImages();

      if (uploadedUrls.length === 0) {
        throw new Error('Please provide at least one cover image or URL.');
      }

      const coverUrl = uploadedUrls[0];

      // 1. Insert Trip
      const { data: tripResult, error: tripError } = await supabase
        .from('trips')
        .insert({
          agency_id: finalAgencyId,
          title: formData.title,
          destination: formData.destination,
          food_included: formData.food_included,
          transit_included: formData.transit_included,
          key_features: formData.key_features.filter(f => f.trim() !== ""),
          base_price: parseFloat(formData.base_price),
          cover_image: coverUrl,
          images: uploadedUrls
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
      setFormData({ ...formData, title: "", destination: "", base_price: "", cover_image: "", food_included: false, transit_included: false, key_features: ["", "", ""] });
      setRawDescription("");
      setImageFiles([]);
      setImagePreviews([]);
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Travel Agency <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.agency_id || ''}
              onChange={(e) => setFormData({ ...formData, agency_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 shadow-sm"
              required
            >
              <option value="">-- Select an Agency --</option>
              {agencies.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.name}
                </option>
              ))}
            </select>
            {agencies.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ No agencies found. Please add an agency under the Agencies tab first.
              </p>
            )}
          </div>
          
          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">Trip Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
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
              value={formData.destination}
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
              value={formData.base_price}
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
                  <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const files = Array.from(e.target.files);
                      setImageFiles(prev => [...prev, ...files]);
                      setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f as File))]);
                    }
                  }} />
                </label>
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative">
                        <img src={preview} alt="Preview" className="w-full h-24 object-cover rounded-xl" />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFiles(prev => prev.filter((_, i) => i !== idx));
                            setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-center text-gray-400 text-sm font-bold mb-2">OR</span>
                <input
                  type="url"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleTripChange}
                  disabled={imageFiles.length > 0}
                  placeholder="Paste an external image URL"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-medium disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {/* Magic AI Extraction Block */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-8 relative">
        <div className="absolute -top-4 -right-4 text-6xl opacity-20 rotate-12 pointer-events-none">✨</div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          Magic AI Formatting
        </h3>
        <p className="text-sm text-gray-500 mb-4 font-medium">Paste the raw trip description from the agency and let our AI structure it instantly.</p>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <textarea
            value={rawDescription}
            onChange={e => setRawDescription(e.target.value)}
            placeholder="Paste raw description here..."
            className="w-full md:flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all font-medium resize-y"
            rows={5}
          />
          <button
            type="button"
            onClick={handleExtractAI}
            disabled={isExtracting || !rawDescription.trim()}
            className="w-full md:w-auto bg-gradient-to-r from-yellow-300 to-amber-300 border-2 border-black rounded-xl px-6 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-transform disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
          >
            {isExtracting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : '✨ Structure Data'}
          </button>
        </div>
      </div>

      {/* Additional Features */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-8">
        <h3 className="text-lg font-bold mb-6">Additional Trip Features</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={formData.food_included}
              onChange={e => setFormData({...formData, food_included: e.target.checked})}
              className="w-5 h-5 accent-green-500 rounded border-2 border-black"
            />
            <label className="font-bold text-gray-700">Food / Meals Included</label>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={formData.transit_included}
              onChange={e => setFormData({...formData, transit_included: e.target.checked})}
              className="w-5 h-5 accent-green-500 rounded border-2 border-black"
            />
            <label className="font-bold text-gray-700">Transit / Flights Included</label>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Key Features (3 Highlights)</label>
          <div className="space-y-3">
            {[0, 1, 2].map(idx => (
              <input
                key={idx}
                type="text"
                placeholder={`Highlight ${idx + 1}`}
                value={formData.key_features[idx]}
                onChange={e => {
                  const newFeatures = [...formData.key_features];
                  newFeatures[idx] = e.target.value;
                  setFormData({...formData, key_features: newFeatures});
                }}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            ))}
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

