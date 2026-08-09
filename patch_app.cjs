const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

if (!appCode.includes('AgencyDashboard')) {
  appCode = appCode.replace(
    /import AdminProtectedRoute from '\.\/components\/auth\/AdminProtectedRoute';/,
    `import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import AgencyDashboard from './pages/AgencyDashboard';`
  );

  appCode = appCode.replace(
    /<Route path="profile" element={<UserProfile \/>} \/>/,
    `<Route path="profile" element={<UserProfile />} />
          <Route path="agency-dashboard" element={<AgencyDashboard />} />`
  );

  fs.writeFileSync('src/App.tsx', appCode);
}
