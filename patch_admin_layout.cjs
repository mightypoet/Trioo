const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

code = code.replace(
  "{ name: 'Trips', path: '/admin/trips', icon: Map },",
  "{ name: 'Trips', path: '/admin/trips', icon: Map },\n  { name: 'Tripboards', path: '/admin/tripboards', icon: Compass },"
);

fs.writeFileSync('src/components/admin/AdminLayout.tsx', code);
