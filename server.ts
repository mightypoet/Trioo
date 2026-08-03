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
      const { userRequest, availableTrips } = req.body;

      if (!userRequest || !availableTrips) {
        return res.status(400).json({ error: "Missing userRequest or availableTrips" });
      }

      const prompt = `You are an expert travel planner for the platform Travy. 
A user has requested a trip. I am providing you with the user's request, as well as a list of available packages from our database.

USER REQUEST: "${userRequest}"

AVAILABLE TRAVY DATABASE TRIPS: 
${JSON.stringify(availableTrips)}

YOUR TASK:
1. Select the best matching trip from the AVAILABLE DATABASE TRIPS.
2. Generate a custom, engaging day-by-day itinerary based on that trip.
3. Generate search links for transportation based on the user's origin.

OUTPUT FORMAT: You must return strictly valid JSON in this format:
{
  "recommended_trip_id": "uuid-of-the-trip",
  "agency_name": "Name of the agency",
  "itinerary": [
    { "day": 1, "title": "Arrival", "description": "..." }
  ],
  "transportation": {
    "train_link": "https://www.makemytrip.com/railways/kolkata-siliguri-train-tickets.html",
    "flight_link": "https://www.google.com/travel/flights?q=Kolkata+to+Bagdogra",
    "irctc_portal": "https://www.irctc.co.in/"
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
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
