const fs = require('fs');

// 1. BottomNav.tsx
let bottomNav = fs.readFileSync('src/components/layout/BottomNav.tsx', 'utf8');
bottomNav = bottomNav.replace("import { Home, Search, Flame, Wallet, User, Plane } from 'lucide-react';", "import { Home, Search, Compass, Wallet, User, Plane } from 'lucide-react';");
bottomNav = bottomNav.replace("{ name: 'Feed', icon: Flame, path: '/feed' },", "{ name: 'Tripboards', icon: Compass, path: '/tripboards' },");
fs.writeFileSync('src/components/layout/BottomNav.tsx', bottomNav);

// 2. Navbar.tsx
// It doesn't seem to have a Feed link directly in the code output I saw, let's check it.
let navbar = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
if (navbar.includes('to="/feed"')) {
    navbar = navbar.replace('to="/feed"', 'to="/tripboards"').replace('>Feed<', '>Tripboards<');
}
fs.writeFileSync('src/components/layout/Navbar.tsx', navbar);

// 3. App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace("import Feed from './pages/Feed';", "import Tripboards from './pages/Tripboards';\nimport TripboardDetail from './pages/TripboardDetail';\nimport CreateTripboard from './pages/CreateTripboard';");
app = app.replace('<Route path="feed" element={<Feed />} />', '<Route path="tripboards" element={<Tripboards />} />\n          <Route path="tripboards/:id" element={<TripboardDetail />} />\n          <Route path="create-tripboard" element={<CreateTripboard />} />');
fs.writeFileSync('src/App.tsx', app);
