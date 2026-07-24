import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, CheckCircle2, Shield, Calendar, Users, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  
  // Mock data for display
  const pkg = {
    title: 'Kyoto Cherry Blossom Special',
    agency: 'Zen Tours',
    duration: '7 Days / 6 Nights',
    rating: 4.9,
    reviews: 128,
    price: 85000,
    originalPrice: 95000,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524413840845-31a8bc58b29f?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Experience the magic of Japan during the Sakura season. This premium package takes you through the historic temples of Kyoto, the bustling streets of Tokyo, and serene bamboo forests.',
    includes: ['4-Star Hotel Accommodation', 'Daily Breakfast', 'Bullet Train Passes', 'English Speaking Guide', 'Airport Transfers'],
    excludes: ['International Flights', 'Visa Fees', 'Lunch & Dinner', 'Personal Expenses']
  };

  const handleBook = () => {
    requireAuth(() => {
      navigate(`/book/${id}`);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium">
        <ChevronLeft className="w-5 h-5" /> Back to Search
      </button>

      {/* Title & Meta */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase mb-2">
          <MapPin className="w-4 h-4" /> Japan • By {pkg.agency}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{pkg.title}</h1>
        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-600">
          <span className="flex items-center gap-1.5"><Star className="w-5 h-5 text-accent fill-accent" /> {pkg.rating} ({pkg.reviews} reviews)</span>
          <span className="flex items-center gap-1.5"><Clock className="w-5 h-5 text-gray-400" /> {pkg.duration}</span>
          <span className="flex items-center gap-1.5"><Shield className="w-5 h-5 text-success" /> Verified Agency</span>
        </div>
      </div>

      {/* Gallery Grid (Simple layout for now instead of full carousel to save space) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px] mb-12 rounded-[2rem] overflow-hidden">
        <div className="md:col-span-3 h-full">
          <img src={pkg.images[0]} alt="Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="hidden md:flex flex-col gap-4 h-full">
          <img src={pkg.images[1]} alt="Gallery 1" className="w-full h-1/2 object-cover hover:scale-105 transition-transform duration-700" />
          <img src={pkg.images[2]} alt="Gallery 2" className="w-full h-1/2 object-cover hover:scale-105 transition-transform duration-700" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">About this trip</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{pkg.description}</p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <section className="clay-card p-6 bg-success/5 border border-success/10 shadow-none">
              <h3 className="text-lg font-bold mb-4 text-success flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> What's Included
              </h3>
              <ul className="space-y-3">
                {pkg.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="clay-card p-6 bg-red-50 border border-red-100 shadow-none">
              <h3 className="text-lg font-bold mb-4 text-red-500 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center text-xs">✕</span> What's Excluded
              </h3>
              <ul className="space-y-3">
                {pkg.excludes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
            <div className="space-y-6">
              {[1, 2, 3].map((day) => (
                <div key={day} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                      D{day}
                    </div>
                    {day !== 3 && <div className="w-px h-full bg-gray-200 my-2" />}
                  </div>
                  <div className="clay-card p-6 flex-1 mb-4 shadow-sm border border-gray-100">
                    <h4 className="font-bold text-lg mb-2">Arrival & Check-in</h4>
                    <p className="text-gray-500 text-sm">Transfer from airport to hotel. Evening at leisure to explore the local markets.</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-32 clay-card p-8 border border-gray-100">
            <div className="mb-6 flex items-end gap-3">
              <span className="text-4xl font-bold text-gray-900">₹{pkg.price.toLocaleString()}</span>
              <span className="text-gray-400 line-through font-medium mb-1">₹{pkg.originalPrice.toLocaleString()}</span>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Select Dates</p>
                  <p className="font-medium text-gray-900 text-sm">Add travel dates</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50">
                <Users className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Travelers</p>
                  <p className="font-medium text-gray-900 text-sm">2 Adults</p>
                </div>
              </div>
            </div>

            <button onClick={handleBook} className="clay-btn-primary w-full py-4 text-lg mb-4">
              Book Now
            </button>
            <p className="text-center text-sm text-gray-500 font-medium">You won't be charged yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
