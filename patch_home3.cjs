const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetStr = `  const { userLocation, requestUserLocation, isLoadingLocation } = useLocationContext();`;

const replacement = `  const { userLocation, requestUserLocation, isLoadingLocation } = useLocationContext();

  useEffect(() => {
    if (!userLocation) {
      requestUserLocation();
    }
  }, []);`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/pages/Home.tsx', code);
