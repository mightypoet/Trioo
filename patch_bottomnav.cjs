const fs = require('fs');
let code = fs.readFileSync('src/components/layout/BottomNav.tsx', 'utf8');

code = code.replace(
  /import \{ Link, useLocation \} from 'react-router-dom';/,
  "import { Link, useLocation, useNavigate } from 'react-router-dom';"
);

code = code.replace(
  /const \{ user \} = useAuth\(\);/,
  "const { user, requireAuth } = useAuth();\n  const navigate = useNavigate();"
);

code = code.replace(
  /<Link \s*key=\{item\.name\}\s*to=\{item\.path\}/,
  `<Link 
              key={item.name}
              to={item.path} 
              onClick={(e) => {
                if (item.isProfile) {
                  e.preventDefault();
                  requireAuth(() => navigate(item.path));
                }
              }}`
);

fs.writeFileSync('src/components/layout/BottomNav.tsx', code);
