import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, CreditCard, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { id: packageId } = useParams();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [pkg, setPkg] = useState<any>(null);
  
  const [travelDate, setTravelDate] = useState('');
  const [travelerCount, setTravelerCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*, trips(*)')
        .eq('id', packageId)
        .single();
      if (data) {
        setPkg(data);
      }
      setLoading(false);
    };
    if (packageId) fetchPackage();
  }, [packageId]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };
  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    if (!pkg || !user) return;
    setIsSubmitting(true);
    
    try {
      const totalPrice = pkg.price * travelerCount; // Basic calc
      
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        package_id: pkg.id,
        agency_id: pkg.trips.agency_id,
        travel_date: travelDate || new Date().toISOString().split('T')[0], // fallback if empty
        traveler_count: travelerCount,
        status: 'confirmed', // Demo auto confirm
        total_price: totalPrice
      });

      if (error) throw error;
      
      alert('Booking Confirmed successfully!');
      navigate('/wallet'); // Redirect to wallet/dashboard after booking
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error creating booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Details', icon: User },
    { num: 2, title: 'Add-ons', icon: Shield },
    { num: 3, title: 'Payment', icon: CreditCard },
  ];
  
  if (loading) return <div className="p-12 text-center">Loading Booking Flow...</div>;
  if (!pkg) return <div className="p-12 text-center text-red-500">Package not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-500" 
            style={{ width: `${((step - 1) / 2) * 100}%` }} 
          />
          
          {steps.map((s) => {
            const isActive = s.num === step;
            const isPast = s.num < step;
            const Icon = s.icon;
            
            return (
              <div key={s.num} className="flex flex-col items-center gap-2 bg-bg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 
                  isPast ? 'bg-success text-white' : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}>
                  {isPast ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-sm font-bold ${isActive ? 'text-primary' : isPast ? 'text-success' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="clay-card p-8 md:p-12 min-h-[400px]">
        <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <h3 className="font-bold text-gray-900">{pkg.trips?.title} - {pkg.tier_name}</h3>
          <p className="text-gray-500 text-sm">Base Price: ₹{pkg.price.toLocaleString()} per person</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold mb-6">Travel Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Travel Date</label>
                  <input 
                    type="date" 
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:bg-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Number of Travelers</label>
                  <input 
                    type="number" 
                    min="1"
                    value={travelerCount}
                    onChange={(e) => setTravelerCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:bg-white transition-colors" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" defaultValue={user?.email || ''} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:bg-white transition-colors opacity-70" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold mb-6">Enhance Your Trip</h2>
              <div className="space-y-4">
                {[
                  { title: 'Premium Travel Insurance', desc: 'Medical, cancellation & baggage cover.', price: '₹2,500' },
                  { title: 'Airport VIP Transfer', desc: 'Luxury sedan waiting at arrivals.', price: '₹4,000' },
                  { title: 'Flexi-Cancellation', desc: 'Cancel up to 24h before departure.', price: '₹1,500' },
                ].map((addon, i) => (
                  <label key={i} className="flex items-start gap-4 p-4 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors bg-white">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{addon.title}</p>
                      <p className="text-sm text-gray-500">{addon.desc}</p>
                    </div>
                    <span className="font-bold text-primary">{addon.price}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold mb-6">Complete Payment</h2>
              
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 font-bold mb-1">Total Amount (for {travelerCount} travelers)</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(pkg.price * travelerCount).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-bold text-gray-700">Payment Methods</p>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border-2 border-gray-200 rounded-xl font-bold text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors">
                    Credit Card
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-xl font-bold text-primary border-primary/50 bg-primary/5 transition-colors">
                    Pay via Wallet
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-12 flex justify-between items-center pt-6 border-t border-gray-100">
          <button 
            onClick={handlePrev}
            className={`font-bold flex items-center gap-2 px-4 py-2 ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          
          <button 
            onClick={step === 3 ? handleComplete : handleNext}
            disabled={isSubmitting}
            className="clay-btn-primary px-8 py-4 flex items-center gap-2 text-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : step === 3 ? 'Confirm Booking' : 'Continue'} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
