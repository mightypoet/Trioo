import React, { useState } from 'react';
import { Upload, Plus, Trash2, ArrowRight, Image as ImageIcon, MapPin, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function ImageUploader({ values, onChange, label = "Upload Images", className = "", user }: { values: string[], onChange: (urls: string[]) => void, label?: string, className?: string, user: any }) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    const fileName = `${user.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { data, error } = await supabase.storage
      .from('tripboard-images')
      .upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage
      .from('tripboard-images')
      .getPublicUrl(fileName);
    return publicUrl;
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) {
      if (!user) alert("You must be logged in to upload images.");
      return;
    }
    setIsUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map((file: any) => uploadImage(file)));
      const validUrls = urls.filter(Boolean) as string[];
      onChange([...values, ...validUrls]);
    } catch (err: any) {
      console.error('Error uploading images:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block bg-yellow-200 border-4 border-black border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-yellow-300 font-bold transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleBulkUpload} disabled={isUploading} />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="w-6 h-6 mx-auto" />
            <span>{label}</span>
          </div>
        )}
      </label>

      {values && values.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {values.map((url, idx) => (
            <div key={idx} className="relative rounded-xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white aspect-square">
              <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.preventDefault(); handleRemove(idx); }} 
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full flex items-center justify-center hover:bg-red-600 transition-all z-10 w-6 h-6 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                title="Remove Image"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CreateTripboard() {
  const [step, setStep] = useState(1);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Step 1
  const [title, setTitle] = useState('');
  const [coverPhotos, setCoverPhotos] = useState<string[]>([]);
  const [cities, setCities] = useState<{name: string, nights: number}[]>([]);
  const [newCity, setNewCity] = useState('');
  const [newNights, setNewNights] = useState('');
  
  // Step 2
  const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '', transport: '', image_urls: [] as string[] }]);
  
  // Step 3
  const [stays, setStays] = useState([{ name: '', price: '', room: '', link: '', image_urls: [] as string[] }]);
  
  // Step 4
  const [totalCost, setTotalCost] = useState('');
  const [food, setFood] = useState([{ name: '', dish: '', review: '', image_urls: [] as string[] }]);

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/tripboards?login=required');
    }
  }, [user, loading, navigate]);

  const handleAddCity = () => {
    if (newCity && newNights) {
      setCities([...cities, { name: newCity, nights: parseInt(newNights) }]);
      setNewCity('');
      setNewNights('');
    }
  };

  const handleRemoveCity = (index: number) => {
    setCities(cities.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!user) return;
    setIsPublishing(true);
    
    const colors = ['bg-pink-200', 'bg-cyan-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const totalNights = cities.reduce((acc, c) => acc + c.nights, 0);
    const duration = totalNights > 0 ? `${totalNights + 1} Days` : '1 Day';
    const path = cities.map(c => `${c.name} (${c.nights}n)`).join(' → ');
    const destination = cities[0]?.name || 'Unknown';
    
    const creatorName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous';
    const handle = `@${user.email?.split('@')[0] || 'user'}`;
    const avatar = user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${creatorName.charAt(0)}`;
    const stats = `${itinerary.length} Days · ${food.length} Food Spots · ${stays.length} Stays`;

    const tripboardData = {
      user_id: user.id,
      title,
      image: coverPhotos[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',
      cover_images: coverPhotos,
      duration,
      path,
      destination,
      creator_name: creatorName,
      handle,
      avatar,
      stats,
      color: randomColor,
      itinerary,
      stays,
      food,
      budget: { total: totalCost, perPerson: totalCost, breakdown: {} },
      activities: []
    };

    try {
      const { error } = await supabase.from('tripboards').insert([tripboardData]);
      if (error) throw error;
      navigate('/tripboards');
    } catch (err: any) {
      console.error(err);
      alert('Failed to publish tripboard: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/tripboards" className="font-black text-gray-500 hover:text-black hover:underline mb-4 inline-block">← Back to Tripboards</Link>
          <h1 className="text-4xl font-black text-black">Upload Your Tripboard 🗺️</h1>
          <p className="font-bold text-gray-600 mt-2">Share your journey, stays, and hidden gems with the community.</p>
        </div>

        {/* Steps Tracker */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 hide-scrollbar">
           {['Basics', 'Itinerary', 'Stays', 'Food & Budget'].map((s, i) => (
             <div key={i} className={`flex-1 min-w-[120px] h-3 rounded-full border-2 border-black ${step >= i + 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
           ))}
        </div>

        <div className="bg-white border-4 border-black rounded-[2rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-black border-b-4 border-black pb-2 inline-block">1. The Basics</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-black text-lg mb-2">Trip Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. 10 Days in South Korea" className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50" />
                </div>
                <div>
                  <label className="block font-black text-lg mb-2">Cover Photo</label>
                  <ImageUploader values={coverPhotos} onChange={setCoverPhotos} label="Upload Cover Photos" user={user} />
                </div>
                <div>
                  <label className="block font-black text-lg mb-2">Cities Visited</label>
                  <div className="flex gap-2 mb-2">
                     <input type="text" value={newCity} onChange={e => setNewCity(e.target.value)} placeholder="City Name" className="flex-1 bg-gray-50 border-4 border-black rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50" />
                     <input type="number" value={newNights} onChange={e => setNewNights(e.target.value)} placeholder="Nights" className="w-24 bg-gray-50 border-4 border-black rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50" />
                     <button onClick={handleAddCity} className="bg-black text-white px-4 rounded-xl border-4 border-black font-black hover:bg-gray-800"><Plus/></button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                     {cities.map((city, i) => (
                       <span key={i} className="bg-cyan-200 border-2 border-black px-3 py-1 rounded-lg font-black text-sm flex items-center gap-2">
                         {city.name} ({city.nights}n) <Trash2 onClick={() => handleRemoveCity(i)} className="w-3 h-3 cursor-pointer hover:text-red-500" />
                       </span>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h2 className="text-2xl font-black border-b-4 border-black pb-2 inline-block">2. Day by Day</h2>
              {itinerary.map((day, i) => (
                <div key={i} className="bg-gray-100 border-4 border-black rounded-xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                   {itinerary.length > 1 && (
                     <button onClick={() => setItinerary(itinerary.filter((_, idx) => idx !== i))} className="absolute -top-3 -right-3 bg-red-400 border-4 border-black w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-red-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Trash2 className="w-4 h-4"/></button>
                   )}
                   <h3 className="font-black text-lg mb-3">Day {day.day}</h3>
                   <input type="text" value={day.title} onChange={e => { const newIt = [...itinerary]; newIt[i].title = e.target.value; setItinerary(newIt); }} placeholder="Highlight Title (e.g. Arrival & Palaces)" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3 focus:outline-none focus:bg-yellow-50" />
                   <textarea value={day.description} onChange={e => { const newIt = [...itinerary]; newIt[i].description = e.target.value; setItinerary(newIt); }} placeholder="Describe the day's activities..." rows={3} className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3 focus:outline-none focus:bg-yellow-50"></textarea>
                   <input type="text" value={day.transport} onChange={e => { const newIt = [...itinerary]; newIt[i].transport = e.target.value; setItinerary(newIt); }} placeholder="Transport Mode (e.g. KTX Train)" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3 focus:outline-none focus:bg-yellow-50" />
                   
                   <label className="block font-bold text-sm mb-2 text-gray-700">Add a Photo for this Day</label>
                   <ImageUploader values={day.image_urls || []} onChange={(urls) => { const newIt = [...itinerary]; newIt[i].image_urls = urls; setItinerary(newIt); }} label="Upload Day Photos" user={user} />
                </div>
              ))}
              <button onClick={() => setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '', transport: '', image_urls: [] }])} className="w-full bg-green-300 border-4 border-black rounded-xl p-4 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex justify-center gap-2">
                <Plus /> Add Another Day
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h2 className="text-2xl font-black border-b-4 border-black pb-2 inline-block">3. Where did you stay?</h2>
              {stays.map((stay, i) => (
                <div key={i} className="bg-pink-100 border-4 border-black rounded-xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                   {stays.length > 1 && (
                     <button onClick={() => setStays(stays.filter((_, idx) => idx !== i))} className="absolute -top-3 -right-3 bg-red-400 border-4 border-black w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-red-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Trash2 className="w-4 h-4"/></button>
                   )}
                   <h3 className="font-black text-lg mb-3">Stay {i + 1}</h3>
                   <input type="text" value={stay.name} onChange={e => { const newS = [...stays]; newS[i].name = e.target.value; setStays(newS); }} placeholder="Hotel / Hostel Name" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3 focus:outline-none focus:bg-yellow-50" />
                   <div className="flex gap-2 mb-3">
                     <input type="text" value={stay.price} onChange={e => { const newS = [...stays]; newS[i].price = e.target.value; setStays(newS); }} placeholder="Price (e.g. ₹2000/n)" className="flex-1 bg-white border-2 border-black rounded-lg p-2 font-bold focus:outline-none focus:bg-yellow-50" />
                     <input type="text" value={stay.room} onChange={e => { const newS = [...stays]; newS[i].room = e.target.value; setStays(newS); }} placeholder="Room Type" className="flex-1 bg-white border-2 border-black rounded-lg p-2 font-bold focus:outline-none focus:bg-yellow-50" />
                   </div>
                   <input type="text" value={stay.link} onChange={e => { const newS = [...stays]; newS[i].link = e.target.value; setStays(newS); }} placeholder="Booking Link (Optional)" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3 focus:outline-none focus:bg-yellow-50" />
                   
                   <label className="block font-bold text-sm mb-2 text-gray-700">Add a Photo of the Stay</label>
                   <ImageUploader values={stay.image_urls || []} onChange={(urls) => { const newS = [...stays]; newS[i].image_urls = urls; setStays(newS); }} label="Upload Stay Photos" user={user} />
                </div>
              ))}
              <button onClick={() => setStays([...stays, { name: '', price: '', room: '', link: '', image_urls: [] }])} className="w-full bg-green-300 border-4 border-black rounded-xl p-4 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex justify-center gap-2">
                <Plus /> Add Another Stay
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h2 className="text-2xl font-black border-b-4 border-black pb-2 inline-block">4. Food & Budget</h2>
              <div>
                 <label className="block font-black text-lg mb-2">Total Trip Cost (Per Person)</label>
                 <input type="text" value={totalCost} onChange={e => setTotalCost(e.target.value)} placeholder="e.g. ₹45,000" className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50" />
              </div>
              <hr className="border-2 border-black" />
              {food.map((f, i) => (
                <div key={i} className="bg-yellow-100 border-4 border-black rounded-xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                   {food.length > 1 && (
                     <button onClick={() => setFood(food.filter((_, idx) => idx !== i))} className="absolute -top-3 -right-3 bg-red-400 border-4 border-black w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-red-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Trash2 className="w-4 h-4"/></button>
                   )}
                   <h3 className="font-black text-lg mb-3">Food Spot {i + 1}</h3>
                   <input type="text" value={f.name} onChange={e => { const newF = [...food]; newF[i].name = e.target.value; setFood(newF); }} placeholder="Restaurant Name" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3 focus:outline-none focus:bg-yellow-50" />
                   <input type="text" value={f.dish} onChange={e => { const newF = [...food]; newF[i].dish = e.target.value; setFood(newF); }} placeholder="What did you order?" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3 focus:outline-none focus:bg-yellow-50" />
                   <input type="text" value={f.review} onChange={e => { const newF = [...food]; newF[i].review = e.target.value; setFood(newF); }} placeholder="Short Review" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3 focus:outline-none focus:bg-yellow-50" />
                   
                   <label className="block font-bold text-sm mb-2 text-gray-700">Add a Food Photo</label>
                   <ImageUploader values={f.image_urls || []} onChange={(urls) => { const newF = [...food]; newF[i].image_urls = urls; setFood(newF); }} label="Upload Food Photos" user={user} />
                </div>
              ))}
              <button onClick={() => setFood([...food, { name: '', dish: '', review: '', image_urls: [] }])} className="w-full bg-green-300 border-4 border-black rounded-xl p-4 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex justify-center gap-2">
                <Plus /> Add Another Restaurant
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t-4 border-black">
             {step > 1 ? (
               <button onClick={() => setStep(s => s - 1)} className="font-black px-6 py-3 border-4 border-black rounded-xl bg-white hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Back</button>             ) : <div></div>}
             
             {step < 4 ? (
               <button onClick={() => setStep(s => s + 1)} className="font-black px-6 py-3 border-4 border-black rounded-xl bg-blue-500 text-white flex items-center gap-2 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Next <ArrowRight className="w-4 h-4"/></button>
             ) : (
               <button disabled={isPublishing} onClick={handlePublish} className="font-black px-8 py-3 border-4 border-black rounded-xl bg-yellow-300 text-black flex items-center gap-2 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-70">
                 {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4"/>} 
                 {isPublishing ? 'Publishing...' : 'Publish Tripboard'}
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
