const fs = require('fs');

let content = fs.readFileSync('src/pages/CreateTripboard.tsx', 'utf8');

// Insert imports
const importAuth = `import { useAuth } from '../contexts/AuthContext';\nimport { useNavigate } from 'react-router-dom';\n`;
content = content.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\n" + importAuth);

// Insert useEffect
const hookStr = `  const [step, setStep] = useState(1);\n  const { user, loading } = useAuth();\n  const navigate = useNavigate();\n\n  React.useEffect(() => {\n    if (!loading && !user) {\n      navigate('/tripboards?login=required');\n    }\n  }, [user, loading, navigate]);\n`;
content = content.replace("  const [step, setStep] = useState(1);", hookStr);

fs.writeFileSync('src/pages/CreateTripboard.tsx', content);
console.log("Patched CreateTripboard.tsx");
