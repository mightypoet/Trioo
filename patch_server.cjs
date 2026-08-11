const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `  // Vite middleware for development`;

const flightsApi = `  app.get('/api/flights', async (req, res) => {
    const { dep_iata } = req.query;
    const apiKey = process.env.AVIATIONSTACK_API_KEY || process.env.VITE_AVIATIONSTACK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Aviationstack API key not configured' });
    }
    try {
      const response = await fetch(\`http://api.aviationstack.com/v1/flights?access_key=\${apiKey}&dep_iata=\${dep_iata || 'DEL'}&limit=10\`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ error: 'Failed to fetch flights' });
    }
  });

  // Vite middleware for development`;

code = code.replace(target, flightsApi);
fs.writeFileSync('server.ts', code);
