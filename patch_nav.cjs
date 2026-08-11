const fs = require('fs');
let code = fs.readFileSync('src/components/layout/BottomNav.tsx', 'utf8');
code = code.replace("Home, Search, Flame, Wallet, User", "Home, Search, Flame, Wallet, User, Plane");
code = code.replace("{ name: 'Wallet', icon: Wallet, path: '/wallet' }", "{ name: 'Go Solo', icon: Plane, path: '/go-solo' }");
fs.writeFileSync('src/components/layout/BottomNav.tsx', code);

let navbar = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
navbar = navbar.replace("Compass, Wallet, User, Moon, Sun, Menu, X, MapPin, Loader2", "Compass, Wallet, User, Moon, Sun, Menu, X, MapPin, Loader2, Plane");
const oldWalletLink = `<Link to="/wallet" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border-4 border-[#0A0A0A] rounded-full transition-all hover:-translate-y-1 hover:translate-x-1" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}>
            <Wallet className="w-4 h-4 text-[#0A0A0A]" />
            {user && <span className="font-semibold text-sm text-[#0A0A0A]">₹500</span>}
          </Link>`;
const newGoSoloLink = `<Link to="/go-solo" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-yellow-300 border-4 border-[#0A0A0A] rounded-full transition-all hover:-translate-y-1 hover:translate-x-1" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}>
            <Plane className="w-4 h-4 text-[#0A0A0A]" />
            <span className="font-bold text-sm text-[#0A0A0A]">Go Solo</span>
          </Link>`;
navbar = navbar.replace(oldWalletLink, newGoSoloLink);

const oldMobileWallet = `<Link to="/wallet" onClick={() => setMobileMenuOpen(false)} className="text-text-main font-medium py-2 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" /> Wallet {user && "(₹500)"}
          </Link>`;
const newMobileGoSolo = `<Link to="/go-solo" onClick={() => setMobileMenuOpen(false)} className="text-text-main font-medium py-2 flex items-center gap-2">
            <Plane className="w-4 h-4 text-primary" /> Go Solo
          </Link>`;
navbar = navbar.replace(oldMobileWallet, newMobileGoSolo);

fs.writeFileSync('src/components/layout/Navbar.tsx', navbar);
