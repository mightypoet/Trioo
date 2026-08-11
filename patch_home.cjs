const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!code.includes("useLocationContext")) {
  code = code.replace("import { getTripImageUrl } from '../lib/utils';", "import { getTripImageUrl } from '../lib/utils';\nimport { useLocationContext } from '../contexts/LocationContext';");
}

const setupVars = `  const { user } = useAuth();`;
if (code.includes(setupVars) && !code.includes("useLocationContext()")) {
  code = code.replace(setupVars, `  const { user } = useAuth();\n  const { userLocation, requestUserLocation, isLoadingLocation } = useLocationContext();`);
}

const generatePlanOriginal = `  const generatePlan = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoadingPlan(true);
    setPlan(null);
    setTripDetails(null);

    const fullPrompt = \`\${queryText}. \${startDate && endDate ? 'Dates: ' + startDate + ' to ' + endDate + '.' : ''} \${budget ? 'Budget: ' + budget + '.' : ''}\`;

    try {
      const { data: trips, error } = await supabase.from('trips').select('*, agencies(name)');
      if (error) throw error;`;

const generatePlanNew = `  const generatePlan = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoadingPlan(true);
    setPlan(null);
    setTripDetails(null);

    let originCity = userLocation;
    if (!originCity) {
      originCity = await requestUserLocation();
    }

    const fullPrompt = \`\${queryText}. \${startDate && endDate ? 'Dates: ' + startDate + ' to ' + endDate + '.' : ''} \${budget ? 'Budget: ' + budget + '.' : ''}\`;

    try {
      const { data: trips, error } = await supabase.from('trips').select('*, agencies(name)');
      if (error) throw error;`;

code = code.replace(generatePlanOriginal, generatePlanNew);

const generatePlanBodyOriginal = `        body: JSON.stringify({
          userRequest: fullPrompt,
          availableTrips: trips,
        }),`;
        
const generatePlanBodyNew = `        body: JSON.stringify({
          userRequest: fullPrompt,
          availableTrips: trips,
          originCity: originCity || "Unknown",
        }),`;

code = code.replace(generatePlanBodyOriginal, generatePlanBodyNew);

fs.writeFileSync('src/pages/Home.tsx', code);
