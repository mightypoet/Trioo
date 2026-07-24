import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative bg-[var(--color-bg)]">
      {/* Frosted Glass Background Blobs */}
      <div className="fixed top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[var(--color-secondary)]/20 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[var(--color-pink)]/20 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-[300px] h-[300px] bg-[var(--color-accent)]/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

      <Navbar />
      <main className="flex-grow pt-24 relative z-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
