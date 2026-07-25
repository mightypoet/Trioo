import { Compass, Twitter, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white/40 backdrop-blur-xl border-t border-white/50 pt-16 pb-8 px-6 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--color-secondary)] via-[var(--color-purple)] to-[var(--color-pink)] flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-heading">TRAVY</span>
          </Link>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            Travel Together. Travel Smarter. The modern marketplace for verified travel agencies and unforgettable experiences.
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:text-pink hover:bg-pink-50 transition-colors">
              <Instagram className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Facebook className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 font-heading text-lg">Explore</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link to="/search?theme=luxury" className="hover:text-primary transition-colors">Luxury Trips</Link></li>
            <li><Link to="/search?theme=adventure" className="hover:text-primary transition-colors">Adventure</Link></li>
            <li><Link to="/search?theme=honeymoon" className="hover:text-primary transition-colors">Honeymoon</Link></li>
            <li><Link to="/search?theme=weekend" className="hover:text-primary transition-colors">Weekend Getaways</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 font-heading text-lg">Platform</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link to="/wallet" className="hover:text-primary transition-colors">TRAVY Wallet</Link></li>
            <li><Link to="/creators" className="hover:text-primary transition-colors">Creator Rewards</Link></li>
            <li><Link to="/agencies" className="hover:text-primary transition-colors">For Agencies</Link></li>
            <li><Link to="/gift-cards" className="hover:text-primary transition-colors">Gift Cards</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 font-heading text-lg">Support</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Trust & Safety</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">© 2026 TRAVY. All rights reserved.</p>
        <div className="flex gap-4 text-sm text-gray-400">
          <span>USD ($)</span>
          <span>English (US)</span>
        </div>
      </div>
    </footer>
  );
}
