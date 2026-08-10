const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Fix imports
code = code.replace(
  /import \{ Search, MapPin, Calendar, Users, ArrowRight, Star, Wallet, PlayCircle, Zap, Map, ShieldCheck, Quote, ExternalLink, IndianRupee, Car, Train, Walking, CheckCircle2, Home \} from 'lucide-react';/,
  "import { Search, MapPin, Calendar, Users, ArrowRight, Star, Wallet, PlayCircle, Zap, Map, ShieldCheck, Quote, ExternalLink, IndianRupee, CheckCircle2, Home as HomeIcon, Flame } from 'lucide-react';"
);

// Fix Home icon usage in budgetBreakdown array
code = code.replace(
  /\{ label: 'Accommodation', value: plan\.budgetBreakdown\.accommodation, icon: Home \},/,
  "{ label: 'Accommodation', value: plan.budgetBreakdown.accommodation, icon: HomeIcon },"
);

fs.writeFileSync('src/pages/Home.tsx', code);
