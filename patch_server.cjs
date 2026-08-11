const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `  if (process.env.NODE_ENV !== "production") {`;

const newApi = `  app.get('/api/flights', async (req, res) => {
    try {
      const apiKey = process.env.AVIATIONSTACK_API_KEY || process.env.VITE_AVIATIONSTACK_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Aviationstack API key is missing." });
      }
      const dep_iata = (req.query.dep_iata) || 'DEL';
      const apiRes = await fetch(\`http://api.aviationstack.com/v1/flights?access_key=\${apiKey}&dep_iata=\${dep_iata}&limit=10\`);
      const contentType = apiRes.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        const text = await apiRes.text();
        return res.status(502).json({ error: "Invalid API response format from Aviationstack", details: text.substring(0, 100) });
      }

      const data = await apiRes.json();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message || "Failed to fetch flights" });
    }
  });

  if (process.env.NODE_ENV !== "production") {`;

code = code.replace(target, newApi);
fs.writeFileSync('server.ts', code);
