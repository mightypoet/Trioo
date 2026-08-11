const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("import UserProfile from './pages/UserProfile';", "import UserProfile from './pages/UserProfile';\nimport GoSolo from './pages/GoSolo';");
code = code.replace("<Route path=\"wallet\" element={<Wallet />} />", "<Route path=\"wallet\" element={<Wallet />} />\n          <Route path=\"go-solo\" element={<GoSolo />} />");

fs.writeFileSync('src/App.tsx', code);
