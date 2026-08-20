import { Home, Search, Compass, Wallet, User, Plane } from 'lucide-react';
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
    { name: 'Tripboards', icon: Compass, path: '/tripboards' },
    { name: 'Go Solo', icon: Plane, path: '/go-solo' },
    { name: 'Profile', isProfile: true, path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[400px] bg-[#121212]/95 backdrop-blur-xl rounded-[2rem] p-2 shadow-2xl border border-white/10">
      <div className="flex justify-between items-center w-full h-14 px-2">
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
              className="relative flex flex-col items-center justify-center w-14 h-12 rounded-full group"
            >
              {isActive && (
                <div className="absolute inset-0 bg-white/10 rounded-full transition-all duration-300" />
              )}
              
              <div className="relative z-10 flex items-center justify-center">
                {item.isProfile ? (
                  <div className="relative">
                    <div className={cn(
                      "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 transition-all",
                      isActive ? "border-2 border-white scale-110" : "scale-100 group-hover:scale-105"
                    )}>
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-[#121212]" strokeWidth={2} />
                      )}
                    </div>
                    {/* Notification dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-[#121212]" />
                  </div>
                ) : (
                  item.icon && <item.icon className={cn(
                    "w-6 h-6 transition-all text-white", 
                    isActive ? "fill-white scale-110" : "scale-100 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  )} strokeWidth={isActive ? 2.5 : 2} />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
