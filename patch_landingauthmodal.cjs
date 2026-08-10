const fs = require('fs');
let code = fs.readFileSync('src/components/auth/LandingAuthModal.tsx', 'utf8');

code = code.replace(
  /<div className="relative w-full max-w-md bg-white\/80 backdrop-blur-2xl border border-white\/60 shadow-2xl rounded-\[32px\] p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">/,
  '<div className="relative w-full max-w-md bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">'
);

code = code.replace(
  /className="absolute top-5 right-5 p-2 text-gray-500 hover:text-gray-900 bg-white\/50 hover:bg-white rounded-full transition-colors shadow-sm"/,
  'className="absolute top-4 right-4 p-2 text-black hover:text-white bg-white border-2 border-black rounded-full hover:bg-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"'
);

code = code.replace(
  /className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-6 py-4 font-bold text-lg transition-all shadow-sm hover:shadow-md mb-4"/,
  'className="w-full flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-black border-4 border-black rounded-xl px-6 py-4 font-black text-lg transition-all hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4"'
);

fs.writeFileSync('src/components/auth/LandingAuthModal.tsx', code);
