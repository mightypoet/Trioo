const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add peopleCount state
const stateOld = `  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');`;
const stateNew = `  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [peopleCount, setPeopleCount] = useState<number>(2);`;
code = code.replace(stateOld, stateNew);

// Add peopleCount to API payload
const apiOld = `        body: JSON.stringify({
          userRequest: fullPrompt,
          availableTrips: trips,
          originCity: originCity || "Unknown",
        }),`;
const apiNew = `        body: JSON.stringify({
          userRequest: fullPrompt,
          availableTrips: trips,
          originCity: originCity || "Unknown",
          peopleCount: peopleCount,
        }),`;
code = code.replace(apiOld, apiNew);

// Modify grid layout and add input
const gridOld = `              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Destination / Prompt */}
                <div className="md:col-span-5 bg-gray-50 border-4 border-[#0A0A0A] rounded-2xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] focus-within:bg-white focus-within:ring-4 focus-within:ring-yellow-300 transition-all">`;

const gridNew = `              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Destination / Prompt */}
                <div className="md:col-span-4 bg-gray-50 border-4 border-[#0A0A0A] rounded-2xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] focus-within:bg-white focus-within:ring-4 focus-within:ring-yellow-300 transition-all">`;
code = code.replace(gridOld, gridNew);

const datesOld = `{/* Dates */}
                <div className="md:col-span-4 bg-gray-50 border-4 border-[#0A0A0A] rounded-2xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] focus-within:bg-white transition-all">`;
const datesNew = `{/* Dates */}
                <div className="md:col-span-4 bg-gray-50 border-4 border-[#0A0A0A] rounded-2xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] focus-within:bg-white transition-all">`;
code = code.replace(datesOld, datesNew);

const budgetOld = `{/* Budget */}
                <div className="md:col-span-3 bg-gray-50 border-4 border-[#0A0A0A] rounded-2xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] focus-within:bg-white transition-all">`;
const budgetNew = `{/* People */}
                <div className="md:col-span-2 bg-gray-50 border-4 border-[#0A0A0A] rounded-2xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] focus-within:bg-white transition-all">
                  <input type="number" min="1" value={peopleCount} onChange={(e) => setPeopleCount(Number(e.target.value))} className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#0A0A0A]" placeholder="No. of People" />
                </div>
                {/* Budget */}
                <div className="md:col-span-2 bg-gray-50 border-4 border-[#0A0A0A] rounded-2xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] focus-within:bg-white transition-all">`;
code = code.replace(budgetOld, budgetNew);

fs.writeFileSync('src/pages/Home.tsx', code);
