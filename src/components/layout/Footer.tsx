import { Compass, Twitter, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 px-6 mt-20 relative z-10 border-t-8 border-[#0A0A0A]" style={{ backgroundColor: '#ced8ca' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4 hover:-translate-y-1 transition-transform inline-block">
            <img src="https://omtm2jfmtp1jadq4.public.blob.vercel-storage.com/ChatGPT%20Image%20Jul%2026%2C%202026%2C%2002_44_00%20AM.png" alt="Travy Logo" className="h-32 w-auto object-contain" />
          </Link>
          <p className="text-[#0A0A0A]/80 font-medium mb-6 text-sm leading-relaxed">
            Travel Together. Travel Smarter. The modern marketplace for verified travel agencies and unforgettable experiences.
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-white border-2 border-[#0A0A0A] flex items-center justify-center text-[#0A0A0A] hover:-translate-y-1 hover:translate-x-1 transition-transform" style={{ boxShadow: '2px 2px 0px 0px rgba(10, 10, 10, 1)' }}>
              <Twitter className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border-2 border-[#0A0A0A] flex items-center justify-center text-[#0A0A0A] hover:-translate-y-1 hover:translate-x-1 transition-transform" style={{ boxShadow: '2px 2px 0px 0px rgba(10, 10, 10, 1)' }}>
              <Instagram className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border-2 border-[#0A0A0A] flex items-center justify-center text-[#0A0A0A] hover:-translate-y-1 hover:translate-x-1 transition-transform" style={{ boxShadow: '2px 2px 0px 0px rgba(10, 10, 10, 1)' }}>
              <Facebook className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="font-black text-[#0A0A0A] mb-6 font-heading text-xl">Explore</h4>
          <ul className="space-y-4 text-sm font-bold text-[#0A0A0A]/80">
            <li><Link to="/search?theme=luxury" className="hover:text-[var(--color-primary)] transition-colors">Luxury Trips</Link></li>
            <li><Link to="/search?theme=adventure" className="hover:text-[var(--color-primary)] transition-colors">Adventure</Link></li>
            <li><Link to="/search?theme=honeymoon" className="hover:text-[var(--color-primary)] transition-colors">Honeymoon</Link></li>
            <li><Link to="/search?theme=weekend" className="hover:text-[var(--color-primary)] transition-colors">Weekend Getaways</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[#0A0A0A] mb-6 font-heading text-xl">Platform</h4>
          <ul className="space-y-4 text-sm font-bold text-[#0A0A0A]/80">
            <li><Link to="/wallet" className="hover:text-[var(--color-primary)] transition-colors">TRAVY Wallet</Link></li>
            <li><Link to="/creators" className="hover:text-[var(--color-primary)] transition-colors">Creator Rewards</Link></li>
            <li><Link to="/agencies" className="hover:text-[var(--color-primary)] transition-colors">For Agencies</Link></li>
            <li><Link to="/gift-cards" className="hover:text-[var(--color-primary)] transition-colors">Gift Cards</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[#0A0A0A] mb-6 font-heading text-xl">Support</h4>
          <ul className="space-y-4 text-sm font-bold text-[#0A0A0A]/80">
            <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Trust & Safety</a></li>
            <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t-4 border-[#0A0A0A] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[#0A0A0A] font-bold text-sm">© 2026 TRAVY. All rights reserved.</p>
        <div className="flex gap-4 text-sm font-bold text-[#0A0A0A]">
          <span>USD ($)</span>
          <span>English (US)</span>
        </div>
      </div>
    </footer>
  );
}
