const fs = require('fs');
let code = fs.readFileSync('src/contexts/LocationContext.tsx', 'utf8');

code = code.replace("await fetch(\\\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\\\${latitude}&lon=\\\${longitude}\\\`);", "await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);");

fs.writeFileSync('src/contexts/LocationContext.tsx', code);
