const fs = require('fs');
let code = fs.readFileSync('src/pages/UserProfile.tsx', 'utf8');

const targetStr = `      {/* Tabs */}`;

const walletCard = `
      {/* TRAVY Wallet & Rewards Neo-Brutalist Card */}
      <div className="bg-yellow-300 border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#0A0A0A] mb-1 flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>
              TRAVY Wallet & Rewards
            </h2>
            <p className="text-black/80 font-bold">Available Balance</p>
            <p className="text-4xl font-black text-black mt-2">₹2,500</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-bold text-gray-500 uppercase">Referral Credits</p>
              <p className="font-black text-lg">₹500</p>
            </div>
            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-bold text-gray-500 uppercase">Creator Earnings</p>
              <p className="font-black text-lg">₹4,500</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full text-left text-sm font-bold">
            <thead className="bg-gray-100 border-b-2 border-black">
              <tr>
                <th className="py-2 px-4 text-black uppercase tracking-wider">Transaction</th>
                <th className="py-2 px-4 text-black uppercase tracking-wider">Date</th>
                <th className="py-2 px-4 text-black text-right uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 border-black/10">
                <td className="py-3 px-4">Creator Reel Cashback</td>
                <td className="py-3 px-4 text-gray-600">Jun 28, 2026</td>
                <td className="py-3 px-4 text-right text-green-600">+₹2,500</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Flight Booking (Goa)</td>
                <td className="py-3 px-4 text-gray-600">Jun 15, 2026</td>
                <td className="py-3 px-4 text-right text-red-600">-₹12,400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabs */}`;

code = code.replace(targetStr, walletCard);
fs.writeFileSync('src/pages/UserProfile.tsx', code);
