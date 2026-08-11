const fs = require('fs');
let code = fs.readFileSync('src/pages/GoSolo.tsx', 'utf8');

const targetStr = `  const searchFlights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originIata) return;
    setLoadingFlights(true);
    setErrorFlights('');
    try {
      const res = await fetch(\`/api/flights?dep_iata=\${encodeURIComponent(originIata)}\`);
      const contentType = res.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please check server/API setup.");
      }
      
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || data.error || "Failed to load flights.");
      }
      
      setFlights(data.data || []);
    } catch (error: any) {
      console.error("Flight Search Error:", error);
      setErrorFlights(error.message || "Unable to fetch live flight data.");
      setFlights([]);
    } finally {
      setLoadingFlights(false);
    }
  };`;

const newStr = `  const searchFlights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originIata) return;
    setLoadingFlights(true);
    setErrorFlights('');
    
    try {
      const apiKey = import.meta.env.VITE_AVIATIONSTACK_API_KEY;
      if (!apiKey) {
        throw new Error("Aviationstack API key is missing. Ensure VITE_AVIATIONSTACK_API_KEY is set in your environment.");
      }

      // 1. Aviationstack requires a 3-letter IATA code, NOT a full city name.
      let iataCode = originIata.toUpperCase().trim();
      // Quick fallback for testing common inputs
      if (iataCode === 'DELHI') iataCode = 'DEL';
      if (iataCode === 'KOLKATA') iataCode = 'CCU';
      if (iataCode === 'MUMBAI') iataCode = 'BOM';
      
      // 2. We use allorigins as a proxy to bypass the HTTPS Mixed Content block on the free Aviationstack tier
      const targetUrl = encodeURIComponent(\`http://api.aviationstack.com/v1/flights?access_key=\${apiKey}&dep_iata=\${iataCode}&limit=10\`);
      const proxyUrl = \`https://api.allorigins.win/get?url=\${targetUrl}\`;

      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Network response was not ok");

      const proxyData = await res.json();
      
      // allorigins returns the actual JSON string inside the \`contents\` property
      const data = JSON.parse(proxyData.contents);

      if (data.error) {
        throw new Error(data.error.message || data.error.info || "Aviationstack API Error");
      }
      
      if (!data.data || data.data.length === 0) {
          throw new Error(\`No active flights found departing from \${iataCode}. Check if the 3-letter IATA code is correct.\`);
      }

      setFlights(data.data || []);
    } catch (error: any) {
      console.error("Flight Search Error:", error);
      setErrorFlights(error.message || "Unable to fetch live flight data. Please try again.");
      setFlights([]);
    } finally {
      setLoadingFlights(false);
    }
  };`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/pages/GoSolo.tsx', code);
