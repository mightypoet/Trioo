import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function GlobalAuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, signInWithGoogle } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setAuthModalOpen(false)}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-black hover:text-white bg-white border-2 border-black rounded-full hover:bg-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] border-4 border-black text-[#0A0A0A] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 12l-4-4-4 4M12 8v8"/>
          </svg>
        </div>
        
        <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-wide">Join Travy</h2>
        <p className="text-gray-600 font-medium mb-8">
          Please sign in to continue and access exclusive travel deals, save your favorites, and manage your bookings.
        </p>
        
        <button 
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-black border-4 border-black rounded-xl px-6 py-4 font-black text-lg transition-all hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
