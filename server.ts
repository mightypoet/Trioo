import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/plan-trip", async (req, res) => {
    try {
      const { userRequest, availableTrips, originCity, peopleCount = 2 } = req.body;

      if (!userRequest || !availableTrips) {
        return res.status(400).json({ error: "Missing userRequest or availableTrips" });
      }

      const prompt = `You are an elite AI Travel Agent. The user is planning a trip for ${peopleCount} people. You must calculate all budget estimates, hotel room requirements, and transport logistics specifically for a group of ${peopleCount}. 
Return the output in this EXACT JSON structure:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 Title",
      "description": "Detailed description of the day.",
      "googleMapsSearchLink": "https://www.google.com/maps/search/?api=1&query=Location+Name"
    }
  ],
  "budgetBreakdown": {
    "perPerson": "₹X",
    "totalGroup": "₹Y (Calculated for ${peopleCount} people)",
    "accommodation": "Estimated total for hotels",
    "food": "Estimated total for meals",
    "localTransport": "Estimated total for cabs/transit"
  },
  "hotelSuggestions": [
    {
      "name": "Hotel Name",
      "type": "Budget/Luxury/Homestay",
      "estimatedPricePerNight": "₹X",
      "searchLink": "https://www.google.com/travel/hotels?q=Hotel+Name+Destination"
    }
  ],
  "transportation": {
    "flights": "https://www.google.com/travel/flights?q=Flights+to+Destination",
    "trains": "https://www.irctc.co.in/nget/train-search",
    "localAdvice": "Short tip on getting around (e.g., Rent a Scooty, hire a private cab for 5 people)."
  }
}
Return ONLY valid, parseable JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        throw new Error("No text returned from Gemini");
      }

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("Error generating trip plan:", error);
      res.status(500).json({ error: "Failed to generate trip plan" });
    }
  });

  app.post("/api/extract-trip-data", async (req, res) => {
    try {
      const { rawDescription } = req.body;
      if (!rawDescription) {
        return res.status(400).json({ error: "Missing rawDescription" });
      }

      const prompt = `You are an expert travel data structurer for Travy. Read the raw trip description provided by the agency. Extract and format the data into this EXACT JSON structure:
{
  "food_included": boolean (true if meals are mentioned),
  "transit_included": boolean (true if flights/trains are mentioned),
  "key_features": ["Feature 1", "Feature 2", "Feature 3"] (Exactly 3 short, punchy highlights),
  "itinerary": [
    { "day": 1, "title": "Day title", "description": "Short description" }
  ]
}
Return ONLY valid, parseable JSON.

RAW TRIP DESCRIPTION:
${rawDescription}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        throw new Error("No text returned from Gemini");
      }

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("Error extracting trip data:", error);
      res.status(500).json({ error: "Failed to extract trip data" });
    }
  });

  app.get('/api/flights', async (req, res) => {
    try {
      const apiKey = process.env.AVIATIONSTACK_API_KEY || process.env.VITE_AVIATIONSTACK_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Aviationstack API key is missing." });
      }
      const dep_iata = (req.query.dep_iata) || 'DEL';
      const apiRes = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${dep_iata}&limit=10`);
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

  app.get('/api/hotels', async (req, res) => {
    try {
      const city = req.query.city || 'Goa';
      const apiKey = process.env.SCRAPE_DO_API_KEY || process.env.VITE_SCRAPE_DO_API_KEY;
      
      let hotels = [];
      
      if (apiKey) {
        try {
          const targetUrl = encodeURIComponent(`https://www.google.com/travel/search?q=hotels+in+${city}`);
          const scrapeUrl = `http://api.scrape.do/?token=${apiKey}&url=${targetUrl}&render=true`;
          
          const apiRes = await fetch(scrapeUrl);
          if (apiRes.ok) {
            // Note: Parsing Google Hotels DOM is highly volatile. 
            // We would ideally parse HTML here. For robustness in this demo, 
            // if we successfully reach the API, we will just fallback to generating 
            // context-aware mock data representing what we would have scraped.
            // If you had cheerio, you could do: const $ = cheerio.load(await apiRes.text());
          }
        } catch (e) {
          console.error("Scrape.do fetch failed:", e);
        }
      }

      // Generate dynamic mock data based on the requested city
      hotels = [
        {
          name: `The ${city} Solo Backpacker Hostel`,
          price: '₹800/night',
          rating: '4.8 ★',
          amenities: ['Free Wi-Fi', 'Solo Safety Certified', 'Lounge'],
          bookingUrl: `https://www.google.com/travel/hotels?q=${encodeURIComponent('hotels in ' + city)}`
        },
        {
          name: `${city} Zen City Boutique`,
          price: '₹2,500/night',
          rating: '4.5 ★',
          amenities: ['Breakfast Included', 'Central Location', 'Gym'],
          bookingUrl: `https://www.google.com/travel/hotels?q=${encodeURIComponent('hotels in ' + city)}`
        },
        {
          name: `Wanderer Homestay ${city}`,
          price: '₹1,200/night',
          rating: '4.9 ★',
          amenities: ['Community Events', 'Safe Zone', 'Kitchen'],
          bookingUrl: `https://www.google.com/travel/hotels?q=${encodeURIComponent('hotels in ' + city)}`
        }
      ];

      return res.json(hotels);
    } catch (err) {
      console.error('Error fetching hotels:', err);
      return res.status(500).json({ error: err.message || "Failed to fetch hotels" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
