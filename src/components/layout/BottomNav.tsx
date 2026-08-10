import { Home, Search, Flame, Wallet, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const { user, requireAuth } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Search', icon: Search, path: '/search' },
    { name: 'Feed', icon: Flame, path: '/feed' },
    { name: 'Wallet', icon: Wallet, path: '/wallet' },
    { name: 'Profile', isProfile: true, path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 bg-[#121212] rounded-full p-2 shadow-xl border border-white/10">
      <div className="flex justify-around items-center w-full h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name}
              to={item.path} 
              onClick={(e) => {
                if (item.isProfile) {
                  e.preventDefault();
                  requireAuth(() => navigate(item.path));
                }
              }}
              className="relative flex flex-col items-center justify-center w-16 h-12 rounded-full"
            >
              {isActive && (
                <div className="absolute inset-0 bg-[#2A2A2A] rounded-full transition-all duration-300" />
              )}
              
              <div className="relative z-10 flex items-center justify-center">
                {item.isProfile ? (
                  <div className="relative">
                    <div className={cn(
                      "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 transition-all",
                      isActive && "border-2 border-white"
                    )}>
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-[#121212]" strokeWidth={2} />
                      )}
                    </div>
                    {/* Fake notification dot for Instagram look */}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#121212]" />
                  </div>
                ) : (
                  item.icon && <item.icon className={cn("w-6 h-6 transition-all text-white", isActive && "fill-white")} strokeWidth={isActive ? 2.5 : 2} />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
