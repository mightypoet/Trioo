const fs = require('fs');

let code = fs.readFileSync('src/pages/AgencyDashboard.tsx', 'utf8');

// Add new states
code = code.replace(
  /const \[editForm, setEditForm\] = useState\(\{ base_price: 0, start_date: '', end_date: '' \}\);/,
  `const [editForm, setEditForm] = useState({ base_price: 0, start_date: '', end_date: '' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ title: '', destination: '', base_price: 0, cover_image: '', start_date: '', end_date: '' });
  const [isCreating, setIsCreating] = useState(false);`
);

// Add handleCreateTrip function
const createTripLogic = `
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
`;

code = code.replace(/const handleSave = async/, createTripLogic + '\n  const handleSave = async');

// Update header button
code = code.replace(
  /<Link \s*to="\/admin\/trips" \s*className="bg-yellow-300 text-black border-4 border-black font-black px-6 py-4 rounded-xl flex items-center gap-2 shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\] hover:shadow-\[6px_6px_0px_0px_rgba\(0,0,0,1\)\] hover:-translate-y-1 transition-all"\s*>\s*<Plus className="w-6 h-6" strokeWidth=\{3\} \/>\s*CREATE NEW TRIP\s*<\/Link>/,
  `<button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-yellow-300 text-black border-4 border-black font-black px-6 py-4 rounded-xl flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Plus className="w-6 h-6" strokeWidth={3} />
            CREATE NEW TRIP
          </button>`
);

// Add Add Trip Modal
const addTripModal = `
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
`;

code = code.replace(/\{isModalOpen && \(/, addTripModal + '\n        {isModalOpen && (');

fs.writeFileSync('src/pages/AgencyDashboard.tsx', code);
