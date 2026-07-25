import { Link } from 'react-router-dom';
import { Compass, Wallet, User, Moon, Sun, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/40 dark:border-slate-800/40 shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-secondary)] via-[var(--color-purple)] to-[var(--color-pink)] flex items-center justify-center text-white shadow-lg">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-[var(--color-text-main)]">TRAVY</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/search" className="text-text-main hover:text-primary transition-colors">Destinations</Link>
          <Link to="/search?type=packages" className="text-text-main hover:text-primary transition-colors">Packages</Link>
          <Link to="/creators" className="text-text-main hover:text-primary transition-colors">Creator Rewards</Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 flex items-center justify-center shadow-sm hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
          <Link to="/wallet" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-full shadow-sm hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">₹82,000</span>
          </Link>
          <button className="w-10 h-10 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 flex items-center justify-center shadow-sm hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <button 
            className="md:hidden w-10 h-10 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 flex items-center justify-center shadow-sm hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all"
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
          <Link to="/search?type=packages" onClick={() => setMobileMenuOpen(false)} className="text-text-main font-medium py-2 border-b border-gray-100 dark:border-slate-800">Packages</Link>
          <Link to="/creators" onClick={() => setMobileMenuOpen(false)} className="text-text-main font-medium py-2 border-b border-gray-100 dark:border-slate-800">Creator Rewards</Link>
          <Link to="/wallet" onClick={() => setMobileMenuOpen(false)} className="text-text-main font-medium py-2 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" /> Wallet (₹82,000)
          </Link>
        </div>
      )}
    </header>
  );
}
