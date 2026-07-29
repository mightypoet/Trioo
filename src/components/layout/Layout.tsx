import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div 
      className="min-h-screen flex flex-col relative bg-[var(--color-bg)] overflow-x-hidden pb-16 md:pb-0"
    >
      <div className="hidden md:block">
        <Navbar />
      </div>
      <main className="flex-grow pt-8 md:pt-24 relative z-0 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
