const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

code = code.replace("import { Compass, Wallet, User, Moon, Sun, Menu, X } from 'lucide-react';", "import { Compass, Wallet, User, Moon, Sun, Menu, X, MapPin, Loader2 } from 'lucide-react';");

code = code.replace("import { useAuth } from '../../contexts/AuthContext';", "import { useAuth } from '../../contexts/AuthContext';\nimport { useLocationContext } from '../../contexts/LocationContext';");

const userContextStr = `  const { user, requireAuth } = useAuth();`;
const locationContextStr = `  const { user, requireAuth } = useAuth();\n  const { userLocation, isLoadingLocation, requestUserLocation } = useLocationContext();`;
code = code.replace(userContextStr, locationContextStr);

const originalLinksStr = `        <nav className="hidden md:flex items-center gap-8 font-bold text-lg">
          <Link to="/search" className="text-[#0A0A0A] hover:-translate-y-1 hover:text-[var(--color-primary)] transition-all">Destinations</Link>
          <Link to="/creators" className="text-[#0A0A0A] hover:-translate-y-1 hover:text-[var(--color-primary)] transition-all">Creator Rewards</Link>
        </nav>`;
        
const locBtn = `
          <button
            onClick={requestUserLocation}
            className="hidden lg:flex items-center gap-2 bg-cyan-200 border-2 border-[#0A0A0A] px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-300 font-bold text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0A0A0A]" />
            ) : (
              <MapPin className="w-4 h-4 text-[#0A0A0A]" />
            )}
            <span className="text-[#0A0A0A]">{userLocation ? userLocation : "Set Location"}</span>
          </button>`;

code = code.replace(originalLinksStr, originalLinksStr + locBtn);

const walletBtn = `<Link to="/wallet" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border-4 border-[#0A0A0A] rounded-full transition-all hover:-translate-y-1 hover:translate-x-1" style={{ boxShadow: '4px 4px 0px 0px rgba(10, 10, 10, 1)' }}>`;

const walletReplacement = `
          <button
            onClick={requestUserLocation}
            className="lg:hidden flex items-center justify-center w-10 h-10 bg-cyan-200 border-4 border-[#0A0A0A] rounded-full shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:bg-cyan-300 font-bold text-sm cursor-pointer transition-all hover:-translate-y-1 hover:translate-x-1"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0A0A0A]" />
            ) : (
              <MapPin className="w-4 h-4 text-[#0A0A0A]" />
            )}
          </button>
          ` + walletBtn;

code = code.replace(walletBtn, walletReplacement);

fs.writeFileSync('src/components/layout/Navbar.tsx', code);
