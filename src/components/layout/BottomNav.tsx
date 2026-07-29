import { Home, Search, Flame, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Search', icon: Search, path: '/search' },
    { name: 'Feed', icon: Flame, path: '/feed' },
    { name: 'Wallet', icon: Wallet, path: '/wallet' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-white/70 backdrop-blur-xl border-t-4 border-[#0A0A0A] pb-safe" style={{ boxShadow: '0 -4px 0px 0px rgba(10, 10, 10, 1)' }}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name}
              to={item.path} 
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-all duration-200",
                isActive ? "text-[var(--color-primary)]" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
