const fs = require('fs');

let content = fs.readFileSync('src/pages/Tripboards.tsx', 'utf8');

// Insert imports
const importAuth = `import { useAuth } from '../contexts/AuthContext';\nimport { useNavigate } from 'react-router-dom';\n`;
content = content.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\n" + importAuth);

// Insert hooks
const hookStr = `  const [activeCategory, setActiveCategory] = useState("All");\n  const { requireAuth } = useAuth();\n  const navigate = useNavigate();\n`;
content = content.replace('  const [activeCategory, setActiveCategory] = useState("All");', hookStr);

// Replace Link with button
const oldLink = `<Link to="/create-tripboard" className="bg-[#0A0A0A] text-white px-6 py-3 rounded-xl border-4 border-[#0A0A0A] font-black hover:-translate-y-1 hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
            + Create Tripboard
          </Link>`;
          
const newBtn = `<button onClick={() => requireAuth(() => navigate('/create-tripboard'))} className="bg-[#0A0A0A] text-white px-6 py-3 rounded-xl border-4 border-[#0A0A0A] font-black hover:-translate-y-1 hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap cursor-pointer">
            + Create Tripboard
          </button>`;

content = content.replace(oldLink, newBtn);

fs.writeFileSync('src/pages/Tripboards.tsx', content);
console.log("Patched Tripboards.tsx");
