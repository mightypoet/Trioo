const fs = require('fs');

let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldDates = `<div className="relative flex items-center gap-1 w-full bg-gray-50 border-4 border-black rounded-xl p-4 pl-12 font-bold text-base md:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:outline-none focus-within:ring-4 focus-within:ring-cyan-300 focus-within:bg-white transition-all h-full">
                  <Calendar className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={3} />
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="w-full bg-transparent border-none outline-none placeholder-gray-500 text-[#0A0A0A] uppercase" 
                  />
                  <span className="font-black text-gray-400">-</span>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="w-full bg-transparent border-none outline-none placeholder-gray-500 text-[#0A0A0A] uppercase" 
                  />
                </div>`;

const newDates = `<div className="relative flex items-center gap-1 w-full bg-gray-50 border-4 border-black rounded-xl p-4 pl-12 font-bold text-base md:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:outline-none focus-within:ring-4 focus-within:ring-cyan-300 focus-within:bg-white transition-all h-full">
                  <Calendar className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={3} />
                  <input 
                    type={startDate ? "date" : "text"}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = startDate ? "date" : "text")}
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    placeholder="Start"
                    className="w-full bg-transparent border-none outline-none placeholder-gray-500 text-[#0A0A0A] uppercase truncate min-w-0" 
                  />
                  <span className="font-black text-gray-400 shrink-0">-</span>
                  <input 
                    type={endDate ? "date" : "text"}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = endDate ? "date" : "text")}
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    placeholder="End"
                    className="w-full bg-transparent border-none outline-none placeholder-gray-500 text-[#0A0A0A] uppercase truncate min-w-0" 
                  />
                </div>`;

if (home.includes(oldDates)) {
  fs.writeFileSync('src/pages/Home.tsx', home.replace(oldDates, newDates));
  console.log('Successfully updated dates input');
} else {
  console.error('Could not find dates container block');
}
