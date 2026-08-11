const fs = require('fs');
let code = fs.readFileSync('src/contexts/LocationContext.tsx', 'utf8');
code = code.replace("console.error('Error getting location from browser:', error.message || error);", "console.warn('Geolocation access denied or failed:', error.message || error);");
fs.writeFileSync('src/contexts/LocationContext.tsx', code);
