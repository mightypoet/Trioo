import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, Map, Settings, Compass, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils'; // if exists, otherwise fallback or standard className

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Agencies', path: '/admin/agencies', icon: Building2 },
  { name: 'Trips', path: '/admin/trips', icon: Map },
  { name: 'Tripboards', path: '/admin/tripboards', icon: Compass },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-20">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-[#0A0A0A] flex items-center justify-center text-white shadow-lg">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter">TRAVY ADMIN</span>
          </Link>
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                      isActive
                        ? 'bg-[var(--color-primary)] text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all w-full">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-w-0">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold">Admin Portal</h1>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
