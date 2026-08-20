const fs = require('fs');
let navbar = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
if (!navbar.includes('to="/tripboards"')) {
    navbar = navbar.replace(
        '<Link to="/search" className="text-[#0A0A0A] hover:-translate-y-1 hover:text-[var(--color-primary)] transition-all">Destinations</Link>',
        '<Link to="/search" className="text-[#0A0A0A] hover:-translate-y-1 hover:text-[var(--color-primary)] transition-all">Destinations</Link>\n          <Link to="/tripboards" className="text-[#0A0A0A] hover:-translate-y-1 hover:text-[var(--color-primary)] transition-all font-black flex items-center gap-1"><Compass className="w-4 h-4"/>Tripboards</Link>'
    );
    navbar = navbar.replace(
        '<Link to="/search" onClick={() => setMobileMenuOpen(false)} className="text-text-main font-medium py-2 border-b border-gray-100 dark:border-slate-800">Destinations</Link>',
        '<Link to="/search" onClick={() => setMobileMenuOpen(false)} className="text-text-main font-medium py-2 border-b border-gray-100 dark:border-slate-800">Destinations</Link>\n          <Link to="/tripboards" onClick={() => setMobileMenuOpen(false)} className="text-text-main font-bold py-2 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2"><Compass className="w-4 h-4"/>Tripboards</Link>'
    );
    fs.writeFileSync('src/components/layout/Navbar.tsx', navbar);
}
