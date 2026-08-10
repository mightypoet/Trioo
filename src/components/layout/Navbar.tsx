import { Link, useNavigate } from 'react-router-dom';
import { Compass, Wallet, User, Moon, Sun, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, requireAuth } = useAuth();
  const navigate = useNavigate();

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
        scrolled ? "bg-[var(--color-bg)] border-b-4 border-[#0A0A0A]" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:-translate-y-1 transition-transform">
          <img src="https://omtm2jfmtp1jadq4.public.blob.vercel-storage.com/ChatGPT%20Image%20Jul%2026%2C%202026%2C%2002_44_00%20AM.png" alt="Travy Logo" className="h-16 md:h-32 w-auto object-contain" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 font-bold text-lg">
          <Link to="/search" className="text-[#0A0A0A] hover:-translate-y-1 hover:text-[var(--color-primary)] transition-all">Destinations</Link>
          <Link to="/creators" className="text-[#0A0A0A] hover:-translate-y-1 hover:text-[var(--color-primary)] transition-all">Creator Rewards</Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <Link to="/wallet" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border-4 border-[#0A0A0A] rounded-full transition-all hover:-translate-y-1 hover:translate-x-1" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}>
            <Wallet className="w-4 h-4 text-[#0A0A0A]" />
            {user && <span className="font-semibold text-sm text-[#0A0A0A]">₹500</span>}
          </Link>
          <Link 
            to="/profile"
            className="w-10 h-10 rounded-full bg-white border-4 border-[#0A0A0A] overflow-hidden flex items-center justify-center transition-all hover:-translate-y-1 hover:translate-x-1 cursor-pointer" 
            style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}
          >
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-[#0A0A0A]" />
            )}
          </Link>
          
          <button 
            className="md:hidden w-10 h-10 rounded-full bg-white border-4 border-[#0A0A0A] flex items-center justify-center transition-all hover:-translate-y-1 hover:translate-x-1" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-gray-800 dark:text-gray-200" /> : <Menu className="w-5 h-5 text-gray-800 dark:text-gray-200" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 shadow-lg py-4 px-6 flex flex-col gap-4">
          <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="text-text-main font-medium py-2 border-b border-gray-100 dark:border-slate-800">Destinations</Link>
          <Link to="/creators" onClick={() => setMobileMenuOpen(false)} className="text-text-main font-medium py-2 border-b border-gray-100 dark:border-slate-800">Creator Rewards</Link>
          <Link to="/wallet" onClick={() => setMobileMenuOpen(false)} className="text-text-main font-medium py-2 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" /> Wallet {user && "(₹500)"}
          </Link>
        </div>
      )}
    </header>
  );
}
