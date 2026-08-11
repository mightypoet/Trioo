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
      const { userRequest, availableTrips, originCity } = req.body;

      if (!userRequest || !availableTrips) {
        return res.status(400).json({ error: "Missing userRequest or availableTrips" });
      }

      const prompt = `You are an expert travel planner for the platform Travy. A user has requested a trip. I am providing you with the user's request, as well as a list of available packages from our database.

USER REQUEST: "${userRequest}"
AVAILABLE TRAVY DATABASE TRIPS: ${JSON.stringify(availableTrips)}

YOUR TASK:
USER ORIGIN CONTEXT: The user's current detected location is '${originCity || "Unknown"}'. If the user's prompt does not explicitly state where they are traveling FROM, you MUST assume they are departing from '${originCity || "Unknown"}'. Use this origin city to accurately generate the transportation search links (Flights and Trains) to the selected package destination.

1. Select the best matching trip from the AVAILABLE DATABASE TRIPS.
CRITICAL DESTINATION MATCHING: Analyze the user's prompt to identify the exact destination they are requesting. You MUST select a base trip from the provided DATABASE TRIPS where the destination geographically matches the user's request. Do NOT recommend a package for a completely different state or region (e.g., do not recommend Tripura if the user asked for Meghalaya). Only fallback to a different region if absolutely no logical match exists.
2. Generate a custom, engaging day-by-day itinerary based on that trip. Ensure you provide highly detailed, precise, and interactive data.
3. Generate search links for transportation based on the user's origin.

Based on the user's origin city and the package's destination city, you must generate real, clickable search URLs for transportation. Replace spaces with '+' in city names.
- For flights: Use Google Flights. Format: https://www.google.com/travel/flights?q=Flights+from+[ORIGIN]+to+[DESTINATION]
- For trains: Use MakeMyTrip. Format: https://www.makemytrip.com/railways/
- For IRCTC: Just return https://www.irctc.co.in/nget/train-search

OUTPUT FORMAT: You must return strictly valid JSON in this format. Ensure these three links are always populated in the transportation object:
{
  "recommended_trip_id": "uuid-of-the-trip",
  "agency_name": "Name of the agency",
  "itinerary": [
    { 
      "day": 1, 
      "title": "Arrival", 
      "description": "Overview of the day...",
      "spots": [
        {
          "spotName": "Exact name of the destination/attraction",
          "spotMapUrl": "https://www.google.com/maps/search/?api=1&query=EXACT_SPOT_NAME+LOCATION",
          "description": "Concise overview of activities and recommended stay duration.",
          "transitToNext": {
            "travelMode": "Driving",
            "estimatedDuration": "35 mins",
            "estimatedFare": "₹150 (Auto)",
            "routeMapUrl": "https://www.google.com/maps/dir/?api=1&origin=ORIGIN_SPOT&destination=DESTINATION_SPOT&travelmode=driving"
          }
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": "₹2000/night (Total: ₹4000)",
    "localTransport": "₹1500",
    "foodAndDining": "₹1000/day",
    "entryFeesAndActivities": "₹500",
    "miscellaneous": "₹1000",
    "totalEstimatedCost": "₹8000"
  },
  "transportation": {
    "train_link": "https://www.makemytrip.com/railways/",
    "flight_link": "https://www.google.com/travel/flights?q=...",
    "irctc_portal": "https://www.irctc.co.in/nget/train-search"
  }
}`;

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
