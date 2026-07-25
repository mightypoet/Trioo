import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div 
      className="min-h-screen flex flex-col relative bg-[var(--color-bg)]"
    >
      <Navbar />
      <main className="flex-grow pt-24 relative z-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
