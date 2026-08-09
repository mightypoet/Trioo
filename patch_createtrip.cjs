const fs = require('fs');

let current = fs.readFileSync('src/components/admin/CreateTripForm.tsx', 'utf8');

// Update state
current = current.replace(
  /const \[formData, setFormData\] = useState\(\{(.*?)\}\);/s,
  `const [rawDescription, setRawDescription] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [formData, setFormData] = useState({$1,
    food_included: false,
    transit_included: false,
    key_features: ['', '', '']
  });`
);

// Add the Magic AI Formatting function
const aiFunction = `
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
`;

current = current.replace(/const uploadImages = /, aiFunction + '\n  const uploadImages = ');

// Add new form fields before Itineraries
const extraFields = `
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
                placeholder={\`Highlight \${idx + 1}\`}
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
`;

current = current.replace(/<div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-8">[\s]*<h3 className="text-lg font-bold mb-6 flex items-center gap-2">[\s]*<span className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">2<\/span>[\s]*Day-to-Day Itinerary/, extraFields + '\n<div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-8">\n<h3 className="text-lg font-bold mb-6 flex items-center gap-2">\n<span className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">2</span>\nDay-to-Day Itinerary');

// Update DB insert to include new fields
current = current.replace(/destination: formData\.destination,/g, 'destination: formData.destination,\n          food_included: formData.food_included,\n          transit_included: formData.transit_included,\n          key_features: formData.key_features.filter(f => f.trim() !== ""),');

// Update reset form
current = current.replace(/setFormData\(\{ \.\.\.formData, title: '', destination: '', base_price: '', cover_image: '' \}\);/, 'setFormData({ ...formData, title: "", destination: "", base_price: "", cover_image: "", food_included: false, transit_included: false, key_features: ["", "", ""] });\n      setRawDescription("");');

fs.writeFileSync('src/components/admin/CreateTripForm.tsx', current);
