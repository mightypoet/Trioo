const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Replace LandingAuthModal import with AuthModal
code = code.replace(
  /import LandingAuthModal from '\.\.\/components\/auth\/LandingAuthModal';/,
  "import AuthModal from '../components/auth/AuthModal';\nimport { useAuth } from '../contexts/AuthContext';"
);

// Add the state and useEffect to Home component
const stateAndEffect = `
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user && !localStorage.getItem('travy_has_visited')) {
      const timer = setTimeout(() => {
        setIsWelcomeModalOpen(true);
        localStorage.setItem('travy_has_visited', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);
`;

code = code.replace(
  /export default function Home\(\) \{/,
  "export default function Home() {" + stateAndEffect
);

// Replace <LandingAuthModal /> with the new one
code = code.replace(
  /<LandingAuthModal \/>/,
  "<AuthModal isOpen={isWelcomeModalOpen} onClose={() => setIsWelcomeModalOpen(false)} />"
);

fs.writeFileSync('src/pages/Home.tsx', code);
