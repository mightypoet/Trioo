const fs = require('fs');

let content = fs.readFileSync('src/pages/Tripboards.tsx', 'utf8');

// Insert imports
const importAuth = `import { useLocation } from 'react-router-dom';\n`;
content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate, useLocation } from 'react-router-dom';\n");

// Insert hooks
const hookStr = `  const [activeCategory, setActiveCategory] = useState("All");\n  const { requireAuth, setAuthModalOpen } = useAuth();\n  const navigate = useNavigate();\n  const location = useLocation();\n\n  React.useEffect(() => {\n    const params = new URLSearchParams(location.search);\n    if (params.get('login') === 'required') {\n      setAuthModalOpen(true);\n    }\n  }, [location, setAuthModalOpen]);\n`;
content = content.replace('  const [activeCategory, setActiveCategory] = useState("All");\n  const { requireAuth } = useAuth();\n  const navigate = useNavigate();\n', hookStr);

fs.writeFileSync('src/pages/Tripboards.tsx', content);
console.log("Patched Tripboards.tsx");
