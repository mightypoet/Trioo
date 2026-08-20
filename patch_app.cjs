const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import Agencies from './pages/admin/Agencies';",
  "import Agencies from './pages/admin/Agencies';\nimport AdminTripboards from './pages/admin/AdminTripboards';"
);

code = code.replace(
  '<Route path="trips" element={<div><h2 className="text-2xl font-bold mb-4">Trips Management</h2><CreateTrip /></div>} />',
  '<Route path="trips" element={<div><h2 className="text-2xl font-bold mb-4">Trips Management</h2><CreateTrip /></div>} />\n          <Route path="tripboards" element={<AdminTripboards />} />'
);

fs.writeFileSync('src/App.tsx', code);
