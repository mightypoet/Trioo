import { Wallet as WalletIcon, TrendingUp, Target, Award, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

const SAVINGS_DATA = [
  { name: 'Jan', amount: 15000 },
  { name: 'Feb', amount: 28000 },
  { name: 'Mar', amount: 45000 },
  { name: 'Apr', amount: 52000 },
  { name: 'May', amount: 68000 },
  { name: 'Jun', amount: 82000 },
];

export default function Wallet() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">My Trioo Wallet</h1>
        <p className="text-gray-500 text-lg">Manage your savings, track goals, and view rewards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Balance Card */}
        <div className="lg:col-span-2 clay-card p-8 bg-gradient-to-br from-primary/5 to-purple/5 border border-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <p className="text-gray-500 font-medium mb-1 flex items-center gap-2">
                <WalletIcon className="w-4 h-4" /> Available Balance
              </p>
              <h2 className="text-5xl font-bold tracking-tight text-gray-900">₹82,000</h2>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="clay-btn-primary flex-1 md:flex-none px-6 py-3 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Money
              </button>
              <button className="clay-btn-white flex-1 md:flex-none px-6 py-3">
                Withdraw
              </button>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SAVINGS_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Saved']}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Goals & Rewards */}
        <div className="space-y-8">
          {/* Active Goal */}
          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" /> Active Goal
              </h3>
              <button className="text-primary text-sm font-semibold">Edit</button>
            </div>
            
            <div className="mb-4">
              <p className="font-semibold text-gray-900 mb-1">Japan Trip 2026</p>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>₹82,000 saved</span>
                <span>Goal: ₹2,50,000</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '32.8%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-accent rounded-full"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 bg-gray-50 p-3 rounded-xl">Auto-saving ₹15,000/month. Estimated completion: Jan 2027.</p>
          </div>

          {/* Rewards */}
          <div className="clay-card p-6">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-pink" /> Rewards Hub
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-xl">🪙</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Trioo Coins</p>
                    <p className="font-bold">2,450</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink/10 flex items-center justify-center">
                    <span className="text-xl">📸</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Creator Cashback</p>
                    <p className="font-bold">₹4,500</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions / Upcoming Trips */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
        <div className="clay-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-6 font-medium text-sm text-gray-500">Description</th>
                <th className="py-4 px-6 font-medium text-sm text-gray-500">Date</th>
                <th className="py-4 px-6 font-medium text-sm text-gray-500">Status</th>
                <th className="py-4 px-6 font-medium text-sm text-gray-500 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                { desc: 'Monthly Auto-Save (Japan)', date: 'Jul 01, 2026', status: 'Completed', amount: '+₹15,000', type: 'in' },
                { desc: 'Creator Reel Cashback', date: 'Jun 28, 2026', status: 'Completed', amount: '+₹2,500', type: 'in' },
                { desc: 'Flight Booking (Goa)', date: 'Jun 15, 2026', status: 'Completed', amount: '-₹12,400', type: 'out' },
                { desc: 'Wallet Deposit', date: 'Jun 01, 2026', status: 'Completed', amount: '+₹15,000', type: 'in' },
              ].map((tx, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium">{tx.desc}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{tx.date}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" /> {tx.status}
                    </span>
                  </td>
                  <td className={`py-4 px-6 text-right font-bold ${tx.type === 'in' ? 'text-success' : 'text-gray-900'}`}>
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
