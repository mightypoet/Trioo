const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("import { AuthProvider } from './contexts/AuthContext';", "import { AuthProvider } from './contexts/AuthContext';\nimport { LocationProvider } from './contexts/LocationContext';");
code = code.replace("<AuthProvider>", "<AuthProvider>\n      <LocationProvider>");
code = code.replace("</AuthProvider>", "</LocationProvider>\n    </AuthProvider>");
fs.writeFileSync('src/App.tsx', code);
