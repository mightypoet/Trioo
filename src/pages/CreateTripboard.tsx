import React, { useState } from 'react';
import { Upload, Plus, Trash2, ArrowRight, Save, Image as ImageIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreateTripboard() {
  const [step, setStep] = useState(1);

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
           {['Basics', 'Itinerary', 'Stays', 'Food & Photos'].map((s, i) => (
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
                  <input type="text" placeholder="e.g. 10 Days in South Korea" className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50" />
                </div>
                <div>
                  <label className="block font-black text-lg mb-2">Cover Photo URL</label>
                  <div className="flex gap-2">
                    <div className="bg-gray-100 border-4 border-black rounded-xl p-4 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><ImageIcon className="w-6 h-6" /></div>
                    <input type="text" placeholder="https://..." className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50" />
                  </div>
                </div>
                <div>
                  <label className="block font-black text-lg mb-2">Cities Visited</label>
                  <div className="flex gap-2 mb-2">
                     <input type="text" placeholder="City Name" className="flex-1 bg-gray-50 border-4 border-black rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50" />
                     <input type="number" placeholder="Nights" className="w-24 bg-gray-50 border-4 border-black rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50" />
                     <button className="bg-black text-white px-4 rounded-xl border-4 border-black font-black hover:bg-gray-800"><Plus/></button>
                  </div>
                  <div className="flex gap-2 mt-3">
                     <span className="bg-cyan-200 border-2 border-black px-3 py-1 rounded-lg font-black text-sm flex items-center gap-2">Seoul (3n) <Trash2 className="w-3 h-3 cursor-pointer" /></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h2 className="text-2xl font-black border-b-4 border-black pb-2 inline-block">2. Day by Day</h2>
              <div className="bg-gray-100 border-4 border-black rounded-xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                 <button className="absolute -top-3 -right-3 bg-red-400 border-4 border-black w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-red-500"><Trash2 className="w-4 h-4"/></button>
                 <h3 className="font-black text-lg mb-3">Day 1</h3>
                 <input type="text" placeholder="Highlight Title (e.g. Arrival & Palaces)" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3" />
                 <textarea placeholder="Describe the day's activities..." rows={3} className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3"></textarea>
                 <input type="text" placeholder="Transport Mode (e.g. KTX Train)" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold" />
              </div>
              <button className="w-full bg-green-300 border-4 border-black rounded-xl p-4 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex justify-center gap-2">
                <Plus /> Add Another Day
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h2 className="text-2xl font-black border-b-4 border-black pb-2 inline-block">3. Where did you stay?</h2>
              <div className="bg-pink-100 border-4 border-black rounded-xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                 <h3 className="font-black text-lg mb-3">Stay 1</h3>
                 <input type="text" placeholder="Hotel / Hostel Name" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3" />
                 <div className="flex gap-2 mb-3">
                   <input type="text" placeholder="Price (e.g. ₹2000/n)" className="flex-1 bg-white border-2 border-black rounded-lg p-2 font-bold" />
                   <input type="text" placeholder="Room Type" className="flex-1 bg-white border-2 border-black rounded-lg p-2 font-bold" />
                 </div>
                 <input type="text" placeholder="Booking Link (Optional)" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold" />
              </div>
              <button className="w-full bg-green-300 border-4 border-black rounded-xl p-4 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex justify-center gap-2">
                <Plus /> Add Another Stay
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h2 className="text-2xl font-black border-b-4 border-black pb-2 inline-block">4. Food & Budget</h2>
              <div>
                 <label className="block font-black text-lg mb-2">Total Trip Cost (Per Person)</label>
                 <input type="text" placeholder="e.g. ₹45,000" className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50" />
              </div>
              <hr className="border-2 border-black" />
              <div className="bg-yellow-100 border-4 border-black rounded-xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                 <h3 className="font-black text-lg mb-3">Food Spot 1</h3>
                 <input type="text" placeholder="Restaurant Name" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3" />
                 <input type="text" placeholder="What did you order?" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold mb-3" />
                 <input type="text" placeholder="Short Review" className="w-full bg-white border-2 border-black rounded-lg p-2 font-bold" />
              </div>
              <button className="w-full bg-green-300 border-4 border-black rounded-xl p-4 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex justify-center gap-2">
                <Plus /> Add Another Restaurant
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t-4 border-black">
             {step > 1 ? (
               <button onClick={() => setStep(s => s - 1)} className="font-black px-6 py-3 border-4 border-black rounded-xl bg-white hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Back</button>
             ) : <div></div>}
             
             {step < 4 ? (
               <button onClick={() => setStep(s => s + 1)} className="font-black px-6 py-3 border-4 border-black rounded-xl bg-blue-500 text-white flex items-center gap-2 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Next <ArrowRight className="w-4 h-4"/></button>
             ) : (
               <button onClick={() => alert('Tripboard Published!')} className="font-black px-8 py-3 border-4 border-black rounded-xl bg-yellow-300 text-black flex items-center gap-2 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><Upload className="w-4 h-4"/> Publish Tripboard</button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
