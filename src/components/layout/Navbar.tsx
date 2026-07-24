import { Link } from 'react-router-dom';
import { Compass, Wallet, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-secondary)] via-[var(--color-purple)] to-[var(--color-pink)] flex items-center justify-center text-white shadow-lg">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-[var(--color-text-main)]">TRIOO</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/search" className="text-text-main hover:text-primary transition-colors">Destinations</Link>
          <Link to="/search?type=packages" className="text-text-main hover:text-primary transition-colors">Packages</Link>
          <Link to="/creators" className="text-text-main hover:text-primary transition-colors">Creator Rewards</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/wallet" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 rounded-full shadow-sm hover:bg-white/80 transition-all">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">₹82,000</span>
          </Link>
          <button className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-sm hover:bg-white/80 transition-all">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
